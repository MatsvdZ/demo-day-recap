# Demo Day Recap

Recap page for Demo Day (12 November 2026, The Stack, Amsterdam) — AdamI × Devleaps.
Built with Vite + React + TypeScript from the "Demo Day Recap v2 (werkversie)" design.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

## Publishing

Every push to `main` builds the site and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`): https://matsvanderzwan.github.io/demo-day-recap/
One-time setting: repo Settings → Pages → Build and deployment → Source = **GitHub Actions**.

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

Submissions are emailed via [Web3Forms](https://web3forms.com) to the inbox that the access key in
`src/config.ts` (`form.accessKey`) was created for. The key is meant to be public; it can only send to
that inbox.

## Not wired up yet

- The aftermovie play button and photo tiles are placeholders until real media is added.
