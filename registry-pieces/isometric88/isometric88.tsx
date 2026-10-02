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

interface Isometric88Props {
  /** Text on the table card. */
  label?: string;
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the reserved card with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric88Demo: Isometric88Props = {
  label: "Reserved",
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;

/** An upright cylinder centered on the origin in plan, shaded in two halves like a box. */
function Cylinder({ r, z, h, paint }: { r: number; z: number; h: number; paint: Paint }) {
  const rx = r * ELLIPSE_X;
  const ry = r * ELLIPSE_Y;
  const top = -z - h;
  const bottom = -z;
  const left = `M${-rx} ${top} L${-rx} ${bottom} A${rx} ${ry} 0 0 0 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 1 ${-rx} ${top} Z`;
  const right = `M${rx} ${top} L${rx} ${bottom} A${rx} ${ry} 0 0 1 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 0 ${rx} ${top} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      <ellipse cx={0} cy={top} rx={rx} ry={ry} className={paint.base} />
    </g>
  );
}

const G = 6;
const T = 48;
const TABLE_AT = `translate(0 ${T})`;
const TOP_Z = G + 36;
// A folded tent card standing on the tabletop: the ridge runs along y, the near panel leans toward +x
const CARD_W = 26;
const RIDGE = { x: T + 6, y: T + 18, h: 13 };
const SPREAD = 5;
const CARD_H = Math.hypot(SPREAD, RIDGE.h);
const at = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
// The near panel's own plane: across runs back along the ridge, down runs from the ridge to the table
const [PX, PY] = at([RIDGE.x, RIDGE.y, TOP_Z + RIDGE.h]);
const DOWN = [(SPREAD / CARD_H) * C, (SPREAD / CARD_H) * S + RIDGE.h / CARD_H] as const;
const PANEL = `matrix(${[C, -S, DOWN[0], DOWN[1], PX, PY].map((value) => value.toFixed(3)).join(", ")})`;
const END = polygon([
  [RIDGE.x - SPREAD, RIDGE.y, TOP_Z],
  [RIDGE.x, RIDGE.y, TOP_Z + RIDGE.h],
  [RIDGE.x + SPREAD, RIDGE.y, TOP_Z],
]);
const STYLES = `
@keyframes isometric88-card { 0%, 58%, 100% { transform: translateY(0); } 64% { transform: translateY(-3px); } 70% { transform: translateY(0); } 74% { transform: translateY(-1px); } 78% { transform: translateY(0); } }
@keyframes isometric88-shade { 0%, 58%, 78%, 100% { opacity: 1; } 64% { opacity: 0.5; } }
@keyframes isometric88-sheen { 0%, 12% { transform: translateX(-12px); } 40%, 100% { transform: translateX(${CARD_W + 12}px); } }
.isometric88-card { animation: isometric88-card 5.6s ease-in-out infinite; }
.isometric88-shade { animation: isometric88-shade 5.6s ease-in-out infinite; }
.isometric88-sheen { animation: isometric88-sheen 5.6s ease-in-out infinite; }
.isometric88-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric88-card, .isometric88-shade, .isometric88-sheen { animation: none; } }
`;

function Chair({ x, y, facing, paint }: { x: number; y: number; facing: "x" | "y"; paint: Paint }) {
  const legs = [
    [x, y],
    [x + 18, y],
    [x, y + 18],
    [x + 18, y + 18],
  ];
  return (
    <g>
      {legs.map(([lx, ly]) => (
        <Block key={`${lx}-${ly}`} faces={box(lx, ly, G, 4, 4, 18)} paint={paint} />
      ))}
      <Block faces={box(x, y, G + 18, 22, 22, 5)} paint={paint} />
      <Block faces={facing === "x" ? box(x, y, G + 23, 5, 22, 24) : box(x, y, G + 23, 22, 5, 24)} paint={paint} />
    </g>
  );
}

export function Isometric88({ label = "Reserved", tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric88Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const card = paint.accent;
  const text = !accent
    ? palette === "tone" ? "fill-black/70" : palette === "dark" ? "fill-zinc-100" : palette === "light" ? "fill-zinc-900" : "fill-foreground"
    : palette === "tone" ? "fill-current" : "fill-white";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric88-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-58 -40 116 124" aria-hidden="true" className="size-full overflow-visible">
        <g transform={TABLE_AT}>
          <Cylinder r={44} z={0} h={G} paint={paint.body} />
        </g>
        <Chair x={8} y={T - 11} facing="x" paint={paint.body} />
        <Chair x={T - 11} y={8} facing="y" paint={paint.body} />
        <g transform={TABLE_AT}>
          <Cylinder r={13} z={G} h={2} paint={paint.body} />
          <Cylinder r={5} z={G + 2} h={TOP_Z - G - 8} paint={paint.body} />
          <Cylinder r={28} z={TOP_Z - 6} h={6} paint={paint.body} />
        </g>
        <g transform={onTop(TOP_Z)} className={paint.body.ink}>
          {[
            [T - 16, T],
            [T, T - 16],
          ].map(([cx, cy]) => (
            <path key={`${cx}-${cy}`} fillRule="evenodd" d={`M${cx - 7} ${cy}a7 7 0 1 0 14 0a7 7 0 1 0 -14 0Z M${cx - 4} ${cy}a4 4 0 1 1 8 0a4 4 0 1 1 -8 0Z`} />
          ))}
        </g>
        <g transform={onTop(TOP_Z)}>
          <rect x={RIDGE.x - SPREAD - 1} y={RIDGE.y - CARD_W - 1} width={2 * SPREAD + 4} height={CARD_W + 3} rx={2} className="isometric88-shade fill-black/10" />
        </g>
        <g className="isometric88-card">
          <g transform={PANEL}>
            <clipPath id={clipId}>
              <rect width={CARD_W} height={CARD_H} rx={1} />
            </clipPath>
            <rect width={CARD_W} height={CARD_H} rx={1} className={card.base} />
            <rect width={CARD_W} height={CARD_H} rx={1} className={card.left} />
            <g clipPath={`url(#${clipId})`}>
              <path d={`M0 0h5l-4 ${CARD_H.toFixed(1)}h-5Z`} className="isometric88-sheen fill-white/30" />
            </g>
            <rect x={2.5} y={2.5} width={CARD_W - 5} height={CARD_H - 5} rx={0.75} fill="none" strokeWidth={0.5} className={text.replace("fill-", "stroke-")} opacity={0.5} />
            <text x={CARD_W / 2} y={CARD_H / 2} textAnchor="middle" dominantBaseline="central" fontSize={5} className={cn("font-medium", text)}>
              {label}
            </text>
          </g>
          {/* The open end of the fold: the shaded inside between the two panels, their edges as the card's thickness */}
          <polygon points={END} className="fill-black/30" />
          <polyline points={END} fill="none" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" className={card.base.replace("fill-", "stroke-")} />
          <polyline points={END} fill="none" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" className={card.right.replace("fill-", "stroke-")} />
        </g>
      </svg>
    </div>
  );
}
