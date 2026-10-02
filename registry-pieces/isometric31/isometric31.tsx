"use client";

import { type CSSProperties, useId } from "react";
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

interface Isometric31Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Pour the coffee in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric31Demo: Isometric31Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;
const at = (x: number, y: number, z = 0) => `translate(${project([x, y, z]).replace(",", " ")})`;

/** An upright cylinder around (x, y) in plan; r2 sets a different top radius for a taper. */
function Cylinder({ x = 0, y = 0, z, h, r, r2 = r, paint, lid = true }: { x?: number; y?: number; z: number; h: number; r: number; r2?: number; paint: Paint; lid?: boolean }) {
  const [bx, by, tx, ty] = [r * ELLIPSE_X, r * ELLIPSE_Y, r2 * ELLIPSE_X, r2 * ELLIPSE_Y].map((n) => +n.toFixed(2));
  const top = -z - h;
  const bottom = -z;
  const left = `M${-tx} ${top} L${-bx} ${bottom} A${bx} ${by} 0 0 0 0 ${bottom + by} L0 ${top + ty} A${tx} ${ty} 0 0 1 ${-tx} ${top} Z`;
  const right = `M${tx} ${top} L${bx} ${bottom} A${bx} ${by} 0 0 1 0 ${bottom + by} L0 ${top + ty} A${tx} ${ty} 0 0 0 ${tx} ${top} Z`;
  return (
    <g transform={at(x, y)} className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      {lid && <ellipse cx={0} cy={top} rx={tx} ry={ty} className={paint.base} />}
    </g>
  );
}

const CUP_Z = 11;
const CUP_H = 32;
const RIM = CUP_Z + CUP_H;
const COFFEE = RIM - 5;
const INNER = 25.5 * ELLIPSE_X;
const INNER_Y = 25.5 * ELLIPSE_Y;
// The handle faces the viewer (plane x + y = 0), so it is drawn in screen space
const HANDLE = "M20 -40 H33 A12 12 0 0 1 45 -28 A12 12 0 0 1 33 -16 H20 Z M20 -34 H33 A6 6 0 0 1 33 -22 H20 Z";

const WISPS = [
  { d: "M-13 -52 c-5 -7 5 -12 0 -19 c-4 -5 3 -9 0 -14", delay: 0 },
  { d: "M1 -56 c-6 -8 6 -14 0 -22 c-4 -6 4 -10 0 -16", delay: 1.5 },
  { d: "M14 -51 c-5 -7 5 -12 0 -19 c-4 -5 3 -9 0 -14", delay: 3 },
];

const STEAM: Record<Palette, string> = {
  theme: "stroke-foreground/15",
  light: "stroke-zinc-950/15",
  dark: "stroke-zinc-500",
  tone: "stroke-current/50",
};

const STYLES = `
@keyframes isometric31-steam { 0% { transform: translateY(10px) scaleY(0.7); opacity: 0; } 35% { opacity: 1; } 100% { transform: translateY(-12px) scaleY(1.1); opacity: 0; } }
.isometric31-wisp { animation: isometric31-steam 4.5s ease-out infinite both; transform-box: fill-box; transform-origin: center; will-change: transform, opacity; }
.isometric31-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric31-wisp { animation: none; } }
`;

export function Isometric31({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric31Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric31-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-64 -98 128 136" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <ellipse cx={0} cy={-RIM} rx={INNER} ry={INNER_Y} />
          </clipPath>
        </defs>
        <Cylinder z={0} h={3} r={30} paint={body} />
        <Cylinder z={3} h={5} r={38} r2={48} paint={body} />
        <g transform={onTop(8)} className={body.ink}>
          <path d="M-30 0 A30 30 0 1 0 30 0 A30 30 0 1 0 -30 0 Z M-26 0 A26 26 0 1 1 26 0 A26 26 0 1 1 -26 0 Z" fillRule="evenodd" />
        </g>
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <path d={HANDLE} transform="translate(0 3)" fillRule="evenodd" className={body.base} />
          <path d={HANDLE} transform="translate(0 3)" fillRule="evenodd" className={body.right} stroke="none" />
          <path d={HANDLE} fillRule="evenodd" className={body.base} />
          <path d={HANDLE} fillRule="evenodd" className={body.left} stroke="none" />
        </g>
        <Cylinder z={8} h={3} r={16} paint={body} />
        <Cylinder z={CUP_Z} h={CUP_H} r={20} r2={28} paint={body} />
        <g className={body.edge} strokeWidth={1}>
          <ellipse cx={0} cy={-RIM} rx={INNER} ry={INNER_Y} className={body.base} />
          <ellipse cx={0} cy={-RIM} rx={INNER} ry={INNER_Y} className={body.right} stroke="none" />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <ellipse cx={0} cy={-COFFEE} rx={INNER} ry={INNER_Y} className={accent ? paint.accent.base : body.base} />
          <g transform={onTop(COFFEE)} className={accent ? paint.accent.ink : body.ink}>
            <path d="M0 8 C-6 2 -12 -2 -12 -7 C-12 -11 -8 -13 -5 -12 C-3 -11 -1 -9 0 -7 C1 -9 3 -11 5 -12 C8 -13 12 -11 12 -7 C12 -2 6 2 0 8 Z" transform="rotate(-45)" />
          </g>
        </g>
        {WISPS.map((wisp) => (
          <path
            key={wisp.delay}
            d={wisp.d}
            fill="none"
            strokeWidth={4}
            strokeLinecap="round"
            className={cn("isometric31-wisp", STEAM[palette])}
            style={{ animationDelay: `${wisp.delay - 4.5}s` } as CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}
