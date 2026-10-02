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

interface Isometric138Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the sent messages and the reaction with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric138Demo: Isometric138Props = {
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

// The thread, top to bottom, in screen units; `mine` are the sent messages
const FLOOR = TALL - 18;
const BUBBLES = [
  { y: 32, h: 16, w: 34, mine: false, lines: [22, 14], at: 12 },
  { y: 52, h: 12, w: 28, mine: true, lines: [16], at: 23 },
  { y: 68, h: 12, w: 30, mine: false, lines: [18], at: 44 },
  { y: 84, h: 16, w: 36, mine: true, lines: [24, 16], at: 55 },
];
// How far the whole thread sits below its final place while only the first bubbles are in
const drop = (count: number) => FLOOR - ((BUBBLES[count - 1]?.y ?? 0) + (BUBBLES[count - 1]?.h ?? 0));
const PERIOD = 10;
const pop = (name: string, at: number) =>
  `@keyframes ${name} { 0%, ${at}% { opacity: 0; transform: scale(0.6); } ${at + 3}% { opacity: 1; transform: scale(1.05); } ${at + 5}%, 100% { opacity: 1; transform: scale(1); } }`;

const STYLES = `
${BUBBLES.map((bubble, index) => `${pop(`isometric138-pop${index}`, bubble.at)}
.isometric138-pop${index} { animation: isometric138-pop${index} ${PERIOD}s ease-out infinite; transform-box: fill-box; transform-origin: ${bubble.mine ? "right" : "left"} bottom; }`).join("\n")}
${pop("isometric138-react", 64)}
@keyframes isometric138-thread { 0%, 22% { transform: translateY(${drop(1)}px); } 25%, 32% { transform: translateY(${drop(2)}px); } 35%, 54% { transform: translateY(${drop(3)}px); } 57%, 100% { transform: translateY(0); } }
@keyframes isometric138-clear { 0%, 90% { opacity: 1; } 96%, 100% { opacity: 0; } }
@keyframes isometric138-typing { 0%, 4% { opacity: 0; } 4.1%, 12% { opacity: 1; } 12.1%, 35% { opacity: 0; } 35.1%, 44% { opacity: 1; } 44.1%, 100% { opacity: 0; } }
@keyframes isometric138-dot { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-2px); } }
.isometric138-react { animation: isometric138-react ${PERIOD}s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric138-thread { animation: isometric138-thread ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
.isometric138-clear { animation: isometric138-clear ${PERIOD}s linear infinite; }
.isometric138-typing { animation: isometric138-typing ${PERIOD}s step-end infinite; }
.isometric138-dot { animation: isometric138-dot 0.9s ease-in-out infinite; }
.isometric138-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric138-scene * { animation: none !important; } }
`;

export function Isometric138({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric138Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric138-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 166 210" aria-hidden="true" className="isometric138-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={4} y={29} width={W - 8} height={FLOOR - 27} />
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
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          {/* Header: who the chat is with */}
          <circle cx={12} cy={20} r={5} className={body.base} />
          <rect x={20} y={16.5} width={22} height={3} rx={1.5} className={body.base} />
          <rect x={20} y={21.5} width={13} height={2.4} rx={1.2} className={body.ink} />
          <rect x={4} y={28} width={W - 8} height={0.8} className={body.ink} />
          <g clipPath={`url(#${clipId})`}>
            <g className="isometric138-clear">
              <g className="isometric138-thread">
                {BUBBLES.map((bubble, index) => {
                  const side = bubble.mine ? mine : body;
                  const x = bubble.mine ? W - 6 - bubble.w : 6;
                  return (
                    <g key={bubble.y} className={`isometric138-pop${index}`}>
                      <rect x={x} y={bubble.y} width={bubble.w} height={bubble.h} rx={5} className={side.base} />
                      {bubble.lines.map((line, row) => (
                        <rect key={row} x={x + 5} y={bubble.y + 4.2 + row * 4.6} width={line} height={2.6} rx={1.3} className={side.ink} />
                      ))}
                      {index === BUBBLES.length - 1 && (
                        <g className="isometric138-react">
                          <circle cx={x + 1} cy={bubble.y + bubble.h - 1} r={4.6} className={cn(body.base, body.edge)} strokeWidth={0.75} />
                          <path d={`M${x - 1.2} ${bubble.y + bubble.h - 1}l1.6 1.7l3 -3.4`} fill="none" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" className={accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge} />
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </g>
            {/* Three dots bounce where the next incoming message will land */}
            <g className="isometric138-typing opacity-0">
              <rect x={6} y={FLOOR - 12} width={22} height={12} rx={5} className={body.base} />
              {[0, 1, 2].map((dot) => (
                <circle key={dot} cx={12 + dot * 5} cy={FLOOR - 6} r={1.5} className={cn("isometric138-dot", body.ink)} style={{ animationDelay: `${dot * 0.15}s` }} />
              ))}
            </g>
          </g>
          {/* Message field at the bottom and a highlight across the glass */}
          <rect x={6} y={TALL - 14} width={W - 22} height={7} rx={3.5} className={body.base} />
          <circle cx={W - 9.5} cy={TALL - 10.5} r={3.5} className={accent ? mine.base : body.base} />
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
      </svg>
    </div>
  );
}
