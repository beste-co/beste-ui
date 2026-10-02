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
interface Isometric189Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the highlighted photo, the selection frame and the favorite button with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric189Demo: Isometric189Props = {
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
// The viewer window and the strip of photos that slides through it; the last photo repeats the first so the loop is seamless
const VIEW = { x: 6, y: 26, w: 52, h: 46 };
const PITCH = VIEW.w + 4;
const THUMB = { x: 6, y: 77, s: 16, pitch: 18 };
type Kind = "peaks" | "portrait" | "skyline";
const PHOTOS: Kind[] = ["peaks", "portrait", "skyline", "peaks"];
// The stack of prints lying on the base beside the stand
const PRINTS = [
  { x: 95, y: 30, z: BASE },
  { x: 97, y: 28, z: BASE + 1.5 },
  { x: 94, y: 31, z: BASE + 3 },
];
const PRINT = { w: 18, d: 24, h: 1.5 };

const STYLES = `
@keyframes isometric189-strip { 0%, 22% { transform: translateX(0); } 30%, 55% { transform: translateX(${-PITCH}px); } 63%, 88% { transform: translateX(${-2 * PITCH}px); } 96%, 100% { transform: translateX(${-3 * PITCH}px); } }
@keyframes isometric189-pick { 0%, 22% { transform: translateX(0); } 30%, 55% { transform: translateX(${THUMB.pitch}px); } 63%, 88% { transform: translateX(${2 * THUMB.pitch}px); } 96%, 100% { transform: translateX(0); } }
.isometric189-strip { animation: isometric189-strip ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.isometric189-pick { animation: isometric189-pick ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.isometric189-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric189-scene * { animation: none !important; } }
`;

/** The picture inside a photo, drawn in a box of the given size. */
function Picture({ kind, w, h, card, ink, spot }: { kind: Kind; w: number; h: number; card: string; ink: string; spot: string }) {
  const u = w / 52;
  return (
    <g>
      <rect width={w} height={h} rx={5 * u} className={card} />
      {kind === "peaks" && (
        <g>
          <circle cx={38 * u} cy={h * 0.3} r={5.5 * u} className={spot} />
          <path d={`M0 ${h}L${16 * u} ${h * 0.46}L${27 * u} ${h * 0.72}L${37 * u} ${h * 0.56}L${w} ${h * 0.86}V${h}Z`} className={ink} />
        </g>
      )}
      {kind === "portrait" && (
        <g className={ink}>
          <circle cx={w / 2} cy={h * 0.4} r={8 * u} />
          <path d={`M${w / 2 - 15 * u} ${h}a${15 * u} ${15 * u} 0 0 1 ${30 * u} 0Z`} />
        </g>
      )}
      {kind === "skyline" && (
        <g className={ink}>
          <rect x={7 * u} y={h * 0.5} width={9 * u} height={h * 0.5} />
          <rect x={19 * u} y={h * 0.28} width={11 * u} height={h * 0.72} />
          <rect x={33 * u} y={h * 0.6} width={8 * u} height={h * 0.4} />
          <rect x={43 * u} y={h * 0.42} width={6 * u} height={h * 0.58} />
        </g>
      )}
    </g>
  );
}

export function Isometric189({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric189Props) {
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
  const spot = accent ? mine.base : body.ink;
  const [top] = PRINTS.slice(-1);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric189-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 184 220" aria-hidden="true" className="isometric189-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} rx={5} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 122, 72, BASE, 14)} paint={body} />
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
          {/* Header: the album name and a menu dot */}
          <rect x={7} y={16.5} width={22} height={3.2} rx={1.6} className={body.base} />
          <circle cx={55} cy={18} r={2} className={body.base} />
          {/* The viewer: the photos swipe past inside its window */}
          <g clipPath={`url(#${clipId})`}>
            <g className="isometric189-strip">
              {PHOTOS.map((kind, index) => (
                <g key={`photo-${index}`} transform={`translate(${VIEW.x + index * PITCH} ${VIEW.y})`}>
                  <Picture kind={kind} w={VIEW.w} h={VIEW.h} card={body.base} ink={body.ink} spot={spot} />
                </g>
              ))}
            </g>
          </g>
          {/* The thumbnails, with a frame that follows the photo on show */}
          {PHOTOS.slice(0, 3).map((kind, index) => (
            <g key={`thumb-${index}`} transform={`translate(${THUMB.x + index * THUMB.pitch} ${THUMB.y})`}>
              <Picture kind={kind} w={THUMB.s} h={THUMB.s} card={body.base} ink={body.ink} spot={spot} />
            </g>
          ))}
          <rect x={THUMB.x - 1.2} y={THUMB.y - 1.2} width={THUMB.s + 2.4} height={THUMB.s + 2.4} rx={3} fill="none" strokeWidth={1.4} className={cn("isometric189-pick", inAccent)} />
          {/* The toolbar: share, favorite, delete */}
          <circle cx={16} cy={101.5} r={2.6} className={cn(body.base, "opacity-60")} />
          <circle cx={32} cy={101.5} r={3.2} className={accent ? mine.base : body.base} />
          <circle cx={48} cy={101.5} r={2.6} className={cn(body.base, "opacity-60")} />
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* A few prints stacked on the base */}
        {PRINTS.map((print) => (
          <Block key={`print-${print.z}`} faces={box(print.x, print.y, print.z, PRINT.w, PRINT.d, PRINT.h)} paint={body} />
        ))}
        {top && (
          <g transform={`${onTop(top.z + PRINT.h)} translate(${top.x + 2} ${top.y + 2})`}>
            <rect width={PRINT.w - 4} height={PRINT.d - 7} className={body.ink} />
            <circle cx={10} cy={5} r={2.2} className={spot} />
          </g>
        )}
      </svg>
    </div>
  );
}
