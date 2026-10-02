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

interface Isometric34Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Light the stove ring in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric34Demo: Isometric34Props = {
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
const TOP = 10;
const POT_Z = TOP + 2;
const POT_H = 30;
const LID_Z = POT_Z + POT_H;
// Side handles face the viewer (plane x + y = 0), so they are drawn in screen space
const HANDLE = "M34 -34 H48 A4 4 0 0 1 48 -26 H34 Z";
const WISPS = [
  { d: "M-44 -38 c-5 -6 4 -11 0 -17 c-3 -5 3 -8 0 -12", delay: 0 },
  { d: "M44 -38 c5 -6 -4 -11 0 -17 c3 -5 -3 -8 0 -12", delay: 0.2 },
];
const STEAM: Record<Palette, string> = {
  theme: "stroke-foreground/15",
  light: "stroke-zinc-950/15",
  dark: "stroke-zinc-500",
  tone: "stroke-current/50",
  glass: "stroke-foreground/15",
};

const STYLES = `
@keyframes isometric34-lid { 0%, 30% { transform: translateY(0); } 36% { transform: translateY(-9px); } 41% { transform: translateY(-5px); } 46% { transform: translateY(-9px); } 54%, 100% { transform: translateY(0); } }
@keyframes isometric34-steam { 0%, 32% { transform: translateY(8px) scaleY(0.6); opacity: 0; } 42% { opacity: 1; } 70%, 100% { transform: translateY(-10px) scaleY(1.1); opacity: 0; } }
@keyframes isometric34-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
.isometric34-lid { animation: isometric34-lid 4.2s ease-in-out infinite; will-change: transform; }
.isometric34-wisp { animation: isometric34-steam 4.2s ease-out infinite both; transform-box: fill-box; transform-origin: bottom; opacity: 0; }
.isometric34-glow { animation: isometric34-glow 2.1s ease-in-out infinite; }
.isometric34-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric34-lid, .isometric34-wisp, .isometric34-glow { animation: none; } }
`;

export function Isometric34({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric34Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const handle = (sign: number) => (
    <g key={sign} transform={`scale(${sign} 1)`} className={body.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={HANDLE} transform="translate(0 3)" className={body.base} />
      <path d={HANDLE} transform="translate(0 3)" className={body.right} stroke="none" />
      <path d={HANDLE} className={body.base} />
      <path d={HANDLE} className={body.left} stroke="none" />
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric34-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -36 160 130" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, SIDE, SIDE, TOP)} paint={body} />
        <g transform={onTop(TOP)}>
          <path d={`M${MID - 40} ${MID} A40 40 0 1 0 ${MID + 40} ${MID} A40 40 0 1 0 ${MID - 40} ${MID} Z M${MID - 35} ${MID} A35 35 0 1 1 ${MID + 35} ${MID} A35 35 0 1 1 ${MID - 35} ${MID} Z`} fillRule="evenodd" className={cn("isometric34-glow", accent ? paint.accent.base : body.ink)} />
        </g>
        <g transform={onLeft(SIDE)} className={body.ink}>
          {[16, 30, 44].map((x) => (
            <circle key={x} cx={x} cy={-TOP / 2} r={2.5} />
          ))}
        </g>
        <g transform={at(MID, MID)}>{[-1, 1].map(handle)}</g>
        <Cylinder x={MID} y={MID} z={TOP} h={2} r={26} paint={body} />
        <Cylinder x={MID} y={MID} z={POT_Z} h={POT_H} r={30} paint={body} />
        <g transform={at(MID, MID)}>
          {WISPS.map((wisp) => (
            <path key={wisp.delay} d={wisp.d} fill="none" strokeWidth={4} strokeLinecap="round" className={cn("isometric34-wisp", STEAM[palette])} style={{ animationDelay: `${wisp.delay}s` }} />
          ))}
        </g>
        <g className="isometric34-lid">
          <Cylinder x={MID} y={MID} z={LID_Z} h={2} r={32} paint={body} />
          <Cylinder x={MID} y={MID} z={LID_Z + 2} h={6} r={31} r2={18} paint={body} />
          <Cylinder x={MID} y={MID} z={LID_Z + 8} h={4} r={4} paint={body} />
          <Cylinder x={MID} y={MID} z={LID_Z + 12} h={3} r={9} paint={body} />
        </g>
      </svg>
    </div>
  );
}
