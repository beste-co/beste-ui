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

interface Isometric148Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the mainsail with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric148Demo: Isometric148Props = {
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

const G = 8;
const DECK = 22;
const MY = 42;
const MX = 46;
const MAST = 84;
// Hull outline at deck height, stern to bow
const TOP: [number, number][] = [[16, 30], [54, 30], [82, 42], [54, 54], [16, 54]];
const lift = (points: [number, number][], z: number) => points.map(([x, y]): Point => [x, y, z]);
const DECK_FACE = polygon(lift(TOP, DECK));
const SIDE = polygon([[16, 54, DECK], [54, 54, DECK], [54, 50, G], [20, 50, G]]);
const BOW = polygon([[54, 54, DECK], [82, 42, DECK], [75, 42, G], [54, 50, G]]);
const STERN_RAIL = polygon(lift([[16, 54], [54, 54], [82, 42], [78, 42], [54, 52], [16, 52]], DECK));
const MAIN = `M${MX - 1} ${-(DECK + 5)}V${-(MAST - 3)}Q${MX - 14} ${-(DECK + 30)} ${MX - 28} ${-(DECK + 5)}Z`;
const JIB = `M${MX + 2} ${-(MAST - 16)}L${MX + 26} ${-(DECK + 3)}H${MX + 3}Z`;
const RINGS = [0, 1];

const STYLES = `
@keyframes isometric148-rock { 0%, 100% { transform: rotate(-2.5deg) translateY(0); } 50% { transform: rotate(2.5deg) translateY(1.5px); } }
@keyframes isometric148-ring { 0% { transform: scale(0.7); opacity: 0; } 20% { opacity: 1; } 100% { transform: scale(1.25); opacity: 0; } }
.isometric148-boat { animation: isometric148-rock 4.4s ease-in-out infinite; transform-box: fill-box; transform-origin: 50% 90%; }
.isometric148-ring { animation: isometric148-ring 4.4s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric148-ring-b { animation-delay: -2.2s; }
.isometric148-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric148-boat, .isometric148-ring { animation: none; } }
`;

function Sheet({ d, paint, front }: { d: string; paint: Paint; front: boolean }) {
  return (
    <>
      <path d={d} className={paint.base} />
      <path d={d} className={front ? paint.left : paint.right} />
      <path d={d} fill="none" strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={paint.edge} />
    </>
  );
}

export function Isometric148({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric148Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const line = body.ink.replace("fill-", "stroke-");

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric148-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -50 148 142" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 96, 84, G, 22)} paint={body} />
        <g transform={onTop(G)} fill="none" strokeWidth={1.5} strokeLinecap="round" className={line}>
          <path d="M10 14q6 -4 12 0t12 0" />
          <path d="M62 72q6 -4 12 0t12 0" />
          <path d="M8 66q6 -4 12 0" />
          {RINGS.map((index) => (
            <rect key={index} x={8} y={24} width={82} height={36} rx={18} className={cn("isometric148-ring", index === 1 && "isometric148-ring-b opacity-0")} />
          ))}
        </g>
        <g className="isometric148-boat">
          <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
            <polygon points={SIDE} className={body.base} />
            <polygon points={SIDE} className={body.left} stroke="none" />
            <polygon points={BOW} className={body.base} />
            <polygon points={BOW} className={body.right} stroke="none" />
            <polygon points={DECK_FACE} className={body.base} />
          </g>
          <polygon points={STERN_RAIL} className={body.ink} />
          <g transform={onTop(DECK)} className={body.ink}>
            <rect x={22} y={36} width={16} height={12} rx={3} />
          </g>
          <g transform={onLeft(MY)}>
            <Sheet d={JIB} paint={body} front />
            <Sheet d={MAIN} paint={paint.accent} front />
          </g>
          <Block faces={box(MX - 29, MY - 1, DECK + 3, 29, 2, 2)} paint={body} />
          <Block faces={box(MX - 1, MY - 1, DECK, 2, 2, MAST - DECK)} paint={body} />
        </g>
      </svg>
    </div>
  );
}
