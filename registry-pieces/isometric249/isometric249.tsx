"use client";

import { type ReactNode, useId } from "react";
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

interface Isometric249Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the change, the publish button and the page buttons with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric249Demo: Isometric249Props = {
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
const SLAB = { w: 54, h: 52, y: 40, z: BASE + 1 };
const DRAFT = 16;
const LIVE = 90;
// The publish button stands in a low housing in front of the gap between the two pages
const BUTTON = { x: 80, y: 66, r: 8, z: BASE + 2.5, h: 4, press: 3 };
const PERIOD = 10;
// Everything above the front of the well's rim, so a pressed button goes into the housing
const WELL = polygon([
  ...Array.from({ length: 19 }, (_, k): Point => {
    const angle = ((-45 + k * 10) * Math.PI) / 180;
    return [BUTTON.x + BUTTON.r * Math.cos(angle), BUTTON.y + BUTTON.r * Math.sin(angle), BUTTON.z];
  }),
  [BUTTON.x - BUTTON.r, BUTTON.y + BUTTON.r, BUTTON.z + 60],
  [BUTTON.x + BUTTON.r, BUTTON.y - BUTTON.r, BUTTON.z + 60],
]);

const STYLES = `
@keyframes isometric249-change { 0%, 8% { opacity: 0; } 16%, 88% { opacity: 1; } 95%, 100% { opacity: 0; } }
@keyframes isometric249-press { 0%, 26%, 40%, 100% { transform: translateY(0px); } 31%, 34% { transform: translateY(${BUTTON.press}px); } }
@keyframes isometric249-live { 0%, 34% { opacity: 0; } 44%, 88% { opacity: 1; } 95%, 100% { opacity: 0; } }
.isometric249-change { animation: isometric249-change ${PERIOD}s ease-in-out infinite; }
.isometric249-press { animation: isometric249-press ${PERIOD}s ease-in-out infinite; }
.isometric249-live { animation: isometric249-live ${PERIOD}s ease-in-out infinite; }
.isometric249-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric249-scene * { animation: none !important; } }
`;

export function Isometric249({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric249Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const clipId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric249-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-84 -42 231 174" aria-hidden="true" className="isometric249-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={WELL} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 160, 88, BASE, 14)} paint={body} />
        {/* The draft: dashed placeholders, and the change that appears on it */}
        <HolderBack x={DRAFT} y0={SLAB.y} w={SLAB.w} paint={body} />
        <Slab x={DRAFT} y0={SLAB.y} z={SLAB.z} w={SLAB.w} h={SLAB.h} paint={body}>
          <rect x={2} y={2} width={SLAB.w - 4} height={SLAB.h - 4} rx={2} className={body.base} />
          <rect x={5} y={4.4} width={12} height={2.6} rx={1.3} className={body.ink} />
          <g fill="none" strokeWidth={1} strokeDasharray="3 2.2" strokeLinecap="round" className={body.edge}>
            <rect x={5} y={11} width={28} height={4.5} rx={2.25} />
            <rect x={5} y={19} width={18} height={7} rx={3.5} />
            <rect x={5} y={30} width={20.5} height={15} rx={2.5} />
            <rect x={28.5} y={30} width={20.5} height={15} rx={2.5} />
          </g>
          <rect x={5} y={19} width={18} height={7} rx={3.5} className={cn("isometric249-change", accent ? mine.base : body.ink)} />
        </Slab>
        <HolderLip x={DRAFT} y0={SLAB.y} w={SLAB.w} paint={body} />
        {/* The live page, finished; the change fades in once the button is pressed */}
        <HolderBack x={LIVE} y0={SLAB.y} w={SLAB.w} paint={body} />
        <Slab x={LIVE} y0={SLAB.y} z={SLAB.z} w={SLAB.w} h={SLAB.h} paint={body}>
          <rect x={2} y={2} width={SLAB.w - 4} height={SLAB.h - 4} rx={2} className={body.base} />
          <rect x={5} y={4.4} width={12} height={2.6} rx={1.3} className={body.ink} />
          <rect x={5} y={11.5} width={28} height={3.5} rx={1.75} className={body.ink} />
          <rect x={5} y={19} width={18} height={7} rx={3.5} className={body.ink} />
          <rect x={5} y={30} width={20.5} height={15} rx={2.5} className={body.ink} />
          <rect x={28.5} y={30} width={20.5} height={15} rx={2.5} className={body.ink} />
          <g className="isometric249-live">
            <rect x={5} y={19} width={18} height={7} rx={3.5} className={body.base} />
            <rect x={5} y={19} width={18} height={7} rx={3.5} className={accent ? mine.base : body.ink} />
          </g>
        </Slab>
        <HolderLip x={LIVE} y0={SLAB.y} w={SLAB.w} paint={body} />
        {/* The publish button: a housing with a well, and the button that sinks into it */}
        <RoundBlock shape={roundBox(BUTTON.x - 12, BUTTON.y - 12, BASE, 24, 24, 2.5, 12)} paint={body} />
        <circle cx={BUTTON.x} cy={BUTTON.y} r={BUTTON.r + 1.5} transform={onTop(BUTTON.z)} className={body.ink} />
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric249-press">
            <RoundBlock shape={roundBox(BUTTON.x - BUTTON.r, BUTTON.y - BUTTON.r, BUTTON.z - BUTTON.press, 2 * BUTTON.r, 2 * BUTTON.r, BUTTON.h + BUTTON.press, BUTTON.r)} paint={mine} />
            <path d="M0 3.5V-3.5M-3 -0.5L0 -3.5L3 -0.5" transform={`${onTop(BUTTON.z + BUTTON.h)} translate(${BUTTON.x} ${BUTTON.y}) rotate(-45)`} fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge} />
          </g>
        </g>
      </svg>
    </div>
  );
}
