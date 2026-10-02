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

interface Isometric120Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the cabin with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric120Demo: Isometric120Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const L = 112;
const D = 52;
const HIGH = 36;
const LOW = 8;
const ground = (x: number) => HIGH - ((HIGH - LOW) * x) / L;
const SLOPE_TOP = polygon([[0, 0, HIGH], [L, 0, LOW], [L, D, LOW], [0, D, HIGH]]);
const SLOPE_SIDE = polygon([[0, D, HIGH], [L, D, LOW], [L, D, 0], [0, D, 0]]);
const SLOPE_END = polygon([[L, 0, LOW], [L, D, LOW], [L, D, 0], [L, 0, 0]]);

const POST = 4;
const MAST = 46;
const POSTS = [14, 94].map((x) => ({ x, z: ground(x + POST) - 1, top: ground(x + POST) - 1 + MAST }));
const [A, B] = POSTS as [(typeof POSTS)[number], (typeof POSTS)[number]];
const cableZ = (x: number) => A.top - 1 + ((B.top - A.top) * (x - A.x)) / (B.x - A.x);
const cable = (y: number) =>
  polygon([[A.x + 2, y, cableZ(A.x + 2) + 0.75], [B.x + 2, y, cableZ(B.x + 2) + 0.75], [B.x + 2, y, cableZ(B.x + 2) - 0.75], [A.x + 2, y, cableZ(A.x + 2) - 0.75]]);
const BACK_LINE = 12;
const FRONT_LINE = 38;

const CAB_X = 52;
const CAB = { w: 20, d: 18, h: 20 };
const HANG = 18;
const CAB_Z = cableZ(CAB_X + 2) - HANG - CAB.h;
// Screen travel for 26 units of plan x along the cable
const TRAVEL = 26;
const DX = (TRAVEL * C).toFixed(1);
const DY = (TRAVEL * S - (cableZ(CAB_X + TRAVEL) - cableZ(CAB_X))).toFixed(1);

const TREES = [
  { x: 48, y: 4, s: 7, h: 26 },
  { x: 100, y: 46, s: 6, h: 22 },
];
function pine(x: number, y: number, s: number, h: number, z: number) {
  const apex: Point = [x, y, z + h];
  return {
    left: polygon([[x - s, y + s, z], [x + s, y + s, z], apex]),
    right: polygon([[x + s, y - s, z], [x + s, y + s, z], apex]),
  };
}

const STYLES = `
@keyframes isometric120-glide { 0% { transform: translate(-${DX}px, -${DY}px); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { transform: translate(${DX}px, ${DY}px); opacity: 0; } }
.isometric120-cabin { animation: isometric120-glide 6s linear infinite; }
.isometric120-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric120-cabin { animation: none; } }
`;

export function Isometric120({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric120Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const cab = paint.accent;
  const line = palette === "dark" ? "fill-black/50" : palette === "tone" ? "fill-black/30" : "fill-foreground/40";
  const glass = accent ? cab.ink : paint.body.ink;
  const tree = (t: (typeof TREES)[number]) => {
    const base = ground(t.x + t.s);
    const low = pine(t.x, t.y, t.s, t.h, base);
    const high = pine(t.x, t.y, t.s * 0.7, t.h * 0.6, base + t.h * 0.45);
    return (
      <g key={t.x} className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
        {[low, high].map((p) => (
          <g key={p.left}>
            <polygon points={p.left} className={paint.body.base} />
            <polygon points={p.left} stroke="none" className={paint.body.left} />
            <polygon points={p.right} className={paint.body.base} />
            <polygon points={p.right} stroke="none" className={paint.body.right} />
          </g>
        ))}
      </g>
    );
  };

  const mast = (post: (typeof POSTS)[number]) => (
    <g key={post.x}>
      <Block faces={box(post.x, 23, post.z, POST, POST + 2, MAST - 4)} paint={paint.body} />
      <Block faces={box(post.x - 1, BACK_LINE - 3, post.top - 4, POST + 2, FRONT_LINE - BACK_LINE + 6, 4)} paint={paint.body} />
    </g>
  );
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric120-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-52 -74 156 162" aria-hidden="true" className="size-full overflow-visible">
        <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={SLOPE_SIDE} className={paint.body.base} />
          <polygon points={SLOPE_SIDE} stroke="none" className={paint.body.left} />
          <polygon points={SLOPE_END} className={paint.body.base} />
          <polygon points={SLOPE_END} stroke="none" className={paint.body.right} />
          <polygon points={SLOPE_TOP} className={paint.body.base} />
        </g>
        {TREES.slice(0, 1).map(tree)}
        <polygon points={cable(BACK_LINE)} className={line} />
        {mast(A)}
        <polygon points={cable(FRONT_LINE)} className={line} />
        <g className="isometric120-cabin">
          <Block faces={box(CAB_X + 1, FRONT_LINE - 1, CAB_Z + CAB.h, 2, 2, HANG)} paint={paint.body} />
          <Block faces={box(CAB_X - 1, FRONT_LINE - 2, CAB_Z + CAB.h + HANG - 2, 6, 4, 4)} paint={paint.body} />
          <Block faces={box(CAB_X + 2 - CAB.w / 2, FRONT_LINE - CAB.d / 2, CAB_Z, CAB.w, CAB.d, CAB.h)} paint={cab} />
          <Block faces={box(CAB_X + 2 - CAB.w / 2 - 1, FRONT_LINE - CAB.d / 2 - 1, CAB_Z + CAB.h, CAB.w + 2, CAB.d + 2, 2)} paint={paint.body} />
          <g transform={onLeft(FRONT_LINE + CAB.d / 2)} className={glass}>
            <rect x={CAB_X + 2 - CAB.w / 2 + 2} y={-CAB_Z - CAB.h + 3} width={CAB.w - 4} height={8} rx={1} />
          </g>
          <g transform={onRight(CAB_X + 2 + CAB.w / 2)} className={glass}>
            <rect x={FRONT_LINE - CAB.d / 2 + 2} y={-CAB_Z - CAB.h + 3} width={CAB.d - 4} height={7} rx={1} />
          </g>
        </g>
        {/* The downhill mast stands nearer than the cabin's path, so it is drawn over the cabin */}
        {mast(B)}
        {tree(TREES[1] as (typeof TREES)[number])}
      </svg>
    </div>
  );
}
