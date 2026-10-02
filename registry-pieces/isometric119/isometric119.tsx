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

interface Isometric119Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Stripe the umbrella with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric119Demo: Isometric119Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;

/** An upright cylinder centered on the origin in plan, shaded in two halves like a box. */
function Cylinder({ r, z, h, paint }: { r: number; z: number; h: number; paint: Paint }) {
  const rx = r * ELLIPSE_X;
  const ry = r * ELLIPSE_Y;
  const top = -z - h;
  const bottom = -z;
  const left = `M${-rx} ${top} L${-rx} ${bottom} A${rx} ${ry} 0 0 0 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 1 ${-rx} ${top} Z`;
  const right = `M${rx} ${top} L${rx} ${bottom} A${rx} ${ry} 0 0 1 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 0 ${rx} ${top} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      <ellipse cx={0} cy={top} rx={rx} ry={ry} className={paint.base} />
    </g>
  );
}
const BASE = 8;
const W = 104;
const D = 80;
const SHORE = 76;
const UX = 34;
const UY = 34;
const RIM_Z = 70;
const APEX_Z = 84;
const R = 34;
const PANELS = 12;

// The shoreline in plan, a gentle sine along y
const shore = (x: number, amp: number) =>
  Array.from({ length: 41 }, (_, k) => `${(x - amp * Math.sin((k / 40) * Math.PI * 4)).toFixed(2)} ${((k / 40) * D).toFixed(2)}`);
const SEA = `M${shore(SHORE, 3).join("L")}H${W}V0Z`;
const FOAM = `M${shore(SHORE + 6, 3).join("L")}L${shore(SHORE + 9, 3).reverse().join("L")}Z`;

const RIM = Array.from({ length: PANELS + 1 }, (_, index): Point => {
  const a = ((index * 360) / PANELS + 15) * (Math.PI / 180);
  return [UX + R * Math.cos(a), UY + R * Math.sin(a), RIM_Z];
});
const APEX: Point = [UX, UY, APEX_Z];
// Panels sorted back to front; each one is shaded by where its slope faces
const PANEL_FACES = RIM.slice(0, PANELS)
  .map((p, index) => {
    const q = RIM[index + 1] as Point;
    const nx = (p[0] + q[0]) / 2 - UX;
    const ny = (p[1] + q[1]) / 2 - UY;
    const facing = Math.atan2(ny, nx) * (180 / Math.PI);
    const shade = facing > 50 && facing < 140 ? "left" : facing > -40 && facing <= 50 ? "right" : "top";
    const skirt = nx + ny > 0 ? polygon([p, q, [q[0], q[1], RIM_Z - 4], [p[0], p[1], RIM_Z - 4]]) : null;
    return { index, depth: nx + ny, face: polygon([APEX, p, q]), skirt, shade };
  })
  .sort((a, b) => a.depth - b.depth);

const BACK_TOP = polygon([[30, 46, 17], [30, 60, 17], [20, 60, 32], [20, 46, 32]]);
const BACK_SIDE = polygon([[30, 60, 17], [20, 60, 32], [20, 60, 29], [28, 60, 14]]);

const STYLES = `
@keyframes isometric119-foam { 0%, 100% { transform: translate(0, 0); opacity: 1; } 50% { transform: translate(-6px, 0); opacity: 0.6; } }
.isometric119-foam { animation: isometric119-foam 4.5s ease-in-out infinite; }
.isometric119-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric119-foam { animation: none; } }
`;

export function Isometric119({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric119Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const stripe = (index: number) => (index % 2 === 0 ? paint.accent : paint.body);
  const legs = [
    [30, 47],
    [30, 57],
    [60, 47],
    [60, 57],
  ];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric119-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-74 -66 166 162" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, W, D, BASE)} paint={paint.body} />
        <g transform={onTop(BASE)}>
          <path d={SEA} className={paint.body.ink} />
          <g className="isometric119-foam">
            <path d={FOAM} className={paint.body.base} />
          </g>
          <circle cx={UX + 10} cy={UY + 12} r={R - 10} className={paint.body.ink} />
        </g>
        <g transform={`translate(${((UX - UY) * C).toFixed(1)} ${((UX + UY) * S).toFixed(1)})`}>
          <Cylinder r={1.5} z={BASE} h={APEX_Z - BASE} paint={paint.body} />
        </g>
        {legs.map(([x, y]) => (
          <Block key={`${x}-${y}`} faces={box(x as number, y as number, BASE, 2, 2, 6)} paint={paint.body} />
        ))}
        <Block faces={box(26, 50, BASE, 2, 8, 10)} paint={paint.body} />
        <g className={paint.body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={BACK_TOP} className={paint.body.base} />
          <polygon points={BACK_SIDE} className={paint.body.base} />
          <polygon points={BACK_SIDE} stroke="none" className={paint.body.left} />
        </g>
        <Block faces={box(30, 46, BASE + 6, 32, 14, 3)} paint={paint.body} />
        {PANEL_FACES.map((panel) => {
          const fill = stripe(panel.index);
          return (
            <g key={panel.index} className={fill.edge} strokeWidth={1} strokeLinejoin="round">
              {panel.skirt && (
                <>
                  <polygon points={panel.skirt} className={fill.base} />
                  <polygon points={panel.skirt} stroke="none" className={fill.right} />
                </>
              )}
              <polygon points={panel.face} className={fill.base} />
              {panel.shade !== "top" && <polygon points={panel.face} stroke="none" className={panel.shade === "left" ? fill.left : fill.right} />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
