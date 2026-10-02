"use client";

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

interface Isometric15Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the flag and the lit trail markers with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric15Demo: Isometric15Props = {
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

const G = 8;
type Plan = [number, number];
type Shade = "left" | "right" | "front";
const mix = (a: Point, b: Point, k: number): Point => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const spot = (point: Point) => project(point).split(",").map(Number) as [number, number];

/** A low-poly peak: one triangular facet per base edge that faces the viewer, shaded by the way it faces. */
function peak(apex: Point, base: Plan[], snow = 0) {
  const cx = base.reduce((sum, [x]) => sum + x, 0) / base.length;
  const cy = base.reduce((sum, [, y]) => sum + y, 0) / base.length;
  return base.flatMap(([ax, ay], index) => {
    const [bx, by] = base[(index + 1) % base.length] as Plan;
    const a: Point = [ax, ay, G];
    const b: Point = [bx, by, G];
    const u = [bx - ax, by - ay, 0];
    const v = [apex[0] - ax, apex[1] - ay, apex[2] - G];
    let n = [u[1]! * v[2]! - u[2]! * v[1]!, u[2]! * v[0]! - u[0]! * v[2]!, u[0]! * v[1]! - u[1]! * v[0]!];
    if (n[0]! * ((ax + bx) / 2 - cx) + n[1]! * ((ay + by) / 2 - cy) < 0) n = n.map((part) => -part);
    const [nx = 0, ny = 0, nz = 0] = n;
    if (nx + ny + nz <= 0) return [];
    const shade: Shade = ny > nx * 1.6 ? "left" : nx > ny * 1.6 ? "right" : "front";
    const cap = snow
      ? polygon([apex, mix(apex, a, snow), mix(apex, mix(a, b, 0.25), snow - 0.07), mix(apex, mix(a, b, 0.5), snow + 0.1), mix(apex, mix(a, b, 0.75), snow - 0.05), mix(apex, b, snow)])
      : "";
    return [{ points: polygon([a, b, apex]), shade, cap }];
  });
}

const SUMMIT: Point = [52, 52, G + 78];
const MAIN_BASE: Plan[] = [[86, 56], [74, 82], [46, 88], [20, 70], [18, 40], [40, 20], [70, 22]];
const PEAKS = [
  peak([22, 57, G + 42], [[40, 58], [32, 76], [12, 76], [4, 56], [10, 40], [30, 38]], 0.26),
  peak([74, 28, G + 38], [[94, 30], [86, 48], [62, 48], [54, 28], [64, 10], [86, 10]]),
  peak(SUMMIT, MAIN_BASE, 0.32),
];
const FOOTHILL = peak([80, 75, G + 20], [[94, 74], [88, 88], [72, 90], [64, 76], [72, 62], [88, 62]]);

/** A point on the main peak's slope: up the line from a spot on a base edge toward the summit. */
function slope(edge: number, along: number, up: number): Point {
  const [ax, ay] = MAIN_BASE[edge] as Plan;
  const [bx, by] = MAIN_BASE[(edge + 1) % MAIN_BASE.length] as Plan;
  return mix([ax + (bx - ax) * along, ay + (by - ay) * along, G], SUMMIT, up);
}
// The trail zigzags up the two near faces; each stop is a marker, with small dots between them
const STOPS = [slope(2, 0.4, 0.05), slope(1, 0.75, 0.2), slope(2, 0.3, 0.36), slope(1, 0.6, 0.5), slope(2, 0.12, 0.65), slope(1, 0.72, 0.81)];
const MARKERS = STOPS.map(spot);
const DOTS = STOPS.slice(0, -1).flatMap((from, index) => [1, 2].map((part) => spot(slope3(from, STOPS[index + 1] as Point, part / 3))));
/** A point between two trail stops, kept on the slope by bulging toward the viewer. */
function slope3(from: Point, to: Point, k: number): Point {
  const flat = mix(from, to, k);
  const bulge = Math.sin(Math.PI * k) * 1.5;
  return [flat[0] + bulge, flat[1] + bulge, flat[2]];
}

const POLE = 42;
const POLE_TOP = SUMMIT[2] + POLE;
const [PX, PY] = spot(SUMMIT);
// A 3 by 2 flag facing the viewer, cut into narrow strips that each tilt, so the ripple runs through it without steps
const FLAG = { w: 30, h: 19, strips: 12 };
const STRIP = FLAG.w / FLAG.strips;
const WAVE = { length: 22, height: 2.6, phases: 8 };
/** Height of the ripple at a distance along the flag and a moment in its cycle; it grows away from the pole. */
const ripple = (along: number, moment: number) => WAVE.height * (along / FLAG.w) * Math.sin(2 * Math.PI * (along / WAVE.length - moment));
const FLUTTER = Array.from({ length: FLAG.strips }, (_, index) => {
  const stops = Array.from({ length: WAVE.phases + 1 }, (_, phase) => {
    const moment = phase / WAVE.phases;
    const near = ripple(index * STRIP, moment);
    const far = ripple((index + 1) * STRIP, moment);
    const tilt = (Math.atan2(far - near, STRIP) * 180) / Math.PI;
    return { at: (moment * 100).toFixed(1), move: `translateY(${near.toFixed(2)}px) skewY(${tilt.toFixed(2)}deg)`, shade: Math.min(1, Math.max(0, (far - near) / STRIP) * 3.2).toFixed(2) };
  });
  return `@keyframes isometric15-strip${index} { ${stops.map((stop) => `${stop.at}% { transform: ${stop.move}; }`).join(" ")} }
@keyframes isometric15-fold${index} { ${stops.map((stop) => `${stop.at}% { opacity: ${stop.shade}; }`).join(" ")} }
.isometric15-strip${index} { animation: isometric15-strip${index} 1.8s linear infinite; }
.isometric15-fold${index} { animation: isometric15-fold${index} 1.8s linear infinite; }`;
}).join("\n");
// The flag starts just above the summit and rides this far up the pole
const TRAVEL = POLE - FLAG.h - 3;
const PERIOD = 8;
const lit = (index: number) => 6 + index * 5;

function Tree({ x, y, size, paint }: { x: number; y: number; size: number; paint: Paint }) {
  const [px, py] = spot([x, y, G]);
  const cone = (base: number, tip: number, half: number) => [`${px - half * size},${py - base * size} ${px + half * size},${py - base * size} ${px},${py - tip * size}`, `${px},${py - base * size} ${px + half * size},${py - base * size} ${px},${py - tip * size}`];
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <rect x={px - 1.5 * size} y={py - 5 * size} width={3 * size} height={5 * size} className={paint.ink} stroke="none" />
      {[cone(4, 17, 8), cone(11, 24, 6)].map(([whole, shade], index) => (
        <g key={index}>
          <polygon points={whole} className={paint.base} />
          <polygon points={whole} className={paint.ink} stroke="none" />
          <polygon points={shade} className={paint.right} stroke="none" />
        </g>
      ))}
    </g>
  );
}

const STYLES = `
${MARKERS.map((_, index) => `@keyframes isometric15-lit${index} { 0%, ${lit(index)}% { opacity: 0; } ${lit(index) + 2}%, 86% { opacity: 1; } 92%, 100% { opacity: 0; } }
.isometric15-lit${index} { animation: isometric15-lit${index} ${PERIOD}s linear infinite; }`).join("\n")}
@keyframes isometric15-raise { 0%, 34% { transform: translateY(${TRAVEL}px); opacity: 0; } 36% { transform: translateY(${TRAVEL}px); opacity: 1; } 52%, 80% { transform: translateY(0); opacity: 1; } 90% { transform: translateY(${TRAVEL}px); opacity: 1; } 92%, 100% { transform: translateY(${TRAVEL}px); opacity: 0; } }
${FLUTTER}
.isometric15-raise { animation: isometric15-raise ${PERIOD}s cubic-bezier(0.45, 0, 0.3, 1) infinite; }
.isometric15-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric15-scene * { animation: none !important; } }
`;

export function Isometric15({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric15Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const flag = paint.accent;
  const glow = accent ? flag.base : body.base;

  const facets = (faces: ReturnType<typeof peak>) => (
    <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
      {faces.map((face) => (
        <g key={face.points}>
          <polygon points={face.points} className={body.base} />
          <polygon points={face.points} className={body.ink} stroke="none" />
          {face.shade !== "front" && <polygon points={face.points} className={body[face.shade]} stroke="none" />}
        </g>
      ))}
      {faces.map((face) =>
        face.cap ? (
          <g key={face.cap} stroke="none">
            <polygon points={face.cap} className={body.base} />
            {face.shade === "right" && <polygon points={face.cap} className={body.left} />}
          </g>
        ) : null,
      )}
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric15-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-92 -92 184 198" aria-hidden="true" className="isometric15-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 100, 100, G, 22)} paint={body} />
        {PEAKS.map((faces, index) => (
          <g key={index}>{facets(faces)}</g>
        ))}
        <g className={body.ink}>
          {DOTS.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={0.9} />
          ))}
        </g>
        {MARKERS.map(([x, y], index) => (
          <g key={index}>
            <circle cx={x} cy={y} r={2.4} className={body.base} />
            <circle cx={x} cy={y} r={2.4} className={body.ink} />
            <circle cx={x} cy={y} r={2.4} className={cn(`isometric15-lit${index}`, glow)} />
          </g>
        ))}
        <Tree x={94} y={50} size={0.75} paint={body} />
        {facets(FOOTHILL)}
        <Tree x={17} y={88} size={0.95} paint={body} />
        <Tree x={33} y={93} size={0.7} paint={body} />
        <g className={body.edge} strokeWidth={0.75}>
          <rect x={PX - 1.3} y={PY - POLE} width={2.6} height={POLE + 1} rx={1} className={body.base} />
          <rect x={PX} y={PY - POLE} width={1.3} height={POLE + 1} className={body.right} stroke="none" />
          <circle cx={PX} cy={PY - POLE - 1.5} r={2.6} className={body.base} />
        </g>
        {/* The flag hangs from the top of the pole by its hoist edge and streams to the right */}
        <g className="isometric15-raise">
          {Array.from({ length: FLAG.strips }, (_, index) => (
            <g key={index} transform={`translate(${(PX + 1.3 + index * STRIP).toFixed(2)} ${PY - POLE + 2})`}>
              <g className={`isometric15-strip${index}`}>
                <rect width={STRIP + 0.3} height={FLAG.h} className={flag.base} />
                <rect width={STRIP + 0.3} height={FLAG.h} className={cn(`isometric15-fold${index} opacity-0`, flag.right)} />
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
