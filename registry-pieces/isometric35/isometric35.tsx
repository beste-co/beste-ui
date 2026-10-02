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

interface Isometric35Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the lifted slice with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric35Demo: Isometric35Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;
const at = (x: number, y: number, z = 0) => `translate(${project([x, y, z]).replace(",", " ")})`;

/** An upright cylinder around (x, y) in plan; r2 sets a different top radius for a taper. */
function Cylinder({ x = 0, y = 0, z, h, r, r2 = r, paint, lid = true }: { x?: number; y?: number; z: number; h: number; r: number; r2?: number; paint: Paint; lid?: boolean }) {
  const [bx, by, tx, ty] = [r * ELLIPSE_X, r * ELLIPSE_Y, r2 * ELLIPSE_X, r2 * ELLIPSE_Y].map((n) => +n.toFixed(2));
  const top = -z - h;
  const bottom = -z;
  const left = `M${-tx} ${top} L${-bx} ${bottom} A${bx} ${by} 0 0 0 0 ${bottom + by} L0 ${top + ty} A${tx} ${ty} 0 0 1 ${-tx} ${top} Z`;
  const right = `M${tx} ${top} L${bx} ${bottom} A${bx} ${by} 0 0 1 0 ${bottom + by} L0 ${top + ty} A${tx} ${ty} 0 0 0 ${tx} ${top} Z`;
  return (
    <g transform={at(x, y)} className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      {lid && <ellipse cx={0} cy={top} rx={tx} ry={ty} className={paint.base} />}
    </g>
  );
}

const SIDE = 88;
const MID = SIDE / 2;
const H = 10;
const RIM = 3;
const PIE_Z = 2;
const PIE_H = 4;
const PIE_TOP = PIE_Z + PIE_H;
const PIE_R = 40;
const CHEESE_R = 33;
const LIFT = 30;
const OUT = 0;
// Lifting up by LIFT and out by OUT toward the viewer nets this screen offset
const RISE = LIFT - OUT;
// The lid is a flat sheet hinged along the back edge (y = 0, z = H); it swings up and leans back
const OPEN = 110;
const THICK = 2;
const PERIOD = 6;
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const unease = (e: number) => (e < 0.5 ? Math.sqrt(e / 2) : 1 - Math.sqrt((1 - e) / 2));
// Opens from 12% to 30%, closes from 82% to 98%, in small even steps with extra stops either side of 45 and 90 degrees
const KS = [...Array.from({ length: 23 }, (_, index) => (index + 1) / 24), ...[44, 46, 89, 91].map((angle) => unease(angle / OPEN))].sort((a, b) => a - b);
const STOPS: [number, number][] = [
  [0, 0],
  [12, 0],
  ...KS.map((k): [number, number] => [12 + k * 18, OPEN * ease(k)]),
  [30, OPEN],
  [82, OPEN],
  ...KS.map((k): [number, number] => [82 + k * 16, OPEN * (1 - ease(k))]),
  [98, 0],
  [100, 0],
];
const n = (value: number) => value.toFixed(4);
/** A number that depends on the lid angle: k + c * cos + s * sin, written for calc(). */
const mix = (k: number, c: number, s: number) => `calc(${n(k)} + ${n(c)} * var(--isometric35-c) + ${n(s)} * var(--isometric35-s))`;
type Axis = "across" | "along" | "out";
// Screen directions of the lid's own axes as [k, cos, sin] parts for x and y
const AXES: Record<Axis, [[number, number, number], [number, number, number]]> = {
  across: [[C, 0, 0], [S, 0, 0]],
  along: [[0, -C, 0], [0, S, -1]],
  out: [[0, 0, C], [0, -1, -S]],
};
/** The matrix of a lid face at (x across, u along, m out) from the hinge on the back edge; it follows cos and sin, so shared edges cannot drift apart. */
function face(x: number, u: number, m: number, a: Axis, b: Axis) {
  const [ax, ay] = AXES[a];
  const [bx, by] = AXES[b];
  return `matrix(${mix(...ax)}, ${mix(...ay)}, ${mix(...bx)}, ${mix(...by)}, ${mix(x * C, -u * C, m * C)}, ${mix(-H + x * S, u * S - m, -u - m * S)})`;
}
const FACES = {
  top: face(0, 0, THICK, "across", "along"),
  under: face(0, 0, 0, "across", "along"),
  end: face(0, SIDE, 0, "across", "out"),
  side: face(SIDE, 0, 0, "along", "out"),
};
const TURN = STOPS.map(([p, a]) => `${p.toFixed(2)}% { --isometric35-c: ${n(Math.cos((a * Math.PI) / 180))}; --isometric35-s: ${n(Math.sin((a * Math.PI) / 180))}; }`).join(" ");
/** Step-end opacity that is on while the lid angle stays inside [from, to); `flip` gives the exact opposite, so a pair never leaves a gap. */
const show = (from: number, to: number, flip = false) => {
  const inside = (a: number) => a >= from && a < to;
  return STOPS.map(([p, a], index) => `${p.toFixed(2)}% { opacity: ${(inside(a) && inside(STOPS[index + 1]?.[1] ?? a)) !== flip ? 1 : 0}; }`).join(" ");
};
const FROM = -30;
const TO = 30;
const polar = (r: number, degrees: number) => [MID + r * Math.cos((degrees * Math.PI) / 180), MID + r * Math.sin((degrees * Math.PI) / 180)];
const wedge = (r: number, from: number, to: number) => {
  const [ax, ay] = polar(r, from);
  const [bx, by] = polar(r, to);
  return `M${MID} ${MID} L${ax.toFixed(2)} ${ay.toFixed(2)} A${r} ${r} 0 0 1 ${bx.toFixed(2)} ${by.toFixed(2)} Z`;
};
const disc = (r: number) => `M${MID - r} ${MID} A${r} ${r} 0 1 0 ${MID + r} ${MID} A${r} ${r} 0 1 0 ${MID - r} ${MID} Z`;
const SLICE = wedge(PIE_R, FROM, TO);
const SLICE_CHEESE = wedge(CHEESE_R, FROM + 2, TO - 2);
const CUTS = [FROM, TO, 90, 150, 210, 270];
const PEPPERONI = [
  [24, 105], [14, 165], [26, 150], [24, 215], [12, 240], [25, 275], [22, 55], [10, 80], [26, 320]
].map(([r, a]) => polar(r, a));
const SLICE_TOPPINGS = [[24, -13], [14, 6], [26, 14]].map(([r, a]) => polar(r, a));
// The empty slot: everything between the pie top and the box floor inside the slice outline
const GAP_BAND = polygon([
  [MID, MID, PIE_TOP],
  ...Array.from({ length: 9 }, (_, k): Point => [...polar(PIE_R, FROM + ((TO - FROM) * k) / 8), PIE_TOP] as Point),
  ...Array.from({ length: 9 }, (_, k): Point => [...polar(PIE_R, TO - ((TO - FROM) * k) / 8), 0] as Point),
  [MID, MID, 0],
]);
const [CX, CY] = polar(PIE_R, FROM);
const CUT_FACE = polygon([[MID, MID, PIE_TOP], [CX, CY, PIE_TOP], [CX, CY, 0], [MID, MID, 0]]);
// Cheese strands hang between the lifted slice and the pie along the slice's two cut edges
const STRANDS = [[6, -6], [12, 8]].map(([r, a]) => {
  const [px, py] = polar(r, a);
  const [sx, sy] = project([px, py, PIE_TOP]).split(",").map(Number);
  return { x: sx, y: sy - RISE, key: `${r}-${a}` };
});

// What stands inside or above the open mouth of the box: the near inner rim edges cut the rest off
const MOUTH_POINTS = [[RIM, SIDE - RIM], [SIDE - RIM, SIDE - RIM], [SIDE - RIM, RIM]].map(([x = 0, y = 0]) => project([x, y, H]).split(",").map(Number) as [number, number]);
const MOUTH = [...MOUTH_POINTS, [MOUTH_POINTS[2]?.[0] ?? 0, -300], [MOUTH_POINTS[0]?.[0] ?? 0, -300]].map(([x, y]) => `${x},${y}`).join(" ");
const STYLES = `
@property --isometric35-c { syntax: "<number>"; inherits: true; initial-value: ${n(Math.cos((OPEN * Math.PI) / 180))}; }
@property --isometric35-s { syntax: "<number>"; inherits: true; initial-value: ${n(Math.sin((OPEN * Math.PI) / 180))}; }
@keyframes isometric35-lid { ${TURN} }
@keyframes isometric35-outside { ${show(0, 45)} }
@keyframes isometric35-inside { ${show(0, 45, true)} }
@keyframes isometric35-front { ${show(0, 90)} }
@keyframes isometric35-behind { ${show(0, 90, true)} }
@keyframes isometric35-pizza { ${show(1, 360)} }
@keyframes isometric35-slice { 0%, 32% { transform: translateY(${RISE}px); } 48%, 70% { transform: translateY(0); } 80%, 100% { transform: translateY(${RISE}px); } }
@keyframes isometric35-cheese { 0%, 33% { transform: scaleY(0); opacity: 1; } 48%, 62% { transform: scaleY(1); opacity: 1; } 66%, 100% { transform: scaleY(1); opacity: 0; } }
.isometric35-cheese { transform-box: fill-box; }
.isometric35-lid { animation: isometric35-lid ${PERIOD}s linear infinite; }
${(Object.keys(FACES) as (keyof typeof FACES)[]).map((name) => `.isometric35-${name} { transform: ${FACES[name]}; }`).join("\n")}
.isometric35-outside { animation: isometric35-outside ${PERIOD}s step-end infinite; }
.isometric35-inside { animation: isometric35-inside ${PERIOD}s step-end infinite; }
.isometric35-front { animation: isometric35-front ${PERIOD}s step-end infinite; }
.isometric35-behind { animation: isometric35-behind ${PERIOD}s step-end infinite; }
.isometric35-pizza { animation: isometric35-pizza ${PERIOD}s step-end infinite; }
.isometric35-slice { animation: isometric35-slice 6s cubic-bezier(0.45, 0, 0.2, 1) infinite; will-change: transform; }
.isometric35-cheese { animation: isometric35-cheese 6s cubic-bezier(0.45, 0, 0.2, 1) infinite; transform-origin: bottom; }
.isometric35-still, .isometric35-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric35-lid, .isometric35-outside, .isometric35-inside, .isometric35-front, .isometric35-behind, .isometric35-pizza, .isometric35-slice, .isometric35-cheese { animation: none; } }
`;

export function Isometric35({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric35Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const slice = paint.accent;
  const outer = box(0, 0, 0, SIDE, SIDE, H);
  const floor = polygon([[RIM, RIM, 0], [SIDE - RIM, RIM, 0], [SIDE - RIM, SIDE - RIM, 0], [RIM, SIDE - RIM, 0]]);
  const innerBack = polygon([[RIM, RIM, H], [SIDE - RIM, RIM, H], [SIDE - RIM, RIM, 0], [RIM, RIM, 0]]);
  const innerSide = polygon([[RIM, RIM, H], [RIM, SIDE - RIM, H], [RIM, SIDE - RIM, 0], [RIM, RIM, 0]]);

  const clipId = useId();
  /** The lid slab; in front of the box it shows its top until it turns past 45 degrees, then its underside. */
  const lid = (front: boolean) => (
    <>
      <g className={cn("isometric35-under", front && "isometric35-inside opacity-0")}>
        <rect width={SIDE} height={SIDE} className={body.base} />
        <rect width={SIDE} height={SIDE} className={body.left} stroke="none" />
      </g>
      <g className="isometric35-end">
        <rect width={SIDE} height={THICK} className={body.base} />
        <rect width={SIDE} height={THICK} className={body.left} stroke="none" />
      </g>
      <g className="isometric35-side">
        <rect width={SIDE} height={THICK} className={body.base} />
        <rect width={SIDE} height={THICK} className={body.right} stroke="none" />
      </g>
      {front && (
        <g className="isometric35-top isometric35-outside">
          <rect width={SIDE} height={SIDE} className={body.base} />
          <circle cx={MID} cy={MID} r={16} className={body.ink} stroke="none" />
        </g>
      )}
    </>
  );
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric35-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -110 186 202" aria-hidden="true" className="isometric35-lid size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={MOUTH} />
          </clipPath>
        </defs>
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          {/* Past upright the lid leans back behind the box, so that copy is drawn first */}
          <g className="isometric35-behind">{lid(false)}</g>
          <polygon points={floor} className={body.base} />
          <polygon points={innerSide} className={body.base} />
          <polygon points={innerSide} className={body.right} stroke="none" />
          <polygon points={innerBack} className={body.base} />
          <polygon points={innerBack} className={body.left} stroke="none" />
        </g>
        <Cylinder x={MID} y={MID} z={PIE_Z} h={PIE_H} r={PIE_R} paint={body} />
        <g transform={onTop(PIE_TOP)}>
          <path d={disc(CHEESE_R)} className={body.ink} />
          {CUTS.map((angle) => (
            <rect key={angle} x={MID} y={MID - 0.6} width={PIE_R} height={1.2} transform={`rotate(${angle} ${MID} ${MID})`} className={body.base} />
          ))}
          {PEPPERONI.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={4.5} strokeWidth={1} className={cn(body.base, body.edge)} />
          ))}
        </g>
        <g className={body.base}>
          <polygon points={GAP_BAND} />
        </g>
        <g transform={onTop(0)} className={body.base}>
          <path d={SLICE} />
        </g>
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={CUT_FACE} className={body.base} />
          <polygon points={CUT_FACE} className={body.left} stroke="none" />
        </g>
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={outer.left} className={body.base} />
          <polygon points={outer.left} className={body.left} stroke="none" />
          <polygon points={outer.right} className={body.base} />
          <polygon points={outer.right} className={body.right} stroke="none" />
          <g transform={onTop(H)} className={body.base}>
            <rect x={0} y={SIDE - RIM} width={SIDE} height={RIM} />
            <rect x={SIDE - RIM} y={0} width={RIM} height={SIDE} />
            <rect x={0} y={0} width={SIDE} height={RIM} />
            <rect x={0} y={0} width={RIM} height={SIDE} />
          </g>
        </g>
        {/* The slice sits in the pie from the moment the lid lifts; the lid, drawn after it, covers whatever it still hides */}
        <g className="isometric35-pizza" clipPath={`url(#${clipId})`}>
          {STRANDS.map(({ x, y, key }) => (
            <path
              key={key}
              d={`M${x - 1.2} ${y} C${x - 0.4} ${y + RISE * 0.35} ${x - 0.4} ${y + RISE * 0.6} ${x - 1.6} ${y + RISE} H${x + 1.6} C${x + 0.4} ${y + RISE * 0.6} ${x + 0.4} ${y + RISE * 0.35} ${x + 1.2} ${y} Z`}
              strokeWidth={0.5}
              className={cn("isometric35-cheese", slice.base, slice.edge)}
            />
          ))}
          <g className="isometric35-slice">
            <g transform={`translate(0 ${OUT})`}>
              <g transform={onTop(PIE_TOP + LIFT - PIE_H)} className={slice.edge} strokeWidth={1} strokeLinejoin="round">
                <path d={SLICE} className={slice.base} />
                <path d={SLICE} className={slice.right} stroke="none" />
              </g>
              <g transform={onTop(PIE_TOP + LIFT)} className={slice.edge} strokeWidth={1} strokeLinejoin="round">
                <path d={SLICE} className={slice.base} />
                <path d={SLICE} className={slice.ink} stroke="none" />
                <path d={SLICE_CHEESE} className={slice.base} stroke="none" />
                {SLICE_TOPPINGS.map(([x, y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r={4.5} className={slice.ink} stroke="none" />
                ))}
              </g>
            </g>
          </g>
        </g>
        <g className={cn("isometric35-front opacity-0", body.edge)} strokeWidth={1} strokeLinejoin="round">
          {lid(true)}
        </g>
      </svg>
    </div>
  );
}
