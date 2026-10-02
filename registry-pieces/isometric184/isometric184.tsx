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

interface Isometric184Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the end call button, the speaking ring and the level meter with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric184Demo: Isometric184Props = {
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
const FOOT = { x: 18, y: 46, z: BASE + 3 };
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
// The rest behind the phone: a little wider, half as tall
const REST = { side: 4, tall: 62, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);

const PERIOD = 9;
// The main video tile and the small self view that gets dragged from the top right corner to the bottom left
const TILE = { x: 5, y: 14, w: 54, h: 78 };
const SELF = { x: 39, y: 18, w: 16, h: 22, dx: -30, dy: 46 };
const CONTROLS = [16, 32, 48];
const BARS = [0, 1, 2];

const STYLES = `
@keyframes isometric184-ring { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
@keyframes isometric184-bar { 0%, 100% { transform: scaleY(0.35); } 50% { transform: scaleY(1); } }
@keyframes isometric184-drag { 0%, 40% { transform: translate(0, 0); } 52%, 88% { transform: translate(${SELF.dx}px, ${SELF.dy}px); } 97%, 100% { transform: translate(0, 0); } }
@keyframes isometric184-mute { 0%, 20% { opacity: 0; } 20.1%, 66% { opacity: 1; } 66.1%, 100% { opacity: 0; } }
@keyframes isometric184-live { 0%, 20% { opacity: 1; } 20.1%, 66% { opacity: 0; } 66.1%, 100% { opacity: 1; } }
@keyframes isometric184-tap { 0%, 17%, 23%, 63%, 69%, 100% { transform: scale(1); } 20%, 66% { transform: scale(0.86); } }
.isometric184-ring { animation: isometric184-ring 1.4s ease-in-out infinite; }
.isometric184-bar { animation: isometric184-bar 0.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center bottom; }
.isometric184-drag { animation: isometric184-drag ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.isometric184-mute { animation: isometric184-mute ${PERIOD}s step-end infinite; }
.isometric184-live { animation: isometric184-live ${PERIOD}s step-end infinite; }
.isometric184-tap { animation: isometric184-tap ${PERIOD}s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric184-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric184-scene * { animation: none !important; } }
`;

export function Isometric184({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric184Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill, and one drawn in the accent on a neutral fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;
  const tile = palette === "dark" ? "fill-black/30" : "fill-black/15";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric184-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 166 210" aria-hidden="true" className="isometric184-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 100, 72, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />
        {/* The rest the phone leans against, then the phone itself, each built from thin layers back to front */}
        {REST_LAYERS.map((depth, index) => (
          <g key={depth} transform={plane(depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
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
          <g clipPath={`url(#${clipId})`}>
            {/* The other caller: a plain head and shoulders on the main tile */}
            <rect x={TILE.x} y={TILE.y} width={TILE.w} height={TILE.h} rx={6} className={tile} />
            <circle cx={32} cy={46} r={10} className={body.base} />
            <path d={`M12 ${TILE.y + TILE.h}C12 72 22 64 32 64C42 64 52 72 52 ${TILE.y + TILE.h}Z`} className={body.base} />
            {/* While they speak, the tile's ring pulses and the level meter moves; both stop while muted */}
            <g className="isometric184-live">
              <rect x={TILE.x} y={TILE.y} width={TILE.w} height={TILE.h} rx={6} fill="none" strokeWidth={1.6} className={cn("isometric184-ring", inAccent)} />
              <rect x={8} y={17} width={14} height={9} rx={4.5} className={body.base} />
              {BARS.map((bar) => (
                <rect key={bar} x={11.2 + bar * 3} y={18.8} width={1.8} height={5.4} rx={0.9} className={cn("isometric184-bar", accent ? mine.base : body.ink)} style={{ animationDelay: `${bar * 0.18}s` }} />
              ))}
            </g>
            {/* The self view is picked up and dropped in the opposite corner */}
            <g className="isometric184-drag">
              <rect x={SELF.x} y={SELF.y} width={SELF.w} height={SELF.h} rx={3.5} strokeWidth={0.9} className={cn(body.base, body.edge)} />
              <circle cx={SELF.x + SELF.w / 2} cy={SELF.y + 8.5} r={3.2} className={body.ink} />
              <path d={`M${SELF.x + 2.5} ${SELF.y + SELF.h}C${SELF.x + 2.5} ${SELF.y + 16} ${SELF.x + 5} ${SELF.y + 14} ${SELF.x + SELF.w / 2} ${SELF.y + 14}C${SELF.x + SELF.w - 5} ${SELF.y + 14} ${SELF.x + SELF.w - 2.5} ${SELF.y + 16} ${SELF.x + SELF.w - 2.5} ${SELF.y + SELF.h}Z`} className={body.ink} />
            </g>
          </g>
          {/* Call controls: microphone, camera and the end call button */}
          <g className="isometric184-tap">
            <circle cx={CONTROLS[0]} cy={103} r={6} className={body.base} />
            <rect x={(CONTROLS[0] ?? 0) - 1.4} y={99.2} width={2.8} height={5} rx={1.4} className={body.ink} />
            <path d={`M${(CONTROLS[0] ?? 0) - 2.8} 103.2a2.8 2.8 0 0 0 5.6 0`} fill="none" strokeWidth={0.9} strokeLinecap="round" className={body.edge} />
            <path d={`M${(CONTROLS[0] ?? 0) - 3.4} 99.4l6.8 7.2`} fill="none" strokeWidth={1.4} strokeLinecap="round" className={cn("isometric184-mute opacity-0", inAccent)} />
          </g>
          <circle cx={CONTROLS[1]} cy={103} r={6} className={body.base} />
          <rect x={(CONTROLS[1] ?? 0) - 3.4} y={100.8} width={4.6} height={4.4} rx={1.2} className={body.ink} />
          <path d={`M${(CONTROLS[1] ?? 0) + 1.6} 103l2.2 -1.6v3.2Z`} className={body.ink} />
          <circle cx={CONTROLS[2]} cy={103} r={6} className={accent ? mine.base : body.base} />
          <rect x={(CONTROLS[2] ?? 0) - 3.2} y={101.8} width={6.4} height={2.4} rx={1.2} className={accent ? mine.ink : body.ink} />
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* An earbud case waits on the base beside the stand, its light in the accent color */}
        <RoundBlock shape={roundBox(87, 40, BASE, 11, 15, 6, 4.5)} paint={body} />
        <g transform={onRight(98)} className={body.ink}>
          <rect x={42} y={-BASE - 3.6} width={11} height={0.8} />
        </g>
        <g transform={onRight(98)}>
          <circle cx={47.5} cy={-BASE - 1.8} r={0.9} className={accent ? mine.base : body.ink} />
        </g>
      </svg>
    </div>
  );
}
