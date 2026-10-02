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

interface Isometric56Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the box on the right pan with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric56Demo: Isometric56Props = {
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

const POST_TOP = 96;
const BEAM = POST_TOP + 4;
// The beam lies in the plane facing the viewer, so it turns as a plain rotation on screen about its pivot
const ARM = 60;
const AXIS = -(BEAM + 4);
const A = ARM / (2 * C);
const PAN = 46;
const PAN_R = 20;
const PERIOD = 5.2;
// Slices of the beam's thickness, back to front; the pin that carries a pan sits on the front face
const BEAM_SLICES = [-2, -1, 0, 1, 2, 3];
const FACE = 3;
const LINK = 10;
// A damped swing: tips toward the heavier left pan, rocks back and settles level
const SWING: [number, number][] = [[0, 0], [8, 0], [16, -12], [26, 8], [36, -5], [45, 3], [53, -1.5], [60, 0.5], [66, 0], [100, 0]];
// The same swing in small eased steps, so the beam ends and the pans follow one path
const STEPS = SWING.slice(0, -1).flatMap(([at, angle], index): [number, number][] => {
  const [next, target] = SWING[index + 1] ?? [at, angle];
  if (angle === target) return [[at, angle]];
  return Array.from({ length: 8 }, (_, k): [number, number] => [at + ((next - at) * k) / 8, angle + (target - angle) * (0.5 - Math.cos((Math.PI * k) / 8) / 2)]);
});
const FRAMES: [number, number][] = [...STEPS, [100, 0]];
const EDGE_X = PAN_R * C * Math.SQRT2;
const EDGE_Y = PAN_R * S * Math.SQRT2;

/** A pan hangs from the pin at the beam end, so it moves exactly as that point does. */
function panKeyframes(side: 1 | -1) {
  return FRAMES.map(([at, angle]) => {
    const a = (angle * Math.PI) / 180;
    return `${at.toFixed(2)}% { transform: translate(${(side * ARM * (Math.cos(a) - 1)).toFixed(2)}px, ${(side * ARM * Math.sin(a)).toFixed(2)}px); }`;
  }).join(" ");
}

const STYLES = `
@keyframes isometric56-beam { ${FRAMES.map(([at, angle]) => `${at.toFixed(2)}% { transform: rotate(${angle.toFixed(2)}deg); }`).join(" ")} }
@keyframes isometric56-left { ${panKeyframes(-1)} }
@keyframes isometric56-right { ${panKeyframes(1)} }
.isometric56-beam { animation: isometric56-beam ${PERIOD}s linear infinite; }
.isometric56-left { animation: isometric56-left ${PERIOD}s linear infinite; }
.isometric56-right { animation: isometric56-right ${PERIOD}s linear infinite; }
.isometric56-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric56-beam, .isometric56-left, .isometric56-right { animation: none; } }
`;

function Pan({ side, paint, load, cord }: { side: 1 | -1; paint: Paint; load: Paint; cord: string }) {
  const x = side * A;
  const y = -side * A;
  // On screen: the pin on the beam, the ring under it, and the center of the pan's rim
  const sx = side * ARM;
  const pin = AXIS + FACE;
  const ring = pin + LINK;
  const rim = -(PAN + 6);
  const strand = (dx: number, dy: number) => `M${sx} ${ring}L${(sx + dx * EDGE_X).toFixed(1)} ${(rim + dy * EDGE_Y).toFixed(1)}`;
  return (
    <g className={side < 0 ? "isometric56-left" : "isometric56-right"}>
      <RoundBlock shape={roundBox(x - 12, y - 12, PAN - 4, 24, 24, 4, 12)} paint={paint} />
      <RoundBlock shape={roundBox(x - PAN_R, y - PAN_R, PAN, PAN_R * 2, PAN_R * 2, 6, PAN_R)} paint={paint} />
      <g transform={onTop(PAN + 6)} className={paint.ink}>
        <path d={`M${x - 16} ${y}a16 16 0 1 0 32 0a16 16 0 1 0 -32 0ZM${x - 14} ${y}a14 14 0 1 1 28 0a14 14 0 1 1 -28 0Z`} fillRule="evenodd" />
      </g>
      <path d={`${strand(-0.74, -0.68)}${strand(0.74, -0.68)}`} fill="none" strokeWidth={1} strokeLinecap="round" className={cord} />
      {side < 0 ? (
        <>
          <RoundBlock shape={roundBox(x - 10, y - 10, PAN + 6, 20, 20, 6, 10)} paint={load} />
          <RoundBlock shape={roundBox(x - 7.5, y - 7.5, PAN + 12, 15, 15, 5, 7.5)} paint={load} />
          <RoundBlock shape={roundBox(x - 5, y - 5, PAN + 17, 10, 10, 4, 5)} paint={load} />
          <RoundBlock shape={roundBox(x - 2, y - 2, PAN + 21, 4, 4, 3, 2)} paint={load} />
        </>
      ) : (
        <>
          <Block faces={box(x - 9, y - 9, PAN + 6, 18, 18, 13)} paint={load} />
          <g transform={onTop(PAN + 19)} className={load.ink}>
            <rect x={x - 9} y={y - 1.5} width={18} height={3} />
          </g>
          <g transform={onLeft(y + 9)} className={load.ink}>
            <rect x={x - 1.5} y={-(PAN + 19)} width={3} height={13} />
          </g>
        </>
      )}
      <path d={`${strand(-0.74, 0.68)}${strand(0.74, 0.68)}`} fill="none" strokeWidth={1} strokeLinecap="round" className={cord} />
      <path d={`M${sx} ${pin}V${ring}`} fill="none" strokeWidth={1.5} strokeLinecap="round" className={cord} />
      <circle cx={sx} cy={ring} r={2} className={paint.base} />
      <circle cx={sx} cy={ring} r={2} fill="none" strokeWidth={1} className={cord} />
      <circle cx={sx} cy={pin} r={2.2} className={paint.ink} />
    </g>
  );
}

export function Isometric56({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric56Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const cord = palette === "dark" ? "stroke-zinc-500" : palette === "tone" ? "stroke-black/40" : palette === "light" ? "stroke-zinc-400" : "stroke-foreground/40";
  const bar = { x: -ARM - 6, y: -4, width: (ARM + 6) * 2, height: 8, rx: 4 };

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric56-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-90 -122 180 150" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(-30, -30, 0, 60, 60, 10, 30)} paint={body} />
        <RoundBlock shape={roundBox(-18, -18, 10, 36, 36, 6, 18)} paint={body} />
        <RoundBlock shape={roundBox(-6, -6, 16, 12, 12, POST_TOP - 16, 6)} paint={body} />
        <RoundBlock shape={roundBox(-9, -9, POST_TOP - 6, 18, 18, 6, 9)} paint={body} />
        {BEAM_SLICES.map((depth, index) => {
          const front = index === BEAM_SLICES.length - 1;
          const lined = front || index === 0;
          return (
            <g key={depth} transform={`translate(0 ${AXIS + depth})`}>
              <g className={cn("isometric56-beam", body.edge)} strokeWidth={lined ? 1 : 0}>
                <rect {...bar} className={body.base} />
                <circle r={10} className={body.base} />
                <rect {...bar} className={body.base} stroke="none" />
                {front && <rect {...bar} className={body.left} stroke="none" />}
                {front && <circle r={10} className={body.left} stroke="none" />}
                {front && <circle r={3.5} className={body.ink} stroke="none" />}
              </g>
            </g>
          );
        })}
        <Pan side={-1} paint={body} load={body} cord={cord} />
        <Pan side={1} paint={body} load={paint.accent} cord={cord} />
      </svg>
    </div>
  );
}
