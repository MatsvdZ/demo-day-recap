import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { photoSizes } from "../data/photoSizes";
import { EASE, reducedMotion, settle } from "../lib/motion";

export type LightboxPhoto = { n: string; small: string; large: string };

type Props = {
  photos: LightboxPhoto[];
  start: number;
  /** Finds the thumbnail for a photo, so the image can grow out of it and shrink back into it. */
  thumbFor: (n: string) => HTMLElement | null;
  onClosed: (n: string) => void;
};

const OPEN_MS = 560;
const CLOSE_MS = 380;
const THUMB_RADIUS = 14;
/** Thumbnails crop with object-position 50% 30%; mirror that so the zoom lines up. */
const THUMB_FOCUS_Y = 0.3;

/**
 * Keyframe from a thumbnail to the full stage: uniform scale plus a clip that shows
 * exactly the cropped part the thumbnail shows, so nothing stretches.
 */
function fromThumb(stage: DOMRect, thumb: DOMRect) {
  const s = Math.max(thumb.width / stage.width, thumb.height / stage.height);
  const vw = thumb.width / s;
  const vh = thumb.height / s;
  const x0 = (stage.width - vw) / 2;
  const y0 = (stage.height - vh) * THUMB_FOCUS_Y;
  const tx = thumb.left + thumb.width / 2 - stage.left - (x0 + vw / 2) * s;
  const ty = thumb.top + thumb.height / 2 - stage.top - (y0 + vh / 2) * s;
  const r = THUMB_RADIUS / s;
  return {
    transform: `translate(${tx}px, ${ty}px) scale(${s})`,
    clipPath: `inset(${y0}px ${stage.width - x0 - vw}px ${stage.height - y0 - vh}px ${x0}px round ${r}px)`,
  };
}

const inView = (el: HTMLElement | null) => {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
};

export function Lightbox({ photos, start, thumbFor, onClosed }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(start);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<"opening" | "open" | "closing">("opening");
  const closing = useRef(false);
  const touchX = useRef<number | null>(null);

  const photo = photos[index];
  const [w, h] = photoSizes[photo.n] ?? [3, 2];

  // Open: grow the image out of the clicked thumbnail.
  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    const stage = stageRef.current!;
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add("modal-open");

    backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: "ease-out" });
    const thumb = thumbFor(photos[start].n);
    const anim =
      reducedMotion() || !inView(thumb)
        ? stage.animate([{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }], {
            duration: 260,
            easing: "ease-out",
          })
        : stage.animate(
            [
              { ...fromThumb(stage.getBoundingClientRect(), thumb!.getBoundingClientRect()), transformOrigin: "0 0" },
              { transform: "none", clipPath: "inset(0px 0px 0px 0px round 16px)", transformOrigin: "0 0" },
            ],
            { duration: OPEN_MS, easing: EASE },
          );
    const cancel = settle(anim, OPEN_MS, () => setState("open"));
    return () => {
      cancel();
      document.documentElement.classList.remove("modal-open");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setState("closing");
    const stage = stageRef.current!;
    const n = photos[index].n;
    const thumb = thumbFor(n);
    backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS, easing: "ease-in", fill: "forwards" });
    const anim =
      reducedMotion() || !inView(thumb)
        ? stage.animate([{ opacity: 1 }, { opacity: 0, transform: "scale(0.96)" }], {
            duration: 220,
            easing: "ease-in",
            fill: "forwards",
          })
        : stage.animate(
            [
              { transform: "none", clipPath: "inset(0px 0px 0px 0px round 16px)", transformOrigin: "0 0" },
              { ...fromThumb(stage.getBoundingClientRect(), thumb!.getBoundingClientRect()), transformOrigin: "0 0" },
            ],
            { duration: CLOSE_MS, easing: EASE, fill: "forwards" },
          );
    settle(anim, CLOSE_MS, () => {
      dialogRef.current?.close();
      onClosed(n);
    });
  }, [index, photos, thumbFor, onClosed]);

  const go = useCallback(
    (step: number) => {
      if (closing.current) return;
      setIndex((i) => (i + step + photos.length) % photos.length);
    },
    [photos.length],
  );

  // Slide the new photo in from the side it came from.
  const lastIndex = useRef(index);
  useEffect(() => {
    const prev = lastIndex.current;
    lastIndex.current = index;
    if (prev === index || reducedMotion()) return;
    const forward = (index - prev + photos.length) % photos.length === 1;
    stageRef.current?.animate(
      [
        { opacity: 0, transform: `translateX(${forward ? 40 : -40}px)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: 320, easing: EASE },
    );
  }, [index, photos.length]);

  // Keyboard: arrows to browse, Escape closes with the animation.
  useEffect(() => {
    const dialog = dialogRef.current!;
    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("keydown", onKey);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("keydown", onKey);
    };
  }, [close, go]);

  // Warm up the neighbours so browsing feels instant.
  useEffect(() => {
    for (const step of [1, -1]) {
      const p = photos[(index + step + photos.length) % photos.length];
      const img = new Image();
      img.src = p.large;
    }
  }, [index, photos]);

  return (
    <dialog
      ref={dialogRef}
      className="lb"
      data-state={state}
      aria-label={`Foto ${index + 1} van ${photos.length}`}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <div ref={backdropRef} className="lb__backdrop" onClick={close} />

      <div className="lb__bar">
        <span className="lb__count">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <div className="lb__actions">
          <a className="lb__btn lb__btn--download" href={photo.large} download={`demo-day-${photo.n}.jpg`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <path d="M12 4v11m0 0l-5-5m5 5l5-5M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Download</span>
          </a>
          <button type="button" className="lb__btn lb__btn--icon" onClick={close} aria-label="Sluiten" autoFocus>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        className="lb__stage"
        style={{ aspectRatio: `${w} / ${h}`, ["--ratio" as string]: w / h }}
      >
        <img className="lb__img lb__img--small" src={photo.small} alt="" aria-hidden="true" />
        <img
          key={photo.n}
          className="lb__img lb__img--large"
          data-loaded={loaded[photo.n] ? "" : undefined}
          src={photo.large}
          alt={`Sfeerfoto van Demo Day, foto ${index + 1}`}
          onLoad={() => setLoaded((l) => ({ ...l, [photo.n]: true }))}
        />
      </div>

      <button type="button" className="lb__nav lb__nav--prev" onClick={() => go(-1)} aria-label="Vorige foto">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className="lb__nav lb__nav--next" onClick={() => go(1)} aria-label="Volgende foto">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </dialog>
  );
}
