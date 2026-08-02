"""Extract page text and optional PNG renders from a PDF source deck."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import pdfplumber
import pypdfium2 as pdfium


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--render-dir", type=Path)
    parser.add_argument("--scale", type=float, default=1.5)
    args = parser.parse_args()

    pages: list[dict[str, object]] = []
    with pdfplumber.open(args.pdf) as document:
        for number, page in enumerate(document.pages, start=1):
            pages.append({
                "number": number,
                "width": page.width,
                "height": page.height,
                "text": page.extract_text(x_tolerance=2, y_tolerance=2) or "",
            })

    if args.render_dir:
        args.render_dir.mkdir(parents=True, exist_ok=True)
        document = pdfium.PdfDocument(str(args.pdf))
        for index, page in enumerate(document, start=1):
            image = page.render(scale=args.scale).to_pil()
            output = args.render_dir / f"slide-{index:02d}.png"
            image.save(output)
            pages[index - 1]["render"] = output.as_posix()

    content = args.pdf.read_bytes()
    result = {
        "source": args.pdf.name,
        "sourceSha256": hashlib.sha256(content).hexdigest(),
        "pageCount": len(pages),
        "pages": pages,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
