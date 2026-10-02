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

interface Isometric218Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the active chip, the range and the matching prices with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric218Demo: Isometric218Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};


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

type Round = ReturnType<typeof roundBox>;

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
const PANEL = { x: 10, y: 12, w: 46, d: 76, h: 4 };
const GRID = { x: 62, y: 12, w: 94, d: 76, h: 4 };
const Z = BASE + 4;
const CARD = { w: 24, d: 30, h: 3 };
const COLS = [68, 97, 126];
const ROWS = [18, 52];
const CARDS = ROWS.flatMap((y, row) => COLS.map((x, col) => ({ x, y, index: row * 3 + col })));
// The cards that stay inside the range once the thumb has moved
const MATCH = new Set([1, 3, 5]);
// The range: a track on the panel and a thumb that travels along it
const TRACK = { x: 15, y: 77, w: 36, h: 3 };
const THUMB = { x: 26, r: 4, h: 3, travel: 15 };
const PERIOD = 10;

const STYLES = `
@keyframes isometric218-thumb { 0%, 14%, 86%, 100% { transform: translate(0px, 0px); } 28%, 72% { transform: translate(${(THUMB.travel * C).toFixed(2)}px, ${(THUMB.travel * S).toFixed(2)}px); } }
@keyframes isometric218-fill { 0%, 14%, 86%, 100% { transform: translateX(0px); } 28%, 72% { transform: translateX(${THUMB.travel}px); } }
@keyframes isometric218-dim { 0%, 22%, 82%, 100% { opacity: 1; } 32%, 72% { opacity: 0.25; } }
.isometric218-thumb { animation: isometric218-thumb ${PERIOD}s ease-in-out infinite; }
.isometric218-fill { animation: isometric218-fill ${PERIOD}s ease-in-out infinite; }
.isometric218-dim { animation: isometric218-dim ${PERIOD}s ease-in-out infinite; }
.isometric218-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric218-scene * { animation: none !important; } }
`;

export function Isometric218({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric218Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric218-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-98 -26 254 172" aria-hidden="true" className="isometric218-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={TRACK.x} y={TRACK.y} width={TRACK.w} height={TRACK.h} rx={TRACK.h / 2} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 166, 100, BASE, 14)} paint={body} />
        {/* The filter panel: chips, two checkboxes and the range */}
        <RoundBlock shape={roundBox(PANEL.x, PANEL.y, BASE, PANEL.w, PANEL.d, PANEL.h, 7)} paint={body} />
        <g transform={onTop(Z)}>
          <rect x={15} y={17} width={18} height={3.4} rx={1.7} className={body.ink} />
          <rect x={15} y={24.5} width={15} height={6.4} rx={3.2} className={accent ? mine.base : body.ink} />
          <rect x={18.5} y={26.6} width={8} height={2.2} rx={1.1} className={accent ? mine.ink : body.base} />
          <rect x={32} y={24.5} width={19} height={6.4} rx={3.2} className={body.ink} />
          <rect x={15} y={33} width={21} height={6.4} rx={3.2} className={body.ink} />
          <rect x={38} y={33} width={13} height={6.4} rx={3.2} className={body.ink} />
          <rect x={15} y={45} width={14} height={2.8} rx={1.4} className={body.ink} />
          {[51, 59].map((y, row) => (
            <g key={`check-${y}`}>
              <rect x={15} y={y} width={5.4} height={5.4} rx={1.8} className={row === 0 && accent ? mine.base : body.ink} />
              <rect x={23.5} y={y + 1.6} width={row === 0 ? 20 : 15} height={2.2} rx={1.1} className={body.ink} />
            </g>
          ))}
          <rect x={15} y={69.5} width={12} height={2.8} rx={1.4} className={body.ink} />
          <rect x={TRACK.x} y={TRACK.y} width={TRACK.w} height={TRACK.h} rx={TRACK.h / 2} className={body.ink} />
          <g clipPath={`url(#${clipId})`}>
            <rect x={THUMB.x - TRACK.w} y={TRACK.y} width={TRACK.w} height={TRACK.h} className={cn("isometric218-fill", accent ? mine.base : body.ink)} />
          </g>
        </g>
        <g className="isometric218-thumb">
          <RoundBlock shape={roundBox(THUMB.x - THUMB.r, TRACK.y + TRACK.h / 2 - THUMB.r, Z, 2 * THUMB.r, 2 * THUMB.r, THUMB.h, THUMB.r)} paint={mine} />
        </g>
        {/* The grid: every card stands on the page, the ones out of range dim as a group */}
        <RoundBlock shape={roundBox(GRID.x, GRID.y, BASE, GRID.w, GRID.d, GRID.h, 8)} paint={body} />
        {CARDS.map((card) => {
          const match = MATCH.has(card.index);
          return (
            <g key={`card-${card.index}`} className={match ? undefined : "isometric218-dim"}>
              <RoundBlock shape={roundBox(card.x, card.y, Z, CARD.w, CARD.d, CARD.h, 4.5)} paint={body} />
              <g transform={`${onTop(Z + CARD.h)} translate(${card.x} ${card.y})`}>
                <rect x={3} y={3} width={CARD.w - 6} height={14} rx={3} className={body.ink} />
                <rect x={3} y={19.6} width={11} height={2.3} rx={1.15} className={body.ink} />
                <rect x={3} y={23.6} width={10} height={4} rx={2} className={match && accent ? mine.base : body.ink} />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
