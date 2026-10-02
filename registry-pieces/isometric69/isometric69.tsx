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

interface Isometric69Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Light the dock with the tone when the bike is released; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric69Demo: Isometric69Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const G = 8;
const BY = 28;
const WHEEL_R = 18;
const HUB_Z = G + WHEEL_R;
const WHEELS = [22, 80];
// Side profile of the frame in (x, -z), drawn as thick rounded strokes
const FRAME = [
  `M22 ${-HUB_Z}L46 ${-HUB_Z}L37 -62Z`,
  `M46 ${-HUB_Z}Q54 -46 70 -64`,
  `M70 -64L80 ${-HUB_Z}`,
  "M70 -64L68 -73H75",
  "M37 -62L36 -66M31 -66H42",
];
const SLICES = [BY - 2, BY, BY + 2];
const RING = (x: number) =>
  `M${x - WHEEL_R} ${-HUB_Z}a${WHEEL_R} ${WHEEL_R} 0 1 0 ${WHEEL_R * 2} 0a${WHEEL_R} ${WHEEL_R} 0 1 0 ${-WHEEL_R * 2} 0Z M${x - WHEEL_R + 5} ${-HUB_Z}a${WHEEL_R - 5} ${WHEEL_R - 5} 0 1 1 ${(WHEEL_R - 5) * 2} 0a${WHEEL_R - 5} ${WHEEL_R - 5} 0 1 1 ${-(WHEEL_R - 5) * 2} 0Z`;
const BASKET = box(74, BY - 8, 58, 20, 16, 13);
const POST = box(106, BY - 7, G, 14, 14, 60);
const CAP = box(104, BY - 9, G + 60, 18, 18, 4);
const CLAMP_BACK = box(74, BY - 7, G, 30, 3, 8);
const CLAMP_FRONT = box(74, BY + 4, G, 30, 3, 8);

// The bike backs out this far; each wheel turns by travel / radius, so the spoke shows it rolling
const TRAVEL = 28;
const SPIN = (-TRAVEL / WHEEL_R) * (180 / Math.PI);
const STYLES = `
@keyframes isometric69-light { 0%, 16% { opacity: 0; } 22%, 70% { opacity: 1; } 78%, 100% { opacity: 0; } }
@keyframes isometric69-roll { 0%, 26% { transform: translate(0, 0); } 46%, 66% { transform: translate(${(-TRAVEL * C).toFixed(1)}px, ${(-TRAVEL * S).toFixed(1)}px); } 86%, 100% { transform: translate(0, 0); } }
@keyframes isometric69-spin { 0%, 26% { transform: rotate(0deg); } 46%, 66% { transform: rotate(${SPIN.toFixed(1)}deg); } 86%, 100% { transform: rotate(0deg); } }
.isometric69-light { animation: isometric69-light 5.4s ease-in-out infinite; }
.isometric69-bike { animation: isometric69-roll 5.4s cubic-bezier(0.45, 0, 0.2, 1) infinite; will-change: transform; }
.isometric69-spin { animation: isometric69-spin 5.4s cubic-bezier(0.45, 0, 0.2, 1) infinite; }
.isometric69-still * { animation: none !important; }
.isometric69-still .isometric69-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric69-light, .isometric69-bike, .isometric69-spin { animation: none; } .isometric69-rest { opacity: 1; } }
`;

// Stroke twins of the body paint, spelled out so Tailwind sees every class
const FRAME_STROKE: Record<Palette, { base: string; left: string; right: string }> = {
  theme: { base: "stroke-card", left: "stroke-foreground/5", right: "stroke-foreground/10" },
  light: { base: "stroke-white", left: "stroke-zinc-950/5", right: "stroke-zinc-950/10" },
  dark: { base: "stroke-zinc-800", left: "stroke-black/20", right: "stroke-black/40" },
  tone: { base: "stroke-current", left: "stroke-black/15", right: "stroke-black/30" },
};

function BikeSlice({ y, paint, stroke, front }: { y: number; paint: Paint; stroke: (typeof FRAME_STROKE)[Palette]; front: boolean }) {
  const shade = front ? paint.left : paint.right;
  return (
    <g transform={onLeft(y)} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {front &&
        FRAME.map((d) => <path key={d} d={d} strokeWidth={7} className={paint.edge} />)}
      {FRAME.map((d) => (
        <g key={d}>
          <path d={d} strokeWidth={5} className={stroke.base} />
          <path d={d} strokeWidth={5} className={front ? stroke.left : stroke.right} />
        </g>
      ))}
      {WHEELS.map((x) => (
        <g key={x} className={paint.edge} strokeWidth={front ? 1 : 0}>
          <path d={RING(x)} fillRule="evenodd" className={paint.base} vectorEffect="non-scaling-stroke" />
          <path d={RING(x)} fillRule="evenodd" className={shade} stroke="none" />
          {front && (
            <g transform={`translate(${x} ${-HUB_Z})`} stroke="none">
              <g className="isometric69-spin">
                <rect x={-1.25} y={-(WHEEL_R - 4)} width={2.5} height={WHEEL_R - 4} rx={1.25} className={paint.ink} />
              </g>
              <circle r={3} className={paint.ink} />
            </g>
          )}
        </g>
      ))}
    </g>
  );
}

export function Isometric69({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric69Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric69-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-58 -40 172 136" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-8, 4, 0, 140, 48, G)} paint={paint.body} />
        <g transform={onTop(G)} className={paint.body.ink}>
          <rect x={0} y={BY - 10} width={104} height={20} rx={4} />
        </g>
        <Block faces={CLAMP_BACK} paint={paint.body} />
        <g className="isometric69-bike">
          {SLICES.map((y, index) => (
            <BikeSlice key={y} y={y} paint={paint.body} stroke={FRAME_STROKE[palette]} front={index === SLICES.length - 1} />
          ))}
          <Block faces={BASKET} paint={paint.body} />
          <g transform={onLeft(BY + 8)} className={paint.body.ink}>
            {[79, 84, 89].map((x) => (
              <rect key={x} x={x} y={-68} width={2} height={8} rx={1} />
            ))}
          </g>
        </g>
        <Block faces={CLAMP_FRONT} paint={paint.body} />
        <Block faces={POST} paint={paint.body} />
        <Block faces={CAP} paint={paint.body} />
        <g transform={onLeft(BY + 7)}>
          <rect x={108} y={-60} width={10} height={15} rx={2} className={paint.body.ink} />
          <rect x={108} y={-60} width={10} height={15} rx={2} className={cn("isometric69-light isometric69-rest opacity-0", accent ? paint.accent.base : paint.body.base)} />
          <rect x={109} y={-38} width={8} height={3} rx={1.5} className={paint.body.ink} />
        </g>
      </svg>
    </div>
  );
}
