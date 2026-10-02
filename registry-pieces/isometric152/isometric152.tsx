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

interface Isometric152Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Ink the fresh stamp with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric152Demo: Isometric152Props = {
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

const COVER = 2;
const PAGE = COVER + 4;
const PW = 46;
const PD = 64;
const RX = 52;
const MARK = { x: RX + 24, y: 38 };
const LIFT = 20;
const Z0 = PAGE + LIFT;
const PERIOD = 4.8;
const PLANE = "M0 -6.5L1.4 -2L6.5 1V2.6L1.4 1L1 4.6L2.8 6V7.2L0 6.4L-2.8 7.2V6L-1 4.6L-1.4 1L-6.5 2.6V1L-1.4 -2Z";
const LINES = [36, 42, 48];

const STYLES = `
@keyframes isometric152-stamp { 0%, 18% { transform: translateY(0); } 30%, 36% { transform: translateY(${LIFT}px); } 52%, 100% { transform: translateY(0); } }
@keyframes isometric152-shadow { 0%, 18% { transform: scale(0.75); opacity: 0.4; } 30%, 36% { transform: scale(1); opacity: 1; } 52%, 100% { transform: scale(0.75); opacity: 0.4; } }
@keyframes isometric152-mark { 0%, 34% { opacity: 0; } 36%, 86% { opacity: 1; } 94%, 100% { opacity: 0; } }
.isometric152-stamp { animation: isometric152-stamp ${PERIOD}s cubic-bezier(0.5, 0, 0.3, 1) infinite; will-change: transform; }
.isometric152-shadow { animation: isometric152-shadow ${PERIOD}s cubic-bezier(0.5, 0, 0.3, 1) infinite; transform-box: fill-box; transform-origin: center; }
.isometric152-mark { animation: isometric152-mark ${PERIOD}s linear infinite; }
.isometric152-still * { animation: none !important; }
.isometric152-still .isometric152-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric152-stamp, .isometric152-shadow, .isometric152-mark { animation: none; } .isometric152-rest { opacity: 1; } }
`;

function Seal({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <>
      <circle r={12} fill="none" strokeWidth={2} className={stroke} />
      <circle r={8.5} fill="none" strokeWidth={1} className={stroke} />
      <path d={PLANE} className={fill} transform="scale(0.85)" />
    </>
  );
}

export function Isometric152({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric152Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const fresh = accent ? (palette === "tone" ? "fill-white" : "fill-current") : body.ink.replace("/15", "/40");
  const old = body.ink;
  const stroke = (cls: string) => cls.replace("fill-", "stroke-");

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric152-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-72 -30 172 132" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, RX + PW + 2, PD + 4, COVER)} paint={body} />
        <Block faces={box(2, 2, COVER, PW, PD, PAGE - COVER)} paint={body} />
        <Block faces={box(RX, 2, COVER, PW, PD, PAGE - COVER)} paint={body} />
        <g transform={onTop(PAGE)}>
          <g className={body.ink}>
            <rect x={PW - 2} y={2} width={4} height={PD} />
            <rect x={8} y={10} width={16} height={20} rx={2} />
            <rect x={28} y={11} width={14} height={3} rx={1.5} />
            <rect x={28} y={18} width={10} height={3} rx={1.5} />
            <rect x={28} y={25} width={12} height={3} rx={1.5} />
            {LINES.map((y, index) => (
              <rect key={y} x={8} y={y} width={index === 2 ? 22 : 34} height={2} rx={1} />
            ))}
            <rect x={8} y={56} width={34} height={2} rx={1} />
            <rect x={8} y={60} width={34} height={2} rx={1} />
          </g>
          <g className={body.base}>
            <circle cx={16} cy={17} r={3.5} />
            <path d="M10 30a6 5 0 0 1 12 0Z" />
          </g>
          <g transform={`translate(${RX + 14} 52) rotate(18)`} className={old}>
            <rect x={-10} y={-7} width={20} height={14} rx={3} fill="none" strokeWidth={1.5} className={stroke(old)} />
            <rect x={-6} y={-1} width={12} height={2} rx={1} />
          </g>
          <g transform={`translate(${MARK.x} ${MARK.y}) rotate(-14)`} className="isometric152-mark isometric152-rest opacity-0">
            <Seal fill={fresh} stroke={stroke(fresh)} />
          </g>
          <ellipse cx={MARK.x} cy={MARK.y} rx={15} ry={15} className={cn("isometric152-shadow opacity-40", body.ink)} />
        </g>
        <g className="isometric152-stamp">
          <RoundBlock shape={roundBox(MARK.x - 14, MARK.y - 14, Z0, 28, 28, 4, 14)} paint={body} />
          <RoundBlock shape={roundBox(MARK.x - 12, MARK.y - 12, Z0 + 4, 24, 24, 8, 12)} paint={body} />
          <RoundBlock shape={roundBox(MARK.x - 4, MARK.y - 4, Z0 + 12, 8, 8, 14, 4)} paint={body} />
          <RoundBlock shape={roundBox(MARK.x - 9, MARK.y - 9, Z0 + 26, 18, 18, 10, 9)} paint={body} />
        </g>
      </svg>
    </div>
  );
}
