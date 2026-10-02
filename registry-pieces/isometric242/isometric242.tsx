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

interface Isometric242Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the hub cap, the lit groove and the tile it leads to with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric242Demo: Isometric242Props = {
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

const G = 6;
const SIZE = 150;
const CENTER = SIZE / 2;
const HUB = { r: 17, h: 10 };
const TILE = { s: 24, h: 6, r: 6, reach: 50 };
const SPOKES = [18, 90, 162, 234, 306].map((deg) => {
  const angle = (deg * Math.PI) / 180;
  return { deg, x: CENTER + TILE.reach * Math.cos(angle), y: CENTER + TILE.reach * Math.sin(angle) };
});
const PERIOD = 12;
// Each spoke takes its turn: the groove lights first, then the tile at its end
const turn = (index: number) => {
  const start = 5 + index * 18;
  return `@keyframes isometric242-groove${index} { 0%, ${start}% { opacity: 0; } ${start + 4}%, ${start + 16}% { opacity: 1; } ${start + 21}%, 100% { opacity: 0; } }
@keyframes isometric242-tile${index} { 0%, ${start + 3}% { opacity: 0; } ${start + 8}%, ${start + 17}% { opacity: 1; } ${start + 22}%, 100% { opacity: 0; } }
.isometric242-groove${index} { animation: isometric242-groove${index} ${PERIOD}s ease-in-out infinite; }
.isometric242-tile${index} { animation: isometric242-tile${index} ${PERIOD}s ease-in-out infinite; }`;
};

const STYLES = `
${SPOKES.map((_, index) => turn(index)).join("\n")}
@keyframes isometric242-pulse { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
.isometric242-pulse { animation: isometric242-pulse ${PERIOD / 5}s ease-in-out infinite; }
.isometric242-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric242-scene * { animation: none !important; } }
`;

/** A simple mark for each app, drawn flat on its tile. */
function Glyph({ kind, className }: { kind: number; className: string }) {
  if (kind === 0) return <circle r={5} className={className} />;
  if (kind === 1) {
    return (
      <g className={className}>
        <rect x={-5} y={-4.6} width={10} height={3.4} rx={1.7} />
        <rect x={-5} y={1.2} width={6.5} height={3.4} rx={1.7} />
      </g>
    );
  }
  if (kind === 2) return <path d="M0 -5.5L5.5 4.5H-5.5Z" className={className} />;
  if (kind === 3) {
    return (
      <g className={className}>
        <rect x={-1.7} y={-5.5} width={3.4} height={11} rx={1.7} />
        <rect x={-5.5} y={-1.7} width={11} height={3.4} rx={1.7} />
      </g>
    );
  }
  return <path fillRule="evenodd" d="M-5.5 0a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0ZM-2.4 0a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0 -4.8 0Z" className={className} />;
}

export function Isometric242({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric242Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const tileShape = (x: number, y: number) => roundBox(x - TILE.s / 2, y - TILE.s / 2, G, TILE.s, TILE.s, TILE.h, TILE.r);
  const onTile = (x: number, y: number) => `${onTop(G + TILE.h)} translate(${x.toFixed(1)} ${y.toFixed(1)})`;
  // Far solids first, so nearer ones cover them
  const solids = [
    ...SPOKES.map((spoke, index) => ({
      depth: spoke.x + spoke.y,
      node: (
        <g key={`tile-${spoke.deg}`}>
          <RoundBlock shape={tileShape(spoke.x, spoke.y)} paint={body} />
          <g transform={onTile(spoke.x, spoke.y)}>
            <Glyph kind={index} className={body.ink} />
          </g>
          <g className={`isometric242-tile${index} opacity-0`}>
            <RoundBlock shape={tileShape(spoke.x, spoke.y)} paint={mine} />
            <g transform={onTile(spoke.x, spoke.y)}>
              <Glyph kind={index} className={mine.ink} />
            </g>
          </g>
        </g>
      ),
    })),
    {
      depth: 2 * CENTER,
      node: (
        <g key="hub">
          <RoundBlock shape={roundBox(CENTER - HUB.r, CENTER - HUB.r, G, 2 * HUB.r, 2 * HUB.r, HUB.h, HUB.r)} paint={body} />
          <RoundBlock shape={roundBox(CENTER - 9, CENTER - 9, G + HUB.h, 18, 18, 3, 9)} paint={mine} />
          <circle cx={CENTER} cy={CENTER} r={4.5} transform={onTop(G + HUB.h + 3)} className={cn("isometric242-pulse opacity-0", mine.ink)} />
        </g>
      ),
    },
  ].sort((a, b) => a.depth - b.depth);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric242-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-142 -16 284 182" aria-hidden="true" className="isometric242-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, SIZE, SIZE, G, 24)} paint={body} />
        {/* A groove from the hub to each tile; it takes the accent when its turn comes */}
        {SPOKES.map((spoke, index) => (
          <g key={`groove-${spoke.deg}`} transform={`${onTop(G)} translate(${CENTER} ${CENTER}) rotate(${spoke.deg})`}>
            <rect x={HUB.r - 2} y={-1.6} width={TILE.reach - HUB.r - TILE.s / 2 + 4} height={3.2} rx={1.6} className={body.ink} />
            <rect x={HUB.r - 2} y={-1.6} width={TILE.reach - HUB.r - TILE.s / 2 + 4} height={3.2} rx={1.6} className={cn(`isometric242-groove${index} opacity-0`, accent ? mine.base : body.ink)} />
          </g>
        ))}
        {solids.map((solid) => solid.node)}
      </svg>
    </div>
  );
}
