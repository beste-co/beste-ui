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

interface Isometric81Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the tractor with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric81Demo: Isometric81Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const FIELD = box(0, 0, 0, 120, 92, 10);
const GROUND = 10;
const ROWS = [6, 20, 82];
const LANE = 36;
const RIDGE = 8;
const X0 = 26;

type Rod = ReturnType<typeof rod>;

/** A round rod lying along x or y from a to b, centered on (u, z) in the other two axes. */
function rod(axis: "x" | "y", a: number, b: number, u: number, z: number, r: number) {
  const at = (t: number, degrees: number): Point => {
    const angle = (degrees * Math.PI) / 180;
    const du = r * Math.cos(angle);
    const dz = r * Math.sin(angle);
    return axis === "x" ? [t, u + du, z + dz] : [u + du, t, z + dz];
  };
  const arc = (t: number, from: number, to: number) => Array.from({ length: 13 }, (_, k) => at(t, from + ((to - from) * k) / 12));
  const band = (from: number, to: number) => polygon([...arc(a, from, to), ...arc(b, from, to).reverse()]);
  return { axis, side: band(-45, 135), shade: band(-45, 45), cap: polygon(Array.from({ length: 36 }, (_, k) => at(b, k * 10))) };
}

function RodBlock({ shape, paint }: { shape: Rod; paint: Paint }) {
  const along = shape.axis === "y";
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.shade} className={along ? paint.right : paint.left} stroke="none" />
      <polygon points={shape.cap} className={paint.base} />
      <polygon points={shape.cap} className={along ? paint.left : paint.right} stroke="none" />
    </g>
  );
}

const STYLES = `
@keyframes isometric81-drive { 0% { transform: translate(-20.8px, -12px); opacity: 0; } 8% { opacity: 1; } 38%, 62% { transform: translate(0, 0); opacity: 1; } 92% { opacity: 1; } 100% { transform: translate(20.8px, 12px); opacity: 0; } }
.isometric81-tractor { animation: isometric81-drive 6s cubic-bezier(0.45, 0, 0.55, 1) infinite; will-change: transform, opacity; }
.isometric81-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric81-tractor { animation: none; } }
`;

function Wheel({ x, y, z, r, paint, hub }: { x: number; y: number; z: number; r: number; paint: Paint; hub: string }) {
  return (
    <g>
      <RodBlock shape={rod("y", y, y + 8, x, z, r)} paint={paint} />
      <g transform={onLeft(y + 8)} className={hub}>
        <circle cx={x} cy={-z} r={r * 0.45} />
      </g>
    </g>
  );
}

export function Isometric81({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric81Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const hub = accent ? paint.accent.base : paint.body.ink;
  const y = LANE;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric81-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-84 -42 192 152" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={FIELD} paint={paint.body} />
        <g transform={onTop(GROUND)} className={paint.body.ink}>
          <rect x={6} y={LANE + 6} width={108} height={3} rx={1.5} />
          <rect x={6} y={LANE + 37} width={108} height={3} rx={1.5} />
        </g>
        {ROWS.filter((row) => row < LANE).map((row) => (
          <g key={row}>
            <Block faces={box(4, row, GROUND, 112, RIDGE, 4)} paint={paint.body} />
            <g transform={onTop(GROUND + 4)} className={paint.body.ink}>
              {Array.from({ length: 9 }, (_, index) => (
                <rect key={index} x={10 + index * 12} y={row + 2} width={6} height={4} rx={2} />
              ))}
            </g>
          </g>
        ))}
        <g className="isometric81-tractor">
          <Wheel x={X0 + 14} y={y} z={GROUND + 18} r={18} paint={paint.body} hub={hub} />
          <Wheel x={X0 + 58} y={y + 4} z={GROUND + 10} r={10} paint={paint.body} hub={hub} />
          <Block faces={box(X0 + 2, y + 8, GROUND + 10, 26, 28, 16)} paint={paint.accent} />
          <Block faces={box(X0 + 28, y + 12, GROUND + 10, 38, 20, 16)} paint={paint.accent} />
          <g transform={onTop(GROUND + 26)} className={paint.accent.ink}>
            {[15, 20, 25].map((offset) => (
              <rect key={offset} x={X0 + 40} y={y + offset} width={22} height={2} rx={1} />
            ))}
          </g>
          <Block faces={box(X0 + 54, y + 16, GROUND + 26, 4, 4, 14)} paint={paint.body} />
          <Block faces={box(X0 + 5, y + 10, GROUND + 26, 20, 24, 22)} paint={paint.body} />
          <g transform={onLeft(y + 34)} className={paint.body.ink}>
            <rect x={X0 + 8} y={-(GROUND + 45)} width={14} height={16} rx={2} />
          </g>
          <g transform={onRight(X0 + 25)} className={paint.body.ink}>
            <rect x={y + 13} y={-(GROUND + 45)} width={18} height={16} rx={2} />
          </g>
          <Block faces={box(X0 + 1, y + 8, GROUND + 48, 28, 28, 4)} paint={paint.accent} />
          <Wheel x={X0 + 14} y={y + 36} z={GROUND + 18} r={18} paint={paint.body} hub={hub} />
          <Wheel x={X0 + 58} y={y + 34} z={GROUND + 10} r={10} paint={paint.body} hub={hub} />
        </g>
        {ROWS.filter((row) => row > LANE).map((row) => (
          <g key={row}>
            <Block faces={box(4, row, GROUND, 112, RIDGE, 4)} paint={paint.body} />
            <g transform={onTop(GROUND + 4)} className={paint.body.ink}>
              {Array.from({ length: 9 }, (_, index) => (
                <rect key={index} x={10 + index * 12} y={row + 2} width={6} height={4} rx={2} />
              ))}
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
