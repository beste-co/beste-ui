"use client";

import type { CSSProperties } from "react";
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

interface Isometric140Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the opening flower with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric140Demo: Isometric140Props = {
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

const cylinder = (cx: number, cy: number, z: number, h: number, r: number) => roundBox(cx - r, cy - r, z, 2 * r, 2 * r, h, r);

/** A ring band around (cx, cy), drawn on the visible half. */
function band(cx: number, cy: number, r: number, z: number, h: number) {
  const points = Array.from({ length: 17 }, (_, k) => {
    const angle = ((-45 + (180 * k) / 16) * Math.PI) / 180;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  });
  return polygon([...points.map(([x, y]): Point => [x, y, z]), ...[...points].reverse().map(([x, y]): Point => [x, y, z + h])]);
}

/** A closed tulip head in screen space; the two halves take the left and right shades. */
function Bud({ x, y, r, paint }: { x: number; y: number; r: number; paint: Paint }) {
  const half = `M0 ${-1.05 * r}L${-0.38 * r} ${-0.5 * r}L${-r} ${-0.95 * r}C${-r} ${0.2 * r} ${-0.72 * r} ${0.95 * r} 0 ${r}Z`;
  return (
    <g transform={`translate(${x} ${y})`} className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={half} className={paint.base} />
      <path d={half} className={paint.left} stroke="none" />
      <g transform="scale(-1 1)">
        <path d={half} className={paint.base} />
        <path d={half} className={paint.right} stroke="none" />
      </g>
    </g>
  );
}

const M = 30;
const PLINTH = 6;
const VASE = { r: 15, h: 28 };
const MOUTH = PLINTH + VASE.h;
const pt = (x: number, y: number, z: number) => project([x, y, z]).split(",").map(Number) as [number, number];
const [MX, MY] = pt(M, M, MOUTH);
// Back to front so the nearer buds overlap the ones behind
const BUDS = [
  { x: 2, y: -52, r: 10, lean: 2 },
  { x: -15, y: -42, r: 10, lean: -6 },
  { x: 17, y: -40, r: 10, lean: 6 },
  { x: -24, y: -24, r: 8, lean: -10 },
  { x: 25, y: -22, r: 8, lean: 10 },
];
const FLOWER = { x: M + 1, y: M + 1, z: MOUTH + 24 };
const [FX, FY] = pt(FLOWER.x, FLOWER.y, FLOWER.z);
// The bloom is a cup of petals around the stem tip, drawn in screen space: each petal hinges at its base
const APEX = { x: 0, y: -19 };
function ring(count: number, turn: number, reach: number, rise: number, width: number, inner: boolean) {
  return Array.from({ length: count }, (_, k) => {
    const angle = ((k * 360) / count + turn) * (Math.PI / 180);
    const base = { x: 3 * Math.cos(angle), y: 1.7 * Math.sin(angle) - (inner ? 2 : 0) };
    const tip = { x: reach * Math.cos(angle), y: reach * 0.56 * Math.sin(angle) - rise };
    const length = Math.hypot(tip.x - base.x, tip.y - base.y);
    const aim = (Math.atan2(tip.y - base.y, tip.x - base.x) * 180) / Math.PI;
    const shut = (Math.atan2(APEX.y - base.y, APEX.x - base.x) * 180) / Math.PI;
    const fold = ((shut - aim + 540) % 360) - 180;
    const d = `M0 0C${(length * 0.25).toFixed(1)} ${-width} ${(length * 0.85).toFixed(1)} ${-width} ${length.toFixed(1)} 0C${(length * 0.85).toFixed(1)} ${width} ${(length * 0.25).toFixed(1)} ${width} 0 0Z`;
    return { key: `${inner ? "i" : "o"}${k}`, base, aim, fold, d, depth: Math.sin(angle), side: Math.cos(angle), inner };
  });
}
const PETALS = [...ring(8, 22.5, 17, 5, 5.5, false), ...ring(6, 0, 6, 13, 4.2, true)];
const order = (petal: (typeof PETALS)[number]) => (petal.depth < 0 ? (petal.inner ? 1 : 0) : petal.inner ? 2 : 3) + petal.depth / 10;
const BACK = PETALS.filter((petal) => petal.depth < 0).sort((p, q) => order(p) - order(q));
const FRONT = PETALS.filter((petal) => petal.depth >= 0).sort((p, q) => order(p) - order(q));
const LEAVES = [
  "M-4 -6C-14 -10 -24 -8 -30 -2C-20 2 -11 0 -4 -6Z",
  "M4 -8C14 -14 24 -13 30 -8C21 -2 12 -3 4 -8Z",
];

const STYLES = `
@keyframes isometric140-open { 0%, 8% { transform: rotate(var(--isometric140-fold)) scale(0.9, 0.55); } 38%, 76% { transform: rotate(0deg) scale(1); } 96%, 100% { transform: rotate(var(--isometric140-fold)) scale(0.9, 0.55); } }
@keyframes isometric140-sway { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(1px); } }
.isometric140-open { animation: isometric140-open 6s cubic-bezier(0.45, 0, 0.3, 1) infinite; }
.isometric140-sway { animation: isometric140-sway 6s ease-in-out infinite; }
.isometric140-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric140-open, .isometric140-sway { animation: none; } }
`;

export function Isometric140({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric140Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const bloom = paint.accent;
  const stem = palette === "dark" ? "stroke-zinc-500" : palette === "tone" ? "stroke-white/60" : "stroke-foreground/20";
  const leaf = palette === "dark" ? "fill-zinc-700" : palette === "tone" ? "fill-white/60" : "fill-foreground/15";
  const opening = palette === "dark" ? "fill-black/50" : "fill-black/25";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric140-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-50 -70 100 130" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 60, 60, PLINTH, 14)} paint={body} />
        <RoundBlock shape={cylinder(M, M, PLINTH, VASE.h, VASE.r)} paint={body} />
        <polygon points={band(M, M, VASE.r + 0.1, PLINTH + 8, 2)} className={body.ink} />
        <circle cx={M} cy={M} r={VASE.r - 2.5} transform={onTop(MOUTH)} className={opening} />
        <g transform={`translate(${MX} ${MY})`}>
          <g className="isometric140-sway">
            {BUDS.map((bud) => (
              <path key={bud.x} d={`M${bud.x * 0.15} 0Q${bud.lean} ${bud.y * 0.55} ${bud.x} ${bud.y}`} fill="none" strokeWidth={2} strokeLinecap="round" className={stem} />
            ))}
            <path d={`M0 0Q${FX - MX - 2} ${(FY - MY) * 0.5} ${FX - MX} ${FY - MY}`} fill="none" strokeWidth={2} strokeLinecap="round" className={stem} />
            {LEAVES.map((d) => (
              <path key={d} d={d} className={leaf} />
            ))}
            {BUDS.map((bud) => (
              <Bud key={bud.x} x={bud.x} y={bud.y} r={bud.r} paint={body} />
            ))}
          </g>
        </g>
        <g className="isometric140-sway">
          <g transform={`translate(${FX} ${FY}) scale(1.35)`} strokeWidth={0.75} strokeLinejoin="round" className="stroke-black/20">
            {[BACK, FRONT].map((petals, half) => (
              <g key={half}>
                {half === 1 && (
                  <g stroke="none">
                    <ellipse cx={0} cy={-5} rx={4.5} ry={3} className={bloom.base} />
                    <ellipse cx={0} cy={-5} rx={4.5} ry={3} className={bloom.ink} />
                  </g>
                )}
                {petals.map((petal) => (
                  <g key={petal.key} transform={`translate(${petal.base.x.toFixed(1)} ${petal.base.y.toFixed(1)}) rotate(${petal.aim.toFixed(1)})`}>
                    <g className="isometric140-open" style={{ "--isometric140-fold": `${petal.fold.toFixed(1)}deg` } as CSSProperties}>
                      <path d={petal.d} className={bloom.base} />
                      {(petal.inner || Math.abs(petal.side) > 0.3) && <path d={petal.d} stroke="none" className={petal.side > 0.3 ? bloom.right : bloom.left} />}
                    </g>
                  </g>
                ))}
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
