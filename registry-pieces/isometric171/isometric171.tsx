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

interface Isometric171Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color one of the riders with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric171Demo: Isometric171Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const MAT = 3;
const PIVOT_Z = 28;
const ARM = 62;
const TILT = 22;
const PERIOD = 4.6;

type Vec = [number, number, number];
const screen = ([x, y, z]: Vec) => [(x - y) * C, (x + y) * S - z] as const;
/** A CSS/SVG matrix that draws local (u, v) onto the plane through o spanned by a and b. */
function frame(o: Vec, a: Vec, b: Vec) {
  const [e, f] = screen(o);
  const [m0, m1] = screen(a);
  const [m2, m3] = screen(b);
  return `matrix(${[m0, m1, m2, m3].map((n) => n.toFixed(3)).join(", ")}, ${e.toFixed(2)}, ${f.toFixed(2)})`;
}

// Everything on the beam is a box in beam space: x along the beam, y across it, z above the pivot
interface Part {
  id: string;
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
}
const BEAM: Part = { id: "beam", x: -ARM, y: -7, z: -2, w: ARM * 2, d: 14, h: 4 };
const SEAT_L: Part = { id: "seatl", x: -58, y: -7, z: 2, w: 15, d: 14, h: 13 };
const SEAT_R: Part = { id: "seatr", x: 43, y: -7, z: 2, w: 15, d: 14, h: 13 };
const GRIP_L: Part = { id: "gripl", x: -38, y: -6, z: 2, w: 3, d: 12, h: 9 };
const GRIP_R: Part = { id: "gripr", x: 35, y: -6, z: 2, w: 3, d: 12, h: 9 };
const PARTS = [BEAM, SEAT_L, SEAT_R, GRIP_L, GRIP_R];

/** The three visible faces of a part with the beam tipped by an angle in degrees (positive lifts the +x end). */
function faces(part: Part, angle: number) {
  const t = (angle * Math.PI) / 180;
  const along: Vec = [Math.cos(t), 0, Math.sin(t)];
  const up: Vec = [-Math.sin(t), 0, Math.cos(t)];
  const down: Vec = [-up[0], 0, -up[2]];
  const at = (x: number, y: number, z: number): Vec => [along[0] * x + up[0] * z, y, PIVOT_Z + along[2] * x + up[2] * z];
  const top = part.z + part.h;
  return {
    front: frame(at(part.x, part.y + part.d, top), along, down),
    top: frame(at(part.x, part.y, top), along, [0, 1, 0]),
    end: frame(at(part.x + part.w, part.y, top), [0, 1, 0], down),
  };
}
type Face = keyof ReturnType<typeof faces>;
const FACES: Face[] = ["front", "top", "end"];

const ease = (k: number) => (1 - Math.cos(Math.PI * k)) / 2;
const swing = (from: number, to: number, start: number, end: number): [number, number][] =>
  Array.from({ length: 21 }, (_, index) => [start + ((end - start) * index) / 20, from + (to - from) * ease(index / 20)]);
// Tips over, settles softly, rests, and tips back
const TIMELINE: [number, number][] = [[0, TILT], ...swing(TILT, -TILT, 4, 46), ...swing(-TILT, TILT, 54, 96), [100, TILT]];
const REST = Object.fromEntries(PARTS.map((part) => [part.id, faces(part, TILT)]));

const STYLES = `
${PARTS.flatMap((part) => FACES.map((face) => `@keyframes isometric171-${part.id}-${face} { ${TIMELINE.map(([at, angle]) => `${at.toFixed(1)}% { transform: ${faces(part, angle)[face]}; }`).join(" ")} }
.isometric171-${part.id}-${face} { animation: isometric171-${part.id}-${face} ${PERIOD}s linear infinite; }`)).join("\n")}
.isometric171-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric171-tilt * { animation: none; } }
`;

function Solid({ part, paint, children }: { part: Part; paint: Paint; children?: React.ReactNode }) {
  const rest = REST[part.id];
  if (!rest) return null;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <g className={`isometric171-${part.id}-end`} transform={rest.end}>
        <rect width={part.d} height={part.h} vectorEffect="non-scaling-stroke" className={paint.base} />
        <rect width={part.d} height={part.h} className={paint.right} stroke="none" />
      </g>
      <g className={`isometric171-${part.id}-front`} transform={rest.front}>
        <rect width={part.w} height={part.h} vectorEffect="non-scaling-stroke" className={paint.base} />
        <rect width={part.w} height={part.h} className={paint.left} stroke="none" />
        {children}
      </g>
      <g className={`isometric171-${part.id}-top`} transform={rest.top}>
        <rect width={part.w} height={part.d} vectorEffect="non-scaling-stroke" className={paint.base} />
      </g>
    </g>
  );
}

// One A-shaped support plate standing in the plane y = y0, 3 thick toward -y
function Plate({ y0, paint, pin }: { y0: number; paint: Paint; pin: string }) {
  const foot = MAT + 5;
  const top = PIVOT_Z + 5;
  const front: Point[] = [[-15, y0, foot], [15, y0, foot], [5, y0, top], [-5, y0, top]];
  const slope: Point[] = [[15, y0, foot], [15, y0 - 3, foot], [5, y0 - 3, top], [5, y0, top]];
  const cap: Point[] = [[-5, y0, top], [5, y0, top], [5, y0 - 3, top], [-5, y0 - 3, top]];
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={polygon(slope)} className={paint.base} />
      <polygon points={polygon(slope)} className={paint.right} stroke="none" />
      <polygon points={polygon(cap)} className={paint.base} />
      <polygon points={polygon(front)} className={paint.base} />
      <polygon points={polygon(front)} className={paint.left} stroke="none" />
      <g transform={onLeft(y0)} stroke="none">
        <circle cx={0} cy={-PIVOT_Z} r={3.5} className={pin} />
      </g>
    </g>
  );
}

export function Isometric171({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric171Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric171-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-86 -100 172 154" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-74, -20, 0, 148, 40, MAT)} paint={body} />
        <g transform={onTop(MAT)} className={body.ink}>
          <rect x={-70} y={-16} width={24} height={32} rx={3} />
          <rect x={46} y={-16} width={24} height={32} rx={3} />
        </g>
        <Block faces={box(-20, -16, MAT, 40, 32, 5)} paint={body} />
        <Plate y0={-9} paint={body} pin={body.ink} />
        <g className="isometric171-tilt">
          <Solid part={BEAM} paint={body} />
          <Solid part={SEAT_L} paint={body}>
            <rect x={4} y={4} width={7} height={5} rx={1.5} className={body.ink} stroke="none" />
          </Solid>
          <Solid part={GRIP_L} paint={body} />
          <Solid part={GRIP_R} paint={body} />
          <Solid part={SEAT_R} paint={paint.accent}>
            <rect x={4} y={4} width={7} height={5} rx={1.5} className={paint.accent.ink} stroke="none" />
          </Solid>
        </g>
        <Plate y0={12} paint={body} pin={paint.accent.base} />
      </svg>
    </div>
  );
}
