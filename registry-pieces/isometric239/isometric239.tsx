"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

// --- isometric kit (shared by every Isometric piece, keep in sync) ---
type Tone = "primary" | "foreground" | "color" | "none";
type Palette = "theme" | "light" | "dark" | "tone";

// "color" takes the `color` prop instead of a class, so any hex works
const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  color: "",
  none: "text-foreground",
};
const DEFAULT_COLOR = "#2F6FED";
/** Whether a hex color is light enough that dark lines read better on it. */
function isLight(hex: string) {
  const digits = hex.replace("#", "");
  const full = digits.length === 3 ? digits.replace(/./g, "$&$&") : digits;
  const value = Number.parseInt(full, 16);
  if (full.length !== 6 || Number.isNaN(value)) return false;
  return 0.2126 * (value >> 16) + 0.7152 * ((value >> 8) & 255) + 0.0722 * (value & 255) > 165;
}

// Isometric projection: x runs down-right, y down-left, z straight up
const C = 0.866;
const S = 0.5;
type Point = [number, number, number];
const project = ([x, y, z]: Point) => `${((x - y) * C).toFixed(1)},${((x + y) * S - z).toFixed(1)}`;
const polygon = (points: Point[]) => points.map(project).join(" ");

/** The three faces a box shows from this angle. */
function box(x: number, y: number, z: number, w: number, d: number, h: number) {
  return {
    top: polygon([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]),
    left: polygon([[x, y + d, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x, y + d, z]]),
    right: polygon([[x + w, y, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x + w, y, z]]),
  };
}
type Faces = ReturnType<typeof box>;

/** Draw flat onto a top face at height z, in plan (x, y) units. */
const onTop = (z: number) => `matrix(${C} ${S} ${-C} ${S} 0 ${-z})`;
/** Draw flat onto the left face lying in the plane y = y0, in (x, -z) units. */
const onLeft = (y0: number) => `matrix(${C} ${S} 0 1 ${(-y0 * C).toFixed(1)} ${(y0 * S).toFixed(1)})`;
/** Draw flat onto the right face lying in the plane x = x0, in (y, -z) units. */
const onRight = (x0: number) => `matrix(${-C} ${S} 0 1 ${(x0 * C).toFixed(1)} ${(x0 * S).toFixed(1)})`;

/** How a solid is painted: a base fill, darker overlays on the two sides, an edge, and ink for details. */
interface Paint {
  base: string;
  left: string;
  right: string;
  edge: string;
  ink: string;
}

const BODY: Record<Palette, Paint> = {
  theme: { base: "fill-card", left: "fill-foreground/5", right: "fill-foreground/10", edge: "stroke-border dark:stroke-foreground/25", ink: "fill-foreground/15" },
  light: { base: "fill-white", left: "fill-zinc-950/5", right: "fill-zinc-950/10", edge: "stroke-zinc-200", ink: "fill-zinc-950/15" },
  dark: { base: "fill-zinc-800", left: "fill-black/20", right: "fill-black/40", edge: "stroke-zinc-500", ink: "fill-white/15" },
  tone: { base: "fill-current", left: "fill-black/15", right: "fill-black/30", edge: "stroke-zinc-400/70", ink: "fill-white/30" },
};
const ACCENT: Paint = { base: "fill-current", left: "fill-black/15", right: "fill-black/30", edge: "stroke-transparent", ink: "fill-white/40" };
// On a body that is already the tone, the accent turns white so it still stands out
const ACCENT_ON_TONE: Paint = { base: "fill-white", left: "fill-black/10", right: "fill-black/20", edge: "stroke-transparent", ink: "fill-current" };

// On a body in the tone, the edge takes whatever stands out against that tone
const TONE_EDGE: Record<Tone, string> = {
  primary: "stroke-primary-foreground/50",
  foreground: "stroke-background/50",
  color: "stroke-white/60",
  none: "stroke-border",
};

/** Body and accent paints; with accent off the piece is one color throughout. */
function paints(palette: Palette, accent: boolean, tone: Tone = "primary", color: string = DEFAULT_COLOR) {
  // A light custom color gets dark lines and ink, a deep one gets light ones
  const onTone = tone === "color" && isLight(color) ? { edge: "stroke-black/35", ink: "fill-black/20" } : { edge: TONE_EDGE[tone] };
  const body = palette === "tone" ? { ...BODY.tone, ...onTone } : BODY[palette];
  return { body, accent: !accent ? body : palette === "tone" ? ACCENT_ON_TONE : ACCENT };
}

function Block({ faces, paint }: { faces: Faces; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={faces.left} className={paint.base} />
      <polygon points={faces.left} className={paint.left} stroke="none" />
      <polygon points={faces.right} className={paint.base} />
      <polygon points={faces.right} className={paint.right} stroke="none" />
      <polygon points={faces.top} className={paint.base} />
    </g>
  );
}
// --- end isometric kit ---

interface Isometric239Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the lock, the typed password and the page button with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric239Demo: Isometric239Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

type Round = ReturnType<typeof roundBox>;

/** A box with rounded corners in plan; with w = d = 2r it is a cylinder. */
function roundBox(x: number, y: number, z: number, w: number, d: number, h: number, r: number) {
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -90],
    [x + w - r, y + d - r, 0],
    [x + r, y + d - r, 90],
  ];
  // Rim points whose outward normal lies between two angles (degrees, 0 = +x, 90 = +y)
  const rim = (from: number, to: number) => {
    const points: [number, number][] = [];
    for (const [cx, cy, start] of corners) {
      const lo = Math.max(start, from);
      const hi = Math.min(start + 90, to);
      if (lo > hi) continue;
      for (let k = 0; k <= 8; k++) {
        const angle = ((lo + ((hi - lo) * k) / 8) * Math.PI) / 180;
        points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
      }
    }
    return points;
  };
  const band = (points: [number, number][]) =>
    polygon([...points.map(([px, py]): Point => [px, py, z]), ...points.reverse().map(([px, py]): Point => [px, py, z + h])]);
  return { side: band(rim(-45, 135)), left: band(rim(45, 135)), right: band(rim(-45, 45)), top: { x, y, w, d, r, z: z + h } };
}

function RoundBlock({ shape, paint }: { shape: Round; paint: Paint }) {
  const { top } = shape;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.left} className={paint.left} stroke="none" />
      <polygon points={shape.right} className={paint.right} stroke="none" />
      <rect x={top.x} y={top.y} width={top.w} height={top.d} rx={top.r} transform={onTop(top.z)} vectorEffect="non-scaling-stroke" className={paint.base} />
    </g>
  );
}


const BASE = 6;
const W = 80;
const TALL = 72;
const THICK = 5;
const FOOT = { x: 16, y: 36, z: BASE + 3 };

const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
// Panels stand on their bottom front edge and lean back by this much
const LEAN = (14 * Math.PI) / 180;
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
/** The matrix that lays local (across, down) units onto a leaning plane `depth` behind a foot, starting `rise` up it. */
function plane(foot: { x: number; y: number; z: number }, depth: number, rise: number, left = 0) {
  const origin: Point = [foot.x + left, foot.y + UP[1] * rise + BACK[1] * depth, foot.z + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
const FRONT = plane(FOOT, 0, TALL);
// Behind the front the slab is a stack of thin layers, far to near
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
const REST = { side: 4, tall: 40, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);
const PAGE = { x: 3, y: 11, w: W - 6, h: 51 };
// The gate stands on a rail in front of the stand and slides along it
const GATE = { x: 36, y: 46, z: BASE + 2, w: 60, tall: 58, thick: 4, slide: 62 };
const GATE_LAYERS = Array.from({ length: GATE.thick }, (_, index) => GATE.thick - index);
const DOTS = [0, 1, 2, 3];

const PERIOD = 10;
const STYLES = `
@keyframes isometric239-gate { 0%, 46% { transform: translateX(0px); } 60%, 80% { transform: translateX(${GATE.slide}px); } 92%, 100% { transform: translateX(0px); } }
@keyframes isometric239-shackle { 0%, 36% { transform: translateY(0px); } 40%, 92% { transform: translateY(-3px); } 96%, 100% { transform: translateY(0px); } }
${DOTS.map((dot) => `@keyframes isometric239-dot${dot} { 0%, ${12 + dot * 6}% { opacity: 0; } ${15 + dot * 6}%, 93% { opacity: 1; } 97%, 100% { opacity: 0; } }
.isometric239-dot${dot} { animation: isometric239-dot${dot} ${PERIOD}s linear infinite; }`).join("\n")}
.isometric239-gate { animation: isometric239-gate ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.isometric239-shackle { animation: isometric239-shackle ${PERIOD}s ease-in-out infinite; }
.isometric239-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric239-scene * { animation: none !important; } }
`;

export function Isometric239({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric239Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn in the accent on a neutral fill
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;
  const clipId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric239-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-92 -76 254 222" aria-hidden="true" className="isometric239-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} rx={4} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 168, 88, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 6, 8, BASE, W + 12, 36, 3, 8)} paint={body} />
        {REST_LAYERS.map((depth, index) => (
          <g key={`rest-${depth}`} transform={plane(FOOT, depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={`slab-${depth}`} transform={plane(FOOT, depth, TALL)}>
            <rect width={W} height={TALL} rx={6} className={body.base} />
            <rect width={W} height={TALL} rx={6} className={body.right} />
          </g>
        ))}
        {/* The page the gate protects */}
        <g transform={FRONT}>
          <rect width={W} height={TALL} rx={6} strokeWidth={1} className={cn(body.base, body.edge)} />
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={7 + dot * 4.5} cy={6} r={1.4} className={body.ink} />
          ))}
          <rect x={24} y={3.4} width={W - 48} height={5.2} rx={2.6} className={body.ink} />
          <g clipPath={`url(#${clipId})`}>
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.base} />
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.ink} />
            <rect x={8} y={17} width={32} height={4.4} rx={2.2} className={body.base} />
            <rect x={8} y={24} width={22} height={2.6} rx={1.3} className={body.base} />
            <rect x={8} y={30} width={20} height={7} rx={3.5} className={accent ? mine.base : body.base} />
            <rect x={45} y={16} width={27} height={21} rx={5} className={body.base} />
            {[8, 41].map((x) => (
              <rect key={`card-${x}`} x={x} y={41} width={31} height={17} rx={4} className={body.base} />
            ))}
          </g>
        </g>
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* The rail, and the gate panel standing on it */}
        <RoundBlock shape={roundBox(FOOT.x + 4, GATE.y - 4, BASE, 142, 7, 2, 3)} paint={body} />
        {GATE_LAYERS.map((depth) => (
          <g key={`gate-${depth}`} transform={plane(GATE, depth, GATE.tall)}>
            <g className="isometric239-gate">
              <rect width={GATE.w} height={GATE.tall} rx={6} className={body.base} />
              <rect width={GATE.w} height={GATE.tall} rx={6} className={body.right} />
            </g>
          </g>
        ))}
        <g transform={plane(GATE, 0, GATE.tall)}>
          <g className="isometric239-gate">
            <rect width={GATE.w} height={GATE.tall} rx={6} strokeWidth={1} className={cn(body.base, body.edge)} />
            {/* The lock: its shackle lifts once the password is in */}
            <path d="M24 21V15.5a6 6 0 0 1 12 0V21" fill="none" strokeWidth={2.6} strokeLinecap="round" className={cn("isometric239-shackle", inAccent)} />
            <rect x={19.5} y={19} width={21} height={15} rx={4} className={accent ? mine.base : body.ink} />
            <circle cx={30} cy={25.5} r={2} className={accent ? mine.ink : body.base} />
            <rect x={29.1} y={25.5} width={1.8} height={4.6} rx={0.9} className={accent ? mine.ink : body.base} />
            {/* The password field */}
            <rect x={8} y={40} width={GATE.w - 16} height={10} rx={5} className={body.ink} />
            {DOTS.map((dot) => (
              <circle key={`key-${dot}`} cx={17 + dot * 8.7} cy={45} r={1.8} className={cn(`isometric239-dot${dot}`, accent ? mine.base : body.base)} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
