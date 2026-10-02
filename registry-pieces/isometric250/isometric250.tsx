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

interface Isometric250Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the status dots and the add bar's mark with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric250Demo: Isometric250Props = {
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

/** The screen offset of a move in space, as a CSS translate. */
const shift = (dx: number, dy: number, dz = 0) => `translate(${((dx - dy) * C).toFixed(2)}px, ${((dx + dy) * S - dz).toFixed(2)}px)`;

/** A page slab standing in the plane y = y0 and facing left; children draw on its face from the top left corner. */
function Slab({ x, y0, z, w, h, t = 4, paint, children }: { x: number; y0: number; z: number; w: number; h: number; t?: number; paint: Paint; children?: ReactNode }) {
  return (
    <g>
      <Block faces={box(x, y0 - t, z, w, t, h)} paint={paint} />
      <g transform={`${onLeft(y0)} translate(${x} ${-(z + h)})`}>{children}</g>
    </g>
  );
}

/** The low holder a slab stands in: the part behind it, drawn first. */
function HolderBack({ x, y0, w, t = 4, paint }: { x: number; y0: number; w: number; t?: number; paint: Paint }) {
  return <Block faces={box(x - 3, y0 - t - 3, BASE, w + 6, t + 3, 4)} paint={paint} />;
}
/** The lip of the holder in front of the slab, drawn last. */
function HolderLip({ x, y0, w, paint }: { x: number; y0: number; w: number; paint: Paint }) {
  return <Block faces={box(x - 3, y0, BASE, w + 6, 3, 4)} paint={paint} />;
}

const BASE = 6;
const TOP = BASE + 3;
const CARD = { w: 34, d: 34, h: 3 };
const COLS = [19, 58, 97];
const ROWS = [18, 58];
// Every cell but the last, which the new card fills
const CELLS = ROWS.flatMap((y) => COLS.map((x) => ({ x, y }))).slice(0, -1);
const NEW = { x: 97, y: 58 };
const BAR = { x: 137, y: 54, w: 8, d: 42, h: 7 };
const SLIDE = 46;
const PERIOD = 9;
// What shows of a card on its way out from under the bar: everything on the near side of the bar's face
const WINDOW = polygon([
  [50, 48, TOP + CARD.h + 2],
  [BAR.x, 48, TOP + CARD.h + 2],
  [BAR.x, 48, TOP],
  [BAR.x, 104, TOP],
  [50, 104, TOP],
  [50, 104, TOP + CARD.h + 2],
]);

const STYLES = `
@keyframes isometric250-card { 0%, 10% { transform: ${shift(SLIDE, 0)}; } 30%, 84% { transform: translate(0px, 0px); } 96%, 100% { transform: ${shift(SLIDE, 0)}; } }
@keyframes isometric250-dot { 0%, 34% { opacity: 0; } 44%, 78% { opacity: 1; } 84%, 100% { opacity: 0; } }
.isometric250-card { animation: isometric250-card ${PERIOD}s ease-in-out infinite; }
.isometric250-dot { animation: isometric250-dot ${PERIOD}s ease-in-out infinite; }
.isometric250-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric250-scene * { animation: none !important; } }
`;

/** A project card: a thick tile with a page thumbnail, a name line and a status dot. */
function Card({ x, y, body, dot, children }: { x: number; y: number; body: Paint; dot: string; children?: ReactNode }) {
  return (
    <g>
      <RoundBlock shape={roundBox(x, y, TOP, CARD.w, CARD.d, CARD.h, 5)} paint={body} />
      <g transform={`${onTop(TOP + CARD.h)} translate(${x} ${y})`}>
        <rect x={4} y={4} width={26} height={17} rx={2.5} className={body.ink} />
        <rect x={7} y={7} width={11} height={2.2} rx={1.1} className={body.base} />
        <rect x={7} y={12} width={20} height={6} rx={1.5} className={body.base} />
        <rect x={4} y={25} width={15} height={2.6} rx={1.3} className={body.ink} />
        <circle cx={27.5} cy={26.3} r={2.4} className={dot} />
        {children}
      </g>
    </g>
  );
}

export function Isometric250({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric250Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill, and one drawn in the accent on a neutral fill
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;
  const clipId = useId();
  const live = accent ? mine.base : body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric250-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-111 -18 266 170" aria-hidden="true" className="isometric250-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={WINDOW} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 164, 112, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(12, 12, BASE, 140, 88, 3, 10)} paint={body} />
        {CELLS.map((cell, index) => (
          <Card key={`card-${cell.x}-${cell.y}`} x={cell.x} y={cell.y} body={body} dot={index === 1 || index === 3 ? body.ink : live} />
        ))}
        {/* The empty cell, and the new card that slides into it along the board */}
        <rect x={NEW.x + 1} y={NEW.y + 1} width={CARD.w - 2} height={CARD.d - 2} rx={5} transform={onTop(TOP)} fill="none" strokeWidth={1} strokeDasharray="3 2.4" vectorEffect="non-scaling-stroke" className={body.edge} />
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric250-card">
            <Card x={NEW.x} y={NEW.y} body={body} dot={body.ink}>
              <circle cx={27.5} cy={26.3} r={2.4} className={cn("isometric250-dot", live)} />
            </Card>
          </g>
        </g>
        {/* The add bar the card comes out from under */}
        <Block faces={box(BAR.x, BAR.y, TOP, BAR.w, BAR.d, BAR.h)} paint={body} />
        <g transform={`${onTop(TOP + BAR.h)} translate(${BAR.x + BAR.w / 2} ${BAR.y + BAR.d / 2})`} fill="none" strokeWidth={1.6} strokeLinecap="round" className={inAccent}>
          <path d="M-2.4 0H2.4M0 -2.4V2.4" />
        </g>
      </svg>
    </div>
  );
}
