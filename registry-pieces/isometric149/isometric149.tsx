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

interface Isometric149Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the signal arcs with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric149Demo: Isometric149Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const G = 8;
const CX = 40;
const CY = 40;
const TOP = 92;
const LEVELS = [G, 32, 54, 74, TOP];
const half = (z: number) => 18 - ((z - G) / (TOP - G)) * 11;
const corner = (sx: number, sy: number, z: number): Point => [CX + sx * half(z), CY + sy * half(z), z];
type Seg = [Point, Point];
// One lattice face: the two legs it shares are drawn separately, this is the zigzag bracing
function bracing(face: (s: number, z: number) => Point): Seg[] {
  const out: Seg[] = [];
  for (let index = 0; index < LEVELS.length - 1; index++) {
    const z0 = LEVELS[index] as number;
    const z1 = LEVELS[index + 1] as number;
    out.push([face(-1, z1), face(1, z1)]);
    out.push(index % 2 === 0 ? [face(-1, z0), face(1, z1)] : [face(1, z0), face(-1, z1)]);
  }
  return out;
}
const BACK_X = bracing((s, z) => corner(-1, s, z));
const BACK_Y = bracing((s, z) => corner(s, -1, z));
const FRONT_Y = bracing((s, z) => corner(s, 1, z));
const FRONT_X = bracing((s, z) => corner(1, s, z));
const leg = (sx: number, sy: number): Seg => [corner(sx, sy, G), corner(sx, sy, TOP)];
const at = (point: Point) => project(point).split(",").map(Number) as [number, number];
const [HX, HY] = at([CX, CY, TOP + 16]);
const ARCS = [10, 17, 24];
const arc = (r: number, side: number) => {
  const a = (40 * Math.PI) / 180;
  const x = (side * r * Math.cos(a)).toFixed(1);
  const y = (r * Math.sin(a)).toFixed(1);
  return `M${HX + Number(x)} ${(HY - Number(y)).toFixed(1)}A${r} ${r} 0 0 ${side > 0 ? 1 : 0} ${HX + Number(x)} ${(HY + Number(y)).toFixed(1)}`;
};

const STYLES = `
${ARCS.map((_, index) => `@keyframes isometric149-wave${index} { 0%, ${8 + index * 12}% { opacity: 0.15; } ${16 + index * 12}%, 76% { opacity: 1; } 90%, 100% { opacity: 0.15; } }
.isometric149-wave${index} { animation: isometric149-wave${index} 4s ease-out infinite; }`).join("\n")}
.isometric149-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { ${ARCS.map((_, index) => `.isometric149-wave${index}`).join(", ")} { animation: none; } }
`;

function Struts({ segs, paint, shade, width = 2.4 }: { segs: Seg[]; paint: Paint; shade: string; width?: number }) {
  const stroke = (cls: string) => cls.replace("fill-", "stroke-");
  return (
    <g strokeLinecap="round">
      {segs.map(([a, b], index) => {
        const [x1, y1] = at(a);
        const [x2, y2] = at(b);
        return (
          <g key={index}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={width + 1.4} className={paint.edge} />
            <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={width} className={stroke(paint.base)} />
            <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={width} className={stroke(shade)} />
          </g>
        );
      })}
    </g>
  );
}

export function Isometric149({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric149Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const wave = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : body.ink.replace("fill-", "stroke-").replace("/15", "/30");
  const panel = (x: number, y: number, w: number, d: number) => <Block faces={box(x, y, TOP + 4, w, d, 18)} paint={body} />;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric149-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -98 160 186" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, 80, 80, G)} paint={body} />
        <g transform={onTop(G)} className={body.ink}>
          <rect x={4} y={4} width={72} height={72} rx={2} fill="none" strokeWidth={1.5} className={body.ink.replace("fill-", "stroke-")} />
        </g>
        <Block faces={box(60, 6, G, 14, 10, 14)} paint={body} />
        <g transform={onLeft(16)} className={body.ink}>
          <rect x={63} y={-(G + 11)} width={8} height={8} rx={1} />
        </g>
        <Struts segs={[...BACK_X, ...BACK_Y]} paint={body} shade={body.right} width={2} />
        <Struts segs={[leg(-1, -1)]} paint={body} shade={body.right} width={3.2} />
        <Struts segs={[leg(1, -1), leg(-1, 1)]} paint={body} shade={body.left} width={3.2} />
        <Struts segs={FRONT_Y} paint={body} shade={body.left} />
        <Struts segs={FRONT_X} paint={body} shade={body.right} />
        <Struts segs={[leg(1, 1)]} paint={body} shade={body.left} width={3.2} />
        <Block faces={box(CX - 10, CY - 10, TOP, 20, 20, 3)} paint={body} />
        {panel(CX - 3, CY - 9, 6, 2)}
        {panel(CX - 9, CY - 3, 2, 6)}
        <Block faces={box(CX - 1, CY - 1, TOP + 3, 2, 2, 28)} paint={body} />
        {panel(CX + 7, CY - 3, 2, 6)}
        {panel(CX - 3, CY + 7, 6, 2)}
        <g fill="none" strokeWidth={2.2} strokeLinecap="round" className={wave}>
          {ARCS.map((r, index) => (
            <g key={r} className={`isometric149-wave${index}`}>
              <path d={arc(r + 8, -1)} />
              <path d={arc(r + 8, 1)} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
