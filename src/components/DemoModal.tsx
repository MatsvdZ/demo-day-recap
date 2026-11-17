import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Channel, Demo } from "../data/demos";

type Props = {
  demo: Demo;
  channel: Channel;
  /** The row that was clicked: the panel grows out of it and shrinks back into it. */
  origin: HTMLElement | null;
  isPicked: boolean;
  onTogglePick: () => void;
  onClosed: () => void;
};

const EASE = "cubic-bezier(0.525, 0, 0, 1)"; // --ease-brand
const OPEN_MS = 620;
const CLOSE_MS = 420;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Transform that maps the panel's final box onto the origin row's box. */
function fromRect(panel: DOMRect, origin: DOMRect) {
  const dx = origin.left + origin.width / 2 - (panel.left + panel.width / 2);
  const dy = origin.top + origin.height / 2 - (panel.top + panel.height / 2);
  const sx = origin.width / panel.width;
  const sy = origin.height / panel.height;
  return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
}

/** Run `done` when `anim` finishes, and force it to finish if the browser isn't ticking
 *  animation frames (background tab, paused renderer) so the pop-up never gets stuck. */
function settle(anim: Animation, ms: number, done: () => void) {
  let called = false;
  const once = () => {
    if (called) return;
    called = true;
    done();
  };
  anim.onfinish = once;
  const t = window.setTimeout(() => {
    if (anim.playState !== "finished") anim.finish();
    once();
  }, ms + 150);
  return () => window.clearTimeout(t);
}

const initials = (name: string) =>
  name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export function DemoModal({ demo: d, channel, origin, isPicked, onTogglePick, onClosed }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"opening" | "open" | "closing">("opening");
  const closing = useRef(false);

  // Open: show the dialog, then grow the panel out of the clicked row.
  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    const panel = panelRef.current!;
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add("modal-open");

    const still = reducedMotion() || !origin || window.innerWidth < 640;
    backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out" });
    const anim = still
      ? panel.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], {
          duration: 260,
          easing: "ease-out",
        })
      : panel.animate(
          [
            { transform: fromRect(panel.getBoundingClientRect(), origin!.getBoundingClientRect()), borderRadius: "8px", opacity: 0.6 },
            { opacity: 1, offset: 0.25 },
            { transform: "none", borderRadius: "24px", opacity: 1 },
          ],
          { duration: OPEN_MS, easing: EASE },
        );
    const cancelSettle = settle(anim, still ? 260 : OPEN_MS, () => setState((s) => (s === "opening" ? "open" : s)));
    // The stagger starts while the panel is still settling.
    const t = window.setTimeout(() => setState((s) => (s === "opening" ? "open" : s)), still ? 0 : OPEN_MS * 0.45);
    return () => {
      window.clearTimeout(t);
      cancelSettle();
      anim.cancel();
      document.documentElement.classList.remove("modal-open");
    };
    // Only on mount: switching demos is a fresh mount (keyed by code).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setState("closing");
    const dialog = dialogRef.current!;
    const panel = panelRef.current!;
    const still = reducedMotion() || !origin || window.innerWidth < 640;
    backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS, easing: "ease-in", fill: "forwards" });
    const anim = still
      ? panel.animate([{ opacity: 1 }, { opacity: 0, transform: "translateY(12px)" }], {
          duration: 200,
          easing: "ease-in",
          fill: "forwards",
        })
      : panel.animate(
          [
            { transform: "none", borderRadius: "24px", opacity: 1 },
            { opacity: 1, offset: 0.7 },
            { transform: fromRect(panel.getBoundingClientRect(), origin!.getBoundingClientRect()), borderRadius: "8px", opacity: 0 },
          ],
          { duration: CLOSE_MS, easing: "cubic-bezier(0.6, 0, 0.8, 0.2)", fill: "forwards" },
        );
    settle(anim, still ? 200 : CLOSE_MS, () => {
      dialog.close();
      // Hand focus back to the row that opened the pop-up.
      origin?.querySelector<HTMLElement>(".demo__toggle")?.focus({ preventScroll: true });
      onClosed();
    });
  }, [origin, onClosed]);

  // Escape: animate out instead of the dialog's instant close.
  useEffect(() => {
    const dialog = dialogRef.current!;
    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [close]);

  const titleId = `demo-modal-title-${d.code}`;

  return (
    <dialog
      ref={dialogRef}
      className="dm"
      aria-labelledby={titleId}
      data-state={state}
      style={{ "--code-color": channel.codeColor } as React.CSSProperties}
    >
      <div ref={backdropRef} className="dm__backdrop" onClick={close} aria-hidden="true" />

      <div ref={panelRef} className="dm__panel">
        <div className={`dm__head tile${channel.id === "A" ? " tile--red" : ""}`}>
          <span className="dm__code" aria-hidden="true">
            {d.code}
          </span>
          <span className="dm__channel">
            {channel.name.replace(".", "").toUpperCase()} · {d.sector.toUpperCase()}
          </span>
          <button type="button" className="dm__close" onClick={close} aria-label="Sluiten">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="dm__body">
          <div className="dm__intro">
            <figure className="dm__photo" style={{ "--i": 0 } as React.CSSProperties}>
              {d.photo ? (
                <img src={d.photo} alt={`Portret van ${d.speaker}`} />
              ) : (
                <span className="dm__initials tile" aria-label={d.speaker} role="img">
                  {initials(d.speaker)}
                </span>
              )}
            </figure>
            <div className="dm__who dm__rise" style={{ "--i": 1 } as React.CSSProperties}>
              <span className="dm__speaker">{d.speaker}</span>
              <span className="dm__company">{d.company.toUpperCase()}</span>
            </div>
          </div>

          <h2 id={titleId} className="dm__title dm__rise" style={{ "--i": 2 } as React.CSSProperties}>
            {d.title}
          </h2>

          <div className="dm__section dm__rise" style={{ "--i": 3 } as React.CSSProperties}>
            <span className="dm__label">KORTE RECAP</span>
            <p className="dm__summary">{d.summary || `[Korte samenvatting van ${d.code} in één of twee zinnen]`}</p>
          </div>

          <div className="dm__section">
            <span className="dm__label dm__rise" style={{ "--i": 4 } as React.CSSProperties}>
              3 TAKEAWAYS
            </span>
            <ol className="dm__takeaways">
              {d.takeaways.map((t, i) => (
                <li key={i} className="dm__takeaway dm__rise" style={{ "--i": 5 + i } as React.CSSProperties}>
                  <span className="dm__n">0{i + 1}</span>
                  <span className="dm__ttext">{t || `[Takeaway ${i + 1}]`}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="dm__actions dm__rise" style={{ "--i": 8 } as React.CSSProperties}>
            <button
              type="button"
              className={`dm__pick${isPicked ? " is-picked" : ""}`}
              aria-pressed={isPicked}
              onClick={onTogglePick}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={isPicked ? "M5 12.5l4.5 4.5L19 7.5" : "M12 5v14M5 12h14"} />
              </svg>
              {isPicked ? "In je bericht" : "Neem mee in je bericht"}
            </button>
            <button type="button" className="dm__done" onClick={close}>
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
