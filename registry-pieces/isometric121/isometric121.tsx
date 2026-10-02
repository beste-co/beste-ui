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

interface Isometric121Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the guitar body with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric121Demo: Isometric121Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const PLINTH = 6;
const GX = 32;
const GY = 18;
const DEPTH = 8;
const GZ = PLINTH + 12;
// The stand: a post just behind the body, a cradle whose arms carry the lower bout, and a yoke whose prongs pass either side of the neck
const POST_Y = GY - 5;
const ARM = { z: GZ - 2, off: 14.5, w: 4 };
const YOKE = { z: GZ + 78, off: 8, w: 3 };
const FRONT = GY + DEPTH;
// The guitar profile, drawn in its own plane in (x, -z) with the bottom at the origin
const GUITAR =
  "M0 0C15 0 23 -8 23 -21C23 -30 16 -34 15 -38C14 -42 19 -46 19 -53C19 -61 11 -67 0 -67C-11 -67 -19 -61 -19 -53C-19 -46 -14 -42 -15 -38C-16 -34 -23 -30 -23 -21C-23 -8 -15 0 0 0Z";
const NECK = "M-3.5 -64H3.5V-104H-3.5Z M-5 -102H5L6 -118A2 2 0 0 1 4 -120H-4A2 2 0 0 1 -6 -118Z";
const STRINGS = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5];
const HOLE_Z = -44;
const PEGS = [-106, -111, -116];
const SLICES = Array.from({ length: DEPTH + 1 }, (_, index) => GY + index);
const ring = (r: number, w: number, from: number, to: number) => {
  const p = (radius: number, deg: number) => `${(radius * Math.cos((deg * Math.PI) / 180)).toFixed(2)} ${(radius * Math.sin((deg * Math.PI) / 180)).toFixed(2)}`;
  return `M${p(r, from)}A${r} ${r} 0 0 1 ${p(r, to)}L${p(r + w, to)}A${r + w} ${r + w} 0 0 0 ${p(r + w, from)}Z`;
};
const WAVES = [30, 38].map((r) => `${ring(r, 2.5, -30, 30)}${ring(r, 2.5, 150, 210)}`);
const SHAKE = Array.from({ length: 13 }, (_, k) => `${(k * 2.5).toFixed(1)}% { transform: translateX(${k === 12 ? 0 : k % 2 ? 0.7 - k * 0.05 : -0.7 + k * 0.05}px); }`).join(" ");

const STYLES = `
@keyframes isometric121-shake { ${SHAKE} 30%, 100% { transform: translateX(0); } }
@keyframes isometric121-wave { 0% { transform: scale(0.7); opacity: 0; } 8% { opacity: 1; } 40%, 100% { transform: scale(1.15); opacity: 0; } }
.isometric121-strings { animation: isometric121-shake 4s linear infinite; }
.isometric121-wave { transform-origin: 0 0; animation: isometric121-wave 4s ease-out infinite; }
.isometric121-wave + .isometric121-wave { animation-delay: 0.25s; }
.isometric121-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric121-strings, .isometric121-wave { animation: none; } }
`;

export function Isometric121({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric121Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const wood = paint.accent;
  const string = palette === "dark" ? "fill-white/50" : palette === "tone" ? "fill-white/70" : "fill-foreground/40";
  const hole = palette === "dark" ? "fill-black/40" : "fill-black/25";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric121-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-50 -120 112 182" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, 64, 48, PLINTH)} paint={paint.body} />
        <Block faces={box(10, POST_Y, PLINTH, 44, 4, 4)} paint={paint.body} />
        <Block faces={box(14, POST_Y - 5, PLINTH, 4, 30, 4)} paint={paint.body} />
        <Block faces={box(46, POST_Y - 5, PLINTH, 4, 30, 4)} paint={paint.body} />
        <Block faces={box(GX - 2, POST_Y, PLINTH + 4, 4, 4, YOKE.z - PLINTH)} paint={paint.body} />
        <Block faces={box(GX - ARM.off, POST_Y, ARM.z, 2 * ARM.off, 4, 4)} paint={paint.body} />
        <Block faces={box(GX - YOKE.off, POST_Y, YOKE.z, 2 * YOKE.off, 4, 4)} paint={paint.body} />
        {/* Under the body and on the far side of the neck, so the guitar covers them */}
        <Block faces={box(GX - ARM.off, POST_Y + 4, ARM.z, ARM.w, FRONT - POST_Y - 4, 4)} paint={paint.body} />
        <Block faces={box(GX + ARM.off - ARM.w, POST_Y + 4, ARM.z, ARM.w, FRONT - POST_Y - 4, 4)} paint={paint.body} />
        <Block faces={box(GX - YOKE.off, POST_Y + 4, YOKE.z, YOKE.w, FRONT + 2 - POST_Y - 4, 4)} paint={paint.body} />
        {SLICES.map((y, index) => {
          const front = index === SLICES.length - 1;
          const neck = y >= GY + DEPTH - 4;
          return (
            <g key={y} transform={onLeft(y)}>
              <g transform={`translate(${GX} ${-GZ})`}>
                {neck && (
                  <>
                    <path d={NECK} className={paint.body.base} />
                    <path d={NECK} className={front ? paint.body.left : paint.body.right} />
                  </>
                )}
                <path d={GUITAR} className={wood.base} />
                <path d={GUITAR} className={front ? wood.left : wood.right} />
                {front && (
                  <>
                    <path d={GUITAR} fill="none" strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={wood.edge} />
                    <path d={NECK} fill="none" strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={paint.body.edge} />
                    <circle cx={0} cy={HOLE_Z} r={10} className={accent ? wood.ink : paint.body.ink} />
                    <circle cx={0} cy={HOLE_Z} r={7.5} className={hole} />
                    <rect x={-9} y={-18} width={18} height={4} rx={1} className={hole} />
                    <rect x={-3.5} y={-66} width={7} height={2} className={paint.body.ink} />
                    {PEGS.map((peg) => (
                      <g key={peg} className={paint.body.ink}>
                        <circle cx={-7.5} cy={peg} r={1.5} />
                        <circle cx={7.5} cy={peg} r={1.5} />
                      </g>
                    ))}
                    <g className="isometric121-strings">
                      {STRINGS.map((x) => (
                        <rect key={x} x={x - 0.25} y={-117} width={0.5} height={101} className={string} />
                      ))}
                    </g>
                    <g transform={`translate(0 ${HOLE_Z})`} className={paint.body.ink}>
                      {WAVES.map((d) => (
                        <path key={d} d={d} className="isometric121-wave opacity-0" />
                      ))}
                    </g>
                  </>
                )}
              </g>
            </g>
          );
        })}
        <Block faces={box(GX + YOKE.off - YOKE.w, POST_Y + 4, YOKE.z, YOKE.w, FRONT + 2 - POST_Y - 4, 4)} paint={paint.body} />
        {[GX - ARM.off, GX + ARM.off - ARM.w].map((x) => (
          <g key={x}>
            <Block faces={box(x, FRONT, ARM.z, ARM.w, 5, 4)} paint={paint.body} />
            <Block faces={box(x, FRONT + 2, ARM.z + 4, ARM.w, 3, 6)} paint={paint.body} />
          </g>
        ))}
      </svg>
    </div>
  );
}
