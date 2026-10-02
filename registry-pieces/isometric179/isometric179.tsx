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

interface Isometric179Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the scan, the face mesh and one app tile with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric179Demo: Isometric179Props = {
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
const W = 64;
const TALL = 118;
const THICK = 6;
// The phone stands on its bottom front edge and leans back by this much
const LEAN = (14 * Math.PI) / 180;
const FOOT = { x: 18, y: 46, z: BASE + 3 };
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
/** The matrix that lays local (across, down) units onto the leaning plane `depth` behind the glass, starting `rise` up the phone. */
function plane(depth: number, rise: number, left = 0) {
  const origin: Point = [FOOT.x + left, FOOT.y + UP[1] * rise + BACK[1] * depth, FOOT.z + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
const GLASS = plane(0, TALL);
// Behind the glass the body is a stack of thin layers, far to near
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
// The rest behind the phone: a little wider, half as tall
const REST = { side: 4, tall: 62, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);
// The scan frame on the lock screen, in screen units
const FRAME = { x: 14, y: 44, w: 36, h: 42 };
const MESH: [number, number][] = [[32, 52], [25, 58], [39, 58], [32, 63], [26, 69], [38, 69], [32, 75], [22, 82], [42, 82]];
const CORNERS: [number, number, number, number][] = [[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]];
const TILES = Array.from({ length: 12 }, (_, index) => ({ col: index % 3, row: Math.floor(index / 3) }));
const PERIOD = 10;
const SCAN = [8, 36] as const;
const LINE_STROKE: Record<Palette, string> = { theme: "stroke-card", light: "stroke-white", dark: "stroke-zinc-400", tone: "stroke-white", glass: "stroke-card" };

const STYLES = `
@keyframes isometric179-lock { 0%, 54% { transform: translateY(0); opacity: 1; } 62%, 86% { transform: translateY(${-TALL}px); opacity: 1; } 94%, 100% { transform: translateY(0); opacity: 1; } }
@keyframes isometric179-scan { 0%, ${SCAN[0]}% { transform: translateY(0); opacity: 0; } ${SCAN[0] + 2}% { opacity: 1; } ${SCAN[1]}% { transform: translateY(${FRAME.h}px); opacity: 1; } ${SCAN[1] + 3}%, 100% { transform: translateY(${FRAME.h}px); opacity: 0; } }
${MESH.map(([, y], index) => {
  const at = SCAN[0] + ((y - FRAME.y) / FRAME.h) * (SCAN[1] - SCAN[0]);
  return `@keyframes isometric179-dot${index} { 0%, ${at.toFixed(1)}% { opacity: 0; } ${(at + 2).toFixed(1)}%, 90% { opacity: 1; } 96%, 100% { opacity: 0; } }
.isometric179-dot${index} { animation: isometric179-dot${index} ${PERIOD}s linear infinite; }`;
}).join("\n")}
${CORNERS.map(([, , dx, dy], index) => `@keyframes isometric179-corner${index} { 0%, 40% { transform: translate(0, 0); } 44%, 90% { transform: translate(${dx * 2.5}px, ${dy * 2.5}px); } 96%, 100% { transform: translate(0, 0); } }
.isometric179-corner${index} { animation: isometric179-corner${index} ${PERIOD}s cubic-bezier(0.3, 1.6, 0.5, 1) infinite; }`).join("\n")}
@keyframes isometric179-shackle { 0%, 45% { transform: rotate(0deg); } 50%, 90% { transform: rotate(38deg); } 96%, 100% { transform: rotate(0deg); } }
@keyframes isometric179-home { 0%, 56% { transform: scale(0.92); opacity: 0.4; } 64%, 86% { transform: scale(1); opacity: 1; } 94%, 100% { transform: scale(0.92); opacity: 0.4; } }
.isometric179-lock { animation: isometric179-lock ${PERIOD}s cubic-bezier(0.5, 0, 0.2, 1) infinite; }
.isometric179-scan { animation: isometric179-scan ${PERIOD}s linear infinite; }
.isometric179-shackle { animation: isometric179-shackle ${PERIOD}s ease-in-out infinite; transform-origin: 35.5px 27px; }
.isometric179-home { animation: isometric179-home ${PERIOD}s ease-out infinite; transform-origin: ${W / 2}px ${TALL / 2}px; }
.isometric179-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric179-scene * { animation: none !important; } }
`;

export function Isometric179({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric179Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const lit = paint.accent;
  const line = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : LINE_STROKE[palette];
  const glow = accent ? lit.base : body.base;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric179-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 166 210" aria-hidden="true" className="isometric179-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 100, 72, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />
        {/* The rest the phone leans against, then the phone itself, each built from thin layers back to front */}
        {REST_LAYERS.map((depth, index) => (
          <g key={depth} transform={plane(depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={depth} transform={plane(depth, TALL)}>
            <rect width={W} height={TALL} rx={9} className={body.base} />
            <rect width={W} height={TALL} rx={9} className={body.right} />
            {depth > 1 && depth < 5 && <rect x={W - 0.5} y={30} width={1.6} height={16} rx={0.8} className={body.ink} />}
          </g>
        ))}
        <g transform={GLASS}>
          <rect width={W} height={TALL} rx={9} strokeWidth={1} className={cn(body.base, body.edge)} />
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <g clipPath={`url(#${clipId})`}>
            {/* Home screen: a grid of app tiles and a dock, waiting under the lock screen */}
            <g className="isometric179-home">
              {TILES.map(({ col, row }) => (
                <rect key={`${col}-${row}`} x={10 + col * 16} y={18 + row * 17} width={12} height={12} rx={3.5} className={col === 1 && row === 1 ? glow : body.base} />
              ))}
              <rect x={8} y={TALL - 24} width={W - 16} height={16} rx={6} className={body.base} opacity={0.5} />
              {[0, 1, 2].map((slot) => (
                <rect key={slot} x={13 + slot * 14} y={TALL - 21} width={10} height={10} rx={3} className={body.base} />
              ))}
            </g>
            {/* Lock screen: slides up and away once the face is recognised */}
            <g className="isometric179-lock opacity-0">
              <rect x={3} y={3} width={W - 6} height={TALL - 6} className={body.base} />
              <rect x={3} y={3} width={W - 6} height={TALL - 6} className={body.ink} />
              <g fill="none" strokeWidth={1.6} strokeLinecap="round" className={LINE_STROKE[palette]}>
                <path d="M28.5 27V23.5A3.5 3.5 0 0 1 35.5 23.5V27" className="isometric179-shackle" />
              </g>
              <rect x={26.5} y={26.5} width={11} height={8} rx={2} className={body.base} />
              <rect x={20} y={38} width={24} height={2.4} rx={1.2} className={body.base} opacity={0.6} />
              {/* A plain head and shoulders inside the scan frame */}
              <g fill="none" strokeWidth={1.4} strokeLinecap="round" className={LINE_STROKE[palette]} opacity={0.5}>
                <ellipse cx={32} cy={61} rx={9} ry={11} />
                <path d="M19 86C20 78 26 75 32 75C38 75 44 78 45 86" />
              </g>
              {MESH.map(([x, y], index) => (
                <circle key={index} cx={x} cy={y} r={1.3} className={cn(`isometric179-dot${index} opacity-0`, glow)} />
              ))}
              <g fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={line}>
                {CORNERS.map(([cx, cy, dx, dy], index) => {
                  const x = FRAME.x + cx * FRAME.w;
                  const y = FRAME.y + cy * FRAME.h;
                  return <path key={index} d={`M${x + dx * 7} ${y}H${x}V${y + dy * 7}`} className={`isometric179-corner${index}`} />;
                })}
              </g>
              <g className="isometric179-scan opacity-0">
                <rect x={FRAME.x + 1} y={FRAME.y - 3} width={FRAME.w - 2} height={3} className={glow} opacity={0.25} />
                <rect x={FRAME.x + 1} y={FRAME.y} width={FRAME.w - 2} height={1.4} rx={0.7} className={glow} />
              </g>
              <rect x={22} y={98} width={20} height={2.4} rx={1.2} className={body.base} opacity={0.6} />
            </g>
          </g>
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
      </svg>
    </div>
  );
}
