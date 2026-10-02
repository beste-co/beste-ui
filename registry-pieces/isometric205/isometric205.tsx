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

interface Isometric205Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the publish button, the secure mark, the live page details and the beacon with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric205Demo: Isometric205Props = {
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

const PERIOD = 10;
// The publish button sits in a low housing in front of the stand and sinks into its well when pressed
const BUTTON = { x: 64, y: 74, r: 9, h: 5, housing: 13, rim: 3, press: 3 };
const WELL = { cx: (BUTTON.x - BUTTON.y) * C, cy: (BUTTON.x + BUTTON.y) * S - BASE - BUTTON.rim, a: BUTTON.r * 1.2247 + 0.8, b: BUTTON.r * 0.7071 + 0.6 };
// Everything above the front rim of the well: what is left of the button once it sinks
const WELL_CLIP = `M${(WELL.cx - WELL.a).toFixed(1)} ${WELL.cy.toFixed(1)}v-40h${(2 * WELL.a).toFixed(1)}v40a${WELL.a.toFixed(1)} ${WELL.b.toFixed(1)} 0 0 1 ${(-2 * WELL.a).toFixed(1)} 0Z`;
const BEACON = { x: 138, y: 44, stem: 14 };
const CHECK = "M-1.1 0.1L-0.3 0.9L1.2 -0.8";
const pulse = (name: string, shift: number) =>
  `@keyframes isometric205-${name} { 0%, ${24 + shift}% { opacity: 0; } ${[0, 1, 2].map((beat) => `${30 + shift + beat * 16}% { opacity: 1; } ${38 + shift + beat * 16}% { opacity: 0; }`).join(" ")} 100% { opacity: 0; } }`;

const STYLES = `
@keyframes isometric205-press { 0%, 13%, 22%, 100% { transform: translateY(0px); } 17%, 18% { transform: translateY(${BUTTON.press}px); } }
@keyframes isometric205-live { 0%, 18% { opacity: 0; } 26%, 84% { opacity: 1; } 92%, 100% { opacity: 0; } }
${pulse("near", 0)}
${pulse("far", 5)}
.isometric205-press { animation: isometric205-press ${PERIOD}s ease-in-out infinite; }
.isometric205-live { animation: isometric205-live ${PERIOD}s ease-in-out infinite; }
.isometric205-near { animation: isometric205-near ${PERIOD}s ease-in-out infinite; }
.isometric205-far { animation: isometric205-far ${PERIOD}s ease-in-out infinite; }
.isometric205-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric205-scene * { animation: none !important; } }
`;

export function Isometric205({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric205Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill, and one drawn in the accent on a neutral fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const inAccent = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.edge;
  const wellId = useId();

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric205-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-90 -76 236 210" aria-hidden="true" className="isometric205-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} rx={4} />
          </clipPath>
          <clipPath id={wellId}>
            <path d={WELL_CLIP} />
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
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={7 + dot * 4.5} cy={6.5} r={1.4} className={body.ink} />
          ))}
          {/* The address bar: a plain dot while it is a draft, a secure mark in the accent once it is live */}
          <rect x={24} y={3.8} width={W - 48} height={5.4} rx={2.7} className={body.ink} />
          <circle cx={28} cy={6.5} r={1.3} className={body.base} />
          <rect x={32} y={5.4} width={22} height={2.2} rx={1.1} className={body.base} />
          <g transform="translate(28 6.5)" className="isometric205-live">
            <circle r={2.2} className={accent ? mine.base : body.base} />
            <path d={CHECK} fill="none" strokeWidth={0.8} strokeLinecap="round" strokeLinejoin="round" className={onAccent} />
          </g>
          <g clipPath={`url(#${clipId})`}>
            {/* The draft: an empty page with dashed placeholders */}
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.base} />
            <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.left} />
            <g fill="none" strokeWidth={1.1} strokeDasharray="3 2.2" strokeLinecap="round" className={body.edge}>
              <rect x={9} y={19} width={38} height={6} rx={3} />
              <rect x={9} y={33} width={22} height={8} rx={4} />
              <rect x={55} y={18} width={32} height={24} rx={5} />
              <rect x={9} y={46.5} width={38} height={18.5} rx={5} />
              <rect x={49} y={46.5} width={38} height={18.5} rx={5} />
            </g>
            <rect x={9} y={27.8} width={26} height={2.4} rx={1.2} className={body.ink} />
            {/* The live page fades in over the draft */}
            <g className="isometric205-live">
              <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.base} />
              <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.h} className={body.ink} />
              <rect x={9} y={19.8} width={38} height={4.6} rx={2.3} className={body.base} />
              <rect x={9} y={27.5} width={26} height={2.8} rx={1.4} className={body.base} />
              <rect x={9} y={33.2} width={22} height={7.6} rx={3.8} className={accent ? mine.base : body.base} />
              <rect x={14.5} y={35.9} width={11} height={2.3} rx={1.15} className={accent ? mine.ink : body.ink} />
              <rect x={55} y={18} width={32} height={24} rx={5} className={body.base} />
              <circle cx={64} cy={26} r={3} className={accent ? mine.base : body.ink} />
              <path d="M57 40l8 -8l5 5l5 -7l10 10Z" className={body.ink} />
              {[9, 49].map((x) => (
                <g key={`card-${x}`}>
                  <rect x={x} y={46.5} width={38} height={18.5} rx={5} className={body.base} />
                  <circle cx={x + 7} cy={53} r={3} className={body.ink} />
                  <rect x={x + 13} y={51.8} width={18} height={2.4} rx={1.2} className={body.ink} />
                  <rect x={x + 4} y={59} width={24} height={2.2} rx={1.1} className={body.ink} />
                </g>
              ))}
            </g>
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the slab */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
        {/* The publish button: a housing with a well, and the button clipped to the well's rim so it sinks in */}
        <RoundBlock shape={roundBox(BUTTON.x - BUTTON.housing, BUTTON.y - BUTTON.housing, BASE, 2 * BUTTON.housing, 2 * BUTTON.housing, BUTTON.rim, BUTTON.housing)} paint={body} />
        <g transform={onTop(BASE + BUTTON.rim)}>
          <circle cx={BUTTON.x} cy={BUTTON.y} r={BUTTON.r + 1} className={body.ink} />
          <circle cx={BUTTON.x} cy={BUTTON.y} r={BUTTON.r + 1} className={body.ink} />
        </g>
        <g clipPath={`url(#${wellId})`}>
          <g className="isometric205-press">
            <RoundBlock shape={roundBox(BUTTON.x - BUTTON.r, BUTTON.y - BUTTON.r, BASE + BUTTON.rim, 2 * BUTTON.r, 2 * BUTTON.r, BUTTON.h, BUTTON.r)} paint={mine} />
            <g transform={`${onTop(BASE + BUTTON.rim + BUTTON.h)} translate(${BUTTON.x} ${BUTTON.y})`} fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={onAccent}>
              <path d="M0 4V-4M-3.2 -0.8L0 -4L3.2 -0.8" />
            </g>
          </g>
        </g>
        {/* The beacon beside the stand: rings spread over the desk and the cap takes the accent while the page is live */}
        <g transform={onTop(BASE)} fill="none" strokeWidth={1.4} className={inAccent}>
          <circle cx={BEACON.x} cy={BEACON.y} r={9.5} className="isometric205-near" />
          <circle cx={BEACON.x} cy={BEACON.y} r={14} className="isometric205-far" />
        </g>
        <RoundBlock shape={roundBox(BEACON.x - 5, BEACON.y - 5, BASE, 10, 10, 2, 5)} paint={body} />
        <RoundBlock shape={roundBox(BEACON.x - 2, BEACON.y - 2, BASE + 2, 4, 4, BEACON.stem, 2)} paint={body} />
        <RoundBlock shape={roundBox(BEACON.x - 4.5, BEACON.y - 4.5, BASE + 2 + BEACON.stem, 9, 9, 5, 4.5)} paint={body} />
        <g className="isometric205-live">
          <RoundBlock shape={roundBox(BEACON.x - 4.5, BEACON.y - 4.5, BASE + 2 + BEACON.stem, 9, 9, 5, 4.5)} paint={mine} />
        </g>
      </svg>
    </div>
  );
}
