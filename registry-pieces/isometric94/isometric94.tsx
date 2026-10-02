"use client";

import { type CSSProperties, useId } from "react";
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

interface Isometric94Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the ball with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric94Demo: Isometric94Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const PITCH = 8;
const L = 14;
const RX = 74;
const MOUTH = 26;
const BACK = 6;
const BAR = 3;
const TOP = PITCH + 38;
const BALL_R = 8;
const BALL_X = 44;
const BALL_END = 18;
const BALL_START = 70;
const at = (x: number, y: number, z: number) => [(x - y) * C, (x + y) * S - z] as const;
const [BX, BY] = at(BALL_X, BALL_END, PITCH + BALL_R);
const [GX, GY] = at(BALL_X, BALL_END, PITCH);
// The ball touches the back net when its center is one radius in front of it
const TOUCH = BACK + BALL_R;
/** Where the ball's center is along y at a percent of the loop: it rolls in, sinks into the net, and is pushed back out to rest. */
function ballY(p: number) {
  if (p <= 8) return BALL_START;
  if (p <= 40) return BALL_START - (BALL_START - TOUCH) * ((p - 8) / 32) * (1.5 - 0.5 * ((p - 8) / 32));
  if (p <= 45) return TOUCH - 3 * Math.sin((((p - 40) / 5) * Math.PI) / 2);
  if (p <= 61) return TOUCH - 3 + ((BALL_END - TOUCH + 3) * (1 - Math.cos(((p - 45) / 16) * Math.PI))) / 2;
  return BALL_END;
}
// Rolling without slipping: the turn about the x axis is the distance covered over the radius
const turn = (y: number) => (BALL_START - y) / BALL_R;
const n = (value: number) => value.toFixed(4);
const STEPS = Array.from({ length: 54 }, (_, index) => 8 + index);
const ROLL = STEPS.map((p) => {
  const y = ballY(p);
  return `${p}% { transform: translate(${(-(y - BALL_END) * C).toFixed(2)}px, ${((y - BALL_END) * S).toFixed(2)}px); --isometric94-c: ${n(Math.cos(turn(y)))}; --isometric94-s: ${n(Math.sin(turn(y)))}; }`;
}).join(" ");
// How far the net is pushed back: it follows the ball while they touch, then swings a little and settles
const PUSH = [
  ...STEPS.filter((p) => p >= 40 && p <= 52).map((p): [number, number] => [p, Math.max(0, TOUCH - ballY(p))]),
  [54, -0.8],
  [57, 0.5],
  [60, -0.25],
  [63, 0],
] as [number, number][];
// Patches sit on the corners of an icosahedron, so the spin reads from any side
const GOLD = (1 + Math.sqrt(5)) / 2;
const SPOTS = [-1, 1]
  .flatMap((i) => [-1, 1].flatMap((j): [number, number, number][] => [[0, i, j * GOLD], [i, j * GOLD, 0], [j * GOLD, 0, i]]))
  .map(([x, y, z]) => [x, y, z].map((v) => (v * BALL_R) / Math.hypot(1, GOLD)) as [number, number, number]);
// The back net as short strands: the ones near the point of impact carry a weight and move with the push
const HIT = { x: BALL_X, z: PITCH + BALL_R };
const weight = (x: number, z: number) => Math.exp(-((x - HIT.x) ** 2 + (z - HIT.z) ** 2) / 160) * Math.min(1, (z - PITCH) / 6, (TOP - z) / 6);
interface Strand { x: number; z: number; w: number; h: number; pull: number }
function strands(upright: boolean, fixed: number, from: number, to: number): Strand[] {
  const out: Strand[] = [];
  for (let start = from; start < to - 0.01; start += 2.5) {
    const length = Math.min(2.5, to - start);
    const mid = start + length / 2;
    const pull = upright ? weight(fixed, mid) : weight(mid, fixed);
    const last = out[out.length - 1];
    if (pull < 0.03 && last && last.pull === 0) {
      if (upright) last.h += length;
      else last.w += length;
      continue;
    }
    out.push(upright ? { x: fixed - 0.5, z: start, w: 1, h: length, pull: pull < 0.03 ? 0 : pull } : { x: start, z: fixed - 0.5, w: length, h: 1, pull: pull < 0.03 ? 0 : pull });
  }
  return out;
}
const NET = [
  ...Array.from({ length: 13 }, (_, index) => strands(true, L + 1.5 + index * 5, PITCH, TOP)).flat(),
  ...Array.from({ length: 8 }, (_, index) => strands(false, PITCH + 3 + index * 5, L, RX + BAR)).flat(),
];

const MESH: Record<Palette, string> = {
  theme: "fill-foreground/20",
  light: "fill-zinc-950/20",
  dark: "fill-zinc-300/60",
  tone: "fill-black/30",
  glass: "fill-foreground/20",
};
// Nets read against whatever card sits behind them, so they stay mid grey
const VEIL: Record<Palette, string> = {
  theme: "fill-foreground/5",
  light: "fill-zinc-950/5",
  dark: "fill-zinc-300/10",
  tone: "fill-black/10",
  glass: "fill-foreground/5",
};

const STYLES = `
@property --isometric94-c { syntax: "<number>"; inherits: true; initial-value: ${n(Math.cos(turn(BALL_END)))}; }
@property --isometric94-s { syntax: "<number>"; inherits: true; initial-value: ${n(Math.sin(turn(BALL_END)))}; }
@property --isometric94-a { syntax: "<number>"; inherits: true; initial-value: 0; }
@keyframes isometric94-roll { 0% { transform: translate(${(-(BALL_START - BALL_END) * C).toFixed(2)}px, ${((BALL_START - BALL_END) * S).toFixed(2)}px); --isometric94-c: 1; --isometric94-s: 0; } ${ROLL} 100% { transform: translate(0px, 0px); } }
@keyframes isometric94-show { 0% { opacity: 0; } 8%, 84% { opacity: 1; } 92%, 100% { opacity: 0; } }
@keyframes isometric94-net { 0%, 40% { --isometric94-a: 0; } ${PUSH.map(([p, a]) => `${p}% { --isometric94-a: ${n(a)}; }`).join(" ")} 100% { --isometric94-a: 0; } }
.isometric94-roll { animation: isometric94-roll 5s linear infinite, isometric94-show 5s linear infinite; will-change: transform, opacity; }
.isometric94-spot { transform: translate(calc((var(--isometric94-c) * var(--ax) + var(--isometric94-s) * var(--bx)) * 1px), calc((var(--isometric94-c) * var(--ay) + var(--isometric94-s) * var(--by)) * 1px)); opacity: calc((var(--o0) + var(--isometric94-c) * var(--oc) + var(--isometric94-s) * var(--os)) * 0.5); }
.isometric94-net { animation: isometric94-net 5s linear infinite; }
.isometric94-strand { transform: translate(calc(var(--isometric94-a) * var(--w) * 1px), calc(var(--isometric94-a) * var(--w) * -1px)); }
.isometric94-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric94-roll, .isometric94-net { animation: none; } }
`;

export function Isometric94({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric94Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const mesh = useId();
  const paint = paints(palette, accent, tone, color);
  const ball = paint.accent;
  const net = `url(#${mesh})`;
  const post = (x: number, y: number, h: number) => <Block faces={box(x, y, PITCH, BAR, BAR, h)} paint={paint.body} />;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric94-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-74 -44 156 132" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <pattern id={mesh} width={5} height={5} patternUnits="userSpaceOnUse">
            <rect width={5} height={1} className={MESH[palette]} />
            <rect width={1} height={5} className={MESH[palette]} />
          </pattern>
          <clipPath id={`${mesh}-ball`}>
            <circle cx={BX} cy={BY} r={BALL_R} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, 88, 78, PITCH)} paint={paint.body} />
        <g transform={onTop(PITCH)} className={paint.body.ink}>
          <rect x={4} y={MOUTH + 1} width={80} height={2} rx={1} />
          <rect x={10} y={MOUTH + 1} width={2} height={28} rx={1} />
          <rect x={76} y={MOUTH + 1} width={2} height={28} rx={1} />
          <rect x={10} y={MOUTH + 27} width={68} height={2} rx={1} />
          <circle cx={BALL_X} cy={62} r={2} />
        </g>
        <g className="isometric94-net">
          <g transform={onLeft(BACK)}>
            <rect x={L} y={-TOP} width={RX - L + BAR} height={TOP - PITCH} className={VEIL[palette]} />
            <g className={MESH[palette]}>
              {NET.map((strand, index) => (
                <rect key={index} x={strand.x} y={-strand.z - strand.h} width={strand.w} height={strand.h} className={strand.pull ? "isometric94-strand" : undefined} style={strand.pull ? ({ "--w": strand.pull.toFixed(3) } as CSSProperties) : undefined} />
              ))}
            </g>
          </g>
        </g>
        <g transform={onRight(L)}>
          <rect x={BACK} y={-TOP} width={MOUTH - BACK} height={TOP - PITCH} className={VEIL[palette]} />
          <rect x={BACK} y={-TOP} width={MOUTH - BACK} height={TOP - PITCH} fill={net} />
        </g>
        {post(L, BACK - BAR, TOP - PITCH)}
        {post(RX, BACK - BAR, TOP - PITCH)}
        <g className="isometric94-roll">
          <ellipse cx={GX} cy={GY} rx={BALL_R * 0.9} ry={BALL_R * 0.5} className={paint.body.ink} />
          <circle cx={BX} cy={BY} r={BALL_R} strokeWidth={1} className={cn(ball.base, ball.edge)} />
          <g clipPath={`url(#${mesh}-ball)`} className={ball.ink}>
            {SPOTS.map(([x, y, z], index) => (
              <circle
                key={index}
                cx={BX + x * C}
                cy={BY + x * S}
                r={2.6}
                className="isometric94-spot"
                style={{ "--ax": n(-C * y), "--bx": n(C * z), "--ay": n(S * y - z), "--by": n(-S * z - y), "--o0": n(x), "--oc": n(y + z), "--os": n(y - z) } as CSSProperties}
              />
            ))}
          </g>
          <path d={`M${BX - BALL_R} ${BY} A${BALL_R} ${BALL_R} 0 0 0 ${BX + BALL_R} ${BY} A${BALL_R} ${BALL_R * 0.55} 0 0 1 ${BX - BALL_R} ${BY} Z`} className={ball.right} />
        </g>
        <g transform={onRight(RX + BAR)}>
          <rect x={BACK} y={-TOP} width={MOUTH - BACK} height={TOP - PITCH} className={VEIL[palette]} />
          <rect x={BACK} y={-TOP} width={MOUTH - BACK} height={TOP - PITCH} fill={net} />
        </g>
        <g transform={onTop(TOP)}>
          <rect x={L} y={BACK} width={RX - L + BAR} height={MOUTH - BACK} className={VEIL[palette]} />
          <rect x={L} y={BACK} width={RX - L + BAR} height={MOUTH - BACK} fill={net} />
        </g>
        <Block faces={box(L, BACK - BAR, TOP, RX - L + BAR, BAR, BAR)} paint={paint.body} />
        <Block faces={box(L, BACK, TOP, BAR, MOUTH - BACK, BAR)} paint={paint.body} />
        {post(L, MOUTH, TOP - PITCH + BAR)}
        <Block faces={box(RX, BACK, TOP, BAR, MOUTH - BACK, BAR)} paint={paint.body} />
        {post(RX, MOUTH, TOP - PITCH + BAR)}
        <Block faces={box(L, MOUTH, TOP, RX - L + BAR, BAR, BAR)} paint={paint.body} />
      </svg>
    </div>
  );
}
