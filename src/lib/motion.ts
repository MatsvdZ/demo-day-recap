/** Shared animation helpers for the pop-ups. */

export const EASE = "cubic-bezier(0.525, 0, 0, 1)"; // --ease-brand

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Transform that maps the panel's final box onto the origin row's box. */
export function fromRect(panel: DOMRect, origin: DOMRect) {
  const dx = origin.left + origin.width / 2 - (panel.left + panel.width / 2);
  const dy = origin.top + origin.height / 2 - (panel.top + panel.height / 2);
  const sx = origin.width / panel.width;
  const sy = origin.height / panel.height;
  return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
}

/** Run `done` when `anim` finishes, and force it to finish if the browser isn't ticking
 *  animation frames (background tab, paused renderer) so the pop-up never gets stuck. */
export function settle(anim: Animation, ms: number, done: () => void) {
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
