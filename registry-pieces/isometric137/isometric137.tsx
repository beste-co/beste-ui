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

interface Isometric137Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the velvet with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric137Demo: Isometric137Props = {
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

type Plan = [number, number][];

/** A flat solid standing on a plan outline, showing only the sides that face the viewer. */
function prism(outline: Plan, z: number, h: number) {
  const area = outline.reduce((sum, [ax, ay], index) => {
    const [bx, by] = outline[(index + 1) % outline.length] as [number, number];
    return sum + ax * by - bx * ay;
  }, 0);
  const points = area < 0 ? [...outline].reverse() : outline;
  const sides = points.flatMap(([ax, ay], index) => {
    const [bx, by] = points[(index + 1) % points.length] as [number, number];
    const [nx, ny] = [by - ay, ax - bx];
    if (nx + ny <= 0) return [];
    return [{ points: polygon([[ax, ay, z + h], [bx, by, z + h], [bx, by, z], [ax, ay, z]]), left: ny > nx }];
  });
  return { top: polygon(points.map(([px, py]): Point => [px, py, z + h])), sides };
}

function Prism({ shape, paint }: { shape: ReturnType<typeof prism>; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      {shape.sides.map((side) => (
        <g key={side.points}>
          <polygon points={side.points} className={paint.base} />
          <polygon points={side.points} className={side.left ? paint.left : paint.right} stroke="none" />
        </g>
      ))}
      <polygon points={shape.top} className={paint.base} />
    </g>
  );
}

const PLINTH = 6;
const BOX = { x: 12, y: 20, w: 48, d: 40, h: 18 };
const TOP = PLINTH + BOX.h;
const LID = { y: BOX.y - 6, h: 34 };
const SLOT = BOX.y + 22;
const RING = { x: BOX.x + BOX.w / 2, z: TOP + 5, r: 12, band: 3 };
const ANNULUS = `M${-RING.r} 0A${RING.r} ${RING.r} 0 1 0 ${RING.r} 0A${RING.r} ${RING.r} 0 1 0 ${-RING.r} 0ZM${-RING.r + RING.band} 0A${RING.r - RING.band} ${RING.r - RING.band} 0 1 1 ${RING.r - RING.band} 0A${RING.r - RING.band} ${RING.r - RING.band} 0 1 1 ${-RING.r + RING.band} 0Z`;
const SLICES = [SLOT - 1.5, SLOT - 0.5, SLOT + 0.5, SLOT + 1.5];
const GEM_Z = RING.z + RING.r - 1;
const octagon = (cx: number, cy: number, r: number): Plan => {
  const k = r * 0.42;
  return [[cx - k, cy - r], [cx + k, cy - r], [cx + r, cy - k], [cx + r, cy + k], [cx + k, cy + r], [cx - k, cy + r], [cx - r, cy + k], [cx - r, cy - k]];
};
const [GX, GY] = project([RING.x, SLOT, GEM_Z + 8]).split(",").map(Number) as [number, number];
const STAR = "M0 -7C0.8 -1.6 1.6 -0.8 7 0C1.6 0.8 0.8 1.6 0 7C-0.8 1.6 -1.6 0.8 -7 0C-1.6 -0.8 -0.8 -1.6 0 -7Z";
const lineAt = (y: number, z: number) => [project([BOX.x - 8, y, z]), project([BOX.x + BOX.w + 8, y, z])].map((point) => point.replace(",", " "));

const STYLES = `
@keyframes isometric137-lift { 0%, 10% { transform: translateY(5px); } 30%, 78% { transform: translateY(0); } 94%, 100% { transform: translateY(5px); } }
@keyframes isometric137-spark { 0%, 34% { transform: scale(0); opacity: 0; } 42% { transform: scale(1.15); opacity: 1; } 52% { transform: scale(0.9); opacity: 1; } 64%, 100% { transform: scale(0); opacity: 0; } }
.isometric137-lift { animation: isometric137-lift 5s cubic-bezier(0.45, 0, 0.3, 1) infinite; }
.isometric137-spark { animation: isometric137-spark 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric137-spark + .isometric137-spark { animation-delay: 0.2s; }
.isometric137-still * { animation: none !important; }
.isometric137-still .isometric137-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric137-lift, .isometric137-spark { animation: none; } .isometric137-rest { opacity: 1; } }
`;

export function Isometric137({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric137Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const velvet = paint.accent;
  const [from, to] = lineAt(SLOT, TOP);
  const slit = palette === "dark" ? "fill-black/40" : "fill-black/25";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric137-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-59 -48 118 119" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <path d={`M${from}L${to}V-200H-200Z`} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 72, 72, PLINTH, 14)} paint={body} />
        <RoundBlock shape={roundBox(BOX.x, LID.y, TOP, BOX.w, 6, LID.h, 3)} paint={body} />
        <rect x={BOX.x + 4} y={-TOP - LID.h + 4} width={BOX.w - 8} height={LID.h - 6} rx={3} transform={onLeft(LID.y + 6)} className={velvet.base} />
        <rect x={BOX.x + 4} y={-TOP - LID.h + 4} width={BOX.w - 8} height={LID.h - 6} rx={3} transform={onLeft(LID.y + 6)} className={velvet.left} />
        <RoundBlock shape={roundBox(BOX.x, BOX.y, PLINTH, BOX.w, BOX.d, BOX.h, 6)} paint={body} />
        <rect x={BOX.x + 4} y={BOX.y + 4} width={BOX.w - 8} height={BOX.d - 8} rx={4} transform={onTop(TOP)} className={velvet.base} />
        <rect x={BOX.x + 10} y={SLOT - 1} width={BOX.w - 20} height={2} rx={1} transform={onTop(TOP)} className={slit} />
        <g transform={onLeft(BOX.y + BOX.d)} className={body.ink}>
          <rect x={BOX.x + BOX.w / 2 - 4} y={-TOP + 2} width={8} height={3} rx={1} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric137-lift">
            {SLICES.map((y, index) => (
              <g key={y} transform={`${onLeft(y)} translate(${RING.x} ${-RING.z})`}>
                <path d={ANNULUS} fillRule="evenodd" strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(body.base, index === SLICES.length - 1 && body.edge)} />
                {index < SLICES.length - 1 && <path d={ANNULUS} fillRule="evenodd" className={body.right} />}
              </g>
            ))}
            <Prism shape={prism(octagon(RING.x, SLOT, 5), GEM_Z, 4)} paint={body} />
            <Prism shape={prism(octagon(RING.x, SLOT, 3), GEM_Z + 4, 2)} paint={body} />
          </g>
        </g>
        <g transform={`translate(${GX + 6} ${GY - 4})`}>
          <g className="isometric137-spark isometric137-rest opacity-0">
            <path d={STAR} strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={cn(body.base, body.edge)} />
          </g>
          <g className="isometric137-spark isometric137-rest opacity-0">
            <path d={STAR} transform="translate(-16 8) scale(0.55)" strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={cn(body.base, body.edge)} />
          </g>
        </g>
      </svg>
    </div>
  );
}
