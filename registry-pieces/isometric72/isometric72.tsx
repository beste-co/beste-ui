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

interface Isometric72Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the record label with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric72Demo: Isometric72Props = {
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

const disc = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;

const W = 124;
const D = 104;
const H = 16;
const CX = 52;
const CY = 52;
const RECORD_Z = H + 6;
const PIVOT = { x: 108, y: 18 };
const ARM_Z = RECORD_Z + 10;
const ARM_LENGTH = 70;
const GROOVES = [34, 29, 24, 19];

const STYLES = `
@keyframes isometric72-spin { to { transform: rotate(360deg); } }
@keyframes isometric72-arm { 0%, 6% { transform: rotate(0deg); } 30% { transform: rotate(19deg); } 36%, 80% { transform: rotate(17deg); } 96%, 100% { transform: rotate(0deg); } }
@keyframes isometric72-drop { 0%, 30% { transform: translateY(0); } 36%, 80% { transform: translateY(2px); } 86%, 100% { transform: translateY(0); } }
.isometric72-spin { animation: isometric72-spin 1.8s linear infinite; transform-box: fill-box; transform-origin: center; }
.isometric72-arm { animation: isometric72-arm 6s cubic-bezier(0.45, 0, 0.2, 1) infinite; transform-box: fill-box; transform-origin: center; }
.isometric72-drop { animation: isometric72-drop 6s ease-in-out infinite; }
.isometric72-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric72-spin, .isometric72-arm, .isometric72-drop { animation: none; } }
`;

/** The tonearm in plan, pivot at the origin, pointing along +y. */
function Arm({ className }: { className: string }) {
  return (
    <g className={className}>
      <path d={`M-2 0H2V${ARM_LENGTH - 16}L-6 ${ARM_LENGTH - 6}H-10V${ARM_LENGTH - 10}L-2 ${ARM_LENGTH - 18}Z`} />
      <rect x={-14} y={ARM_LENGTH - 10} width={10} height={14} rx={2} transform={`rotate(-24 -9 ${ARM_LENGTH - 3})`} />
      <circle cx={0} cy={0} r={4} />
    </g>
  );
}

export function Isometric72({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric72Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const label = accent ? paint.accent.base : paint.body.ink;
  const mark = accent ? paint.accent.ink : paint.body.base;
  const arm = `translate(${PIVOT.x} ${PIVOT.y})`;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric72-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-94 -24 205 142" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, W, D, H)} paint={paint.body} />
        <g transform={onLeft(D)} className={paint.body.ink}>
          <rect x={96} y={-8} width={16} height={4} rx={2} />
        </g>
        <RoundBlock shape={roundBox(CX - 44, CY - 44, H, 88, 88, 4, 44)} paint={paint.body} />
        <RoundBlock shape={roundBox(CX - 40, CY - 40, H + 4, 80, 80, 2, 40)} paint={paint.body} />
        <g transform={onTop(RECORD_Z)}>
          <path d={disc(CX, CY, 38)} className={paint.body.ink} />
          <path d={GROOVES.map((r) => disc(CX, CY, r) + disc(CX, CY, r - 1.5)).join("")} fillRule="evenodd" className={paint.body.ink} />
          <g className="isometric72-spin">
            <path d={disc(CX, CY, 13)} className={label} />
            <rect x={CX - 2} y={CY - 10} width={4} height={6} rx={2} className={mark} />
            <path d={disc(CX, CY, 2)} className={paint.body.base} />
          </g>
        </g>
        <RoundBlock shape={roundBox(PIVOT.x - 8, PIVOT.y - 8, H, 16, 16, 6, 8)} paint={paint.body} />
        <RoundBlock shape={roundBox(PIVOT.x - 4, PIVOT.y - 4, H + 6, 8, 8, ARM_Z - H - 8, 4)} paint={paint.body} />
        <RoundBlock shape={roundBox(W - 22, D - 30, H, 12, 12, 4, 6)} paint={paint.body} />
        <g className="isometric72-drop">
          <g transform={onTop(ARM_Z - 2)}>
            <g transform={arm}>
              <g className="isometric72-arm" transform="rotate(17)">
                <rect x={-ARM_LENGTH - 10} y={-ARM_LENGTH - 10} width={ARM_LENGTH * 2 + 20} height={ARM_LENGTH * 2 + 20} fill="none" stroke="none" />
                <Arm className={cn(paint.body.base)} />
                <Arm className={paint.body.right} />
              </g>
            </g>
          </g>
          <g transform={onTop(ARM_Z)}>
            <g transform={arm}>
              <g className="isometric72-arm" transform="rotate(17)">
                <rect x={-ARM_LENGTH - 10} y={-ARM_LENGTH - 10} width={ARM_LENGTH * 2 + 20} height={ARM_LENGTH * 2 + 20} fill="none" stroke="none" />
                <g strokeWidth={1} vectorEffect="non-scaling-stroke" className={paint.body.edge}>
                  <Arm className={paint.body.base} />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
