"use client";

import { useId } from "react";
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

interface Isometric151Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the parcel behind the open door with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric151Demo: Isometric151Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const G = 8;
const W = 100;
const D = 22;
const H = 66;
const COLUMNS = [4, 28, 74];
const PANEL = 52;
const ROWS = [4, 24, 44];
const DOOR_W = 22;
const DOOR_H = 18;
// The door that opens: right column, middle row, hinged on its left edge
const OX = 74;
const OZ = G + 24;
const OPENING = polygon([
  [OX, D, OZ],
  [OX + DOOR_W, D, OZ],
  [OX + DOOR_W, D, OZ + DOOR_H],
  [OX, D, OZ + DOOR_H],
]);
const PARCEL = box(OX + 3, 3, OZ, 16, 17, 13);

const PERIOD = 5.6;
type Vec = [number, number, number];
const screen = ([x, y, z]: Vec) => [(x - y) * C, (x + y) * S - z] as const;
const THICK = 1.5;
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const unease = (r: number) => (r < 0.5 ? Math.sqrt(r / 2) : 1 - Math.sqrt((1 - r) / 2));
// Swing open from 20% to 38%, closed again from 76% to 92%, with extra stops either side of 45 degrees where the faces swap
const KS = [...Array.from({ length: 9 }, (_, index) => (index + 1) / 10), unease(43 / 90), unease(47 / 90)].sort((a, b) => a - b);
const STOPS: [number, number][] = [
  [0, 0],
  [20, 0],
  ...KS.map((k): [number, number] => [20 + k * 18, 90 * ease(k)]),
  [38, 90],
  [76, 90],
  ...KS.map((k): [number, number] => [76 + k * 16, 90 * (1 - ease(k))]),
  [92, 0],
  [100, 0],
];
const n = (value: number) => value.toFixed(4);
type Face = "outer" | "inner" | "free" | "top";
/** The door's CSS: the swing animates only cos and sin, and every face derives its matrix from them, so shared edges cannot drift apart. */
function doorCss() {
  const c = "var(--isometric151-c)";
  const s = "var(--isometric151-s)";
  const [e, f] = screen([OX, D, OZ + DOOR_H]);
  const ax = `${n(C)} * ${c} - ${n(C)} * ${s}`;
  const ay = `${n(S)} * ${c} + ${n(S)} * ${s}`;
  const ox = `${n(-C)} * ${s} - ${n(C)} * ${c}`;
  const oy = `${n(-S)} * ${s} + ${n(S)} * ${c}`;
  const matrix = (m0: string, m1: string, m2: string, m3: string, tx: string, ty: string) => `matrix(calc(${m0}), calc(${m1}), ${m2}, ${m3}, calc(${tx}), calc(${ty}))`;
  const faces: Record<Face, string> = {
    outer: matrix(ax, ay, "0", "1", `${n(e)} + ${THICK} * (${ox})`, `${n(f)} + ${THICK} * (${oy})`),
    inner: matrix(ax, ay, "0", "1", n(e), n(f)),
    free: matrix(ox, oy, "0", "1", `${n(e)} + ${DOOR_W} * (${ax})`, `${n(f)} + ${DOOR_W} * (${ay})`),
    top: matrix(ax, ay, `calc(${ox})`, `calc(${oy})`, n(e), n(f)),
  };
  const turn = STOPS.map(([p, a]) => `${p.toFixed(2)}% { --isometric151-c: ${n(Math.cos((a * Math.PI) / 180))}; --isometric151-s: ${n(Math.sin((a * Math.PI) / 180))}; }`).join(" ");
  // The outer face shows below 45 degrees, the inner face above
  const show = (outer: boolean) => STOPS.map(([p, a], index) => `${p.toFixed(2)}% { opacity: ${(a < 45 && (STOPS[index + 1]?.[1] ?? a) < 45) === outer ? 1 : 0}; }`).join(" ");
  return `@property --isometric151-c { syntax: "<number>"; inherits: true; initial-value: 0; }
@property --isometric151-s { syntax: "<number>"; inherits: true; initial-value: 1; }
@keyframes isometric151-swing { ${turn} }
@keyframes isometric151-front { ${show(true)} }
@keyframes isometric151-back { ${show(false)} }
.isometric151-door { animation: isometric151-swing ${PERIOD}s linear infinite; }
${(Object.keys(faces) as Face[]).map((face) => `.isometric151-${face} { transform: ${faces[face]}; }`).join("\n")}
.isometric151-outer { animation: isometric151-front ${PERIOD}s step-end infinite; }
.isometric151-inner { animation: isometric151-back ${PERIOD}s step-end infinite; }`;
}
const STYLES = `
${doorCss()}
@keyframes isometric151-hop { 0%, 38% { transform: translateY(0); } 44% { transform: translateY(-4px); } 50% { transform: translateY(0); } 54% { transform: translateY(-1.5px); } 58%, 100% { transform: translateY(0); } }
.isometric151-hop { animation: isometric151-hop ${PERIOD}s ease-out infinite; }
.isometric151-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric151-door, .isometric151-outer, .isometric151-inner, .isometric151-hop { animation: none; } }
`;

function Door({ x, z, paint }: { x: number; z: number; paint: Paint }) {
  return (
    <>
      <rect x={x} y={-(z + DOOR_H)} width={DOOR_W} height={DOOR_H} rx={1} className={paint.base} />
      <rect x={x} y={-(z + DOOR_H)} width={DOOR_W} height={DOOR_H} rx={1} className={paint.left} />
      <rect x={x} y={-(z + DOOR_H)} width={DOOR_W} height={DOOR_H} rx={1} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className={paint.edge} />
      <rect x={x + DOOR_W - 5} y={-(z + DOOR_H / 2 + 3)} width={2} height={6} rx={1} className={paint.ink} />
    </>
  );
}

export function Isometric151({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric151Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric151-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-52 -86 160 164" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <polygon points={OPENING} />
          </clipPath>
        </defs>
        <Block faces={box(-8, -6, 0, W + 16, 46, G)} paint={body} />
        <Block faces={box(0, 0, G, W, D, H)} paint={body} />
        <Block faces={box(-2, -2, G + H, W + 4, D + 4, 4)} paint={body} />
        <g transform={onRight(W)} className={body.ink}>
          <rect x={4} y={-(G + H - 6)} width={D - 8} height={3} rx={1.5} />
        </g>
        <g transform={onLeft(D)}>
          <rect x={2} y={-(G + H - 2)} width={W - 4} height={H - 4} rx={1} className={body.ink} />
          {COLUMNS.flatMap((x) =>
            ROWS.filter((z) => !(x === OX && G + z === OZ)).map((z) => <Door key={`${x}-${z}`} x={x} z={G + z} paint={body} />),
          )}
          <rect x={PANEL} y={-(G + H - 4)} width={20} height={H - 8} rx={1} className={body.base} />
          <rect x={PANEL} y={-(G + H - 4)} width={20} height={H - 8} rx={1} className={body.left} />
          <g className={body.ink}>
            <rect x={PANEL + 3} y={-(G + H - 8)} width={14} height={12} rx={1.5} />
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => <rect key={`${row}-${col}`} x={PANEL + 4 + col * 4.5} y={-(G + 40) + row * 4} width={3} height={2.5} rx={0.5} />),
            )}
            <rect x={PANEL + 4} y={-(G + 18)} width={12} height={2} rx={1} />
          </g>
          <rect x={OX} y={-(OZ + DOOR_H)} width={DOOR_W} height={DOOR_H} className={body.ink} />
          <rect x={OX} y={-(OZ + DOOR_H)} width={DOOR_W} height={DOOR_H} className={body.ink} />
        </g>
        <g clipPath={`url(#${clipId})`}>
          <g className="isometric151-hop">
            <Block faces={PARCEL} paint={paint.accent} />
            <g transform={onLeft(20)} className={paint.accent.ink}>
              <rect x={OX + 10} y={-(OZ + 13)} width={2} height={13} />
            </g>
            <g transform={onTop(OZ + 13)} className={paint.accent.ink}>
              <rect x={OX + 10} y={3} width={2} height={17} />
            </g>
          </g>
        </g>
        <g className="isometric151-door">
          <g className={cn("isometric151-top", body.edge)} strokeWidth={1}>
            <rect width={DOOR_W} height={THICK} vectorEffect="non-scaling-stroke" className={body.base} />
          </g>
          <g className="isometric151-inner">
            <rect width={DOOR_W} height={DOOR_H} rx={1} className={body.base} />
            <rect width={DOOR_W} height={DOOR_H} rx={1} className={body.right} />
            <rect width={DOOR_W} height={DOOR_H} rx={1} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className={body.edge} />
          </g>
          <g className={cn("isometric151-free", body.edge)} strokeWidth={1}>
            <rect width={THICK} height={DOOR_H} vectorEffect="non-scaling-stroke" className={body.base} />
            <rect width={THICK} height={DOOR_H} className={body.left} stroke="none" />
          </g>
          <g className="isometric151-outer opacity-0">
            <Door x={0} z={-DOOR_H} paint={body} />
          </g>
        </g>
      </svg>
    </div>
  );
}
