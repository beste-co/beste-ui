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

interface Isometric232Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the page hero, the scan bar and the agent light with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric232Demo: Isometric232Props = {
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

const TALL = 72;
const THICK = 5;
const PAGE = { w: 60, foot: [12, 44, BASE + 3] as Point };
const DOC = { w: 54, foot: [80, 44, BASE + 3] as Point };
// The part of the document the scan bar travels over
const READ = { x: 4, y: 6, w: DOC.w - 8, h: 56 };
const BOT = { x: 142, y: 50, w: 28, h: 16 };

const PERIOD = 8;
const STYLES = `
@keyframes isometric232-scan { 0%, 10% { transform: translateY(0px); opacity: 0; } 14% { transform: translateY(0px); opacity: 1; } 50% { transform: translateY(${READ.h - 4}px); opacity: 1; } 55%, 100% { transform: translateY(${READ.h - 4}px); opacity: 0; } }
@keyframes isometric232-light { 0%, 52% { opacity: 0; } 60%, 88% { opacity: 1; } 95%, 100% { opacity: 0; } }
.isometric232-scan { opacity: 0; animation: isometric232-scan ${PERIOD}s ease-in-out infinite; }
.isometric232-light { animation: isometric232-light ${PERIOD}s ease-in-out infinite; }
.isometric232-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric232-scene * { animation: none !important; } }
`;
export function Isometric232({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric232Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const clipId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric232-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-94 -70 262 218" aria-hidden="true" className="isometric232-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={READ.x} y={READ.y} width={READ.w} height={READ.h} rx={3} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 180, 92, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(6, 14, BASE, 134, 44, 3, 8)} paint={body} />
        {/* The page: a hero in the accent and two cards */}
        <Rest id="page-rest" foot={PAGE.foot} w={PAGE.w} tall={40} behind={THICK} paint={body} />
        <Slab id="page" foot={PAGE.foot} w={PAGE.w} tall={TALL} thick={THICK} paint={body}>
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={6 + dot * 4} cy={5.5} r={1.2} className={body.ink} />
          ))}
          <rect x={20} y={3.4} width={PAGE.w - 26} height={4.4} rx={2.2} className={body.ink} />
          <rect x={4} y={11} width={PAGE.w - 8} height={24} rx={4} className={mine.base} />
          <rect x={9} y={17} width={26} height={3.6} rx={1.8} className={mine.ink} />
          <rect x={9} y={24} width={16} height={2.6} rx={1.3} className={mine.ink} />
          {[4, 31.5].map((x) => (
            <g key={`card-${x}`}>
              <rect x={x} y={38.5} width={24.5} height={22} rx={4} className={body.ink} />
              <rect x={x + 4} y={43} width={12} height={2.4} rx={1.2} className={body.base} />
              <rect x={x + 4} y={48.5} width={16} height={2} rx={1} className={body.base} />
              <rect x={x + 4} y={53} width={10} height={2} rx={1} className={body.base} />
            </g>
          ))}
        </Slab>
        {/* The same page as plain text: a heading mark, paragraphs, a list and a code block */}
        <Rest id="doc-rest" foot={DOC.foot} w={DOC.w} tall={40} behind={THICK} paint={body} />
        <Slab id="doc" foot={DOC.foot} w={DOC.w} tall={TALL} thick={THICK} paint={body}>
          <g className={body.ink}>
            <rect x={7} y={10} width={3.4} height={3.4} rx={0.8} />
            <rect x={13} y={10.2} width={24} height={3} rx={1.5} />
            <rect x={7} y={18} width={38} height={2} rx={1} />
            <rect x={7} y={22.5} width={32} height={2} rx={1} />
            <rect x={7} y={27} width={36} height={2} rx={1} />
            {[34, 39, 44].map((y, index) => (
              <g key={`item-${y}`}>
                <circle cx={8.4} cy={y + 1} r={1.2} />
                <rect x={12} y={y} width={[26, 20, 30][index]} height={2} rx={1} />
              </g>
            ))}
            <rect x={7} y={50} width={40} height={10} rx={2.5} />
          </g>
          <rect x={10} y={53} width={18} height={1.6} rx={0.8} className={body.base} />
          <rect x={10} y={56.2} width={12} height={1.6} rx={0.8} className={body.base} />
          <g clipPath={`url(#${clipId})`}>
            <g className="isometric232-scan">
              <rect x={READ.x} y={READ.y} width={READ.w} height={4} rx={2} className={accent ? mine.base : body.ink} />
            </g>
          </g>
        </Slab>
        {/* The lip of the stand holds both slabs */}
        <RoundBlock shape={roundBox(8, 43, BASE + 3, 130, 6, 5, 2.5)} paint={body} />
        {/* The agent module: a rounded body with two eyes on its face and a light on a short stem */}
        <RoundBlock shape={roundBox(BOT.x, BOT.y, BASE, BOT.w, BOT.w, BOT.h, 8)} paint={body} />
        <g transform={onLeft(BOT.y + BOT.w)} className={body.ink}>
          <circle cx={BOT.x + 10.5} cy={-(BASE + BOT.h / 2 + 1)} r={2.2} />
          <circle cx={BOT.x + 17.5} cy={-(BASE + BOT.h / 2 + 1)} r={2.2} />
        </g>
        <RoundBlock shape={roundBox(BOT.x + 12, BOT.y + 10, BASE + BOT.h, 4, 4, 6, 2)} paint={body} />
        <RoundBlock shape={roundBox(BOT.x + 9.5, BOT.y + 7.5, BASE + BOT.h + 6, 9, 9, 5, 4.5)} paint={body} />
        <g className="isometric232-light">
          <RoundBlock shape={roundBox(BOT.x + 9.5, BOT.y + 7.5, BASE + BOT.h + 6, 9, 9, 5, 4.5)} paint={mine} />
        </g>
      </svg>
    </div>
  );
}
