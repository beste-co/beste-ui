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

interface Isometric80Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the face buttons with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric80Demo: Isometric80Props = {
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

/** A flat plan shape pushed up from z by h, one unit per layer, lit from the top. */
function Slab({ d, z, h, paint }: { d: string; z: number; h: number; paint: Paint }) {
  return (
    <g>
      {Array.from({ length: h }, (_, k) => (
        <g key={k} transform={onTop(z + k)}>
          <path d={d} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(paint.base, k === 0 && paint.edge)} />
          <path d={d} className={paint.right} />
        </g>
      ))}
      <path d={d} transform={onTop(z + h)} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(paint.base, paint.edge)} />
    </g>
  );
}

const H = 12;
const PAD =
  "M32 0H104C122 0 132 10 134 28L138 62C140 80 120 88 108 74L96 60H40L28 74C16 88 -4 80 -2 62L2 28C4 10 14 0 32 0Z";
const DPAD = { x: 30, y: 30 };
// Turned 45 degrees in plan so the cross reads upright on screen
const CROSS = `M${[
  [-4, -13], [4, -13], [4, -4], [13, -4], [13, 4], [4, 4], [4, 13], [-4, 13], [-4, 4], [-13, 4], [-13, -4], [-4, -4],
]
  .map(([u, v]) => `${(DPAD.x + (u + v) * Math.SQRT1_2).toFixed(2)} ${(DPAD.y + (v - u) * Math.SQRT1_2).toFixed(2)}`)
  .join("L")}Z`;
const FACE = { x: 110, y: 28 };
const BUTTONS = [
  { x: FACE.x - 9, y: FACE.y - 9 },
  { x: FACE.x + 9, y: FACE.y - 9 },
  { x: FACE.x + 9, y: FACE.y + 9 },
  { x: FACE.x - 9, y: FACE.y + 9 },
].sort((p, q) => p.x + p.y - (q.x + q.y));
const ORDER = [1, 2, 3, 0];
const STICKS = [
  { x: 52, y: 48 },
  { x: 82, y: 50 },
];

const STYLES = `
@keyframes isometric80-press { 0%, 14%, 100% { transform: translateY(0); } 4%, 9% { transform: translateY(3px); } }
.isometric80-button { animation: isometric80-press 4s ease-in-out infinite; }
.isometric80-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric80-button { animation: none; } }
`;

export function Isometric80({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric80Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric80-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-76 -28 200 132" aria-hidden="true" className="size-full overflow-visible">
        <Slab d={PAD} z={0} h={H} paint={paint.body} />
        <g transform={onTop(H)} className={paint.body.ink}>
          <rect x={58} y={20} width={8} height={4} rx={2} />
          <rect x={72} y={20} width={8} height={4} rx={2} />
          <rect x={56} y={6} width={26} height={4} rx={2} />
        </g>
        <Slab d={CROSS} z={H} h={3} paint={paint.body} />
        {STICKS.map((stick) => (
          <g key={stick.x}>
            <RoundBlock shape={roundBox(stick.x - 10, stick.y - 10, H, 20, 20, 2, 10)} paint={paint.body} />
            <RoundBlock shape={roundBox(stick.x - 7, stick.y - 7, H + 2, 14, 14, 5, 7)} paint={paint.body} />
            <circle cx={stick.x} cy={stick.y} r={4} transform={onTop(H + 7)} className={paint.body.ink} />
          </g>
        ))}
        {BUTTONS.map((button, index) => {
          const delay = { animationDelay: `${(ORDER[index] ?? 0) * 0.6}s` };
          return (
            <g key={`${button.x}-${button.y}`} className="isometric80-button" style={delay}>
              <RoundBlock shape={roundBox(button.x - 6, button.y - 6, H, 12, 12, 5, 6)} paint={paint.accent} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
