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

interface Isometric199Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color one settings row with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric199Demo: Isometric199Props = {
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
// The phone lies flat on the desk, its top toward the back
const AT = { x: 14, y: 14 };
const PERIOD = 9;
const ROWS = [0, 1, 2, 3, 4];
const ROW = { x: 6, y: 26, w: 52, h: 14, gap: 17 };
const SLIDE = 7;
// The row whose icon and switch take the accent
const MINE = 1;

// Each switch turns on in turn, they hold, and turn back off in the same order
const flip = (row: number, on: string, off: string) => {
  const up = 8 + row * 9;
  const down = 70 + row * 4;
  return `0%, ${up}% { ${off} } ${up + 4}%, ${down}% { ${on} } ${down + 3}%, 100% { ${off} }`;
};

const STYLES = `
${ROWS.map((row) => `@keyframes isometric199-knob${row} { ${flip(row, `transform: translateX(${SLIDE}px);`, "transform: translateX(0);")} }
@keyframes isometric199-on${row} { ${flip(row, "opacity: 1;", "opacity: 0;")} }
.isometric199-knob${row} { animation: isometric199-knob${row} ${PERIOD}s ease-in-out infinite; }
.isometric199-on${row} { animation: isometric199-on${row} ${PERIOD}s ease-in-out infinite; }`).join("\n")}
.isometric199-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric199-scene * { animation: none !important; } }
`;

export function Isometric199({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric199Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const top = BASE + THICK;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric199-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-138 -22 228 158" aria-hidden="true" className="isometric199-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, W + 2 * AT.x, TALL + 2 * AT.y, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(AT.x, AT.y, BASE, W, TALL, THICK, 9)} paint={body} />
        {/* The side button on the phone's right edge */}
        <g transform={onRight(AT.x + W)} className={body.ink}>
          <rect x={AT.y + 30} y={-(BASE + 4)} width={16} height={1.8} rx={0.9} />
        </g>
        <g transform={`${onTop(top)} translate(${AT.x} ${AT.y})`}>
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          <rect x={7} y={16} width={24} height={3.6} rx={1.8} className={body.base} />
          {/* Settings rows: an icon, a label and a switch each */}
          {ROWS.map((row) => {
            const y = ROW.y + row * ROW.gap;
            const lit = accent && row === MINE;
            return (
              <g key={`row-${row}`}>
                <rect x={ROW.x} y={y} width={ROW.w} height={ROW.h} rx={4} className={body.base} />
                <rect x={ROW.x + 3} y={y + 3} width={8} height={8} rx={2.5} className={lit ? mine.base : body.ink} />
                <rect x={ROW.x + 14} y={y + 3.6} width={row % 2 ? 15 : 18} height={2.8} rx={1.4} className={body.ink} />
                <rect x={ROW.x + 14} y={y + 8.4} width={row % 2 ? 12 : 9} height={2.2} rx={1.1} className={cn(body.ink, "opacity-60")} />
                <rect x={ROW.x + 35} y={y + 3.5} width={14} height={7} rx={3.5} className={body.ink} />
                <g className={cn(`isometric199-on${row}`, "opacity-0")}>
                  <rect x={ROW.x + 35} y={y + 3.5} width={14} height={7} rx={3.5} className={lit ? mine.base : body.ink} />
                  {!lit && <rect x={ROW.x + 35} y={y + 3.5} width={14} height={7} rx={3.5} className={body.ink} />}
                </g>
                <circle cx={ROW.x + 38.5} cy={y + 7} r={2.6} strokeWidth={0.6} className={cn(`isometric199-knob${row}`, body.base, body.edge)} />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
