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

interface Isometric165Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the folder that lifts out with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric165Demo: Isometric165Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const PLINTH = 4;
const W = 48;
const D = 52;
const TOP = PLINTH + 94;
// Drawer slots in the front, 26 tall with a 4 unit rail between them
const X0 = 4;
const X1 = W - 4;
const SLOT_H = 26;
const SLOTS = [PLINTH + 4, PLINTH + 34, PLINTH + 64];
const Z0 = PLINTH + 64;
// The open-topped tray behind the top drawer front, and how far it pulls out
const TRAY = 46;
const REAR = D - TRAY;
const RIM = 12;
const PULL = 40;
const LIFT = 16;
const FOLDERS = [19, 21, 18, 20, 19];
const PICK = { y: D - 5, h: 21 };
const PERIOD = 7;

const STYLES = `
@keyframes isometric165-slide { 0%, 10% { transform: translate(0, 0); } 28%, 74% { transform: translate(${(-PULL * C).toFixed(1)}px, ${(PULL * S).toFixed(1)}px); } 92%, 100% { transform: translate(0, 0); } }
@keyframes isometric165-lift { 0%, 34% { transform: translateY(0); } 44%, 56% { transform: translateY(${-LIFT}px); } 66%, 100% { transform: translateY(0); } }
.isometric165-slide { animation: isometric165-slide ${PERIOD}s ease-in-out infinite; }
.isometric165-lift { animation: isometric165-lift ${PERIOD}s ease-in-out infinite; }
.isometric165-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric165-slide, .isometric165-lift { animation: none; } }
`;

// What the drawer can cover: its own lane in front of the cabinet, which also contains the slot
const LANE = box(X0 - 1, D, Z0 - 1, X1 - X0 + 2, 200, SLOT_H + 2);
// Headroom above the open drawer for the folder that lifts out
const HEADROOM = box(X0 + 2, PICK.y + PULL - 1, Z0 + 1, X1 - X0 - 4, 4, PICK.h + LIFT + 6);
const TRAY_FLOOR = polygon([[X0, REAR, Z0 + 1], [X1, REAR, Z0 + 1], [X1, D, Z0 + 1], [X0, D, Z0 + 1]]);
const TRAY_SIDE = polygon([[X0 + 1, REAR, Z0 + 1], [X0 + 1, D, Z0 + 1], [X0 + 1, D, Z0 + RIM], [X0 + 1, REAR, Z0 + RIM]]);
const TRAY_REAR = polygon([[X0, REAR + 1, Z0 + 1], [X1, REAR + 1, Z0 + 1], [X1, REAR + 1, Z0 + RIM], [X0, REAR + 1, Z0 + RIM]]);

export function Isometric165({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric165Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const id = useId();
  const laneId = `${id}lane`;
  const roomId = `${id}room`;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;

  const front = (z: number) => (
    <>
      <Block faces={box(X0, D, z, X1 - X0, 2, SLOT_H)} paint={body} />
      <g transform={onLeft(D + 2)}>
        <rect x={W / 2 - 8} y={-z - 22} width={16} height={6} rx={1} strokeWidth={1} vectorEffect="non-scaling-stroke" className={cn(body.base, body.edge)} />
        <rect x={W / 2 - 6} y={-z - 11} width={12} height={3} rx={1.5} className={body.ink} />
      </g>
    </>
  );
  const folder = (y: number, h: number, tab: number, tint: Paint) => (
    <>
      <Block faces={box(X0 + 3, y, Z0 + 2, X1 - X0 - 6, 2, h)} paint={tint} />
      <Block faces={box(X0 + 6 + tab, y, Z0 + 2 + h, 9, 2, 2)} paint={tint} />
    </>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric165-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-84 -108 134 166" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={laneId}>
            <polygon points={LANE.top} />
            <polygon points={LANE.left} />
            <polygon points={LANE.right} />
          </clipPath>
          <clipPath id={roomId}>
            <polygon points={LANE.top} />
            <polygon points={LANE.left} />
            <polygon points={LANE.right} />
            <polygon points={HEADROOM.top} />
            <polygon points={HEADROOM.left} />
            <polygon points={HEADROOM.right} />
          </clipPath>
        </defs>
        <Block faces={box(-3, -3, 0, W + 6, D + 6, PLINTH)} paint={body} />
        <Block faces={box(0, 0, PLINTH, W, D, TOP - PLINTH)} paint={body} />
        <Block faces={box(8, 8, TOP, 28, 32, 3)} paint={body} />
        <g transform={onTop(TOP + 3)} className={body.ink}>
          <rect x={12} y={12} width={20} height={24} rx={1} />
        </g>
        <g transform={onLeft(D)}>
          <rect x={X0} y={-Z0 - SLOT_H} width={X1 - X0} height={SLOT_H} className="fill-black/30" />
        </g>
        {SLOTS.slice(0, 2).map((z) => (
          <g key={z}>{front(z)}</g>
        ))}
        <g clipPath={`url(#${laneId})`}>
          <g className="isometric165-slide">
            <polygon points={TRAY_FLOOR} className={body.base} />
            <polygon points={TRAY_FLOOR} className={body.ink} />
            <polygon points={TRAY_SIDE} className={body.base} />
            <polygon points={TRAY_SIDE} className={body.right} />
            <polygon points={TRAY_REAR} className={body.base} />
            <polygon points={TRAY_REAR} className={body.left} />
            {FOLDERS.map((h, index) => (
              <g key={index}>{folder(REAR + 6 + index * 7, h, (index * 9) % 20, body)}</g>
            ))}
          </g>
        </g>
        <g clipPath={`url(#${roomId})`}>
          <g className="isometric165-slide">
            <g className="isometric165-lift">{folder(PICK.y, PICK.h, 12, paint.accent)}</g>
          </g>
        </g>
        <g clipPath={`url(#${laneId})`}>
          <g className="isometric165-slide">
            <Block faces={box(X1 - 1, REAR, Z0, 1, TRAY, RIM)} paint={body} />
            <g transform={onRight(X1)} className={body.ink}>
              <rect x={REAR + 2} y={-Z0 - 7} width={TRAY - 4} height={2} rx={1} />
            </g>
            {front(Z0)}
          </g>
        </g>
      </svg>
    </div>
  );
}
