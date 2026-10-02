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

interface Isometric64Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the carton sliding into the empty slot with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric64Demo: Isometric64Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 96;
const D = 32;
const POSTS = [0, 45, 90];
const TOP = 100;
const DECKS = [12, 52, 92];
const BAYS = [6, 51];
const MID_POST = 45;
const TOP_DECK = 92;

interface Carton {
  bay: number;
  deck: number;
  w: number;
  h: number;
  dx: number;
}
// Cartons per shelf level; the empty slot is bay 1 on the middle level
const CARTONS: Carton[] = [
  { bay: 0, deck: 0, w: 34, h: 26, dx: 3 },
  { bay: 1, deck: 0, w: 17, h: 26, dx: 3 },
  { bay: 1, deck: 0, w: 15, h: 18, dx: 22 },
  { bay: 0, deck: 1, w: 34, h: 24, dx: 3 },
  { bay: 0, deck: 2, w: 24, h: 18, dx: 8 },
];
const SLOT = { bay: 1, deck: 1, w: 34, h: 26, dx: 3 };

function cartonFaces({ bay, deck, w, h, dx }: Carton) {
  const x = (BAYS[bay] as number) + dx;
  const z = (DECKS[deck] as number) + 4;
  return { pallet: box(x, 4, z, w, 24, 4), carton: box(x + 1, 5, z + 4, w - 2, 22, h), x, z };
}

const STYLES = `
@keyframes isometric64-slide { 0%, 6% { transform: translate(-27.7px, 16px); opacity: 0; } 14% { opacity: 1; } 36%, 74% { transform: translate(0, 0); opacity: 1; } 90% { transform: translate(-27.7px, 16px); opacity: 1; } 96%, 100% { transform: translate(-27.7px, 16px); opacity: 0; } }
.isometric64-carton { animation: isometric64-slide 5.2s cubic-bezier(0.45, 0, 0.2, 1) infinite; will-change: transform, opacity; }
.isometric64-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric64-carton { animation: none; } }
`;

function CartonBlock({ carton, paint, tape }: { carton: Carton; paint: Paint; tape: string }) {
  const faces = cartonFaces(carton);
  const mid = faces.x + carton.w / 2;
  return (
    <g>
      <Block faces={faces.pallet} paint={paint} />
      <Block faces={faces.carton} paint={paint} />
      <g transform={onTop(faces.z + 4 + carton.h)} className={tape}>
        <rect x={mid - 2} y={5} width={4} height={22} />
      </g>
      <g transform={onLeft(27)} className={tape}>
        <rect x={mid - 2} y={-faces.z - 4 - carton.h} width={4} height={8} />
      </g>
    </g>
  );
}

export function Isometric64({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric64Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric64-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-60 -118 172 204" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-12, -12, 0, W + 24, D + 28, 8)} paint={paint.body} />
        {POSTS.map((x) => (
          <Block key={x} faces={box(x, 0, 8, 6, 6, TOP - 8)} paint={paint.body} />
        ))}
        {DECKS.map((z, deck) => (
          <g key={z}>
            <Block faces={box(0, 0, z, W, D, 4)} paint={paint.body} />
            {CARTONS.filter((carton) => carton.deck === deck).map((carton) => (
              <CartonBlock key={`${carton.bay}-${carton.dx}`} carton={carton} paint={paint.body} tape={paint.body.ink} />
            ))}
            {deck === SLOT.deck && (
              <>
                {/* The carton passes in front of this upright, so it is drawn first */}
                <Block faces={box(MID_POST, D - 6, 8, 6, 6, TOP - 8)} paint={paint.body} />
                <g className="isometric64-carton">
                  <CartonBlock carton={SLOT} paint={paint.accent} tape={paint.accent.ink} />
                </g>
              </>
            )}
          </g>
        ))}
        <Block faces={box(MID_POST, D - 6, TOP_DECK, 6, 6, TOP - TOP_DECK)} paint={paint.body} />
        {POSTS.filter((x) => x !== MID_POST).map((x) => (
          <Block key={x} faces={box(x, D - 6, 8, 6, 6, TOP - 8)} paint={paint.body} />
        ))}
      </svg>
    </div>
  );
}
