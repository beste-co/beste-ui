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

interface Isometric65Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Fill the charge bar with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric65Demo: Isometric65Props = {
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

const G = 8;
const L = 84;
const D = 36;
const CAR = roundBox(0, 0, G + 6, L, D, 16, 8);
const CABIN = roundBox(18, 3, G + 22, 44, 30, 14, 8);
const WHEELS = [18, 64];
const POST = box(102, 6, G, 16, 14, 60);
const CAP = box(100, 4, G + 60, 20, 18, 4);
const SEGMENTS = [0, 1, 2, 3, 4];
const CABLE: Record<Palette, string> = {
  theme: "stroke-foreground/30",
  light: "stroke-zinc-950/30",
  dark: "stroke-black/50",
  tone: "stroke-black/30",
  glass: "stroke-foreground/30",
};
// Cable from the post to the charge port on the car's nose, sagging onto the ground
const [PX, PY] = [(104 - 20) * C, (104 + 20) * S - G - 22];
const [QX, QY] = [(L - 18) * C, (L + 18) * S - G - 16];
const CORD = `M${PX.toFixed(1)} ${PY.toFixed(1)}C${(PX - 4).toFixed(1)} ${(PY + 26).toFixed(1)} ${(QX + 6).toFixed(1)} ${(QY + 26).toFixed(1)} ${QX.toFixed(1)} ${QY.toFixed(1)}`;

const STYLES = `
${SEGMENTS.map((index) => `@keyframes isometric65-seg${index} { 0%, ${8 + index * 12}% { opacity: 0.15; } ${14 + index * 12}%, 84% { opacity: 1; } 94%, 100% { opacity: 0.15; } }
.isometric65-seg${index} { animation: isometric65-seg${index} 5s ease-out infinite; }`).join("\n")}
.isometric65-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { ${SEGMENTS.map((index) => `.isometric65-seg${index}`).join(", ")} { animation: none; } }
`;

function Wheel({ x, y, paint }: { x: number; y: number; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1}>
      <g transform={onLeft(y - 4)}>
        <circle cx={x} cy={-G - 9} r={9} className={paint.base} vectorEffect="non-scaling-stroke" />
        <circle cx={x} cy={-G - 9} r={9} className={paint.left} stroke="none" />
      </g>
      <g transform={onLeft(y)}>
        <circle cx={x} cy={-G - 9} r={9} className={paint.base} vectorEffect="non-scaling-stroke" />
        <circle cx={x} cy={-G - 9} r={4} className={paint.ink} stroke="none" />
      </g>
    </g>
  );
}

export function Isometric65({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric65Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric65-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-60 -62 188 160" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-12, -12, 0, 140, 60, G)} paint={paint.body} />
        <g transform={onTop(G)} className={paint.body.ink}>
          <rect x={-6} y={-6} width={96} height={3} rx={1.5} />
          <rect x={-6} y={41} width={96} height={3} rx={1.5} />
          <rect x={-6} y={-6} width={3} height={50} rx={1.5} />
        </g>
        {WHEELS.map((x) => (
          <Wheel key={x} x={x} y={4} paint={paint.body} />
        ))}
        <RoundBlock shape={CAR} paint={paint.body} />
        <RoundBlock shape={CABIN} paint={paint.body} />
        <g transform={onLeft(D - 3)} className={paint.body.ink}>
          <rect x={24} y={-G - 34} width={18} height={9} rx={2} />
          <rect x={45} y={-G - 34} width={14} height={9} rx={2} />
        </g>
        <g transform={onRight(62)} className={paint.body.ink}>
          <rect x={10} y={-G - 34} width={16} height={9} rx={2} />
        </g>
        <g transform={onRight(L)} className={paint.body.ink}>
          <rect x={10} y={-G - 16} width={6} height={3} rx={1.5} />
          <rect x={22} y={-G - 16} width={6} height={3} rx={1.5} />
        </g>
        {WHEELS.map((x) => (
          <Wheel key={x} x={x} y={D} paint={paint.body} />
        ))}
        <path d={CORD} fill="none" strokeWidth={3} strokeLinecap="round" className={CABLE[palette]} />
        <Block faces={POST} paint={paint.body} />
        <Block faces={CAP} paint={paint.body} />
        <g transform={onLeft(20)}>
          <rect x={105} y={-G - 54} width={10} height={32} rx={2} className={paint.body.ink} />
          {SEGMENTS.map((index) => (
            <rect key={index} x={107} y={-G - 30 - index * 5.5} width={6} height={4} rx={1} className={cn(`isometric65-seg${index}`, accent ? paint.accent.base : paint.body.base)} />
          ))}
          <rect x={107} y={-G - 20} width={6} height={4} rx={2} className={paint.body.ink} />
        </g>
      </svg>
    </div>
  );
}
