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

interface Isometric235Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the arrow sign and the new address plate with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric235Demo: Isometric235Props = {
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

const PLATE = { w: 60, d: 5, h: 36, y: 24, z: BASE + 4 };
const OLD_X = 14;
const NEW_X = 96;
const FACE = PLATE.y + PLATE.d;
// The signpost stands in front of the gap; its arrow lies flat on the post and turns about it
const POST = { x: (OLD_X + NEW_X + PLATE.w) / 2, y: 60, r: 3, h: 26 };
const SIGN = { z: BASE + POST.h, thick: 4 };
// Plan angles from the post to the middle of each plate, clockwise from the x axis
const aim = (x: number) => (Math.atan2(PLATE.y + PLATE.d / 2 - POST.y, x + PLATE.w / 2 - POST.x) * 180) / Math.PI;
const AIM_OLD = aim(OLD_X);
const AIM_NEW = aim(NEW_X);
// The arrow in plan, pointing along x from its pivot
const ARROW = "M-11 -3.5H11V-8L24 0L11 8V3.5H-11Z";
const LAYERS = Array.from({ length: SIGN.thick + 1 }, (_, index) => index);

const PERIOD = 8;

const STYLES = `
@keyframes isometric235-turn { 0%, 12% { transform: rotate(${AIM_OLD.toFixed(1)}deg); } 42%, 86% { transform: rotate(${AIM_NEW.toFixed(1)}deg); } 97%, 100% { transform: rotate(${AIM_OLD.toFixed(1)}deg); } }
@keyframes isometric235-old { 0%, 16% { opacity: 1; } 32%, 88% { opacity: 0.35; } 97%, 100% { opacity: 1; } }
@keyframes isometric235-new { 0%, 40% { opacity: 0; } 50%, 86% { opacity: 1; } 94%, 100% { opacity: 0; } }
.isometric235-turn { animation: isometric235-turn ${PERIOD}s ease-in-out infinite; }
.isometric235-old { opacity: 0.35; animation: isometric235-old ${PERIOD}s ease-in-out infinite; }
.isometric235-new { animation: isometric235-new ${PERIOD}s ease-in-out infinite; }
.isometric235-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric235-scene * { animation: none !important; } }
`;

/** What an address plate shows on its face: an address bar with a path in it, and two lines. */
function Address({ x, bar, text }: { x: number; bar: string; text: string }) {
  const top = -(PLATE.z + PLATE.h);
  return (
    <g transform={onLeft(FACE)}>
      <rect x={x + 6} y={top + 7} width={PLATE.w - 12} height={10} rx={5} className={bar} />
      <circle cx={x + 12} cy={top + 12} r={2} className={text} />
      <rect x={x + 17} y={top + 10.7} width={24} height={2.6} rx={1.3} className={text} />
      <rect x={x + 6} y={top + 22} width={32} height={2.8} rx={1.4} className={bar} />
      <rect x={x + 6} y={top + 28} width={20} height={2.8} rx={1.4} className={bar} />
    </g>
  );
}

export function Isometric235({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric235Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const sign = accent ? mine : body;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric235-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-77 -36 232 170" aria-hidden="true" className="isometric235-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 170, 80, BASE, 14)} paint={body} />
        {/* The old address: its face dims once the sign has turned away */}
        <Block faces={box(OLD_X + 14, PLATE.y - 3, BASE, PLATE.w - 28, PLATE.d + 6, 4)} paint={body} />
        <Block faces={box(OLD_X, PLATE.y, PLATE.z, PLATE.w, PLATE.d, PLATE.h)} paint={body} />
        <g className="isometric235-old">
          <Address x={OLD_X} bar={body.ink} text={body.base} />
        </g>
        {/* The new address: the same plate, taking the accent when the sign points at it */}
        <Block faces={box(NEW_X + 14, PLATE.y - 3, BASE, PLATE.w - 28, PLATE.d + 6, 4)} paint={body} />
        <Block faces={box(NEW_X, PLATE.y, PLATE.z, PLATE.w, PLATE.d, PLATE.h)} paint={body} />
        <Address x={NEW_X} bar={body.ink} text={body.base} />
        <g className="isometric235-new">
          <Block faces={box(NEW_X, PLATE.y, PLATE.z, PLATE.w, PLATE.d, PLATE.h)} paint={mine} />
          <Address x={NEW_X} bar={mine.ink} text={mine.base} />
        </g>
        {/* The signpost: a foot and a post, then the arrow as stacked layers that all turn together */}
        <RoundBlock shape={roundBox(POST.x - 9, POST.y - 9, BASE, 18, 18, 3, 9)} paint={body} />
        <RoundBlock shape={roundBox(POST.x - POST.r, POST.y - POST.r, BASE + 3, 2 * POST.r, 2 * POST.r, POST.h - 3, POST.r)} paint={body} />
        {(["outline", "fill"] as const).map((pass) =>
          LAYERS.map((layer) => (
            <g key={`sign-${pass}-${layer}`} transform={`${onTop(SIGN.z + layer)} translate(${POST.x} ${POST.y})`}>
              <g className="isometric235-turn" transform={`rotate(${AIM_NEW.toFixed(1)})`}>
                {pass === "outline" ? (
                  <path d={ARROW} strokeWidth={1.4} strokeLinejoin="round" className={cn(sign.base, sign.edge)} />
                ) : (
                  <>
                    <path d={ARROW} className={sign.base} />
                    {layer < SIGN.thick && <path d={ARROW} className={sign.right} />}
                  </>
                )}
              </g>
            </g>
          )),
        )}
        <circle cx={POST.x} cy={POST.y} r={2} transform={onTop(SIGN.z + SIGN.thick)} className={sign.ink} />
      </svg>
    </div>
  );
}
