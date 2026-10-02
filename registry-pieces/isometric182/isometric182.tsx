"use client";

import { useId } from "react";
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

interface Isometric182Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the focus brackets and the gallery ring with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric182Demo: Isometric182Props = {
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
const W = 64;
const TALL = 118;
const THICK = 6;
// The phone stands on its bottom front edge and leans back by this much
const LEAN = (14 * Math.PI) / 180;
const FOOT = { x: 18, y: 46, z: BASE + 24 };
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
// The tripod: a hub under the phone, three legs out to small feet, and a clamp that grips the phone's edges
const HUB = { x: FOOT.x + W / 2, y: FOOT.y - 6, z: BASE + 10, top: BASE + 20, r: 5 };
const LEGS = [210, 330, 90].map((degrees) => {
  const turn = (degrees * Math.PI) / 180;
  return { degrees, x: HUB.x + 24 * Math.cos(turn), y: HUB.y + 24 * Math.sin(turn) };
});
const JAW = { top: TALL - 48, h: 16 };
const JAW_LAYERS = Array.from({ length: THICK + 2 }, (_, index) => THICK + 1 - index);
const LEG_STROKE: Record<Palette, string> = { theme: "stroke-card", light: "stroke-white", dark: "stroke-zinc-800", tone: "stroke-current" };
// The viewfinder and the gallery thumbnail the shot lands in, in screen units
const VIEW = { x: 4, y: 14, w: W - 8, h: 78 };
const THUMB = { x: 8, y: 99, s: 10 };
const SUBJECT = { x: 40, y: 42 };
const SHRINK = THUMB.s / VIEW.w;
const LANDED = `translate(${(THUMB.x - VIEW.x * SHRINK).toFixed(2)}px, ${(THUMB.y - VIEW.y * SHRINK).toFixed(2)}px) scale(${SHRINK.toFixed(3)}, ${(THUMB.s / VIEW.h).toFixed(3)})`;
const PERIOD = 8;

const STYLES = `
@keyframes isometric182-seek { 0%, 8% { transform: scale(1.7); opacity: 0; } 14% { opacity: 1; } 28%, 88% { transform: scale(1); opacity: 1; } 94%, 100% { transform: scale(1.7); opacity: 0; } }
@keyframes isometric182-lock { 0%, 30% { opacity: 0; } 32%, 88% { opacity: 1; } 94%, 100% { opacity: 0; } }
@keyframes isometric182-press { 0%, 40%, 46%, 100% { transform: scale(1); } 42%, 44% { transform: scale(0.72); } }
@keyframes isometric182-flash { 0%, 43% { opacity: 0; } 45% { opacity: 0.9; } 52%, 100% { opacity: 0; } }
@keyframes isometric182-shot { 0%, 46% { transform: translate(0, 0) scale(1); opacity: 0; } 47% { transform: translate(0, 0) scale(1); opacity: 1; } 62% { transform: ${LANDED}; opacity: 1; } 64%, 100% { transform: ${LANDED}; opacity: 0; } }
@keyframes isometric182-ring { 0%, 62% { opacity: 0; } 64%, 90% { opacity: 1; } 96%, 100% { opacity: 0; } }
.isometric182-seek { animation: isometric182-seek ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; transform-box: fill-box; transform-origin: center; }
.isometric182-lock { animation: isometric182-lock ${PERIOD}s linear infinite; }
.isometric182-press { animation: isometric182-press ${PERIOD}s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric182-flash { animation: isometric182-flash ${PERIOD}s ease-out infinite; }
.isometric182-shot { animation: isometric182-shot ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; transform-origin: 0 0; }
.isometric182-ring { animation: isometric182-ring ${PERIOD}s linear infinite; }
.isometric182-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric182-scene * { animation: none !important; } }
`;

const BRACKETS = "M-11 -6V-11H-6M6 -11H11V-6M11 6V11H6M-6 11H-11V6";

export function Isometric182({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric182Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const mark = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : "stroke-white/70";
  const leg = (to: { x: number; y: number }, key: number) => {
    const [x1, y1] = flat([HUB.x, HUB.y, HUB.z + 4]);
    const [x2, y2] = flat([to.x, to.y, BASE + 2]);
    return (
      <g key={`leg-${key}`} fill="none" strokeLinecap="round">
        <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={6} className={body.edge} />
        <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={4.5} className={LEG_STROKE[palette]} />
      </g>
    );
  };
  const foot = (to: { x: number; y: number }, key: number) => <RoundBlock key={`foot-${key}`} shape={roundBox(to.x - 3.5, to.y - 3.5, BASE, 7, 7, 2, 3.5)} paint={body} />;
  const [backLeft, backRight, front] = LEGS;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric182-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -140 166 234" aria-hidden="true" className="isometric182-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} rx={2} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 100, 72, BASE, 14)} paint={body} />
        {/* The two far legs, the hub, then the near leg */}
        {backLeft && foot(backLeft, 0)}
        {backRight && foot(backRight, 1)}
        {backLeft && leg(backLeft, 0)}
        {backRight && leg(backRight, 1)}
        <RoundBlock shape={roundBox(HUB.x - HUB.r, HUB.y - HUB.r, HUB.z, 2 * HUB.r, 2 * HUB.r, HUB.top - HUB.z, HUB.r)} paint={body} />
        {front && leg(front, 2)}
        {front && foot(front, 2)}
        <RoundBlock shape={roundBox(FOOT.x + 14, FOOT.y - 9, HUB.top, W - 28, 12, 4, 2.5)} paint={body} />
        {/* The clamp: a bar behind the phone with a stem down to the cradle, and a jaw round each edge */}
        <g transform={plane(THICK + 2, TALL)} className={body.edge} strokeWidth={1}>
          <rect x={W / 2 - 4} y={JAW.top} width={8} height={TALL - JAW.top + 2} className={body.base} />
          <rect x={-5} y={JAW.top} width={W + 10} height={JAW.h} rx={3} className={body.base} />
        </g>
        {JAW_LAYERS.map((depth) => (
          <g key={depth} transform={plane(depth, TALL)}>
            {[-5, W].map((x) => (
              <g key={x}>
                <rect x={x} y={JAW.top} width={5} height={JAW.h} rx={1.5} className={body.base} />
                <rect x={x} y={JAW.top} width={5} height={JAW.h} rx={1.5} className={body.right} />
              </g>
            ))}
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={depth} transform={plane(depth, TALL)}>
            <rect width={W} height={TALL} rx={9} className={body.base} />
            <rect width={W} height={TALL} rx={9} className={body.right} />
            {depth > 1 && depth < 5 && <rect x={W - 0.5} y={30} width={1.6} height={16} rx={0.8} className={body.ink} />}
          </g>
        ))}
        <g transform={GLASS}>
          <rect width={W} height={TALL} rx={9} strokeWidth={1} className={cn(body.base, body.edge)} />
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          {/* The viewfinder: a plain landscape, a thirds grid and focus brackets on the sun */}
          <g clipPath={`url(#${clipId})`}>
            <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} className={cn(body.base, "opacity-10")} />
            <circle cx={SUBJECT.x} cy={SUBJECT.y} r={7} className={cn(body.base, "opacity-80")} />
            <path d={`M${VIEW.x} 74L22 56L36 70L48 60L${VIEW.x + VIEW.w} 76V${VIEW.y + VIEW.h}H${VIEW.x}Z`} className={cn(body.base, "opacity-30")} />
            <path d={`M${VIEW.x} 84Q24 72 40 80T${VIEW.x + VIEW.w} 78V${VIEW.y + VIEW.h}H${VIEW.x}Z`} className={cn(body.base, "opacity-60")} />
            <g className={cn(body.base, "opacity-20")}>
              {[1, 2].map((third) => (
                <g key={third}>
                  <rect x={VIEW.x + (VIEW.w * third) / 3 - 0.25} y={VIEW.y} width={0.5} height={VIEW.h} />
                  <rect x={VIEW.x} y={VIEW.y + (VIEW.h * third) / 3 - 0.25} width={VIEW.w} height={0.5} />
                </g>
              ))}
            </g>
            <g transform={`translate(${SUBJECT.x} ${SUBJECT.y})`} fill="none" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
              <g className="isometric182-seek">
                <path d={BRACKETS} className="stroke-white/70" />
                <path d={BRACKETS} className={cn("isometric182-lock", mark)} />
              </g>
            </g>
            <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} className="isometric182-flash fill-white opacity-0" />
          </g>
          {/* Controls: the gallery thumbnail, the shutter and a mode switch */}
          <rect x={THUMB.x} y={THUMB.y} width={THUMB.s} height={THUMB.s} rx={2.5} className={cn(body.base, "opacity-50")} />
          <rect x={THUMB.x - 1.5} y={THUMB.y - 1.5} width={THUMB.s + 3} height={THUMB.s + 3} rx={3.5} fill="none" strokeWidth={1.4} className={cn("isometric182-ring", mark)} />
          <circle cx={W / 2} cy={104} r={7.5} fill="none" strokeWidth={1.4} className="stroke-white/70" />
          <circle cx={W / 2} cy={104} r={5.4} className={cn("isometric182-press", body.base)} />
          <rect x={W - 19} y={102} width={11} height={4} rx={2} className={cn(body.base, "opacity-40")} />
          {/* The shot itself, flying from the viewfinder into the thumbnail */}
          <g className="isometric182-shot opacity-0">
            <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} rx={2} strokeWidth={2} className={cn(body.base, "stroke-white/70")} />
            <circle cx={SUBJECT.x} cy={SUBJECT.y} r={7} className={body.ink} />
            <path d={`M${VIEW.x} 84Q24 72 40 80T${VIEW.x + VIEW.w} 78V${VIEW.y + VIEW.h}H${VIEW.x}Z`} className={body.ink} />
          </g>
        </g>
        {/* The near side of each jaw wraps onto the glass, and the cradle's lip holds the bottom edge */}
        <g transform={plane(-1, TALL)} className={body.edge} strokeWidth={1}>
          {[-5, W - 2].map((x) => (
            <g key={x}>
              <rect x={x} y={JAW.top} width={7} height={JAW.h} rx={1.5} className={body.base} />
              <rect x={x} y={JAW.top} width={7} height={JAW.h} rx={1.5} className={body.left} stroke="none" />
            </g>
          ))}
        </g>
        <RoundBlock shape={roundBox(FOOT.x + 14, FOOT.y - 1, HUB.top + 4, W - 28, 4, 4, 2)} paint={body} />
      </svg>
    </div>
  );
}
