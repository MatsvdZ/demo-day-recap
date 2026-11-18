import { useCallback, useEffect, useRef, useState } from "react";
import { Lightbox, type LightboxPhoto } from "./Lightbox";
import { reducedMotion } from "../lib/motion";

const small = import.meta.glob<string>("../assets/photos/*.webp", { eager: true, import: "default" });
const large = import.meta.glob<string>("../assets/photos/large/*.jpg", { eager: true, import: "default" });

/** The eight shown straight away, in this order. The rest appear behind "Zie meer". */
const FEATURED = ["11", "08", "07", "28", "19", "18", "10", "29"];

const numbers = Object.keys(small)
  .sort()
  .map((path) => path.match(/demo-day-(\d+)\.webp$/)![1]);
const toPhoto = (n: string): LightboxPhoto => ({
  n,
  small: small[`../assets/photos/demo-day-${n}.webp`],
  large: large[`../assets/photos/large/demo-day-${n}.jpg`],
});
const featured = FEATURED.filter((n) => numbers.includes(n)).map(toPhoto);
const rest = numbers.filter((n) => !FEATURED.includes(n)).map(toPhoto);
/** Lightbox order: what you see on the page, top to bottom. */
const ordered = [...featured, ...rest];

/** How long the "Zie meer" panel takes to open or close (matches the CSS). */
const MORE_MS = 700;

type MoreState = "closed" | "mounting" | "opening" | "open" | "closing";

function Thumb({ photo, index, onOpen }: { photo: LightboxPhoto; index: number; onOpen: (i: number) => void }) {
  return (
    <figure className="photo photo--live" data-photo={photo.n}>
      <button type="button" className="photo__btn" onClick={() => onOpen(index)} aria-label={`Bekijk foto ${index + 1} groot`}>
        <img src={photo.small} alt="" loading="lazy" decoding="async" />
        <span className="photo__zoom" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </figure>
  );
}

export function Photos() {
  const [more, setMore] = useState<MoreState>("closed");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();

  const toggleMore = () => {
    window.clearTimeout(timer.current);
    const still = reducedMotion();
    const settleTo = (next: MoreState) => {
      timer.current = window.setTimeout(() => setMore(next), still ? 0 : MORE_MS);
    };
    if (more === "closed") {
      if (still) return setMore("open");
      // Mount collapsed first, then switch to "opening" so the CSS transition has a start point.
      setMore("mounting");
      const begin = () => setMore((m) => (m === "mounting" ? "opening" : m));
      requestAnimationFrame(() => requestAnimationFrame(begin));
      window.setTimeout(begin, 60); // in case animation frames are paused
      settleTo("open");
    } else if (more === "closing") {
      setMore("opening");
      settleTo("open");
    } else {
      setMore("closing");
      // Keep the button in sight: the page above it is about to shrink.
      const top = root.current!.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top) window.scrollTo({ top, behavior: still ? "auto" : "smooth" });
      settleTo("closed");
    }
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const thumbFor = useCallback(
    (n: string) => root.current?.querySelector<HTMLElement>(`[data-photo="${n}"]`) ?? null,
    [],
  );
  const onClosed = useCallback(
    (n: string) => {
      setLightbox(null);
      thumbFor(n)?.querySelector<HTMLElement>(".photo__btn")?.focus({ preventScroll: true });
    },
    [thumbFor],
  );

  const mounted = more !== "closed";
  const expanded = more === "mounting" || more === "opening" || more === "open";

  return (
    <div className="gallery" ref={root}>
      <div className="photos">
        {featured.map((p, i) => (
          <Thumb key={p.n} photo={p} index={i} onOpen={setLightbox} />
        ))}
      </div>

      {rest.length > 0 && (
        <>
          <div className="photos-more" data-state={more} aria-hidden={!expanded}>
            <div className="photos-more__clip">
              {mounted && (
                <div className="photos photos-more__grid">
                  {rest.map((p, i) => (
                    <div key={p.n} className="photos-more__item" style={{ ["--i" as string]: Math.min(i, 15) }}>
                      <Thumb photo={p} index={featured.length + i} onOpen={setLightbox} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="photos__more">
            <button type="button" className="more-btn" aria-expanded={expanded} onClick={toggleMore}>
              <span>{expanded ? "Minder foto's" : `Zie meer · nog ${rest.length} foto's`}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </>
      )}

      {lightbox !== null && <Lightbox photos={ordered} start={lightbox} thumbFor={thumbFor} onClosed={onClosed} />}
    </div>
  );
}
