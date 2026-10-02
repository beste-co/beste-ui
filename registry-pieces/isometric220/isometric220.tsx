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

interface Isometric220Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the checkbox tick and the submit button with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric220Demo: Isometric220Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};


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

type Round = ReturnType<typeof roundBox>;

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
const SLAB = { x: 12, y: 10, w: 104, d: 96, h: 4 };
const Z = BASE + SLAB.h;
// Each field: where it starts down the form and how long its answer is
const FIELDS = [
  { y: 17, label: 16, value: 36 },
  { y: 36, label: 22, value: 52 },
  { y: 55, label: 13, value: 27 },
];
const BOX = { x: 20, y: 77, s: 8 };
// Marks are drawn turned by 45 degrees in plan, so they read upright on the tilted form
const TICK = "M-1.5 0L-0.45 1.7L1.65 -1.9";
// The submit button sits in a well on the form and sinks into it when pressed
const BUTTON = { x: 97, y: 87, r: 9, h: 4, press: 3 };
const WELL = { cx: (BUTTON.x - BUTTON.y) * C, cy: (BUTTON.x + BUTTON.y) * S - Z, a: BUTTON.r * 1.2247 + 0.8, b: BUTTON.r * 0.7071 + 0.6 };
// Everything above the front rim of the well: what is left of the button once it sinks
const WELL_CLIP = `M${(WELL.cx - WELL.a).toFixed(1)} ${WELL.cy.toFixed(1)}v-40h${(2 * WELL.a).toFixed(1)}v40a${WELL.a.toFixed(1)} ${WELL.b.toFixed(1)} 0 0 1 ${(-2 * WELL.a).toFixed(1)} 0Z`;
const PERIOD = 10;
const fill = (index: number) => {
  const from = 8 + index * 11;
  return `@keyframes isometric220-value${index} { 0%, ${from}% { opacity: 0; } ${from + 6}%, 86% { opacity: 1; } 93%, 100% { opacity: 0; } }
.isometric220-value${index} { animation: isometric220-value${index} ${PERIOD}s ease-in-out infinite; }`;
};

const STYLES = `
${FIELDS.map((_, index) => fill(index)).join("\n")}
@keyframes isometric220-tick { 0%, 43% { stroke-dashoffset: 1; } 51%, 86% { stroke-dashoffset: 0; } 93%, 100% { stroke-dashoffset: 1; } }
@keyframes isometric220-press { 0%, 58%, 70%, 100% { transform: translateY(0px); } 63%, 65% { transform: translateY(${BUTTON.press}px); } }
.isometric220-tick { animation: isometric220-tick ${PERIOD}s ease-in-out infinite; }
.isometric220-press { animation: isometric220-press ${PERIOD}s ease-in-out infinite; }
.isometric220-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric220-scene * { animation: none !important; } }
`;

export function Isometric220({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric220Props) {
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

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric220-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-112 -24 238 164" aria-hidden="true" className="isometric220-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <path d={WELL_CLIP} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 130, 116, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(SLAB.x, SLAB.y, BASE, SLAB.w, SLAB.d, SLAB.h, 8)} paint={body} />
        <g transform={onTop(Z)}>
          {/* A label, a field, and the answer that fades into it */}
          {FIELDS.map((field, index) => (
            <g key={`field-${field.y}`}>
              <rect x={20} y={field.y} width={field.label} height={2.6} rx={1.3} className={body.ink} />
              <rect x={20} y={field.y + 4.6} width={SLAB.w - 16} height={9} rx={3.4} className={body.ink} />
              <rect x={25} y={field.y + 7.8} width={field.value} height={2.6} rx={1.3} className={cn(`isometric220-value${index}`, body.base)} />
            </g>
          ))}
          {/* The checkbox ticks itself with a drawn stroke */}
          <rect x={BOX.x} y={BOX.y} width={BOX.s} height={BOX.s} rx={2.6} className={body.ink} />
          <path d={TICK} transform={`translate(${BOX.x + BOX.s / 2} ${BOX.y + BOX.s / 2}) rotate(-45)`} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={0} className={cn("isometric220-tick", inAccent)} />
          <rect x={32} y={BOX.y + 1.4} width={30} height={2.4} rx={1.2} className={body.ink} />
          <rect x={32} y={BOX.y + 5.2} width={20} height={2.2} rx={1.1} className={body.ink} />
          <circle cx={BUTTON.x} cy={BUTTON.y} r={BUTTON.r + 1} className={body.ink} />
          <circle cx={BUTTON.x} cy={BUTTON.y} r={BUTTON.r + 1} className={body.ink} />
        </g>
        {/* The submit button, clipped to the rim of its well so it sinks in */}
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric220-press">
            <RoundBlock shape={roundBox(BUTTON.x - BUTTON.r, BUTTON.y - BUTTON.r, Z, 2 * BUTTON.r, 2 * BUTTON.r, BUTTON.h, BUTTON.r)} paint={mine} />
            <g transform={`${onTop(Z + BUTTON.h)} translate(${BUTTON.x} ${BUTTON.y}) rotate(-45)`} fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={onAccent}>
              <path d="M-3 0L-0.9 3.4L3.3 -3.8" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
