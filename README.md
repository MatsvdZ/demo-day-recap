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

- **Demos, summaries and takeaways:** `src/data/demos.ts`, filled from the Podium A and B decks. Empty `summary` / `takeaways` show a placeholder.
  Clicking a demo opens an animated pop-up (`src/components/DemoModal.tsx`) with these.
- **Speaker photos:** add a square image as `src/assets/speakers/<slug>.webp` and set `photo: photo("<slug>")`
  on the demo. Without a photo the pop-up shows the speaker's initials. All 16 speakers have a photo.
- **Photos and aftermovie switches:** `src/config.ts` (`photosLive`, `movieLive`, `movieDate`).
- **Photographer credit:** `src/components/Evening.tsx` (`[fotograaf]`).

## Structure

- `src/styles/tokens.css` — AdamI design-system tokens (from the design export)
- `src/styles/app.css` — page styles, campaign palette (paper `#F2E7D5`, red `#F2464B`)
- `src/components/` — Hero, Evening (01), DemoList (02), Contact (03), Footer

## Contact form

Submissions are emailed via [FormSubmit](https://formsubmit.co) to the address in `formEndpoint`
(`src/config.ts`). The very first submission sends a one-time activation email to that address;
nothing is delivered until it's confirmed. After activating, you can swap the address in
`formEndpoint` for the random alias FormSubmit gives you, so the address isn't in the page source.

## Not wired up yet

- The aftermovie play button and photo tiles are placeholders until real media is added.
