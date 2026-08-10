from pathlib import Path
import sys

from pypdf import PdfReader, PdfWriter


def main() -> None:
    if len(sys.argv) < 4 or "--output" not in sys.argv:
        raise SystemExit("Usage: merge_pdfs.py input.pdf [...] --output merged.pdf")
    marker = sys.argv.index("--output")
    inputs = [Path(value) for value in sys.argv[1:marker]]
    output = Path(sys.argv[marker + 1])
    if not inputs:
        raise SystemExit("At least one input PDF is required")
    writer = PdfWriter()
    for source in inputs:
        for page in PdfReader(str(source)).pages:
            writer.add_page(page)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("wb") as stream:
        writer.write(stream)


if __name__ == "__main__":
    main()
