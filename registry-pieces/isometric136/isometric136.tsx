"use client";

import { useId } from "react";
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

interface Isometric136Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the lipstick with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric136Demo: Isometric136Props = {
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

/** An upright cylinder whose top is cut at a slant that falls toward the right. */
function slanted(cx: number, cy: number, z: number, h: number, r: number, rise: number) {
  const top = (deg: number) => z + h + (rise * (1 - (Math.cos((deg * Math.PI) / 180) - Math.sin((deg * Math.PI) / 180)) / Math.SQRT2)) / 2;
  const rim = (deg: number): [number, number] => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
  const band = (from: number, to: number) => {
    const angles = Array.from({ length: 17 }, (_, k) => from + ((to - from) * k) / 16);
    return polygon([...angles.map((a): Point => [...rim(a), z]), ...[...angles].reverse().map((a): Point => [...rim(a), top(a)])]);
  };
  const ring = Array.from({ length: 36 }, (_, k): Point => [...rim(k * 10), top(k * 10)]);
  return { side: band(-45, 135), left: band(45, 135), right: band(-45, 45), top: polygon(ring) };
}

const PLINTH = 6;
const CASE = { x: 12, y: 24, s: 22, h: 26 };
const MX = CASE.x + CASE.s / 2;
const MY = CASE.y + CASE.s / 2;
const RIM = PLINTH + CASE.h;
const SLEEVE = 8;
const CAP = { x: 46, y: 10, s: 22, h: 22 };
const LIP = slanted(MX, MY, RIM + SLEEVE, 10, 7, 12);
// Everything above the case's front rim; the lipstick sinks below it
// What shows of the bullet is what stands inside or above the mouth of the case: the near edges of the opening cut it off
const INSET = 3;
const MOUTH = [
  [CASE.x + INSET, CASE.y + CASE.s - INSET],
  [CASE.x + CASE.s - INSET, CASE.y + CASE.s - INSET],
  [CASE.x + CASE.s - INSET, CASE.y + INSET],
].map(([x = 0, y = 0]) => project([x, y, RIM]).split(",").map(Number) as [number, number]);
const CLIP = `${MOUTH.map(([px, py], index) => `${index ? "L" : "M"}${px} ${py}`).join("")}V-200H${MOUTH[0]?.[0] ?? 0}Z`;
const STYLES = `
@keyframes isometric136-rise { 0%, 8% { transform: translateY(22px); } 34%, 78% { transform: translateY(0); } 96%, 100% { transform: translateY(22px); } }
.isometric136-rise { animation: isometric136-rise 5s cubic-bezier(0.45, 0, 0.3, 1) infinite; }
.isometric136-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric136-rise { animation: none; } }
`;

export function Isometric136({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric136Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const lip = paint.accent;
  const hole = palette === "dark" ? "fill-black/40" : palette === "tone" ? "fill-black/25" : "fill-foreground/20";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric136-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-50 -46 117 116" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <path d={CLIP} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 80, 60, PLINTH, 12)} paint={body} />
        <RoundBlock shape={roundBox(CASE.x, CASE.y, PLINTH, CASE.s, CASE.s, CASE.h, 4)} paint={body} />
        <g transform={onLeft(CASE.y + CASE.s)} className={body.ink}>
          <rect x={CASE.x + 3} y={-RIM + 5} width={CASE.s - 6} height={2} />
        </g>
        <g transform={onRight(CASE.x + CASE.s)} className={body.ink}>
          <rect x={CASE.y + 3} y={-RIM + 5} width={CASE.s - 6} height={2} />
        </g>
        <rect x={CASE.x + INSET} y={CASE.y + INSET} width={CASE.s - 2 * INSET} height={CASE.s - 2 * INSET} rx={2} transform={onTop(RIM)} className={hole} />
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric136-rise">
            <RoundBlock shape={cylinder(MX, MY, RIM, SLEEVE, 8)} paint={body} />
            <g className={lip.edge} strokeWidth={1} strokeLinejoin="round">
              <polygon points={LIP.side} className={lip.base} />
              <polygon points={LIP.left} className={lip.left} stroke="none" />
              <polygon points={LIP.right} className={lip.right} stroke="none" />
              <polygon points={LIP.top} className={lip.base} />
            </g>
          </g>
        </g>
        <RoundBlock shape={roundBox(CAP.x, CAP.y, PLINTH, CAP.s, CAP.s, CAP.h, 4)} paint={body} />
        <rect x={CAP.x + 3} y={CAP.y + 3} width={CAP.s - 6} height={CAP.s - 6} rx={2} transform={onTop(PLINTH + CAP.h)} className={hole} />
        <g transform={onLeft(CAP.y + CAP.s)} className={body.ink}>
          <rect x={CAP.x + 3} y={-PLINTH - 5} width={CAP.s - 6} height={2} />
        </g>
      </svg>
    </div>
  );
}
