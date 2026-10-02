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

interface Isometric245Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the new member, their seat ring, role and cursor with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric245Demo: Isometric245Props = {
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
const W = 96;
const TALL = 80;
const THICK = 5;
// The project slab stands on its bottom front edge and leans back by this much
const LEAN = (14 * Math.PI) / 180;
const FOOT = { x: 22, y: 40, z: BASE + 3 };
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
/** The matrix that lays local (across, down) units onto the leaning plane `depth` behind the front, starting `rise` up the slab. */
function plane(depth: number, rise: number, left = 0) {
  const origin: Point = [FOOT.x + left, FOOT.y + UP[1] * rise + BACK[1] * depth, FOOT.z + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
const FRONT = plane(0, TALL);
// Behind the front the slab is a stack of thin layers, far to near
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
// The rest behind the slab: a little wider, half as tall
const REST = { side: 4, tall: 44, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);
// The page leaves a chin at the bottom for the lip of the stand to cover
const PAGE = { x: 3, y: 13.5, w: W - 6, h: 55.5 };

const PERIOD = 10;
// The seats in a row in front of the stand; the last one is the open seat
const SEAT = { y: 92, r: 12, h: 3, hole: 9 };
const SEATS = [18, 46, 74, 102];
const OPEN = 102;
const SEAT_TOP = BASE + SEAT.h;
// A member is a pawn: a tapered body with a round head, cut into thin discs
const HEAD = { z: 25.5, r: 6.8 };
const DISCS = Array.from({ length: 33 }, (_, z) => {
  const taper = z <= 18 ? 3.6 + 4.8 * (1 - z / 18) ** 1.6 : 0;
  const collar = z >= 17 && z <= 19 ? 5.2 : 0;
  const ball = Math.abs(z - HEAD.z) < HEAD.r ? Math.sqrt(HEAD.r ** 2 - (z - HEAD.z) ** 2) : 0;
  return { z, r: Math.max(taper, collar, ball) };
});
const SUNK = 40;
// The part of a disc to the right of a line that is upright on screen, set in from the center by a share of the radius
const shade = (r: number, share: number) => {
  const along = (r * share) / Math.SQRT2;
  const half = (r * Math.sqrt(1 - share * share)) / Math.SQRT2;
  return `M${(along - half).toFixed(2)} ${(-along - half).toFixed(2)}A${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${(along + half).toFixed(2)} ${(-along + half).toFixed(2)}Z`;
};
// Three overlapping bands darken the pawn step by step toward its right side
const SHADES = [0.1, 0.45, 0.75];
// Where a seat's socket sits on screen, and how wide its mouth looks
const [MOUTH_X, MOUTH_Y] = flat([OPEN, SEAT.y, SEAT_TOP]);
const MOUTH_HALF = SEAT.hole * C * Math.SQRT2;
// The role tag: a plate on a short post beside the open seat
const TAG = { x: 117, y: 92, w: 19, d: 3, z: BASE + 9, h: 14 };
const CURSOR = "M0 0V7L2 5.2H4.8Z";

const STYLES = `
@keyframes isometric245-pawn { 0%, 10% { transform: translateY(${SUNK}px); } 26%, 86% { transform: translateY(0px); } 96%, 100% { transform: translateY(${SUNK}px); } }
@keyframes isometric245-live { 0%, 26% { opacity: 0; } 34%, 80% { opacity: 1; } 86%, 100% { opacity: 0; } }
@keyframes isometric245-idle { 0%, 26% { opacity: 1; } 34%, 80% { opacity: 0; } 86%, 100% { opacity: 1; } }
@keyframes isometric245-work { 0%, 40% { opacity: 0; } 50%, 78% { opacity: 1; } 84%, 100% { opacity: 0; } }
.isometric245-pawn { animation: isometric245-pawn ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.isometric245-live { animation: isometric245-live ${PERIOD}s ease-in-out infinite; }
.isometric245-idle { animation: isometric245-idle ${PERIOD}s ease-in-out infinite; }
.isometric245-work { animation: isometric245-work ${PERIOD}s ease-in-out infinite; }
.isometric245-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric245-scene * { animation: none !important; } }
`;

/** One member standing on a seat: outlines first, then the fills over them. */
function Pawn({ x, paint }: { x: number; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1}>
      {DISCS.map(({ z, r }) => (
        <circle key={`rim-${z}`} cx={x} cy={SEAT.y} r={r} transform={onTop(SEAT_TOP + z)} className={paint.base} />
      ))}
      {DISCS.map(({ z, r }) => (
        <g key={`disc-${z}`} transform={`${onTop(SEAT_TOP + z)} translate(${x} ${SEAT.y})`} stroke="none">
          <circle r={r} className={paint.base} />
          {SHADES.map((share) => (
            <path key={`shade-${share}`} d={shade(r, share)} className={paint.left} />
          ))}
        </g>
      ))}
    </g>
  );
}

export function Isometric245({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric245Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn in the accent on a neutral fill
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;
  const mouthId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric245-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-114 -80 240 218" aria-hidden="true" className="isometric245-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} rx={4} />
          </clipPath>
          {/* The socket's mouth and everything straight above it: the new member is cut at the rim */}
          <clipPath id={mouthId}>
            <circle cx={OPEN} cy={SEAT.y} r={SEAT.hole} transform={onTop(SEAT_TOP)} />
            <rect x={MOUTH_X - MOUTH_HALF} y={MOUTH_Y - 60} width={2 * MOUTH_HALF} height={60} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 140, 122, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 6, 12, BASE, W + 12, 42, 3, 8)} paint={body} />
        {/* The rest the slab leans against, then the slab itself, each built from thin layers back to front */}
        {REST_LAYERS.map((depth, index) => (
          <g key={`rest-${depth}`} transform={plane(depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={`slab-${depth}`} transform={plane(depth, TALL)}>
            <rect width={W} height={TALL} rx={6} className={body.base} />
            <rect width={W} height={TALL} rx={6} className={body.right} />
          </g>
        ))}
        <g transform={FRONT}>
          <rect width={W} height={TALL} rx={6} strokeWidth={1} className={cn(body.base, body.edge)} />
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={6.5 + dot * 4.2} cy={6.8} r={1.3} className={body.ink} />
          ))}
          <rect x={21} y={2.9} width={38} height={7.8} rx={3.9} className={body.ink} />
          {/* Who is in the project: one disc per member, the newest in the accent */}
          {[68, 73.5, 79].map((x) => (
            <circle key={`here-${x}`} cx={x} cy={6.8} r={3.3} strokeWidth={0.9} className={cn(body.ink, body.edge)} />
          ))}
          <g className="isometric245-live">
            <circle cx={84.5} cy={6.8} r={3.3} strokeWidth={0.9} className={cn(body.base, body.edge)} />
            <circle cx={84.5} cy={6.8} r={3.3} className={accent ? mine.base : body.ink} />
          </g>
          <g clipPath={`url(#${clipId})`}>
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.base} />
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.ink} />
            <rect x={9} y={20.8} width={38} height={4.6} rx={2.3} className={body.base} />
            <rect x={9} y={28.3} width={26} height={2.8} rx={1.4} className={body.base} />
            <rect x={9} y={34} width={22} height={7.4} rx={3.7} className={body.base} />
            <rect x={14.5} y={36.6} width={11} height={2.2} rx={1.1} className={body.ink} />
            <rect x={55} y={19} width={32} height={23.5} rx={5} className={body.base} />
            <circle cx={64} cy={26.5} r={3} className={body.ink} />
            <path d="M57 40.5l8 -8l5 5l5 -7l10 10Z" className={body.ink} />
            {[9, 49].map((x) => (
              <g key={`card-${x}`}>
                <rect x={x} y={47} width={38} height={18} rx={5} className={body.base} />
                <circle cx={x + 7} cy={53.5} r={3} className={body.ink} />
                <rect x={x + 13} y={52.3} width={18} height={2.4} rx={1.2} className={body.ink} />
                <rect x={x + 4} y={59.2} width={24} height={2.2} rx={1.1} className={body.ink} />
              </g>
            ))}
            {/* The new member at work: their cursor and name on the heading */}
            <g className="isometric245-work">
              <rect x={7.5} y={19.3} width={41} height={7.6} rx={3.8} fill="none" strokeWidth={1} className={inAccent} />
              <g transform="translate(44 25)">
                <path d={CURSOR} strokeWidth={0.8} strokeLinejoin="round" className={cn(accent ? mine.base : body.base, body.edge)} />
                <rect x={4} y={6} width={13} height={4.6} rx={2.3} className={accent ? mine.base : body.base} />
                <rect x={6.5} y={7.4} width={8} height={1.8} rx={0.9} className={accent ? mine.ink : body.ink} />
              </g>
            </g>
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the slab */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* The team: a seat per member, and a member standing on each taken seat */}
        {SEATS.map((x) => (
          <g key={`seat-${x}`}>
            <RoundBlock shape={roundBox(x - SEAT.r, SEAT.y - SEAT.r, BASE, 2 * SEAT.r, 2 * SEAT.r, SEAT.h, SEAT.r)} paint={body} />
            <circle cx={x} cy={SEAT.y} r={SEAT.hole} transform={onTop(SEAT_TOP)} className={body.ink} />
            {x !== OPEN && <Pawn x={x} paint={body} />}
          </g>
        ))}
        {/* The open seat: a dashed outline until the new member comes up through it, then a ring in the accent */}
        <g transform={onTop(SEAT_TOP)} fill="none">
          <circle cx={OPEN} cy={SEAT.y} r={10.5} strokeWidth={1} strokeDasharray="2.4 2" className={cn("isometric245-idle opacity-0", body.edge)} />
          <circle cx={OPEN} cy={SEAT.y} r={10.5} strokeWidth={2} className={cn("isometric245-live", inAccent)} />
        </g>
        <g clipPath={`url(#${mouthId})`}>
          <g className="isometric245-pawn">
            <Pawn x={OPEN} paint={mine} />
          </g>
        </g>
        {/* The role tag beside the open seat: a plain role first, then the one the new member is given */}
        <Block faces={box(TAG.x + TAG.w / 2 - 1.5, TAG.y, BASE, 3, 3, TAG.z - BASE)} paint={body} />
        <Block faces={box(TAG.x, TAG.y, TAG.z, TAG.w, TAG.d, TAG.h)} paint={body} />
        <g transform={onLeft(TAG.y + TAG.d)}>
          <g className="isometric245-idle opacity-0">
            <circle cx={TAG.x + 4.5} cy={-(TAG.z + TAG.h / 2)} r={2.3} className={body.ink} />
            <rect x={TAG.x + 8.5} y={-(TAG.z + TAG.h / 2 + 2.6)} width={7} height={2} rx={1} className={body.ink} />
            <rect x={TAG.x + 8.5} y={-(TAG.z + TAG.h / 2 - 0.8)} width={5} height={2} rx={1} className={body.ink} />
          </g>
          <g className="isometric245-live">
            <rect x={TAG.x + 2} y={-(TAG.z + TAG.h - 3)} width={TAG.w - 4} height={TAG.h - 6} rx={3.5} className={accent ? mine.base : body.ink} />
            <circle cx={TAG.x + 5.6} cy={-(TAG.z + TAG.h / 2)} r={1.6} className={accent ? mine.ink : body.base} />
            <rect x={TAG.x + 8.6} y={-(TAG.z + TAG.h / 2 + 1)} width={6} height={2} rx={1} className={accent ? mine.ink : body.base} />
          </g>
        </g>
      </svg>
    </div>
  );
}
