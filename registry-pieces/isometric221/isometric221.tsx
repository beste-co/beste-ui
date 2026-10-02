"use client";

import { useId } from "react";
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

interface Isometric221Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the submit button, the card marks and the counter dots with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric221Demo: Isometric221Props = {
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
const PERIOD = 10;
// The form block on the left prints each submission out of a slot in its side
const FORM = { x: 10, y: 18, w: 48, d: 64, h: 14 };
const EDGE = FORM.x + FORM.w;
const TRAY = { x: 96, y: 22, w: 46, d: 58 };
const CARD = { x: 104, y: 34, w: 30, d: 36, h: 1.6 };
// Each card lands a little higher and a little further back than the one before
const CARDS = [0, 1, 2].map((index) => ({ index, z: BASE + 2 + index * 1.9, y: CARD.y - index * 2, start: 8 + index * 18 }));
const TRAVEL = CARD.x - (EDGE - CARD.w - 2);
const SHIFT = `${(-TRAVEL * C).toFixed(1)}px, ${(-TRAVEL * S).toFixed(1)}px`;
/** The part of a card's path that lies outside the form block, so a card shows only once it leaves the slot. */
const outside = (z: number) =>
  polygon([
    [EDGE, 16, z + CARD.h + 0.6],
    [190, 16, z + CARD.h + 0.6],
    [190, 84, z + CARD.h + 0.6],
    [190, 84, z - 0.6],
    [EDGE, 84, z - 0.6],
    [EDGE, 84, z + CARD.h + 0.6],
  ]);

const STYLES = `
${CARDS.map(({ index, start }) => `@keyframes isometric221-card${index} { 0%, ${start}% { transform: translate(${SHIFT}); } ${start + 13}%, 100% { transform: translate(0px, 0px); } }
@keyframes isometric221-count${index} { 0%, ${start + 10}% { opacity: 0; } ${start + 14}%, 88% { opacity: 1; } 94%, 100% { opacity: 0; } }
.isometric221-card${index} { animation: isometric221-card${index} ${PERIOD}s ease-in-out infinite; }
.isometric221-count${index} { animation: isometric221-count${index} ${PERIOD}s ease-in-out infinite; }`).join("\n")}
@keyframes isometric221-stack { 0%, 88% { opacity: 1; } 94%, 100% { opacity: 0; } }
.isometric221-stack { animation: isometric221-stack ${PERIOD}s ease-in-out infinite; }
.isometric221-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric221-scene * { animation: none !important; } }
`;

export function Isometric221({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric221Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const clipId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric221-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-96 -24 238 158" aria-hidden="true" className="isometric221-scene size-full overflow-visible">
        <defs>
          {CARDS.map(({ index, z }) => (
            <clipPath key={`clip-${index}`} id={`${clipId}-${index}`}>
              <polygon points={outside(z)} />
            </clipPath>
          ))}
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 152, 98, BASE, 14)} paint={body} />
        {/* The form block: fields and a submit button on top, the slot in its side */}
        <Block faces={box(FORM.x, FORM.y, BASE, FORM.w, FORM.d, FORM.h)} paint={body} />
        <g transform={`${onTop(BASE + FORM.h)} translate(${FORM.x} ${FORM.y})`}>
          <rect x={6} y={7} width={22} height={3.4} rx={1.7} className={body.ink} />
          {[16, 28, 40].map((y) => (
            <g key={`field-${y}`}>
              <rect x={6} y={y} width={36} height={8} rx={3} className={body.ink} />
              <rect x={9} y={y + 2.9} width={y === 28 ? 22 : 16} height={2.2} rx={1.1} className={body.base} />
            </g>
          ))}
          <rect x={6} y={52} width={20} height={7.5} rx={3.75} className={accent ? mine.base : body.ink} />
          <rect x={11} y={54.7} width={10} height={2.1} rx={1.05} className={accent ? mine.ink : body.base} />
        </g>
        <g transform={onRight(EDGE)}>
          <rect x={CARD.y - 6} y={-(BASE + 9.5)} width={CARD.d + 6} height={7.5} rx={1.5} className={body.ink} />
          <rect x={CARD.y - 6} y={-(BASE + 9.5)} width={CARD.d + 6} height={7.5} rx={1.5} className={body.ink} />
        </g>
        {/* A low chute from the slot to the tray, then the tray: a floor, a tall back plate and two low walls */}
        <Block faces={box(EDGE, 28, BASE, TRAY.x - EDGE, 46, 2)} paint={body} />
        <Block faces={box(TRAY.x, TRAY.y, BASE, TRAY.w, TRAY.d, 2)} paint={body} />
        <Block faces={box(TRAY.x, TRAY.y, BASE, TRAY.w + 2, 2, 18)} paint={body} />
        {/* The counter on the back plate lights one dot for every card that has landed */}
        <g transform={onLeft(TRAY.y + 2)}>
          <rect x={TRAY.x + 12} y={-(BASE + 16)} width={24} height={7} rx={3.5} className={body.ink} />
          {CARDS.map(({ index }) => (
            <circle key={`count-${index}`} cx={TRAY.x + 18 + index * 6} cy={-(BASE + 12.5)} r={1.8} className={cn(`isometric221-count${index}`, accent ? mine.base : body.base)} />
          ))}
        </g>
        <g className="isometric221-stack">
          {CARDS.map(({ index, z, y }) => (
            <g key={`card-${index}`} clipPath={`url(#${clipId}-${index})`}>
              <g className={`isometric221-card${index}`}>
                <Block faces={box(CARD.x, y, z, CARD.w, CARD.d, CARD.h)} paint={body} />
                <g transform={`${onTop(z + CARD.h)} translate(${CARD.x} ${y})`}>
                  <circle cx={6.5} cy={7} r={2.8} className={accent ? mine.base : body.ink} />
                  <rect x={12} y={5.8} width={13} height={2.4} rx={1.2} className={body.ink} />
                  {[14, 19.5, 25].map((line) => (
                    <rect key={`line-${line}`} x={4} y={line} width={line === 25 ? 14 : 22} height={2.2} rx={1.1} className={body.ink} />
                  ))}
                </g>
              </g>
            </g>
          ))}
        </g>
        <Block faces={box(TRAY.x + TRAY.w, TRAY.y, BASE, 2, TRAY.d, 6)} paint={body} />
        <Block faces={box(TRAY.x, TRAY.y + TRAY.d - 2, BASE, TRAY.w + 2, 2, 6)} paint={body} />
      </svg>
    </div>
  );
}
