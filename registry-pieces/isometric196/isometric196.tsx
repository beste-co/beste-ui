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

interface Isometric196Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the ball, the jump button and the lives with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric196Demo: Isometric196Props = {
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

const BASE = 6;
// The phone lies on its long edge
const W = 118;
const TALL = 64;
const THICK = 6;
const LEAN = (20 * Math.PI) / 180;
const FOOT = { x: 12, y: 46, z: BASE + 3 };
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
/** The matrix that lays local (across, down) units onto the leaning plane `depth` behind the glass, starting `rise` up the phone. */
function plane(depth: number, rise: number, left = 0) {
  const origin: Point = [FOOT.x + left, FOOT.y + UP[1] * rise + BACK[1] * depth, FOOT.z + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
const GLASS = plane(0, TALL);
// Behind the glass the body is a stack of thin layers, far to near
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
const REST = { inset: 22, tall: 36, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);

// One obstacle passes the ball per beat; the ground scrolls a whole pitch each beat so the loop is seamless
const BEAT = 2.4;
const PITCH = 36;
const GROUND = 46;
const BALL = { x: 41, r: 4, jump: 17 };
const BLOCKS = [0, 1, 2, 3, 4].map((index) => 56 + (index - 1) * PITCH);
const DASHES = Array.from({ length: 9 }, (_, index) => 8 + index * (PITCH / 2));

const STYLES = `
@keyframes isometric196-scroll { from { transform: translateX(0); } to { transform: translateX(${-PITCH}px); } }
@keyframes isometric196-jump { 0%, 22% { transform: translateY(0); animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); } 50% { transform: translateY(${-BALL.jump}px); animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); } 78%, 100% { transform: translateY(0); } }
@keyframes isometric196-press { 0%, 14%, 30%, 100% { transform: scale(1); } 21% { transform: scale(0.86); } }
@keyframes isometric196-stick { 0%, 100% { transform: translateX(-1.5px); } 50% { transform: translateX(2.5px); } }
.isometric196-scroll { animation: isometric196-scroll ${BEAT}s linear infinite; }
.isometric196-jump { animation: isometric196-jump ${BEAT}s linear infinite; }
.isometric196-press { animation: isometric196-press ${BEAT}s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric196-stick { animation: isometric196-stick ${BEAT * 2}s ease-in-out infinite; }
.isometric196-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric196-scene * { animation: none !important; } }
`;

export function Isometric196({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric196Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric196-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-72 -60 204 176" aria-hidden="true" className="isometric196-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 142, 72, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x + REST.inset - 8, 14, BASE, W - 2 * REST.inset + 16, 44, 3, 8)} paint={body} />
        {/* The rest the phone leans against, then the phone itself, each built from thin layers back to front */}
        {REST_LAYERS.map((depth, index) => (
          <g key={`rest-${depth}`} transform={plane(depth, REST.tall, REST.inset)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W - 2 * REST.inset} height={REST.tall} rx={6} className={body.base} />
            <rect width={W - 2 * REST.inset} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={`layer-${depth}`} transform={plane(depth, TALL)}>
            <rect width={W} height={TALL} rx={9} className={body.base} />
            <rect width={W} height={TALL} rx={9} className={body.right} />
          </g>
        ))}
        <g transform={GLASS}>
          <rect width={W} height={TALL} rx={9} strokeWidth={1} className={cn(body.base, body.edge)} />
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <g clipPath={`url(#${clipId})`}>
            {/* Sky: two clouds, the score and the lives */}
            <rect x={62} y={17} width={18} height={4.5} rx={2.25} className={cn(body.base, "opacity-60")} />
            <rect x={30} y={24} width={11} height={3.5} rx={1.75} className={cn(body.base, "opacity-60")} />
            <rect x={15} y={8.5} width={22} height={4} rx={2} className={body.base} />
            {[0, 1, 2].map((life) => (
              <circle key={`life-${life}`} cx={97 + life * 6} cy={10.5} r={2} className={life < 2 && accent ? mine.base : body.base} opacity={life < 2 ? 1 : 0.6} />
            ))}
            {/* The ground and its blocks scroll past; the ball stays put and jumps each one */}
            <rect x={3} y={GROUND} width={W - 6} height={TALL - GROUND} className={cn(body.base, "opacity-60")} />
            <g className="isometric196-scroll">
              {DASHES.map((x) => (
                <rect key={`dash-${x}`} x={x} y={GROUND + 4} width={8} height={1.6} rx={0.8} className={body.ink} />
              ))}
              {BLOCKS.map((x) => (
                <rect key={`block-${x}`} x={x} y={GROUND - 9} width={6} height={9} rx={1.5} className={body.base} />
              ))}
            </g>
            <g className="isometric196-jump">
              <circle cx={BALL.x} cy={GROUND - BALL.r} r={BALL.r} className={accent ? mine.base : body.base} />
              <circle cx={BALL.x + 1.3} cy={GROUND - BALL.r - 1.2} r={1.1} className={accent ? mine.ink : body.ink} />
            </g>
          </g>
          {/* The camera pill on the short edge, the stick on the left and the two buttons on the right */}
          <rect x={6.5} y={TALL / 2 - 8} width={4} height={16} rx={2} className={body.ink} />
          <circle cx={24} cy={44} r={8.5} className={cn(body.base, "opacity-60")} />
          <circle cx={24} cy={44} r={4} className={cn("isometric196-stick", body.base)} />
          <circle cx={86} cy={50} r={4.6} className={cn(body.base, "opacity-60")} />
          <g className="isometric196-press">
            <circle cx={100} cy={42} r={6.5} className={accent ? mine.base : body.base} />
            <path d="M97.4 43.4L100 40.2L102.6 43.4" fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge} />
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x + REST.inset - 6, FOOT.y - 1, BASE + 3, W - 2 * REST.inset + 12, 6, 5, 2.5)} paint={body} />
      </svg>
    </div>
  );
}
