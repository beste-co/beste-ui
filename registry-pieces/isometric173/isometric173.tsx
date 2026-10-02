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

interface Isometric173Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Print the typed line in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric173Demo: Isometric173Props = {
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

/** An upright cylinder standing on plan point (cx, cy). */
const cylinder = (cx: number, cy: number, z: number, h: number, r: number) => roundBox(cx - r, cy - r, z, 2 * r, 2 * r, h, r);

const W = 80;
const DECK = 26;
const PERIOD = 6.4;
// Each strike prints one letter, then the carriage steps one letter width toward -x
const STEP = 4;
const LETTERS = [0, 1, 2, 3, 4, 5];
const struck = (index: number) => 8 + index * 9;
const CLEAR = 76;
const offset = (steps: number) => `translate(${(steps * STEP * C).toFixed(2)}px, ${(steps * STEP * S).toFixed(2)}px)`;
const LAST = LETTERS.length - 1;
// The paper sits in the plane y = 12; the print point stays over the middle of the machine
const SHEET = { x: 14, w: 44, y: 12, z: 78 };
const LINE = { x: W / 2 - 1.5 - LAST * STEP, z: 43 };

// Keys by row: the back row has six keys, the middle row seven
const ROWS = [
  { y: 39, z: 18, keys: [15, 25, 35, 45, 55, 65] },
  { y: 49, z: 14, keys: [10, 20, 30, 40, 50, 60, 70] },
];
// Which key (row, column) types each letter
const TYPED: [number, number][] = [[1, 1], [0, 3], [1, 5], [0, 0], [1, 3], [0, 4]];

const carriageFrames = [
  `0%, ${struck(0) + 3}% { transform: ${offset(LAST)}; }`,
  ...LETTERS.slice(1).map((index) => `${struck(index - 1) + 6}%, ${struck(index) + 3}% { transform: ${offset(LAST - index)}; }`),
  `82% { transform: ${offset(0)}; }`,
  `94%, 100% { transform: ${offset(LAST)}; }`,
].join(" ");

const STYLES = `
@keyframes isometric173-carriage { ${carriageFrames} }
${LETTERS.map((index) => `@keyframes isometric173-key${index} { 0%, ${struck(index)}% { transform: translateY(0); } ${struck(index) + 1.5}% { transform: translateY(1.6px); } ${struck(index) + 3}%, 100% { transform: translateY(0); } }
@keyframes isometric173-letter${index} { 0%, ${struck(index) + 1.4}% { opacity: 0; } ${struck(index) + 1.5}%, ${CLEAR}% { opacity: 1; } ${CLEAR + 5}%, 100% { opacity: 0; } }
.isometric173-key${index} { animation: isometric173-key${index} ${PERIOD}s ease-in-out infinite; }
.isometric173-letter${index} { animation: isometric173-letter${index} ${PERIOD}s linear infinite; }`).join("\n")}
.isometric173-carriage { animation: isometric173-carriage ${PERIOD}s ease-in-out infinite; }
.isometric173-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric173-move, .isometric173-move * { animation: none; } }
`;

export function Isometric173({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric173Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric173-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-59 -69 129 145" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 4, 0, W, 30, DECK)} paint={body} />
        <g transform={onTop(DECK)} className={body.ink}>
          <path d="M26 33a14 9 0 0 1 28 0Z" />
        </g>
        <g className="isometric173-move isometric173-carriage">
          <Block faces={box(4, 8, DECK, 64, 14, 3)} paint={body} />
          <g transform={onLeft(SHEET.y)}>
            <rect x={SHEET.x} y={-SHEET.z} width={SHEET.w} height={SHEET.z - DECK - 3} rx={1} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(body.base, body.edge)} />
            <g className={body.ink}>
              <rect x={LINE.x} y={-LINE.z - 24} width={26} height={3} rx={1} />
              <rect x={LINE.x} y={-LINE.z - 18} width={34} height={3} rx={1} />
              <rect x={LINE.x} y={-LINE.z - 12} width={30} height={3} rx={1} />
              <rect x={LINE.x} y={-LINE.z - 6} width={18} height={3} rx={1} />
            </g>
            <g className={paint.accent.base}>
              {LETTERS.map((index) => (
                <rect key={index} x={LINE.x + index * STEP} y={-LINE.z} width={3} height={3} rx={0.8} className={`isometric173-letter${index}`} />
              ))}
            </g>
          </g>
          <Block faces={box(8, 13, DECK + 3, 56, 8, 8)} paint={body} />
          <Block faces={box(64, 14.5, DECK + 4.5, 5, 5, 5)} paint={body} />
          <Block faces={box(0, 15, DECK + 5, 8, 3, 3)} paint={body} />
        </g>
        {/* The type guide stays put while the carriage travels behind it */}
        <Block faces={box(W / 2 - 3, 23, DECK, 6, 3, 13)} paint={body} />
        {ROWS.map((row, rowIndex) => (
          <g key={row.y}>
            <Block faces={box(0, row.y - 5, 0, W, 10, row.z)} paint={body} />
            {row.keys.map((x, column) => {
              const letter = TYPED.findIndex(([r, c]) => r === rowIndex && c === column);
              return (
                <g key={x} className={letter < 0 ? undefined : `isometric173-move isometric173-key${letter}`}>
                  <RoundBlock shape={cylinder(x, row.y, row.z, 2.5, 3.2)} paint={body} />
                  <g transform={onTop(row.z + 2.5)} className={body.ink}>
                    <circle cx={x} cy={row.y} r={1.6} />
                  </g>
                </g>
              );
            })}
          </g>
        ))}
        <Block faces={box(0, 54, 0, W, 10, 10)} paint={body} />
        <Block faces={box(20, 56.5, 10, 40, 5, 2)} paint={body} />
        <g transform={onLeft(64)} className={body.ink}>
          <rect x={30} y={-7} width={20} height={3} rx={1.5} />
        </g>
      </svg>
    </div>
  );
}
