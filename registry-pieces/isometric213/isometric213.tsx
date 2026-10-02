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

interface Isometric213Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the page in view and its breadcrumb with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric213Demo: Isometric213Props = {
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
const BOARD = { x: 8, y: 8, w: 134, d: 104, h: 4 };
const Z = BASE + BOARD.h;
// Tiles and the connectors between them share one height
const RAIL = 3;
const TOP = Z + RAIL;
// How far the page in view stands up from its tile
const LIFT = 3;
const HOME = { x: 60, y: 16, w: 30, d: 24 };
const KIDS = [18, 60, 102].map((x) => ({ x, y: 76, w: 30, d: 24 }));
const JOIN = { x: 75, y: 60 };
const TILES = [HOME, ...KIDS];
const CRUMB = { x: 14, y: 20, w: 38, d: 12, h: 2 };
// The lengths of the page name printed after the home mark, one per child page
const NAMES = [12, 18, 9];

const PERIOD = 12;
// Each page is in view for a while, in order, then the board rests
const visit = (index: number) => {
  const from = 4 + index * 20;
  const to = from + 14;
  const off = `${Math.max(0, from - 4)}%`;
  const out = `${to + 4}%`;
  return `@keyframes isometric213-tile${index} { 0%, ${off} { opacity: 0; transform: translateY(0px); } ${from}%, ${to}% { opacity: 1; transform: translateY(${-LIFT}px); } ${out}, 100% { opacity: 0; transform: translateY(0px); } }
@keyframes isometric213-crumb${index} { 0%, ${off} { opacity: 0; } ${from}%, ${to}% { opacity: 1; } ${out}, 100% { opacity: 0; } }
.isometric213-tile${index} { animation: isometric213-tile${index} ${PERIOD}s ease-in-out infinite; }
.isometric213-crumb${index} { animation: isometric213-crumb${index} ${PERIOD}s ease-in-out infinite; }`;
};

const STYLES = `
${TILES.map((_, index) => visit(index)).join("\n")}
.isometric213-still * { animation: none !important; }
.isometric213-still .isometric213-tile0 { opacity: 1; transform: translateY(${-LIFT}px); }
.isometric213-still .isometric213-crumb0 { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .isometric213-scene * { animation: none !important; }
  .isometric213-scene .isometric213-tile0 { opacity: 1; transform: translateY(${-LIFT}px); }
  .isometric213-scene .isometric213-crumb0 { opacity: 1; }
}
`;

export function Isometric213({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric213Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  /** A page printed on top of a tile. */
  const sheet = (tile: { x: number; y: number; w: number; d: number }, ink: string) => (
    <g transform={`${onTop(TOP)} translate(${tile.x} ${tile.y})`} className={ink}>
      <rect x={4} y={4} width={12} height={3} rx={1.5} />
      <rect x={4} y={10} width={tile.w - 8} height={2.2} rx={1.1} />
      <rect x={4} y={14.6} width={tile.w - 14} height={2.2} rx={1.1} />
    </g>
  );

  /** The page in view: a second block that stands up from its tile, in the accent. */
  const rise = (tile: { x: number; y: number; w: number; d: number }, index: number) => (
    <g className={cn(`isometric213-tile${index}`, "opacity-0")}>
      <RoundBlock shape={roundBox(tile.x, tile.y, Z, tile.w, tile.d, RAIL, 4)} paint={mine} />
      {sheet(tile, accent ? mine.ink : body.ink)}
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric213-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-112 -24 252 172" aria-hidden="true" className="isometric213-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 150, 120, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(BOARD.x, BOARD.y, BASE, BOARD.w, BOARD.d, BOARD.h, 10)} paint={body} />
        {/* The breadcrumb: the home mark, then the name of the page in view */}
        <RoundBlock shape={roundBox(CRUMB.x, CRUMB.y, Z, CRUMB.w, CRUMB.d, CRUMB.h, 6)} paint={body} />
        <g transform={`${onTop(Z + CRUMB.h)} translate(${CRUMB.x} ${CRUMB.y})`}>
          <circle cx={7} cy={6} r={2.4} className={body.ink} />
          <circle cx={7} cy={6} r={2.4} className={cn("isometric213-crumb0 opacity-0", accent ? mine.base : body.ink)} />
          {NAMES.map((length, index) => (
            <g key={`crumb-${length}`} className={cn(`isometric213-crumb${index + 1}`, "opacity-0")}>
              <path d="M12 3.6l2.4 2.4l-2.4 2.4" fill="none" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" className={body.edge} />
              <rect x={17} y={4.4} width={length} height={3.2} rx={1.6} className={accent ? mine.base : body.ink} />
            </g>
          ))}
        </g>
        {/* Back to front: the home tile, the connectors, then the child tiles */}
        <RoundBlock shape={roundBox(HOME.x, HOME.y, Z, HOME.w, HOME.d, RAIL, 4)} paint={body} />
        {sheet(HOME, body.ink)}
        {rise(HOME, 0)}
        <Block faces={box(JOIN.x - 2, HOME.y + HOME.d, Z, 4, JOIN.y - HOME.y - HOME.d + 2, RAIL)} paint={body} />
        <Block faces={box((KIDS[0]?.x ?? 0) + 13, JOIN.y - 2, Z, (KIDS[2]?.x ?? 0) - (KIDS[0]?.x ?? 0) + 4, 4, RAIL)} paint={body} />
        {KIDS.map((kid, index) => (
          <g key={`kid-${kid.x}`}>
            <Block faces={box(kid.x + kid.w / 2 - 2, JOIN.y + 2, Z, 4, kid.y - JOIN.y - 2, RAIL)} paint={body} />
            <RoundBlock shape={roundBox(kid.x, kid.y, Z, kid.w, kid.d, RAIL, 4)} paint={body} />
            {sheet(kid, body.ink)}
            {rise(kid, index + 1)}
          </g>
        ))}
      </svg>
    </div>
  );
}
