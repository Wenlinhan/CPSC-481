# CPSC 481: Introduction to Artificial Intelligence

Source code for the interactive CPSC 481 course website:

https://cpsc481-introduction-to-ai.winniechef.chatgpt.site/

The site contains interactive lesson decks, examples, demonstrations, practice activities, instructor notes, and supporting assets.

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and run the course-site test suite with `npm test`.

## Project structure

- `app/` — React/Vinext routes, lesson decks, and styles
- `public/` — course images, source-derived media, and downloadable assets
- `scripts/` — publication, Canvas, PDF, and validation utilities
- `tests/` — rendered-content and source-coverage tests
- `.openai/hosting.json` — ChatGPT Sites project configuration

## Deployment

The production website is deployed through ChatGPT Sites. The tracked hosting manifest identifies the existing course-site project; do not replace its project ID when publishing updates.
