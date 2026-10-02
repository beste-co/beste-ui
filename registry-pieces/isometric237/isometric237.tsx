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

interface Isometric237Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the tag module, the event dots, the hero block and the newest bar with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric237Demo: Isometric237Props = {
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
const PAGE = { x: 12, y: 14, w: 62, d: 56, h: 4 };
const TAG = { x: 74, y: 34, w: 13, d: 14, h: 9 };
const BOARD = { x: 98, y: 16, w: 44, d: 52, h: 4 };
// Where on the page the events land, in plan
const EVENTS = [
  { x: PAGE.x + 50, y: PAGE.y + 8.3 },
  { x: PAGE.x + 24, y: PAGE.y + 44 },
  { x: PAGE.x + 49, y: PAGE.y + 44 },
];
// Each bar's full height, and how far it sits sunk in the board before the events arrive
const BARS = [
  { x: 103, h: 14, sunk: 6 },
  { x: 112, h: 24, sunk: 10 },
  { x: 121, h: 18, sunk: 8 },
  { x: 130, h: 34, sunk: 16 },
];
const BAR = { y: BOARD.y + 20, w: 7, d: 10, z: BASE + BOARD.h };
// Everything above a bar's foot on the board, so the sunk part stays inside the board
const above = (x: number) =>
  polygon([
    [x, BAR.y + BAR.d, BAR.z],
    [x + BAR.w, BAR.y + BAR.d, BAR.z],
    [x + BAR.w, BAR.y, BAR.z],
    [x + BAR.w, BAR.y, BAR.z + 100],
    [x, BAR.y + BAR.d, BAR.z + 100],
  ]);

const PERIOD = 7;
const STYLES = `
@keyframes isometric237-events { 0%, 8% { opacity: 0; } 18%, 84% { opacity: 1; } 94%, 100% { opacity: 0; } }
${BARS.map((bar, index) => `@keyframes isometric237-bar${index} { 0%, ${22 + index * 4}% { transform: translateY(${bar.sunk}px); } ${34 + index * 4}%, 86% { transform: translateY(0px); } 96%, 100% { transform: translateY(${bar.sunk}px); } }
.isometric237-bar${index} { animation: isometric237-bar${index} ${PERIOD}s ease-in-out infinite; }`).join("\n")}
.isometric237-events { animation: isometric237-events ${PERIOD}s ease-in-out infinite; }
.isometric237-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric237-scene * { animation: none !important; } }
`;

export function Isometric237({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric237Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const clipId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric237-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -14 221 141" aria-hidden="true" className="isometric237-scene size-full overflow-visible">
        <defs>
          {BARS.map((bar, index) => (
            <clipPath key={`clip-${bar.x}`} id={`${clipId}-${index}`}>
              <polygon points={above(bar.x)} />
            </clipPath>
          ))}
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 154, 84, BASE, 14)} paint={body} />
        {/* The page, lying flat: a bar, a hero block and two cards */}
        <RoundBlock shape={roundBox(PAGE.x, PAGE.y, BASE, PAGE.w, PAGE.d, PAGE.h, 6)} paint={body} />
        <g transform={onTop(BASE + PAGE.h)}>
          <rect x={PAGE.x + 4} y={PAGE.y + 4} width={PAGE.w - 8} height={PAGE.d - 8} rx={3} className={body.ink} />
          <rect x={PAGE.x + 7} y={PAGE.y + 7} width={20} height={2.6} rx={1.3} className={body.base} />
          <rect x={PAGE.x + 7} y={PAGE.y + 13} width={PAGE.w - 14} height={15} rx={3} className={accent ? mine.base : body.base} />
          <rect x={PAGE.x + 11} y={PAGE.y + 17} width={20} height={2.6} rx={1.3} className={accent ? mine.ink : body.ink} />
          <rect x={PAGE.x + 11} y={PAGE.y + 22} width={12} height={2.4} rx={1.2} className={accent ? mine.ink : body.ink} />
          {[0, 1].map((card) => (
            <g key={`card-${card}`}>
              <rect x={PAGE.x + 7 + card * 25} y={PAGE.y + 32} width={23} height={17} rx={3} className={body.base} />
              <rect x={PAGE.x + 10 + card * 25} y={PAGE.y + 36} width={12} height={2.4} rx={1.2} className={body.ink} />
              <rect x={PAGE.x + 10 + card * 25} y={PAGE.y + 41} width={16} height={2.2} rx={1.1} className={body.ink} />
            </g>
          ))}
        </g>
        {/* The events: small dots that appear on the page together */}
        <g className="isometric237-events">
          {EVENTS.map((event) => (
            <RoundBlock key={`event-${event.x}-${event.y}`} shape={roundBox(event.x - 2.5, event.y - 2.5, BASE + PAGE.h, 5, 5, 2, 2.5)} paint={mine} />
          ))}
        </g>
        {/* The tag module, plugged into the side of the page */}
        <RoundBlock shape={roundBox(TAG.x, TAG.y, BASE, TAG.w, TAG.d, TAG.h, 3)} paint={mine} />
        <g transform={onTop(BASE + TAG.h)}>
          <circle cx={TAG.x + TAG.w / 2} cy={TAG.y + TAG.d / 2} r={2.6} className={accent ? mine.ink : body.ink} />
        </g>
        {/* The chart board: solid bars that come up out of it in answer, the newest one in the accent */}
        <RoundBlock shape={roundBox(BOARD.x, BOARD.y, BASE, BOARD.w, BOARD.d, BOARD.h, 6)} paint={body} />
        <g transform={onTop(BASE + BOARD.h)}>
          <rect x={BOARD.x + 5} y={BOARD.y + 36} width={BOARD.w - 10} height={2.4} rx={1.2} className={body.ink} />
          <rect x={BOARD.x + 5} y={BOARD.y + 42} width={18} height={2.2} rx={1.1} className={body.ink} />
        </g>
        {BARS.map((bar, index) => (
          <g key={`bar-${bar.x}`} clipPath={`url(#${clipId}-${index})`}>
            <g className={`isometric237-bar${index}`}>
              <Block faces={box(bar.x, BAR.y, BAR.z - bar.sunk, BAR.w, BAR.d, bar.h + bar.sunk)} paint={index === BARS.length - 1 ? mine : body} />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
