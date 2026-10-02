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

interface Isometric160Props {
  /** Three letters, one per block, bottom left to top. */
  letters?: string;
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the top block with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric160Demo: Isometric160Props = {
  letters: "ABC",
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const MAT = 6;
const CUBE = 26;
const Y = 8;
const BLOCKS = [
  { x: 0, z: MAT, number: "1" },
  { x: 30, z: MAT, number: "2" },
  { x: 15, z: MAT + CUBE, number: "3" },
];
const DROP = 40;
const LAND = [0, 13, 26];
const FRAME = `M0 0H${CUBE}V${CUBE}H0ZM2.5 2.5V${CUBE - 2.5}H${CUBE - 2.5}V2.5Z`;
const drop = (start: number, index: number) =>
  `@keyframes isometric160-drop${index} { 0%, ${start}% { transform: translateY(-${DROP}px); opacity: 0; } ${start + 3}% { opacity: 1; } ${start + 9}% { transform: translateY(0); } ${start + 11}% { transform: translateY(-3px); } ${start + 13}%, 84% { transform: translateY(0); opacity: 1; } 92%, 100% { transform: translateY(0); opacity: 0; } }`;

const STYLES = `
${LAND.map(drop).join("\n")}
${LAND.map((_, index) => `.isometric160-drop${index} { animation: isometric160-drop${index} 6s ease-in-out infinite; will-change: transform, opacity; }`).join("\n")}
.isometric160-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { ${LAND.map((_, index) => `.isometric160-drop${index}`).join(", ")} { animation: none; } }
`;

export function Isometric160({ letters = "ABC", tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric160Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const chars = Array.from(letters.padEnd(3, " ")).slice(0, 3);
  const label = palette === "tone" ? "fill-black/70" : palette === "dark" ? "fill-zinc-100" : palette === "light" ? "fill-zinc-900" : "fill-foreground";
  const onAccent = !accent ? label : palette === "tone" ? "fill-current" : "fill-white";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric160-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-48 -56 106 114" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-6, 0, 0, CUBE * 2 + 16, Y * 2 + CUBE, MAT)} paint={body} />
        <g transform={onTop(MAT)} className={body.ink}>
          <rect x={-2} y={4} width={CUBE * 2 + 8} height={Y * 2 + CUBE - 8} rx={4} fillRule="evenodd" />
        </g>
        {BLOCKS.map((block, index) => {
          const top = index === 2;
          const look = top ? paint.accent : body;
          const text = top ? onAccent : label;
          return (
            <g key={block.number} className={`isometric160-drop${index}`}>
              <Block faces={box(block.x, Y, block.z, CUBE, CUBE, CUBE)} paint={look} />
              <g transform={onTop(block.z + CUBE)}>
                <path d={FRAME} transform={`translate(${block.x} ${Y})`} fillRule="evenodd" className={look.ink} />
              </g>
              <g transform={onLeft(Y + CUBE)}>
                <path d={FRAME} transform={`translate(${block.x} ${-block.z - CUBE})`} fillRule="evenodd" className={look.ink} />
                <text x={block.x + CUBE / 2} y={-block.z - CUBE / 2} textAnchor="middle" dominantBaseline="central" fontSize={17} className={cn("font-semibold", text)}>
                  {chars[index]}
                </text>
              </g>
              <g transform={onRight(block.x + CUBE)}>
                <path d={FRAME} transform={`translate(${Y} ${-block.z - CUBE})`} fillRule="evenodd" className={look.ink} />
                <text x={-Y - CUBE / 2} y={-block.z - CUBE / 2} transform="scale(-1 1)" textAnchor="middle" dominantBaseline="central" fontSize={17} className={cn("font-semibold", text)}>
                  {block.number}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
