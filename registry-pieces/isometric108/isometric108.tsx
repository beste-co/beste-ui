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

interface Isometric108Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Pour the sand in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric108Demo: Isometric108Props = {
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

const PLATE = 6;
const SEAT = 4;
const TOP = 102;
const PLATE_R = 26;
const MID = (PLATE + TOP) / 2;
const HALF = (TOP - PLATE) / 2 - SEAT;
const FLOOR = MID - HALF;
const NECK_R = 1.6;
const BULB_R = 16;
const END_R = 11;
// A circle of radius r lying flat shows as an ellipse this wide and this tall
const WIDE = Math.SQRT2 * C;
const TALL = Math.SQRT2 * S;
/** Radius of the glass at height z: a narrow neck that swells into a bulb and closes a little at each end. */
function radius(z: number) {
  const t = Math.min(1, Math.abs(z - MID) / HALF);
  if (t <= 0.62) return NECK_R + (BULB_R - NECK_R) * Math.sin((Math.PI / 2) * (t / 0.62));
  return BULB_R - ((BULB_R - END_R) * (1 - Math.cos((Math.PI * (t - 0.62)) / 0.38))) / 2;
}
const n = (value: number) => value.toFixed(1);
/** The outline of the glass between two heights, closed with the rim ellipse at each end. */
function outline(from: number, to: number) {
  const heights = Array.from({ length: 33 }, (_, index) => from + ((to - from) * index) / 32);
  const right = heights.map((z) => `${n(WIDE * radius(z))} ${n(-z)}`);
  const left = [...heights].reverse().map((z) => `${n(-WIDE * radius(z))} ${n(-z)}`);
  const cap = (z: number, sweep: number) => `A${n(WIDE * radius(z))} ${n(TALL * radius(z))} 0 0 ${sweep} `;
  return `M${right.join(" L")} ${cap(to, 0)}${left[0]} L${left.slice(1).join(" L")} ${cap(from, 0)}${right[0]} Z`;
}
const UPPER_GLASS = outline(MID, MID + HALF);
const LOWER_GLASS = outline(FLOOR, MID);
// Sand volume below a level, so what leaves the top bulb is what piles up in the bottom one
const STEP = 0.25;
const volume = (from: number, to: number) => {
  let sum = 0;
  for (let z = from; z < to; z += STEP) sum += radius(z + STEP / 2) ** 2 * STEP;
  return sum;
};
const levelFor = (from: number, target: number) => {
  let z = from;
  for (let sum = 0; sum < target && z < MID + HALF; z += STEP) sum += radius(z + STEP / 2) ** 2 * STEP;
  return z;
};
const FULL = volume(MID, MID + HALF * 0.7);
/** Where both sand surfaces stand once a share of the sand has run through. */
function levels(share: number) {
  const upper = levelFor(MID, FULL * (1 - share));
  const lower = levelFor(FLOOR, FULL * share);
  return { upper, lower, upperScale: radius(upper) / BULB_R, lowerScale: radius(lower) / BULB_R };
}
const RUN = 62;
const SHARES = Array.from({ length: 13 }, (_, index) => index / 12);
const body = (z: number) => `translateY(${n(-z)}px)`;
const surface = (z: number, scale: number) => `translateY(${n(-z)}px) scale(${scale.toFixed(3)})`;
type Part = "upper" | "upper-top" | "lower" | "lower-top";
const pose = (part: Part, share: number) => {
  const at = levels(share);
  if (part === "upper") return body(at.upper);
  if (part === "lower") return body(at.lower);
  return part === "upper-top" ? surface(at.upper, at.upperScale) : surface(at.lower, at.lowerScale);
};
const frames = (part: Part) =>
  `@keyframes isometric108-${part} { ${SHARES.map((share) => `${(share * RUN).toFixed(1)}% { transform: ${pose(part, share)}; }`).join(" ")} 88% { transform: ${pose(part, 1)}; } 88.01%, 100% { transform: ${pose(part, 0)}; } }
.isometric108-${part} { animation: isometric108-${part} 7s linear infinite; }`;
const PARTS: Part[] = ["upper", "upper-top", "lower", "lower-top"];
// The pose shown when nothing moves: a little under half of the sand has run through
const REST = Object.fromEntries(PARTS.map((part) => [part, pose(part, 0.45).replace(/px/g, "").replace("translateY(", "translate(0 ")])) as Record<Part, string>;
const POST_R = 1.8;
// Plan angles of the three posts: one behind the glass, two in front of it
const POSTS = [225, 105, -15].map((angle) => {
  const radians = (angle * Math.PI) / 180;
  return { angle, x: 21 * Math.cos(radians), y: 21 * Math.sin(radians) };
});
const SHINE = `M${n(-WIDE * radius(MID + HALF * 0.8) * 0.7)} ${n(-(MID + HALF * 0.8))} Q${n(-WIDE * BULB_R * 0.82)} ${n(-(MID + HALF * 0.55))} ${n(-WIDE * radius(MID + HALF * 0.3) * 0.7)} ${n(-(MID + HALF * 0.3))}`;
const STYLES = `
${PARTS.map(frames).join("\n")}
@keyframes isometric108-stream { 0%, 1% { opacity: 0; } 3%, ${RUN - 3}% { opacity: 1; } ${RUN}%, 100% { opacity: 0; } }
@keyframes isometric108-sand { 0%, 82% { opacity: 1; } 87.9%, 88.1% { opacity: 0; } 96%, 100% { opacity: 1; } }
.isometric108-stream { animation: isometric108-stream 7s linear infinite; }
.isometric108-sand { animation: isometric108-sand 7s linear infinite; }
.isometric108-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric108-sand, .isometric108-sand * { animation: none !important; } }
`;

export function Isometric108({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric108Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const id = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const sand = accent ? paint.accent.base : body.ink;
  const dusk = accent ? paint.accent.left : undefined;
  const lit = accent ? paint.accent.ink : undefined;
  const shine = palette === "dark" ? "stroke-white/20" : "stroke-white/60";
  const post = (item: (typeof POSTS)[number]) => (
    <g key={item.angle}>
      <RoundBlock shape={cylinder(item.x, item.y, PLATE, 3, 3.2)} paint={body} />
      <RoundBlock shape={cylinder(item.x, item.y, PLATE + 3, TOP - PLATE - 6, POST_R)} paint={body} />
      <RoundBlock shape={cylinder(item.x, item.y, TOP - 3, 3, 3.2)} paint={body} />
    </g>
  );
  const [back, ...front] = POSTS;
  /** One bulb's sand: the body below the level and the round surface on top of it. */
  const fill = (half: "upper" | "lower") => (
    <g clipPath={`url(#${id}-${half})`}>
      {half === "lower" && <rect x={-0.8} y={-MID} width={1.6} height={MID - FLOOR} className={cn("isometric108-stream", sand)} />}
      <g className={`isometric108-${half}`} transform={REST[half]}>
        <rect x={-30} y={0} width={60} height={60} className={sand} />
        {dusk && <rect x={0} y={0} width={30} height={60} className={dusk} />}
      </g>
      <g className={`isometric108-${half}-top`} transform={REST[`${half}-top`]}>
        <ellipse rx={WIDE * BULB_R} ry={TALL * BULB_R} className={sand} />
        {lit && <ellipse rx={WIDE * BULB_R} ry={TALL * BULB_R} className={lit} />}
        {lit && half === "lower" && <ellipse cy={-1.5} rx={WIDE * BULB_R * 0.35} ry={TALL * BULB_R * 0.35} className={lit} />}
      </g>
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric108-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-48 -140 96 164" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={`${id}-upper`}>
            <path d={UPPER_GLASS} />
          </clipPath>
          <clipPath id={`${id}-lower`}>
            <path d={LOWER_GLASS} />
          </clipPath>
        </defs>
        <RoundBlock shape={cylinder(0, 0, 0, PLATE, PLATE_R)} paint={body} />
        <RoundBlock shape={cylinder(0, 0, PLATE, SEAT, END_R + 2)} paint={body} />
        {back && post(back)}
        {/* The glass is only a tint, so the far post shows through it */}
        <path d={LOWER_GLASS} className={body.left} />
        <path d={UPPER_GLASS} className={body.left} />
        <g className="isometric108-sand">
          {fill("lower")}
          {fill("upper")}
        </g>
        <g fill="none" strokeWidth={1} strokeLinejoin="round" className={body.edge}>
          <path d={LOWER_GLASS} />
          <path d={UPPER_GLASS} />
        </g>
        <path d={SHINE} fill="none" strokeWidth={2.5} strokeLinecap="round" className={shine} />
        <RoundBlock shape={cylinder(0, 0, TOP - SEAT, SEAT, END_R + 2)} paint={body} />
        <RoundBlock shape={cylinder(0, 0, TOP, PLATE, PLATE_R)} paint={body} />
        {front.map(post)}
        <g transform={onTop(TOP + PLATE)} className={body.ink}>
          <path d="M-20 0 A20 20 0 1 0 20 0 A20 20 0 1 0 -20 0 Z M-17 0 A17 17 0 1 1 17 0 A17 17 0 1 1 -17 0 Z" fillRule="evenodd" />
        </g>
      </svg>
    </div>
  );
}
