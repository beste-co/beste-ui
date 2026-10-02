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

interface Isometric8Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the shield on the lock with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric8Demo: Isometric8Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const TOP = 74;
const MID = 60;
// The shackle is a round rod: a long leg that stays captive in its hole, an arch, and a short leg that lifts clear and drops back
const ROD = 5;
const LEG_Y = 50;
const LONG_X = 38;
const SPAN = 44;
const ARCH = SPAN / 2;
const SPRING = TOP + 14;
const LIFT = 12;
const PERIOD = 5;
// A ball of radius r shows as a circle this much wider, and a level circle as an ellipse this tall
const BALL = ROD * C * Math.SQRT2;
const FLAT = ROD * S * Math.SQRT2;
const AXIS = { x: (LONG_X - LEG_Y) * C, y: (LONG_X + LEG_Y) * S };
// Beads along the arch: distance from the long leg's axis and height, far end to near end
const BEADS = Array.from({ length: 37 }, (_, index) => {
  const turn = (index * Math.PI) / 36;
  return { out: ARCH * (1 - Math.cos(turn)), z: SPRING + ARCH * Math.sin(turn) };
});
/** The opening above a leg's hole, as wide as the hole so the rod keeps its outline: a column over it plus the near half of the hole. */
const mouth = (out: number) => {
  const x = AXIS.x + out * C;
  const y = AXIS.y + out * S - TOP;
  const wide = (BALL * (ROD + 1.5)) / ROD;
  const deep = (FLAT * (ROD + 1.5)) / ROD;
  return `M${(x - wide).toFixed(2)} ${y.toFixed(2)}V-400H${(x + wide).toFixed(2)}V${y.toFixed(2)}A${wide.toFixed(2)} ${deep.toFixed(2)} 0 0 1 ${(x - wide).toFixed(2)} ${y.toFixed(2)}Z`;
};
// Both drawings of the short leg end in the same rounded foot, so nothing changes shape when they swap
const FOOT = TOP - 6 + BALL;
// The long leg is the same string of beads, running down into its hole
const LONG = Array.from({ length: 23 }, (_, index) => TOP - 30 + index * 2);
const SHORT = Array.from({ length: 10 }, (_, index) => FOOT + (index * (SPRING - FOOT)) / 9);
const STYLES = `
@keyframes isometric8-lift { 0%, 8% { transform: translateY(0); } 20%, 74% { transform: translateY(${-LIFT}px); } 80% { transform: translateY(1px); } 83%, 100% { transform: translateY(0); } }
@keyframes isometric8-click { 0%, 78% { transform: scale(1); } 82% { transform: scale(1.08); } 90%, 100% { transform: scale(1); } }
.isometric8-lift { animation: isometric8-lift ${PERIOD}s ease-in-out infinite; will-change: transform; }
.isometric8-shield { transform-box: fill-box; transform-origin: center; animation: isometric8-click ${PERIOD}s ease-out infinite; }
.isometric8-still, .isometric8-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric8-lift, .isometric8-shield { animation: none; } }
`;

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

// The mark's stroke when it carries no tone
const MARK: Record<Palette, string> = { theme: "stroke-foreground/30", light: "stroke-zinc-950/30", dark: "stroke-white/30", tone: "stroke-white/40" };
type Pass = "edge" | "fill" | "shade";
// The shade pass is one flat tint over the whole rod, so overlapping beads do not darken each other
const SHADE: Record<Palette, string> = {
  theme: "fill-foreground opacity-10",
  light: "fill-zinc-950 opacity-10",
  dark: "fill-black opacity-40",
  tone: "fill-black opacity-30",
};

/** One bead of the rod, drawn for one pass. */
function Bead({ out, z, paint, pass }: { out: number; z: number; paint: Paint; pass: Pass }) {
  const cx = AXIS.x + out * C;
  const cy = AXIS.y + out * S - z;
  if (pass === "edge") return <circle cx={cx} cy={cy} r={BALL} fill="none" strokeWidth={2} className={paint.edge} />;
  if (pass === "fill") return <circle cx={cx} cy={cy} r={BALL} className={paint.base} />;
  return <circle cx={cx + 1.3} cy={cy + 1} r={BALL - 2.4} />;
}
export function Isometric8({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric8Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clip = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mark = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : MARK[palette];
  const pit = palette === "dark" ? "fill-black/50" : "fill-black/25";
  const passes: Pass[] = ["edge", "fill", "shade"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric8-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-88 -98 200 206" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={`${clip}-long`}>
            <path d={mouth(0)} />
          </clipPath>
          <clipPath id={`${clip}-short`}>
            <path d={mouth(SPAN)} />
          </clipPath>
        </defs>
        <Block faces={box(4, 12, 0, 112, 76, 10)} paint={body} />
        <RoundBlock shape={roundBox(20, 30, 10, 80, 40, TOP - 10, 10)} paint={body} />
        <g transform={onTop(TOP)} className={cn(pit, body.edge)} strokeWidth={1}>
          <circle cx={LONG_X} cy={LEG_Y} r={ROD + 1.5} />
          <circle cx={LONG_X + SPAN} cy={LEG_Y} r={ROD + 1.5} />
        </g>
        {passes.map((pass) => (
          <g key={pass} className={pass === "shade" ? SHADE[palette] : undefined}>
            {/* The long leg only slides in its hole; the body hides what is below the top face */}
            <g clipPath={`url(#${clip}-long)`}>
              <g className="isometric8-lift">
                {LONG.map((z) => (
                  <Bead key={z} out={0} z={z} paint={body} pass={pass} />
                ))}
              </g>
            </g>
            <g className="isometric8-lift">
              {BEADS.map((bead) => (
                <Bead key={bead.out} out={bead.out} z={bead.z} paint={body} pass={pass} />
              ))}
            </g>
            {/* The short leg lifts clear of its hole and drops back in; below the top face the body hides it */}
            <g clipPath={`url(#${clip}-short)`}>
              <g className="isometric8-lift">
                {SHORT.map((z) => (
                  <Bead key={z} out={SPAN} z={z} paint={body} pass={pass} />
                ))}
              </g>
            </g>
          </g>
        ))}
        <g transform={onLeft(70)}>
          <g className="isometric8-shield">
            {/* A plain guard mark: a shield outline with a check, no plate behind it */}
            <g fill="none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={mark}>
              <path d={`M${MID} -56L${MID + 10} -52V-44C${MID + 10} -36.5 ${MID + 6} -32 ${MID} -29.5C${MID - 6} -32 ${MID - 10} -36.5 ${MID - 10} -44V-52Z`} />
              <path d={`M${MID - 4.5} -43L${MID - 1} -39.5L${MID + 5} -46.5`} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
