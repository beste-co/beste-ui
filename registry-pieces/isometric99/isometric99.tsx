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

interface Isometric99Props {
  /** Word printed on the front of the box. */
  label?: string;
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Mark the ballot's check in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric99Demo: Isometric99Props = {
  label: "VOTE",
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const BODY_H = 56;
const LID = 8;
const TOP = BODY_H + LID;
const SLOT_Y = 40;
const PAPER_X = 22;
const PAPER_W = 36;
const PAPER_Z = 50;
const PAPER_H = 44;
const FACE = SLOT_Y + 1;
const SINK = PAPER_Z + PAPER_H - TOP + 2;

const MARK: Record<Palette, string> = {
  theme: "stroke-foreground",
  light: "stroke-zinc-900",
  dark: "stroke-zinc-100",
  tone: "stroke-black/70",
  glass: "stroke-foreground",
};

const STYLES = `
@keyframes isometric99-paper { 0% { transform: translateY(-14px); opacity: 0; } 12% { transform: translateY(-14px); opacity: 1; } 26%, 40% { transform: translateY(0); opacity: 1; } 58%, 100% { transform: translateY(${SINK}px); opacity: 1; } }
@keyframes isometric99-bump { 0%, 56% { transform: scale(1); } 62% { transform: scale(1.1); } 70%, 100% { transform: scale(1); } }
.isometric99-paper { animation: isometric99-paper 4.8s cubic-bezier(0.45, 0, 0.3, 1) infinite; will-change: transform, opacity; }
.isometric99-emblem { transform-box: fill-box; transform-origin: center; animation: isometric99-bump 4.8s ease-out infinite; }
.isometric99-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric99-paper, .isometric99-emblem { animation: none; } }
`;

export function Isometric99({ label = "VOTE", tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric99Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const text = palette === "tone" ? "fill-black/70" : palette === "dark" ? "fill-zinc-100" : palette === "light" ? "fill-zinc-900" : "fill-foreground";
  const check = accent ? "stroke-current" : MARK[palette === "tone" ? "light" : palette];
  const paper = palette === "tone" ? BODY.light : paint.body;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric99-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -84 140 162" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={polygon([[-200, SLOT_Y, TOP], [300, SLOT_Y, TOP], [300, SLOT_Y, 400], [-200, SLOT_Y, 400]])} />
          </clipPath>
        </defs>
        <Block faces={box(8, 8, 0, 64, 64, BODY_H)} paint={paint.body} />
        <Block faces={box(4, 4, BODY_H, 72, 72, LID)} paint={paint.body} />
        <g transform={onTop(TOP)} className={paint.body.ink}>
          <rect x={PAPER_X - 4} y={SLOT_Y - 3} width={PAPER_W + 8} height={6} rx={3} />
          <rect x={PAPER_X - 2} y={SLOT_Y - 1.5} width={PAPER_W + 4} height={3} rx={1.5} />
        </g>
        <g transform={onLeft(72)}>
          <g className="isometric99-emblem">
            <text x={40} y={-30} textAnchor="middle" dominantBaseline="central" fontSize={15} letterSpacing={1} className={cn("font-semibold", text)}>
              {label}
            </text>
          </g>
          <rect x={22} y={-16} width={36} height={3} rx={1.5} className={paint.body.ink} />
        </g>
        <g transform={onRight(72)} className={paint.body.ink}>
          <rect x={22} y={-38} width={28} height={16} rx={3} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric99-paper">
            <Block faces={box(PAPER_X, SLOT_Y - 1, PAPER_Z, PAPER_W, 2, PAPER_H)} paint={paper} />
            <g transform={onLeft(FACE)}>
              <rect x={PAPER_X + 5} y={-PAPER_Z - PAPER_H + 6} width={20} height={3} rx={1.5} className={paper.ink} />
              {[0, 1].map((row) => (
                <g key={row}>
                  <rect x={PAPER_X + 5} y={-PAPER_Z - PAPER_H + 14 + row * 12} width={9} height={9} rx={2} className={paper.ink} />
                  <rect x={PAPER_X + 17} y={-PAPER_Z - PAPER_H + 17 + row * 12} width={14} height={3} rx={1.5} className={paper.ink} />
                </g>
              ))}
              <polyline
                points={`${PAPER_X + 6},${-PAPER_Z - PAPER_H + 18} ${PAPER_X + 9.5},${-PAPER_Z - PAPER_H + 21.5} ${PAPER_X + 15},${-PAPER_Z - PAPER_H + 12}`}
                fill="none"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={check}
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
