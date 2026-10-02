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

interface Isometric215Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the sent message, the send button and the edited section with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric215Demo: Isometric215Props = {
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
const CHAT = { x: 10, y: 10, w: 52, d: 84, h: 4 };
const SLAB = { x: 72, y: 10, w: 94, d: 84, h: 4 };
const Z = BASE + CHAT.h;
// The thread, in panel units: messages only show inside it
const THREAD = { x: 4, y: 16, w: CHAT.w - 8, h: 52 };
const SLIDE = 26;
const CHECK = "M-1.6 0.1L-0.5 1.2L1.7 -1.2";

const PERIOD = 10;
const STYLES = `
@keyframes isometric215-send { 0%, 8% { transform: translate(0px, ${SLIDE}px); } 18%, 84% { transform: translate(0px, 0px); } 94%, 100% { transform: translate(0px, ${SLIDE}px); } }
@keyframes isometric215-edit { 0%, 24% { opacity: 0; } 34%, 82% { opacity: 1; } 90%, 100% { opacity: 0; } }
@keyframes isometric215-reply { 0%, 38% { opacity: 0; } 44%, 80% { opacity: 1; } 86%, 100% { opacity: 0; } }
.isometric215-send { animation: isometric215-send ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
.isometric215-edit { animation: isometric215-edit ${PERIOD}s ease-in-out infinite; }
.isometric215-reply { animation: isometric215-reply ${PERIOD}s ease-in-out infinite; }
.isometric215-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric215-scene * { animation: none !important; } }
`;

export function Isometric215({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric215Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric215-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-100 -24 264 176" aria-hidden="true" className="isometric215-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={THREAD.x} y={THREAD.y} width={THREAD.w} height={THREAD.h} rx={3} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 176, 104, BASE, 14)} paint={body} />
        {/* The chat panel: a header, the thread and the input */}
        <RoundBlock shape={roundBox(CHAT.x, CHAT.y, BASE, CHAT.w, CHAT.d, CHAT.h, 7)} paint={body} />
        <g transform={`${onTop(Z)} translate(${CHAT.x} ${CHAT.y})`}>
          <circle cx={9} cy={8.5} r={3.4} className={body.ink} />
          <rect x={15} y={7.2} width={20} height={2.6} rx={1.3} className={body.ink} />
          <rect x={THREAD.x} y={THREAD.y} width={THREAD.w} height={THREAD.h} rx={3} className={body.ink} />
          <g clipPath={`url(#${clipId})`}>
            <rect x={7} y={20} width={26} height={10} rx={4} className={body.base} />
            <rect x={10.5} y={23.8} width={17} height={2.4} rx={1.2} className={body.ink} />
            {/* The message slides up from the input and stays inside the thread */}
            <g className="isometric215-send">
              <rect x={17} y={34} width={28} height={13} rx={4.5} className={accent ? mine.base : body.base} />
              <rect x={21} y={37.4} width={20} height={2.4} rx={1.2} className={accent ? mine.ink : body.ink} />
              <rect x={21} y={41.6} width={13} height={2.4} rx={1.2} className={accent ? mine.ink : body.ink} />
            </g>
            {/* The reply: a short bubble with a check once the page is changed */}
            <g className="isometric215-reply">
              <rect x={7} y={51} width={22} height={11} rx={4.5} className={body.base} />
              <circle cx={13.5} cy={56.5} r={3.2} className={accent ? mine.base : body.ink} />
              <path d={CHECK} transform="translate(13.5 56.5)" fill="none" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" className={onAccent} />
              <rect x={19} y={55.3} width={7} height={2.4} rx={1.2} className={body.ink} />
            </g>
          </g>
          <rect x={4} y={72} width={CHAT.w - 8} height={8} rx={4} className={body.ink} />
          <rect x={8} y={74.8} width={18} height={2.4} rx={1.2} className={body.base} />
          <circle cx={CHAT.w - 8.5} cy={76} r={2.8} className={accent ? mine.base : body.base} />
        </g>
        {/* The page beside it */}
        <RoundBlock shape={roundBox(SLAB.x, SLAB.y, BASE, SLAB.w, SLAB.d, SLAB.h, 7)} paint={body} />
        <g transform={`${onTop(Z)} translate(${SLAB.x} ${SLAB.y})`}>
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={7 + dot * 4.5} cy={6.5} r={1.4} className={body.ink} />
          ))}
          <rect x={26} y={4} width={42} height={5} rx={2.5} className={body.ink} />
          <rect x={4} y={12} width={SLAB.w - 8} height={SLAB.d - 16} rx={3} className={body.ink} />
          <rect x={7} y={15} width={SLAB.w - 14} height={7} rx={2.5} className={body.base} />
          <rect x={10} y={17.3} width={10} height={2.4} rx={1.2} className={body.ink} />
          {[0, 1, 2].map((link) => (
            <rect key={`link-${link}`} x={54 + link * 10} y={17.5} width={7} height={2} rx={1} className={body.ink} />
          ))}
          {/* The hero as it was: copy on the left, a picture on the right */}
          <rect x={7} y={25} width={SLAB.w - 14} height={27} rx={3.5} className={body.base} />
          <rect x={12} y={30.5} width={26} height={3.6} rx={1.8} className={body.ink} />
          <rect x={12} y={36.6} width={20} height={2.4} rx={1.2} className={body.ink} />
          <rect x={12} y={42.4} width={12} height={4.4} rx={2.2} className={body.ink} />
          <rect x={52} y={29} width={30} height={19} rx={3.5} className={body.ink} />
          {/* The hero after the edit fades in over it: centered copy on the accent */}
          <g className="isometric215-edit">
            <rect x={7} y={25} width={SLAB.w - 14} height={27} rx={3.5} className={accent ? mine.base : body.base} />
            <rect x={25} y={30.5} width={44} height={3.8} rx={1.9} className={accent ? mine.ink : body.ink} />
            <rect x={32} y={36.8} width={30} height={2.4} rx={1.2} className={accent ? mine.ink : body.ink} />
            <rect x={38} y={42.4} width={18} height={4.8} rx={2.4} className={accent ? mine.ink : body.ink} />
          </g>
          {[7, 33.5, 60].map((x) => (
            <g key={`card-${x}`}>
              <rect x={x} y={55} width={24} height={15} rx={3.5} className={body.base} />
              <circle cx={x + 5.5} cy={60.3} r={2.4} className={body.ink} />
              <rect x={x + 10} y={59.1} width={10} height={2.4} rx={1.2} className={body.ink} />
              <rect x={x + 4} y={64.8} width={15} height={2} rx={1} className={body.ink} />
            </g>
          ))}
          <rect x={7} y={73} width={SLAB.w - 14} height={5} rx={2.5} className={body.base} />
        </g>
      </svg>
    </div>
  );
}
