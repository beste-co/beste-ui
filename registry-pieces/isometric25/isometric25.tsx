"use client";

import type { CSSProperties } from "react";
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

interface Isometric25Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the nose cone, band and fins with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric25Demo: Isometric25Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;
const n = (value: number) => value.toFixed(2);

type Profile = [number, number][];
/** A body turned about the upright axis through the origin: [height, radius] pairs from bottom to top, split into a lit and a shaded half. */
function lathe(profile: Profile) {
  const [z0, r0] = profile[0] ?? [0, 0];
  const [z1, r1] = profile[profile.length - 1] ?? [0, 0];
  const rim = profile.map(([z, r]) => `${n(r * ELLIPSE_X)} ${n(-z)}`);
  const keel = profile.map(([z, r]) => `0 ${n(r * ELLIPSE_Y - z)}`).reverse();
  const half = (sign: 1 | -1) => {
    const edge = profile.map(([z, r]) => `L${n(sign * r * ELLIPSE_X)} ${n(-z)}`).join(" ");
    const sweep = sign === 1 ? 0 : 1;
    return `M0 ${n(r0 * ELLIPSE_Y - z0)} A${n(r0 * ELLIPSE_X)} ${n(r0 * ELLIPSE_Y)} 0 0 ${sweep} ${n(sign * r0 * ELLIPSE_X)} ${n(-z0)} ${edge} A${n(r1 * ELLIPSE_X) || 1} ${n(r1 * ELLIPSE_Y) || 1} 0 0 ${1 - sweep} 0 ${n(r1 * ELLIPSE_Y - z1)} ${keel.map((point) => `L${point}`).join(" ")} Z`;
  };
  return { left: half(-1), right: half(1), top: { cy: -z1, rx: r1 * ELLIPSE_X, ry: r1 * ELLIPSE_Y }, rim };
}

function Lathe({ shape, paint, lid = false }: { shape: ReturnType<typeof lathe>; paint: Paint; lid?: boolean }) {
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={shape.left} className={paint.base} />
      <path d={shape.left} className={paint.left} stroke="none" />
      <path d={shape.right} className={paint.base} />
      <path d={shape.right} className={paint.right} stroke="none" />
      {lid && <ellipse cx={0} cy={shape.top.cy} rx={shape.top.rx} ry={shape.top.ry} className={paint.base} />}
    </g>
  );
}

const BASE = 6;
const PAD = BASE + 5;
// Rocket heights are measured from the platform it stands on
const BELL = lathe([[3, 7.5], [5, 6.4], [9, 5]]);
const HULL = lathe([[9, 9], [13, 10.4], [24, 11.4], [38, 11.4], [50, 10.8], [60, 10]]);
const BAND = lathe([[44, 11.4], [49, 11.1]]);
const NOSE = lathe(Array.from({ length: 12 }, (_, index): [number, number] => [60 + (28 * index) / 11, 10 * (1 - (index / 11) ** 2) ** 0.7]));
const WINDOW_Z = 34;
// A fin in its own upright plane: (out from the axis, down) units, swept back to a foot that stands on the platform
const FIN = "9.5,-8 10.9,-27 20.5,-10 20.5,0 17,0";
const FIN_BACK = "-9.5,-8 -10.9,-27 -20.5,-10 -20.5,0 -17,0";
const FIN_LAYERS = [-0.8, 0, 0.8];
// The service tower stands behind the rocket; its arm reaches the band and swings away about the hinge
const TOWER = { x: -37, y: -4, w: 8, h: 68 };
const HINGE = TOWER.x + TOWER.w;
const ARM_Z = PAD + 44;
const ARM = { length: -HINGE - 10.4, layers: [0, 1, 2, 3] };

const PUFFS = [0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
  const angle = ((index * 45 + 20) * Math.PI) / 180;
  const [cx, cy] = [Math.cos(angle) * 15, Math.sin(angle) * 15];
  const [dx, dy] = [Math.cos(angle) * 26, Math.sin(angle) * 26];
  return {
    index,
    x: (cx - cy) * C,
    y: (cx + cy) * S - PAD - 3,
    r: 6 + (index % 3) * 1.5,
    back: cx + cy < 0,
    style: {
      animationDelay: `${(index % 4) * 0.14}s`,
      "--isometric25-dx": `${((dx - dy) * C).toFixed(1)}px`,
      "--isometric25-dy": `${((dx + dy) * S).toFixed(1)}px`,
    } as CSSProperties,
  };
});

// Liftoff: slow at first, then faster and faster straight up, [percent, height]
const CLIMB: [number, number][] = [[34, 0], [40, 3], [46, 12], [52, 30], [58, 62], [64, 115], [70, 200]];
const RISE = CLIMB.map(([at, up]) => `${at}% { transform: translateY(${-up}px); opacity: ${at >= 70 ? 0 : 1}; }`).join(" ");

const STYLES = `
@keyframes isometric25-arm { 0%, 10% { transform: rotate(0deg); } 20%, 88% { transform: rotate(78deg); } 98%, 100% { transform: rotate(0deg); } }
@keyframes isometric25-rise { 0% { transform: translateY(0); opacity: 1; } ${RISE} 70.1%, 90% { transform: translateY(0); opacity: 0; } 97%, 100% { transform: translateY(0); opacity: 1; } }
@keyframes isometric25-shake { 0%, 21%, 35%, 100% { transform: translateX(0); } 23%, 27%, 31% { transform: translateX(0.6px); } 25%, 29%, 33% { transform: translateX(-0.6px); } }
@keyframes isometric25-flame { 0%, 20% { transform: scaleY(0.2); opacity: 0; } 21% { transform: scaleY(0.25); opacity: 1; } 34% { transform: scaleY(0.3); opacity: 1; } 46% { transform: scaleY(1); opacity: 1; } 64% { transform: scaleY(2.2); opacity: 1; } 70%, 100% { transform: scaleY(2.2); opacity: 0; } }
@keyframes isometric25-flicker { 0%, 100% { transform: scale(1, 1); } 50% { transform: scale(0.8, 0.86); } }
@keyframes isometric25-glow { 0%, 20% { opacity: 0; } 23%, 38% { opacity: 1; } 52%, 100% { opacity: 0; } }
@keyframes isometric25-shadow { 0%, 36% { transform: scale(1); opacity: 1; } 54%, 90% { transform: scale(0.4); opacity: 0; } 97%, 100% { transform: scale(1); opacity: 1; } }
@keyframes isometric25-puff { 0%, 21% { transform: translate(0, 0) scale(0.3); opacity: 0; } 26% { transform: translate(0, 0) scale(0.7); opacity: 1; } 52% { opacity: 1; } 76%, 100% { transform: translate(var(--isometric25-dx), var(--isometric25-dy)) scale(1.5); opacity: 0; } }
.isometric25-arm { animation: isometric25-arm 8s ease-in-out infinite; }
.isometric25-rise { animation: isometric25-rise 8s linear infinite; will-change: transform, opacity; }
.isometric25-shake { animation: isometric25-shake 8s linear infinite; }
.isometric25-flame { animation: isometric25-flame 8s linear infinite; transform-box: fill-box; transform-origin: center top; }
.isometric25-flicker { animation: isometric25-flicker 0.24s ease-in-out infinite; transform-box: fill-box; transform-origin: center top; }
.isometric25-glow { animation: isometric25-glow 8s linear infinite; }
.isometric25-shadow { animation: isometric25-shadow 8s linear infinite; transform-box: fill-box; transform-origin: center; }
.isometric25-puff { animation: isometric25-puff 8s ease-out infinite both; transform-box: fill-box; transform-origin: center; }
.isometric25-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric25-arm, .isometric25-rise, .isometric25-shake, .isometric25-flame, .isometric25-flicker, .isometric25-glow, .isometric25-shadow, .isometric25-puff { animation: none; } }
`;

/** An upright cylinder centered on the origin in plan, shaded in two halves like a box. */
function Cylinder({ r, z, h, paint }: { r: number; z: number; h: number; paint: Paint }) {
  return <Lathe shape={lathe([[z, r], [z + h, r]])} paint={paint} lid />;
}

export function Isometric25({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric25Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const trim = paint.accent;
  const smoke = palette === "tone" ? "fill-white/40" : body.base;
  const puffs = (back: boolean) => {
    const list = PUFFS.filter((item) => item.back === back);
    return (
      <>
        {list.map((item) => (
          <circle key={`o${item.index}`} cx={item.x} cy={item.y} r={item.r} fill="none" strokeWidth={2} className={cn("isometric25-puff opacity-0", body.edge)} style={item.style} />
        ))}
        {list.map((item) => (
          <circle key={`f${item.index}`} cx={item.x} cy={item.y} r={item.r} className={cn("isometric25-puff opacity-0", smoke)} style={item.style} />
        ))}
      </>
    );
  };
  const fin = (points: string, plane: (offset: number) => string, shade: string) =>
    FIN_LAYERS.map((offset, index) => (
      <g key={offset} transform={plane(offset)}>
        <polygon points={points} className={trim.base} />
        <polygon points={points} className={index === FIN_LAYERS.length - 1 ? shade : trim.right} />
      </g>
    ));

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric25-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-74 -114 148 162" aria-hidden="true" className="size-full overflow-visible">
        <Cylinder r={52} z={0} h={BASE} paint={body} />
        <g transform={onTop(BASE)} className={body.ink}>
          <path d="M-42 0 A42 42 0 1 0 42 0 A42 42 0 1 0 -42 0 Z M-38 0 A38 38 0 1 1 38 0 A38 38 0 1 1 -38 0 Z" fillRule="evenodd" />
        </g>
        <Block faces={box(TOWER.x, TOWER.y, BASE, TOWER.w, 8, TOWER.h)} paint={body} />
        <g transform={onLeft(TOWER.y + 8)} className={body.ink}>
          {[14, 28, 42, 56].map((up) => (
            <rect key={up} x={TOWER.x + 1} y={-(BASE + up)} width={TOWER.w - 2} height={2} />
          ))}
        </g>
        <g transform={onRight(HINGE)} className={body.ink}>
          {[14, 28, 42, 56].map((up) => (
            <rect key={up} x={TOWER.y + 1} y={-(BASE + up)} width={6} height={2} />
          ))}
        </g>
        <Block faces={box(TOWER.x - 1, TOWER.y - 1, BASE + TOWER.h, TOWER.w + 2, 10, 3)} paint={body} />
        <Cylinder r={26} z={BASE} h={PAD - BASE} paint={body} />
        <g transform={onTop(PAD)}>
          <circle r={11} className={body.ink} />
          <circle r={15} className={cn("isometric25-shadow", body.ink)} />
          <circle r={20} className="isometric25-glow fill-orange-500 opacity-0" />
          <circle r={12} className="isometric25-glow fill-amber-300 opacity-0" />
        </g>
        {ARM.layers.map((layer) => (
          <g key={layer} transform={`${onTop(ARM_Z + layer)} translate(${HINGE} 0)`}>
            <g className="isometric25-arm">
              <rect x={0} y={-1.5} width={ARM.length} height={3} className={body.base} />
              <rect x={0} y={-1.5} width={ARM.length} height={3} className={layer === 3 ? body.left : body.right} />
            </g>
          </g>
        ))}
        {puffs(true)}
        <g className="isometric25-rise">
          <g className="isometric25-shake">
            <g transform={`translate(0 ${-PAD})`}>
              {fin(FIN_BACK, onLeft, trim.right)}
              {fin(FIN_BACK, onRight, trim.right)}
              <g transform="translate(0 -4)">
                <g className="isometric25-flame opacity-0">
                  <path d="M-6.5 0 C-7 9 -3 15 0 22 C3 15 7 9 6.5 0 Z" className="fill-orange-500" />
                  <path d="M-3.5 0 C-4 6 -1.5 10 0 14 C1.5 10 4 6 3.5 0 Z" className="isometric25-flicker fill-amber-300" />
                </g>
              </g>
              <Lathe shape={BELL} paint={body} />
              <path d={`${BELL.left} ${BELL.right}`} className={body.ink} />
              <Lathe shape={HULL} paint={body} />
              <Lathe shape={BAND} paint={trim} />
              <Lathe shape={NOSE} paint={trim} />
              <g transform={`translate(0 ${n(11.4 * ELLIPSE_Y - WINDOW_Z)})`}>
                <ellipse rx={5} ry={4.2} className={body.base} />
                <ellipse rx={5} ry={4.2} className={body.ink} />
                <ellipse rx={3.4} ry={2.8} className={palette === "dark" ? "fill-black/60" : "fill-zinc-800"} />
                <ellipse cx={-1} cy={-0.9} rx={1.2} ry={0.8} className="fill-white/60" />
              </g>
              {fin(FIN, onLeft, trim.left)}
              {fin(FIN, onRight, trim.right)}
            </g>
          </g>
        </g>
        {puffs(false)}
      </svg>
    </div>
  );
}
