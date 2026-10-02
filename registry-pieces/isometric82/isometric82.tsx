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

interface Isometric82Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Fill the silo with the tone as the grain rises; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric82Demo: Isometric82Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;

/** An upright cylinder centered on the origin in plan, shaded in two halves like a box. */
function Cylinder({ r, z, h, paint }: { r: number; z: number; h: number; paint: Paint }) {
  const rx = r * ELLIPSE_X;
  const ry = r * ELLIPSE_Y;
  const top = -z - h;
  const bottom = -z;
  const left = `M${-rx} ${top} L${-rx} ${bottom} A${rx} ${ry} 0 0 0 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 1 ${-rx} ${top} Z`;
  const right = `M${rx} ${top} L${rx} ${bottom} A${rx} ${ry} 0 0 1 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 0 ${rx} ${top} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      <ellipse cx={0} cy={top} rx={rx} ry={ry} className={paint.base} />
    </g>
  );
}

/** A half sphere sitting on a circle of radius r at height z. */
function Dome({ r, z, paint }: { r: number; z: number; paint: Paint }) {
  const rx = r * ELLIPSE_X;
  const ry = r * ELLIPSE_Y;
  const base = -z;
  const left = `M${-rx} ${base} A${rx} ${rx} 0 0 1 0 ${base - rx} L0 ${base + ry} A${rx} ${ry} 0 0 1 ${-rx} ${base} Z`;
  const right = `M${rx} ${base} A${rx} ${rx} 0 0 0 0 ${base - rx} L0 ${base + ry} A${rx} ${ry} 0 0 0 ${rx} ${base} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
    </g>
  );
}

const G = 8;
const GROUND = box(0, 0, 0, 108, 88, G);
const WALL = 32;
const KNEE = G + WALL + 14;
const RIDGE = G + WALL + 22;
const EAVE = G + WALL - 2;
const face = (points: Point[]) => polygon(points);
// Gambrel profile in (y, z), front eave to back eave
const PROFILE: [number, number][] = [[29, EAVE], [44, KNEE], [55, RIDGE], [66, KNEE], [81, EAVE]];
const GABLE = face([[74, 32, G + WALL], [74, 45, KNEE - 1], [74, 55, RIDGE - 1], [74, 65, KNEE - 1], [74, 78, G + WALL]]);
const slope = (from: number, to: number) => {
  const [y1, z1] = PROFILE[from];
  const [y2, z2] = PROFILE[to];
  return face([[10, y1, z1], [77, y1, z1], [77, y2, z2], [10, y2, z2]]);
};
const BACK_SLOPE = slope(1, 2);
const TOP_SLOPE = slope(2, 3);
const FRONT_SLOPE = slope(3, 4);
const FASCIA = face([...PROFILE.map(([y, z]): Point => [77, y, z]), ...[...PROFILE].reverse().map(([y, z]): Point => [77, y, z - 3])]);
const SILO = { x: 90, y: 16, r: 13 };
const SILO_AT = `translate(${((SILO.x - SILO.y) * C).toFixed(1)} ${((SILO.x + SILO.y) * S).toFixed(1)})`;
const RING = 12;
const RINGS = [0, 1, 2, 3, 4];
const SILO_H = RINGS.length * RING + 8;

const STYLES = `
${RINGS.map((index) => {
  const on = 6 + index * 12;
  return `@keyframes isometric82-fill${index} { 0%, ${on}% { opacity: 0; transform: translateY(4px); } ${on + 8}%, 84% { opacity: 1; transform: translateY(0); } 94%, 100% { opacity: 0; transform: translateY(0); } }
.isometric82-ring${index} { animation: isometric82-fill${index} 5.6s ease-out infinite; }`;
}).join("\n")}
.isometric82-still * { animation: none !important; }
.isometric82-still .isometric82-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric82-ring { animation: none !important; } .isometric82-rest { opacity: 1; } }
`;

export function Isometric82({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric82Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const grain = accent ? paint.accent : paint.body;
  const line = paint.body.ink.replace("fill-", "stroke-");
  const rx = SILO.r * ELLIPSE_X;
  const ry = SILO.r * ELLIPSE_Y;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric82-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -52 182 156" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={GROUND} paint={paint.body} />
        <g transform={SILO_AT}>
          <Cylinder r={SILO.r + 2} z={G} h={3} paint={paint.body} />
          <Cylinder r={SILO.r} z={G + 3} h={SILO_H} paint={paint.body} />
          {RINGS.map((index) => (
            <g key={index} className={cn("isometric82-ring opacity-0", `isometric82-ring${index}`, index < 3 && "isometric82-rest")}>
              <Cylinder r={SILO.r} z={G + 3 + index * RING} h={RING} paint={grain} />
            </g>
          ))}
          {RINGS.slice(1).map((index) => (
            <path key={index} d={`M${-rx} ${-(G + 3 + index * RING)} A${rx} ${ry} 0 0 0 ${rx} ${-(G + 3 + index * RING)}`} fill="none" strokeWidth={1.5} className={line} />
          ))}
          <Dome r={SILO.r} z={G + 3 + SILO_H} paint={paint.body} />
        </g>
        <Block faces={box(12, 32, G, 62, 46, WALL)} paint={paint.body} />
        <polygon points={GABLE} className={cn(paint.body.base, paint.body.edge)} strokeWidth={1} strokeLinejoin="round" />
        <polygon points={GABLE} className={paint.body.right} />
        <g transform={onRight(74)} className={paint.body.ink}>
          <rect x={44} y={-(G + 24)} width={22} height={24} rx={1} />
          <rect x={51} y={-(G + WALL + 14)} width={8} height={10} rx={1} />
        </g>
        <g transform={onRight(74)} className={paint.body.ink}>
          <polygon points={`44,${-G} 47,${-G} 66,${-(G + 24)} 63,${-(G + 24)}`} />
          <polygon points={`66,${-G} 63,${-G} 44,${-(G + 24)} 47,${-(G + 24)}`} />
        </g>
        <g transform={onLeft(78)} className={paint.body.ink}>
          {[22, 38, 54].map((x) => (
            <rect key={x} x={x} y={-(G + 22)} width={8} height={10} rx={1} />
          ))}
        </g>
        <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={BACK_SLOPE} className={paint.body.base} />
          <polygon points={TOP_SLOPE} className={paint.body.base} />
          <polygon points={FRONT_SLOPE} className={paint.body.base} />
          <polygon points={FRONT_SLOPE} className={paint.body.left} stroke="none" />
          <polygon points={FASCIA} className={paint.body.base} />
          <polygon points={FASCIA} className={paint.body.right} stroke="none" />
        </g>
      </svg>
    </div>
  );
}
