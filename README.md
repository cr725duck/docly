# DOCly — Frontend

"Every document. One simple toolbox."

A free, open-source (MIT) PDF toolbox frontend, built with **React 18 + TypeScript + Vite + React Router**. No UI framework — a hand-crafted design system in plain CSS.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
```

## Architecture

```
src/
  data/
    tools.ts              # Central tool registry (45 tools, 12 categories, keywords, flags)
    workspace-config.ts   # Per-tool workspace options (compress levels, rotate, watermark, ...)
  lib/
    api.ts                # Backend boundary: POST /api/tools/{slug}, GET /api/jobs/{id}, GET /api/files/{id}
                          # + a simulated job driver used until the Python backend exists
    theme.ts              # Light / Dark / System theme with persistence
    format.ts             # File size, page estimation, PDF validation, 100 MB limit
  components/             # Header, MegaMenu, Footer, SearchBar, CategoryTabs, ToolCard/Grid,
                          # UploadZone, FileList (drag reorder), ToolOptions, ProcessingState,
                          # PDFPreview, Modal, Toast, icons (custom SVG set)
  pages/                  # Home, AllTools, ToolPage (upload → options → processing → result),
                          # Pricing, Login/Register, Settings, 404
  styles/                 # tokens.css (design tokens, both themes), base.css, components.css
```

## Deploy to Render

The frontend is a static site — deploy it on Render with the included blueprint (`render.yaml`):

- **Build command:** `npm ci && npm run build`
- **Publish directory:** `dist`
- **SPA routing:** `public/_redirects` (`/* /index.html 200`) and the rewrite in `render.yaml` make deep links like `/tools/merge-pdf` work.

Steps:
1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, pick the repo — `render.yaml` configures everything (caching for hashed assets, SPA rewrite, PR previews).
3. (When the Python backend exists) deploy it as a second Render web service and set the frontend env var `VITE_API_BASE` to its URL, e.g. `https://docly-api.onrender.com`. Until then the UI runs fully client-side with the simulated job driver.

## Backend boundary

The frontend never fakes PDF processing. All tool runs go through `src/lib/api.ts`:

- `POST /api/tools/{toolSlug}` — start a job (multipart: files + options JSON) → `{ jobId }`
- `GET /api/jobs/{jobId}` — `{ state, progress, stage, resultFileId, error }`
- `GET /api/files/{fileId}` — download the result

Until the backend is connected, a clearly-marked simulated job driver drives the processing UI.

## Adding a tool

Append one object to `TOOLS` in `src/data/tools.ts` (slug, name, description, category, icon, keywords, flags). Cards, search, category filters, mega menu and routing all render from the registry — no duplicated markup. Workspace options for known tools live in `workspace-config.ts`.

## Design system

- Inter with system fallback; 4–80 px spacing scale; 6/10/14 px radii
- One brand accent (indigo) + per-category icon tints used sparingly
- Full dark mode with surface hierarchy (bg → surface → raised), never pure black
- Respect `prefers-reduced-motion`, semantic HTML, keyboard navigation, ARIA throughout
