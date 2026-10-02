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

interface Isometric66Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the solar cells with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric66Demo: Isometric66Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const G = 8;
// Panels tilt up toward the back: the front edge sits at y = FRONT, z = LOW
const FRONT = 60;
const DEPTH = 44;
const LOW = 26;
const RISE = 30;
const T = 3;
const PW = 38;
const PANELS = [0, 42, 84];
const LEGS = [4, 44, 84, 120];
const toScreen = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
const [OX, OY] = toScreen([0, FRONT, LOW]);
// Maps (u along x, v up the slope) onto the tilted panel plane
const ON_PANEL = `matrix(${C} ${S} ${C} ${(-S - RISE / DEPTH).toFixed(3)} ${OX.toFixed(1)} ${OY.toFixed(1)})`;
const CELLS = [0, 1, 2].flatMap((col) => [0, 1, 2, 3].map((row) => ({ u: 2.5 + col * 11.5, v: 2.5 + row * 10, key: `${col}-${row}` })));

function panelFaces(x: number) {
  const b = FRONT - DEPTH;
  return {
    top: polygon([[x, b, LOW + RISE], [x + PW, b, LOW + RISE], [x + PW, FRONT, LOW], [x, FRONT, LOW]]),
    front: polygon([[x, FRONT, LOW], [x + PW, FRONT, LOW], [x + PW, FRONT, LOW - T], [x, FRONT, LOW - T]]),
    side: polygon([[x + PW, b, LOW + RISE], [x + PW, FRONT, LOW], [x + PW, FRONT, LOW - T], [x + PW, b, LOW + RISE - T]]),
  };
}

const STYLES = `
@keyframes isometric66-glint { 0%, 20% { transform: translateX(0); } 70%, 100% { transform: translateX(170px); } }
.isometric66-glint { animation: isometric66-glint 4.6s cubic-bezier(0.45, 0, 0.35, 1) infinite; will-change: transform; }
.isometric66-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric66-glint { animation: none; } }
`;

export function Isometric66({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric66Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const cells = accent ? paint.accent.base : paint.body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric66-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-74 -58 184 162" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            {PANELS.map((x) => (
              <polygon key={x} points={panelFaces(x).top} />
            ))}
          </clipPath>
        </defs>
        <Block faces={box(-6, 8, 0, 134, 64, G)} paint={paint.body} />
        {LEGS.map((x) => (
          <Block key={x} faces={box(x, FRONT - DEPTH + 6, G, 4, 4, LOW + RISE - G - 8)} paint={paint.body} />
        ))}
        {LEGS.map((x) => (
          <Block key={x} faces={box(x, FRONT - 8, G, 4, 4, LOW - G - 4)} paint={paint.body} />
        ))}
        <Block faces={box(0, FRONT - 8, LOW - 6, 122, 4, 3)} paint={paint.body} />
        {PANELS.map((x) => {
          const faces = panelFaces(x);
          return (
            <g key={x} className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
              <polygon points={faces.side} className={paint.body.base} />
              <polygon points={faces.side} className={paint.body.right} stroke="none" />
              <polygon points={faces.front} className={paint.body.base} />
              <polygon points={faces.front} className={paint.body.left} stroke="none" />
              <polygon points={faces.top} className={paint.body.base} />
              <g transform={ON_PANEL} className={cells}>
                {CELLS.map(({ u, v, key }) => (
                  <rect key={key} x={x + u} y={v} width={10} height={8} rx={1} />
                ))}
              </g>
            </g>
          );
        })}
        <g clipPath={`url(#${clipId})`}>
          <g transform={ON_PANEL}>
            <g className="isometric66-glint">
              <polygon points="-44,0 -30,0 -18,44 -32,44" className="fill-white/50" />
              <polygon points="-26,0 -22,0 -10,44 -14,44" className="fill-white/30" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
