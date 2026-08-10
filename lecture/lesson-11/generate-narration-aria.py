import argparse
import asyncio
import json
import os
import pathlib
import subprocess

import edge_tts


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--script", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--ffmpeg", required=True)
    parser.add_argument("--concurrency", type=int, default=3)
    parser.add_argument("--force", action="store_true", help="Regenerate every narration segment even when cached files exist.")
    return parser.parse_args()


async def synthesize_segment(semaphore, text, voice, rate, mp3_path, words_path):
    async with semaphore:
        for attempt in range(1, 5):
            try:
                communicate = edge_tts.Communicate(text=text, voice=voice, rate=rate, boundary="WordBoundary")
                temp_path = mp3_path.with_suffix(".mp3.tmp")
                boundaries = []
                with temp_path.open("wb") as audio_file:
                    async for chunk in communicate.stream():
                        if chunk["type"] == "audio":
                            audio_file.write(chunk["data"])
                        elif chunk["type"] == "WordBoundary":
                            boundaries.append({
                                "text": chunk["text"],
                                "offsetSeconds": chunk["offset"] / 10_000_000,
                                "durationSeconds": chunk["duration"] / 10_000_000,
                            })
                temp_path.replace(mp3_path)
                if mp3_path.stat().st_size > 1000:
                    if not boundaries:
                        raise RuntimeError("Neural narration returned no word boundaries.")
                    words_path.write_text(json.dumps(boundaries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                    return
                raise RuntimeError("Neural narration file was unexpectedly small.")
            except Exception:
                temp_path = mp3_path.with_suffix(".mp3.tmp")
                if temp_path.exists():
                    temp_path.unlink()
                if attempt == 4:
                    raise
                await asyncio.sleep(attempt * 1.5)


async def main():
    args = parse_args()
    script_path = pathlib.Path(args.script).resolve()
    output_dir = pathlib.Path(args.output).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    script = json.loads(script_path.read_text(encoding="utf-8"))
    voice = script["voice"]["engineVoice"]
    rate = script["voice"]["edgeTtsRate"]
    semaphore = asyncio.Semaphore(args.concurrency)
    jobs = []
    media = []

    for slide in script["slides"]:
        for segment_index, segment in enumerate(slide["segments"], start=1):
            stem = f"slide-{int(slide['number']):02d}-segment-{segment_index:02d}"
            mp3_path = output_dir / f"{stem}.mp3"
            wav_path = output_dir / f"{stem}.wav"
            words_path = output_dir / f"{stem}.words.json"
            media.append((mp3_path, wav_path, words_path))
            if args.force or not mp3_path.exists() or mp3_path.stat().st_size < 1000 or not words_path.exists():
                jobs.append(synthesize_segment(semaphore, segment["text"], voice, rate, mp3_path, words_path))

    if jobs:
        print(f"Generating {len(jobs)} Aria Neural narration segments at {rate}...")
        await asyncio.gather(*jobs)

    for index, (mp3_path, wav_path, words_path) in enumerate(media, start=1):
        if not wav_path.exists() or wav_path.stat().st_mtime < mp3_path.stat().st_mtime:
            subprocess.run(
                [args.ffmpeg, "-y", "-loglevel", "error", "-i", str(mp3_path), "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", str(wav_path)],
                check=True,
            )
        if index % 20 == 0 or index == len(media):
            print(f"Prepared {index}/{len(media)} narration segments.")

    manifest = {
        "voice": voice,
        "rate": rate,
        "speakingRate": script["voice"]["speakingRate"],
        "segments": len(media),
        "format": "24000 Hz mono PCM WAV",
        "alignment": "Microsoft neural WordBoundary timestamps",
    }
    (output_dir / "aria-audio-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
