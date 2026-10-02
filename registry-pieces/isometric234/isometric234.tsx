"use client";

import { type ReactNode, useId } from "react";
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

interface Isometric234Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the page button and the first search result with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric234Demo: Isometric234Props = {
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
// Slabs stand on their bottom front edge and lean back by this much
const LEAN = (14 * Math.PI) / 180;
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
/** The matrix that lays local (across, down) units onto the leaning plane `depth` behind the front of a slab standing at `foot`, starting `rise` up it. */
function plane(foot: Point, depth: number, rise: number, left = 0) {
  const origin: Point = [foot[0] + left, foot[1] + UP[1] * rise + BACK[1] * depth, foot[2] + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}

/** The rest a slab leans against: a little wider, built from thin layers back to front. */
function Rest({ id, foot, w, tall, behind, side = 4, paint }: { id: string; foot: Point; w: number; tall: number; behind: number; side?: number; paint: Paint }) {
  return (
    <>
      {[3, 2, 1].map((layer) => (
        <g key={`${id}-${layer}`} transform={plane(foot, behind + layer, tall, -side)} className={paint.edge} strokeWidth={layer === 1 ? 1 : 0}>
          <rect width={w + 2 * side} height={tall} rx={6} className={paint.base} />
          <rect width={w + 2 * side} height={tall} rx={6} className={layer === 1 ? paint.left : paint.right} stroke="none" />
        </g>
      ))}
    </>
  );
}

/** A leaning slab built from thin layers back to front; its children are drawn on the front face. */
function Slab({ id, foot, w, tall, thick, rx = 6, paint, children }: { id: string; foot: Point; w: number; tall: number; thick: number; rx?: number; paint: Paint; children?: ReactNode }) {
  return (
    <>
      {Array.from({ length: thick }, (_, index) => thick - index).map((depth) => (
        <g key={`${id}-${depth}`} transform={plane(foot, depth, tall)}>
          <rect width={w} height={tall} rx={rx} className={paint.base} />
          <rect width={w} height={tall} rx={rx} className={paint.right} />
        </g>
      ))}
      <g transform={plane(foot, 0, tall)}>
        <rect width={w} height={tall} rx={rx} strokeWidth={1} className={cn(paint.base, paint.edge)} />
        {children}
      </g>
    </>
  );
}

const W = 96;
const TALL = 80;
const THICK = 5;
const FOOT: Point = [16, 44, BASE + 3];
// The search palette: a thinner slab in front of the page that rises out of the stand
const PALETTE = { w: 74, h: 42, left: 11, rise: 62, thick: 3, gap: 2 };
const HIDE = PALETTE.rise + 4;
// Local y of the stand's top edge: the palette is cut off below it, as if it sat in a slot
const SLOT = PALETTE.rise - 4;
const QUERY = { x: 15, y: 7.6, w: 24 };
const DEPTHS = Array.from({ length: PALETTE.thick + 1 }, (_, index) => -(PALETTE.gap + index));

const PERIOD = 10;
const STYLES = `
@keyframes isometric234-rise { 0%, 6% { transform: translateY(${HIDE}px); } 18%, 86% { transform: translateY(0px); } 96%, 100% { transform: translateY(${HIDE}px); } }
@keyframes isometric234-type { 0%, 20% { transform: translateX(${-QUERY.w - 1}px); } 32%, 96% { transform: translateX(0px); } 97%, 100% { transform: translateX(${-QUERY.w - 1}px); } }
@keyframes isometric234-found { 0%, 34% { opacity: 0; } 41%, 84% { opacity: 1; } 88%, 100% { opacity: 0; } }
.isometric234-rise { animation: isometric234-rise ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
.isometric234-type { animation: isometric234-type ${PERIOD}s linear infinite; }
.isometric234-found { animation: isometric234-found ${PERIOD}s ease-in-out infinite; }
.isometric234-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric234-scene * { animation: none !important; } }
`;
export function Isometric234({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric234Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const slotId = useId();
  const fieldId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric234-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-90 -76 226 208" aria-hidden="true" className="isometric234-scene size-full overflow-visible">
        <defs>
          <clipPath id={slotId}>
            <rect x={-4} y={-80} width={PALETTE.w + 8} height={80 + SLOT} />
          </clipPath>
          <clipPath id={fieldId}>
            <rect x={QUERY.x} y={QUERY.y - 2} width={QUERY.w} height={7} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 140, 92, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT[0] - 6, 14, BASE, W + 12, 48, 3, 8)} paint={body} />
        <Rest id="rest" foot={FOOT} w={W} tall={44} behind={THICK} paint={body} />
        <Slab id="page" foot={FOOT} w={W} tall={TALL} thick={THICK} paint={body}>
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={7 + dot * 4.5} cy={6.5} r={1.4} className={body.ink} />
          ))}
          <rect x={24} y={3.8} width={W - 48} height={5.4} rx={2.7} className={body.ink} />
          <rect x={3} y={12} width={W - 6} height={57} rx={4} className={body.ink} />
          <rect x={9} y={19.8} width={38} height={4.6} rx={2.3} className={body.base} />
          <rect x={9} y={27.5} width={26} height={2.8} rx={1.4} className={body.base} />
          <rect x={9} y={33.2} width={22} height={7.6} rx={3.8} className={mine.base} />
          <rect x={55} y={18} width={32} height={24} rx={5} className={body.base} />
          {[9, 49].map((x) => (
            <rect key={`card-${x}`} x={x} y={46.5} width={38} height={18.5} rx={5} className={body.base} />
          ))}
        </Slab>
        {/* The palette, back layers to front, cut off at the stand so it rises out of it */}
        {DEPTHS.map((depth, index) => {
          const front = index === DEPTHS.length - 1;
          return (
            <g key={`palette-${depth}`} transform={plane(FOOT, depth, PALETTE.rise, PALETTE.left)} clipPath={`url(#${slotId})`}>
              <g className="isometric234-rise">
                <rect width={PALETTE.w} height={PALETTE.h} rx={6} strokeWidth={front ? 1 : 0} className={cn(body.base, body.edge)} />
                {!front && <rect width={PALETTE.w} height={PALETTE.h} rx={6} className={body.right} />}
                {front && (
                  <>
                    {/* The field: a lens and the query that writes itself in */}
                    <rect x={4} y={4} width={PALETTE.w - 8} height={10} rx={5} className={body.ink} />
                    <circle cx={9.6} cy={9} r={2.2} className={body.base} />
                    <g clipPath={`url(#${fieldId})`}>
                      <rect x={QUERY.x} y={QUERY.y} width={QUERY.w} height={2.8} rx={1.4} className={cn("isometric234-type", body.base)} />
                    </g>
                    {/* Three results, the first one picked out */}
                    <g className="isometric234-found">
                      <rect x={4} y={17} width={PALETTE.w - 8} height={7} rx={3.5} className={accent ? mine.base : body.ink} />
                      <rect x={9} y={19.4} width={26} height={2.2} rx={1.1} className={accent ? mine.ink : body.base} />
                      {[25.5, 33].map((y, index) => (
                        <g key={`result-${y}`}>
                          <rect x={4} y={y} width={PALETTE.w - 8} height={6} rx={3} className={body.left} />
                          <rect x={9} y={y + 1.9} width={[32, 22][index]} height={2.2} rx={1.1} className={body.ink} />
                        </g>
                      ))}
                    </g>
                  </>
                )}
              </g>
            </g>
          );
        })}
        {/* The lip of the stand holds the page and hides the slot the palette comes out of */}
        <RoundBlock shape={roundBox(FOOT[0] - 4, FOOT[1] - 1, BASE + 3, W + 8, 8, 5, 2.5)} paint={body} />
      </svg>
    </div>
  );
}
