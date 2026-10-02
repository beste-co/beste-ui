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

interface Isometric153Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the box the arm carries with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric153Demo: Isometric153Props = {
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
const G = 8;
const X = 30;
const Y = 42;
const TRAVEL = 44;
const SLIDE = 18;
const PITCH = 6;
// The belt runs at the speed the box rides it: SLIDE units in 22% of the 6s loop
const BELT_SECONDS = (PITCH / SLIDE) * 0.22 * 6;
const LIFT = 12;
const DECK = G + 6;
const BOX = 16;
const GRIP = DECK + BOX;
const step = (units: number) => `${(units * C).toFixed(1)}px, ${(units * S).toFixed(1)}px`;
const lifted = (units: number, up: number) => `${(units * C).toFixed(1)}px, ${(units * S - up).toFixed(1)}px`;

const TURRET = tube([X, 12, DECK], [X, 12, DECK + 10], 9, 32);
const SHOULDER = tube([X - 7, 14, DECK + 14], [X + 7, 14, DECK + 14], 7);
const UPPER = tube([X, 14, DECK + 14], [X, 4, 62], 5.5);
const ELBOW = tube([X - 6, 4, 62], [X + 6, 4, 62], 6);
const FOREARM = tube([X, -4, 63], [X, Y, 56], 4.5);
const SLEEVE = tube([X, Y, GRIP + 16], [X, Y, 58], 3.5, 16);
const ROD = tube([X, Y, GRIP + 3], [X, Y, GRIP + 18], 1.6, 12);
const PAD = tube([X, Y, GRIP], [X, Y, GRIP + 3], 8, 32);

const STYLES = `
@keyframes isometric153-ride { 0%, 30% { transform: translate(0, 0); } 50%, 76% { transform: translate(${step(TRAVEL)}); } 96%, 100% { transform: translate(0, 0); } }
@keyframes isometric153-lift { 0% { transform: translateY(-${LIFT}px); } 10%, 18% { transform: translateY(0); } 28%, 50% { transform: translateY(-${LIFT}px); } 60%, 66% { transform: translateY(0); } 74%, 100% { transform: translateY(-${LIFT}px); } }
@keyframes isometric153-box { 0%, 18% { transform: translate(0, 0); opacity: 1; } 28%, 30% { transform: translate(0, -${LIFT}px); } 50% { transform: translate(${lifted(TRAVEL, LIFT)}); } 60% { transform: translate(${step(TRAVEL)}); opacity: 1; } 66% { transform: translate(${step(TRAVEL)}); opacity: 1; animation-timing-function: linear; } 84% { transform: translate(${step(TRAVEL + (SLIDE * 18) / 22)}); opacity: 1; animation-timing-function: linear; } 88% { transform: translate(${step(TRAVEL + SLIDE)}); opacity: 0; } 89% { transform: translate(0, 0); opacity: 0; } 97%, 100% { transform: translate(0, 0); opacity: 1; } }
.isometric153-ride { animation: isometric153-ride 6s cubic-bezier(0.45, 0, 0.3, 1) infinite; will-change: transform; }
.isometric153-lift { animation: isometric153-lift 6s cubic-bezier(0.45, 0, 0.3, 1) infinite; will-change: transform; }
.isometric153-box { animation: isometric153-box 6s cubic-bezier(0.45, 0, 0.3, 1) infinite; will-change: transform, opacity; }
@keyframes isometric153-belt { from { transform: translateX(0); } to { transform: translateX(${PITCH}px); } }
.isometric153-belt { animation: isometric153-belt ${BELT_SECONDS.toFixed(2)}s linear infinite; }
.isometric153-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric153-ride, .isometric153-lift, .isometric153-box, .isometric153-belt { animation: none; } }
`;

export function Isometric153({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric153Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric153-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-58 -62 152 150" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={53} y={Y - 9} width={46} height={18} rx={1} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, 104, 60, G)} paint={body} />
        <g transform={onTop(G)} className={body.ink}>
          <rect x={4} y={6} width={96} height={2} rx={1} />
          <rect x={4} y={16} width={96} height={2} rx={1} />
        </g>
        <g className="isometric153-ride">
          <Block faces={box(X - 12, 2, G, 24, 20, 6)} paint={body} />
          <g transform={onLeft(22)} className={body.ink}>
            <rect x={X - 8} y={-G - 4} width={16} height={2} rx={1} />
          </g>
          <Tube shape={TURRET} paint={body} />
          <Tube shape={UPPER} paint={body} />
          <Tube shape={SHOULDER} paint={body} />
        </g>
        <Block faces={box(X - 13, Y - 11, G, 26, 22, 6)} paint={body} />
        <g transform={onLeft(Y + 11)} className={body.ink}>
          {[4, 11, 18].map((x) => (
            <rect key={x} x={X - 13 + x} y={-DECK + 1} width={4} height={4} rx={1} />
          ))}
        </g>
        <Block faces={box(52, Y - 10, G, 48, 20, 6)} paint={body} />
        <g transform={onTop(DECK)} className={body.ink} clipPath={`url(#${clipId})`}>
          <g className="isometric153-belt">
            {[-1, 0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <rect key={index} x={54 + index * PITCH} y={Y - 8} width={2} height={16} rx={1} />
            ))}
          </g>
        </g>
        <g transform={onLeft(Y + 10)} className={body.ink}>
          {[58, 70, 82, 94].map((x) => (
            <circle key={x} cx={x} cy={-G - 3} r={1.5} />
          ))}
        </g>
        <g className="isometric153-box">
          <Block faces={box(X - BOX / 2, Y - BOX / 2, DECK, BOX, BOX, BOX)} paint={paint.accent} />
          <g transform={onTop(GRIP)} className={paint.accent.ink}>
            <rect x={X - 1} y={Y - BOX / 2} width={2} height={BOX} />
          </g>
          <g transform={onLeft(Y + BOX / 2)} className={paint.accent.ink}>
            <rect x={X - 1} y={-GRIP} width={2} height={6} />
          </g>
        </g>
        <g className="isometric153-ride">
          <g className="isometric153-lift">
            <Tube shape={PAD} paint={body} />
            <Tube shape={ROD} paint={body} />
          </g>
          <Tube shape={SLEEVE} paint={body} />
          <Tube shape={FOREARM} paint={body} />
          <Tube shape={ELBOW} paint={body} />
        </g>
      </svg>
    </div>
  );
}
