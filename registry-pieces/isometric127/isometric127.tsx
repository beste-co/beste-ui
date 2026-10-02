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

interface Isometric127Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the wrench and the drip with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric127Demo: Isometric127Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const FLOOR = 8;
const WALL = 8;
const BASIN = { x: 8, z: 86, w: 60, d: 30, h: 14 };
const PX = 28;
const RISER = PX + 28;
const PY = WALL + 15;
const TRAP = 40;
const ARM = 62;
const NUT = { z: 60, h: 6, r: 7 };
const GRIP = NUT.z + 2;
const BUCKET = 20;
const FALL = (NUT.z - BUCKET) - 2;

const STYLES = `
@keyframes isometric127-turn { 0%, 30% { transform: rotate(0deg); } 40% { transform: rotate(40deg); } 46% { transform: rotate(0deg); } 56%, 86% { transform: rotate(40deg); } 96%, 100% { transform: rotate(0deg); } }
@keyframes isometric127-drip { 0% { transform: translateY(0); opacity: 0; } 3% { opacity: 1; } 12% { transform: translateY(${FALL}px); opacity: 1; } 13%, 100% { transform: translateY(${FALL}px); opacity: 0; } }
.isometric127-wrench { transform-box: fill-box; transform-origin: center; animation: isometric127-turn 6s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.isometric127-drip { animation: isometric127-drip 6s cubic-bezier(0.5, 0, 1, 1) infinite; }
.isometric127-drip2 { animation-delay: 1.1s; }
.isometric127-drip3 { animation-delay: -4s; }
.isometric127-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric127-wrench, .isometric127-drip { animation: none; } }
`;

type Round = ReturnType<typeof roundBox>;

/** A box with rounded corners in plan; with w = d = 2r it is a cylinder. */
function roundBox(x: number, y: number, z: number, w: number, d: number, h: number, r: number) {
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -90],
    [x + w - r, y + d - r, 0],
    [x + r, y + d - r, 90],
  ];
  // Rim points whose outward normal lies between two angles (degrees, 0 = +x, 90 = +y)
  const rim = (from: number, to: number) => {
    const points: [number, number][] = [];
    for (const [cx, cy, start] of corners) {
      const lo = Math.max(start, from);
      const hi = Math.min(start + 90, to);
      if (lo > hi) continue;
      for (let k = 0; k <= 8; k++) {
        const angle = ((lo + ((hi - lo) * k) / 8) * Math.PI) / 180;
        points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
      }
    }
    return points;
  };
  const band = (points: [number, number][]) =>
    polygon([...points.map(([px, py]): Point => [px, py, z]), ...points.reverse().map(([px, py]): Point => [px, py, z + h])]);
  return { side: band(rim(-45, 135)), left: band(rim(45, 135)), right: band(rim(-45, 45)), top: { x, y, w, d, r, z: z + h } };
}

function RoundBlock({ shape, paint }: { shape: Round; paint: Paint }) {
  const { top } = shape;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.left} className={paint.left} stroke="none" />
      <polygon points={shape.right} className={paint.right} stroke="none" />
      <rect x={top.x} y={top.y} width={top.w} height={top.d} rx={top.r} transform={onTop(top.z)} vectorEffect="non-scaling-stroke" className={paint.base} />
    </g>
  );
}

/** An upright cylinder standing on plan point (cx, cy). */
const cylinder = (cx: number, cy: number, z: number, h: number, r: number) => roundBox(cx - r, cy - r, z, 2 * r, 2 * r, h, r);

type Rod = ReturnType<typeof rod>;

/** A round rod lying along x or y from a to b, centered on (u, z) in the other two axes. */
function rod(axis: "x" | "y", a: number, b: number, u: number, z: number, r: number) {
  const at = (t: number, degrees: number): Point => {
    const angle = (degrees * Math.PI) / 180;
    const du = r * Math.cos(angle);
    const dz = r * Math.sin(angle);
    return axis === "x" ? [t, u + du, z + dz] : [u + du, t, z + dz];
  };
  const arc = (t: number, from: number, to: number) => Array.from({ length: 13 }, (_, k) => at(t, from + ((to - from) * k) / 12));
  const band = (from: number, to: number) => polygon([...arc(a, from, to), ...arc(b, from, to).reverse()]);
  return { axis, side: band(-45, 135), shade: band(-45, 45), cap: polygon(Array.from({ length: 36 }, (_, k) => at(b, k * 10))) };
}

function RodBlock({ shape, paint }: { shape: Rod; paint: Paint }) {
  const along = shape.axis === "y";
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <polygon points={shape.side} className={paint.base} />
      <polygon points={shape.shade} className={along ? paint.right : paint.left} stroke="none" />
      <polygon points={shape.cap} className={paint.base} />
      <polygon points={shape.cap} className={along ? paint.left : paint.right} stroke="none" />
    </g>
  );
}

// An open-ended wrench in plan, jaw around the origin, handle along +x
const WRENCH = "M-8.2 -5.7A10 10 0 1 1 -8.2 5.7L-4.9 3.4A6 6 0 1 0 -4.9 -3.4ZM6 -3.5H32A3.5 3.5 0 0 1 32 3.5H6Z";

// Seen from here the pipe hides a strip of the wrench's plane behind it; everything else is in front
const REACH = (NUT.r * Math.SQRT1_2).toFixed(2);
const BEHIND = `M${REACH} -${REACH}l-44 -44L-${REACH} ${REACH}A${NUT.r} ${NUT.r} 0 0 0 ${REACH} -${REACH}Z`;
const IN_FRONT = `M-200 -200H200V200H-200Z ${BEHIND}`;

function Wrench({ z, className, clip }: { z: number; className: string; clip?: string }) {
  return (
    <g transform={`${onTop(z)} translate(${PX} ${PY})`} clipPath={clip ? `url(#${clip})` : undefined}>
      <g className="isometric127-wrench">
        <circle r={36} fill="none" />
        <path d={WRENCH} transform="rotate(110)" className={className} />
      </g>
    </g>
  );
}

export function Isometric127({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric127Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const tool = paint.accent;
  const line = body.ink.replace("fill-", "stroke-");
  const [dropX, dropY] = project([PX, PY + NUT.r, NUT.z - 1]).split(",").map(Number) as [number, number];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric127-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-62 -124 140 204" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <path d={IN_FRONT} clipRule="evenodd" />
          </clipPath>
        </defs>
        <Block faces={box(0, 0, 0, 80, 64, FLOOR)} paint={body} />
        <Block faces={box(0, 0, FLOOR, 80, WALL, 112)} paint={body} />
        <g transform={onLeft(WALL)} strokeWidth={1} className={line}>
          {[24, 40, 56, 72, 88, 104].map((z) => (
            <line key={z} x1={0} y1={-FLOOR - z} x2={80} y2={-FLOOR - z} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((row) =>
            [0, 1, 2, 3, 4].map((col) => {
              const x = col * 16 + (row % 2 ? 8 : 16);
              return x < 80 ? <line key={`${row}-${col}`} x1={x} y1={-FLOOR - 8 - row * 16} x2={x} y2={-FLOOR - 24 - row * 16} /> : null;
            }),
          )}
        </g>
        <g transform={onLeft(WALL)}>
          <circle cx={PX} cy={-TRAP} r={6} className={cn(body.base, body.edge)} strokeWidth={1} />
        </g>
        <g transform={onLeft(WALL)}>
          <circle cx={RISER} cy={-ARM} r={8} className={cn(body.base, body.edge)} strokeWidth={1} />
        </g>
        {/* The bucket stands right under the leaking nut, so each drop lands in its middle */}
        <RoundBlock shape={cylinder(PX, PY + NUT.r, FLOOR, BUCKET - FLOOR, 9)} paint={body} />
        <g transform={onTop(BUCKET)}>
          <circle cx={PX} cy={PY + NUT.r} r={7} className={body.ink} />
        </g>
        <RodBlock shape={rod("x", PX, RISER + 2, PY, TRAP, 5)} paint={body} />
        <RoundBlock shape={cylinder(RISER, PY, TRAP, ARM - TRAP, 5)} paint={body} />
        <RodBlock shape={rod("y", WALL, PY + 2, RISER, ARM, 5)} paint={body} />
        <Wrench z={GRIP - 1} className={cn(tool.base)} />
        <Wrench z={GRIP - 1} className={cn(tool.right)} />
        <Wrench z={GRIP + 1} className={cn(tool.base, "isometric127-rest")} />
        <RoundBlock shape={cylinder(PX, PY, TRAP, BASIN.z - TRAP, 5)} paint={body} />
        <RoundBlock shape={cylinder(PX, PY, NUT.z, NUT.h, NUT.r)} paint={body} />
        {/* Drawn again over the pipe, but only where the wrench passes in front of it */}
        <Wrench z={GRIP - 1} className={cn(tool.base)} clip={clipId} />
        <Wrench z={GRIP - 1} className={cn(tool.right)} clip={clipId} />
        <Wrench z={GRIP + 1} className={cn(tool.base, "isometric127-rest")} clip={clipId} />
        {["", "isometric127-drip2", "isometric127-drip3"].map((extra, index) => (
          <path
            key={index}
            d={`M${dropX} ${dropY - 3}C${dropX + 2} ${dropY} ${dropX + 2.2} ${dropY + 1.5} ${dropX + 2.2} ${dropY + 2}A2.2 2.2 0 0 1 ${dropX - 2.2} ${dropY + 2}C${dropX - 2.2} ${dropY + 1.5} ${dropX - 2} ${dropY} ${dropX} ${dropY - 3}Z`}
            className={cn("isometric127-drip opacity-0", extra, tool.base)}
          />
        ))}
        <Block faces={box(BASIN.x, WALL, BASIN.z, BASIN.w, BASIN.d, BASIN.h)} paint={body} />
        <g transform={onTop(BASIN.z + BASIN.h)}>
          <rect x={BASIN.x + 6} y={WALL + 10} width={BASIN.w - 12} height={BASIN.d - 14} rx={8} className={body.ink} />
          <circle cx={PX} cy={PY + 2} r={2} className={body.ink} />
        </g>
        <RoundBlock shape={cylinder(BASIN.x + BASIN.w / 2, WALL + 5, BASIN.z + BASIN.h, 12, 3)} paint={body} />
        <Block faces={box(BASIN.x + BASIN.w / 2 - 6, WALL + 3, BASIN.z + BASIN.h + 12, 12, 4, 3)} paint={body} />
        <RodBlock shape={rod("y", WALL + 5, WALL + 16, BASIN.x + BASIN.w / 2, BASIN.z + BASIN.h + 9, 2)} paint={body} />
      </svg>
    </div>
  );
}
