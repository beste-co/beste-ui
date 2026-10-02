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

interface Isometric70Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the container on the hook with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric70Demo: Isometric70Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const G = 8;
const CW = 40;
const CD = 20;
const CH = 20;
const CX = 32;
const BACK = 14;
const FRONT = 36;
const STACK = [
  { y: BACK, z: G },
  { y: FRONT, z: G },
  { y: BACK, z: G + CH },
];
const LOAD = { y: FRONT, z: G + CH };
const TOP = 90;
const LEGS_X = [4, 100];
const LIFT = 30;
const CABLES = [CX + 16, CX + 24];
const CABLE: Record<Palette, string> = {
  theme: "fill-foreground/40",
  light: "fill-zinc-950/40",
  dark: "fill-white/40",
  tone: "fill-black/30",
};
const CABLE_TOP = TOP;
const CABLE_BOTTOM = LOAD.z + CH + 3;
const cableRect = (x: number) => {
  const y = LOAD.y + CD / 2;
  return { x: (x - y) * C - 0.75, y: (x + y) * S - CABLE_TOP, h: CABLE_TOP - CABLE_BOTTOM };
};
const SHORT = ((CABLE_TOP - CABLE_BOTTOM - LIFT) / (CABLE_TOP - CABLE_BOTTOM)).toFixed(3);

const STYLES = `
@keyframes isometric70-hook { 0% { transform: translateY(-${LIFT}px); } 40%, 56% { transform: translateY(0); } 78%, 100% { transform: translateY(-${LIFT}px); } }
@keyframes isometric70-cable { 0% { transform: scaleY(${SHORT}); } 40%, 56% { transform: scaleY(1); } 78%, 100% { transform: scaleY(${SHORT}); } }
@keyframes isometric70-load { 0% { transform: translateY(-${LIFT}px); opacity: 1; } 40%, 88% { transform: translateY(0); opacity: 1; } 93% { transform: translateY(0); opacity: 0; } 94% { transform: translateY(-${LIFT}px); opacity: 0; } 100% { transform: translateY(-${LIFT}px); opacity: 1; } }
.isometric70-hook { animation: isometric70-hook 6s cubic-bezier(0.45, 0, 0.2, 1) infinite; will-change: transform; }
.isometric70-cable { animation: isometric70-cable 6s cubic-bezier(0.45, 0, 0.2, 1) infinite; transform-box: fill-box; transform-origin: 50% 0; }
.isometric70-load { animation: isometric70-load 6s cubic-bezier(0.45, 0, 0.2, 1) infinite; will-change: transform, opacity; }
.isometric70-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric70-hook, .isometric70-cable, .isometric70-load { animation: none; } }
`;

function Container({ y, z, paint }: { y: number; z: number; paint: Paint }) {
  return (
    <g>
      <Block faces={box(CX, y, z, CW, CD, CH)} paint={paint} />
      <g transform={onLeft(y + CD)} className={paint.ink}>
        {[5, 10, 15, 20, 25, 30, 35].map((x) => (
          <rect key={x} x={CX + x - 1} y={-z - CH + 3} width={2} height={CH - 6} />
        ))}
      </g>
      <g transform={onRight(CX + CW)} className={paint.ink}>
        <rect x={y + 3} y={-z - CH + 3} width={6.5} height={CH - 6} rx={1} />
        <rect x={y + 10.5} y={-z - CH + 3} width={6.5} height={CH - 6} rx={1} />
      </g>
    </g>
  );
}

export function Isometric70({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric70Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric70-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-76 -100 184 200" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-4, 0, 0, 118, 76, G)} paint={paint.body} />
        <g transform={onTop(G)} className={paint.body.ink}>
          <rect x={0} y={7} width={110} height={4} rx={2} />
          <rect x={0} y={63} width={110} height={4} rx={2} />
        </g>
        {LEGS_X.map((x) => (
          <Block key={x} faces={box(x, 6, G, 6, 6, TOP - G)} paint={paint.body} />
        ))}
        <Block faces={box(4, 6, TOP, 102, 6, 8)} paint={paint.body} />
        {STACK.map(({ y, z }) => (
          <Container key={`${y}-${z}`} y={y} z={z} paint={paint.body} />
        ))}
        <g className="isometric70-load">
          <Container y={LOAD.y} z={LOAD.z} paint={paint.accent} />
        </g>
        {CABLES.map((x) => {
          const rect = cableRect(x);
          return <rect key={x} x={rect.x} y={rect.y} width={1.5} height={rect.h} className={cn("isometric70-cable", CABLE[palette])} />;
        })}
        <g className="isometric70-hook">
          <Block faces={box(CX + 12, LOAD.y + 7, LOAD.z + CH, 16, 6, 3)} paint={paint.body} />
        </g>
        {LEGS_X.map((x) => (
          <Block key={x} faces={box(x, 62, G, 6, 6, TOP - G)} paint={paint.body} />
        ))}
        {LEGS_X.map((x) => (
          <Block key={x} faces={box(x, 6, TOP, 6, 62, 8)} paint={paint.body} />
        ))}
        <Block faces={box(CX + 12, 12, TOP + 2, 16, 50, 6)} paint={paint.body} />
        <Block faces={box(CX + 10, LOAD.y - 2, TOP + 8, 20, 22, 8)} paint={paint.body} />
        <Block faces={box(4, 62, TOP, 102, 6, 8)} paint={paint.body} />
      </svg>
    </div>
  );
}
