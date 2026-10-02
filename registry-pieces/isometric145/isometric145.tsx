"use client";

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

interface Isometric145Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the timetable board with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric145Demo: Isometric145Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

type Rod = ReturnType<typeof rod>;

/** A round rod lying along x or y from a to b, centered on (u, z) in the other two axes. */
function rod(axis: "x" | "y", a: number, b: number, u: number, z: number, r: number) {
  const at = (t: number, degrees: number): Point => {
    const angle = (degrees * Math.PI) / 180;
    const du = r * Math.cos(angle);
    const dz = r * Math.sin(angle);
    return axis === "x" ? [t, u + du, z + dz] : [u + du, t, z + dz];
  };
  const arc = (t: number, from: number, to: number) => Array.from({ length: 13 }, (_, k) => at(t, from + ((to - from) * k) / 12));
  const band = (from: number, to: number) => polygon([...arc(a, from, to), ...arc(b, from, to).reverse()]);
  return { axis, side: band(-45, 135), shade: band(-45, 45), cap: polygon(Array.from({ length: 36 }, (_, k) => at(b, k * 10))) };
}

function RodBlock({ shape, paint }: { shape: Rod; paint: Paint }) {
  const along = shape.axis === "y";
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.shade} className={along ? paint.right : paint.left} stroke="none" />
      <polygon points={shape.cap} className={paint.base} />
      <polygon points={shape.cap} className={along ? paint.left : paint.right} stroke="none" />
    </g>
  );
}

const G = 8;
const LEN = 142;
const WALK = 12;
const WALK_D = 34;
// Shelter on the sidewalk at the back
const SX = 98;
const SY = 6;
const SW = 38;
const SD = 22;
const SH = 38;
// Bus on the road in front, nose toward +x
const Y0 = 36;
const Y1 = 64;
const B0 = 18;
const B1 = 102;
const Z = 14;
const TOP = 50;
const R = 6;
const WHEELS = [B0 + 16, B0 + 68];
const DASHES = [4, 24, 44, 64, 84, 104, 124];
const ROWS = [0, 1, 2, 3];
const shift = (dx: number) => `translate(${(dx * C).toFixed(1)}px, ${(dx * S).toFixed(1)}px)`;

// The bus waits at the stop; its double door, set between the wheels, slides open and shut. Each leaf is this wide
const LEAF = 8;
const DOORS = [34];
const STYLES = `
@keyframes isometric145-leaf-a { 0%, 14%, 78%, 100% { transform: translateX(0); } 28%, 64% { transform: translateX(${-LEAF + 1}px); } }
@keyframes isometric145-leaf-b { 0%, 14%, 78%, 100% { transform: translateX(0); } 28%, 64% { transform: translateX(${LEAF - 1}px); } }
@keyframes isometric145-due { 0%, 8%, 16%, 24%, 32% { opacity: 1; } 4%, 12%, 20%, 28% { opacity: 0.2; } 36%, 100% { opacity: 1; } }
.isometric145-leaf-a { animation: isometric145-leaf-a 6s cubic-bezier(0.45, 0, 0.25, 1) infinite; }
.isometric145-leaf-b { animation: isometric145-leaf-b 6s cubic-bezier(0.45, 0, 0.25, 1) infinite; }
.isometric145-due { animation: isometric145-due 6s steps(1, end) infinite; }
.isometric145-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric145-leaf-a, .isometric145-leaf-b, .isometric145-due { animation: none; } }
`;

function Wheels({ y, paint }: { y: number; paint: Paint }) {
  return (
    <g>
      {WHEELS.map((x) => (
        <g key={x}>
          <RodBlock shape={rod("y", y, y + 4, x, G + R, R)} paint={paint} />
          <g transform={onLeft(y + 4)} className={paint.ink}>
            <circle cx={x} cy={-(G + R)} r={2.5} />
          </g>
        </g>
      ))}
    </g>
  );
}

export function Isometric145({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric145Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const board = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric145-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-72 -34 200 148" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, LEN, 76, G)} paint={body} />
        <Block faces={box(0, 0, G, LEN, WALK_D, WALK - G)} paint={body} />
        <g transform={onTop(G)} className={body.ink}>
          {DASHES.map((x) => (
            <rect key={x} x={x} y={72} width={12} height={2} rx={1} />
          ))}
        </g>
        <Block faces={box(SX, SY, WALK, SW, 2, SH)} paint={body} />
        <g transform={onLeft(SY + 2)} className={body.ink}>
          <rect x={SX + 3} y={-(WALK + SH - 3)} width={SW - 6} height={SH - 14} rx={1} />
        </g>
        <Block faces={box(SX + 6, SY + 4, WALK + 6, SW - 14, 7, 2)} paint={body} />
        <Block faces={box(SX + 6, SY + 4, WALK, 2, 7, 6)} paint={body} />
        <Block faces={box(SX + SW - 10, SY + 4, WALK, 2, 7, 6)} paint={body} />
        <Block faces={box(SX + SW - 2, SY + 2, WALK, 2, SD - 2, SH)} paint={body} />
        <g transform={onRight(SX + SW)}>
          <rect x={SY + 4} y={-(WALK + SH - 3)} width={SD - 8} height={SH - 6} rx={1} className={body.ink} />
          <rect x={SY + 4} y={-(WALK + SH - 6)} width={SD - 8} height={18} rx={1.5} className={board.base} />
          <rect x={SY + 4} y={-(WALK + SH - 6)} width={SD - 8} height={18} rx={1.5} className={palette === "tone" || !accent ? board.right : board.left} />
          {ROWS.map((row) => (
            <rect key={row} x={SY + 7} y={-(WALK + SH - 9) + row * 4.5} width={row === 0 ? SD - 14 : SD - 18 + (row % 2) * 2} height={2} rx={1} className={cn(board.ink, row === 0 && "isometric145-due")} />
          ))}
        </g>
        <Block faces={box(SX - 2, SY - 2, WALK + SH, SW + 4, SD + 6, 4)} paint={body} />
        <Block faces={box(SX - 6, SD + 4, WALK, 2, 2, 46)} paint={body} />
        <g transform={onLeft(SD + 6)}>
          <circle cx={SX - 5} cy={-(WALK + 46)} r={7} className={body.base} />
          <circle cx={SX - 5} cy={-(WALK + 46)} r={7} className={body.left} />
          <circle cx={SX - 5} cy={-(WALK + 46)} r={7} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className={body.edge} />
          <rect x={SX - 9} y={-(WALK + 50)} width={8} height={6} rx={1.5} className={body.ink} />
          <rect x={SX - 9} y={-(WALK + 43)} width={8} height={1.5} rx={0.75} className={body.ink} />
        </g>
        <g>
          <Wheels y={Y0 + 1} paint={body} />
          <Block faces={box(B0, Y0, Z, B1 - B0, Y1 - Y0, TOP - Z)} paint={body} />
          <Block faces={box(B0 + 8, Y0 + 5, TOP, 30, Y1 - Y0 - 10, 4)} paint={body} />
          <g transform={onLeft(Y1)} className={body.ink}>
            {[4, 61].map((x) => (
              <rect key={x} x={B0 + x} y={-(TOP - 6)} width={16} height={14} rx={1.5} />
            ))}
            <rect x={B0 + 80} y={-(TOP - 6)} width={2} height={14} rx={1} />
            <rect x={B0} y={-(Z + 12)} width={DOORS[0] ?? 0} height={2} />
            <rect x={B0 + (DOORS[0] ?? 0) + 2 * LEAF} y={-(Z + 12)} width={B1 - B0 - (DOORS[0] ?? 0) - 2 * LEAF} height={2} />
          </g>
          <g transform={onLeft(Y1)}>
            {DOORS.map((x) => (
              <g key={x}>
                <rect x={B0 + x} y={-(TOP - 5)} width={2 * LEAF} height={TOP - 5 - Z - 2} className={palette === "dark" ? "fill-black/60" : "fill-black/40"} />
                {["a", "b"].map((leaf, index) => (
                  <g key={leaf} className={`isometric145-leaf-${leaf}`}>
                    <rect x={B0 + x + index * LEAF} y={-(TOP - 5)} width={LEAF} height={TOP - 5 - Z - 2} strokeWidth={1} className={cn(body.base, body.edge)} />
                    <rect x={B0 + x + index * LEAF} y={-(TOP - 5)} width={LEAF} height={TOP - 5 - Z - 2} className={body.left} />
                    <rect x={B0 + x + index * LEAF + 1.5} y={-(TOP - 8)} width={LEAF - 3} height={14} rx={1} className={body.ink} />
                  </g>
                ))}
              </g>
            ))}
          </g>
          <g transform={onRight(B1)} className={body.ink}>
            <rect x={Y0 + 3} y={-(TOP - 2)} width={Y1 - Y0 - 6} height={5} rx={1} />
            <rect x={Y0 + 3} y={-(TOP - 9)} width={Y1 - Y0 - 6} height={17} rx={2} />
            <rect x={Y0 + 4} y={-(Z + 6)} width={5} height={3} rx={1.5} />
            <rect x={Y1 - 9} y={-(Z + 6)} width={5} height={3} rx={1.5} />
          </g>
          <Wheels y={Y1 - 3} paint={body} />
        </g>
      </svg>
    </div>
  );
}
