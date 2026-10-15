# Cryptic Coder — starter website

A responsive React + TypeScript prototype for a game-based coding academy for children aged 7–13.

## Included in this first build

- Home page with the Cryptic Coder brand and adventure-style design
- Three introductory lessons: algorithms, code, and input/process/output
- Five starter missions: addition, subtraction, multiplication, division, and number comparison
- Guided algorithm builder with reorder controls
- Editable Python-looking code editor, hints, output panel, and test-stage flow
- Progress page, mission log, and badges
- Responsive layout for desktop, tablet, and mobile
- Local browser progress using `localStorage`

## Important prototype note

The code panel currently uses a **guided exercise runner** for the five starter mission patterns. It does not execute arbitrary Python. That is intentional for this first UI prototype. Before sharing it widely with children, the next development step should be a real, isolated Python runtime (for example, Pyodide in a dedicated Web Worker with a timeout) and more complete test-case validation.

## Run locally

Install Node.js (LTS) first, then in this folder run:

```bash
npm install
npm run dev
```

Vite will print a local address, usually `http://localhost:5173`. Open it in your browser.

To make a production build:

```bash
npm run build
npm run preview
```

## Deploy and share

This is a Vite static site and can be deployed to a static hosting service such as Netlify, Vercel, or GitHub Pages. For the simplest route, import the project folder/repository into Netlify or Vercel and use:

- Build command: `npm run build`
- Publish/output directory: `dist`

The project is not online yet. A public shareable URL is created only after you deploy it.

## Suggested next build milestones

1. Add actual Python execution in an isolated Web Worker with execution time limits.
2. Make test inputs editable and validate outputs against the selected test case.
3. Add accessibility and child-safety review, including clear privacy information.
4. Add optional age modes: Junior (7–9) and Senior (10–13).
5. Add a parent/teacher progress view only if needed.
