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

interface Isometric106Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Fill the activity rings with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric106Demo: Isometric106Props = {
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

const CASE = { w: 46, d: 54, h: 14, r: 13 };
// The strap is as wide as the gap between the lugs and runs along the line through the middle of the case
const STRAP = { x: 8, w: 30, t: 4, lug: 11, run: 16 };
const LUG = 4;
const FAR = -40;
const NEAR = CASE.d + 40;
const TIP = 6;
/** Height of the top of the strap at a distance from the case: level with the lugs, easing down to lie flat. */
const dip = (distance: number) => {
  const t = Math.min(1, distance / STRAP.run);
  return STRAP.t + (STRAP.lug - STRAP.t) * (1 - t * t * (3 - 2 * t));
};
/** One strap half from the case end out to its far end: the top ribbon and the side that faces the viewer. */
function strap(from: number, to: number) {
  const length = Math.abs(to - from);
  const profile = [...Array.from({ length: STRAP.run / 2 + 1 }, (_, k) => k * 2), length].map((d): [number, number] => [from + Math.sign(to - from) * d, dip(d)]);
  const back = [...profile].reverse();
  const x1 = STRAP.x + STRAP.w;
  return {
    top: polygon([...profile.map(([y, z]): Point => [STRAP.x, y, z]), ...back.map(([y, z]): Point => [x1, y, z])]),
    side: polygon([...profile.map(([y, z]): Point => [x1, y, z]), ...back.map(([y, z]): Point => [x1, y, z - STRAP.t])]),
  };
}
const FAR_STRAP = strap(0, FAR);
const NEAR_STRAP = strap(CASE.d, NEAR);
// The pointed tail of the near half
const TAIL = {
  top: polygon([[STRAP.x, NEAR, STRAP.t], [STRAP.x + STRAP.w, NEAR, STRAP.t], [STRAP.x + STRAP.w - TIP, NEAR + TIP, STRAP.t], [STRAP.x + TIP, NEAR + TIP, STRAP.t]]),
  end: polygon([[STRAP.x + TIP, NEAR + TIP, STRAP.t], [STRAP.x + STRAP.w - TIP, NEAR + TIP, STRAP.t], [STRAP.x + STRAP.w - TIP, NEAR + TIP, 0], [STRAP.x + TIP, NEAR + TIP, 0]]),
  bevel: polygon([[STRAP.x + STRAP.w, NEAR, STRAP.t], [STRAP.x + STRAP.w - TIP, NEAR + TIP, STRAP.t], [STRAP.x + STRAP.w - TIP, NEAR + TIP, 0], [STRAP.x + STRAP.w, NEAR, 0]]),
};
const CENTER = { x: CASE.w / 2, y: CASE.d / 2 };
const STEPS = 24;
// Radius and how many of the 24 steps each ring closes
const RINGS = [
  { r: 15, filled: 20 },
  { r: 10.5, filled: 15 },
  { r: 6, filled: 22 },
];
const HOLES = [CASE.d + 20, CASE.d + 26, CASE.d + 32];

const arc = (r: number, index: number) => {
  const from = ((-90 + (index * 360) / STEPS) * Math.PI) / 180;
  const to = ((-90 + ((index + 1) * 360) / STEPS) * Math.PI) / 180;
  const p = (a: number) => `${(CENTER.x + r * Math.cos(a)).toFixed(2)} ${(CENTER.y + r * Math.sin(a)).toFixed(2)}`;
  return `M${p(from - 0.01)} A${r} ${r} 0 0 1 ${p(to + 0.01)}`;
};

const STYLES = `
${Array.from({ length: STEPS }, (_, index) => {
  const at = 10 + index * 2;
  return `@keyframes isometric106-s${index} { 0%, ${at}% { opacity: 0; } ${at + 2}%, 84% { opacity: 1; } 92%, 100% { opacity: 0; } }
.isometric106-s${index} { animation: isometric106-s${index} 5.4s linear infinite; }`;
}).join("\n")}
.isometric106-still * { animation: none !important; }
.isometric106-still .isometric106-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric106-ring * { animation: none !important; } .isometric106-rest { opacity: 1; } }
`;

export function Isometric106({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric106Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const glass = palette === "dark" ? "fill-black/40" : palette === "tone" ? "fill-black/20" : body.ink;
  const ring = paint.accent.base.replace("fill-", "stroke-");
  const strapFaces = (faces: ReturnType<typeof strap>) => (
    <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={faces.side} className={body.base} />
      <polygon points={faces.side} className={body.right} stroke="none" />
      <polygon points={faces.top} className={body.base} />
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric106-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-90 -36 172 112" aria-hidden="true" className="size-full overflow-visible">
        {/* Buckle frame at the end of the far half; its near bar is laid over the strap below */}
        <Block faces={box(STRAP.x - 3, FAR - 9, 1, STRAP.w + 6, 3, 4)} paint={body} />
        <Block faces={box(STRAP.x - 3, FAR - 6, 1, 3, 7, 4)} paint={body} />
        <Block faces={box(STRAP.x + STRAP.w, FAR - 6, 1, 3, 7, 4)} paint={body} />
        <Block faces={box(CENTER.x - 1.5, FAR - 8, 3, 3, 9, 2)} paint={body} />
        {strapFaces(FAR_STRAP)}
        <Block faces={box(STRAP.x - 3, FAR + 1, 2, STRAP.w + 6, 3, 4)} paint={body} />
        {[STRAP.x - LUG, STRAP.x + STRAP.w].map((x) => (
          <Block key={x} faces={box(x, -LUG, 3, LUG, LUG + 2, STRAP.lug - 2)} paint={body} />
        ))}
        <RoundBlock shape={roundBox(0, 0, 0, CASE.w, CASE.d, CASE.h, CASE.r)} paint={body} />
        <Block faces={box(CASE.w, 18, 4, 3, 9, 6)} paint={body} />
        <Block faces={box(CASE.w - 1, 32, 5, 2, 7, 4)} paint={body} />
        {[STRAP.x - LUG, STRAP.x + STRAP.w].map((x) => (
          <Block key={x} faces={box(x, CASE.d - 2, 3, LUG, LUG + 2, STRAP.lug - 2)} paint={body} />
        ))}
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={TAIL.end} className={body.base} />
          <polygon points={TAIL.end} className={body.left} stroke="none" />
          <polygon points={TAIL.bevel} className={body.base} />
          <polygon points={TAIL.bevel} className={body.right} stroke="none" />
          <polygon points={TAIL.top} className={body.base} />
        </g>
        {strapFaces(NEAR_STRAP)}
        <g transform={onTop(STRAP.t)} className={body.ink}>
          {HOLES.map((y) => (
            <circle key={y} cx={CENTER.x} cy={y} r={1.8} />
          ))}
        </g>
        <g transform={onTop(CASE.h)}>
          <rect x={3} y={3} width={CASE.w - 6} height={CASE.d - 6} rx={CASE.r - 3} className={glass} />
          <g fill="none" strokeWidth={3.2}>
            {RINGS.map((item) => (
              <circle key={item.r} cx={CENTER.x} cy={CENTER.y} r={item.r} className={cn(ring, "opacity-20")} />
            ))}
          </g>
          <g fill="none" strokeWidth={3.2} className="isometric106-ring">
            {RINGS.map((item) =>
              Array.from({ length: item.filled }, (_, index) => (
                <path key={`${item.r}-${index}`} d={arc(item.r, index)} className={cn(`isometric106-s${index}`, "isometric106-rest opacity-0", ring)} />
              )),
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
