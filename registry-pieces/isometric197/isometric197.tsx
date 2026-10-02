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

interface Isometric197Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the earbuds, the battery levels and the check with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric197Demo: Isometric197Props = {
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
// The phone lies flat on the desk, screen up
const PHONE = { x: 14, y: 9, w: 64, tall: 118, thick: 5 };
const W = PHONE.w;
const TALL = PHONE.tall;
const SCREEN_Z = BASE + PHONE.thick;
// The charging case and its lid, swung up square about the hinge on the back edge
const CASE = { x: 86, y: 52, w: 34, d: 26, h: 16, r: 10, lid: 7 };
const CASE_TOP = BASE + CASE.h;
const LID_SLICES = Array.from({ length: CASE.lid + 1 }, (_, index) => CASE.y - CASE.lid + index);
const BUDS = [CASE.x + 11, CASE.x + 23];

const PERIOD = 10;
const SHEET = { y: 62, h: TALL - 65 };
const HIDE = SHEET.h + 6;
// Battery rows on the pairing card: left bud, right bud, case
const TRACK = { x: 17, w: 30 };
const LEVELS = [0.85, 0.7, 0.45];
const CHECK = "M-2.6 0.2L-0.8 2L2.8 -2";

const STYLES = `
@keyframes isometric197-sheet { 0%, 10% { transform: translateY(${HIDE}px); } 20%, 90% { transform: translateY(0); } 98%, 100% { transform: translateY(${HIDE}px); } }
@keyframes isometric197-pair { 0%, 30%, 38%, 100% { transform: scale(1); } 34% { transform: scale(0.94); } }
${LEVELS.map((level, index) => `@keyframes isometric197-level${index} { 0%, ${40 + index * 4}% { transform: translateX(${(-TRACK.w * level).toFixed(1)}px); } ${54 + index * 4}%, 100% { transform: translateX(0); } }
.isometric197-level${index} { animation: isometric197-level${index} ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; }`).join("\n")}
@keyframes isometric197-done { 0%, 62% { opacity: 0; } 66%, 100% { opacity: 1; } }
@keyframes isometric197-check { 0%, 64% { stroke-dashoffset: 8; } 72%, 100% { stroke-dashoffset: 0; } }
@keyframes isometric197-led { 0%, 12% { opacity: 0.25; } 18%, 24% { opacity: 1; } 30% { opacity: 0.25; } 36%, 90% { opacity: 1; } 98%, 100% { opacity: 0.25; } }
.isometric197-sheet { animation: isometric197-sheet ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
.isometric197-pair { animation: isometric197-pair ${PERIOD}s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric197-done { animation: isometric197-done ${PERIOD}s linear infinite; }
.isometric197-check { stroke-dasharray: 8; animation: isometric197-check ${PERIOD}s ease-out infinite; }
.isometric197-led { animation: isometric197-led ${PERIOD}s ease-in-out infinite; }
.isometric197-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric197-scene * { animation: none !important; } }
`;

export function Isometric197({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric197Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const lid = { x: CASE.x, y: -(CASE_TOP + CASE.d), width: CASE.w, height: CASE.d, rx: CASE.r };

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric197-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-128 -18 252 160" aria-hidden="true" className="isometric197-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} />
          </clipPath>
          {LEVELS.map((_, index) => (
            <clipPath key={`track-${index}`} id={`${clipId}-track${index}`}>
              <rect x={TRACK.x} y={SHEET.y + 22 + index * 7} width={TRACK.w} height={3.6} rx={1.8} />
            </clipPath>
          ))}
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 130, 136, BASE, 16)} paint={body} />
        <RoundBlock shape={roundBox(PHONE.x, PHONE.y, BASE, W, TALL, PHONE.thick, 9)} paint={body} />
        <g transform={onRight(PHONE.x + W)}>
          <rect x={PHONE.y + 30} y={-(BASE + 3.4)} width={16} height={1.6} rx={0.8} className={body.ink} />
        </g>
        <g transform={`${onTop(SCREEN_Z)} translate(${PHONE.x} ${PHONE.y})`}>
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          {/* The player behind the card: cover, title and progress */}
          <rect x={17} y={17} width={30} height={30} rx={5} className={cn(body.base, "opacity-60")} />
          <circle cx={32} cy={32} r={7} className={body.ink} />
          <circle cx={32} cy={32} r={2} className={body.base} />
          <rect x={17} y={51} width={22} height={2.8} rx={1.4} className={body.base} />
          <rect x={17} y={56.5} width={14} height={2.2} rx={1.1} className={cn(body.base, "opacity-60")} />
          {/* The pairing card slides up from the bottom of the screen */}
          <g clipPath={`url(#${clipId})`}>
            <g className="isometric197-sheet">
              <rect x={3} y={SHEET.y} width={W - 6} height={SHEET.h + 8} rx={7} strokeWidth={0.9} className={cn(body.base, body.edge)} />
              <rect x={W / 2 - 6} y={SHEET.y + 3} width={12} height={1.6} rx={0.8} className={body.ink} />
              {/* The two buds, their name, and the check once they are connected */}
              {[9, 16].map((x) => (
                <g key={`icon-${x}`} className={accent ? mine.base : body.ink}>
                  <circle cx={x + 2.2} cy={SHEET.y + 11} r={2.6} />
                  <rect x={x + 1.2} y={SHEET.y + 11} width={2} height={6} rx={1} />
                </g>
              ))}
              <rect x={26} y={SHEET.y + 9.5} width={20} height={2.8} rx={1.4} className={body.ink} />
              <rect x={26} y={SHEET.y + 14.5} width={13} height={2.2} rx={1.1} className={body.ink} />
              <g transform={`translate(52 ${SHEET.y + 13})`} className="isometric197-done">
                <circle r={4.6} className={accent ? mine.base : body.ink} />
                <path d={CHECK} fill="none" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" className={cn("isometric197-check", onAccent)} />
              </g>
              {LEVELS.map((level, index) => {
                const y = SHEET.y + 22 + index * 7;
                return (
                  <g key={`level-${index}`}>
                    <circle cx={11} cy={y + 1.8} r={1.8} className={body.ink} />
                    <rect x={TRACK.x} y={y} width={TRACK.w} height={3.6} rx={1.8} className={body.ink} />
                    <g clipPath={`url(#${clipId}-track${index})`}>
                      <rect x={TRACK.x - TRACK.w * (1 - level)} y={y} width={TRACK.w} height={3.6} rx={1.8} className={cn(`isometric197-level${index}`, accent ? mine.base : body.ink)} />
                    </g>
                    <rect x={50} y={y + 0.4} width={7} height={2.8} rx={1.4} className={body.ink} />
                  </g>
                );
              })}
              <g className="isometric197-pair">
                <rect x={8} y={SHEET.y + 43} width={W - 16} height={9} rx={4.5} className={accent ? mine.base : body.ink} />
                <rect x={24} y={SHEET.y + 46.3} width={16} height={2.4} rx={1.2} className={accent ? mine.ink : body.base} />
              </g>
            </g>
          </g>
        </g>
        {/* The lid stands open behind the case: outlines first, fills over them, then its inner face */}
        <g className={body.edge} strokeWidth={1}>
          {LID_SLICES.map((y) => (
            <rect key={`lid-edge-${y}`} {...lid} transform={onLeft(y)} className={body.base} />
          ))}
          {LID_SLICES.map((y) => (
            <g key={`lid-fill-${y}`} transform={onLeft(y)} stroke="none">
              <rect {...lid} className={body.base} />
              <rect {...lid} className={body.right} />
            </g>
          ))}
          <g transform={onLeft(CASE.y)}>
            <rect {...lid} className={body.base} />
            <rect {...lid} className={body.left} stroke="none" />
            <rect x={lid.x + 3} y={lid.y + 3} width={lid.width - 6} height={lid.height - 6} rx={CASE.r - 3} stroke="none" className={body.ink} />
          </g>
        </g>
        <RoundBlock shape={roundBox(CASE.x, CASE.y, BASE, CASE.w, CASE.d, CASE.h, CASE.r)} paint={body} />
        <g transform={onTop(CASE_TOP)}>
          <rect x={CASE.x + 3} y={CASE.y + 3} width={CASE.w - 6} height={CASE.d - 6} rx={CASE.r - 3} className={body.ink} />
        </g>
        {/* The buds sit in their wells and stand a little proud of the case */}
        {BUDS.map((x) => (
          <RoundBlock key={`bud-${x}`} shape={roundBox(x - 4.5, CASE.y + CASE.d / 2 - 4.5, CASE_TOP - 1, 9, 9, 6, 4.5)} paint={mine} />
        ))}
        <g transform={onLeft(CASE.y + CASE.d)}>
          <circle cx={CASE.x + CASE.w / 2} cy={-(BASE + 6)} r={1.6} className={cn("isometric197-led", accent ? mine.base : body.ink)} />
        </g>
      </svg>
    </div>
  );
}
