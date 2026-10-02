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

interface Isometric200Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the sync dots and both check marks with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric200Demo: Isometric200Props = {
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
const FOOT = { x: 14, y: 46, z: BASE + 3 };
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

const PERIOD = 9.6;
// The watch lies on the desk beside the stand: a case with a strap running off both ends
const WATCH = { x: 94, y: 26, w: 24, d: 28, h: 6 };
const CHECK = "M-4 0.4L-1.2 3.2L4.4 -3";
// The dots step one place along the line, the first fading in and the last fading out
const DOTS = [0, 1, 2, 3];
const STEP = { phone: 5.5, watch: 3.6 };
const LINK = { x: 21, y: 89.5 };

const hop = (name: string, step: number) =>
  `@keyframes isometric200-${name}-in { from { transform: translateX(0); opacity: 0; } to { transform: translateX(${step}px); opacity: 1; } }
@keyframes isometric200-${name} { from { transform: translateX(0); } to { transform: translateX(${step}px); } }
@keyframes isometric200-${name}-out { from { transform: translateX(0); opacity: 1; } to { transform: translateX(${step}px); opacity: 0; } }
.isometric200-${name}-in { animation: isometric200-${name}-in 0.6s linear infinite; }
.isometric200-${name} { animation: isometric200-${name} 0.6s linear infinite; }
.isometric200-${name}-out { animation: isometric200-${name}-out 0.6s linear infinite; }`;

const STYLES = `
${hop("phone", STEP.phone)}
${hop("watch", STEP.watch)}
@keyframes isometric200-sync { 0%, 4% { opacity: 0; } 8%, 56% { opacity: 1; } 60%, 100% { opacity: 0; } }
@keyframes isometric200-done { 0%, 60% { opacity: 0; } 64%, 92% { opacity: 1; } 97%, 100% { opacity: 0; } }
@keyframes isometric200-check { 0%, 64% { stroke-dashoffset: 14; } 70%, 100% { stroke-dashoffset: 0; } }
.isometric200-sync { animation: isometric200-sync ${PERIOD}s linear infinite; }
.isometric200-done { animation: isometric200-done ${PERIOD}s linear infinite; }
.isometric200-check { stroke-dasharray: 14; animation: isometric200-check ${PERIOD}s ease-out infinite; }
.isometric200-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric200-scene * { animation: none !important; } }
`;

const part = (name: string, index: number) => `isometric200-${name}${index === 0 ? "-in" : index === DOTS.length - 1 ? "-out" : ""}`;

export function Isometric200({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric200Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const dot = accent ? mine.base : body.base;
  const disc = accent ? mine.base : body.base;
  const face = { x: WATCH.x + WATCH.w / 2, y: WATCH.y + WATCH.d / 2 };

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric200-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-74 -116 198 226" aria-hidden="true" className="isometric200-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 130, 72, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />
        {/* The rest the phone leans against, then the phone itself, each built from thin layers back to front */}
        {REST_LAYERS.map((depth, index) => (
          <g key={`rest-${depth}`} transform={plane(depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={`body-${depth}`} transform={plane(depth, TALL)}>
            <rect width={W} height={TALL} rx={9} className={body.base} />
            <rect width={W} height={TALL} rx={9} className={body.right} />
            {depth > 1 && depth < 5 && <rect x={W - 0.5} y={30} width={1.6} height={16} rx={0.8} className={body.ink} />}
          </g>
        ))}
        <g transform={GLASS}>
          <rect width={W} height={TALL} rx={9} strokeWidth={1} className={cn(body.base, body.edge)} />
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          <rect x={7} y={16} width={24} height={3.6} rx={1.8} className={body.base} />
          {/* The paired watch on its card */}
          <rect x={6} y={26} width={52} height={48} rx={6} className={body.base} />
          <rect x={26} y={31} width={12} height={38} rx={3} className={cn(body.ink, "opacity-60")} />
          <rect x={21} y={39} width={22} height={22} rx={6} className={body.ink} />
          <rect x={23.5} y={41.5} width={17} height={17} rx={4} className={body.base} />
          <rect x={27.5} y={47} width={9} height={2.4} rx={1.2} className={body.ink} />
          <rect x={29} y={51.5} width={6} height={2} rx={1} className={body.ink} />
          {/* Phone to watch: dots run along the link, then a check takes their place */}
          <rect x={9} y={83.5} width={8} height={12} rx={2.2} className={body.base} />
          <rect x={47} y={85} width={9} height={9} rx={2.8} className={body.base} />
          <g className="isometric200-sync">
            {DOTS.map((index) => (
              <circle key={`link-${index}`} cx={LINK.x + index * STEP.phone} cy={LINK.y} r={1.5} className={cn(part("phone", index), dot)} />
            ))}
          </g>
          <g transform={`translate(${W / 2} ${LINK.y})`} className="isometric200-done opacity-0">
            <circle r={6} className={disc} />
            <path d={CHECK} fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={cn("isometric200-check", onAccent)} />
          </g>
          <rect x={18} y={102} width={28} height={3} rx={1.5} className={body.base} />
          <rect x={23} y={108} width={18} height={2.4} rx={1.2} className={cn(body.base, "opacity-60")} />
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* The watch: far strap, case with its crown, then the near strap */}
        <RoundBlock shape={roundBox(WATCH.x + 3.5, 5, BASE, WATCH.w - 7, WATCH.y - 3, 2.5, 3)} paint={body} />
        <RoundBlock shape={roundBox(WATCH.x, WATCH.y, BASE, WATCH.w, WATCH.d, WATCH.h, 7)} paint={body} />
        <Block faces={box(WATCH.x + WATCH.w - 0.5, face.y - 3, BASE + 2, 2.5, 6, 2.5)} paint={body} />
        <RoundBlock shape={roundBox(WATCH.x + 3.5, WATCH.y + WATCH.d - 2, BASE, WATCH.w - 7, 68 - WATCH.y - WATCH.d + 2, 2.5, 3)} paint={body} />
        <g transform={onTop(BASE + 2.5)} className={body.ink}>
          {[58, 61.5, 65].map((y) => (
            <circle key={`hole-${y}`} cx={face.x} cy={y} r={0.9} />
          ))}
        </g>
        <g transform={onTop(BASE + WATCH.h)}>
          <rect x={WATCH.x + 2.5} y={WATCH.y + 2.5} width={WATCH.w - 5} height={WATCH.d - 5} rx={5} className={body.ink} />
          <g className="isometric200-sync">
            {DOTS.map((index) => (
              <circle key={`face-${index}`} cx={face.x - 2 * STEP.watch + index * STEP.watch} cy={face.y} r={1.3} className={cn(part("watch", index), dot)} />
            ))}
          </g>
          <g transform={`translate(${face.x} ${face.y})`} className="isometric200-done opacity-0">
            <circle r={6} className={disc} />
            <path d={CHECK} fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={cn("isometric200-check", onAccent)} />
          </g>
        </g>
      </svg>
    </div>
  );
}
