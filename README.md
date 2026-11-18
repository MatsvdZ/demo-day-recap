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

The site is hosted on Cloudflare (Workers & Pages), connected to this repo: every push to `main`
builds it with `npm run build` and serves `dist/`. Build settings live in the Cloudflare dashboard.
Single files there are limited to 25 MiB, so keep videos under that.

## Filling in content

- **Demos, summaries and takeaways:** `src/data/demos.ts`, filled from the Podium A and B decks. Empty `summary` / `takeaways` show a placeholder.
  Clicking a demo opens an animated pop-up (`src/components/DemoModal.tsx`) with these.
- **Speaker photos:** add a square image as `src/assets/speakers/<slug>.webp` and set `photo: photo("<slug>")`
  on the demo. Without a photo the pop-up shows the speaker's initials. All 16 speakers have a photo.
- **Photos and aftermovie switches:** `src/config.ts` (`photosLive`, `movieLive`, `movieDate`).
- **Event photos:** `src/assets/photos/demo-day-NN.webp` (grid, 640px short side) and
  `src/assets/photos/large/demo-day-NN.jpg` (lightbox + download, 2400px). Sizes for the lightbox are in
  `src/data/photoSizes.ts`; the first eight shown are `FEATURED` in `src/components/Photos.tsx`.
- **Aftermovie:** `src/assets/movie/` (poster plus 720p and 1080p MP4), played by `src/components/Movie.tsx`.
- **Photographer credit:** `src/components/Evening.tsx`.

## Structure

- `src/styles/tokens.css` — AdamI design-system tokens (from the design export)
- `src/styles/app.css` — page styles, campaign palette (paper `#F2E7D5`, red `#F2464B`)
- `src/components/` — Hero, Evening (01, with Movie, Photos and Lightbox), DemoList (02), Contact (03), Footer

## Contact form

Submissions are emailed via [Web3Forms](https://web3forms.com) to the inbox that the access key in
`src/config.ts` (`form.accessKey`) was created for. The key is meant to be public; it can only send to
that inbox.
