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

interface Isometric167Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the light of the lamp with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric167Demo: Isometric167Props = {
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

/** An upright cylinder standing on plan point (cx, cy). */
const cylinder = (cx: number, cy: number, z: number, h: number, r: number) => roundBox(cx - r, cy - r, z, 2 * r, 2 * r, h, r);

const G = 6;
const DESK = { w: 124, d: 80 };
// The arm lies in a plane parallel to the left face; angles run clockwise from straight up
const PIVOT = { x: 26, z: G + 8 };
const LOWER = 44;
const UPPER = 40;
const HEAD = 20;
// Joint angles relative to the part before: reaching over the desk, and folded upright
const REACH = { a: -8, b: 55, c: 103 };
const FOLD = { a: -12, b: 48, c: 102 };
const ARM_Y = [38, 42] as const;
const MID = 40;
const NECK = 3.5;
const BELL = 13;
// The shade is a bell turned about the head axis: a short neck that flares out to the mouth
const radius = (along: number) => (along <= 5 ? NECK : NECK + (BELL - NECK) * Math.sqrt(1 - (1 - (along - 5) / (HEAD - 5)) ** 2));
const LAYERS = Array.from({ length: 2 * BELL + 1 }, (_, index) => MID - BELL + index);
/** The cut through the bell in the plane y, drawn upward from the wrist, and half the width of its mouth there. */
function shadeCut(y: number) {
  const off = Math.abs(y - MID);
  const rows = Array.from({ length: HEAD * 2 + 1 }, (_, index) => index / 2).flatMap((along): [number, number][] => (radius(along) > off ? [[along, Math.sqrt(radius(along) ** 2 - off ** 2)]] : []));
  const points = [...rows.map(([along, half]) => `${half.toFixed(2)},${(-along).toFixed(2)}`), ...rows.reverse().map(([along, half]) => `${(-half).toFixed(2)},${(-along).toFixed(2)}`)];
  return { points: points.join(" "), mouth: Math.sqrt(Math.max(0, BELL ** 2 - off ** 2)) };
}
// The near half is cut twice as fine so the rim of the bell stays smooth
const FINE = [...LAYERS, ...LAYERS.slice(0, -1).map((y) => y + 0.5)].sort((a, b) => a - b);
const CUTS = new Map(FINE.map((y) => [y, shadeCut(y)]));

const rad = (degrees: number) => (degrees * Math.PI) / 180;
const reach = (from: { x: number; z: number }, length: number, degrees: number) => ({ x: from.x + length * Math.sin(rad(degrees)), z: from.z + length * Math.cos(rad(degrees)) });
// Where the shade opens while the lamp reaches over the desk, and the spot its light lands on
const AIM = REACH.a + REACH.b + REACH.c;
const ELBOW = reach(PIVOT, LOWER, REACH.a);
const WRIST = reach(ELBOW, UPPER, REACH.a + REACH.b);
const MOUTH = reach(WRIST, HEAD, AIM);
const POOL = { x: MOUTH.x + (MOUTH.z - G) * Math.tan(rad(180 - AIM)), r: 25 };
// The light is a cone from the mouth of the shade down to the pool; its outline is the hull of both rims on screen
const RING = Array.from({ length: 36 }, (_, index) => rad(index * 10));
const flatPoint = ([x, y, z]: Point): [number, number] => [(x - y) * C, (x + y) * S - z];
const MOUTH_RIM = RING.map((t): Point => [MOUTH.x + BELL * Math.sin(t) * Math.cos(rad(AIM)), MID + BELL * Math.cos(t), MOUTH.z - BELL * Math.sin(t) * Math.sin(rad(AIM))]);
const POOL_RIM = RING.map((t): Point => [POOL.x + POOL.r * Math.sin(t), MID + POOL.r * Math.cos(t), G]);
function hull(points: [number, number][]) {
  const sorted = [...points].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const half = (list: [number, number][]) => {
    const out: [number, number][] = [];
    for (const point of list) {
      while (out.length >= 2) {
        const [ax, ay] = out[out.length - 2] ?? point;
        const [bx, by] = out[out.length - 1] ?? point;
        if ((bx - ax) * (point[1] - ay) - (by - ay) * (point[0] - ax) > 0) break;
        out.pop();
      }
      out.push(point);
    }
    return out.slice(0, -1);
  };
  return [...half(sorted), ...half(sorted.reverse())];
}
const BEAM = hull([...MOUTH_RIM, ...POOL_RIM].map(flatPoint)).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
const MOUTH_DISC = MOUTH_RIM.map(flatPoint).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
const BEAM_TOP = flatPoint([MOUTH.x, MID, MOUTH.z])[1];
const BEAM_END = flatPoint([POOL.x, MID, G])[1] + POOL.r * S;

const turn = (name: string, from: number, to: number) =>
  `@keyframes isometric167-${name} { 0%, 34% { transform: rotate(0deg); } 54%, 64% { transform: rotate(${to - from}deg); } 84%, 100% { transform: rotate(0deg); } }`;

const STYLES = `
${turn("a", REACH.a, FOLD.a)}
${turn("b", REACH.b, FOLD.b)}
${turn("c", REACH.c, FOLD.c)}
@keyframes isometric167-lit { 0%, 28% { opacity: 1; } 32%, 86% { opacity: 0; } 88% { opacity: 1; } 90% { opacity: 0.4; } 93%, 100% { opacity: 1; } }
.isometric167-a { animation: isometric167-a 7s ease-in-out infinite; }
.isometric167-b { animation: isometric167-b 7s ease-in-out infinite; }
.isometric167-c { animation: isometric167-c 7s ease-in-out infinite; }
.isometric167-lit { animation: isometric167-lit 7s linear infinite; }
.isometric167-still * { animation: none !important; }
.isometric167-still .isometric167-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric167-a, .isometric167-b, .isometric167-c, .isometric167-lit { animation: none; } .isometric167-rest { opacity: 1; } }
`;

/** One arm segment drawn upward from its pivot, as a slice of the extruded bar. */
function Bar({ length, face, paint }: { length: number; face: boolean; paint: Paint }) {
  const rect = { x: -2.5, y: -length - 2.5, width: 5, height: length + 5, rx: 2.5 };
  return (
    <g className={paint.edge} strokeWidth={1}>
      <rect {...rect} className={paint.base} stroke={face ? undefined : "none"} />
      <rect {...rect} className={face ? paint.left : paint.right} stroke="none" />
      {face && <circle r={1.5} className={paint.ink} stroke="none" />}
      {face && <circle cy={-length} r={1.5} className={paint.ink} stroke="none" />}
    </g>
  );
}

/** The whole linkage in the plane y: every slice turns about the same three pivots. */
function Slice({ y, paint, pass }: { y: number; paint: Paint; pass: "outline" | "fill" }) {
  const arm = pass === "fill" && y >= ARM_Y[0] && y <= ARM_Y[1];
  const armFace = y === ARM_Y[1];
  const cut = CUTS.get(y);
  return (
    <g transform={onLeft(y)}>
      <g transform={`translate(${PIVOT.x} ${-PIVOT.z}) rotate(${REACH.a})`}>
        <g className="isometric167-a">
          {arm && <Bar length={LOWER} face={armFace} paint={paint} />}
          <g transform={`translate(0 ${-LOWER}) rotate(${REACH.b})`}>
            <g className="isometric167-b">
              {arm && <Bar length={UPPER} face={armFace} paint={paint} />}
              <g transform={`translate(0 ${-UPPER}) rotate(${REACH.c})`}>
                {cut && (
                  <g className="isometric167-c">
                    {pass === "outline" ? (
                      <polygon points={cut.points} fill="none" strokeWidth={2} strokeLinejoin="round" className={paint.edge} />
                    ) : (
                      <>
                        <polygon points={cut.points} className={paint.base} />
                        <polygon points={cut.points} className={y > MID + 8 ? paint.left : paint.right} />
                      </>
                    )}
                  </g>
                )}
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

export function Isometric167({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric167Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const id = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const glow = paint.accent === body ? body.ink : paint.accent.base;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric167-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-78 -66 194 176" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, DESK.w, DESK.d, G)} paint={body} />
        <defs>
          <radialGradient id={`${id}-soft`}>
            <stop offset="0%" stopColor="white" />
            <stop offset="55%" stopColor="white" stopOpacity={0.75} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </radialGradient>
          <linearGradient id={`${id}-fall`} gradientUnits="userSpaceOnUse" x1={0} y1={BEAM_TOP} x2={0} y2={BEAM_END}>
            <stop offset="0%" stopColor="white" stopOpacity={0.45} />
            <stop offset="100%" stopColor="white" stopOpacity={0.08} />
          </linearGradient>
          <mask id={`${id}-pool`}>
            <circle cx={POOL.x} cy={MID} r={POOL.r + 6} fill={`url(#${id}-soft)`} />
          </mask>
          <mask id={`${id}-beam`}>
            <polygon points={BEAM} fill={`url(#${id}-fall)`} />
            {/* The mouth of the shade faces the desk, so no light shows inside it */}
            <polygon points={MOUTH_DISC} fill="black" />
          </mask>
        </defs>
        <g transform={onTop(G)} className="isometric167-lit isometric167-rest">
          <circle cx={POOL.x} cy={MID} r={POOL.r + 6} mask={`url(#${id}-pool)`} className={glow} />
        </g>
        <Block faces={box(8, 60, G, 36, 16, 3)} paint={body} />
        <Block faces={box(10, 61, G + 3, 30, 14, 3)} paint={body} />
        <g transform={onTop(G + 6)} className={body.ink}>
          <rect x={16} y={66} width={18} height={2} rx={1} />
        </g>
        <RoundBlock shape={cylinder(PIVOT.x, 40, G, 4, 15)} paint={body} />
        <RoundBlock shape={cylinder(PIVOT.x, 40, G + 4, 4, 4)} paint={body} />
        {LAYERS.map((y) => (
          <Slice key={y} y={y} paint={body} pass="outline" />
        ))}
        {FINE.map((y) => (
          <Slice key={y} y={y} paint={body} pass="fill" />
        ))}
        <g className="isometric167-lit isometric167-rest">
          <polygon points={BEAM} mask={`url(#${id}-beam)`} className={glow} />
        </g>
      </svg>
    </div>
  );
}
