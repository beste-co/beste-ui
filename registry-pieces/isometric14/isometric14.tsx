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

interface Isometric14Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the rising item with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric14Demo: Isometric14Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 88;
const H = 60;
const F = W / 2;
const RIM = 3;
const ITEM = 36;
const ITEM_Z = H + 12;
const SINK = ITEM_Z - 4;
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

// Each flap turns about its rim edge: 0 is folded flat over the box, 90 stands upright
type FlapKey = "back" | "side" | "front" | "near";
interface FlapSpec {
  open: number;
  from: number;
  to: number;
  shut: number;
  done: number;
  at: (c: number, s: number) => string;
}
const FLAPS: Record<FlapKey, FlapSpec> = {
  back: { open: 125, from: 20, to: 29, shut: 85, done: 91, at: (c, s) => frame([0, 0, H], [1, 0, 0], [0, c, s]) },
  front: { open: 215, from: 20, to: 29, shut: 85, done: 91, at: (c, s) => frame([0, W, H], [1, 0, 0], [0, -c, s]) },
  side: { open: 125, from: 24, to: 33, shut: 82, done: 87, at: (c, s) => frame([0, 0, H], [0, 1, 0], [c, 0, s]) },
  near: { open: 215, from: 24, to: 33, shut: 82, done: 87, at: (c, s) => frame([W, 0, H], [0, 1, 0], [-c, 0, s]) },
};
const flapAt = (key: FlapKey, angle: number) => {
  const t = (angle * Math.PI) / 180;
  return FLAPS[key].at(Math.cos(t), Math.sin(t));
};
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const SWING = Array.from({ length: 23 }, (_, index) => (index + 1) / 24);
const swing = (key: FlapKey) => {
  const { open, from, to, shut, done } = FLAPS[key];
  return [
    `0%, ${from}% { transform: ${flapAt(key, 0)}; }`,
    ...SWING.map((k) => `${(from + k * (to - from)).toFixed(2)}% { transform: ${flapAt(key, open * ease(k))}; }`),
    `${to}%, ${shut}% { transform: ${flapAt(key, open)}; }`,
    ...SWING.map((k) => `${(shut + k * (done - shut)).toFixed(2)}% { transform: ${flapAt(key, open * (1 - ease(k)))}; }`),
    `${done}%, 100% { transform: ${flapAt(key, 0)}; }`,
  ].join(" ");
};
/** Shown only while the flap is below the given angle. */
const below = (key: FlapKey, angle: number, shown = 1) => {
  const { open, from, to, shut, done } = FLAPS[key];
  const p = angle / open;
  const k = p < 0.5 ? Math.sqrt(p / 2) : 1 - Math.sqrt((1 - p) / 2);
  const up = (from + k * (to - from)).toFixed(2);
  const down = (done - k * (done - shut)).toFixed(2);
  return `0% { opacity: ${shown}; } ${up}% { opacity: ${1 - shown}; } ${down}%, 100% { opacity: ${shown}; }`;
};
const shade = (key: FlapKey) => {
  const { from, to, shut, done } = FLAPS[key];
  return `0%, ${from}% { opacity: 0; } ${to}%, ${shut}% { opacity: 1; } ${done}%, 100% { opacity: 0; }`;
};
const KEYS: FlapKey[] = ["back", "side", "front", "near"];

const STYLES = `
${KEYS.map((key) => `@keyframes isometric14-${key} { ${swing(key)} }`).join("\n")}
@keyframes isometric14-back-over { ${below("back", 90)} }
@keyframes isometric14-back-under { ${below("back", 90, 0)} }
@keyframes isometric14-side-over { ${below("side", 90)} }
@keyframes isometric14-side-under { ${below("side", 90, 0)} }
@keyframes isometric14-back-shade { ${shade("back")} }
@keyframes isometric14-side-shade { ${shade("side")} }
@keyframes isometric14-back-tape { ${below("back", 45)} }
@keyframes isometric14-front-tape { ${below("front", 135)} }
@keyframes isometric14-rise { 0%, 28% { transform: translateY(${SINK}px); } 46% { transform: translateY(-4px); } 52%, 70% { transform: translateY(0); } 84%, 100% { transform: translateY(${SINK}px); } }
${KEYS.map((key) => `.isometric14-${key} { animation: isometric14-${key} ${PERIOD}s linear infinite; }`).join("\n")}
.isometric14-back.isometric14-over { animation: isometric14-back ${PERIOD}s linear infinite, isometric14-back-over ${PERIOD}s step-end infinite; }
.isometric14-back.isometric14-under { animation: isometric14-back ${PERIOD}s linear infinite, isometric14-back-under ${PERIOD}s step-end infinite; }
.isometric14-side.isometric14-over { animation: isometric14-side ${PERIOD}s linear infinite, isometric14-side-over ${PERIOD}s step-end infinite; }
.isometric14-side.isometric14-under { animation: isometric14-side ${PERIOD}s linear infinite, isometric14-side-under ${PERIOD}s step-end infinite; }
.isometric14-back-shade { animation: isometric14-back-shade ${PERIOD}s linear infinite; }
.isometric14-side-shade { animation: isometric14-side-shade ${PERIOD}s linear infinite; }
.isometric14-back-tape { animation: isometric14-back-tape ${PERIOD}s step-end infinite; }
.isometric14-front-tape { animation: isometric14-front-tape ${PERIOD}s step-end infinite; }
.isometric14-item { animation: isometric14-rise ${PERIOD}s ease-in-out infinite; will-change: transform; }
.isometric14-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric14-back, .isometric14-side, .isometric14-front, .isometric14-near, .isometric14-back-shade, .isometric14-side-shade, .isometric14-back-tape, .isometric14-front-tape, .isometric14-item { animation: none !important; } }
`;

/** One lid flap in its own (along the hinge, away from the hinge) units; it rests open. */
function Flap({ flap, layer, shade, tape, paint }: { flap: FlapKey; layer?: "over" | "under"; shade?: string; tape?: boolean; paint: Paint }) {
  const tone = flap === "near" ? "side" : flap === "front" ? "back" : flap;
  return (
    <g className={cn(`isometric14-${flap}`, layer && `isometric14-${layer}`, layer === "over" && "opacity-0")} transform={flapAt(flap, FLAPS[flap].open)}>
      <rect width={W} height={F} className={paint.base} />
      {shade && <rect width={W} height={F} className={cn(shade, `isometric14-${tone}-shade`)} stroke="none" />}
      {tape && <rect y={F - 6} width={W} height={6} className={cn(paint.ink, `isometric14-${flap}-tape opacity-0`)} stroke="none" />}
    </g>
  );
}

export function Isometric14({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric14Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const outer = box(0, 0, 0, W, W, H);
  const floor = polygon([[RIM, RIM, 0], [W - RIM, RIM, 0], [W - RIM, W - RIM, 0], [RIM, W - RIM, 0]]);
  const innerBack = polygon([[RIM, RIM, H], [W - RIM, RIM, H], [W - RIM, RIM, 0], [RIM, RIM, 0]]);
  const innerSide = polygon([[RIM, RIM, H], [RIM, W - RIM, H], [RIM, W - RIM, 0], [RIM, RIM, 0]]);
  const item = box((W - ITEM) / 2, (W - ITEM) / 2, ITEM_Z, ITEM, ITEM, ITEM);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric14-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-112 -142 224 270" aria-hidden="true" className="size-full overflow-visible">
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <Flap flap="side" layer="under" shade={body.right} paint={body} />
          <Flap flap="back" layer="under" shade={body.left} paint={body} />
          <polygon points={floor} className={body.base} />
          <polygon points={floor} className={body.right} stroke="none" />
          <polygon points={innerSide} className={body.base} />
          <polygon points={innerSide} className={body.right} stroke="none" />
          <polygon points={innerBack} className={body.base} />
          <polygon points={innerBack} className={body.left} stroke="none" />
          <g transform={onTop(H)} className={body.base}>
            <rect x={0} y={0} width={W} height={RIM} />
            <rect x={0} y={0} width={RIM} height={W} />
          </g>
        </g>
        <g className="isometric14-item">
          <Block faces={item} paint={paint.accent} />
          <g transform={onTop(ITEM_Z + ITEM)} className={paint.accent.ink}>
            <rect x={(W - ITEM) / 2 + 12} y={(W - ITEM) / 2 + 12} width={ITEM - 24} height={ITEM - 24} rx={4} />
          </g>
        </g>
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={outer.left} className={body.base} />
          <polygon points={outer.left} className={body.left} stroke="none" />
          <polygon points={outer.right} className={body.base} />
          <polygon points={outer.right} className={body.right} stroke="none" />
          <g transform={onTop(H)} className={body.base}>
            <rect x={0} y={W - RIM} width={W} height={RIM} />
            <rect x={W - RIM} y={0} width={RIM} height={W} />
          </g>
          <Flap flap="side" layer="over" shade={body.right} paint={body} />
          <Flap flap="near" shade={body.left} paint={body} />
          <Flap flap="back" layer="over" shade={body.left} tape paint={body} />
          <Flap flap="front" tape paint={body} />
        </g>
      </svg>
    </div>
  );
}
