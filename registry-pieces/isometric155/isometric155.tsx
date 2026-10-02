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

interface Isometric155Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the parcel the drone carries with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric155Demo: Isometric155Props = {
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

const PAD = 6;
const FLY = 50;
const ARM = 30;
const ARM_Z = FLY + 3;
const ROTOR_Z = FLY + 10;
const PARCEL = 18;
const PARCEL_Z = FLY - 24;
const DISC = tube([0, 0, 0], [0, 0, PAD], 36, 64);
const HULL = roundBox(-13, -13, FLY, 26, 26, 9, 8);
const SHELL = roundBox(-8, -8, FLY + 9, 16, 16, 3, 6);
const BACK = [
  { x: -ARM, y: 0, arm: box(-ARM, -2, ARM_Z, ARM - 13, 4, 3) },
  { x: 0, y: -ARM, arm: box(-2, -ARM, ARM_Z, 4, ARM - 13, 3) },
];
const FRONT = [
  { x: ARM, y: 0, arm: box(13, -2, ARM_Z, ARM - 13, 4, 3) },
  { x: 0, y: ARM, arm: box(-2, 13, ARM_Z, 4, ARM - 13, 3) },
];

const STYLES = `
@keyframes isometric155-hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes isometric155-shadow { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.86); opacity: 0.7; } }
@keyframes isometric155-spin { to { transform: rotate(360deg); } }
.isometric155-hover { animation: isometric155-hover 4s ease-in-out infinite; will-change: transform; }
.isometric155-shadow { animation: isometric155-shadow 4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric155-spin { animation: isometric155-spin 0.5s linear infinite; transform-box: fill-box; transform-origin: center; }
.isometric155-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric155-hover, .isometric155-shadow, .isometric155-spin { animation: none; } }
`;

export function Isometric155({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric155Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const rotor = ({ x, y, arm }: { x: number; y: number; arm: Faces }, index: number) => (
    <g key={`${x}-${y}`}>
      <Block faces={arm} paint={body} />
      <Tube shape={tube([x, y, ARM_Z - 1], [x, y, ROTOR_Z], 4, 20)} paint={body} />
      <g transform={onTop(ROTOR_Z + 1)}>
        <circle cx={x} cy={y} r={14} className={cn(body.ink, "opacity-60")} />
        <g className="isometric155-spin" style={{ animationDelay: `${index * -0.13}s` }}>
          <rect x={x - 13} y={y - 1.5} width={26} height={3} rx={1.5} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(body.base, body.edge)} />
        </g>
        <circle cx={x} cy={y} r={2} className={cn(body.base, body.edge)} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </g>
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric155-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-54 -98 108 130" aria-hidden="true" className="size-full overflow-visible">
        <Tube shape={DISC} paint={body} />
        <g transform={onTop(PAD)} className={body.ink}>
          <path d="M-29 0a29 29 0 1 0 58 0a29 29 0 1 0 -58 0ZM-26 0a26 26 0 1 1 52 0a26 26 0 1 1 -52 0Z" fillRule="evenodd" />
          <rect x={-10} y={-12} width={4} height={24} rx={1} />
          <rect x={6} y={-12} width={4} height={24} rx={1} />
          <rect x={-6} y={-2} width={12} height={4} />
          <circle cx={0} cy={0} r={15} className="isometric155-shadow opacity-60" />
        </g>
        <g className="isometric155-hover">
          {BACK.map(rotor)}
          <Block faces={box(-PARCEL / 2, -PARCEL / 2, PARCEL_Z, PARCEL, PARCEL, 16)} paint={paint.accent} />
          <g transform={onLeft(PARCEL / 2)} className={paint.accent.ink}>
            <rect x={-1} y={-PARCEL_Z - 16} width={2} height={16} />
          </g>
          <g transform={onRight(PARCEL / 2)} className={paint.accent.ink}>
            <rect x={-1} y={-PARCEL_Z - 16} width={2} height={16} />
          </g>
          <g transform={onTop(PARCEL_Z + 16)} className={paint.accent.ink}>
            <rect x={-PARCEL / 2} y={-1} width={PARCEL} height={2} />
            <rect x={-1} y={-PARCEL / 2} width={2} height={PARCEL} />
          </g>
          <Tube shape={tube([0, 0, PARCEL_Z + 16], [0, 0, FLY], 3, 16)} paint={body} />
          <RoundBlock shape={HULL} paint={body} />
          <RoundBlock shape={SHELL} paint={body} />
          <g transform={onLeft(12)} className={body.ink}>
            <rect x={-5} y={-FLY - 6} width={10} height={2} rx={1} />
          </g>
          {FRONT.map((arm, index) => rotor(arm, index + 2))}
        </g>
      </svg>
    </div>
  );
}
