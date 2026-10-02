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

interface Isometric110Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the parcel dropping into the basket with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric110Demo: Isometric110Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

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

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;

/** An upright cylinder centered on the origin in plan, shaded in two halves like a box. */
function Cylinder({ r, z, h, paint }: { r: number; z: number; h: number; paint: Paint }) {
  const rx = r * ELLIPSE_X;
  const ry = r * ELLIPSE_Y;
  const top = -z - h;
  const bottom = -z;
  const left = `M${-rx} ${top} L${-rx} ${bottom} A${rx} ${ry} 0 0 0 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 1 ${-rx} ${top} Z`;
  const right = `M${rx} ${top} L${rx} ${bottom} A${rx} ${ry} 0 0 1 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 0 ${rx} ${top} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      <ellipse cx={0} cy={top} rx={rx} ry={ry} className={paint.base} />
    </g>
  );
}

const G = 8;
const FLOOR = box(-12, 4, 0, 136, 56, G);
// Basket: narrow at the bottom, wider and longer at the open top, with the push end leaning back
const ZB = 34;
const ZT = 62;
const LOW = { x0: 36, x1: 88, y0: 17, y1: 45 };
const TOP = { x0: 27, x1: 94, y0: 14, y1: 48 };
const mid = (a: Point, b: Point, t: number): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
/** A wire wall between a bottom edge and a top edge: the panel, its upright and level wires, and its rim. */
function wall(low: [Point, Point], top: [Point, Point], columns: number) {
  const uprights = Array.from({ length: columns + 1 }, (_, k) => polygon([mid(low[0], low[1], k / columns), mid(top[0], top[1], k / columns)]));
  const levels = [0.33, 0.66].map((t) => polygon([mid(low[0], top[0], t), mid(low[1], top[1], t)]));
  return { panel: polygon([low[0], low[1], top[1], top[0]]), wires: [...uprights, ...levels], rim: polygon(top), foot: polygon(low) };
}
type Wall = ReturnType<typeof wall>;
const corner = (edge: typeof LOW, x: "x0" | "x1", y: "y0" | "y1", z: number): Point => [edge[x], edge[y], z];
const side = (y: "y0" | "y1", columns: number) => wall([corner(LOW, "x0", y, ZB), corner(LOW, "x1", y, ZB)], [corner(TOP, "x0", y, ZT), corner(TOP, "x1", y, ZT)], columns);
const end = (x: "x0" | "x1", columns: number) => wall([corner(LOW, x, "y0", ZB), corner(LOW, x, "y1", ZB)], [corner(TOP, x, "y0", ZT), corner(TOP, x, "y1", ZT)], columns);
// The far walls carry fewer wires so the mesh does not turn into a hatch behind the near ones
const FAR_SIDE = side("y0", 4);
const NEAR_SIDE = side("y1", 8);
const PUSH_END = end("x0", 2);
const FRONT_END = end("x1", 4);
const BED = polygon([corner(LOW, "x0", "y0", ZB), corner(LOW, "x1", "y0", ZB), corner(LOW, "x1", "y1", ZB), corner(LOW, "x0", "y1", ZB)]);
const BED_WIRES = [0.2, 0.4, 0.6, 0.8].map((t) => polygon([[LOW.x0 + (LOW.x1 - LOW.x0) * t, LOW.y0, ZB], [LOW.x0 + (LOW.x1 - LOW.x0) * t, LOW.y1, ZB]]));
// The child seat flap covers the upper part of the push end
const FLAP = polygon([mid(corner(LOW, "x0", "y0", ZB), corner(TOP, "x0", "y0", ZT), 0.45), mid(corner(LOW, "x0", "y1", ZB), corner(TOP, "x0", "y1", ZT), 0.45), corner(TOP, "x0", "y1", ZT), corner(TOP, "x0", "y0", ZT)]);
const RACK = 18;
const WHEELS = [40, 86];
const WHEEL_Y = [LOW.y0 + 1, LOW.y1 - 2] as const;
const R = 5;
const PARCEL = { x: 46, y: 23, w: 18, d: 14, h: 20 };
const TIN = { x: 76, y: 30, r: 6, h: 18 };
const DROP = 52;
const ROLL = 24;
const shift = (dx: number) => `translate(${(dx * C).toFixed(1)}px, ${(dx * S).toFixed(1)}px)`;
const TURN = Math.round((ROLL / R) * (180 / Math.PI));
const WIRE: Record<Palette, { thin: string; rim: string; panel: string }> = {
  theme: { thin: "stroke-foreground/20", rim: "stroke-foreground/30", panel: "fill-foreground/5" },
  light: { thin: "stroke-zinc-950/20", rim: "stroke-zinc-950/30", panel: "fill-zinc-950/5" },
  dark: { thin: "stroke-white/20", rim: "stroke-white/40", panel: "fill-white/5" },
  tone: { thin: "stroke-white/50", rim: "stroke-white/70", panel: "fill-white/10" },
};

const drop = (name: string, from: number) =>
  `@keyframes isometric110-${name} { 0%, ${from}% { transform: translateY(-${DROP}px); opacity: 0; } ${from + 3}% { opacity: 1; } ${from + 10}% { transform: translateY(0); } ${from + 13}% { transform: translateY(-4px); } ${from + 16}%, 96% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(0); opacity: 0; } }`;
const STYLES = `
@keyframes isometric110-roll { 0% { transform: ${shift(-ROLL)}; opacity: 0; } 8% { opacity: 1; } 22%, 78% { transform: translate(0, 0); opacity: 1; } 92% { opacity: 1; } 100% { transform: ${shift(ROLL)}; opacity: 0; } }
@keyframes isometric110-spin { 0% { transform: rotate(-${TURN}deg); } 22%, 78% { transform: rotate(0deg); } 100% { transform: rotate(${TURN}deg); } }
${drop("parcel", 26)}
${drop("tin", 36)}
.isometric110-cart { animation: isometric110-roll 6s cubic-bezier(0.45, 0, 0.55, 1) infinite; will-change: transform, opacity; }
.isometric110-wheel { transform-box: fill-box; transform-origin: center; animation: isometric110-spin 6s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.isometric110-parcel { animation: isometric110-parcel 6s cubic-bezier(0.5, 0, 0.5, 1) infinite; }
.isometric110-tin { animation: isometric110-tin 6s cubic-bezier(0.5, 0, 0.5, 1) infinite; }
.isometric110-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric110-cart, .isometric110-wheel, .isometric110-parcel, .isometric110-tin { animation: none; } }
`;

function Caster({ x, y, paint }: { x: number; y: number; paint: Paint }) {
  return (
    <g>
      <Block faces={box(x - 1, y - 1, G + R, 3, 3, RACK - G - R)} paint={paint} />
      <g transform={onLeft(y + 2)}>
        <g className="isometric110-wheel">
          <circle cx={x} cy={-(G + R)} r={R} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(paint.base, paint.edge)} />
          <circle cx={x} cy={-(G + R)} r={2} className={paint.ink} />
          <rect x={x - 0.75} y={-(G + R + 4)} width={1.5} height={2} className={paint.ink} />
        </g>
      </g>
    </g>
  );
}

function Wires({ shape, wire }: { shape: Wall; wire: (typeof WIRE)[Palette] }) {
  return (
    <g fill="none" strokeLinecap="round">
      <polygon points={shape.panel} stroke="none" className={wire.panel} />
      {shape.wires.map((points) => (
        <polyline key={points} points={points} strokeWidth={1} className={wire.thin} />
      ))}
      <polyline points={shape.foot} strokeWidth={1.5} className={wire.rim} />
      <polyline points={shape.rim} strokeWidth={2.5} className={wire.rim} />
    </g>
  );
}

export function Isometric110({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric110Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const wire = WIRE[palette];
  const post = (x: number, y: number) => <Block key={`${x}-${y}`} faces={box(x, y, RACK + 2, 2, 2, ZB - RACK - 2)} paint={body} />;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric110-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-66 -72 174 168" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={FLOOR} paint={body} />
        <g className="isometric110-cart">
          {WHEELS.map((x) => (
            <Caster key={x} x={x} y={WHEEL_Y[0]} paint={body} />
          ))}
          <Block faces={box(LOW.x0, LOW.y0, RACK, LOW.x1 - LOW.x0 + 2, LOW.y1 - LOW.y0, 2)} paint={body} />
          {[LOW.x0, LOW.x1 - 2].map((x) => post(x, LOW.y0))}
          {/* Push handle: two arms off the top rim and a round bar across */}
          <Block faces={box(TOP.x0 - 9, TOP.y0 + 1, ZT, 10, 2, 2)} paint={body} />
          <RodBlock shape={rod("y", TOP.y0 - 2, TOP.y1 + 2, TOP.x0 - 9, ZT + 3, 2.5)} paint={body} />
          <Block faces={box(TOP.x0 - 9, TOP.y1 - 3, ZT, 10, 2, 2)} paint={body} />
          <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
            <polygon points={BED} className={body.base} />
            <polygon points={BED} className={body.left} stroke="none" />
          </g>
          {BED_WIRES.map((points) => (
            <polyline key={points} points={points} fill="none" strokeWidth={1} className={wire.thin} />
          ))}
          <Wires shape={FAR_SIDE} wire={wire} />
          <Wires shape={PUSH_END} wire={wire} />
          <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
            <polygon points={FLAP} className={body.base} />
            <polygon points={FLAP} className={body.right} stroke="none" />
          </g>
          <g className="isometric110-tin">
            <g transform={`translate(${project([TIN.x, TIN.y, 0])})`}>
              <Cylinder r={TIN.r} z={ZB} h={TIN.h} paint={body} />
              <Cylinder r={TIN.r - 1} z={ZB + TIN.h} h={1.5} paint={body} />
            </g>
          </g>
          <g className="isometric110-parcel">
            <Block faces={box(PARCEL.x, PARCEL.y, ZB, PARCEL.w, PARCEL.d, PARCEL.h)} paint={paint.accent} />
            <g transform={onLeft(PARCEL.y + PARCEL.d)} className={paint.accent.ink}>
              <rect x={PARCEL.x + PARCEL.w / 2 - 2} y={-(ZB + PARCEL.h)} width={4} height={PARCEL.h} />
            </g>
            <g transform={onTop(ZB + PARCEL.h)} className={paint.accent.ink}>
              <rect x={PARCEL.x + PARCEL.w / 2 - 2} y={PARCEL.y} width={4} height={PARCEL.d} />
            </g>
          </g>
          {[LOW.x0, LOW.x1 - 2].map((x) => post(x, LOW.y1 - 2))}
          <Wires shape={NEAR_SIDE} wire={wire} />
          <Wires shape={FRONT_END} wire={wire} />
          {WHEELS.map((x) => (
            <Caster key={x} x={x} y={WHEEL_Y[1]} paint={body} />
          ))}
        </g>
      </svg>
    </div>
  );
}
