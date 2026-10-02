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

interface Isometric18Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the newest bubble with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric18Demo: Isometric18Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

type Plan = [number, number];

const W = 108;
const D = 60;
const R = 14;
const H = 10;
const GAP = 34;
const SHIFT = 20;
const PERIOD = 6;
// Line widths drawn on each bubble, bottom to top
const TEXT = [
  [60, 36],
  [52, 30],
  [64, 40],
];

const arc = (cx: number, cy: number, from: number): Plan[] =>
  Array.from({ length: 7 }, (_, i) => {
    const t = ((from + (90 * i) / 6) * Math.PI) / 180;
    return [Number((cx + R * Math.cos(t)).toFixed(2)), Number((cy + R * Math.sin(t)).toFixed(2))] as Plan;
  });

/** A rounded bubble with a small tail on its left edge (incoming) or its right edge (outgoing). */
function bubble(x: number, y: number, outgoing: boolean): Plan[] {
  const right: Plan[] = outgoing ? [[x + W, y + 16], [x + W + 10, y + 8], [x + W, y + 30]] : [];
  const front: Plan[] = outgoing ? [] : [[x + 30, y + D], [x + 8, y + D + 10], [x + 16, y + D]];
  return [...arc(x + R, y + R, 180), ...arc(x + W - R, y + R, 270), ...right, ...arc(x + W - R, y + D - R, 0), ...front, ...arc(x + R, y + D - R, 90)];
}

/** An upright extrusion of a flat plan shape: the visible walls, grouped by shade, then the top. */
function prism(shape: Plan[], z: number, h: number) {
  const n = shape.length;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = shape[i] as Plan;
    const [x2, y2] = shape[(i + 1) % n] as Plan;
    area += x1 * y2 - x2 * y1;
  }
  const sign = area > 0 ? 1 : -1;
  const strips: { side: "left" | "right"; points: Plan[] }[] = [];
  for (let i = 0; i < n; i++) {
    const a = shape[i] as Plan;
    const b = shape[(i + 1) % n] as Plan;
    const nx = sign * (b[1] - a[1]);
    const ny = -sign * (b[0] - a[0]);
    if (nx + ny <= 0.001) continue;
    const side = ny > nx ? "left" : "right";
    const last = strips[strips.length - 1];
    if (last && last.side === side && last.points[last.points.length - 1] === a) last.points.push(b);
    else strips.push({ side, points: [a, b] });
  }
  const depth = (points: Plan[]) => points.reduce((sum, [x, y]) => sum + x + y, 0) / points.length;
  return {
    top: polygon(shape.map(([x, y]) => [x, y, z + h] as Point)),
    walls: strips
      .sort((p, q) => depth(p.points) - depth(q.points))
      .map(({ side, points }) => ({
        side,
        points: polygon([...points.map(([x, y]) => [x, y, z + h] as Point), ...[...points].reverse().map(([x, y]) => [x, y, z] as Point)]),
      })),
  };
}

function Prism({ shape, z, h, paint }: { shape: Plan[]; z: number; h: number; paint: Paint }) {
  const { top, walls } = prism(shape, z, h);
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      {walls.map(({ side, points }) => (
        <g key={points}>
          <polygon points={points} className={paint.base} />
          <polygon points={points} className={side === "left" ? paint.left : paint.right} stroke="none" />
        </g>
      ))}
      <polygon points={top} className={paint.base} />
    </g>
  );
}


const BUBBLES = TEXT.map((lines, index) => {
  const outgoing = index % 2 === 1;
  const shift = outgoing ? SHIFT : -SHIFT;
  return { index, lines, outgoing, x: shift, y: -shift, z: index * GAP };
});

const bubbleKeyframes = BUBBLES.map(({ index }) => {
  const from = 4 + index * 20;
  return `@keyframes isometric18-in${index} { 0%, ${from}% { opacity: 0; transform: translateY(-18px); } ${from + 8}%, 86% { opacity: 1; transform: translateY(0); } 94%, 100% { opacity: 0; transform: translateY(0); } }
.isometric18-bubble${index} { animation: isometric18-in${index} ${PERIOD}s ease-out infinite; will-change: transform, opacity; }`;
}).join("\n");

const STYLES = `
${bubbleKeyframes}
.isometric18-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { ${BUBBLES.map(({ index }) => `.isometric18-bubble${index}`).join(", ")} { animation: none; } }
`;

export function Isometric18({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric18Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric18-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-102 -112 244 214" aria-hidden="true" className="size-full overflow-visible">
        {BUBBLES.map(({ index, lines, outgoing, x, y, z }) => {
          const slab = index === BUBBLES.length - 1 ? paint.accent : paint.body;
          return (
            <g key={index} className={`isometric18-bubble${index}`}>
              <Prism shape={bubble(x, y, outgoing)} z={z} h={H} paint={slab} />
              <g transform={onTop(z + H)} className={slab.ink}>
                {lines.map((width, line) => (
                  <rect key={line} x={x + 18} y={y + 18 + line * 16} width={width} height={8} rx={4} />
                ))}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
