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

interface Isometric57Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Write the signature in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric57Demo: Isometric57Props = {
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

const W = 100;
const D = 132;
const PAGE = 3;
const TOP = PAGE * 2;
const PERIOD = 5.6;
const WRITE_FROM = 12;
const WRITE_TO = 56;
// A looping cursive stroke, sampled so the pen can follow it
const SIGN = Array.from({ length: 49 }, (_, index) => {
  const t = index / 48;
  const wave = t * Math.PI * 5;
  return [22 + 56 * t - 5 * Math.cos(wave) * (1 - t), 100 - 8 * Math.sin(wave) * (1 - 0.6 * t) - 3 * Math.sin(t * Math.PI)] as const;
});
const SIGN_PATH = `M${SIGN.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}`;
const END = SIGN[SIGN.length - 1] ?? ([74, 100] as const);
const toScreen = ([x, y]: readonly [number, number]) => [(x - y) * C, (x + y) * S] as const;
const [END_X, END_Y] = toScreen(END);
// Where the pen rests once lifted, relative to the end of the stroke
const PARK_X = 6;
const PARK_Y = -12;

const PEN_R = 6;
const TIP = 12;
const PEN_H = 64;
const RX = PEN_R * C * Math.SQRT2;
const RY = PEN_R * S * Math.SQRT2;

const penFrames = SIGN.filter((_, index) => index % 4 === 0).map((point, index, all) => {
  const [x, y] = toScreen(point);
  const at = WRITE_FROM + ((WRITE_TO - WRITE_FROM) * index) / (all.length - 1);
  return `${at.toFixed(1)}% { transform: translate(${(x - END_X - PARK_X).toFixed(1)}px, ${(y - END_Y - PARK_Y).toFixed(1)}px); opacity: 1; }`;
});
const [START_X, START_Y] = toScreen(SIGN[0] ?? ([18, 100] as const));

const STYLES = `
@keyframes isometric57-pen { 0% { transform: translate(${(START_X - END_X - PARK_X).toFixed(1)}px, ${(START_Y - END_Y - PARK_Y - 18).toFixed(1)}px); opacity: 0; } 6% { opacity: 1; } ${penFrames.join(" ")} 64%, 76% { transform: translate(0, 0); opacity: 1; } 84%, 100% { transform: translate(0, 0); opacity: 0; } }
@keyframes isometric57-cover { 0%, ${WRITE_FROM}% { transform: scaleX(1); opacity: 1; } ${WRITE_TO}%, 100% { transform: scaleX(0); opacity: 1; } }
@keyframes isometric57-sign { 0%, 82% { opacity: 1; } 90%, 100% { opacity: 0; } }
.isometric57-pen { animation: isometric57-pen ${PERIOD}s linear infinite; will-change: transform, opacity; }
.isometric57-cover { animation: isometric57-cover ${PERIOD}s linear infinite; transform-box: fill-box; transform-origin: right center; }
.isometric57-sign { animation: isometric57-sign ${PERIOD}s ease-in-out infinite; }
.isometric57-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric57-pen, .isometric57-cover, .isometric57-sign { animation: none; } }
`;

export function Isometric57({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric57Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const ink = accent
    ? palette === "tone"
      ? "stroke-white"
      : "stroke-current"
    : palette === "dark"
      ? "stroke-white/40"
      : palette === "tone"
        ? "stroke-white/50"
        : palette === "light"
          ? "stroke-zinc-950/40"
          : "stroke-foreground/40";
  const [tipX, tipY] = [END_X + PARK_X, END_Y + PARK_Y - TOP];
  const base = tipY - TIP;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric57-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-120 -42 212 166" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(4, 4, 0, W, D, PAGE)} paint={paint.body} />
        <Block faces={box(0, 0, PAGE, W, D, PAGE)} paint={paint.body} />
        <g transform={onTop(TOP)}>
          <g className={paint.body.ink}>
            <rect x={14} y={14} width={46} height={7} rx={2} />
            {[32, 41, 50, 59, 68].map((y, index) => (
              <rect key={y} x={14} y={y} width={index === 4 ? 44 : 72} height={3} rx={1.5} />
            ))}
            <rect x={14} y={112} width={64} height={2} rx={1} />
            <path d="M14 104l6 6m0 -6l-6 6" strokeWidth={2.5} strokeLinecap="round" className={paint.body.ink.replace("fill-", "stroke-")} fill="none" />
          </g>
          <g className="isometric57-sign">
            <path d={SIGN_PATH} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={ink} />
          </g>
          <rect x={10} y={86} width={72} height={24} className={cn("isometric57-cover opacity-0", paint.body.base)} />
        </g>
        <g className="isometric57-pen">
          <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
            <path d={`M${tipX - RX} ${base}A${RX} ${RY} 0 0 0 ${tipX} ${base + RY}L${tipX} ${tipY}Z`} className={paint.body.base} />
            <path d={`M${tipX - RX} ${base}A${RX} ${RY} 0 0 0 ${tipX} ${base + RY}L${tipX} ${tipY}Z`} className={paint.body.left} stroke="none" />
            <path d={`M${tipX + RX} ${base}A${RX} ${RY} 0 0 1 ${tipX} ${base + RY}L${tipX} ${tipY}Z`} className={paint.body.base} />
            <path d={`M${tipX + RX} ${base}A${RX} ${RY} 0 0 1 ${tipX} ${base + RY}L${tipX} ${tipY}Z`} className={paint.body.right} stroke="none" />
          </g>
          <g transform={`translate(${END_X + PARK_X} ${END_Y + PARK_Y})`}>
            <RoundBlock shape={roundBox(-PEN_R, -PEN_R, TOP + TIP, PEN_R * 2, PEN_R * 2, PEN_H, PEN_R)} paint={paint.body} />
            <RoundBlock shape={roundBox(-PEN_R - 1, -PEN_R - 1, TOP + TIP + PEN_H - 16, PEN_R * 2 + 2, PEN_R * 2 + 2, 16, PEN_R + 1)} paint={paint.body} />
          </g>
        </g>
      </svg>
    </div>
  );
}
