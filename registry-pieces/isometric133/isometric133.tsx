"use client";

import { useId } from "react";
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

interface Isometric133Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the flowers and the water with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric133Demo: Isometric133Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const BASE = 6;
const BED = { x: 48, y: 12, w: 52, d: 44, h: 16 };
const RIM = 3;
const SOIL = BASE + BED.h;
const FLOWERS: [number, number][] = [
  [64, 22],
  [80, 22],
  [56, 34],
  [72, 34],
  [88, 34],
  [64, 46],
  [80, 46],
];
const CAN = { x: 18, y: 34, r: 12, h: 24 };
const CZ = BASE;
const TILT = 26;
// The can is lifted a little as it tips, so the rose clears the flowers
const LIFT = 14;
const GROW = 20;


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

type Rod = ReturnType<typeof rod>;

/** A round rod lying along x or y from a to b, centered on (u, z) in the other two axes. */
function rod(axis: "x" | "y", a: number, b: number, u: number, z: number, r: number) {
  const at = (t: number, degrees: number): Point => {
    const angle = (degrees * Math.PI) / 180;
    const du = r * Math.cos(angle);
    const dz = r * Math.sin(angle);
    return axis === "x" ? [t, u + du, z + dz] : [u + du, t, z + dz];
  };
  const arc = (t: number, from: number, to: number) => Array.from({ length: 13 }, (_, k) => at(t, from + ((to - from) * k) / 12));
  const band = (from: number, to: number) => polygon([...arc(a, from, to), ...arc(b, from, to).reverse()]);
  return { axis, side: band(-45, 135), shade: band(-45, 45), cap: polygon(Array.from({ length: 36 }, (_, k) => at(b, k * 10))) };
}

function RodBlock({ shape, paint }: { shape: Rod; paint: Paint }) {
  const along = shape.axis === "y";
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.shade} className={along ? paint.right : paint.left} stroke="none" />
      <polygon points={shape.cap} className={paint.base} />
      <polygon points={shape.cap} className={along ? paint.left : paint.right} stroke="none" />
    </g>
  );
}

/** An upright cylinder standing on plan point (cx, cy). */
const cylinder = (cx: number, cy: number, z: number, h: number, r: number) => roundBox(cx - r, cy - r, z, 2 * r, 2 * r, h, r);

const STEM = 12;
/** One ring of petals around the flower head, in screen units: each petal runs from the center out to its tip. */
function ring(count: number, turn: number, reach: number, rise: number, width: number, inner: boolean) {
  return Array.from({ length: count }, (_, k) => {
    const angle = ((k * 360) / count + turn) * (Math.PI / 180);
    const base = { x: 1.2 * Math.cos(angle), y: 0.7 * Math.sin(angle) - (inner ? 1 : 0) };
    const tip = { x: reach * Math.cos(angle), y: reach * 0.56 * Math.sin(angle) - rise };
    const length = Math.hypot(tip.x - base.x, tip.y - base.y);
    const aim = (Math.atan2(tip.y - base.y, tip.x - base.x) * 180) / Math.PI;
    const d = `M0 0C${(length * 0.25).toFixed(1)} ${-width} ${(length * 0.85).toFixed(1)} ${-width} ${length.toFixed(1)} 0C${(length * 0.85).toFixed(1)} ${width} ${(length * 0.25).toFixed(1)} ${width} 0 0Z`;
    return { key: `${inner ? "i" : "o"}${k}`, transform: `translate(${base.x.toFixed(1)} ${base.y.toFixed(1)}) rotate(${aim.toFixed(1)})`, d, depth: Math.sin(angle), side: Math.cos(angle), inner };
  });
}
type Petal = ReturnType<typeof ring>[number];
const HEAD = [...ring(6, 15, 8.5, 2, 3.4, false), ...ring(5, 0, 3.4, 5.5, 2.4, true)];
const rank = (petal: Petal) => (petal.depth < 0 ? (petal.inner ? 1 : 0) : petal.inner ? 2 : 3) + petal.depth / 10;
const BACK = HEAD.filter((petal) => petal.depth < 0).sort((p, q) => rank(p) - rank(q));
const FRONT = HEAD.filter((petal) => petal.depth >= 0).sort((p, q) => rank(p) - rank(q));

/** A cupped flower head: the far petals, the heart, then the near petals over it. */
function Bloom({ paint }: { paint: Paint }) {
  const petal = (item: Petal) => (
    <g key={item.key} transform={item.transform}>
      <path d={item.d} className={paint.base} />
      {item.inner ? <path d={item.d} stroke="none" className={paint.ink} /> : item.side > 0.3 && <path d={item.d} stroke="none" className={paint.left} />}
    </g>
  );
  return (
    <g strokeWidth={0.5} strokeLinejoin="round" className="stroke-black/20">
      {BACK.map(petal)}
      <ellipse cx={0} cy={-2.5} rx={2.4} ry={1.6} stroke="none" className={paint.base} />
      <ellipse cx={0} cy={-2.5} rx={2.4} ry={1.6} stroke="none" className={paint.right} />
      {FRONT.map(petal)}
    </g>
  );
}
const at = (point: Point) => project(point).split(",").map(Number) as [number, number];

// The can is cut into upright slices across its depth; every slice tips in its own plane about the base edge nearest the bed
const PIVOT = { x: CAN.x + CAN.r, z: CZ };
const FINE = Array.from({ length: 4 * CAN.r + 1 }, (_, index) => index / 2 - CAN.r);
const half = (radius: number, offset: number) => Math.sqrt(Math.max(0, radius ** 2 - offset ** 2));
// Spout, rose and handle live in the middle slices, drawn in (x, -z) units from the pivot
const ROOT = { x: -3, y: -5 };
const TIP = { x: 22, y: -38 };
const REACH = Math.hypot(TIP.x - ROOT.x, TIP.y - ROOT.y);
const AXIS = { x: (TIP.x - ROOT.x) / REACH, y: (TIP.y - ROOT.y) / REACH };
const ACROSS = { x: -AXIS.y, y: AXIS.x };
const ROSE = { r: 5.5, deep: 3.5 };
const MIDDLE = 1.5;
const quad = (from: { x: number; y: number }, length: number, width: number) =>
  [
    [from.x + ACROSS.x * width, from.y + ACROSS.y * width],
    [from.x + AXIS.x * length + ACROSS.x * width, from.y + AXIS.y * length + ACROSS.y * width],
    [from.x + AXIS.x * length - ACROSS.x * width, from.y + AXIS.y * length - ACROSS.y * width],
    [from.x - ACROSS.x * width, from.y - ACROSS.y * width],
  ]
    .map(([x = 0, y = 0]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
const SPOUT = quad(ROOT, REACH, 2);
const HANDLE = `M${-2 * CAN.r} ${-CAN.h + 2}C${-2 * CAN.r - 14} ${-CAN.h} ${-2 * CAN.r - 14} -2 ${-2 * CAN.r} -4V-7.5C${-2 * CAN.r - 9} -6.5 ${-2 * CAN.r - 9} ${-CAN.h + 4.5} ${-2 * CAN.r} ${-CAN.h + 5.5}Z`;
// Where the face of the rose ends up once the can is lifted and tipped, and how far the water falls from there
const POUR = (() => {
  const face = { x: TIP.x + AXIS.x * ROSE.deep, y: TIP.y + AXIS.y * ROSE.deep };
  const angle = (TILT * Math.PI) / 180;
  return { x: PIVOT.x + face.x * Math.cos(angle) - face.y * Math.sin(angle), z: PIVOT.z - (face.x * Math.sin(angle) + face.y * Math.cos(angle)) + LIFT };
})();
const FALL = Math.round(POUR.z - SOIL - 6);

const STYLES = `
@keyframes isometric133-tilt { 0%, 10% { transform: translateY(0) rotate(0deg); } 22%, 64% { transform: translateY(${-LIFT}px) rotate(${TILT}deg); } 76%, 100% { transform: translateY(0) rotate(0deg); } }
@keyframes isometric133-drop { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateY(${FALL}px); opacity: 0; } }
@keyframes isometric133-pour { 0%, 22% { opacity: 0; } 24%, 62% { opacity: 1; } 64%, 100% { opacity: 0; } }
@keyframes isometric133-grow { 0%, 28% { transform: translateY(${GROW}px); } 46%, 84% { transform: translateY(0); } 96%, 100% { transform: translateY(${GROW}px); } }
.isometric133-can { transform-box: view-box; transform-origin: 0 0; animation: isometric133-tilt 6s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.isometric133-pour { animation: isometric133-pour 6s linear infinite; }
.isometric133-drop { animation: isometric133-drop 0.6s linear infinite; }
.isometric133-grow { animation: isometric133-grow 6s cubic-bezier(0.34, 1.4, 0.64, 1) infinite; }
.isometric133-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric133-can, .isometric133-pour, .isometric133-drop, .isometric133-grow { animation: none; } }
`;

/** One slice of the can: its outline, its fill, or the dark opening and the face of the rose. */
function CanSlice({ offset, paint, pass }: { offset: number; paint: Paint; pass: "outline" | "fill" | "open" }) {
  const wide = half(CAN.r, offset);
  const rose = Math.abs(offset) < ROSE.r ? half(ROSE.r, offset) : 0;
  const middle = Math.abs(offset) <= MIDDLE;
  const shade = offset > 4 ? paint.left : paint.right;
  const body = { x: -CAN.r - wide, y: -CAN.h, width: 2 * wide, height: CAN.h };
  const head = rose > 0 ? quad(TIP, ROSE.deep, rose) : "";
  return (
    <g transform={onLeft(CAN.y + offset)}>
      <g transform={`translate(${PIVOT.x} ${-PIVOT.z})`}>
        <g className="isometric133-can">
          {pass === "outline" && (
            <g fill="none" strokeWidth={1.5} strokeLinejoin="round" className={paint.edge}>
              {middle && <path d={HANDLE} />}
              {wide > 0 && <rect {...body} />}
              {middle && <polygon points={SPOUT} />}
              {head && <polygon points={head} />}
            </g>
          )}
          {pass === "fill" && (
            <>
              {middle && <path d={HANDLE} className={paint.base} />}
              {middle && <path d={HANDLE} className={offset === MIDDLE ? paint.left : paint.right} />}
              {wide > 0 && <rect {...body} className={paint.base} />}
              {wide > 0 && <rect {...body} className={shade} />}
              {middle && <polygon points={SPOUT} className={paint.base} />}
              {middle && <polygon points={SPOUT} className={offset === MIDDLE ? paint.left : paint.right} />}
              {head && <polygon points={head} className={paint.base} />}
              {head && <polygon points={head} className={offset > 2 ? paint.left : paint.right} />}
            </>
          )}
          {pass === "open" && (
            <>
              {Math.abs(offset) < CAN.r - 2.5 && <rect x={-CAN.r - half(CAN.r - 2.5, offset)} y={-CAN.h - 0.7} width={2 * half(CAN.r - 2.5, offset)} height={1.4} />}
              {rose > 1.5 && <polygon points={quad({ x: TIP.x + AXIS.x * (ROSE.deep - 0.7), y: TIP.y + AXIS.y * (ROSE.deep - 0.7) }, 1.4, rose - 1.5)} />}
            </>
          )}
        </g>
      </g>
    </g>
  );
}

export function Isometric133({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric133Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const bloom = paint.accent;
  const leaf = palette === "dark" ? "fill-zinc-600" : palette === "tone" ? "fill-white/60" : "fill-foreground/20";
  const [dropX, dropY] = at([POUR.x, CAN.y, POUR.z]);
  const dark = cn(body.ink.replace(/\/\d+$/, ""), "opacity-20");

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric133-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-62 -40 160 132" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          {FLOWERS.map(([x, y], index) => (
            <clipPath key={`${x}-${y}`} id={`${clipId}-${index}`}>
              <rect x={-200} y={-200} width={400} height={200 + at([x, y, SOIL])[1]} />
            </clipPath>
          ))}
        </defs>
        <Block faces={box(0, 0, 0, 108, 68, BASE)} paint={body} />
        <Block faces={box(BED.x, BED.y, BASE, BED.w, BED.d, BED.h)} paint={body} />
        <g transform={onTop(SOIL)}>
          <rect x={BED.x + RIM} y={BED.y + RIM} width={BED.w - 2 * RIM} height={BED.d - 2 * RIM} rx={1} className={body.ink} />
        </g>
        <g>
          {FLOWERS.map(([x, y], index) => (
            <g key={`${x}-${y}`} clipPath={`url(#${clipId}-${index})`}>
            <g className="isometric133-grow" style={{ animationDelay: `${index * 0.12}s` }}>
              <Block faces={box(x - 0.75, y - 0.75, SOIL - GROW, 1.5, 1.5, GROW + STEM)} paint={body} />
              <g transform={`translate(${at([x, y, SOIL + 5]).join(" ")})`} className={leaf}>
                <path d="M0 0C2 -3 5 -4 8 -3.5C6 -1 3 0.5 0 0Z" />
                <path d="M0 2C-2 0 -5 -0.5 -7 0.5C-5 2.5 -2.5 3 0 2Z" />
              </g>
              <g transform={`translate(${at([x, y, SOIL + STEM]).join(" ")})`}>
                <Bloom paint={bloom} />
              </g>
            </g>
            </g>
          ))}
        </g>
        {FINE.map((offset) => (
          <CanSlice key={offset} offset={offset} paint={body} pass="outline" />
        ))}
        {FINE.map((offset) => (
          <CanSlice key={offset} offset={offset} paint={body} pass="fill" />
        ))}
        {[body.base, dark].map((fill) => (
          <g key={fill} className={fill}>
            {FINE.map((offset) => (
              <CanSlice key={offset} offset={offset} paint={body} pass="open" />
            ))}
          </g>
        ))}
        <g className="isometric133-pour opacity-0">
          {[-5, -2.5, 0, 2.5, 5].map((offset, index) => (
            <rect key={offset} x={dropX + offset - 0.9} y={dropY + 1 + (index % 2) * 3} width={1.8} height={4.5} rx={0.9} className="isometric133-drop fill-sky-400" style={{ animationDelay: `${index * -0.13}s` }} />
          ))}
        </g>
      </svg>
    </div>
  );
}
