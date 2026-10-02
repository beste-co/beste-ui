"use client";

import { useId } from "react";
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

interface Isometric150Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the banknotes with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric150Demo: Isometric150Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const G = 8;
// Kiosk front faces the viewer at y = FY
const KX = 12;
const KW = 48;
const KY = 8;
const FY = 36;
const KH = 66;
const SHELF = G + 28;
const SLOT = G + 16;
const NOTE_W = 26;
const NOTE_X = KX + (KW - NOTE_W) / 2;
const OUT = 12;
const KEYS = Array.from({ length: 12 }, (_, index) => ({ x: index % 4, y: Math.floor(index / 4) }));
const CLIP = polygon([
  [NOTE_X - 4, FY, SLOT + 3],
  [NOTE_X + NOTE_W + 4, FY, SLOT + 3],
  [NOTE_X + NOTE_W + 4, FY + 40, SLOT - 12],
  [NOTE_X - 4, FY + 40, SLOT - 12],
]);
const slide = (dy: number, dz = 0) => `translate(${(-dy * C).toFixed(1)}px, ${(dy * S - dz).toFixed(1)}px)`;

const STYLES = `
@keyframes isometric150-notes { 0%, 18% { transform: ${slide(-OUT - 2)}; opacity: 1; } 40%, 74% { transform: translate(0, 0); opacity: 1; } 86% { transform: ${slide(6, 6)}; opacity: 0; } 87%, 100% { transform: ${slide(-OUT - 2)}; opacity: 0; } }
@keyframes isometric150-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.isometric150-notes { animation: isometric150-notes 5.2s cubic-bezier(0.4, 0, 0.2, 1) infinite; will-change: transform, opacity; }
.isometric150-blink { animation: isometric150-blink 1.3s ease-in-out infinite; }
.isometric150-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric150-notes, .isometric150-blink { animation: none; } }
`;

export function Isometric150({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric150Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const note = paint.accent;
  const text = palette === "tone" ? "fill-black/70" : palette === "dark" ? "fill-zinc-100" : palette === "light" ? "fill-zinc-900" : "fill-foreground";

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric150-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-72 -84 154 158" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={CLIP} />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, 72, 60, G)} paint={body} />
        <Block faces={box(KX, KY, G, KW, FY - KY, KH)} paint={body} />
        <Block faces={box(KX - 2, KY - 2, G + KH, KW + 4, FY - KY + 6, 10)} paint={body} />
        <g transform={onLeft(FY + 4)}>
          <text x={KX + KW / 2} y={-(G + KH + 5)} textAnchor="middle" dominantBaseline="central" fontSize={7} letterSpacing={1.5} className={cn("font-semibold", text)}>
            ATM
          </text>
        </g>
        <g transform={onRight(KX + KW)} className={body.ink}>
          {[0, 1, 2, 3].map((index) => (
            <rect key={index} x={KY + 6} y={-(G + 16) - index * 5} width={16} height={2} rx={1} />
          ))}
        </g>
        <g transform={onLeft(FY)}>
          <rect x={KX + 6} y={-(G + KH - 6)} width={KW - 12} height={22} rx={2} className={body.ink} />
          <g className={body.base}>
            <rect x={KX + 11} y={-(G + KH - 11)} width={18} height={3} rx={1.5} />
            <rect x={KX + 11} y={-(G + KH - 17)} width={12} height={3} rx={1.5} />
            <rect x={KX + KW - 18} y={-(G + KH - 23)} width={8} height={4} rx={1} className="isometric150-blink" />
          </g>
          <rect x={KX + KW - 14} y={-(SHELF + 8)} width={8} height={2} rx={1} className={body.ink} />
          <rect x={NOTE_X - 2} y={-(SLOT + 3)} width={NOTE_W + 4} height={4} rx={1} className={body.ink} />
          <rect x={NOTE_X - 2} y={-(SLOT + 3)} width={NOTE_W + 4} height={4} rx={1} className={body.ink} />
        </g>
        <Block faces={box(KX + 4, FY, SHELF, KW - 8, 10, 3)} paint={body} />
        <g transform={onTop(SHELF + 3)} className={body.ink}>
          {KEYS.map((key) => (
            <rect key={`${key.x}-${key.y}`} x={KX + 8 + key.x * 5} y={FY + 1.5 + key.y * 3} width={3.5} height={2} rx={0.5} />
          ))}
          <rect x={KX + 32} y={FY + 1.5} width={8} height={8} rx={1} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric150-notes">
            <Block faces={box(NOTE_X, FY - 4, SLOT - 2, NOTE_W, OUT + 4, 1.5)} paint={note} />
            <Block faces={box(NOTE_X, FY - 4, SLOT - 0.5, NOTE_W, OUT + 4, 1.5)} paint={note} />
            <g transform={onTop(SLOT + 1)} className={note.ink}>
              <circle cx={NOTE_X + NOTE_W / 2} cy={FY + OUT / 2 - 1} r={3} />
              <rect x={NOTE_X + 3} y={FY + 1} width={4} height={2} rx={1} />
              <rect x={NOTE_X + NOTE_W - 7} y={FY + OUT - 5} width={4} height={2} rx={1} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
