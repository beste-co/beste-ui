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

interface Isometric195Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the pressed keys, the verified code and the check with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric195Demo: Isometric195Props = {
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
// Four code boxes, a twelve key pad, and the keys that get pressed in order
const SLOTS = [0, 1, 2, 3].map((index) => ({ x: 8 + index * 12.5, y: 40 }));
const KEYS = Array.from({ length: 12 }, (_, index) => ({ x: 16 + (index % 3) * 16, y: 71 + Math.floor(index / 3) * 11.5 }));
const PRESSED = [4, 1, 8, 10];
const TAP = (index: number) => 12 + index * 10;
const CHECK = "M-3.4 0.3L-1 2.7L3.6 -2.6";
const TOKEN = { x: 89, y: 28, w: 9, d: 24, h: 4 };

const STYLES = `
${PRESSED.map((_, index) => `@keyframes isometric195-digit${index} { 0%, ${TAP(index)}% { opacity: 0; } ${TAP(index) + 3}%, 90% { opacity: 1; } 96%, 100% { opacity: 0; } }
@keyframes isometric195-tap${index} { 0%, ${TAP(index) - 2}% { opacity: 0; } ${TAP(index)}% { opacity: 1; } ${TAP(index) + 6}%, 100% { opacity: 0; } }
.isometric195-digit${index} { animation: isometric195-digit${index} ${PERIOD}s linear infinite; }
.isometric195-tap${index} { animation: isometric195-tap${index} ${PERIOD}s linear infinite; }`).join("\n")}
@keyframes isometric195-locked { 0%, 52% { opacity: 1; } 57%, 91% { opacity: 0; } 96%, 100% { opacity: 1; } }
@keyframes isometric195-verified { 0%, 52% { opacity: 0; } 57%, 90% { opacity: 1; } 96%, 100% { opacity: 0; } }
@keyframes isometric195-check { 0%, 56% { stroke-dashoffset: 11; } 64%, 100% { stroke-dashoffset: 0; } }
.isometric195-locked { animation: isometric195-locked ${PERIOD}s linear infinite; }
.isometric195-verified { animation: isometric195-verified ${PERIOD}s linear infinite; }
.isometric195-check { stroke-dasharray: 11; animation: isometric195-check ${PERIOD}s ease-out infinite; }
.isometric195-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric195-scene * { animation: none !important; } }
`;

export function Isometric195({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric195Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill, and one drawn in the accent on a neutral fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric195-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 166 210" aria-hidden="true" className="isometric195-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 100, 72, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />
        {/* The rest the phone leans against, then the phone itself, each built from thin layers back to front */}
        {REST_LAYERS.map((depth, index) => (
          <g key={`rest-${depth}`} transform={plane(depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={`layer-${depth}`} transform={plane(depth, TALL)}>
            <rect width={W} height={TALL} rx={9} className={body.base} />
            <rect width={W} height={TALL} rx={9} className={body.right} />
            {depth > 1 && depth < 5 && <rect x={W - 0.5} y={30} width={1.6} height={16} rx={0.8} className={body.ink} />}
          </g>
        ))}
        <g transform={GLASS}>
          <rect width={W} height={TALL} rx={9} strokeWidth={1} className={cn(body.base, body.edge)} />
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          {/* The badge: a padlock while the code is typed, a check once it is verified */}
          <g transform={`translate(${W / 2} 23)`}>
            <circle r={7} className={body.base} />
            <g className="isometric195-locked opacity-0">
              <rect x={-3} y={-0.8} width={6} height={4.6} rx={1.2} className={body.ink} />
              <path d="M-1.9 -0.8v-1.3a1.9 1.9 0 0 1 3.8 0v1.3" fill="none" strokeWidth={1.1} strokeLinecap="round" className={body.edge} />
            </g>
            <g className="isometric195-verified">
              <circle r={7} className={accent ? mine.base : body.ink} />
              <path d={CHECK} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={cn("isometric195-check", onAccent)} />
            </g>
          </g>
          <rect x={W / 2 - 13} y={33.2} width={26} height={2.8} rx={1.4} className={body.base} />
          {/* The code boxes fill one by one as the keys are tapped */}
          {SLOTS.map((slot, index) => (
            <g key={`slot-${slot.x}`}>
              <rect x={slot.x} y={slot.y} width={10.5} height={14} rx={3} className={body.base} />
              <circle cx={slot.x + 5.25} cy={slot.y + 7} r={2.1} className={cn(`isometric195-digit${index}`, body.ink)} />
            </g>
          ))}
          <g className="isometric195-verified" fill="none" strokeWidth={1.2}>
            {SLOTS.map((slot) => (
              <rect key={`ring-${slot.x}`} x={slot.x} y={slot.y} width={10.5} height={14} rx={3} className={inAccent} />
            ))}
          </g>
          <rect x={W / 2 - 10} y={58.5} width={20} height={2.2} rx={1.1} className={cn(body.base, "opacity-60")} />
          {/* The key pad; each pressed key lights up for a moment */}
          {KEYS.map((key, index) => (
            <circle key={`key-${index}`} cx={key.x} cy={key.y} r={4.6} className={cn(body.base, "opacity-60")} />
          ))}
          {PRESSED.map((key, index) => {
            const at = KEYS[key];
            return at ? <circle key={`tap-${key}`} cx={at.x} cy={at.y} r={4.6} className={cn(`isometric195-tap${index} opacity-0`, accent ? mine.base : body.base)} /> : null;
          })}
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* A security key lies on the base beside the stand */}
        <RoundBlock shape={roundBox(TOKEN.x, TOKEN.y, BASE, TOKEN.w, TOKEN.d, TOKEN.h, 4.5)} paint={body} />
        <g transform={onTop(BASE + TOKEN.h)}>
          <circle cx={TOKEN.x + 4.5} cy={TOKEN.y + 8} r={2.6} className={accent ? mine.base : body.ink} />
          <circle cx={TOKEN.x + 4.5} cy={TOKEN.y + 19.5} r={1.5} className={body.ink} />
        </g>
      </svg>
    </div>
  );
}
