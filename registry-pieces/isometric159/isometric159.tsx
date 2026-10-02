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

interface Isometric159Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the fish with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric159Demo: Isometric159Props = {
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

const W = 84;
const D = 36;
const FLOOR = 14;
const SAND = FLOOR + 4;
const TOP = 60;
const WATER = TOP - 6;
const SWIM = 24;
const FISH = { x: 26, y: 26, z: 32 };
// The fish is a rounded body cut into upright slices across the tank, so it has a back, a belly and two sides
const FISH_BODY = "M8 0C8 -4 3 -6 -2 -6C-6 -6 -9 -3 -10 0C-9 3 -6 6 -2 6C3 6 8 4 8 0Z";
const FISH_TAIL = "M-8 0C-10 -1 -12.5 -3 -15 -5C-14 -2 -14 2 -15 5C-12.5 3 -10 1 -8 0Z";
const FISH_DORSAL = "M-5 -5C-3 -9 2 -10 4 -4.5C1 -6 -2 -6 -5 -5Z";
const FISH_FIN = "M1.5 1.5C-0.5 3.5 -3 5.5 -5 5C-4.5 3 -2 1.5 1.5 1.5Z";
const FISH_GIRTH = 4.6;
const FISH_SLICES = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
const BUBBLES = [
  { x: 66, r: 2.2, delay: 0 },
  { x: 69, r: 1.5, delay: -1.4 },
  { x: 64, r: 1.8, delay: -2.8 },
];
const RISE = WATER - SAND - 10;
const GLASS: Record<Palette, { face: string; side: string; deep: string }> = {
  theme: { face: "fill-foreground/5", side: "fill-foreground/10", deep: "fill-foreground/10" },
  light: { face: "fill-zinc-950/5", side: "fill-zinc-950/10", deep: "fill-zinc-950/10" },
  dark: { face: "fill-white/5", side: "fill-white/10", deep: "fill-white/10" },
  tone: { face: "fill-white/20", side: "fill-white/10", deep: "fill-white/30" },
};
const STONES = [roundBox(30, 6, SAND, 14, 10, 6, 4), roundBox(60, 22, SAND, 10, 8, 4, 3)];
const LEAVES = [
  "M10 0C4 -10 6 -22 12 -32C14 -20 15 -10 14 0Z",
  "M15 0C16 -10 20 -18 26 -24C25 -14 22 -6 19 0Z",
  "M70 0C66 -8 66 -18 70 -26C73 -18 74 -8 73 0Z",
  "M74 0C76 -6 80 -10 82 -12C81 -6 79 -2 77 0Z",
];

const STYLES = `
@keyframes isometric159-swim { 0% { transform: translate(0, 0) scaleX(1); } 22% { transform: translate(${SWIM / 2}px, -2px) scaleX(1); } 44% { transform: translate(${SWIM}px, 0) scaleX(1); } 50% { transform: translate(${SWIM}px, 0) scaleX(-1); } 72% { transform: translate(${SWIM / 2}px, 2px) scaleX(-1); } 94% { transform: translate(0, 0) scaleX(-1); } 100% { transform: translate(0, 0) scaleX(1); } }
@keyframes isometric159-bubble { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(-${RISE}px); opacity: 0; } }
@keyframes isometric159-wag { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(0.72); } }
.isometric159-fish { animation: isometric159-swim 6s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric159-wag { animation: isometric159-wag 0.7s ease-in-out infinite; transform-box: fill-box; transform-origin: right center; }
.isometric159-bubble { animation: isometric159-bubble 4.2s ease-in infinite; }
.isometric159-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric159-fish, .isometric159-wag, .isometric159-bubble { animation: none; } }
`;

export function Isometric159({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric159Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const glass = GLASS[palette];
  const fish = paint.accent;
  const back = box(0, 0, FLOOR, W, D, WATER - FLOOR);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric159-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-45 -70 132 140" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-4, -4, 0, W + 8, D + 8, 10)} paint={body} />
        <g transform={onLeft(D + 4)} className={body.ink}>
          <rect x={4} y={-7} width={W - 8} height={2} rx={1} />
        </g>
        <Block faces={box(0, 0, 10, W, D, 4)} paint={body} />
        <polygon points={polygon([[0, 0, FLOOR], [W, 0, FLOOR], [W, 0, TOP], [0, 0, TOP]])} className={glass.deep} />
        <polygon points={polygon([[0, 0, FLOOR], [W, 0, FLOOR], [W, 0, WATER], [0, 0, WATER]])} className={glass.face} />
        <polygon points={polygon([[0, 0, FLOOR], [0, D, FLOOR], [0, D, TOP], [0, 0, TOP]])} className={glass.side} />
        <polygon points={polygon([[0, 0, FLOOR], [0, D, FLOOR], [0, D, WATER], [0, 0, WATER]])} className={glass.face} />
        <Block faces={box(0, 0, FLOOR, 2, 2, TOP - FLOOR)} paint={body} />
        <Block faces={box(0, 0, TOP, W, 2, 3)} paint={body} />
        <Block faces={box(0, 2, TOP, 2, D - 2, 3)} paint={body} />
        <Block faces={box(1, 1, FLOOR, W - 2, D - 2, 4)} paint={body} />
        <g transform={onTop(SAND)} className={body.ink}>
          {[8, 20, 34, 46, 60, 70].map((x, index) => (
            <circle key={x} cx={x} cy={index % 2 ? 36 : 22} r={1.5} />
          ))}
        </g>
        <g transform={onLeft(8)} className={body.ink}>
          {LEAVES.map((leaf) => (
            <path key={leaf} d={leaf} transform={`translate(0 ${-SAND})`} />
          ))}
        </g>
        <RoundBlock shape={STONES[0] as Round} paint={body} />
        {FISH_SLICES.map((offset) => {
          const girth = Math.sqrt(1 - (offset / FISH_GIRTH) ** 2);
          return (
            <g key={offset} transform={onLeft(FISH.y + offset)}>
              <g transform={`translate(${FISH.x} ${-FISH.z})`}>
                <g className="isometric159-fish">
                  {/* Keeps every slice turning about the same center */}
                  <rect x={-24} y={-14} width={48} height={28} fill="none" />
                  <g transform="scale(1.3)">
                    {offset === 0 && (
                      <>
                        <path d={FISH_TAIL} className={cn("isometric159-wag", fish.base)} />
                        <path d={FISH_DORSAL} className={fish.base} />
                      </>
                    )}
                    <g transform={`scale(${(0.4 + 0.6 * girth).toFixed(3)} ${girth.toFixed(3)})`}>
                      <path d={FISH_BODY} className={fish.base} />
                      {offset < 0 && <path d={FISH_BODY} className={fish.right} />}
                    </g>
                    {offset === 4 && (
                      <>
                        <path d={FISH_FIN} className={fish.base} />
                        <path d={FISH_FIN} className={fish.right} />
                        <circle cx={4.2} cy={-1.2} r={1.7} className="fill-white" />
                        <circle cx={4.5} cy={-1.2} r={0.9} className="fill-black/80" />
                      </>
                    )}
                  </g>
                </g>
              </g>
            </g>
          );
        })}
        <RoundBlock shape={STONES[1] as Round} paint={body} />
        <g transform={onLeft(24)}>
          {BUBBLES.map((bubble) => (
            <circle key={bubble.x} cx={bubble.x} cy={-SAND - 6} r={bubble.r} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn("isometric159-bubble", body.base, body.edge)} style={{ animationDelay: `${bubble.delay}s` }} />
          ))}
        </g>
        <polygon points={back.top} className={glass.face} />
        <polygon points={back.left} className={glass.face} />
        <polygon points={back.right} className={glass.side} />
        <polyline points={polygon([[0, D, WATER], [W, D, WATER], [W, 0, WATER]])} fill="none" strokeWidth={1} className={body.edge} />
        <Block faces={box(W - 2, 0, FLOOR, 2, 2, TOP - FLOOR)} paint={body} />
        <Block faces={box(0, D - 2, FLOOR, 2, 2, TOP - FLOOR)} paint={body} />
        <Block faces={box(W - 2, 2, TOP, 2, D - 2, 3)} paint={body} />
        <Block faces={box(2, D - 2, TOP, W - 4, 2, 3)} paint={body} />
        <Block faces={box(W - 2, D - 2, FLOOR, 2, 2, TOP - FLOOR + 3)} paint={body} />
      </svg>
    </div>
  );
}
