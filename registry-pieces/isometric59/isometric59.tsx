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

interface Isometric59Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the equals key with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric59Demo: Isometric59Props = {
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

const W = 84;
const D = 128;
const H = 12;
const KEY_W = 14;
const KEY_D = 11;
const KEY_H = 3;
const COL = (index: number) => 8 + index * 18;
const ROW = (index: number) => 48 + index * 15;
const PERIOD = 5.2;
// What is printed on each key, by row then column; the last column holds the operators drawn as strokes
const LABELS = [
  ["C", "%", "/"],
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["0", ".", "00"],
];
// The sum typed in each loop: 6, 4, plus, 8, equals. Each entry is the key, when it is pressed and what the display reads after it
const TYPED = [
  { key: "2-2", at: 8, reads: "6" },
  { key: "0-2", at: 22, reads: "64" },
  { key: "3-2", at: 36, reads: "64" },
  { key: "1-1", at: 50, reads: "8" },
  { key: "3-3", at: 66, reads: "72" },
];
const PRESSES: Record<string, number> = Object.fromEntries(TYPED.map((step) => [step.key, step.at]));
// The display changes just as each key bottoms out
const READOUTS = [{ text: "0", from: 0, to: (TYPED[0]?.at ?? 0) + 1 }, ...TYPED.map((step, index) => ({ text: step.reads, from: step.at + 1, to: index === TYPED.length - 1 ? 100 : (TYPED[index + 1]?.at ?? 100) + 1 }))];
const KEYS = Array.from({ length: 20 }, (_, index) => ({ col: index % 4, row: Math.floor(index / 4) })).filter(
  ({ col, row }) => !(col === 3 && row === 4),
);
const OPERATORS = ["M-4 0H4M-2.6 -2.6L2.6 2.6M2.6 -2.6L-2.6 2.6", "M-4 0H4", "M-4 0H4M0 -4V4"];

const pressKeyframes = Object.entries(PRESSES)
  .map(
    ([key, at]) => `@keyframes isometric59-press-${key} { 0%, ${at - 1}%, ${at + 5}%, 100% { transform: translateY(0); } ${at + 1}%, ${at + 2}% { transform: translateY(2px); } }
.isometric59-press-${key} { animation: isometric59-press-${key} ${PERIOD}s ease-in-out infinite; }`,
  )
  .join("\n");
const readoutKeyframes = READOUTS.map(
  ({ from, to }, index) => `@keyframes isometric59-readout${index} { 0%, ${Math.max(from - 0.1, 0)}% { opacity: ${from === 0 ? 1 : 0}; } ${from + 1}%, ${to}% { opacity: 1; } ${Math.min(to + 0.1, 100)}%, 100% { opacity: ${to === 100 ? 1 : 0}; } }
.isometric59-readout${index} { animation: isometric59-readout${index} ${PERIOD}s step-end infinite; }`,
).join("\n");

const STYLES = `
${pressKeyframes}
${readoutKeyframes}
.isometric59-still * { animation: none !important; }
.isometric59-still .isometric59-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { [class*="isometric59-press"], [class*="isometric59-readout"] { animation: none !important; } .isometric59-rest { opacity: 1; } }
`;

export function Isometric59({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric59Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const label = palette === "tone" ? "fill-black/70" : palette === "dark" ? "fill-zinc-100" : palette === "light" ? "fill-zinc-900" : "fill-foreground";
  const legend = (fill: string) => fill.replace("fill-", "stroke-");

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric59-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-114 -18 188 130" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, W, D, H, 10)} paint={paint.body} />
        <g transform={onTop(H)}>
          <rect x={8} y={10} width={W - 16} height={28} rx={4} className={paint.body.ink} />
          {READOUTS.map((readout, index) => (
            <text
              key={`${readout.text}-${index}`}
              x={W - 14}
              y={31}
              textAnchor="end"
              fontSize={17}
              fontWeight={600}
              className={cn(label, `isometric59-readout${index}`, index === READOUTS.length - 1 ? "isometric59-rest" : "opacity-0")}
            >
              {readout.text}
            </text>
          ))}
        </g>
        {KEYS.map(({ col, row }) => {
          const key = `${col}-${row}`;
          const equals = col === 3 && row === 3;
          const depth = equals ? KEY_D * 2 + 4 : KEY_D;
          const keyPaint = equals ? paint.accent : paint.body;
          const operator = col === 3 ? OPERATORS[row] : undefined;
          return (
            <g key={key} className={key in PRESSES ? `isometric59-press-${key}` : undefined}>
              <Block faces={box(COL(col), ROW(row), H, KEY_W, depth, KEY_H)} paint={keyPaint} />
              {col < 3 && (
                <g transform={onTop(H + KEY_H)}>
                  <text x={COL(col) + KEY_W / 2} y={ROW(row) + KEY_D / 2 + 2.6} textAnchor="middle" fontSize={7.5} fontWeight={600} className={cn(label, "opacity-60")}>
                    {LABELS[row]?.[col]}
                  </text>
                </g>
              )}
              {(operator || equals) && (
                <g transform={onTop(H + KEY_H)}>
                  <path
                    d={equals ? "M-4 -1.8H4M-4 1.8H4" : operator}
                    transform={`translate(${COL(col) + KEY_W / 2} ${ROW(row) + depth / 2})`}
                    fill="none"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    className={legend(keyPaint.ink)}
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
