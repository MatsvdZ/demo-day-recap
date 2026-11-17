import { useId } from "react";

/**
 * Ribbon divider in the "Boekje v4 · golven" style: navy and red bands with a
 * vertical gradient, faint skewed white stripes, white edge lines and a soft
 * shadow. The bands enter and leave through the left/right edges (never the
 * top/bottom), and the lowest band ("sea") fades into solid navy at the bottom,
 * so it flows into the navy section below without a hard cut.
 */

type Pt = [number, number];

const W = 1440;
const H = 400;
const NAVY = "#163172";

// Catmull-Rom → cubic Bézier, for smooth curves through the control points.
function curve(pts: Pt[], move = true): string {
  let d = move ? `M ${pts[0][0]} ${pts[0][1]}` : `L ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/** A band between a top curve and the same curve pushed down by `thick[i]`. */
function band(top: Pt[], thick: number[]) {
  const bottom = top.map(([x, y], i): Pt => [x, y + thick[i]]);
  const inner = top.map(([x, y], i): Pt => [x, y + thick[i] * 0.82]);
  return {
    fill: `${curve(top)} ${curve([...bottom].reverse(), false)} Z`,
    edge: curve(top),
    inner: curve(inner),
    minY: Math.min(...top.map((p) => p[1])),
    maxY: Math.max(...bottom.map((p) => p[1])),
  };
}

// Control points run from x = -60 to 1500, past both edges, so no band ends inside the frame.
const NAVY_BAND = band(
  [[-60, 70], [260, 52], [560, 104], [860, 196], [1160, 214], [1500, 150]],
  [86, 96, 110, 120, 112, 100],
);
const RED_BAND = band(
  [[-60, 150], [220, 168], [520, 214], [800, 226], [1080, 170], [1300, 112], [1500, 92]],
  [92, 104, 116, 112, 104, 96, 92],
);
const SEA_TOP: Pt[] = [[-60, 300], [240, 276], [560, 300], [880, 336], [1180, 316], [1500, 282]];
const SEA = {
  fill: `${curve(SEA_TOP)} L 1500 ${H + 40} L -60 ${H + 40} Z`,
};

type Props = {
  /** Mirror left↔right, for variety between the two dividers. */
  flip?: boolean;
  className?: string;
};

export function Waves({ flip, className }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = (name: string) => `url(#${name}${id})`;

  return (
    <svg
      className={`waves${className ? ` ${className}` : ""}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={`sh${id}`} x="-5%" y="-30%" width="110%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor={NAVY} floodOpacity="0.28" />
        </filter>
        <pattern
          id={`st${id}`}
          width="12"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="skewY(4.17)"
        >
          <line x1="0" y1="0.5" x2="12" y2="0.5" stroke="#ffffff" strokeWidth="1" />
        </pattern>
        <linearGradient id={`gn${id}`} x1="0" y1={NAVY_BAND.minY} x2="0" y2={NAVY_BAND.maxY} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5A70A8" />
          <stop offset="0.5" stopColor="#2A4585" />
          <stop offset="1" stopColor={NAVY} />
        </linearGradient>
        <linearGradient id={`gr${id}`} x1="0" y1={RED_BAND.minY} x2="0" y2={RED_BAND.maxY} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF8C8D" />
          <stop offset="0.5" stopColor="#FF4648" />
          <stop offset="1" stopColor="#E3383B" />
        </linearGradient>
        <linearGradient id={`gs${id}`} x1="0" y1="270" x2="0" y2="372" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5A70A8" />
          <stop offset="0.45" stopColor="#2A4585" />
          <stop offset="1" stopColor={NAVY} />
        </linearGradient>
        {/* Sea stripes fade out before the bottom edge, so the navy section continues seamlessly. */}
        <linearGradient id={`fs${id}`} x1="0" y1="276" x2="0" y2="372" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <mask id={`ms${id}`} maskUnits="userSpaceOnUse" x="-60" y="0" width="1560" height={H + 10}>
          <rect x="-60" y="0" width="1560" height={H + 10} fill={ref("fs")} />
        </mask>
      </defs>

      <g transform={flip ? `translate(${W} 0) scale(-1 1)` : undefined}>
        {/* The sea sits behind the ribbons and has no edge line, so it reads as the navy
            section rising into the waves rather than a separate layer laid over them. */}
        <g>
          <path d={SEA.fill} fill={ref("gs")} />
          <path d={SEA.fill} fill={ref("st")} opacity="0.35" mask={ref("ms")} />
        </g>

        <g filter={ref("sh")}>
          <path d={NAVY_BAND.fill} fill={ref("gn")} />
          <path d={NAVY_BAND.fill} fill={ref("st")} opacity="0.35" />
          <path d={NAVY_BAND.edge} fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
          <path d={NAVY_BAND.inner} fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        </g>

        <g filter={ref("sh")}>
          <path d={RED_BAND.fill} fill={ref("gr")} />
          <path d={RED_BAND.fill} fill={ref("st")} opacity="0.35" />
          <path d={RED_BAND.edge} fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
          <path d={RED_BAND.inner} fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        </g>
      </g>
    </svg>
  );
}
