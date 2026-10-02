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

interface Isometric243Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the key, the new owner's name plate and the page highlight with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric243Demo: Isometric243Props = {
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

const G = 6;
const DESK = { w: 184, d: 84 };
const PED = { y: 16, w: 62, d: 52, h: 10, r: 8 };
const FROM = 12;
const TO = 110;
const TOP = G + PED.h;
// The tray is drawn on the pedestal it ends on; the animation starts it on the other one
const TRAY = { x: TO + 9, y: 26, w: 44, d: 32, h: 2.5 };
const DECK = TOP + TRAY.h;
const SLAB = { x: TRAY.x + 6, y: 34, w: 32, d: 4, h: 30 };
const KEY = { x: TRAY.x + 8, y: 45 };
const TRAVEL = FROM - TO;
const PERIOD = 10;
const START = `translate(${(TRAVEL * C).toFixed(2)}px, ${(TRAVEL * S).toFixed(2)}px)`;

const STYLES = `
@keyframes isometric243-move { 0%, 14% { transform: ${START}; } 40%, 91% { transform: translate(0px, 0px); } 92%, 100% { transform: ${START}; } }
@keyframes isometric243-fade { 0%, 85% { opacity: 1; } 89%, 94% { opacity: 0; } 99%, 100% { opacity: 1; } }
@keyframes isometric243-named { 0%, 39% { opacity: 0; } 46%, 85% { opacity: 1; } 90%, 100% { opacity: 0; } }
.isometric243-move { animation: isometric243-move ${PERIOD}s cubic-bezier(0.5, 0, 0.2, 1) infinite; }
.isometric243-fade { animation: isometric243-fade ${PERIOD}s linear infinite; }
.isometric243-named { animation: isometric243-named ${PERIOD}s ease-in-out infinite; }
.isometric243-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric243-scene * { animation: none !important; } }
`;

export function Isometric243({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric243Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric243-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-86 -34 258 182" aria-hidden="true" className="isometric243-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, DESK.w, DESK.d, G, 14)} paint={body} />
        {/* The pedestal the project leaves, the bridge, and the pedestal it arrives on */}
        <RoundBlock shape={roundBox(FROM, PED.y, G, PED.w, PED.d, PED.h, PED.r)} paint={body} />
        <Block faces={box(FROM + PED.w, 32, G, TO - FROM - PED.w, 20, PED.h)} paint={body} />
        <RoundBlock shape={roundBox(TO, PED.y, G, PED.w, PED.d, PED.h, PED.r)} paint={body} />
        {/* A name plate on the front of each pedestal; the new owner's takes the accent */}
        <g transform={onLeft(PED.y + PED.d)}>
          {[FROM, TO].map((x) => (
            <g key={`plate-${x}`}>
              <rect x={x + 14} y={-(G + 7.6)} width={34} height={5.2} rx={2.6} className={body.ink} />
              <circle cx={x + 18.4} cy={-(G + 5)} r={1.6} className={body.base} />
            </g>
          ))}
          <g className="isometric243-named">
            <rect x={TO + 14} y={-(G + 7.6)} width={34} height={5.2} rx={2.6} className={mine.base} />
            <circle cx={TO + 18.4} cy={-(G + 5)} r={1.6} className={mine.ink} />
            <rect x={TO + 23} y={-(G + 6)} width={18} height={2} rx={1} className={mine.ink} />
          </g>
        </g>
        {/* The tray with the finished site and its key slides across as one */}
        <g className="isometric243-fade">
          <g className="isometric243-move">
            <RoundBlock shape={roundBox(TRAY.x, TRAY.y, TOP, TRAY.w, TRAY.d, TRAY.h, 5)} paint={body} />
            <Block faces={box(SLAB.x, SLAB.y, DECK, SLAB.w, SLAB.d, SLAB.h)} paint={body} />
            <g transform={onLeft(SLAB.y + SLAB.d)}>
              <rect x={SLAB.x + 2.5} y={-(DECK + SLAB.h - 2.5)} width={SLAB.w - 5} height={SLAB.h - 5} rx={2.5} className={body.ink} />
              {[0, 1, 2].map((dot) => (
                <circle key={`dot-${dot}`} cx={SLAB.x + 6 + dot * 3} cy={-(DECK + 24.6)} r={0.9} className={body.base} />
              ))}
              <rect x={SLAB.x + 5} y={-(DECK + 22)} width={SLAB.w - 10} height={9} rx={2} className={mine.base} />
              <rect x={SLAB.x + 5} y={-(DECK + 11)} width={10} height={6.5} rx={1.6} className={body.base} />
              <rect x={SLAB.x + 17} y={-(DECK + 11)} width={10} height={6.5} rx={1.6} className={body.base} />
            </g>
            {/* The key: a round bow, a shaft and two teeth, lying on the tray */}
            <RoundBlock shape={roundBox(KEY.x, KEY.y, DECK, 10, 10, 2, 5)} paint={mine} />
            <g transform={onTop(DECK + 2)}>
              <circle cx={KEY.x + 5} cy={KEY.y + 5} r={2} className={mine.ink} />
            </g>
            <Block faces={box(KEY.x + 9.5, KEY.y + 3.5, DECK, 18, 3, 2)} paint={mine} />
            <Block faces={box(KEY.x + 20.5, KEY.y + 6.5, DECK, 2.8, 3, 2)} paint={mine} />
            <Block faces={box(KEY.x + 24.7, KEY.y + 6.5, DECK, 2.8, 2.2, 2)} paint={mine} />
          </g>
        </g>
      </svg>
    </div>
  );
}
