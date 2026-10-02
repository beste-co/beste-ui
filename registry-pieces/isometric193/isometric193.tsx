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

interface Isometric193Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the selected day, the event card details and the calendar block with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric193Demo: Isometric193Props = {
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
// The phone stands on its bottom front edge and leans back by this much
const LEAN = (14 * Math.PI) / 180;
const FOOT = { x: 18, y: 46, z: BASE + 3 };
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
/** The matrix that lays local (across, down) units onto the leaning plane `depth` behind the glass, starting `rise` up the phone. */
function plane(depth: number, rise: number, left = 0) {
  const origin: Point = [FOOT.x + left, FOOT.y + UP[1] * rise + BACK[1] * depth, FOOT.z + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
const GLASS = plane(0, TALL);
// Behind the glass the body is a stack of thin layers, far to near
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
// The rest behind the phone: a little wider, half as tall
const REST = { side: 4, tall: 62, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);

const PERIOD = 9;
// The month grid, and the day that gets picked
const GRID = { x: 9.4, y: 37, dx: 7.55, dy: 8.6, cols: 7, rows: 5 };
const DAYS = Array.from({ length: GRID.cols * GRID.rows }, (_, index) => ({ col: index % GRID.cols, row: Math.floor(index / GRID.cols) }));
const PICK = { col: 3, row: 2 };
const BUSY = [4, 9, 20, 26];
// The event card that slides up over the lower part of the screen
const SHEET = { y: 66, h: TALL - 69 };
const HIDE = SHEET.h + 6;
const DESK_CAL = { x: 97, y: 36, w: 11, d: 16, h: 13 };

const STYLES = `
@keyframes isometric193-pick { 0%, 8% { opacity: 0; } 15%, 90% { opacity: 1; } 97%, 100% { opacity: 0; } }
@keyframes isometric193-sheet { 0%, 20% { transform: translateY(${HIDE}px); } 32%, 84% { transform: translateY(0px); } 94%, 100% { transform: translateY(${HIDE}px); } }
.isometric193-pick { animation: isometric193-pick ${PERIOD}s ease-in-out infinite; }
.isometric193-sheet { animation: isometric193-sheet ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
.isometric193-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric193-scene * { animation: none !important; } }
`;

export function Isometric193({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric193Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const pick = accent ? mine.base : body.base;
  const cal = box(DESK_CAL.x, DESK_CAL.y, BASE, DESK_CAL.w, DESK_CAL.d, DESK_CAL.h);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric193-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 176 216" aria-hidden="true" className="isometric193-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 114, 72, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />
        {/* The rest the phone leans against, then the phone itself, each built from thin layers back to front */}
        {REST_LAYERS.map((depth, index) => (
          <g key={`rest-${depth}`} transform={plane(depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={`layer-${depth}`} transform={plane(depth, TALL)}>
            <rect width={W} height={TALL} rx={9} className={body.base} />
            <rect width={W} height={TALL} rx={9} className={body.right} />
            {depth > 1 && depth < 5 && <rect x={W - 0.5} y={30} width={1.6} height={16} rx={0.8} className={body.ink} />}
          </g>
        ))}
        <g transform={GLASS}>
          <rect width={W} height={TALL} rx={9} strokeWidth={1} className={cn(body.base, body.edge)} />
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          {/* Header: the month and the two arrows */}
          <rect x={7} y={17} width={24} height={3.6} rx={1.8} className={body.base} />
          <circle cx={47} cy={18.8} r={2.6} className={cn(body.base, "opacity-60")} />
          <circle cx={54.5} cy={18.8} r={2.6} className={cn(body.base, "opacity-60")} />
          {/* The month: a row of weekday marks and five weeks of days */}
          <rect x={5.5} y={25} width={W - 11} height={55} rx={5} className={cn(body.base, "opacity-40")} />
          {Array.from({ length: GRID.cols }, (_, col) => (
            <rect key={`weekday-${col}`} x={GRID.x + col * GRID.dx - 1.6} y={28.6} width={3.2} height={1.6} rx={0.8} className={body.ink} />
          ))}
          {DAYS.map(({ col, row }, index) => (
            <g key={`day-${col}-${row}`}>
              <circle cx={GRID.x + col * GRID.dx} cy={GRID.y + row * GRID.dy} r={2.3} className={body.base} />
              {BUSY.includes(index) && <circle cx={GRID.x + col * GRID.dx} cy={GRID.y + row * GRID.dy + 3.7} r={0.8} className={pick} />}
            </g>
          ))}
          <circle cx={GRID.x + PICK.col * GRID.dx} cy={GRID.y + PICK.row * GRID.dy} r={3.5} className={cn("isometric193-pick", accent ? mine.base : body.ink)} />
          <rect x={7} y={85} width={30} height={3} rx={1.5} className={body.base} />
          <rect x={7} y={91.5} width={W - 14} height={9} rx={3} className={cn(body.base, "opacity-60")} />
          <rect x={7} y={103} width={W - 14} height={9} rx={3} className={cn(body.base, "opacity-60")} />
          {/* The event card slides up from the bottom of the screen */}
          <g clipPath={`url(#${clipId})`}>
            <g className="isometric193-sheet">
              <rect x={3} y={SHEET.y} width={W - 6} height={SHEET.h + 8} rx={7} strokeWidth={0.9} className={cn(body.base, body.edge)} />
              <rect x={W / 2 - 6} y={SHEET.y + 3} width={12} height={1.6} rx={0.8} className={body.ink} />
              <rect x={8} y={SHEET.y + 9} width={2.6} height={13} rx={1.3} className={accent ? mine.base : body.ink} />
              <rect x={14} y={SHEET.y + 9.5} width={28} height={3.2} rx={1.6} className={body.ink} />
              <rect x={14} y={SHEET.y + 15} width={18} height={2.4} rx={1.2} className={body.ink} />
              <rect x={14} y={SHEET.y + 19.6} width={12} height={2.4} rx={1.2} className={body.ink} />
              {[0, 1, 2].map((guest) => (
                <circle key={`guest-${guest}`} cx={49 + guest * 3.6 - 3.6} cy={SHEET.y + 13} r={2.8} className={body.ink} />
              ))}
              <rect x={8} y={SHEET.y + 28} width={W - 16} height={10} rx={5} className={accent ? mine.base : body.ink} />
              <rect x={24} y={SHEET.y + 31.7} width={16} height={2.6} rx={1.3} className={accent ? mine.ink : body.base} />
            </g>
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* A desk calendar block beside the stand, its header in the accent */}
        <Block faces={cal} paint={body} />
        <g transform={onLeft(DESK_CAL.y + DESK_CAL.d)}>
          <rect x={DESK_CAL.x} y={-BASE - DESK_CAL.h} width={DESK_CAL.w} height={3.6} className={accent ? mine.base : body.ink} />
          {[0, 1, 2].map((col) =>
            [0, 1].map((row) => <rect key={`cal-${col}-${row}`} x={DESK_CAL.x + 1.6 + col * 3} y={-BASE - DESK_CAL.h + 5.6 + row * 3} width={1.8} height={1.8} rx={0.5} className={body.ink} />),
          )}
        </g>
      </svg>
    </div>
  );
}
