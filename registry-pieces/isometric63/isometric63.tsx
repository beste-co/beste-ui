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

interface Isometric63Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the parcel in the back with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric63Demo: Isometric63Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const ROAD = box(0, 0, 0, 80, 144, 8);

// The truck heads toward -y, so its open back faces the viewer
const TY = 26;
const REAR = TY + 90;
const CAB = box(18, TY, 18, 44, 28, 28);
const HOOD = box(20, TY + 2, 46, 40, 20, 2);
const CHASSIS = box(22, TY + 6, 12, 36, 82, 6);
const CARGO = box(16, TY + 30, 18, 48, 60, 44);
const WHEELS = [TY + 14, TY + 72];
const DOOR = { x: 21, z: 22, w: 38, h: 36 };
const DOOR_CLIP = polygon([
  [DOOR.x, REAR, DOOR.z],
  [DOOR.x + DOOR.w, REAR, DOOR.z],
  [DOOR.x + DOOR.w, REAR, DOOR.z + DOOR.h],
  [DOOR.x, REAR, DOOR.z + DOOR.h],
]);
const STACK = [box(22, REAR - 44, 22, 18, 20, 26), box(40, REAR - 40, 22, 18, 18, 18)];
const PARCEL = box(30, REAR - 20, 22, 20, 18, 18);

const STYLES = `
@keyframes isometric63-road { 0% { transform: translateY(0); animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); } 34%, 70% { transform: translateY(96px); animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); } 100% { transform: translateY(168px); } }
@keyframes isometric63-hop { 0%, 38% { transform: translateY(0); } 44% { transform: translateY(-6px); } 50% { transform: translateY(0); } 54% { transform: translateY(-2px); } 58%, 100% { transform: translateY(0); } }
.isometric63-road { animation: isometric63-road 5.4s linear infinite; }
.isometric63-parcel { animation: isometric63-hop 5.4s ease-out infinite; }
.isometric63-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric63-road, .isometric63-parcel { animation: none; } }
`;

function Wheel({ x, y, paint }: { x: number; y: number; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1}>
      <g transform={onRight(x - 4)}>
        <circle cx={y} cy={-12} r={9} className={paint.base} vectorEffect="non-scaling-stroke" />
        <circle cx={y} cy={-12} r={9} className={paint.right} stroke="none" />
      </g>
      <g transform={onRight(x)}>
        <circle cx={y} cy={-12} r={9} className={paint.base} vectorEffect="non-scaling-stroke" />
        <circle cx={y} cy={-12} r={4} className={paint.ink} stroke="none" />
      </g>
    </g>
  );
}

export function Isometric63({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric63Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric63-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-134 -44 212 170" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={`${clipId}-road`}>
            <polygon points={ROAD.top} />
          </clipPath>
          <clipPath id={clipId}>
            <polygon points={DOOR_CLIP} />
          </clipPath>
        </defs>
        <Block faces={ROAD} paint={paint.body} />
        <g transform={onTop(8)}>
          <rect x={8} y={0} width={64} height={144} className={paint.body.ink} />
        </g>
        {/* The truck stays in frame; the center line slides back, stops for the drop and moves off again */}
        <g clipPath={`url(#${clipId}-road)`}>
          <g transform={onTop(8)}>
            <g className="isometric63-road">
              {Array.from({ length: 14 }, (_, index) => (
                <rect key={index} x={38} y={8 + (index - 7) * 24} width={4} height={12} rx={1} className={paint.body.base} />
              ))}
            </g>
          </g>
        </g>
        <g>
          {WHEELS.map((y) => (
            <Wheel key={y} x={24} y={y} paint={paint.body} />
          ))}
          <Block faces={CHASSIS} paint={paint.body} />
          <Block faces={CAB} paint={paint.body} />
          <Block faces={HOOD} paint={paint.body} />
          <g transform={onRight(62)} className={paint.body.ink}>
            <path d={`M${TY + 4} -42H${TY + 16}L${TY + 22} -34V-30H${TY + 4}Z`} />
          </g>
          <Block faces={CARGO} paint={paint.body} />
          <g transform={onRight(64)} className={paint.body.ink}>
            <rect x={TY + 36} y={-54} width={48} height={4} rx={2} />
          </g>
          <g transform={onLeft(REAR)} className={paint.body.ink}>
            <rect x={DOOR.x} y={-DOOR.z - DOOR.h} width={DOOR.w} height={DOOR.h} rx={2} />
          </g>
          <g clipPath={`url(#${clipId})`}>
            {STACK.map((faces, index) => (
              <Block key={index} faces={faces} paint={paint.body} />
            ))}
            <g className="isometric63-parcel">
              <Block faces={PARCEL} paint={paint.accent} />
              <g transform={onLeft(REAR - 2)} className={paint.accent.ink}>
                <rect x={38} y={-40} width={4} height={18} />
              </g>
            </g>
          </g>
          {WHEELS.map((y) => (
            <Wheel key={y} x={62} y={y} paint={paint.body} />
          ))}
        </g>
      </svg>
    </div>
  );
}
