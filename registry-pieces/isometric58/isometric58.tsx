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

interface Isometric58Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Show the verified check in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric58Demo: Isometric58Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 92;
const H = 64;
const MID = W / 2;
const SLICES = [0, 1, 2, 3, 4];
const PIVOT = -128;
const CARD = `M8 ${-H}H${W - 8}A8 8 0 0 1 ${W} ${-H + 8}V-8A8 8 0 0 1 ${W - 8} 0H8A8 8 0 0 1 0 -8V${-H + 8}A8 8 0 0 1 8 ${-H}Z`;
const STRAP = `M${MID - 4} ${-H - 10}L${MID - 16} ${PIVOT + 14}Q${MID} ${PIVOT - 8} ${MID + 16} ${PIVOT + 14}L${MID + 4} ${-H - 10}`;

const STYLES = `
@keyframes isometric58-sway { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
@keyframes isometric58-check { 0%, 30% { transform: scale(0.4); opacity: 0; } 38% { transform: scale(1.15); opacity: 1; } 44%, 86% { transform: scale(1); opacity: 1; } 94%, 100% { transform: scale(1); opacity: 0; } }
.isometric58-sway { animation: isometric58-sway 4.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric58-check { animation: isometric58-check 4.8s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric58-still * { animation: none !important; }
.isometric58-still .isometric58-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric58-sway, .isometric58-check { animation: none; } .isometric58-rest { opacity: 1; } }
`;

export function Isometric58({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric58Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const stroke = (fill: string) => fill.replace("fill-", "stroke-");
  const mark = !accent ? (palette === "dark" ? "stroke-zinc-100" : palette === "tone" ? "stroke-black/70" : palette === "light" ? "stroke-zinc-900" : "stroke-foreground") : palette === "tone" ? "stroke-current" : "stroke-white";
  // An invisible mirror of the strap keeps the sway pivot at the top of the loop
  const pivot = <rect x={0} y={PIVOT * 2} width={W} height={1} fill="none" />;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric58-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-14 -112 108 164" aria-hidden="true" className="size-full overflow-visible">
        <g transform={onLeft(0)}>
          <g className="isometric58-sway">
            {pivot}
            <path d={STRAP} fill="none" strokeWidth={9} strokeLinejoin="round" className={paint.body.edge} />
            <path d={STRAP} fill="none" strokeWidth={7} strokeLinejoin="round" className={stroke(paint.body.base)} />
            <path d={STRAP} fill="none" strokeWidth={7} strokeLinejoin="round" className={stroke(paint.body.right)} />
          </g>
        </g>
        {SLICES.map((y, index) => {
          const front = index === SLICES.length - 1;
          return (
            <g key={y} transform={onLeft(y)}>
              <g className="isometric58-sway">
                {pivot}
                <rect x={MID - 7} y={-H - 12} width={14} height={16} rx={3} strokeWidth={1} className={cn(paint.body.base, paint.body.edge)} />
                <rect x={MID - 7} y={-H - 12} width={14} height={16} rx={3} className={front ? paint.body.left : paint.body.right} />
                <path d={CARD} className={paint.body.base} />
                <path d={CARD} className={front ? paint.body.left : paint.body.right} />
                {front && (
                  <>
                    <path d={CARD} fill="none" strokeWidth={1} className={paint.body.edge} />
                    <g className={paint.body.ink}>
                      <rect x={MID - 8} y={-H + 5} width={16} height={4} rx={2} />
                      <rect x={10} y={-H + 16} width={30} height={36} rx={4} />
                      <rect x={48} y={-H + 18} width={34} height={6} rx={3} />
                      <rect x={48} y={-H + 30} width={26} height={4} rx={2} />
                      <rect x={48} y={-H + 38} width={30} height={4} rx={2} />
                      <rect x={48} y={-H + 48} width={20} height={4} rx={2} />
                    </g>
                    <g className={paint.body.base}>
                      <circle cx={25} cy={-H + 29} r={6} />
                      <path d={`M14 ${-H + 52}C14 ${-H + 42} 19 ${-H + 38} 25 ${-H + 38}C31 ${-H + 38} 36 ${-H + 42} 36 ${-H + 52}Z`} />
                    </g>
                    <g className="isometric58-check isometric58-rest opacity-0">
                      <circle cx={40} cy={-H + 50} r={9} className={accent ? paint.accent.base : paint.body.base} strokeWidth={1} />
                      {!accent && <circle cx={40} cy={-H + 50} r={9} fill="none" strokeWidth={1} className={paint.body.edge} />}
                      <polyline points={`36,${-H + 50} 39,${-H + 53} 44.5,${-H + 46.5}`} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={mark} />
                    </g>
                  </>
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
