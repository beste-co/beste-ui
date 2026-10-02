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

interface Isometric229Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the domain name, the plug, the link light and the address with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric229Demo: Isometric229Props = {
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
// The browser slab stands on its bottom front edge and leans back by this much
const LEAN = (14 * Math.PI) / 180;
const FOOT = { x: 16, y: 44, z: BASE + 3 };
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
// The socket housing on the front of the stand, and the plug that slides into its face along the desk
const PORT = { x: 54, y: 49, w: 22, d: 11, h: 11 };
const FACE = PORT.y + PORT.d;
const PLUG = { x: 59, y: 64, w: 12, d: 12, h: 7, travel: 8 };
const SEATED = `translate(${(PLUG.travel * C).toFixed(2)} ${(-PLUG.travel * S).toFixed(2)})`;
// Everything in front of the socket face: the plug is cut where it enters
const ENTRY = box(PLUG.x - 1, FACE, BASE - 0.5, PLUG.w + 2, 40, PLUG.h + 1.5);
// The domain plate in front of the stand, carrying the globe and the name
const PLATE = { x: 14, y: 76, w: 100, d: 26, h: 5 };
const PLATE_TOP = BASE + PLATE.h;
const GLOBE = { x: 31, y: 89, r: 10, squash: 0.92 };
const SHELLS = Array.from({ length: 10 }, (_, k) => ({ z: PLATE_TOP + k * GLOBE.squash, r: GLOBE.r * Math.sqrt(1 - (k / 9.6) ** 2) }));
// A line of longitude over the dome, from its foot to the pole
const meridian = (degrees: number) => {
  const angle = (degrees * Math.PI) / 180;
  return polygon([
    ...SHELLS.map(({ z, r }): Point => [GLOBE.x + r * Math.cos(angle), GLOBE.y + r * Math.sin(angle), z]),
    [GLOBE.x, GLOBE.y, PLATE_TOP + GLOBE.r * GLOBE.squash],
  ]);
};
const MERIDIANS = [-20, 20, 62, 104].map(meridian);
const PARALLELS = [3, 6];
const NAME = { x: 48, y: 83, w: 58, d: 12, h: 3 };
const CHECK = "M-0.9 0.1L-0.25 0.75L1 -0.7";

const STYLES = `
@keyframes isometric229-plug { 0%, 12% { transform: translate(0px, 0px); } 26%, 82% { transform: translate(${(PLUG.travel * C).toFixed(2)}px, ${(-PLUG.travel * S).toFixed(2)}px); } 95%, 100% { transform: translate(0px, 0px); } }
@keyframes isometric229-live { 0%, 27% { opacity: 0; } 34%, 76% { opacity: 1; } 82%, 100% { opacity: 0; } }
@keyframes isometric229-idle { 0%, 27% { opacity: 1; } 34%, 76% { opacity: 0; } 82%, 100% { opacity: 1; } }
.isometric229-plug { animation: isometric229-plug ${PERIOD}s cubic-bezier(0.5, 0, 0.2, 1) infinite; }
.isometric229-live { animation: isometric229-live ${PERIOD}s ease-in-out infinite; }
.isometric229-idle { animation: isometric229-idle ${PERIOD}s ease-in-out infinite; }
.isometric229-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric229-scene * { animation: none !important; } }
`;

export function Isometric229({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric229Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const entryId = useId();
  const top = SHELLS[SHELLS.length - 1];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric229-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-103 -76 222 204" aria-hidden="true" className="isometric229-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} rx={4} />
          </clipPath>
          <clipPath id={entryId}>
            <polygon points={ENTRY.top} />
            <polygon points={ENTRY.left} />
            <polygon points={ENTRY.right} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 128, 110, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(FOOT.x - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />
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
          {/* The address bar: a plain placeholder until the domain is connected, then the name with a secure mark */}
          <rect x={21} y={2.9} width={W - 26} height={7.8} rx={3.9} className={body.ink} />
          <g className="isometric229-idle opacity-0">
            <circle cx={26.2} cy={6.8} r={1.4} className={body.base} />
            <rect x={30} y={5.6} width={44} height={2.4} rx={1.2} className={body.base} />
          </g>
          <g className="isometric229-live">
            <rect x={22.4} y={4.2} width={40} height={5.2} rx={2.6} className={accent ? mine.base : body.base} />
            <circle cx={26.2} cy={6.8} r={1.7} className={accent ? mine.ink : body.ink} />
            <path d={CHECK} transform="translate(26.2 6.8)" fill="none" strokeWidth={0.7} strokeLinecap="round" strokeLinejoin="round" className={onAccent} />
            <rect x={30} y={5.7} width={15} height={2.2} rx={1.1} className={accent ? mine.ink : body.ink} />
            <circle cx={47.4} cy={6.8} r={0.9} className={accent ? mine.ink : body.ink} />
            <rect x={49.8} y={5.7} width={9} height={2.2} rx={1.1} className={accent ? mine.ink : body.ink} />
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
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the slab */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* The socket housing, with its link light on top */}
        <RoundBlock shape={roundBox(PORT.x, PORT.y, BASE, PORT.w, PORT.d, PORT.h, 2.5)} paint={body} />
        <g transform={onLeft(FACE)}>
          <rect x={PLUG.x - 0.8} y={-(BASE + PLUG.h + 0.8)} width={PLUG.w + 1.6} height={PLUG.h + 0.8} rx={1} className={body.ink} />
          <rect x={PLUG.x - 0.8} y={-(BASE + PLUG.h + 0.8)} width={PLUG.w + 1.6} height={PLUG.h + 0.8} rx={1} className={body.ink} />
        </g>
        <RoundBlock shape={roundBox(PORT.x + PORT.w / 2 - 2.5, PORT.y + 2, BASE + PORT.h, 5, 5, 1.6, 2.5)} paint={body} />
        <g className="isometric229-live">
          <RoundBlock shape={roundBox(PORT.x + PORT.w / 2 - 2.5, PORT.y + 2, BASE + PORT.h, 5, 5, 1.6, 2.5)} paint={mine} />
        </g>
        {/* The lead from the plate to the socket, and the plug that rides it into the socket face */}
        <Block faces={box(PLUG.x + PLUG.w / 2 - 2, FACE, BASE, 4, PLATE.y - FACE, 1.5)} paint={body} />
        <g clipPath={`url(#${entryId})`}>
          <g className="isometric229-plug" transform={SEATED}>
            <Block faces={box(PLUG.x, PLUG.y, BASE, PLUG.w, PLUG.d, PLUG.h)} paint={mine} />
            <g transform={onTop(BASE + PLUG.h)} className={accent ? mine.ink : body.ink}>
              <rect x={PLUG.x + 3} y={PLUG.y + 5} width={PLUG.w - 6} height={2} rx={1} />
              <rect x={PLUG.x + 3} y={PLUG.y + 8.5} width={PLUG.w - 6} height={2} rx={1} />
            </g>
          </g>
        </g>
        {/* The domain plate: a globe dome and the name beside it */}
        <RoundBlock shape={roundBox(PLATE.x, PLATE.y, BASE, PLATE.w, PLATE.d, PLATE.h, 9)} paint={body} />
        <g className={body.edge} strokeWidth={1}>
          {SHELLS.map(({ z, r }) => (
            <circle key={`rim-${z.toFixed(2)}`} cx={GLOBE.x} cy={GLOBE.y} r={r} transform={onTop(z)} className={body.base} />
          ))}
          {SHELLS.map(({ z, r }) => (
            <g key={`shell-${z.toFixed(2)}`} transform={`${onTop(z)} translate(${GLOBE.x} ${GLOBE.y})`} stroke="none">
              <circle r={r} className={body.base} />
              <circle r={r} className={body.left} />
            </g>
          ))}
          {top && <circle cx={GLOBE.x} cy={GLOBE.y} r={top.r} transform={onTop(top.z)} stroke="none" className={body.base} />}
          <g fill="none" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
            {PARALLELS.map((k) => {
              const shell = SHELLS[k];
              if (!shell) return null;
              const reach = shell.r * Math.SQRT1_2;
              return (
                <path
                  key={`parallel-${k}`}
                  transform={`${onTop(shell.z)} translate(${GLOBE.x} ${GLOBE.y})`}
                  d={`M${reach.toFixed(2)} ${(-reach).toFixed(2)}A${shell.r.toFixed(2)} ${shell.r.toFixed(2)} 0 0 1 ${(-reach).toFixed(2)} ${reach.toFixed(2)}`}
                />
              );
            })}
            {MERIDIANS.map((points, index) => (
              <polyline key={`meridian-${index}`} points={points} />
            ))}
          </g>
        </g>
        <RoundBlock shape={roundBox(NAME.x, NAME.y, PLATE_TOP, NAME.w, NAME.d, NAME.h, NAME.d / 2)} paint={mine} />
        <g transform={onTop(PLATE_TOP + NAME.h)} className={accent ? mine.ink : body.ink}>
          <rect x={NAME.x + 7} y={NAME.y + 4.6} width={24} height={2.8} rx={1.4} />
          <circle cx={NAME.x + 34.5} cy={NAME.y + 6} r={1.3} />
          <rect x={NAME.x + 38} y={NAME.y + 4.6} width={13} height={2.8} rx={1.4} />
        </g>
      </svg>
    </div>
  );
}
