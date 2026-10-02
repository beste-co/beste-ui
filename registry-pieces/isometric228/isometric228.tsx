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

interface Isometric228Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the closed padlock, the button and the certificate seal with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric228Demo: Isometric228Props = {
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
const PAGE = { x: 3, y: 12, w: W - 6, h: 57 };

const PERIOD = 9;
// The certificate stands on a small foot beside the browser
const CERT = { x: 124, y: 52, w: 26, d: 4, h: 38 };
const CERT_Z = BASE + 2;
const SEAL = { x: CERT.x + CERT.w / 2, z: CERT_Z + 12 };
const LOCK = { x: 16.5, y: 12.6 };
// The shackle as a filled arch, so it takes the same fills as the lock body
const SHACKLE = "M-3.4 -0.4V-3a3.4 3.4 0 0 1 6.8 0V-0.4H1.8V-3a1.8 1.8 0 0 0 -3.6 0V-0.4Z";

const STYLES = `
@keyframes isometric228-shackle { 0%, 14% { transform: translateY(-2.4px); } 22%, 86% { transform: translateY(0px); } 94%, 100% { transform: translateY(-2.4px); } }
@keyframes isometric228-safe { 0%, 22% { opacity: 0; } 30%, 84% { opacity: 1; } 90%, 100% { opacity: 0; } }
@keyframes isometric228-check { 0%, 32% { stroke-dashoffset: 1; } 46%, 84% { stroke-dashoffset: 0; } 92%, 100% { stroke-dashoffset: 1; } }
.isometric228-shackle { animation: isometric228-shackle ${PERIOD}s ease-in-out infinite; }
.isometric228-safe { animation: isometric228-safe ${PERIOD}s ease-in-out infinite; }
.isometric228-check { animation: isometric228-check ${PERIOD}s ease-in-out infinite; }
.isometric228-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric228-scene * { animation: none !important; } }
`;

export function Isometric228({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric228Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const clipId = useId();
  // A line drawn on top of an accent fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric228-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-90 -76 236 210" aria-hidden="true" className="isometric228-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} rx={4} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 156, 92, BASE, 14)} paint={body} />
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
          {/* A tall address bar: the padlock at its head, the address after it */}
          <rect x={6} y={5} width={W - 12} height={15} rx={7.5} className={body.ink} />
          <rect x={27} y={10.2} width={34} height={3.2} rx={1.6} className={body.base} />
          <rect x={64} y={10.2} width={14} height={3.2} rx={1.6} className={body.base} />
          <g transform={`translate(${LOCK.x} ${LOCK.y}) scale(1.15)`}>
            <g className="isometric228-shackle">
              <path d={SHACKLE} className={body.base} />
            </g>
            <rect x={-4.4} y={-0.6} width={8.8} height={6.6} rx={2} className={body.base} />
            {/* Once it is shut the padlock takes the accent */}
            <g className="isometric228-safe">
              <path d={SHACKLE} className={accent ? mine.base : body.base} />
              <rect x={-4.4} y={-0.6} width={8.8} height={6.6} rx={2} className={accent ? mine.base : body.base} />
              <circle cy={2.7} r={1.2} className={accent ? mine.ink : body.ink} />
            </g>
          </g>
          <g clipPath={`url(#${clipId})`}>
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.base} />
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.ink} />
            <rect x={9} y={29} width={36} height={4.6} rx={2.3} className={body.base} />
            <rect x={9} y={36.5} width={26} height={2.8} rx={1.4} className={body.base} />
            <rect x={9} y={42.5} width={22} height={7.6} rx={3.8} className={accent ? mine.base : body.base} />
            <rect x={14.5} y={45.2} width={11} height={2.3} rx={1.15} className={accent ? mine.ink : body.ink} />
            <rect x={53} y={28} width={34} height={22} rx={5} className={body.base} />
            <path d="M56 48l8 -8l5 5l5 -7l10 10Z" className={body.ink} />
            {[9, 49].map((x) => (
              <g key={`card-${x}`}>
                <rect x={x} y={54} width={38} height={13} rx={4} className={body.base} />
                <circle cx={x + 6.5} cy={60.5} r={2.6} className={body.ink} />
                <rect x={x + 12} y={59.3} width={20} height={2.4} rx={1.2} className={body.ink} />
              </g>
            ))}
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the slab */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* The certificate: a thick plate on a foot, its seal facing the viewer */}
        <RoundBlock shape={roundBox(CERT.x - 3, CERT.y - 5, BASE, CERT.w + 6, CERT.d + 10, 2, 3)} paint={body} />
        <Block faces={box(CERT.x, CERT.y, CERT_Z, CERT.w, CERT.d, CERT.h)} paint={body} />
        <g transform={onLeft(CERT.y + CERT.d)}>
          <rect x={CERT.x + 4} y={-(CERT_Z + CERT.h - 5)} width={CERT.w - 8} height={3} rx={1.5} className={body.ink} />
          <rect x={CERT.x + 4} y={-(CERT_Z + CERT.h - 11)} width={CERT.w - 12} height={2.2} rx={1.1} className={body.ink} />
          <rect x={CERT.x + 4} y={-(CERT_Z + CERT.h - 15.5)} width={CERT.w - 10} height={2.2} rx={1.1} className={body.ink} />
          <g transform={`translate(${SEAL.x} ${-SEAL.z})`}>
            <circle r={7.5} className={accent ? mine.base : body.ink} />
            <path d="M-3.2 0.3L-0.9 2.6L3.4 -2.3" pathLength={1} strokeDasharray="1 1" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={cn("isometric228-check", onAccent)} />
          </g>
        </g>
      </svg>
    </div>
  );
}
