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

interface Isometric211Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the hero section, the easing curve and the knob mark with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric211Demo: Isometric211Props = {
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
// The page lies flat on the desk; its sections stand on it as low blocks
const SLAB = { x: 10, y: 12, w: 84, d: 84, h: 4 };
const Z = BASE + SLAB.h;
interface Section {
  id: string;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
}
const SECTIONS: Section[] = [
  { id: "nav", x: 16, y: 27, w: 72, d: 7, h: 4 },
  { id: "hero", x: 16, y: 38, w: 72, d: 23, h: 8 },
  { id: "left", x: 16, y: 65, w: 34, d: 14, h: 6 },
  { id: "right", x: 54, y: 65, w: 34, d: 14, h: 6 },
  { id: "foot", x: 16, y: 83, w: 72, d: 7, h: 3 },
];
// The easing plate and the knob that sets it
const PLATE = { x: 108, y: 12, w: 46, d: 46, h: 4 };
const KNOB = { x: 131, y: 82, r: 11, h: 8, ring: 16 };
const CURVE = `M${PLATE.x + 8} ${PLATE.y + PLATE.d - 8}C${PLATE.x + 24} ${PLATE.y + PLATE.d - 8} ${PLATE.x + 22} ${PLATE.y + 8} ${PLATE.x + PLATE.w - 8} ${PLATE.y + 8}`;

/** The outline of a section at full height, a hair wider: whatever sinks below the page falls outside it. */
function outline({ x, y, w, d, h }: Section) {
  const m = 0.6;
  const lo = Z - m;
  const hi = Z + h + m;
  return polygon([
    [x - m, y - m, hi],
    [x + w + m, y - m, hi],
    [x + w + m, y - m, lo],
    [x + w + m, y + d + m, lo],
    [x - m, y + d + m, lo],
    [x - m, y + d + m, hi],
  ]);
}

const PERIOD = 10;
// Each section rises in turn on a soft ease, the page holds, then they sink back in the same order
const rise = ({ id, h }: Section, index: number) => {
  const up = 6 + index * 8;
  const down = 70 + index * 3;
  return `@keyframes isometric211-${id} { 0%, ${up}% { transform: translateY(${h}px); } ${up + 10}%, ${down}% { transform: translateY(0px); } ${down + 8}%, 100% { transform: translateY(${h}px); } }
.isometric211-${id} { animation: isometric211-${id} ${PERIOD}s cubic-bezier(0.34, 0, 0.16, 1) infinite; }`;
};

const STYLES = `
${SECTIONS.map(rise).join("\n")}
@keyframes isometric211-turn { 0%, 6% { transform: rotate(-120deg); } 48%, 70% { transform: rotate(120deg); } 90%, 100% { transform: rotate(-120deg); } }
@keyframes isometric211-curve { 0%, 6% { stroke-dashoffset: 1; } 48%, 70% { stroke-dashoffset: 0; } 90%, 100% { stroke-dashoffset: 1; } }
.isometric211-turn { animation: isometric211-turn ${PERIOD}s cubic-bezier(0.34, 0, 0.16, 1) infinite; }
.isometric211-curve { animation: isometric211-curve ${PERIOD}s cubic-bezier(0.34, 0, 0.16, 1) infinite; }
.isometric211-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric211-scene * { animation: none !important; } }
`;

export function Isometric211({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric211Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn in the accent on a neutral fill
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;

  /** What is printed on top of a section. */
  const detail = ({ id, x, y, w, d }: Section) => {
    if (id === "nav") {
      return (
        <>
          <rect x={x + 4} y={y + 2.2} width={10} height={2.6} rx={1.3} className={body.ink} />
          {[0, 1, 2].map((link) => (
            <rect key={`link-${link}`} x={x + 38 + link * 11} y={y + 2.4} width={8} height={2.2} rx={1.1} className={body.ink} />
          ))}
        </>
      );
    }
    if (id === "hero") {
      return (
        <>
          <rect x={x + 6} y={y + 5} width={34} height={3.6} rx={1.8} className={accent ? mine.ink : body.ink} />
          <rect x={x + 6} y={y + 11} width={24} height={2.4} rx={1.2} className={accent ? mine.ink : body.ink} />
          <rect x={x + 6} y={y + 15.6} width={14} height={4} rx={2} className={accent ? mine.ink : body.ink} />
        </>
      );
    }
    if (id === "foot") {
      return <rect x={x + 4} y={y + 2.3} width={24} height={2.4} rx={1.2} className={body.ink} />;
    }
    return (
      <>
        <circle cx={x + 6} cy={y + 5} r={2.4} className={body.ink} />
        <rect x={x + 11} y={y + 3.8} width={w - 16} height={2.4} rx={1.2} className={body.ink} />
        <rect x={x + 4} y={y + d - 4.4} width={w - 12} height={1.8} rx={0.9} className={body.ink} />
      </>
    );
  };

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric211-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-106 -26 262 176" aria-hidden="true" className="isometric211-scene size-full overflow-visible">
        <defs>
          {SECTIONS.map((section) => (
            <clipPath key={`clip-${section.id}`} id={`${clipId}-${section.id}`}>
              <polygon points={outline(section)} />
            </clipPath>
          ))}
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 164, 108, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(SLAB.x, SLAB.y, BASE, SLAB.w, SLAB.d, SLAB.h, 8)} paint={body} />
        {/* The browser bar and the page */}
        <g transform={onTop(Z)}>
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={17 + dot * 5} cy={18} r={1.6} className={body.ink} />
          ))}
          <rect x={36} y={15.5} width={40} height={5} rx={2.5} className={body.ink} />
          <rect x={13} y={24} width={78} height={69} rx={3} className={body.ink} />
        </g>
        {/* The easing plate behind the knob, with its curve drawing in as the page builds */}
        <RoundBlock shape={roundBox(PLATE.x, PLATE.y, BASE, PLATE.w, PLATE.d, PLATE.h, 7)} paint={body} />
        <g transform={onTop(BASE + PLATE.h)}>
          <rect x={PLATE.x + 4} y={PLATE.y + 4} width={PLATE.w - 8} height={PLATE.d - 8} rx={4} className={body.ink} />
          <path d={CURVE} fill="none" strokeWidth={2.4} strokeLinecap="round" pathLength={1} strokeDasharray={1} className={cn("isometric211-curve", inAccent)} />
          <circle cx={PLATE.x + 8} cy={PLATE.y + PLATE.d - 8} r={2.2} className={body.base} />
          <circle cx={PLATE.x + PLATE.w - 8} cy={PLATE.y + 8} r={2.2} className={body.base} />
        </g>
        {/* The sections, back to front; each is cut off at page level while it is sunk */}
        {SECTIONS.map((section) => {
          const skin = section.id === "hero" ? mine : body;
          return (
            <g key={`section-${section.id}`} clipPath={`url(#${clipId}-${section.id})`}>
              <g className={`isometric211-${section.id}`}>
                <Block faces={box(section.x, section.y, Z, section.w, section.d, section.h)} paint={skin} />
                <g transform={onTop(Z + section.h)}>{detail(section)}</g>
              </g>
            </g>
          );
        })}
        {/* The knob: a low ring with ticks, the knob on it, and a mark on top that turns */}
        <RoundBlock shape={roundBox(KNOB.x - KNOB.ring, KNOB.y - KNOB.ring, BASE, 2 * KNOB.ring, 2 * KNOB.ring, 2, KNOB.ring)} paint={body} />
        <g transform={`${onTop(BASE + 2)} translate(${KNOB.x} ${KNOB.y})`} className={body.ink}>
          {[-120, -60, 0, 60, 120].map((angle) => (
            <circle key={`tick-${angle}`} cx={13.5 * Math.sin((angle * Math.PI) / 180)} cy={-13.5 * Math.cos((angle * Math.PI) / 180)} r={1} />
          ))}
        </g>
        <RoundBlock shape={roundBox(KNOB.x - KNOB.r, KNOB.y - KNOB.r, BASE + 2, 2 * KNOB.r, 2 * KNOB.r, KNOB.h, KNOB.r)} paint={body} />
        <g transform={`${onTop(BASE + 2 + KNOB.h)} translate(${KNOB.x} ${KNOB.y})`}>
          <g className="isometric211-turn">
            <rect x={-1.4} y={-8.6} width={2.8} height={6.4} rx={1.4} className={accent ? mine.base : body.ink} />
          </g>
        </g>
      </svg>
    </div>
  );
}
