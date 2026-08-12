# History of LLMs

An interactive, continuously-updatable reference tracking large language
models from the 2017 Transformer paper through today's frontier releases —
built as a multi-page site with a dedicated detail page per model, a
scrollable era-coded timeline, and log-scale growth charts for context
window and parameter count.

## Stack

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript
- [React Router](https://reactrouter.com) for client-side routing
- [Tailwind CSS v4](https://tailwindcss.com) for styling, with a light/dark theme toggle

## Pages

- `/` — hero, stats, timeline preview, eras, latest releases
- `/timeline` — full interactive timeline with era filters and a list/table view
- `/models` — searchable, filterable grid of every model
- `/models/:slug` — a detail page per model (specs, significance, lineage, prev/next)
- `/growth` — context window and parameter count growth, log scale
- `/about` — project background, era descriptions, and a note on data sources

## Development

```sh
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run preview  # preview the production build locally
npm run lint      # oxlint
```

## Data

All model data lives in `src/data/models.ts` (one object per model) and
`src/data/eras.ts` (the seven era groupings). Adding a new model is a matter
of appending an entry to `MODELS` — prev/next navigation, family lineage, and
both charts are derived automatically from `src/data/derive.ts`.

## Deployment

This is a static single-page app. Any static host works, as long as it
rewrites unknown paths to `index.html` so client-side routes like
`/models/gpt-4` resolve on a direct load or refresh — see `vercel.json` and
`public/_redirects` (Netlify) for ready-made configs.
