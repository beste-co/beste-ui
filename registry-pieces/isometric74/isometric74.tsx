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

interface Isometric74Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the scan light with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric74Demo: Isometric74Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const SCANNER = { x: 8, y: 0, w: 72, d: 52, h: 18 };
// The ticket stands upright in the plane y = PLANE, drawn in (x, -z)
const PLANE = 24;
const DEPTH = 4;
const T = { x: -8, z: 34, w: 104, h: 52 };
const STUB = T.x + 74;
const NOTCH = 7;
const R = 5;
const TICKET = (() => {
  const top = -(T.z + T.h);
  const bottom = -T.z;
  const left = T.x;
  const right = T.x + T.w;
  return [
    `M${left + R} ${top}H${STUB - NOTCH}A${NOTCH} ${NOTCH} 0 0 0 ${STUB + NOTCH} ${top}H${right - R}A${R} ${R} 0 0 1 ${right} ${top + R}`,
    `V${bottom - R}A${R} ${R} 0 0 1 ${right - R} ${bottom}H${STUB + NOTCH}A${NOTCH} ${NOTCH} 0 0 0 ${STUB - NOTCH} ${bottom}`,
    `H${left + R}A${R} ${R} 0 0 1 ${left} ${bottom - R}V${top + R}A${R} ${R} 0 0 1 ${left + R} ${top}Z`,
  ].join("");
})();
const BARS = [0, 3, 5, 8, 10, 13, 16, 18, 21, 24];

const STYLES = `
@keyframes isometric74-ticket { 0%, 12% { transform: translateY(-10px); } 34%, 64% { transform: translateY(0); } 86%, 100% { transform: translateY(-10px); } }
@keyframes isometric74-scan { 0%, 30% { opacity: 0.35; } 38%, 64% { opacity: 1; } 76%, 100% { opacity: 0.35; } }
@keyframes isometric74-beam { 0%, 34% { transform: translateY(0); opacity: 0; } 38% { opacity: 1; } 58% { transform: translateY(-40px); opacity: 1; } 62%, 100% { transform: translateY(-40px); opacity: 0; } }
.isometric74-ticket { animation: isometric74-ticket 4.8s cubic-bezier(0.45, 0, 0.2, 1) infinite; }
.isometric74-lit { animation: isometric74-scan 4.8s ease-in-out infinite; }
.isometric74-beam { animation: isometric74-beam 4.8s ease-in-out infinite; }
.isometric74-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric74-ticket, .isometric74-lit, .isometric74-beam { animation: none; } }
`;

export function Isometric74({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric74Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const light = accent ? paint.accent : paint.body;
  const { x, y, w, d, h } = SCANNER;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric74-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-72 -92 176 182" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(x, y, 0, w, d, h)} paint={paint.body} />
        <g transform={onTop(h)}>
          <rect x={x + 6} y={PLANE + 4} width={w - 12} height={d - PLANE - 10} rx={4} className={paint.body.ink} />
          <rect x={x + 10} y={PLANE + 8} width={w - 20} height={d - PLANE - 18} rx={3} className={cn("isometric74-lit", light.base)} />
        </g>
        <g transform={onLeft(y + d)} className={paint.body.ink}>
          <rect x={x + 8} y={-h + 7} width={20} height={4} rx={2} />
          <circle cx={x + w - 12} cy={-h + 9} r={3} />
        </g>
        <g className="isometric74-ticket">
          {Array.from({ length: DEPTH }, (_, k) => (
            <g key={k} transform={onLeft(PLANE - DEPTH + k)}>
              <path d={TICKET} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(paint.body.base, k === 0 && paint.body.edge)} />
              <path d={TICKET} className={paint.body.right} />
            </g>
          ))}
          <g transform={onLeft(PLANE)}>
            <path d={TICKET} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(paint.body.base, paint.body.edge)} />
            <path d={TICKET} className={paint.body.left} />
            <g className={paint.body.ink}>
              <rect x={T.x + 10} y={-T.z - T.h + 10} width={40} height={8} rx={4} />
              <rect x={T.x + 10} y={-T.z - T.h + 24} width={52} height={4} rx={2} />
              <rect x={T.x + 10} y={-T.z - T.h + 32} width={30} height={4} rx={2} />
              <rect x={T.x + 10} y={-T.z - 12} width={18} height={4} rx={2} />
              {Array.from({ length: 9 }, (_, index) => (
                <circle key={`p${index}`} cx={STUB} cy={-T.z - T.h + 11 + index * 3.8} r={1.1} />
              ))}
              {BARS.map((offset, index) => (
                <rect key={`b${index}`} x={STUB + 8 + offset * 0.6} y={-T.z - T.h + 14} width={index % 3 ? 1.4 : 2.4} height={24} />
              ))}
            </g>
            <rect x={T.x + 4} y={-T.z - 3} width={T.w - 8} height={2} rx={1} className={cn("isometric74-beam opacity-0", light.base)} />
          </g>
        </g>
      </svg>
    </div>
  );
}
