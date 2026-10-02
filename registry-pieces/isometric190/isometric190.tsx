"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

// --- isometric kit (shared by every Isometric piece, keep in sync) ---
type Tone = "primary" | "foreground" | "color" | "none";
type Palette = "theme" | "light" | "dark" | "tone" | "glass";

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
  // See-through body for a piece that sits over a photo or gradient; stacked solids add up to a frosted look
  glass: { base: "fill-card/30", left: "fill-foreground/5", right: "fill-foreground/10", edge: "stroke-card/70", ink: "fill-foreground/20" },
};
const ACCENT: Paint = { base: "fill-current", left: "fill-black/15", right: "fill-black/30", edge: "stroke-transparent", ink: "fill-white/40" };
// On a body that is already the tone, the accent turns white so it still stands out
const ACCENT_ON_TONE: Paint = { base: "fill-white", left: "fill-black/10", right: "fill-black/20", edge: "stroke-transparent", ink: "fill-current" };
// On a glass body the accent is tinted glass too, with a light rim
const ACCENT_ON_GLASS: Paint = { base: "fill-current/45", left: "fill-black/10", right: "fill-black/20", edge: "stroke-white/50", ink: "fill-white/60" };

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
  return { body, accent: !accent ? body : palette === "tone" ? ACCENT_ON_TONE : palette === "glass" ? ACCENT_ON_GLASS : ACCENT };
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
interface Isometric190Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the sent message and the mic button with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric190Demo: Isometric190Props = {
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
const W = 64;
const TALL = 118;
const THICK = 6;
// The phone lies face up on the base; the screen is drawn in plan units from its top left corner
const AT = { x: 14, y: 16 };
const SCREEN_Z = BASE + THICK;

const PERIOD = 9;
const THREAD = { x: 3, y: 26, w: W - 6, h: 66 };
const RISE = 50;
// Waveform bar heights, as drawn in the bubbles and in the recorder
const WAVE = [4, 7, 5, 9, 6, 3, 7, 4];
const LIVE = [3, 6, 8, 5, 7, 4, 6, 3];
const MID = 102.5;

const STYLES = `
@keyframes isometric190-rec { 0%, 5% { opacity: 0; } 9%, 45% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes isometric190-idle { 0%, 5% { opacity: 1; } 9%, 45% { opacity: 0; } 50%, 100% { opacity: 1; } }
@keyframes isometric190-bar { 0%, 100% { transform: scaleY(0.45); } 50% { transform: scaleY(1); } }
@keyframes isometric190-ring { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.6; } }
@keyframes isometric190-send { 0%, 48% { transform: translateY(${RISE}px); opacity: 1; } 58%, 90% { transform: translateY(0); opacity: 1; } 96% { transform: translateY(0); opacity: 0; } 100% { transform: translateY(${RISE}px); opacity: 0; } }
.isometric190-rec { animation: isometric190-rec ${PERIOD}s linear infinite; }
.isometric190-idle { animation: isometric190-idle ${PERIOD}s linear infinite; }
.isometric190-bar { animation: isometric190-bar 0.9s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric190-ring { animation: isometric190-ring 1.5s ease-in-out infinite; }
.isometric190-send { animation: isometric190-send ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
.isometric190-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric190-scene * { animation: none !important; } }
`;

/** A voice message: a play mark and its waveform, inside a bubble that starts at (x, y). */
function Voice({ x, y, fill, ink }: { x: number; y: number; fill: string; ink: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={40} height={14} rx={7} className={fill} />
      <g className={ink}>
        <path d="M6.5 4.2v5.6l4.6 -2.8Z" />
        {WAVE.map((tall, index) => (
          <rect key={`wave-${index}`} x={14.5 + index * 2.8} y={7 - tall / 2} width={1.6} height={tall} rx={0.8} />
        ))}
      </g>
    </g>
  );
}

export function Isometric190({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric190Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill, and one drawn in the accent on a neutral fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric190-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-138 -22 226 156" aria-hidden="true" className="isometric190-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={THREAD.x} y={THREAD.y} width={THREAD.w} height={THREAD.h} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 92, 150, BASE, 14)} paint={body} />
        {/* The phone, lying flat */}
        <RoundBlock shape={roundBox(AT.x, AT.y, BASE, W, TALL, THICK, 9)} paint={body} />
        <g transform={onRight(AT.x + W)} className={body.ink}>
          <rect x={AT.y + 30} y={-BASE - 4} width={16} height={1.8} rx={0.9} />
        </g>
        <g transform={`${onTop(SCREEN_Z)} translate(${AT.x} ${AT.y})`}>
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          {/* Header: who the chat is with */}
          <circle cx={11} cy={19} r={4} className={body.base} />
          <rect x={18} y={17.4} width={22} height={3.2} rx={1.6} className={body.base} />
          {/* A voice message already received, and the one being sent sliding up from the recorder */}
          <Voice x={6} y={30} fill={body.base} ink={body.ink} />
          <g clipPath={`url(#${clipId})`}>
            <g className="isometric190-send">
              <Voice x={18} y={50} fill={accent ? mine.base : body.base} ink={accent ? mine.ink : body.ink} />
            </g>
          </g>
          {/* The recorder: an empty field at rest, a live waveform while recording */}
          <rect x={6} y={MID - 6.5} width={40} height={13} rx={6.5} className={body.base} />
          <rect x={12} y={MID - 1.5} width={18} height={3} rx={1.5} className={cn("isometric190-idle", body.ink)} />
          <g className="isometric190-rec opacity-0">
            <circle cx={12.5} cy={MID} r={1.8} className={accent ? mine.base : body.ink} />
            {LIVE.map((tall, index) => (
              <rect key={`live-${index}`} x={17.5 + index * 3.2} y={MID - tall / 2} width={1.8} height={tall} rx={0.9} className={cn("isometric190-bar", body.ink)} style={{ animationDelay: `${(-index * 0.17).toFixed(2)}s` }} />
            ))}
            <circle cx={53} cy={MID} r={8.2} fill="none" strokeWidth={1.2} className={cn("isometric190-ring", inAccent)} />
          </g>
          <circle cx={53} cy={MID} r={6.5} className={accent ? mine.base : body.base} />
          <g fill="none" strokeWidth={1.2} strokeLinecap="round" className={onAccent}>
            <rect x={51.6} y={MID - 3.6} width={2.8} height={5} rx={1.4} />
            <path d={`M50 ${MID + 0.4}a3 3 0 0 0 6 0M53 ${MID + 3.4}v1`} />
          </g>
        </g>
      </svg>
    </div>
  );
}
