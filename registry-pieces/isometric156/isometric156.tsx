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

interface Isometric156Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the light strip and the status light with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric156Demo: Isometric156Props = {
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

const G = 6;
const BASE = roundBox(2, -4, 0, 88, 76, G, 14);
// The headset sits on a cradle and looks toward the viewer's left face (+y)
const CX = 40;
const Z0 = 34;
const H = 26;
const FRONT = 48;
const VISOR = roundBox(12, 26, Z0, 56, 22, H, 9);
// The glossy face wraps the front and both front corners of the shell
const GLASS = roundBox(12, 26, Z0 + 4, 56, 22, H - 9, 9).left;
const PAD = box(17, 21, Z0 + 3, 46, 5, H - 6);
const FOOT_DISC = tube([CX, 36, G], [CX, 36, G + 3], 14, 40);
const NECK = tube([CX, 36, G + 3], [CX, 36, Z0 - 3], 3.5, 20);
const CRADLE = box(CX - 10, 29, Z0 - 3, 20, 14, 3);
const STRAP_Z = Z0 + 10;
const REAR = [box(12, 1, STRAP_Z - 1, 56, 4, 8), box(24, -2, STRAP_Z - 3, 32, 4, 12)];
const ARMS = [box(12, 5, STRAP_Z - 1, 4, 21, 8), box(64, 5, STRAP_Z - 1, 4, 21, 8)];
const TOP_STRAP = [box(CX - 3, 1, STRAP_Z + 7, 6, 2, H - 15), box(CX - 3, 1, Z0 + H, 6, 28, 2)];
const CAMERAS: [number, number][] = [[25, Z0 + 18], [55, Z0 + 18], [25, Z0 + 11], [55, Z0 + 11]];
const STYLES = `
@keyframes isometric156-breathe { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }
@keyframes isometric156-glint { 0%, 55% { transform: translateX(-26px); opacity: 0; } 60% { opacity: 1; } 84% { opacity: 1; } 90%, 100% { transform: translateX(46px); opacity: 0; } }
@keyframes isometric156-blink { 0%, 60%, 100% { opacity: 1; } 68%, 80% { opacity: 0.15; } }
.isometric156-breathe { animation: isometric156-breathe 3.6s ease-in-out infinite; }
.isometric156-glint { animation: isometric156-glint 6s ease-in-out infinite; }
.isometric156-blink { animation: isometric156-blink 3s linear infinite; }
.isometric156-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric156-breathe, .isometric156-glint, .isometric156-blink, `;

export function Isometric156({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric156Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const glass = palette === "dark" ? "fill-black/70" : palette === "tone" ? "fill-black/60" : "fill-zinc-900";
  const light = accent ? paint.accent.base : "fill-white/40";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric156-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-72 -48 152 132" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={21} y={-(Z0 + H - 5)} width={38} height={H - 9} />
          </clipPath>
        </defs>
        <RoundBlock shape={BASE} paint={body} />
        {REAR.map((part) => (
          <Block key={part.top} faces={part} paint={body} />
        ))}
        <Block faces={TOP_STRAP[0] as Faces} paint={body} />
        <Tube shape={FOOT_DISC} paint={body} />
        <Tube shape={NECK} paint={body} />
        <Block faces={CRADLE} paint={body} />
        {ARMS.map((part) => (
          <Block key={part.top} faces={part} paint={body} />
        ))}
        <g transform={onRight(68)} className={body.ink}>
          <rect x={10} y={-(STRAP_Z + 4.5)} width={7} height={1.2} rx={0.6} />
          <rect x={10} y={-(STRAP_Z + 2.5)} width={7} height={1.2} rx={0.6} />
        </g>
        {/* The face cushion shows as a soft rim behind the shell */}
        <Block faces={PAD} paint={body} />
        <polygon points={PAD.top} className={body.ink} />
        <RoundBlock shape={VISOR} paint={body} />
        <Block faces={TOP_STRAP[1] as Faces} paint={body} />
        <polygon points={GLASS} className={glass} />
        <g transform={onLeft(FRONT)}>
          <g clipPath={`url(#${clipId})`}>
            <path d={`M24 ${-(Z0 + 4)}l9 ${-(H - 9)}h7l-9 ${H - 9}Z`} className="fill-white/10" />
            <g className="isometric156-glint opacity-0">
              <path d={`M22 ${-(Z0 + 4)}l9 ${-(H - 9)}h4l-9 ${H - 9}Z`} className="fill-white/40" />
            </g>
          </g>
          {CAMERAS.map(([x, z]) => (
            <g key={`${x}-${z}`}>
              <circle cx={x} cy={-z} r={1.9} className="fill-white/20" />
              <circle cx={x} cy={-z} r={0.9} className="fill-white/50" />
            </g>
          ))}
          <rect x={27} y={-(Z0 + 7.2)} width={26} height={1.6} rx={0.8} className={cn("isometric156-breathe", light)} />
        </g>
        <g transform={onRight(68)}>
          <circle cx={41} cy={-(Z0 + 20)} r={1.4} className={cn("isometric156-blink", accent ? paint.accent.base : body.ink)} />
        </g>
      </svg>
    </div>
  );
}
