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

interface Isometric97Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the chosen can and the header with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric97Demo: Isometric97Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

type Rod = ReturnType<typeof rod>;

/** A round rod lying along x from a to b, centered on (y, z). */
function rod(a: number, b: number, y: number, z: number, r: number) {
  const at = (t: number, degrees: number): Point => {
    const angle = (degrees * Math.PI) / 180;
    return [t, y + r * Math.cos(angle), z + r * Math.sin(angle)];
  };
  const arc = (t: number, from: number, to: number) => Array.from({ length: 13 }, (_, k) => at(t, from + ((to - from) * k) / 12));
  const band = (from: number, to: number) => polygon([...arc(a, from, to), ...arc(b, from, to).reverse()]);
  return { side: band(-45, 135), shade: band(-45, 45), cap: polygon(Array.from({ length: 36 }, (_, k) => at(b, k * 10))) };
}

function RodBlock({ shape, paint }: { shape: Rod; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={0.75} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.shade} className={paint.left} stroke="none" />
      <polygon points={shape.cap} className={paint.base} />
      <polygon points={shape.cap} className={paint.right} stroke="none" />
    </g>
  );
}

const PLINTH = 6;
const W = 60;
const D = 36;
const H = 100;
const TOP = PLINTH + H;
// The glass window on the front face, in (x, -z) units on the plane y = D
const WINDOW = { x: 6, y: -TOP + 8, w: 36, h: 56 };
// Behind the glass: a cavity with shelves at the back and a free gap in front where a can falls
const WALL_X = 2;
const BACK = D - 12;
const SHELF = { y: D - 12, d: 6.5, t: 2 };
const CAN_Y = D - 8.75;
const GAP_Y = D - 2.9;
const CAN = { r: 2.7, h: 10 };
const ROWS = [37, 54, 71];
const COLS = [9.25, 16.15, 23.05, 29.95];
const PICK = { x: 23.05, z: 54 };
const FALL = 34;
// Pushing the can off the shelf moves it toward the viewer; then it drops straight down the gap
const NUDGE = `${(-(GAP_Y - CAN_Y) * C).toFixed(2)}px, ${((GAP_Y - CAN_Y) * S).toFixed(2)}px`;
const DROPPED = `${(-(GAP_Y - CAN_Y) * C).toFixed(2)}px, ${((GAP_Y - CAN_Y) * S + FALL).toFixed(2)}px`;
const TRAY = { x: 8, z: PLINTH + 16, w: 32, h: 16 };
const FLAP = 6;
// The tray flap hangs from the top edge of the opening and swings about it
const HINGE = project([0, D, TRAY.z + TRAY.h]).split(",").map(Number) as [number, number];
const swing = (degrees: number) => `--isometric97-c: ${Math.cos((degrees * Math.PI) / 180).toFixed(4)}; --isometric97-s: ${Math.sin((degrees * Math.PI) / 180).toFixed(4)};`;
const FLAP_CSS = `matrix(${C}, ${S}, calc(${C} * var(--isometric97-s)), calc(var(--isometric97-c) - ${S} * var(--isometric97-s)), ${HINGE[0]}, ${HINGE[1]})`;
// A circle of radius r in plan projects to an ellipse with these radii
const RX = CAN.r * C * Math.SQRT2;
const RY = CAN.r * S * Math.SQRT2;

const STYLES = `
@property --isometric97-c { syntax: "<number>"; inherits: true; initial-value: 1; }
@property --isometric97-s { syntax: "<number>"; inherits: true; initial-value: 0; }
@keyframes isometric97-pick { 0%, 10% { transform: translate(0, 0); opacity: 1; } 18%, 20% { transform: translate(${NUDGE}); opacity: 1; animation-timing-function: cubic-bezier(0.5, 0, 1, 1); } 34% { transform: translate(${DROPPED}); opacity: 1; } 35%, 90% { transform: translate(${DROPPED}); opacity: 0; } 91% { transform: translate(0, 0); opacity: 0; } 100% { transform: translate(0, 0); opacity: 1; } }
@keyframes isometric97-land { 0%, 36% { transform: translateY(-18px); opacity: 0; } 37% { transform: translateY(-18px); opacity: 1; animation-timing-function: cubic-bezier(0.5, 0, 1, 1); } 44% { transform: translateY(0); opacity: 1; } 47% { transform: translateY(-2.5px); } 50%, 84% { transform: translateY(0); opacity: 1; } 92%, 100% { transform: translateY(0); opacity: 0; } }
@keyframes isometric97-flap { 0%, 43% { ${swing(0)} } 46% { ${swing(14)} } 51% { ${swing(-6)} } 56% { ${swing(3)} } 60%, 100% { ${swing(0)} } }
.isometric97-pick { animation: isometric97-pick 6s ease-in-out infinite; }
.isometric97-land { animation: isometric97-land 6s ease-out infinite; }
.isometric97-swing { animation: isometric97-flap 6s linear infinite; }
.isometric97-flap { transform: ${FLAP_CSS}; }
.isometric97-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric97-pick, .isometric97-land, .isometric97-swing { animation: none; } }
`;

const n = (value: number) => value.toFixed(2);
// Can outlines around its foot point: the whole body, its shaded right half, and the label band
const CAN_BODY = `M${n(-RX)} ${-CAN.h}V0A${n(RX)} ${n(RY)} 0 0 0 ${n(RX)} 0V${-CAN.h}A${n(RX)} ${n(RY)} 0 0 1 ${n(-RX)} ${-CAN.h}Z`;
const CAN_SHADE = `M0 ${n(-CAN.h + RY)}V${n(RY)}A${n(RX)} ${n(RY)} 0 0 0 ${n(RX)} 0V${-CAN.h}A${n(RX)} ${n(RY)} 0 0 1 0 ${n(-CAN.h + RY)}Z`;
const CAN_BAND = `M${n(-RX)} -6.5V-3A${n(RX)} ${n(RY)} 0 0 0 ${n(RX)} -3V-6.5A${n(RX)} ${n(RY)} 0 0 1 ${n(-RX)} -6.5Z`;

/** An upright can standing on plan point (x, y) at height z: body, shaded side, label band, lid with rim and tab. */
function Can({ x, y, z, paint }: { x: number; y: number; z: number; paint: Paint }) {
  return (
    <g transform={`translate(${project([x, y, z]).replace(",", " ")})`} className={paint.edge} strokeWidth={0.75} strokeLinejoin="round">
      <path d={CAN_BODY} className={paint.base} />
      <path d={CAN_SHADE} className={paint.right} stroke="none" />
      <path d={CAN_BAND} className={paint.ink} stroke="none" />
      <rect x={n(-RX * 0.62)} y={-CAN.h + 2.6} width={0.9} height={CAN.h - 3} rx={0.45} className="fill-white/50" stroke="none" />
      <ellipse cy={-CAN.h} rx={n(RX)} ry={n(RY)} className={paint.base} />
      <ellipse cy={-CAN.h} rx={n(RX * 0.68)} ry={n(RY * 0.68)} className={paint.ink} stroke="none" />
      <ellipse cx={n(RX * 0.2)} cy={n(-CAN.h + RY * 0.15)} rx={n(RX * 0.26)} ry={n(RY * 0.3)} className={paint.base} stroke="none" />
    </g>
  );
}

const CAVE_Z = [28, TOP - 4] as const;
const LEFT_WALL = polygon([[WALL_X, BACK, CAVE_Z[0]], [WALL_X, D, CAVE_Z[0]], [WALL_X, D, CAVE_Z[1]], [WALL_X, BACK, CAVE_Z[1]]]);
const DELIVERED = { a: 17, b: 27, y: D - 4, z: TRAY.z + 2 + CAN.r };

export function Isometric97({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric97Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const id = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const pick = paint.accent;
  const glass = palette === "dark" ? "fill-black/40" : palette === "tone" ? "fill-black/20" : body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric97-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-54 -112 124 172" aria-hidden="true" className="isometric97-swing size-full overflow-visible">
        <defs>
          <clipPath id={`${id}-window`}>
            <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.h} rx={3} transform={onLeft(D)} />
          </clipPath>
          <clipPath id={`${id}-tray`}>
            <rect x={TRAY.x} y={-TRAY.z - TRAY.h} width={TRAY.w} height={TRAY.h} rx={3} transform={onLeft(D)} />
          </clipPath>
        </defs>
        <Block faces={box(-6, -6, 0, W + 12, D + 12, PLINTH)} paint={body} />
        <Block faces={box(0, 0, PLINTH, W, D, H)} paint={body} />
        <g transform={onRight(W)} className={body.ink}>
          <rect x={4} y={-TOP + 6} width={D - 8} height={H - 30} rx={2} fill="none" strokeWidth={1.5} className={body.ink.replace("fill-", "stroke-")} />
          {[0, 1, 2, 3].map((index) => (
            <rect key={index} x={10} y={-PLINTH - 8 - index * 4} width={16} height={2} rx={1} />
          ))}
        </g>
        <g transform={onLeft(D)}>
          <rect x={6} y={-TOP + 1.5} width={W - 12} height={4.5} rx={1.5} className={pick.base} />
          <rect x={10} y={-TOP + 3} width={20} height={1.5} rx={0.75} className={pick.ink} />
          <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.h} rx={3} className={body.base} />
          <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.h} rx={3} className={glass} />
        </g>
        {/* The cavity behind the glass: side wall, shelves with their cans from the bottom row up, then the picked can in the gap */}
        <g clipPath={`url(#${id}-window)`}>
          <polygon points={LEFT_WALL} className={glass} />
          {ROWS.map((z) => (
            <g key={z}>
              <Block faces={box(WALL_X, SHELF.y, z - SHELF.t, W - 16, SHELF.d, SHELF.t)} paint={body} />
              <g transform={onLeft(SHELF.y + SHELF.d)} className={body.ink}>
                {COLS.map((x) => (
                  <rect key={x} x={x - 1.6} y={-z + 0.4} width={3.2} height={1.2} rx={0.4} />
                ))}
              </g>
              {COLS.filter((x) => x !== PICK.x || z !== PICK.z).map((x) => (
                <Can key={x} x={x} y={CAN_Y} z={z} paint={body} />
              ))}
            </g>
          ))}
          <g className="isometric97-pick opacity-0">
            <Can x={PICK.x} y={CAN_Y} z={PICK.z} paint={pick} />
          </g>
          {/* The glass dulls what is behind it and catches a streak of light */}
          <g transform={onLeft(D)} className={body.base}>
            <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.h} className="opacity-10" />
            <path d={`M${WINDOW.x + 4} ${WINDOW.y + WINDOW.h}l14 ${-WINDOW.h}h5l-14 ${WINDOW.h}Z`} className="opacity-20" />
            <path d={`M${WINDOW.x + 14} ${WINDOW.y + WINDOW.h}l14 ${-WINDOW.h}h2l-14 ${WINDOW.h}Z`} className="opacity-20" />
          </g>
        </g>
        <g transform={onLeft(D)}>
          <rect x={46} y={-TOP + 8} width={9} height={12} rx={2} className={body.ink} />
          <rect x={47.5} y={-TOP + 10} width={6} height={2} rx={1} className={pick.base} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <rect key={index} x={46 + (index % 3) * 3.4} y={-TOP + 26 + Math.floor(index / 3) * 4} width={2.4} height={2.4} rx={0.6} className={body.ink} />
          ))}
          <rect x={49} y={-TOP + 42} width={3} height={8} rx={1.5} className={body.ink} />
          <rect x={46} y={-TOP + 54} width={9} height={2} rx={1} className={body.ink} />
          <rect x={TRAY.x} y={-TRAY.z - TRAY.h} width={TRAY.w} height={TRAY.h} rx={3} className={body.base} />
          <rect x={TRAY.x} y={-TRAY.z - TRAY.h} width={TRAY.w} height={TRAY.h} rx={3} className={glass} />
          <rect x={TRAY.x} y={-TRAY.z - TRAY.h} width={TRAY.w} height={TRAY.h} rx={3} className={glass} />
        </g>
        {/* The delivered can lies on its side inside the tray and shows through the opening */}
        <g clipPath={`url(#${id}-tray)`}>
          <g className="isometric97-land">
            <RodBlock shape={rod(DELIVERED.a, DELIVERED.b, DELIVERED.y, DELIVERED.z, CAN.r)} paint={pick} />
            <polygon points={rod(DELIVERED.a + 3.2, DELIVERED.a + 6.8, DELIVERED.y, DELIVERED.z, CAN.r).side} className={pick.ink} />
            <polygon points={rod(DELIVERED.b, DELIVERED.b, DELIVERED.y, DELIVERED.z, CAN.r * 0.66).cap} className={pick.ink} />
          </g>
        </g>
        <g className="isometric97-flap">
          <rect x={TRAY.x + 1.5} y={0} width={TRAY.w - 3} height={FLAP} rx={1.5} className={body.base} />
          <rect x={TRAY.x + 1.5} y={0} width={TRAY.w - 3} height={FLAP} rx={1.5} className={body.ink} />
          <rect x={TRAY.x + 10} y={FLAP - 2.2} width={TRAY.w - 20} height={1} rx={0.5} className={body.ink} />
        </g>
      </svg>
    </div>
  );
}
