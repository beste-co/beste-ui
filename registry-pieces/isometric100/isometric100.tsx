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

interface Isometric100Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the trophy and half the confetti with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric100Demo: Isometric100Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;

/** An upright round solid centered on the origin in plan, radius r1 at the bottom and r2 at the top. */
function Round({ r1, r2 = r1, z, h, paint, open }: { r1: number; r2?: number; z: number; h: number; paint: Paint; open?: string }) {
  const [rx1, ry1, rx2, ry2] = [r1 * ELLIPSE_X, r1 * ELLIPSE_Y, r2 * ELLIPSE_X, r2 * ELLIPSE_Y];
  const top = -z - h;
  const bottom = -z;
  const left = `M${-rx2} ${top} L${-rx1} ${bottom} A${rx1} ${ry1} 0 0 0 0 ${bottom + ry1} L0 ${top + ry2} A${rx2} ${ry2} 0 0 1 ${-rx2} ${top} Z`;
  const right = `M${rx2} ${top} L${rx1} ${bottom} A${rx1} ${ry1} 0 0 1 0 ${bottom + ry1} L0 ${top + ry2} A${rx2} ${ry2} 0 0 0 ${rx2} ${top} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      <ellipse cx={0} cy={top} rx={rx2} ry={ry2} className={paint.base} />
      {open && <ellipse cx={0} cy={top + 0.6} rx={rx2 - 2.4} ry={ry2 - 1.4} stroke="none" className={open} />}
    </g>
  );
}

const STEPS = [
  { place: "2", x: 0, h: 28 },
  { place: "1", x: 32, h: 40 },
  { place: "3", x: 64, h: 18 },
];
const STEP_W = 32;
const DEPTH = 36;
const CUP_Z = 58;
const CUP_H = 22;
// The trophy stands on the middle step; everything below is drawn around its plan center
const TX = (48 - 18) * C;
const TY = (48 + 18) * S;
const HANDLE = (sign: number) => {
  const cx = sign * 16;
  const cy = -CUP_Z - 14;
  return `M${cx} ${cy - 8}a8 8 0 1 ${sign > 0 ? 1 : 0} 0 16v-4a4 4 0 1 ${sign > 0 ? 0 : 1} 0 -8Z`;
};
const STAR = "M0 -4.5L1.3 -1.4L4.5 -1.4L1.9 0.6L2.9 3.8L0 1.9L-2.9 3.8L-1.9 0.6L-4.5 -1.4L-1.3 -1.4Z";
const CONFETTI = [
  { x: -24, y: -78, r: 20, d: 0 },
  { x: 4, y: -98, r: -15, d: 0.6 },
  { x: 60, y: -92, r: 30, d: 1.2 },
  { x: 78, y: -70, r: -15, d: 1.8 },
  { x: -8, y: -62, r: 25, d: 2.4 },
  { x: 40, y: -100, r: -20, d: 3 },
  { x: 70, y: -54, r: 30, d: 3.6 },
  { x: 86, y: -96, r: 10, d: 0.3 },
  { x: -34, y: -96, r: -25, d: 2.1 },
];

const STYLES = `
@keyframes isometric100-fall { 0% { transform: translateY(-10px) rotate(0deg); opacity: 0; } 12% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(52px) rotate(320deg); opacity: 0; } }
@keyframes isometric100-shine { 0%, 40%, 100% { opacity: 0; } 55% { opacity: 1; } 70% { opacity: 0; } }
.isometric100-bit { transform-box: fill-box; transform-origin: center; animation: isometric100-fall 4.2s linear infinite both; }
.isometric100-shine { animation: isometric100-shine 4.2s ease-in-out infinite; }
.isometric100-still * { animation: none !important; }
.isometric100-still .isometric100-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric100-bit, .isometric100-shine { animation: none; } .isometric100-rest { opacity: 1; } }
`;

export function Isometric100({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric100Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const cup = paint.accent;
  const label = palette === "tone" ? "fill-black/70" : palette === "dark" ? "fill-zinc-100" : palette === "light" ? "fill-zinc-900" : "fill-foreground";
  // Confetti floats over the card, not the podium, so it keeps a color that reads there
  const bits = [
    accent ? (palette === "tone" ? "fill-current" : paint.accent.base) : "fill-zinc-300",
    palette === "dark" ? "fill-zinc-700" : palette === "tone" ? "fill-black/30" : "fill-zinc-300",
  ];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric100-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-46 -106 144 176" aria-hidden="true" className="size-full overflow-visible">
        {CONFETTI.map((bit, index) => (
          <g key={bit.x} transform={`rotate(${bit.r} ${bit.x + 1.75} ${bit.y + 3})`}>
            <rect
              x={bit.x}
              y={bit.y}
              width={3.5}
              height={6}
              rx={1}
              className={cn("isometric100-bit isometric100-rest opacity-0", bits[index % 2])}
              style={{ animationDelay: `${bit.d}s` }}
            />
          </g>
        ))}
        {STEPS.map((step) => (
          <g key={step.place}>
            <Block faces={box(step.x, 0, 0, STEP_W, DEPTH, step.h)} paint={paint.body} />
            <g transform={onLeft(DEPTH)}>
              <text x={step.x + STEP_W / 2} y={-step.h / 2} textAnchor="middle" dominantBaseline="central" fontSize={step.place === "1" ? 18 : 15} className={cn("font-semibold", label)}>
                {step.place}
              </text>
            </g>
          </g>
        ))}
        <Block faces={box(38, 8, 40, 20, 20, 6)} paint={paint.body} />
        <g transform={`translate(${TX.toFixed(1)} ${TY.toFixed(1)})`}>
          <Round r1={7} z={46} h={4} paint={cup} />
          <Round r1={3} z={50} h={CUP_Z - 50} paint={cup} />
          {[-1, 1].map((sign) => (
            <path key={sign} d={HANDLE(sign)} strokeWidth={1} className={cn(cup.base, cup.edge)} />
          ))}
          <Round r1={5} r2={16} z={CUP_Z} h={CUP_H} paint={cup} open={cup.right} />
          <path d={STAR} transform={`translate(-5 ${-CUP_Z - 10}) scale(1.2)`} className={cup.ink} />
          <path d={`M-9 ${-CUP_Z - 5}L-4 ${-CUP_Z - 19}H0L-5 ${-CUP_Z - 5}Z`} className={cn("isometric100-shine opacity-0", palette === "tone" && accent ? "fill-current" : "fill-white/60")} />
        </g>
      </svg>
    </div>
  );
}
