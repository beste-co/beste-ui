"use client";

import { useId } from "react";
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

interface Isometric13Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the cursor and the highlighted tokens with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric13Demo: Isometric13Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 172;
const D = 124;
const H = 14;
const LINE_X = 32;
const LINE_Y = 38;
const LINE_STEP = 14;
const LINE_H = 6;
// Each line: indent, then token widths; a negative width is a highlighted token
const LINES = [
  [0, 30, -40, 28],
  [12, 22, 48, -24],
  [24, -34, 44],
  [24, 52, 30],
  [12, 40, -22],
  [0, 20],
];
const PERIOD = 6;
const TYPE_START = 6;
const TYPE_STEP = 12;
const TYPE_LEN = 9;

const lineWidth = (line: number[]) => line.slice(1).reduce((sum, width) => sum + Math.abs(width) + 4, -4);
const CURSOR = { w: 5, d: 10, h: 8 };
const cursorAt = (index: number, end: boolean) => {
  const line = LINES[index] ?? [0];
  return [LINE_X + (line[0] ?? 0) + (end ? lineWidth(line) + 4 : 0), LINE_Y + index * LINE_STEP - 2] as const;
};
const REST = cursorAt(LINES.length - 1, true);
const shift = ([x, y]: readonly [number, number]) => {
  const dx = x - REST[0];
  const dy = y - REST[1];
  return `translate(${((dx - dy) * C).toFixed(1)}px, ${((dx + dy) * S).toFixed(1)}px)`;
};

const lineKeyframes = LINES.map((_, index) => {
  const from = TYPE_START + index * TYPE_STEP;
  return `@keyframes isometric13-type${index} { 0%, ${from}% { transform: scaleX(0); } ${from + TYPE_LEN}%, 100% { transform: scaleX(1); } }
.isometric13-line${index} { animation: isometric13-type${index} ${PERIOD}s linear infinite; }`;
}).join("\n");

const cursorStops = LINES.flatMap((_, index) => {
  const from = TYPE_START + index * TYPE_STEP;
  return [`${from}% { transform: ${shift(cursorAt(index, false))}; }`, `${from + TYPE_LEN}% { transform: ${shift(cursorAt(index, true))}; }`];
}).join(" ");

const STYLES = `
${lineKeyframes}
@keyframes isometric13-caret { 0% { transform: ${shift(cursorAt(0, false))}; } ${cursorStops} 94% { transform: none; } 97%, 100% { transform: ${shift(cursorAt(0, false))}; } }
@keyframes isometric13-blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.15; } }
.isometric13-line { transform-box: fill-box; transform-origin: left center; }
@keyframes isometric13-clear { 0%, 86% { opacity: 1; } 94%, 100% { opacity: 0; } }
.isometric13-code { animation: isometric13-clear ${PERIOD}s linear infinite; }
.isometric13-caret { animation: isometric13-caret ${PERIOD}s linear infinite; }
.isometric13-blink { animation: isometric13-blink 1s linear infinite; }
.isometric13-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric13-line, .isometric13-code, .isometric13-caret, .isometric13-blink { animation: none; } }
`;

export function Isometric13({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric13Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const token = accent ? paint.accent.base : paint.body.ink;
  const cursor = box(REST[0], REST[1], H, CURSOR.w, CURSOR.d, CURSOR.h);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric13-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-124 -30 290 196" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, W, D, H)} paint={paint.body} />
        <g transform={onTop(H)}>
          {/* Each line is uncovered left to right by a growing window, so the tokens keep their shape as they are typed */}
          <defs>
            {LINES.map((line, index) => (
              <clipPath key={index} id={`${clipId}-${index}`}>
                <rect x={LINE_X + (line[0] ?? 0) - 1} y={LINE_Y + index * LINE_STEP - 1} width={lineWidth(line) + 2} height={LINE_H + 2} className={cn("isometric13-line", `isometric13-line${index}`)} />
              </clipPath>
            ))}
          </defs>
          <g className={paint.body.ink}>
            <circle cx={14} cy={13} r={3.5} />
            <circle cx={25} cy={13} r={3.5} />
            <circle cx={36} cy={13} r={3.5} />
            <rect x={0} y={25} width={W} height={1.5} />
            {LINES.map((_, index) => (
              <rect key={index} x={14} y={LINE_Y + index * LINE_STEP} width={8} height={LINE_H} rx={3} />
            ))}
          </g>
          <g className="isometric13-code">
          {LINES.map((line, index) => {
            let x = LINE_X + (line[0] ?? 0);
            return (
              <g key={index} clipPath={`url(#${clipId}-${index})`}>
                {line.slice(1).map((width, part) => {
                  const rect = (
                    <rect key={part} x={x} y={LINE_Y + index * LINE_STEP} width={Math.abs(width)} height={LINE_H} rx={3} className={width < 0 ? token : paint.body.ink} />
                  );
                  x += Math.abs(width) + 4;
                  return rect;
                })}
              </g>
            );
          })}
          </g>
        </g>
        <g className="isometric13-caret">
          <g className="isometric13-blink">
            <Block faces={cursor} paint={paint.accent} />
          </g>
        </g>
      </svg>
    </div>
  );
}
