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

interface Isometric75Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the slate stripes with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric75Demo: Isometric75Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 104;
const D = 12;
const H = 68;
const BAND = 12;
const STICK = 12;
// Stripes slanted one way on the board and the other way on the stick
const stripes = (top: number, height: number, lean: number) =>
  Array.from({ length: 7 }, (_, index) => {
    const x = 4 + index * 16;
    return `M${x} ${top}h8l${lean} ${height}h-8Z`;
  }).join("");

const SLICES = Array.from({ length: 2 * D + 1 }, (_, index) => index / 2);
const STYLES = `
@keyframes isometric75-clap { 0%, 12% { transform: rotate(-18deg); } 30% { transform: rotate(0deg); } 34% { transform: rotate(-3deg); } 38%, 72% { transform: rotate(0deg); } 100% { transform: rotate(-18deg); } }
.isometric75-stick { animation: isometric75-clap 4s cubic-bezier(0.6, 0, 0.9, 0.4) infinite; transform-box: fill-box; transform-origin: center; }
.isometric75-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric75-stick { animation: none; } }
`;

export function Isometric75({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric75Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const band = useId();
  const stick = useId();
  const paint = paints(palette, accent, tone, color);
  const stripe = accent ? paint.accent.base : palette === "tone" ? "fill-black/30" : paint.body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric75-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-26 -116 130 178" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={band}>
            <rect x={0} y={-H} width={W} height={BAND} />
          </clipPath>
          <clipPath id={stick}>
            <rect x={0} y={-STICK} width={W} height={STICK} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, W, D, H)} paint={paint.body} />
        <g transform={onLeft(D)}>
          <g clipPath={`url(#${band})`}>
            <path d={stripes(-H, BAND, -6)} className={stripe} />
          </g>
          <g className={paint.body.ink}>
            <rect x={8} y={-H + BAND + 8} width={W - 16} height={2} />
            <rect x={8} y={-H + BAND + 26} width={W - 16} height={2} />
            <rect x={W / 2 - 1} y={-H + BAND + 10} width={2} height={16} />
            <rect x={8} y={-H + BAND + 34} width={W - 16} height={2} />
            <rect x={14} y={-H + BAND + 14} width={20} height={4} rx={2} />
            <rect x={W / 2 + 8} y={-H + BAND + 14} width={14} height={4} rx={2} />
            <rect x={14} y={-H + BAND + 42} width={40} height={4} rx={2} />
            <rect x={14} y={-H + BAND + 50} width={28} height={3} rx={1.5} />
          </g>
        </g>
        {/* The stick is cut into thin upright slices so it turns as one solid: an outline pass first, then the fills */}
        {[true, false].flatMap((outline) =>
          SLICES.map((y) => {
            const front = y === D;
            return (
              <g key={`${outline}-${y}`} transform={onLeft(y)}>
                <g transform={`translate(0 ${-H})`}>
                  <g className="isometric75-stick" transform="rotate(-18)">
                    <rect x={-W} y={-STICK} width={W * 2} height={STICK * 2} fill="none" stroke="none" />
                    {outline ? (
                      <rect x={0} y={-STICK} width={W} height={STICK} fill="none" strokeWidth={2} className={paint.body.edge} />
                    ) : (
                      <>
                        <rect x={0} y={-STICK} width={W} height={STICK} className={paint.body.base} />
                        {/* The far end of each slice shows as the stick's shaded end face */}
                        <rect x={W - 1.5} y={-STICK} width={1.5} height={STICK} className={paint.body.right} />
                        {front && (
                          <>
                            <rect x={0} y={-STICK} width={W} height={STICK} className={paint.body.left} />
                            <g clipPath={`url(#${stick})`}>
                              <path d={stripes(-STICK, STICK, 6)} className={stripe} />
                            </g>
                            <circle cx={6} cy={-STICK / 2} r={2.5} className={paint.body.ink} />
                          </>
                        )}
                      </>
                    )}
                  </g>
                </g>
              </g>
            );
          }),
        )}
      </svg>
    </div>
  );
}
