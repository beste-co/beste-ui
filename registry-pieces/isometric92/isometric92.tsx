"use client";

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

interface Isometric92Props {
  /** The temperature the ring climbs to. */
  temperature?: number;
  /** Shown after the number, like ° or °F. */
  unit?: string;
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Light the dial ring in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric92Demo: Isometric92Props = {
  temperature: 21,
  unit: "°",
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const FLOOR = 8;
const WALL = 12;
const CX = 48;
const CZ = 52;
const R = 34;
const DEPTH = 8;
const FACE = WALL + DEPTH;
// Depth slices of the round unit, back to front
const SLICES = Array.from({ length: DEPTH }, (_, index) => WALL + index);
const TICKS = 33;
const LIT = 24;
const angleOf = (index: number) => -135 + (270 * index) / (TICKS - 1);
const onAt = (index: number) => 8 + (index * 40) / LIT;

const TICK_KEYS = Array.from(
  { length: LIT },
  (_, index) =>
    `@keyframes isometric92-t${index} { 0%, ${onAt(index).toFixed(1)}% { opacity: 0; } ${(onAt(index) + 2).toFixed(1)}%, 84% { opacity: 1; } 92%, 100% { opacity: 0; } }\n.isometric92-t${index} { animation: isometric92-t${index} 6s linear infinite; }`,
).join("\n");

const STYLES = `
${TICK_KEYS}
@keyframes isometric92-from { 0%, 30% { opacity: 1; } 36%, 94% { opacity: 0; } 100% { opacity: 1; } }
@keyframes isometric92-to { 0%, 34% { opacity: 0; } 40%, 88% { opacity: 1; } 94%, 100% { opacity: 0; } }
.isometric92-from { animation: isometric92-from 6s ease-in-out infinite; }
.isometric92-to { animation: isometric92-to 6s ease-in-out infinite; }
.isometric92-still * { animation: none !important; }
.isometric92-still .isometric92-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric92 * { animation: none !important; } .isometric92-rest { opacity: 1; } }
`;

export function Isometric92({
  temperature = 21,
  unit = "°",
  tone = "color", color = DEFAULT_COLOR,
  palette: paletteProp = "theme",
  accent: accentProp = true,
  animated = true,
  className,
}: Isometric92Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const lit = accent ? paint.accent.base : palette === "tone" ? "fill-white" : palette === "dark" ? "fill-zinc-100" : "fill-zinc-900";
  const label = palette === "tone" ? "fill-black/70" : palette === "dark" ? "fill-zinc-100" : palette === "light" ? "fill-zinc-900" : "fill-foreground";
  const text = (value: number, extra: string) => (
    <text x={CX} y={-CZ + 1} textAnchor="middle" dominantBaseline="central" fontSize={18} className={cn("font-medium opacity-0", label, extra)}>
      {value}
      {unit}
    </text>
  );

  return (
    <div className={cn("isometric92 relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric92-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-46 -96 138 170" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, 96, 44, FLOOR)} paint={paint.body} />
        <Block faces={box(0, 0, FLOOR, 96, WALL, 84)} paint={paint.body} />
        {SLICES.map((y) => (
          <g key={y} transform={onLeft(y + 1)}>
            <circle cx={CX} cy={-CZ} r={R} className={paint.body.base} />
            <circle cx={CX} cy={-CZ} r={R} className={paint.body.right} />
          </g>
        ))}
        <g transform={onLeft(FACE)}>
          <circle cx={CX} cy={-CZ} r={R} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(paint.body.base, paint.body.edge)} />
          <circle cx={CX} cy={-CZ} r={R - 3} className={paint.body.ink} />
          <circle cx={CX} cy={-CZ} r={R - 5} className={paint.body.base} />
          {Array.from({ length: TICKS }, (_, index) => (
            <g key={index} transform={`rotate(${angleOf(index).toFixed(1)} ${CX} ${-CZ})`}>
              <rect x={CX - 1.2} y={-CZ - 25} width={2.4} height={7} rx={1} className={paint.body.ink} />
              {index < LIT && <rect x={CX - 1.2} y={-CZ - 25} width={2.4} height={7} rx={1} className={cn("opacity-0 isometric92-rest", `isometric92-t${index}`, lit)} />}
            </g>
          ))}
          {text(temperature - 3, "isometric92-from")}
          {text(temperature, "isometric92-to isometric92-rest")}
        </g>
      </svg>
    </div>
  );
}
