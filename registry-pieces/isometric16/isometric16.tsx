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

interface Isometric16Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the plug, its socket light and the pulse in its cable with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric16Demo: Isometric16Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

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

/** A band around an upright cylinder, drawn on the half that faces the viewer. */
function ring(cx: number, cy: number, r: number, z: number, h: number) {
  const points = Array.from({ length: 19 }, (_, k): [number, number] => {
    const angle = ((-45 + k * 10) * Math.PI) / 180;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  return polygon([...points.map(([x, y]): Point => [x, y, z]), ...[...points].reverse().map(([x, y]): Point => [x, y, z + h])]);
}

const G = 6;
const BASE = roundBox(0, 0, 0, 140, 70, G, 14);
const STRIP = { x: 14, y: 22, w: 112, d: 26, h: 14, r: 8 };
const TOP = G + STRIP.h;
const MID = STRIP.y + STRIP.d / 2;
const FRONT = STRIP.y + STRIP.d;
// Socket centers along the strip: the far one holds a plug, the middle one takes the moving plug, the near one is free
const SOCKETS = [36, 66, 96];
const FAR = 36;
const LIVE = 66;
const PLUG = { r: 8.5, h: 13, neck: 3.6, collar: 5 };
const PIN = { r: 1.6, gap: 4, len: 9 };
const HOVER = 24;
const PERIOD = 6;
// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;
const flat = (point: Point) => project(point).split(",").map(Number) as [number, number];

/** A smooth cable through 3D points, as a screen path along its center line. */
function cable(points: Point[]) {
  const at = (index: number) => points[Math.min(points.length - 1, Math.max(0, index))] as Point;
  const out: string[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const steps = i === points.length - 2 ? 9 : 8;
    for (let k = 0; k < steps; k++) {
      const t = k / 8;
      const mix = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t * t * t);
      out.push(project([mix(p0[0], p1[0], p2[0], p3[0]), mix(p0[1], p1[1], p2[1], p3[1]), mix(p0[2], p1[2], p2[2], p3[2])]).replace(",", " "));
    }
  }
  return `M${out.join("L")}`;
}
const CORD_Z = TOP + PLUG.h + PLUG.collar;
// Each cable rises out of its plug, arcs back over the strip and drops behind it, where the strip hides the rest
const FAR_CABLE = cable([
  [FAR, MID, CORD_Z - 1],
  [FAR, MID - 1, CORD_Z + 6],
  [FAR, MID - 6, CORD_Z + 11],
  [FAR - 0.5, MID - 12, CORD_Z + 11],
  [FAR - 1, MID - 18, CORD_Z + 5],
  [FAR - 1, MID - 22, 31],
  [FAR - 1, MID - 23, 16],
  [FAR - 1, MID - 23, -2],
  [FAR - 1, MID - 23, -14],
]);
const LIVE_CABLE = cable([
  [LIVE, MID, CORD_Z - 1],
  [LIVE, MID - 1, CORD_Z + 7],
  [LIVE + 0.5, MID - 6, CORD_Z + 13],
  [LIVE + 1, MID - 13, CORD_Z + 14],
  [LIVE + 1.5, MID - 20, CORD_Z + 8],
  [LIVE + 2, MID - 24, 34],
  [LIVE + 2, MID - 25, 18],
  [LIVE + 2, MID - 25, 0],
  [LIVE + 2, MID - 25, -30],
]);
const PINS = [LIVE - PIN.gap, LIVE + PIN.gap];
/** The opening above a pin hole: a column over it plus the near half of the hole, so a pin sinks into the strip. */
const mouth = (x: number) => {
  const [cx, cy] = flat([x, MID, TOP]);
  const wide = (PIN.r + 0.9) * ELLIPSE_X;
  const deep = (PIN.r + 0.9) * ELLIPSE_Y;
  return `M${(cx - wide).toFixed(2)} ${cy.toFixed(2)}V-400H${(cx + wide).toFixed(2)}V${cy.toFixed(2)}A${wide.toFixed(2)} ${deep.toFixed(2)} 0 0 1 ${(cx - wide).toFixed(2)} ${cy.toFixed(2)}Z`;
};
const MOUTHS = PINS.map(mouth).join(" ");

const STYLES = `
@keyframes isometric16-plug { 0%, 10% { transform: translateY(${-HOVER}px); } 28% { transform: translateY(1.2px); } 33%, 74% { transform: translateY(0); } 90%, 100% { transform: translateY(${-HOVER}px); } }
@keyframes isometric16-led { 0%, 30% { opacity: 0; } 33%, 74% { opacity: 1; } 77%, 100% { opacity: 0; } }
@keyframes isometric16-pulse { 0%, 35% { stroke-dashoffset: 9; opacity: 0; } 36% { stroke-dashoffset: 9; opacity: 1; } 50% { stroke-dashoffset: -60; opacity: 1; } 51%, 100% { stroke-dashoffset: -60; opacity: 0; } }
@keyframes isometric16-pulse2 { 0%, 52% { stroke-dashoffset: 9; opacity: 0; } 53% { stroke-dashoffset: 9; opacity: 1; } 67% { stroke-dashoffset: -60; opacity: 1; } 68%, 100% { stroke-dashoffset: -60; opacity: 0; } }
.isometric16-plug { animation: isometric16-plug ${PERIOD}s cubic-bezier(0.45, 0, 0.3, 1) infinite; will-change: transform; }
.isometric16-led { animation: isometric16-led ${PERIOD}s linear infinite; }
.isometric16-pulse { animation: isometric16-pulse ${PERIOD}s linear infinite; }
.isometric16-pulse2 { animation: isometric16-pulse2 ${PERIOD}s linear infinite; }
.isometric16-still * { animation: none !important; }
.isometric16-still .isometric16-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric16-plug, .isometric16-led, .isometric16-pulse, .isometric16-pulse2 { animation: none; } .isometric16-rest { opacity: 1; } }
`;

// Stroke twins of the body paint for the cables, spelled out so Tailwind sees every class
const CORD: Record<Palette, { base: string; shade: string; pulse: string }> = {
  theme: { base: "stroke-card", shade: "stroke-foreground/10", pulse: "stroke-foreground/30" },
  light: { base: "stroke-white", shade: "stroke-zinc-950/10", pulse: "stroke-zinc-950/30" },
  dark: { base: "stroke-zinc-800", shade: "stroke-black/40", pulse: "stroke-white/30" },
  tone: { base: "stroke-current", shade: "stroke-black/30", pulse: "stroke-white/40" },
  glass: { base: "stroke-card", shade: "stroke-foreground/10", pulse: "stroke-foreground/30" },
};

/** A plug standing in a socket: a round body with a grip band and a collar where the cable leaves. */
function Plug({ x, paint }: { x: number; paint: Paint }) {
  return (
    <>
      <RoundBlock shape={cylinder(x, MID, TOP, PLUG.h, PLUG.r)} paint={paint} />
      <polygon points={ring(x, MID, PLUG.r + 0.05, TOP + 3.5, 2)} className={paint.ink} />
      <RoundBlock shape={cylinder(x, MID, TOP + PLUG.h, PLUG.collar, PLUG.neck)} paint={paint} />
    </>
  );
}

/** A cable with real thickness: an edge, the sheath and its shade, along one center line. */
function Cord({ d, edge, cord }: { d: string; edge: string; cord: { base: string; shade: string } }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} strokeWidth={6} className={edge} />
      <path d={d} strokeWidth={4.4} className={cord.base} />
      <path d={d} strokeWidth={4.4} className={cord.shade} />
    </g>
  );
}

export function Isometric16({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric16Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const id = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const cord = CORD[palette];
  const pit = palette === "dark" ? "fill-black/50" : "fill-black/25";
  const lit = accent ? paint.accent.base : body.ink;
  const pulse = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : cord.pulse;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric16-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-66 -40 192 150" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={`${id}-pins`}>
            <path d={MOUTHS} />
          </clipPath>
        </defs>
        <RoundBlock shape={BASE} paint={body} />
        {/* The cables run behind the strip, so they are drawn first; the moving one rides with its plug */}
        <Cord d={FAR_CABLE} edge={body.edge} cord={cord} />
        <g className="isometric16-plug">
          <Cord d={LIVE_CABLE} edge={body.edge} cord={cord} />
          <g fill="none" strokeWidth={2.2} strokeLinecap="round" className={pulse}>
            <path d={LIVE_CABLE} pathLength={100} strokeDasharray="9 200" className="isometric16-pulse opacity-0" />
            <path d={LIVE_CABLE} pathLength={100} strokeDasharray="9 200" className="isometric16-pulse2 opacity-0" />
          </g>
        </g>
        <RoundBlock shape={roundBox(STRIP.x, STRIP.y, G, STRIP.w, STRIP.d, STRIP.h, STRIP.r)} paint={body} />
        <g transform={onLeft(FRONT)}>
          <rect x={STRIP.x + STRIP.r} y={-(G + 4)} width={STRIP.w - 2 * STRIP.r} height={1.5} rx={0.75} className={body.ink} />
          {SOCKETS.map((x) => (
            <circle key={x} cx={x} cy={-(TOP - 5)} r={1.8} className={body.ink} />
          ))}
          {/* The far socket is live already; the middle one lights when the plug seats */}
          <circle cx={FAR} cy={-(TOP - 5)} r={3.4} className={cn(lit, "opacity-30")} />
          <circle cx={FAR} cy={-(TOP - 5)} r={1.8} className={lit} />
          <g className={cn("isometric16-led isometric16-rest opacity-0", lit)}>
            <circle cx={LIVE} cy={-(TOP - 5)} r={3.4} className="opacity-30" />
            <circle cx={LIVE} cy={-(TOP - 5)} r={1.8} />
          </g>
        </g>
        <g transform={onTop(TOP)} className={body.edge} strokeWidth={1}>
          {SOCKETS.map((x) => (
            <g key={x}>
              <circle cx={x} cy={MID} r={10} className={body.base} />
              <circle cx={x} cy={MID} r={10} className={body.ink} />
              <circle cx={x} cy={MID} r={7.2} className={body.ink} stroke="none" />
              <circle cx={x - PIN.gap} cy={MID} r={PIN.r + 0.9} className={pit} />
              <circle cx={x + PIN.gap} cy={MID} r={PIN.r + 0.9} className={pit} />
            </g>
          ))}
        </g>
        <Block faces={box(113, MID - 6, TOP, 9, 12, 1.2)} paint={body} />
        <Block faces={box(113, MID - 6, TOP + 1.2, 4.5, 12, 2.2)} paint={body} />
        <g transform={onTop(TOP + 1.2)} className={body.ink}>
          <rect x={119} y={MID - 3} width={1.5} height={6} rx={0.75} />
        </g>
        <Plug x={FAR} paint={body} />
        {/* The pins sink into their holes: the strip hides whatever is below its top face */}
        <g clipPath={`url(#${id}-pins)`}>
          <g className="isometric16-plug">
            {PINS.map((x) => (
              <RoundBlock key={x} shape={cylinder(x, MID, TOP - PIN.len, PIN.len, PIN.r)} paint={body} />
            ))}
          </g>
        </g>
        <g className="isometric16-plug">
          <Plug x={LIVE} paint={paint.accent} />
        </g>
      </svg>
    </div>
  );
}
