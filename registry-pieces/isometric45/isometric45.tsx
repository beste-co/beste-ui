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

interface Isometric45Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the speed readout and grips with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric45Demo: Isometric45Props = {
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

/** An upright cylinder standing on plan point (cx, cy). */
const cylinder = (cx: number, cy: number, z: number, h: number, r: number) => roundBox(cx - r, cy - r, z, 2 * r, 2 * r, h, r);

const G = 6;
const LEN = 112;
const WIDE = 40;
const DECK = G + 8;
const HOOD = { x: 22, top: DECK + 8 };
const RAIL = 5;
// The belt runs between the rails, from the motor hood to the rear roller
const BELT = { x0: HOOD.x, x1: 108, y0: RAIL, y1: WIDE - RAIL };
const PITCH = 14;
const CHEVRONS = Array.from({ length: 8 }, (_, index) => BELT.x0 + (index - 1) * PITCH);
const POST = { x: 8, z: HOOD.top, top: G + 62 };
const DESK = POST.top;
// The console is a wedge: its sloped face looks back at the runner and carries the screen
const SLOPE: Point[] = [[16, -2, DESK + 6], [16, WIDE + 2, DESK + 6], [4, WIDE + 2, DESK + 14], [4, -2, DESK + 14]];
const LIP: Point[] = [[16, -2, DESK], [16, WIDE + 2, DESK], [16, WIDE + 2, DESK + 6], [16, -2, DESK + 6]];
const CHEEK: Point[] = [[4, WIDE + 2, DESK], [16, WIDE + 2, DESK], [16, WIDE + 2, DESK + 6], [4, WIDE + 2, DESK + 14]];
const RUN = Math.hypot(12, 8);
// Draws flat onto the sloped face: u runs across the console, v up the slope
const ON_SLOPE = `matrix(${-C} ${S} ${((-12 / RUN) * C).toFixed(4)} ${((-12 / RUN) * S - 8 / RUN).toFixed(4)} ${(18 * C).toFixed(1)} ${(14 * S - DESK - 6).toFixed(1)})`;
const BARS = [0, 1, 2, 3, 4, 5];
const bar = (index: number) => {
  const on = 10 + index * 9;
  return `@keyframes isometric45-bar${index} { 0%, ${on - 2}% { opacity: 0.15; } ${on}%, 64% { opacity: 1; } 68% { opacity: 0.4; } 72%, 82% { opacity: 1; } 88%, 100% { opacity: 0.15; } }\n.isometric45-bar${index} { animation: isometric45-bar${index} 6s linear infinite; }`;
};

const STYLES = `
@keyframes isometric45-belt { to { transform: translateX(${PITCH}px); } }
.isometric45-belt { animation: isometric45-belt 0.7s linear infinite; }
${BARS.map(bar).join("\n")}
.isometric45-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric45-belt, .isometric45-readout * { animation: none; } }
`;

export function Isometric45({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric45Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const trim = paint.accent;
  const upright = (y: number) => <Block faces={box(POST.x, y, POST.z, 4, 4, POST.top - POST.z)} paint={body} />;
  const handle = (y: number) => (
    <>
      <Block faces={box(16, y, DESK + 1, 14, 3, 3)} paint={body} />
      <Block faces={box(30, y - 0.5, DESK + 0.5, 10, 4, 4)} paint={trim} />
    </>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric45-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-58 -90 178 182" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={BELT.x0} y={BELT.y0} width={BELT.x1 - BELT.x0} height={BELT.y1 - BELT.y0} rx={1.5} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(-8, -10, 0, LEN + 18, WIDE + 20, G, 10)} paint={body} />
        <RoundBlock shape={roundBox(0, 0, G, LEN, WIDE, DECK - G, 5)} paint={body} />
        <g transform={onRight(LEN)} className={body.ink}>
          <rect x={7} y={-(DECK - 2)} width={WIDE - 14} height={4} rx={2} />
        </g>
        <g transform={onLeft(WIDE)} className={body.ink}>
          <circle cx={BELT.x0 + 6} cy={-(G + 4)} r={2} />
          <circle cx={BELT.x1 - 4} cy={-(G + 4)} r={2} />
          <rect x={BELT.x0 + 14} y={-(G + 5)} width={BELT.x1 - BELT.x0 - 28} height={2} rx={1} />
        </g>
        <RoundBlock shape={roundBox(0, 0, DECK, HOOD.x, WIDE, HOOD.top - DECK, 5)} paint={body} />
        <g transform={onRight(HOOD.x)} className={body.ink}>
          <rect x={10} y={-(HOOD.top - 3)} width={WIDE - 20} height={2} rx={1} />
        </g>
        <RoundBlock shape={roundBox(HOOD.x, 0, DECK, LEN - HOOD.x - 1.5, RAIL, 3, 2.5)} paint={body} />
        <g transform={onTop(DECK)}>
          <g clipPath={`url(#${clipId})`}>
            <rect x={BELT.x0} y={BELT.y0} width={BELT.x1 - BELT.x0} height={BELT.y1 - BELT.y0} className={body.ink} />
            <rect x={BELT.x0} y={BELT.y0} width={BELT.x1 - BELT.x0} height={BELT.y1 - BELT.y0} className={body.ink} />
            {/* The belt runs back toward the rear roller, one chevron pitch per loop */}
            <g className={cn("isometric45-belt", body.base)}>
              {CHEVRONS.map((x) => (
                <path key={x} d={`M${x} ${BELT.y0 + 6}h3l5 ${WIDE / 2 - RAIL - 6}l-5 ${WIDE / 2 - RAIL - 6}h-3l5 ${-(WIDE / 2 - RAIL - 6)}Z`} />
              ))}
            </g>
          </g>
        </g>
        <RoundBlock shape={roundBox(HOOD.x, WIDE - RAIL, DECK, LEN - HOOD.x - 1.5, RAIL, 3, 2.5)} paint={body} />
        {upright(1)}
        <RoundBlock shape={cylinder(11, 20, HOOD.top, 3, 4.5)} paint={body} />
        <RoundBlock shape={cylinder(11, 20, HOOD.top + 3, 11, 3)} paint={body} />
        <RoundBlock shape={cylinder(11, 20, HOOD.top + 14, 3, 1.6)} paint={trim} />
        {upright(WIDE - 5)}
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={polygon(CHEEK)} className={body.base} />
          <polygon points={polygon(CHEEK)} className={body.left} stroke="none" />
          <polygon points={polygon(LIP)} className={body.base} />
          <polygon points={polygon(LIP)} className={body.right} stroke="none" />
          <polygon points={polygon(SLOPE)} className={body.base} />
        </g>
        <g transform={ON_SLOPE} className="isometric45-readout">
          <rect x={6} y={2} width={WIDE - 8} height={RUN - 4} rx={1.5} className={body.ink} />
          <rect x={6} y={2} width={WIDE - 8} height={RUN - 4} rx={1.5} className={body.ink} />
          {BARS.map((index) => (
            <rect key={index} x={9 + index * 4.5} y={RUN - 4.5 - (2.5 + index)} width={3} height={2.5 + index} rx={0.75} className={cn(`isometric45-bar${index}`, trim.base)} />
          ))}
          <circle cx={WIDE - 6.5} cy={RUN / 2} r={2.2} className={body.base} />
        </g>
        {handle(0)}
        {handle(WIDE - 3)}
      </svg>
    </div>
  );
}
