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

interface Isometric67Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the hubs, blade tips and hut door with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric67Demo: Isometric67Props = {
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

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;
const GROUND = 6;
const HILL = 12;
// Far to near: where each turbine stands, how tall its tower is, its scale and seconds per third of a turn
const TURBINES = [
  { id: "a", x: 38, y: 26, z: HILL, tower: 92, size: 1, turn: 5.4 },
  { id: "b", x: 96, y: 22, z: GROUND, tower: 64, size: 0.74, turn: 4.2 },
  { id: "c", x: 36, y: 80, z: GROUND, tower: 46, size: 0.54, turn: 3.2 },
];
type Turbine = (typeof TURBINES)[number];
// One blade pointing up from the hub: round root, widest a fifth of the way out, long taper, nearly straight leading edge
const SPAN = 46;
const BLADE = "M-1.1 -2.5 L-1.3 -6 C-4 -8.5 -3.7 -15.5 -2.6 -26 C-1.8 -35 -1.1 -42 -0.4 -46 L0.3 -46 C0.6 -35 1 -18 1.2 -6 L1.1 -2.5 Z";
const TIP = "M-1 -40 C-0.8 -42.5 -0.6 -44.5 -0.4 -46 L0.3 -46 C0.4 -44 0.45 -42 0.5 -40 Z";
// Blades are drawn slim and widened here so they still read at card size
const CHORD = 1.7;
const BLADES = [0, 120, 240];
const PINES: [number, number, number][] = [
  [14, 66, 0.8],
  [64, 70, 1],
  [74, 80, 0.7],
];
const STYLES = `
@keyframes isometric67-spin { from { transform: rotate(0deg); } to { transform: rotate(120deg); } }
@keyframes isometric67-gust { 0% { transform: translate(-14px, -8px); opacity: 0; } 25%, 60% { opacity: 1; } 100% { transform: translate(26px, 15px); opacity: 0; } }
${TURBINES.map((turbine) => `.isometric67-spin-${turbine.id} { animation: isometric67-spin ${turbine.turn}s linear infinite; }`).join("\n")}
.isometric67-gust { animation: isometric67-gust 4.5s ease-in-out infinite; }
.isometric67-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric67-rotor, .isometric67-gust { animation: none; } }
`;

/** A tapering round tower standing on plan point (0, 0) of its own group. */
function Tower({ z, h, r, r2, paint }: { z: number; h: number; r: number; r2: number; paint: Paint }) {
  const [bx, by, tx, ty] = [r * ELLIPSE_X, r * ELLIPSE_Y, r2 * ELLIPSE_X, r2 * ELLIPSE_Y].map((value) => +value.toFixed(2)) as [number, number, number, number];
  const top = -z - h;
  const bottom = -z;
  const left = `M${-tx} ${top} L${-bx} ${bottom} A${bx} ${by} 0 0 0 0 ${bottom + by} L0 ${top + ty} A${tx} ${ty} 0 0 1 ${-tx} ${top} Z`;
  const right = `M${tx} ${top} L${bx} ${bottom} A${bx} ${by} 0 0 1 0 ${bottom + by} L0 ${top + ty} A${tx} ${ty} 0 0 0 ${tx} ${top} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      <ellipse cx={0} cy={top} rx={tx} ry={ty} className={paint.base} />
    </g>
  );
}

/** A small pine: a trunk and two cones, each split into a lit and a shaded half. */
function Pine({ x, y, size, paint }: { x: number; y: number; size: number; paint: Paint }) {
  const [px = 0, py = 0] = project([x, y, GROUND]).split(",").map(Number);
  const cone = (base: number, tip: number, half: number) => ({
    whole: `${px - half * size},${py - base * size} ${px + half * size},${py - base * size} ${px},${py - tip * size}`,
    shade: `${px},${py - base * size} ${px + half * size},${py - base * size} ${px},${py - tip * size}`,
  });
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <rect x={px - 1.2 * size} y={py - 4 * size} width={2.4 * size} height={4 * size} className={paint.ink} stroke="none" />
      {[cone(3, 13, 6.5), cone(8.5, 18, 5)].map((part) => (
        <g key={part.whole}>
          <polygon points={part.whole} className={paint.base} />
          <polygon points={part.whole} className={paint.left} stroke="none" />
          <polygon points={part.shade} className={paint.right} stroke="none" />
        </g>
      ))}
    </g>
  );
}

/** One turbine: tower, nacelle along y, then the rotor on a plane y = const facing the viewer. */
function Machine({ turbine, body, trim }: { turbine: Turbine; body: Paint; trim: Paint }) {
  const { x, y, z, tower, size } = turbine;
  const hub = z + tower + 3.5 * size;
  const face = y + 8 * size;
  const scale = (SPAN * size) / SPAN;
  const blades = (shade: boolean) => (
    <g transform={`translate(${x} ${-hub})`}>
      <g className={cn("isometric67-rotor", `isometric67-spin-${turbine.id}`)}>
        {BLADES.map((angle) => (
          <g key={angle} transform={`rotate(${angle}) scale(${(scale * CHORD).toFixed(3)} ${scale.toFixed(3)})`} className={body.edge} strokeWidth={shade ? 0 : 0.9 / scale} strokeLinejoin="round">
            <path d={BLADE} className={body.base} />
            {shade && <path d={BLADE} className={body.right} stroke="none" />}
            <path d={TIP} className={trim.base} stroke="none" />
            {shade && <path d={TIP} className={trim.right} stroke="none" />}
          </g>
        ))}
      </g>
    </g>
  );
  return (
    <g>
      <g transform={`translate(${project([x, y, 0]).replace(",", " ")})`}>
        <Tower z={z} h={2} r={6.5 * size} r2={6.5 * size} paint={body} />
        <Tower z={z + 2} h={tower - 2} r={4.4 * size} r2={2.3 * size} paint={body} />
      </g>
      <Block faces={box(x - 3.6 * size, y - 6 * size, hub - 3.5 * size, 7.2 * size, 13 * size, 7 * size)} paint={body} />
      <g transform={onLeft(face)}>
        <circle cx={x} cy={-hub} r={3.2 * size} className={trim.base} />
        <circle cx={x} cy={-hub} r={3.2 * size} className={trim.right} />
      </g>
      <g transform={onLeft(face + 1 * size)}>{blades(true)}</g>
      <g transform={onLeft(face + 2 * size)}>{blades(false)}</g>
      {[2.4, 3.6, 4.8].map((out, index) => (
        <g key={out} transform={onLeft(face + out * size)}>
          <circle cx={x} cy={-hub} r={(3.6 - index * 0.9) * size} className={trim.base} />
          {index < 2 && <circle cx={x} cy={-hub} r={(3.6 - index * 0.9) * size} className={trim.right} />}
        </g>
      ))}
    </g>
  );
}

export function Isometric67({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric67Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const [far, mid, near] = TURBINES as [Turbine, Turbine, Turbine];
  const streak = body.ink.replace("fill-", "stroke-");

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric67-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-94 -128 204 240" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, 120, 100, GROUND, 24)} paint={body} />
        <RoundBlock shape={roundBox(6, 4, GROUND, 66, 50, HILL - GROUND, 18)} paint={body} />
        <g transform={onTop(GROUND)} className={body.ink}>
          <path d="M92 100 V62 Q92 50 104 50 H120 V58 H104 Q100 58 100 62 V100 Z" />
        </g>
        <Machine turbine={far} body={body} trim={paint.accent} />
        <Pine x={14} y={66} size={0.8} paint={body} />
        <Machine turbine={mid} body={body} trim={paint.accent} />
        <Machine turbine={near} body={body} trim={paint.accent} />
        {PINES.slice(1).map(([x, y, size]) => (
          <Pine key={`${x}-${y}`} x={x} y={y} size={size} paint={body} />
        ))}
        <Block faces={box(102, 64, GROUND, 14, 14, 11)} paint={body} />
        <Block faces={box(100.5, 62.5, GROUND + 11, 17, 17, 2)} paint={body} />
        <g transform={onLeft(78)}>
          <rect x={106.5} y={-(GROUND + 8)} width={5} height={8} className={paint.accent.base} />
        </g>
        <g fill="none" strokeWidth={1.5} strokeLinecap="round" className={streak}>
          <path d="M-70 -54 q8 -5 16 0 t16 0" className="isometric67-gust" />
          <path d="M44 -92 q7 -4 14 0 t14 0" className="isometric67-gust" style={{ animationDelay: "-2.2s" }} />
        </g>
      </svg>
    </div>
  );
}
