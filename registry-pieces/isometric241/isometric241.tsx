"use client";

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

interface Isometric241Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the plug, the link light, the checks and the highlights on both screens with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric241Demo: Isometric241Props = {
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

const G = 6;
const DESK = { w: 176, d: 84 };
// Both slabs stand at the back of the desk and face the same way
const BACK_Y = 22;
const SLAB_D = 5;
const FACE_Y = BACK_Y + SLAB_D;
const CHAT = { x: 12, w: 46, h: 56 };
const SITE = { x: 100, w: 64, h: 56 };
const RAIL = { x: 20, y: 56, w: 136, d: 8, h: 2 };
// The two halves of the connector are drawn where they meet; the animation pulls them apart
const HALF = { w: 22, d: 14, h: 9, y: 53, meet: 88, gap: 14 };
const PERIOD = 10;
/** A CSS translate that moves a part along the desk's x axis. */
const slide = (dx: number) => `translate(${(dx * C).toFixed(2)}px, ${(dx * S).toFixed(2)}px)`;

const STYLES = `
@keyframes isometric241-left { 0%, 12% { transform: ${slide(-HALF.gap)}; } 24%, 84% { transform: translate(0px, 0px); } 94%, 100% { transform: ${slide(-HALF.gap)}; } }
@keyframes isometric241-right { 0%, 12% { transform: ${slide(HALF.gap)}; } 24%, 84% { transform: translate(0px, 0px); } 94%, 100% { transform: ${slide(HALF.gap)}; } }
@keyframes isometric241-live { 0%, 25% { opacity: 0; } 30%, 84% { opacity: 1; } 88%, 100% { opacity: 0; } }
@keyframes isometric241-check { 0%, 30% { opacity: 0; } 38%, 84% { opacity: 1; } 90%, 100% { opacity: 0; } }
.isometric241-left { animation: isometric241-left ${PERIOD}s cubic-bezier(0.5, 0, 0.2, 1) infinite; }
.isometric241-right { animation: isometric241-right ${PERIOD}s cubic-bezier(0.5, 0, 0.2, 1) infinite; }
.isometric241-live { animation: isometric241-live ${PERIOD}s ease-in-out infinite; }
.isometric241-check { animation: isometric241-check ${PERIOD}s ease-in-out infinite; }
.isometric241-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric241-scene * { animation: none !important; } }
`;

export function Isometric241({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric241Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric241-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-86 -60 252 204" aria-hidden="true" className="isometric241-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, DESK.w, DESK.d, G, 14)} paint={body} />
        {/* The chat app on the left */}
        <Block faces={box(CHAT.x, BACK_Y, G, CHAT.w, SLAB_D, CHAT.h)} paint={body} />
        <g transform={onLeft(FACE_Y)}>
          <rect x={CHAT.x + 3} y={-(G + CHAT.h - 3)} width={CHAT.w - 6} height={CHAT.h - 6} rx={3} className={body.ink} />
          <rect x={CHAT.x + 7} y={-(G + 48)} width={22} height={7} rx={3.5} className={body.base} />
          <rect x={CHAT.x + 15} y={-(G + 38)} width={24} height={7} rx={3.5} className={mine.base} />
          <rect x={CHAT.x + 7} y={-(G + 28)} width={17} height={7} rx={3.5} className={body.base} />
          <rect x={CHAT.x + 7} y={-(G + 14)} width={32} height={6} rx={3} className={body.base} />
          <circle cx={CHAT.x + 35.5} cy={-(G + 11)} r={1.8} className={mine.base} />
        </g>
        {/* The site builder on the right */}
        <Block faces={box(SITE.x, BACK_Y, G, SITE.w, SLAB_D, SITE.h)} paint={body} />
        <g transform={onLeft(FACE_Y)}>
          <rect x={SITE.x + 3} y={-(G + SITE.h - 3)} width={SITE.w - 6} height={SITE.h - 6} rx={3} className={body.ink} />
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={SITE.x + 8.5 + dot * 4} cy={-(G + 48.5)} r={1.2} className={body.base} />
          ))}
          <rect x={SITE.x + 7} y={-(G + 44.5)} width={SITE.w - 14} height={16} rx={3} className={mine.base} />
          <rect x={SITE.x + 11} y={-(G + 40.5)} width={20} height={2.6} rx={1.3} className={mine.ink} />
          <rect x={SITE.x + 11} y={-(G + 35.5)} width={13} height={2.2} rx={1.1} className={mine.ink} />
          {[0, 1].map((card) => (
            <rect key={`card-${card}`} x={SITE.x + 7 + card * 26} y={-(G + 25)} width={24} height={16} rx={3} className={body.base} />
          ))}
        </g>
        {/* A lead from each slab down to the rail that joins them */}
        <Block faces={box(CHAT.x + CHAT.w / 2 - 2, FACE_Y, G, 4, RAIL.y - FACE_Y, 1.5)} paint={body} />
        <Block faces={box(SITE.x + SITE.w / 2 - 2, FACE_Y, G, 4, RAIL.y - FACE_Y, 1.5)} paint={body} />
        <Block faces={box(RAIL.x, RAIL.y, G, RAIL.w, RAIL.d, RAIL.h)} paint={body} />
        {/* Once the link is made, the same check shows on both screens */}
        <g transform={onLeft(FACE_Y)} className="isometric241-check">
          {[
            { cx: CHAT.x + 36, cy: -(G + 44.5) },
            { cx: SITE.x + 45, cy: -(G + 17) },
          ].map(({ cx, cy }) => (
            <g key={`check-${cx}`} transform={`translate(${cx} ${cy})`}>
              <circle r={5} className={accent ? mine.base : body.base} />
              <path d="M-2.2 0.2L-0.6 1.9L2.4 -1.6" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={onAccent} />
            </g>
          ))}
        </g>
        {/* The plug half, with the prong that goes into the socket half */}
        <g className="isometric241-left">
          <Block faces={box(HALF.meet - HALF.w, HALF.y, G, HALF.w, HALF.d, HALF.h)} paint={mine} />
          <Block faces={box(HALF.meet, HALF.y + 4, G + 2.5, 6, 6, 4)} paint={body} />
        </g>
        {/* The socket half carries the link light */}
        <g className="isometric241-right">
          <Block faces={box(HALF.meet, HALF.y, G, HALF.w, HALF.d, HALF.h)} paint={body} />
          <RoundBlock shape={roundBox(HALF.meet + HALF.w / 2 - 3.5, HALF.y + HALF.d / 2 - 3.5, G + HALF.h, 7, 7, 1.5, 3.5)} paint={body} />
          <g className="isometric241-live">
            <RoundBlock shape={roundBox(HALF.meet + HALF.w / 2 - 3.5, HALF.y + HALF.d / 2 - 3.5, G + HALF.h, 7, 7, 1.5, 3.5)} paint={mine} />
          </g>
        </g>
      </svg>
    </div>
  );
}
