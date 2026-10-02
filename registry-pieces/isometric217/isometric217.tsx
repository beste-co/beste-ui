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

interface Isometric217Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the picked card's price and item and the cart counter with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric217Demo: Isometric217Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};


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

type Round = ReturnType<typeof roundBox>;

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

const BASE = 6;
const SLAB = { x: 10, y: 10, w: 122, d: 96, h: 4 };
const Z = BASE + SLAB.h;
const CARD = { w: 34, d: 32, h: 3 };
const COLS = [16, 54, 92];
const ROWS = [28, 66];
// The item standing on each card: a box, a jar, a tin
const ITEMS = [
  { w: 11, d: 9, h: 5, r: 2 },
  { w: 9, d: 9, h: 7, r: 4.5 },
  { w: 12, d: 8, h: 3.5, r: 3 },
];
const CARDS = ROWS.flatMap((y, row) => COLS.map((x, col) => ({ x, y, index: row * 3 + col })));
const PICK = 4;
const PERIOD = 8;

const STYLES = `
@keyframes isometric217-lift { 0%, 22%, 68%, 100% { transform: translateY(0px); } 34%, 56% { transform: translateY(-6px); } }
@keyframes isometric217-added { 0%, 40% { opacity: 0; } 48%, 86% { opacity: 1; } 94%, 100% { opacity: 0; } }
.isometric217-lift { animation: isometric217-lift ${PERIOD}s ease-in-out infinite; }
.isometric217-added { animation: isometric217-added ${PERIOD}s ease-in-out infinite; }
.isometric217-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric217-scene * { animation: none !important; } }
`;

export function Isometric217({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric217Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric217-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-112 -26 248 170" aria-hidden="true" className="isometric217-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 142, 116, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(SLAB.x, SLAB.y, BASE, SLAB.w, SLAB.d, SLAB.h, 8)} paint={body} />
        {/* The page header: a title and the cart, whose counter lights up when a card is picked */}
        <g transform={onTop(Z)}>
          <rect x={16} y={15.5} width={30} height={4.6} rx={2.3} className={body.ink} />
          <rect x={50} y={16.4} width={14} height={2.8} rx={1.4} className={body.ink} />
          <rect x={108} y={13.5} width={18} height={8.4} rx={4.2} className={body.ink} />
          <rect x={111.5} y={16.4} width={6} height={2.6} rx={1.3} className={body.base} />
          <circle cx={121.6} cy={17.7} r={2.5} className={cn("isometric217-added", accent ? mine.base : body.base)} />
          {CARDS.map((card) => (
            <rect key={`seat-${card.index}`} x={card.x + 1} y={card.y + 1} width={CARD.w - 2} height={CARD.d - 2} rx={4} className={body.ink} />
          ))}
        </g>
        {CARDS.map((card) => {
          const picked = card.index === PICK;
          const item = ITEMS[card.index % ITEMS.length] ?? { w: 10, d: 9, h: 5, r: 2 };
          return (
            <g key={`card-${card.index}`} className={picked ? "isometric217-lift" : undefined}>
              <RoundBlock shape={roundBox(card.x, card.y, Z, CARD.w, CARD.d, CARD.h, 5)} paint={body} />
              <g transform={`${onTop(Z + CARD.h)} translate(${card.x} ${card.y})`}>
                <rect x={3} y={3} width={CARD.w - 6} height={16} rx={3.5} className={body.ink} />
                <rect x={3} y={22} width={13} height={2.4} rx={1.2} className={body.ink} />
                <rect x={3} y={26.2} width={8} height={2.2} rx={1.1} className={body.ink} />
                <rect x={20} y={21.6} width={11} height={6.6} rx={3.3} className={picked && accent ? mine.base : body.ink} />
                <rect x={22.8} y={23.9} width={5.4} height={2} rx={1} className={picked && accent ? mine.ink : body.base} />
              </g>
              <RoundBlock
                shape={roundBox(card.x + (CARD.w - item.w) / 2, card.y + 11 - item.d / 2, Z + CARD.h, item.w, item.d, item.h, item.r)}
                paint={picked ? mine : body}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
