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

interface Isometric154Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Print the part in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric154Demo: Isometric154Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

type Vec = [number, number, number];
type Shade = "base" | "left" | "right";
const VIEW: Vec = [1, 1, 1];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a: Vec): Vec => {
  const length = Math.hypot(a[0], a[1], a[2]);
  return [a[0] / length, a[1] / length, a[2] / length];
};
// Faces turned up read as the top, the rest take the left or right overlay like a box
const shadeOf = (n: Vec): Shade => (n[2] >= n[0] && n[2] >= n[1] ? "base" : n[1] > n[0] ? "left" : "right");

/** A round rod between two points in any direction, shaded in the same bands as a box. */
function tube(a: Vec, b: Vec, r: number, sides = 24) {
  const u = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
  const e1 = unit(cross(u, Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]));
  const e2 = cross(u, e1);
  const around = (t: number): Vec => [
    Math.cos(t) * e1[0] + Math.sin(t) * e2[0],
    Math.cos(t) * e1[1] + Math.sin(t) * e2[1],
    Math.cos(t) * e1[2] + Math.sin(t) * e2[2],
  ];
  const at = (k: number, end: Vec): Point => {
    const n = around((2 * Math.PI * k) / sides);
    return [end[0] + n[0] * r, end[1] + n[1] * r, end[2] + n[2] * r];
  };
  const seen = (k: number) => dot(around((2 * Math.PI * (((k % sides) + sides) % sides + 0.5)) / sides), VIEW) > 0;
  const first = Array.from({ length: sides }, (_, k) => k).find((k) => seen(k) && !seen(k - 1)) ?? 0;
  const run: number[] = [];
  for (let k = first; seen(k) && run.length < sides; k++) run.push(k);
  const strip = (ks: number[]) => {
    const edge = [...ks, (ks[ks.length - 1] ?? 0) + 1];
    return polygon([...edge.map((k) => at(k, a)), ...edge.reverse().map((k) => at(k, b))]);
  };
  const shades: { shade: Shade; points: string }[] = [];
  let group: number[] = [];
  run.forEach((k, index) => {
    group.push(k);
    const shade = shadeOf(around((2 * Math.PI * (k + 0.5)) / sides));
    const next = run[index + 1];
    if (next === undefined || shadeOf(around((2 * Math.PI * (next + 0.5)) / sides)) !== shade) {
      if (shade !== "base") shades.push({ shade, points: strip(group) });
      group = [];
    }
  });
  const front = dot(u, VIEW) > 0;
  const end = front ? b : a;
  const cap = polygon(Array.from({ length: sides }, (_, k) => at(k, end)));
  return { band: strip(run), shades, cap, capShade: shadeOf(front ? u : [-u[0], -u[1], -u[2]]) };
}

function Tube({ shape, paint }: { shape: ReturnType<typeof tube>; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.band} className={paint.base} />
      {shape.shades.map((part) => (
        <polygon key={part.points} points={part.points} className={paint[part.shade]} stroke="none" />
      ))}
      <polygon points={shape.cap} className={paint.base} />
      {shape.capShade !== "base" && <polygon points={shape.cap} className={paint[shape.capShade]} stroke="none" />}
    </g>
  );
}
const BASE = 10;
const BED = BASE + 4;
const PX = 40;
const PY = 38;
const LAYER = 3;
const RADII = [12, 11, 10, 9, 8, 7];
const TIP = BED + RADII.length * LAYER;
const TOP = 82;
const SWEEP = 8;
// The head parks this far above the finished part, so the resting frame shows it
const PARK = 12;
const LAYERS = RADII.map((r, index) => tube([PX, PY, BED + index * LAYER], [PX, PY, BED + (index + 1) * LAYER], r, 32));
const NOZZLE = tube([PX, PY, TIP + PARK], [PX, PY, TIP + PARK + 4], 2, 12);
const sweep = (units: number) => `${(units * C).toFixed(1)}px, ${(units * S).toFixed(1)}px`;

// Six print windows: the head climbs one layer per window and sweeps along x twice
const WINDOW = 12;
const START = 4;
const rise = RADII.map((_, index) => {
  const at = START + index * WINDOW;
  const down = (RADII.length - 1 - index) * LAYER + PARK;
  return `${at}%, ${at + WINDOW - 1}% { transform: translateY(${down}px); }`;
}).join(" ");
const pass = RADII.map((_, index) => {
  const at = START + index * WINDOW;
  return `${at + WINDOW / 4}% { transform: translate(${sweep(SWEEP)}); } ${at + (WINDOW * 3) / 4}% { transform: translate(${sweep(-SWEEP)}); }`;
}).join(" ");
const grow = RADII.map((_, index) => {
  const at = START + index * WINDOW;
  return `@keyframes isometric154-layer${index} { 0%, ${at}% { opacity: 0; } ${at + WINDOW - 2}%, 88% { opacity: 1; } 94%, 100% { opacity: 0; } }`;
}).join("\n");

const STYLES = `
@keyframes isometric154-rise { 0%, ${START}% { transform: translateY(${(RADII.length - 1) * LAYER + PARK}px); } ${rise} ${START + RADII.length * WINDOW + 6}%, 88% { transform: translateY(0); } 98%, 100% { transform: translateY(${(RADII.length - 1) * LAYER + PARK}px); } }
@keyframes isometric154-pass { 0%, ${START}% { transform: translate(0, 0); } ${pass} ${START + RADII.length * WINDOW}%, 100% { transform: translate(0, 0); } }
${grow}
.isometric154-rise { animation: isometric154-rise 6s ease-in-out infinite; will-change: transform; }
.isometric154-pass { animation: isometric154-pass 6s ease-in-out infinite; will-change: transform; }
${RADII.map((_, index) => `.isometric154-layer${index} { animation: isometric154-layer${index} 6s ease-in-out infinite; }`).join("\n")}
.isometric154-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric154-rise, .isometric154-pass, ${RADII.map((_, index) => `.isometric154-layer${index}`).join(", ")} { animation: none; } }
`;

export function Isometric154({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric154Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric154-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-62 -96 146 168" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, 80, 64, BASE)} paint={body} />
        <g transform={onLeft(64)} className={body.ink}>
          <rect x={10} y={-8} width={18} height={6} rx={1} />
          <circle cx={34} cy={-5} r={2.5} />
        </g>
        <Block faces={box(4, 22, BASE, 8, 10, TOP - BASE)} paint={body} />
        <g transform={onLeft(32)} className={body.ink}>
          <rect x={7} y={-TOP + 4} width={2} height={TOP - BASE - 8} rx={1} />
        </g>
        <Block faces={box(14, 32, BASE, 52, 28, 4)} paint={body} />
        <g transform={onTop(BED)} className={body.ink}>
          <rect x={18} y={36} width={44} height={20} rx={2} />
        </g>
        {LAYERS.map((layer, index) => (
          <g key={layer.cap} className={`isometric154-layer${index}`}>
            <Tube shape={layer} paint={paint.accent} />
          </g>
        ))}
        <g className="isometric154-rise">
          <Block faces={box(12, 24, TIP + PARK + 10, 56, 6, 6)} paint={body} />
          <g className="isometric154-pass">
            <Tube shape={NOZZLE} paint={body} />
            <Block faces={box(PX - 8, PY - 8, TIP + PARK + 4, 16, 14, 16)} paint={body} />
            <g transform={onLeft(PY + 6)} className={body.ink}>
              <circle cx={PX} cy={-TIP - PARK - 12} r={4.5} />
            </g>
            <g transform={onRight(PX + 8)} className={body.ink}>
              <rect x={PY - 5} y={-TIP - PARK - 16} width={8} height={2} rx={1} />
            </g>
          </g>
        </g>
        <Block faces={box(68, 22, BASE, 8, 10, TOP - BASE)} paint={body} />
        <g transform={onLeft(32)} className={body.ink}>
          <rect x={71} y={-TOP + 4} width={2} height={TOP - BASE - 8} rx={1} />
        </g>
        <Block faces={box(4, 22, TOP, 72, 10, 6)} paint={body} />
      </svg>
    </div>
  );
}
