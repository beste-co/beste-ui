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

interface Isometric104Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Light the screen with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric104Demo: Isometric104Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

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

const DESK = { w: 100, d: 64, z: 30, t: 6 };
const TOP = DESK.z + DESK.t;
const LAPTOP = { x: 14, y: 10, w: 56, d: 36, h: 3 };
const HINGE: Point = [LAPTOP.x, LAPTOP.y, TOP + LAPTOP.h];
const MUG = { x: 86, y: 40, r: 7, h: 14 };
const LEGS: [number, number][] = [
  [0, 0],
  [DESK.w - 6, 0],
  [0, DESK.d - 6],
  [DESK.w - 6, DESK.d - 6],
];

const THICK = 2;
const OPEN = 105;
const PERIOD = 6;

type Vec = [number, number, number];
const screen = ([x, y, z]: Vec) => [(x - y) * C, (x + y) * S - z] as const;
/** A CSS/SVG matrix that draws local (u, v) onto the plane through o spanned by a and b. */
function frame(o: Vec, a: Vec, b: Vec) {
  const [e, f] = screen(o);
  const [m0, m1] = screen(a);
  const [m2, m3] = screen(b);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(", ")})`;
}
const ALONG: Vec = [1, 0, 0];
/** The lid faces at `angle` degrees from lying shut, hinged on the back edge of the base. */
function lidFrames(angle: number) {
  const t = (angle * Math.PI) / 180;
  const up: Vec = [0, Math.cos(t), Math.sin(t)];
  const out: Vec = [0, -Math.sin(t), Math.cos(t)];
  const at = (u: number, v: number, n: number): Vec => [HINGE[0] + u, HINGE[1] + up[1] * v + out[1] * n, HINGE[2] + up[2] * v + out[2] * n];
  return {
    outer: frame(at(0, 0, THICK), ALONG, up),
    inner: frame(at(0, 0, 0), ALONG, up),
    far: frame(at(0, LAPTOP.d, 0), ALONG, out),
    side: frame(at(LAPTOP.w, 0, 0), up, out),
  };
}
type Face = keyof ReturnType<typeof lidFrames>;
const SHUT = lidFrames(0);
const OPENED = lidFrames(OPEN);
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
// Opens from 14% to 30% and shuts from 80% to 94%
const SWING = Array.from({ length: 20 }, (_, index) => (index + 1) / 21);
const swing = (face: Face) =>
  [
    `0%, 14% { transform: ${SHUT[face]}; }`,
    ...SWING.map((k) => `${(14 + k * 16).toFixed(2)}% { transform: ${lidFrames(OPEN * ease(k))[face]}; }`),
    `30%, 80% { transform: ${OPENED[face]}; }`,
    ...SWING.map((k) => `${(80 + k * 14).toFixed(2)}% { transform: ${lidFrames(OPEN * (1 - ease(k)))[face]}; }`),
    `94%, 100% { transform: ${SHUT[face]}; }`,
  ].join(" ");
// The outer face turns away from the viewer once the lid passes 45 degrees
const CROSS = Math.sqrt(45 / OPEN / 2);
const flip = (from: number, to: number) =>
  `0% { opacity: ${from}; } ${(14 + CROSS * 16).toFixed(2)}% { opacity: ${to}; } ${(94 - CROSS * 14).toFixed(2)}%, 100% { opacity: ${from}; }`;
const FACES: Face[] = ["outer", "inner", "far", "side"];

const STYLES = `
${FACES.map((face) => `@keyframes isometric104-${face} { ${swing(face)} }`).join("\n")}
@keyframes isometric104-front { ${flip(1, 0)} }
@keyframes isometric104-back { ${flip(0, 1)} }
@keyframes isometric104-glow { 0%, 32% { opacity: 0; } 38%, 77% { opacity: 1; } 80%, 100% { opacity: 0; } }
${FACES.map((face) => `.isometric104-${face} { animation: isometric104-${face} ${PERIOD}s linear infinite${face === "outer" ? `, isometric104-front ${PERIOD}s step-end infinite` : face === "inner" ? `, isometric104-back ${PERIOD}s step-end infinite` : ""}; transform-box: view-box; transform-origin: 0 0; }`).join("\n")}
.isometric104-glow { animation: isometric104-glow ${PERIOD}s ease-in-out infinite; }
.isometric104-still * { animation: none !important; }
.isometric104-still .isometric104-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { ${FACES.map((face) => `.isometric104-${face}`).join(", ")}, .isometric104-glow { animation: none; } .isometric104-rest { opacity: 1; } }
`;

export function Isometric104({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric104Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const glass = palette === "dark" ? "fill-black/40" : palette === "tone" ? "fill-black/20" : body.ink;
  const [mx, my] = project([MUG.x, MUG.y, TOP + MUG.h]).split(",").map(Number) as [number, number];
  const handle = `M${mx + 4} ${my + 2} h6 a5 5 0 0 1 0 10 h-6 Z M${mx + 4} ${my + 5} h6 a2 2 0 0 1 0 4 h-6 Z`;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric104-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-68 -76 164 166" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={4} y={4} width={LAPTOP.w - 8} height={LAPTOP.d - 8} rx={1.5} />
          </clipPath>
        </defs>
        {LEGS.map(([x, y]) => (
          <Block key={`${x}-${y}`} faces={box(x, y, 0, 6, 6, DESK.z)} paint={body} />
        ))}
        <Block faces={box(-2, -2, DESK.z, DESK.w + 4, DESK.d + 4, DESK.t)} paint={body} />
        <Block faces={box(LAPTOP.x, LAPTOP.y, TOP, LAPTOP.w, LAPTOP.d, LAPTOP.h)} paint={body} />
        <g transform={onTop(TOP + LAPTOP.h)} className={body.ink}>
          <rect x={LAPTOP.x + 5} y={LAPTOP.y + 4} width={LAPTOP.w - 10} height={16} rx={1.5} />
          <rect x={LAPTOP.x + 20} y={LAPTOP.y + 23} width={16} height={9} rx={1.5} />
        </g>
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <g className="isometric104-inner" transform={OPENED.inner}>
            <rect width={LAPTOP.w} height={LAPTOP.d} rx={2} className={body.base} />
            <rect x={4} y={4} width={LAPTOP.w - 8} height={LAPTOP.d - 8} rx={1.5} stroke="none" className={glass} />
            <g clipPath={`url(#${clipId})`} stroke="none" className="isometric104-glow isometric104-rest opacity-0">
              <rect x={4} y={4} width={LAPTOP.w - 8} height={LAPTOP.d - 8} className={paint.accent.base} />
              <g className={paint.accent.ink}>
                <rect x={9} y={22} width={20} height={4} rx={2} />
                <rect x={9} y={15} width={30} height={3} rx={1.5} />
                <rect x={9} y={9} width={22} height={3} rx={1.5} />
              </g>
            </g>
          </g>
          <g className="isometric104-side" transform={OPENED.side}>
            <rect width={LAPTOP.d} height={THICK} className={body.base} />
            <rect width={LAPTOP.d} height={THICK} className={body.right} stroke="none" />
          </g>
          <g className="isometric104-far" transform={OPENED.far}>
            <rect width={LAPTOP.w} height={THICK} className={body.base} />
            <rect width={LAPTOP.w} height={THICK} className={body.left} stroke="none" />
          </g>
          <g className="isometric104-outer opacity-0" transform={OPENED.outer}>
            <rect width={LAPTOP.w} height={LAPTOP.d} rx={2} className={body.base} />
            <circle cx={LAPTOP.w / 2} cy={LAPTOP.d / 2} r={4} stroke="none" className={body.ink} />
          </g>
        </g>
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <path d={handle} fillRule="evenodd" className={body.base} />
          <path d={handle} fillRule="evenodd" className={body.right} stroke="none" />
        </g>
        <RoundBlock shape={roundBox(MUG.x - MUG.r, MUG.y - MUG.r, TOP, MUG.r * 2, MUG.r * 2, MUG.h, MUG.r)} paint={body} />
        <g transform={onTop(TOP + MUG.h)} className={body.ink}>
          <circle cx={MUG.x} cy={MUG.y} r={MUG.r - 1.5} />
        </g>
      </svg>
    </div>
  );
}
