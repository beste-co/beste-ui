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

interface Isometric147Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the pump's counter with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  /** The amount the counter stops at; it ticks up to it in 8 steps. */
  total?: number;
  className?: string;
}

export const isometric147Demo: Isometric147Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
  total: 34.55,
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

const G = 8;
const L = 88;
const D = 36;
const CAR = roundBox(0, 0, G + 6, L, D, 16, 8);
const CABIN = roundBox(20, 3, G + 22, 44, 30, 14, 8);
const WHEELS = [19, 69];
// Pump on its island, in front of the car's rear
const ISLAND = 12;
const PX = -38;
const PY = 30;
const PW = 22;
const PD = 12;
const PH = 50;
const PERIOD = 4;
const STEPS = 8;
const HOSE: Record<Palette, string> = {
  theme: "stroke-foreground/30",
  light: "stroke-zinc-950/30",
  dark: "stroke-black/50",
  tone: "stroke-black/30",
};
const at = (point: Point) => project(point).split(",").map(Number) as [number, number];
const [AX, AY] = at([PX + PW, PY + 6, ISLAND + 26]);
const [BX, BY] = at([10, D + 6, G + 18]);
const CORD = `M${AX} ${AY}C${AX + 2} ${AY + 30} ${BX - 8} ${BY + 26} ${BX} ${BY}`;

function styles(count: number) {
  const slot = 100 / count;
  return `
@keyframes isometric147-tick { 0%, ${(slot - 0.1).toFixed(2)}% { opacity: 1; } ${slot.toFixed(2)}%, 100% { opacity: 0; } }
@keyframes isometric147-last { 0%, ${(100 - slot - 0.1).toFixed(2)}% { opacity: 0; } ${(100 - slot).toFixed(2)}%, 100% { opacity: 1; } }
.isometric147-tick { animation: isometric147-tick ${PERIOD}s linear infinite; }
.isometric147-last { animation: isometric147-last ${PERIOD}s linear infinite; }
.isometric147-still * { animation: none !important; }
.isometric147-still .isometric147-tick { opacity: 0; }
.isometric147-still .isometric147-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric147-tick, .isometric147-last { animation: none; } .isometric147-tick { opacity: 0; } .isometric147-rest { opacity: 1; } }
`;
}

function Wheel({ x, y, paint }: { x: number; y: number; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1}>
      <g transform={onLeft(y - 4)}>
        <circle cx={x} cy={-G - 9} r={9} className={paint.base} vectorEffect="non-scaling-stroke" />
        <circle cx={x} cy={-G - 9} r={9} className={paint.left} stroke="none" />
      </g>
      <g transform={onLeft(y)}>
        <circle cx={x} cy={-G - 9} r={9} className={paint.base} vectorEffect="non-scaling-stroke" />
        <circle cx={x} cy={-G - 9} r={4} className={paint.ink} stroke="none" />
      </g>
    </g>
  );
}

export function Isometric147({
  tone = "color", color = DEFAULT_COLOR,
  palette: paletteProp = "theme",
  accent: accentProp = true,
  animated = true,
  total = 34.55,
  className,
}: Isometric147Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const screen = paint.accent;
  const digits = !accent ? body.ink.replace("/15", "/40") : palette === "tone" ? "fill-current" : "fill-white";
  const list = Array.from({ length: STEPS }, (_, index) => Math.max(0, total - (STEPS - 1 - index) * 0.35).toFixed(2));

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric147-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{styles(list.length)}</style>
      <svg viewBox="-98 -82 196 164" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-48, -8, 0, 144, 64, G)} paint={body} />
        <g transform={onTop(G)} className={body.ink}>
          <rect x={-4} y={-4} width={96} height={2} rx={1} />
          <rect x={-4} y={44} width={96} height={2} rx={1} />
        </g>
        {WHEELS.map((x) => (
          <Wheel key={x} x={x} y={4} paint={body} />
        ))}
        <RoundBlock shape={CAR} paint={body} />
        <RoundBlock shape={CABIN} paint={body} />
        <g transform={onLeft(D - 3)} className={body.ink}>
          <rect x={26} y={-G - 34} width={18} height={9} rx={2} />
          <rect x={47} y={-G - 34} width={14} height={9} rx={2} />
        </g>
        <g transform={onRight(64)} className={body.ink}>
          <rect x={10} y={-G - 34} width={16} height={9} rx={2} />
        </g>
        <g transform={onRight(L)} className={body.ink}>
          <rect x={6} y={-G - 16} width={6} height={3} rx={1.5} />
          <rect x={24} y={-G - 16} width={6} height={3} rx={1.5} />
        </g>
        <g transform={onLeft(D)} className={body.ink}>
          <rect x={6} y={-G - 21} width={8} height={7} rx={1.5} />
        </g>
        {WHEELS.map((x) => (
          <Wheel key={x} x={x} y={D} paint={body} />
        ))}
        <Block faces={box(6, D, G + 15, 8, 4, 5)} paint={body} />
        <Block faces={box(-46, 24, G, 36, 26, ISLAND - G)} paint={body} />
        <Block faces={box(PX, PY, ISLAND, PW, PD, PH)} paint={body} />
        <Block faces={box(PX - 2, PY - 2, ISLAND + PH, PW + 4, PD + 4, 6)} paint={body} />
        <g transform={onRight(PX + PW)} className={body.ink}>
          <rect x={PY + 3} y={-(ISLAND + 34)} width={6} height={14} rx={1.5} />
        </g>
        <g transform={onLeft(PY + PD)}>
          <rect x={PX + 2} y={-(ISLAND + PH - 6)} width={PW - 4} height={12} rx={1.5} className={screen.base} />
          {accent && palette !== "tone" && <rect x={PX + 2} y={-(ISLAND + PH - 6)} width={PW - 4} height={12} rx={1.5} className={screen.left} />}
          {list.map((value, index) => {
            const last = index === list.length - 1;
            return (
              <text
                key={index}
                x={PX + PW / 2}
                y={-(ISLAND + PH - 12)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={6}
                style={last ? undefined : { animationDelay: `${(-(list.length - index) * PERIOD) / list.length}s` }}
                className={cn("font-semibold tabular-nums", digits, last ? "isometric147-last isometric147-rest opacity-0" : "isometric147-tick opacity-0")}
              >
                {value}
              </text>
            );
          })}
          <g className={body.ink}>
            <rect x={PX + 3} y={-(ISLAND + PH - 22)} width={PW - 6} height={3} rx={1.5} />
            <rect x={PX + 3} y={-(ISLAND + PH - 27)} width={8} height={3} rx={1.5} />
            <rect x={PX + 3} y={-(ISLAND + 14)} width={PW - 6} height={10} rx={1.5} />
          </g>
        </g>
        <path d={CORD} fill="none" strokeWidth={3} strokeLinecap="round" className={HOSE[palette]} />
      </svg>
    </div>
  );
}
