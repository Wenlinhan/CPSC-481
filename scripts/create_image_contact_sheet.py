"""Create a labeled contact sheet for visual inspection of source media."""

from __future__ import annotations

import argparse
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--columns", type=int, default=4)
    parser.add_argument("--cell-width", type=int, default=420)
    parser.add_argument("--cell-height", type=int, default=330)
    args = parser.parse_args()

    files = sorted(
        (
            path for path in args.source.iterdir()
            if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".tif", ".tiff", ".bmp"}
        ),
        key=lambda path: (
            int(path.stem.removeprefix("image"))
            if path.stem.removeprefix("image").isdigit()
            else 10_000,
            path.name.lower(),
        ),
    )
    if not files:
        raise SystemExit(f"No raster images found in {args.source}")

    columns = max(1, args.columns)
    rows = math.ceil(len(files) / columns)
    label_height = 34
    sheet = Image.new(
        "RGB",
        (columns * args.cell_width, rows * args.cell_height),
        "#e8edf5",
    )
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=18)

    for index, path in enumerate(files):
        column = index % columns
        row = index // columns
        left = column * args.cell_width
        top = row * args.cell_height
        draw.rounded_rectangle(
            (
                left + 8,
                top + 8,
                left + args.cell_width - 8,
                top + args.cell_height - 8,
            ),
            radius=16,
            fill="white",
            outline="#c9d3e2",
            width=2,
        )
        with Image.open(path) as source:
            image = source.convert("RGB")
            image.thumbnail(
                (
                    args.cell_width - 34,
                    args.cell_height - label_height - 34,
                ),
                Image.Resampling.LANCZOS,
            )
            image_left = left + (args.cell_width - image.width) // 2
            image_top = top + 18 + (
                args.cell_height - label_height - 34 - image.height
            ) // 2
            sheet.paste(image, (image_left, image_top))
        draw.text(
            (left + 18, top + args.cell_height - label_height - 8),
            path.name,
            fill="#111827",
            font=font,
        )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(args.output, quality=92)
    print(args.output.resolve())


if __name__ == "__main__":
    main()
