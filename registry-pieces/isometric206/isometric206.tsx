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

interface Isometric206Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the picked section's button and feature card with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric206Demo: Isometric206Props = {
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

const BASE = 6;
// An open file box; the cards stand in it back to front, each shorter than the one behind
const BIN = { x: 12, y: 8, w: 96, d: 48, wall: 2.5, h: 26 };
const FLOOR = BASE + 1.5;
const CARD = { x: 17, w: 86, t: 3.5 };
const RISE = 22;
type Layout = "footer" | "hero" | "features" | "text";
const CARDS: { id: Layout; y: number; h: number; lift?: "a" | "b" }[] = [
  { id: "footer", y: 13, h: 66 },
  { id: "hero", y: 22.5, h: 58, lift: "a" },
  { id: "features", y: 32, h: 50, lift: "b" },
  { id: "text", y: 41.5, h: 42 },
];
const PERIOD = 10;

const STYLES = `
@keyframes isometric206-a { 0%, 6% { transform: translateY(0px); } 17%, 40% { transform: translateY(${-RISE}px); } 51%, 100% { transform: translateY(0px); } }
@keyframes isometric206-b { 0%, 53% { transform: translateY(0px); } 64%, 87% { transform: translateY(${-RISE}px); } 98%, 100% { transform: translateY(0px); } }
.isometric206-a { animation: isometric206-a ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.isometric206-b { animation: isometric206-b ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.isometric206-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric206-scene * { animation: none !important; } }
`;

/** What a card shows on its face: a header strip every card has, and the layout under it. */
function Face({ id, body, mine, accent }: { id: Layout; body: Paint; mine: Paint; accent: boolean }) {
  return (
    <>
      <circle cx={6.5} cy={6} r={2} className={body.ink} />
      <rect x={11} y={4.8} width={20} height={2.4} rx={1.2} className={body.ink} />
      <rect x={CARD.w - 18} y={4.4} width={12} height={3.2} rx={1.6} className={body.ink} />
      {id === "hero" && (
        <>
          <rect x={6} y={17} width={32} height={4.6} rx={2.3} className={body.ink} />
          <rect x={6} y={23.8} width={24} height={2.4} rx={1.2} className={body.ink} />
          <rect x={6} y={28} width={19} height={5.6} rx={2.8} className={accent ? mine.base : body.ink} />
          <rect x={48} y={16.5} width={32} height={17.5} rx={3.5} className={body.ink} />
          <circle cx={56} cy={22} r={2.4} className={body.base} />
          <path d="M50 32.5l8 -6.5l5 3.5l6 -7.5l9 10.5Z" className={body.base} />
        </>
      )}
      {id === "features" &&
        [6, 32, 58].map((x, index) => (
          <g key={`feature-${x}`}>
            <rect x={x} y={16.5} width={22} height={17} rx={3.5} className={accent && index === 1 ? mine.base : body.ink} />
            <circle cx={x + 5.5} cy={21.5} r={2.2} className={accent && index === 1 ? mine.ink : body.base} />
            <rect x={x + 3.5} y={25.8} width={15} height={2} rx={1} className={accent && index === 1 ? mine.ink : body.base} />
            <rect x={x + 3.5} y={29.4} width={10} height={2} rx={1} className={accent && index === 1 ? mine.ink : body.base} />
          </g>
        ))}
    </>
  );
}

export function Isometric206({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric206Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric206-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-68 -80 184 184" aria-hidden="true" className="isometric206-scene size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 120, 64, BASE, 12)} paint={body} />
        {/* The box: floor, back and far side wall first, then the cards, then the near walls */}
        <Block faces={box(BIN.x, BIN.y, BASE, BIN.w, BIN.d, 1.5)} paint={body} />
        <Block faces={box(BIN.x, BIN.y, BASE, BIN.w, BIN.wall, BIN.h)} paint={body} />
        <Block faces={box(BIN.x, BIN.y, BASE, BIN.wall, BIN.d, BIN.h)} paint={body} />
        {CARDS.map((card) => (
          <g key={`card-${card.id}`} className={card.lift && `isometric206-${card.lift}`}>
            <Block faces={box(CARD.x, card.y, FLOOR, CARD.w, CARD.t, card.h)} paint={body} />
            <g transform={`${onLeft(card.y + CARD.t)} translate(${CARD.x} ${-(FLOOR + card.h)})`}>
              <Face id={card.id} body={body} mine={mine} accent={accent} />
            </g>
          </g>
        ))}
        <Block faces={box(BIN.x + BIN.w - BIN.wall, BIN.y, BASE, BIN.wall, BIN.d, BIN.h)} paint={body} />
        <Block faces={box(BIN.x, BIN.y + BIN.d - BIN.wall, BASE, BIN.w, BIN.wall, BIN.h)} paint={body} />
        {/* A label holder and a pull on the front of the box */}
        <g transform={onLeft(BIN.y + BIN.d)} className={body.ink}>
          <rect x={BIN.x + 10} y={-(BASE + 20)} width={26} height={8} rx={2} />
          <rect x={BIN.x + BIN.w - 34} y={-(BASE + 17.5)} width={24} height={3} rx={1.5} />
        </g>
      </svg>
    </div>
  );
}
