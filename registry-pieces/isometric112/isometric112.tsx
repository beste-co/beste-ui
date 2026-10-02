"use client";

import type { ReactNode } from "react";
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

interface Isometric112Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the card sliding out with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric112Demo: Isometric112Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

type Plan = [number, number][];

/** A flat solid standing on a plan outline, showing only the sides that face the viewer. */
function prism(outline: Plan, z: number, h: number) {
  const area = outline.reduce((sum, [ax, ay], index) => {
    const [bx, by] = outline[(index + 1) % outline.length] as [number, number];
    return sum + ax * by - bx * ay;
  }, 0);
  const points = area < 0 ? [...outline].reverse() : outline;
  const sides = points.flatMap(([ax, ay], index) => {
    const [bx, by] = points[(index + 1) % points.length] as [number, number];
    const [nx, ny] = [by - ay, ax - bx];
    if (nx + ny <= 0) return [];
    return [{ points: polygon([[ax, ay, z + h], [bx, by, z + h], [bx, by, z], [ax, ay, z]]), left: ny > nx }];
  });
  return { top: polygon(points.map(([px, py]): Point => [px, py, z + h])), sides };
}

function Prism({ shape, paint }: { shape: ReturnType<typeof prism>; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      {shape.sides.map((side) => (
        <g key={side.points}>
          <polygon points={side.points} className={paint.base} />
          <polygon points={side.points} className={side.left ? paint.left : paint.right} stroke="none" />
        </g>
      ))}
      <polygon points={shape.top} className={paint.base} />
    </g>
  );
}

const W = 104;
const D = 62;
const LEAF = 5;
const TOP = LEAF;
const MID = W / 2;
// Plan outline of the opened bifold, all four corners rounded
const arc = (cx: number, cy: number, from: number): Plan =>
  Array.from({ length: 7 }, (_, k) => {
    const angle = ((from + k * 15) * Math.PI) / 180;
    return [cx + 8 * Math.cos(angle), cy + 8 * Math.sin(angle)] as [number, number];
  });
const OUTLINE: Plan = [...arc(8, 8, 180), ...arc(W - 8, 8, 270), ...arc(W - 8, D - 8, 0), ...arc(8, D - 8, 90)];
const WALLET = prism(OUTLINE, 0, LEAF);
// Card pockets on the right panel: each mouth is a slit along x, and a card slides out of it toward the back edge
const POCKET = { x: MID + 6, w: 40, end: D - 5 };
const CARD = { x: POCKET.x + 2, w: POCKET.w - 4, h: 24 };
const PEEK = 5;
const LIPS = [24, 33, 42];
const SLIDE = 15;
// The front card rests pulled out, with its last few units still inside the pocket
const OUT_Y = (LIPS[0] ?? 0) - PEEK - SLIDE;
const dashes = (from: number, to: number, step: number) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);
const STITCH = [4, MID - 8, MID + 4, W - 8].flatMap((x, side) =>
  dashes(11, D - 14, 6).map((y) => ({ x: side % 2 ? x + 2.8 : x, y, w: 1.2, h: 3.4 })),
).concat(
  [3.4, D - 4.6].flatMap((y) => [...dashes(10, MID - 13, 6), ...dashes(MID + 10, W - 13, 6)].map((x) => ({ x, y, w: 3.4, h: 1.2 }))),
);

const STYLES = `
@keyframes isometric112-card { 0%, 12% { transform: translateY(${SLIDE}px); } 34% { transform: translateY(-1.5px); } 40%, 78% { transform: translateY(0); } 92%, 100% { transform: translateY(${SLIDE}px); } }
.isometric112-card { animation: isometric112-card 5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.isometric112-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric112-card { animation: none; } }
`;

export function Isometric112({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric112Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const line = body.ink.replace("fill-", "stroke-");

  /** A card lying flat in its pocket: a thin dark underside and the face just above it. */
  const card = (y: number, own: Paint, moving: boolean, face?: ReactNode) =>
    [TOP + 0.3, TOP + 1.1].map((z, layer) => (
      <g key={z} transform={onTop(z)}>
        <g className={moving ? "isometric112-card" : undefined}>
          <rect x={CARD.x} y={y} width={CARD.w} height={CARD.h} rx={2} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(own.base, own.edge)} />
          {layer === 0 ? <rect x={CARD.x} y={y} width={CARD.w} height={CARD.h} rx={2} className={own.right} /> : face}
        </g>
      </g>
    ));

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric112-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-62 -14 160 106" aria-hidden="true" className="size-full overflow-visible">
        <Prism shape={WALLET} paint={body} />
        <g transform={onTop(TOP)}>
          <rect x={MID - 3} y={0} width={6} height={D} className={body.right} />
          <line x1={MID} y1={1} x2={MID} y2={D - 1} strokeWidth={1} vectorEffect="non-scaling-stroke" className={line} />
          <g className={body.ink}>
            {STITCH.map((stitch) => (
              <rect key={`${stitch.x}-${stitch.y}`} x={stitch.x} y={stitch.y} width={stitch.w} height={stitch.h} rx={0.6} />
            ))}
            <rect x={10} y={12} width={MID - 22} height={1.5} rx={0.75} />
            <rect x={14} y={D - 22} width={14} height={9} rx={2} />
          </g>
        </g>
        {LIPS.map((lip, index) => (
          <g key={lip}>
            {index === 0
              ? card(OUT_Y, paint.accent, true, (
                  <g className={paint.accent.ink}>
                    <rect x={CARD.x + 4} y={OUT_Y + 4} width={8} height={6} rx={1.5} />
                    <rect x={CARD.x + 4} y={OUT_Y + 14} width={20} height={2} rx={1} />
                    <rect x={CARD.x + CARD.w - 11} y={OUT_Y + 4} width={7} height={4} rx={2} />
                  </g>
                ))
              : card(lip - PEEK, body, false, <rect x={CARD.x + 4} y={lip - PEEK + 1.8} width={14} height={1.5} rx={0.75} className={body.ink} />)}
            {/* The pocket face covers whatever part of the card is still inside */}
            <g transform={onTop(TOP + 1.4)}>
              <rect x={POCKET.x} y={lip} width={POCKET.w} height={POCKET.end - lip} rx={1.5} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(body.base, body.edge)} />
              <rect x={POCKET.x} y={lip} width={POCKET.w} height={1.6} rx={0.8} className={body.right} />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
