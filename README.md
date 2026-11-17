# Demo Day Recap

Recap page for Demo Day (12 November 2026, The Stack, Amsterdam) — AdamI × Devleaps.
Built with Vite + React + TypeScript from the "Demo Day Recap v2 (werkversie)" design.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Filling in content

- **Demos, summaries and takeaways:** `src/data/demos.ts`. Empty `summary` / `takeaways` show a placeholder.
- **Photos and aftermovie switches:** `src/config.ts` (`photosLive`, `movieLive`, `movieDate`).
- **Photographer credit:** `src/components/Evening.tsx` (`[fotograaf]`).

## Structure

- `src/styles/tokens.css` — AdamI design-system tokens (from the design export)
- `src/styles/app.css` — page styles, campaign palette (paper `#F2E7D5`, red `#F2464B`)
- `src/components/` — Hero, Evening (01), DemoList (02), Contact (03), Footer

## Not wired up yet

- The contact form only shows the "Ontvangen" state; it does not send anywhere (see the TODO in `Contact.tsx`).
- The aftermovie play button and photo tiles are placeholders until real media is added.
