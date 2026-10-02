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

interface Isometric214Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the brief lines being read and the hero of the page with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric214Demo: Isometric214Props = {
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
// The brief on the left, the page it turns into on the right
const BRIEF = { x: 10, y: 17, w: 54, d: 70, h: 5 };
const SLAB = { x: 72, y: 10, w: 70, d: 84, h: 4 };
const Z = BASE + SLAB.h;
// One line of the brief per part of the page, top to bottom
const LINES = [30, 34, 26, 22];
const GROUPS = ["nav", "hero", "cards", "foot"] as const;

const PERIOD = 10;
const reveal = (name: string, index: number) => {
  const from = 14 + index * 9;
  return `@keyframes isometric214-${name} { 0%, ${from}% { opacity: 0; } ${from + 7}%, 80% { opacity: 1; } 88%, 100% { opacity: 0; } }
.isometric214-${name} { animation: isometric214-${name} ${PERIOD}s ease-in-out infinite; }`;
};

const STYLES = `
${GROUPS.map(reveal).join("\n")}
.isometric214-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric214-scene * { animation: none !important; } }
`;

export function Isometric214({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric214Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric214-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-98 -22 236 164" aria-hidden="true" className="isometric214-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 152, 104, BASE, 14)} paint={body} />
        {/* The brief: a thick sheet whose lines are picked up one by one */}
        <RoundBlock shape={roundBox(BRIEF.x, BRIEF.y, BASE, BRIEF.w, BRIEF.d, BRIEF.h, 5)} paint={body} />
        <g transform={`${onTop(BASE + BRIEF.h)} translate(${BRIEF.x} ${BRIEF.y})`}>
          <rect x={6} y={7} width={24} height={5} rx={2.5} className={body.ink} />
          {LINES.map((width, index) => (
            <g key={`line-${GROUPS[index]}`} transform={`translate(0 ${22 + index * 11})`}>
              <circle cx={9} cy={2} r={2.6} className={body.ink} />
              <rect x={15} y={0.4} width={width} height={3.2} rx={1.6} className={body.ink} />
              <g className={`isometric214-${GROUPS[index]}`}>
                <circle cx={9} cy={2} r={2.6} className={accent ? mine.base : body.ink} />
                <rect x={15} y={0.4} width={width} height={3.2} rx={1.6} className={accent ? mine.base : body.ink} />
              </g>
            </g>
          ))}
        </g>
        {/* The page, empty until the first line is read */}
        <RoundBlock shape={roundBox(SLAB.x, SLAB.y, BASE, SLAB.w, SLAB.d, SLAB.h, 7)} paint={body} />
        <g transform={`${onTop(Z)} translate(${SLAB.x} ${SLAB.y})`}>
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={7 + dot * 4.5} cy={6.5} r={1.4} className={body.ink} />
          ))}
          <rect x={24} y={4} width={32} height={5} rx={2.5} className={body.ink} />
          <rect x={4} y={12} width={SLAB.w - 8} height={SLAB.d - 16} rx={3} className={body.ink} />
          <g className="isometric214-nav">
            <rect x={7} y={15} width={SLAB.w - 14} height={7} rx={2.5} className={body.base} />
            <rect x={10} y={17.3} width={10} height={2.4} rx={1.2} className={body.ink} />
            {[0, 1, 2].map((link) => (
              <rect key={`link-${link}`} x={34 + link * 9} y={17.5} width={6} height={2} rx={1} className={body.ink} />
            ))}
          </g>
          <g className="isometric214-hero">
            <rect x={7} y={25} width={SLAB.w - 14} height={24} rx={3.5} className={accent ? mine.base : body.base} />
            <rect x={12} y={30} width={30} height={3.6} rx={1.8} className={accent ? mine.ink : body.ink} />
            <rect x={12} y={36} width={22} height={2.4} rx={1.2} className={accent ? mine.ink : body.ink} />
            <rect x={12} y={41} width={13} height={4} rx={2} className={accent ? mine.ink : body.ink} />
          </g>
          <g className="isometric214-cards">
            {[7, 36.5].map((x) => (
              <g key={`card-${x}`}>
                <rect x={x} y={52} width={26.5} height={15} rx={3.5} className={body.base} />
                <circle cx={x + 5.5} cy={57.5} r={2.4} className={body.ink} />
                <rect x={x + 10} y={56.3} width={12} height={2.4} rx={1.2} className={body.ink} />
                <rect x={x + 4} y={62} width={16} height={2} rx={1} className={body.ink} />
              </g>
            ))}
          </g>
          <g className="isometric214-foot">
            <rect x={7} y={70} width={SLAB.w - 14} height={7} rx={2.5} className={body.base} />
            <rect x={10} y={72.4} width={18} height={2.2} rx={1.1} className={body.ink} />
          </g>
        </g>
      </svg>
    </div>
  );
}
