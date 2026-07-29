"""Extract a source-fidelity inventory from a PowerPoint deck.

The course uses historical PowerPoint files as authoritative instructional
sources. This helper reports slide text, notes, embedded media, relationships,
and timing metadata without modifying the deck.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import posixpath
import zipfile
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

from PIL import Image
from pptx import Presentation


REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
DRAWING_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
PRESENTATION_NS = "http://schemas.openxmlformats.org/presentationml/2006/main"


def normalized_target(base: str, target: str) -> str:
    return posixpath.normpath(posixpath.join(posixpath.dirname(base), target))


def relationship_map(archive: zipfile.ZipFile, rel_path: str) -> dict[str, str]:
    if rel_path not in archive.namelist():
        return {}
    root = ET.fromstring(archive.read(rel_path))
    return {
        node.attrib["Id"]: node.attrib["Target"]
        for node in root.findall(f"{{{REL_NS}}}Relationship")
        if "Id" in node.attrib and "Target" in node.attrib
    }


def media_metadata(name: str, content: bytes) -> dict[str, Any]:
    result: dict[str, Any] = {
        "file": Path(name).name,
        "archivePath": name,
        "bytes": len(content),
        "sha256": hashlib.sha256(content).hexdigest(),
    }
    try:
        with Image.open(io.BytesIO(content)) as image:
            result["width"] = image.width
            result["height"] = image.height
            result["format"] = image.format
    except Exception:
        result["format"] = Path(name).suffix.lstrip(".").upper() or "unknown"
    return result


def notes_text(
    archive: zipfile.ZipFile,
    slide_number: int,
) -> str:
    slide_rels = f"ppt/slides/_rels/slide{slide_number}.xml.rels"
    targets = relationship_map(archive, slide_rels)
    notes_target = next(
        (target for target in targets.values() if "notesSlides/" in target),
        None,
    )
    if not notes_target:
        return ""
    notes_path = normalized_target(f"ppt/slides/slide{slide_number}.xml", notes_target)
    if notes_path not in archive.namelist():
        return ""
    root = ET.fromstring(archive.read(notes_path))
    texts = [
        node.text.strip()
        for node in root.findall(f".//{{{DRAWING_NS}}}t")
        if node.text and node.text.strip()
    ]
    filtered = [
        text for text in texts
        if text not in {str(slide_number), "‹#›", "‹date/time›", "‹footer›"}
    ]
    return "\n".join(filtered)


def slide_media(
    archive: zipfile.ZipFile,
    slide_number: int,
) -> list[str]:
    slide_path = f"ppt/slides/slide{slide_number}.xml"
    rel_path = f"ppt/slides/_rels/slide{slide_number}.xml.rels"
    targets = relationship_map(archive, rel_path)
    resolved: list[str] = []
    for target in targets.values():
        candidate = normalized_target(slide_path, target)
        if candidate.startswith("ppt/media/"):
            resolved.append(Path(candidate).name)
    return sorted(set(resolved))


def timing_metadata(archive: zipfile.ZipFile, slide_number: int) -> dict[str, Any]:
    slide_path = f"ppt/slides/slide{slide_number}.xml"
    root = ET.fromstring(archive.read(slide_path))
    timing = root.find(f".//{{{PRESENTATION_NS}}}timing")
    if timing is None:
        return {
            "hasTiming": False,
            "conditionCount": 0,
            "effectCount": 0,
            "clickGroupCount": 0,
            "clickEffectCount": 0,
            "withEffectCount": 0,
            "afterEffectCount": 0,
            "visibilitySetCount": 0,
            "targetShapeIds": [],
        }

    elements = list(timing.iter())

    def local_name(node: ET.Element) -> str:
        return node.tag.rsplit("}", 1)[-1]

    effect_names = {
        "anim",
        "animClr",
        "animEffect",
        "animMotion",
        "animRot",
        "animScale",
        "set",
    }
    return {
        "hasTiming": True,
        "conditionCount": sum(local_name(node) == "cond" for node in elements),
        "effectCount": sum(local_name(node) in effect_names for node in elements),
        "clickGroupCount": sum(
            node.attrib.get("nodeType") == "clickPar" for node in elements
        ),
        "clickEffectCount": sum(
            node.attrib.get("nodeType") == "clickEffect" for node in elements
        ),
        "withEffectCount": sum(
            node.attrib.get("nodeType") == "withEffect" for node in elements
        ),
        "afterEffectCount": sum(
            node.attrib.get("nodeType") == "afterEffect" for node in elements
        ),
        "visibilitySetCount": sum(local_name(node) == "set" for node in elements),
        "targetShapeIds": sorted(
            {
                node.attrib["spid"]
                for node in elements
                if local_name(node) == "spTgt" and "spid" in node.attrib
            },
            key=lambda value: int(value),
        ),
    }


def render_metadata(render_dir: Path | None, slide_number: int) -> dict[str, Any] | None:
    if render_dir is None:
        return None
    render = render_dir / f"slide-{slide_number:02d}.png"
    if not render.exists():
        return None
    content = render.read_bytes()
    with Image.open(io.BytesIO(content)) as image:
        return {
            "file": render.name,
            "path": render.as_posix(),
            "bytes": len(content),
            "sha256": hashlib.sha256(content).hexdigest(),
            "width": image.width,
            "height": image.height,
            "format": image.format,
        }


def inventory(
    path: Path,
    extract_media: Path | None = None,
    render_dir: Path | None = None,
) -> dict[str, Any]:
    presentation = Presentation(path)
    with zipfile.ZipFile(path) as archive:
        if extract_media is not None:
            extract_media.mkdir(parents=True, exist_ok=True)
            for name in archive.namelist():
                if name.startswith("ppt/media/") and not name.endswith("/"):
                    (extract_media / Path(name).name).write_bytes(archive.read(name))
        media = [
            media_metadata(name, archive.read(name))
            for name in sorted(archive.namelist())
            if name.startswith("ppt/media/") and not name.endswith("/")
        ]
        slides = []
        for number, slide in enumerate(presentation.slides, start=1):
            text_blocks = [
                shape.text.strip()
                for shape in slide.shapes
                if hasattr(shape, "text_frame") and shape.text.strip()
            ]
            slide_inventory = {
                "number": number,
                "textBlocks": text_blocks,
                "notes": notes_text(archive, number),
                "media": slide_media(archive, number),
                "timing": timing_metadata(archive, number),
            }
            render = render_metadata(render_dir, number)
            if render is not None:
                slide_inventory["render"] = render
            slides.append(slide_inventory)
    source_content = path.read_bytes()
    return {
        # Public evidence packages should identify the authoritative file
        # without publishing an instructor's local filesystem path.
        "source": path.name,
        "sourceFilename": path.name,
        "sourceSha256": hashlib.sha256(source_content).hexdigest(),
        "slideCount": len(slides),
        "mediaCount": len(media),
        "media": media,
        "slides": slides,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pptx", type=Path)
    parser.add_argument(
        "--compact",
        action="store_true",
        help="Emit compact JSON instead of indented JSON.",
    )
    parser.add_argument(
        "--extract-media",
        type=Path,
        help="Optionally extract the deck's embedded media to this directory.",
    )
    parser.add_argument(
        "--render-dir",
        type=Path,
        help="Optionally attach metadata for slide-NN.png renders in this directory.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Optionally write the JSON inventory to a file instead of stdout.",
    )
    args = parser.parse_args()
    result = inventory(args.pptx, args.extract_media, args.render_dir)
    serialized = json.dumps(
        result,
        ensure_ascii=False,
        separators=(",", ":") if args.compact else None,
        indent=None if args.compact else 2,
    )
    if args.output is not None:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(f"{serialized}\n", encoding="utf-8")
    else:
        print(serialized)


if __name__ == "__main__":
    main()
