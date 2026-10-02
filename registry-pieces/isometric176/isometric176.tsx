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

interface Isometric176Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the accept button, the rings and the call meter with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric176Demo: Isometric176Props = {
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
// Stroke for small glyphs that carry no tone
const GLYPH: Record<Palette, string> = { theme: "stroke-foreground/40", light: "stroke-zinc-950/40", dark: "stroke-white/40", tone: "stroke-white/50", glass: "stroke-foreground/40" };

const PERIOD = 10;
const AVATAR = { x: W / 2, y: 40, r: 13 };
const BUTTONS = { y: 96, r: 8.5, decline: 18, accept: W - 18 };
const METER = [5, 9, 13, 8, 14, 7, 11];
// Bursts of buzzing while it rings, as [start, end] percentages of the loop
const BURSTS: [number, number][] = [[6, 13], [21, 28], [35, 41]];
// Each burst nudges the phone along its own width in quick alternating steps, so it stays seated on the stand
const BUZZ = BURSTS.flatMap(([from, to]) => {
  const steps = Math.round((to - from) / 0.7);
  return Array.from({ length: steps + 1 }, (_, index) => {
    const side = index === 0 || index === steps ? 0 : index % 2 ? 0.8 : -0.8;
    return `${(from + ((to - from) * index) / steps).toFixed(1)}% { transform: translate(${(side * C).toFixed(2)}px, ${(side * S).toFixed(2)}px); }`;
  });
}).join(" ");
const ring = (index: number) =>
  `@keyframes isometric176-ring${index} { 0% { transform: scale(1); opacity: 0; } 12% { opacity: 0.7; } 100% { transform: scale(1.95); opacity: 0; } }
.isometric176-ring${index} { animation: isometric176-ring${index} 2s ease-out ${(index * 0.66).toFixed(2)}s infinite; transform-box: fill-box; transform-origin: center; }`;
const bar = (index: number) =>
  `.isometric176-bar${index} { animation: isometric176-level ${(0.7 + (index % 3) * 0.22).toFixed(2)}s ease-in-out ${(-index * 0.17).toFixed(2)}s infinite; transform-box: fill-box; transform-origin: center bottom; }`;

const STYLES = `
@keyframes isometric176-buzz { 0% { transform: translate(0, 0); } ${BUZZ} 100% { transform: translate(0, 0); } }
${[0, 1, 2].map(ring).join("\n")}
@keyframes isometric176-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
@keyframes isometric176-press { 0%, 43% { transform: scale(1); } 45.5% { transform: scale(0.84); } 48%, 100% { transform: scale(1); } }
@keyframes isometric176-ringing { 0%, 47% { opacity: 1; } 50%, 92% { opacity: 0; } 97%, 100% { opacity: 1; } }
@keyframes isometric176-talking { 0%, 47% { opacity: 0; } 50%, 92% { opacity: 1; } 97%, 100% { opacity: 0; } }
@keyframes isometric176-level { 0%, 100% { transform: scaleY(0.35); } 50% { transform: scaleY(1); } }
.isometric176-buzz { animation: isometric176-buzz ${PERIOD}s linear infinite; }
.isometric176-breathe { animation: isometric176-breathe 1.2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric176-press { animation: isometric176-press ${PERIOD}s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric176-ringing { animation: isometric176-ringing ${PERIOD}s linear infinite; }
.isometric176-talking { animation: isometric176-talking ${PERIOD}s linear infinite; }
${METER.map((_, index) => bar(index)).join("\n")}
.isometric176-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric176-scene * { animation: none !important; } }
`;

export function Isometric176({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric176Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const onMine = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : GLYPH[palette];
  const ringStroke = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : GLYPH[palette];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric176-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 166 210" aria-hidden="true" className="isometric176-scene size-full overflow-visible">
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
        {/* The whole phone shivers in short bursts while it rings */}
        <g className="isometric176-buzz">
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
              {/* Rings spread from the caller's picture while the phone rings */}
              <g className="isometric176-ringing" fill="none" strokeWidth={1.2}>
                {[0, 1, 2].map((index) => (
                  <circle key={index} cx={AVATAR.x} cy={AVATAR.y} r={AVATAR.r} className={cn(`isometric176-ring${index} opacity-0`, ringStroke)} />
                ))}
              </g>
              {/* The caller: a plain silhouette on a disc */}
              <circle cx={AVATAR.x} cy={AVATAR.y} r={AVATAR.r} className={body.base} />
              <circle cx={AVATAR.x} cy={AVATAR.y - 3.5} r={4.6} className={body.ink} />
              <path d={`M${AVATAR.x - 8.6} ${AVATAR.y + 9.6}a8.6 7.4 0 0 1 17.2 0Z`} className={body.ink} />
              <rect x={W / 2 - 15} y={60} width={30} height={3.4} rx={1.7} className={body.base} />
              <g className="isometric176-ringing">
                <rect x={W / 2 - 9} y={67} width={18} height={2.4} rx={1.2} className={body.base} opacity={0.6} />
                {/* Decline on the left, accept on the right */}
                <g>
                  <circle cx={BUTTONS.decline} cy={BUTTONS.y} r={BUTTONS.r} className={body.base} />
                  <path d={`M${BUTTONS.decline - 4} ${BUTTONS.y + 1.4}q4 -4.2 8 0`} fill="none" strokeWidth={2.4} strokeLinecap="round" className={GLYPH[palette]} />
                </g>
                <g className="isometric176-press">
                  <g className="isometric176-breathe">
                    <circle cx={BUTTONS.accept} cy={BUTTONS.y} r={BUTTONS.r} className={accent ? mine.base : body.base} />
                    <path d="M-4 1.4q4 -4.2 8 0" transform={`translate(${BUTTONS.accept} ${BUTTONS.y}) rotate(-135)`} fill="none" strokeWidth={2.4} strokeLinecap="round" className={onMine} />
                  </g>
                </g>
              </g>
              {/* Once answered: a timer, a level meter and a single button to hang up */}
              <g className="isometric176-talking opacity-0">
                <rect x={W / 2 - 8} y={67} width={6.5} height={2.8} rx={1.4} className={accent ? mine.base : body.base} />
                <rect x={W / 2 + 1.5} y={67} width={6.5} height={2.8} rx={1.4} className={accent ? mine.base : body.base} />
                <circle cx={W / 2} cy={67.8} r={0.5} className={body.base} />
                <circle cx={W / 2} cy={69.2} r={0.5} className={body.base} />
                {METER.map((height, index) => (
                  <rect key={index} x={W / 2 - 17 + index * 5} y={88 - height} width={3} height={height} rx={1.5} className={cn(`isometric176-bar${index}`, accent ? mine.base : body.base)} />
                ))}
                <circle cx={W / 2} cy={BUTTONS.y + 4} r={BUTTONS.r - 1} className={body.base} />
                <path d={`M${W / 2 - 4} ${BUTTONS.y + 5.4}q4 -4.2 8 0`} fill="none" strokeWidth={2.4} strokeLinecap="round" className={GLYPH[palette]} />
              </g>
            </g>
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
      </svg>
    </div>
  );
}
