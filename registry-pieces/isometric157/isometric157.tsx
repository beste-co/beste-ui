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

interface Isometric157Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the dish and its signal with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric157Demo: Isometric157Props = {
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
const Z = 0;
const B = 13;
const H = 34;
const WING = { w: 34, h: 24, z: Z + 5 };
const CELLS = [0, 1, 2].flatMap((col) => [0, 1].map((row) => ({ x: 2 + col * 10.5, z: 2 + row * 11 })));
const DISH_Y = B + 6;
const DISH_Z = Z + 15;
const BOOM = tube([0, B, DISH_Z], [0, DISH_Y, DISH_Z], 2, 12);
const DISH = tube([0, DISH_Y, DISH_Z], [0, DISH_Y + 3, DISH_Z], 11, 32);
const FEED = tube([0, DISH_Y + 3, DISH_Z], [0, DISH_Y + 9, DISH_Z], 1.2, 10);
const MAST = tube([4, 4, Z + H], [4, 4, Z + H + 12], 1.2, 10);
const WAVE_FROM = DISH_Y + 14;
const WAVE_TRAVEL = 18;
const RING = "M-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0ZM-7.5 0a7.5 7.5 0 1 1 15 0a7.5 7.5 0 1 1 -15 0Z";

const STYLES = `
@keyframes isometric157-drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes isometric157-wave { 0% { transform: translate(0, 0) scale(0.5); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(${(-WAVE_TRAVEL * C).toFixed(1)}px, ${(WAVE_TRAVEL * S).toFixed(1)}px) scale(1.5); opacity: 0; } }
.isometric157-drift { animation: isometric157-drift 6s ease-in-out infinite; will-change: transform; }
.isometric157-wave { animation: isometric157-wave 3s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric157-still * { animation: none !important; }
.isometric157-still .isometric157-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric157-drift, .isometric157-wave { animation: none; } .isometric157-rest { opacity: 1; } }
`;

function Wing({ x, paint }: { x: number; paint: Paint }) {
  return (
    <g>
      <Block faces={box(x, -1, WING.z, WING.w, 2, WING.h)} paint={paint} />
      <g transform={onLeft(1)} className={paint.ink}>
        {CELLS.map((cell) => (
          <rect key={`${cell.x}-${cell.z}`} x={x + cell.x} y={-WING.z - cell.z - 9} width={9} height={9} rx={0.5} />
        ))}
      </g>
    </g>
  );
}

export function Isometric157({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric157Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const signal = accent ? paint.accent.base : body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric157-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-62 -76 124 112" aria-hidden="true" className="size-full overflow-visible">
        <g className="isometric157-drift">
          <Wing x={-B - 8 - WING.w} paint={body} />
          <Block faces={box(-B - 8, -1, Z + 16, 8, 2, 2)} paint={body} />
          <Block faces={box(-B, -B, Z, B * 2, B * 2, H)} paint={body} />
          <g transform={onLeft(B)} className={body.ink}>
            <rect x={-B + 3} y={-Z - H + 4} width={B * 2 - 6} height={2} rx={1} />
            <rect x={-B + 3} y={-Z - 6} width={B * 2 - 6} height={2} rx={1} />
          </g>
          <g transform={onRight(B)} className={body.ink}>
            <rect x={-B + 3} y={-Z - H + 4} width={B * 2 - 6} height={2} rx={1} />
            <rect x={-B + 3} y={-Z - 6} width={B * 2 - 6} height={2} rx={1} />
            <rect x={-5} y={-Z - 19} width={10} height={8} rx={1} />
          </g>
          <g transform={onTop(Z + H)} className={body.ink}>
            <circle cx={4} cy={4} r={3} />
          </g>
          <Tube shape={MAST} paint={body} />
          <Tube shape={BOOM} paint={body} />
          <Tube shape={DISH} paint={paint.accent} />
          <g transform={onLeft(DISH_Y + 3)} className={paint.accent.ink}>
            <circle cx={0} cy={-DISH_Z} r={7} />
          </g>
          <Tube shape={FEED} paint={body} />
          <Block faces={box(B, -1, Z + 16, 8, 2, 2)} paint={body} />
          <Wing x={B + 8} paint={body} />
        </g>
        {[0, 1, 2].map((index) => (
          <g key={index} className={cn("isometric157-wave opacity-0", index === 1 && "isometric157-rest")} style={{ animationDelay: `${index * -1}s` }}>
            <g transform={`translate(${(-WAVE_FROM * C).toFixed(1)} ${(WAVE_FROM * S - DISH_Z).toFixed(1)})`}>
              <g transform="matrix(0.866 0.5 0 1 0 0)">
                <path d={RING} fillRule="evenodd" className={signal} />
              </g>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
