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

interface Isometric79Props {
  /** Room number printed on the key tag. */
  room?: string;
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the bell dome with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric79Demo: Isometric79Props = {
  room: "12",
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

/** A flat plan shape pushed up from z by h, one unit per layer, lit from the top. */
function Slab({ d, z, h, paint }: { d: string; z: number; h: number; paint: Paint }) {
  return (
    <g>
      {Array.from({ length: h }, (_, k) => (
        <g key={k} transform={onTop(z + k)}>
          <path d={d} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(paint.base, k === 0 && paint.edge)} />
          <path d={d} className={paint.right} />
        </g>
      ))}
      <path d={d} transform={onTop(z + h)} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(paint.base, paint.edge)} />
    </g>
  );
}

/** Screen point of a plan position. */
const at = (x: number, y: number, z: number) => [(x - y) * C, (x + y) * S - z] as const;
// A plan circle of radius r projects to an ellipse with these radii; a sphere to a circle of RX
const RX = C * Math.SQRT2;
const RY = S * Math.SQRT2;

/** A half sphere of radius r sitting on the circle at (cx, cy, z), shaded in two halves. */
function Dome({ cx, cy, z, r, paint }: { cx: number; cy: number; z: number; r: number; paint: Paint }) {
  const [sx, sy] = at(cx, cy, z);
  const rx = r * RX;
  const ry = r * RY;
  const whole = `M${sx - rx} ${sy}A${rx} ${rx} 0 0 1 ${sx + rx} ${sy}A${rx} ${ry} 0 0 1 ${sx - rx} ${sy}Z`;
  const left = `M${sx - rx} ${sy}A${rx} ${rx} 0 0 1 ${sx} ${sy - rx}L${sx} ${sy + ry}A${rx} ${ry} 0 0 1 ${sx - rx} ${sy}Z`;
  const right = `M${sx + rx} ${sy}A${rx} ${rx} 0 0 0 ${sx} ${sy - rx}L${sx} ${sy + ry}A${rx} ${ry} 0 0 0 ${sx + rx} ${sy}Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={whole} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.right} stroke="none" />
    </g>
  );
}

const DESK = 10;
const BELL = { x: 42, y: 42 };
const BASE_R = 34;
const DOME_R = 28;
const DOME_Z = DESK + 8;
const TAG = { x: 80, y: 30, w: 40, d: 28 };
const TAG_PATH = `M${TAG.x + 8} ${TAG.y}H${TAG.x + TAG.w - 13}L${TAG.x + TAG.w} ${TAG.y + TAG.d / 2}L${TAG.x + TAG.w - 13} ${TAG.y + TAG.d}H${TAG.x + 8}A8 8 0 0 1 ${TAG.x} ${TAG.y + TAG.d - 8}V${TAG.y + 8}A8 8 0 0 1 ${TAG.x + 8} ${TAG.y}ZM${TAG.x + TAG.w - 14} ${TAG.y + TAG.d / 2}a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z`;
const RAYS = [-60, -30, 0, 30, 60];
const RING: Record<Palette, string> = {
  theme: "stroke-foreground/15",
  light: "stroke-zinc-950/15",
  dark: "stroke-white/15",
  tone: "stroke-white/30",
};

const STYLES = `
@keyframes isometric79-tap { 0%, 20%, 34%, 100% { transform: translateY(0); } 24%, 28% { transform: translateY(4px); } }
@keyframes isometric79-ring { 0%, 25% { transform: scale(0.6); opacity: 0; } 30% { transform: scale(1); opacity: 1; } 56%, 100% { transform: scale(1.25); opacity: 0; } }
@keyframes isometric79-wobble { 0%, 26%, 50%, 100% { transform: translateY(0); } 32% { transform: translateY(1.5px); } 40% { transform: translateY(-1px); } }
.isometric79-plunger { animation: isometric79-tap 3.6s ease-in-out infinite; }
.isometric79-dome { animation: isometric79-wobble 3.6s ease-out infinite; }
.isometric79-ring { animation: isometric79-ring 3.6s ease-out infinite; transform-box: fill-box; transform-origin: center bottom; }
.isometric79-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric79-plunger, .isometric79-dome, .isometric79-ring { animation: none; } }
`;

export function Isometric79({ room = isometric79Demo.room, tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric79Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const label = palette === "tone" ? "fill-black/70" : palette === "dark" ? "fill-zinc-100" : palette === "light" ? "fill-zinc-900" : "fill-foreground";
  const [px, py] = at(BELL.x, BELL.y, DOME_Z + DOME_R + 10);
  const rayPaint = accent ? paint.accent.base : paint.body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric79-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -64 198 176" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, 132, 88, DESK)} paint={paint.body} />
        <g fillRule="evenodd">
          <Slab d={TAG_PATH} z={DESK} h={3} paint={paint.body} />
        </g>
        <g transform={onTop(DESK + 3)}>
          <text x={TAG.x + 16} y={TAG.y + TAG.d / 2} textAnchor="middle" dominantBaseline="central" fontSize={15} className={cn("font-medium", label)}>
            {room}
          </text>
          <circle cx={TAG.x + TAG.w + 5} cy={TAG.y + TAG.d / 2} r={7} fill="none" strokeWidth={2.5} className={RING[palette]} />
        </g>
        <RoundBlock shape={roundBox(BELL.x - BASE_R, BELL.y - BASE_R, DESK, BASE_R * 2, BASE_R * 2, 8, BASE_R)} paint={paint.body} />
        <g className="isometric79-dome">
          <RoundBlock shape={roundBox(BELL.x - DOME_R, BELL.y - DOME_R, DOME_Z - 1, DOME_R * 2, DOME_R * 2, 1, DOME_R)} paint={paint.accent} />
          <Dome cx={BELL.x} cy={BELL.y} z={DOME_Z} r={DOME_R} paint={paint.accent} />
        </g>
        <g className="isometric79-plunger">
          <RoundBlock shape={roundBox(BELL.x - 2.5, BELL.y - 2.5, DOME_Z + DOME_R - 2, 5, 5, 10, 2.5)} paint={paint.body} />
          <RoundBlock shape={roundBox(BELL.x - 6, BELL.y - 6, DOME_Z + DOME_R + 8, 12, 12, 2, 6)} paint={paint.body} />
          <Dome cx={BELL.x} cy={BELL.y} z={DOME_Z + DOME_R + 10} r={6} paint={paint.body} />
        </g>
        <g className="isometric79-ring opacity-0">
          {RAYS.map((angle) => (
            <rect key={angle} x={px - 2} y={py - 38} width={4} height={12} rx={2} transform={`rotate(${angle} ${px} ${py})`} className={rayPaint} />
          ))}
        </g>
      </svg>
    </div>
  );
}
