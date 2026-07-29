"""Print paragraph and table text from instructor-owned DOCX source files."""

from __future__ import annotations

import sys
from pathlib import Path

from docx import Document


def main() -> None:
    for name in sys.argv[1:]:
        path = Path(name)
        document = Document(path)
        print(f"\n### {path.name}")
        print(f"paragraphs={len(document.paragraphs)} tables={len(document.tables)}")

        for index, paragraph in enumerate(document.paragraphs, start=1):
            text = " ".join(paragraph.text.split())
            if text:
                print(f"P{index}: {text}")

        for table_index, table in enumerate(document.tables, start=1):
            print(f"TABLE {table_index} {len(table.rows)}x{len(table.columns)}")
            for row_index, row in enumerate(table.rows, start=1):
                cells = [" ".join(cell.text.split()) for cell in row.cells]
                print(f"R{row_index}: {' | '.join(cells)}")


if __name__ == "__main__":
    main()
