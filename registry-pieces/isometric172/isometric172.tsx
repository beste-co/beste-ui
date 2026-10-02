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

interface Isometric172Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the code, the scan line and the confirmation with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric172Demo: Isometric172Props = {
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

const BASE = 6;
const W = 64;
const TALL = 118;
const THICK = 6;
// The phone stands on its bottom front edge and leans back by this much
const LEAN = (14 * Math.PI) / 180;
const FOOT = { x: 12, y: 46, z: BASE + 3 };
const UP: Point = [0, -Math.sin(LEAN), Math.cos(LEAN)];
const BACK: Point = [0, -Math.cos(LEAN), -Math.sin(LEAN)];
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
/** The matrix that lays local (across, down) units onto the leaning plane `depth` behind the glass, starting `rise` up the phone. */
function plane(depth: number, rise: number, left = 0) {
  const origin: Point = [FOOT.x + left, FOOT.y + UP[1] * rise + BACK[1] * depth, FOOT.z + UP[2] * rise + BACK[2] * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, -UP[1], -UP[2]]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
const GLASS = plane(0, TALL);
// Behind the glass the body is a stack of thin layers, far to near
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
// The rest behind the phone: a little wider, half as tall
const REST = { side: 4, tall: 62, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);
// Stroke and fill for marks that carry no tone
const GLYPH: Record<Palette, string> = { theme: "stroke-foreground/40", light: "stroke-zinc-950/40", dark: "stroke-white/40", tone: "stroke-white/50" };

// The code: three finder squares and a scatter of modules
const CODE = ["111010111", "101001101", "111011111", "001100010", "110101101", "010011000", "111010110", "101001011", "111011101"];
const MODULES = CODE.flatMap((row, y) => [...row].flatMap((cell, x) => (cell === "1" ? [{ x, y }] : [])));
// The sign stands behind the phone, in view of its camera, and faces the same way as the screen
const SIGN = { x: 88, y: 8, w: 38, d: 4, h: 50, z: BASE + 3, cell: 3 };
const SIGN_CODE = { x: SIGN.x + (SIGN.w - CODE.length * SIGN.cell) / 2, top: SIGN.z + SIGN.h - 6 };
// On the screen: the viewfinder, the code seen through it and the result sheet
const VIEW = { x: 6, y: 16, w: W - 12, h: 52 };
const SEEN = { cell: 3.2, x: (W - CODE.length * 3.2) / 2, y: 27.6 };
const FRAME = { x: SEEN.x - 5, y: SEEN.y - 5, s: CODE.length * SEEN.cell + 10 };
const SWEEP = FRAME.s - 4;
const SHEET = { y: 74, h: TALL - 3 - 74 };
const CORNERS = (() => {
  const { x, y, s } = FRAME;
  const far = { x: x + s, y: y + s };
  return `M${x} ${y + 7}V${y}H${x + 7}M${far.x - 7} ${y}H${far.x}V${y + 7}M${far.x} ${far.y - 7}V${far.y}H${far.x - 7}M${x + 7} ${far.y}H${x}V${far.y - 7}`;
})();
const PERIOD = 8;

const STYLES = `
@keyframes isometric172-scan { 0%, 8% { transform: translateY(0); opacity: 0; } 11% { opacity: 1; } 22% { transform: translateY(${SWEEP}px); } 36% { transform: translateY(0); } 50% { transform: translateY(${SWEEP}px); opacity: 1; } 54% { transform: translateY(${SWEEP}px); opacity: 0; } 100% { transform: translateY(0); opacity: 0; } }
@keyframes isometric172-lock { 0%, 49% { opacity: 0; } 53%, 90% { opacity: 1; } 96%, 100% { opacity: 0; } }
@keyframes isometric172-sheet { 0%, 53% { transform: translateY(${SHEET.h + 2}px); } 63%, 89% { transform: translateY(0); } 97%, 100% { transform: translateY(${SHEET.h + 2}px); } }
.isometric172-scan { transform: translateY(${SWEEP / 2}px); animation: isometric172-scan ${PERIOD}s ease-in-out infinite; }
.isometric172-lock { animation: isometric172-lock ${PERIOD}s linear infinite; }
.isometric172-sheet { transform: translateY(${SHEET.h + 2}px); animation: isometric172-sheet ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
.isometric172-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric172-scene * { animation: none !important; } }
`;

export function Isometric172({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric172Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const sheetId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const dots = accent ? mine.base : body.ink;
  const onMine = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : GLYPH[palette];
  const signal = accent ? (palette === "tone" ? "stroke-white" : "stroke-current") : GLYPH[palette];
  const code = (cell: number) =>
    // Without the tone the modules are ink, laid twice so they read
    (accent ? [0] : [0, 1]).map((pass) => (
      <g key={pass} className={dots}>
        {MODULES.map((module) => (
          <rect key={`${module.x}-${module.y}`} x={module.x * cell} y={module.y * cell} width={cell + 0.1} height={cell + 0.1} />
        ))}
      </g>
    ));

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric172-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -116 192 216" aria-hidden="true" className="isometric172-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} rx={3} />
          </clipPath>
          <clipPath id={sheetId}>
            <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 132, 72, BASE, 14)} paint={body} />
        {/* The sign: a foot, a thick board and the code printed on its face */}
        <RoundBlock shape={roundBox(SIGN.x - 4, SIGN.y - 5, BASE, SIGN.w + 8, SIGN.d + 10, 3, 4)} paint={body} />
        <Block faces={box(SIGN.x, SIGN.y, SIGN.z, SIGN.w, SIGN.d, SIGN.h)} paint={body} />
        <g transform={onLeft(SIGN.y + SIGN.d)}>
          <g transform={`translate(${SIGN_CODE.x} ${-SIGN_CODE.top})`}>{code(SIGN.cell)}</g>
          <rect x={SIGN.x + 9} y={-SIGN.z - 11} width={SIGN.w - 18} height={2.4} rx={1.2} className={body.ink} />
          <rect x={SIGN.x + 13} y={-SIGN.z - 6.5} width={SIGN.w - 26} height={2} rx={1} className={body.ink} />
        </g>
        <RoundBlock shape={roundBox(FOOT.x - 6, 14, BASE, W + 12, 44, 3, 8)} paint={body} />
        {/* The rest the phone leans against, then the phone itself, each built from thin layers back to front */}
        {REST_LAYERS.map((depth, index) => (
          <g key={depth} transform={plane(depth, REST.tall, -REST.side)} className={body.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={body.base} />
            <rect width={W + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? body.left : body.right} stroke="none" />
          </g>
        ))}
        {LAYERS.map((depth) => (
          <g key={depth} transform={plane(depth, TALL)}>
            <rect width={W} height={TALL} rx={9} className={body.base} />
            <rect width={W} height={TALL} rx={9} className={body.right} />
            {depth > 1 && depth < 5 && <rect x={W - 0.5} y={30} width={1.6} height={16} rx={0.8} className={body.ink} />}
          </g>
        ))}
        <g transform={GLASS}>
          <rect width={W} height={TALL} rx={9} strokeWidth={1} className={cn(body.base, body.edge)} />
          <rect x={3} y={3} width={W - 6} height={TALL - 6} rx={7} className={body.ink} />
          <rect x={W / 2 - 8} y={6.5} width={16} height={4} rx={2} className={body.ink} />
          {/* The viewfinder: the sign's board with its code, framed by corner brackets */}
          <g clipPath={`url(#${clipId})`}>
            <rect x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h} className={cn(body.base, "opacity-10")} />
            <rect x={FRAME.x + 1.5} y={FRAME.y + 1.5} width={FRAME.s - 3} height={VIEW.h} rx={2} className={body.base} />
            <g transform={`translate(${SEEN.x} ${SEEN.y})`}>{code(SEEN.cell)}</g>
            <g className="isometric172-scan">
              <path d={`M${FRAME.x + 2} ${FRAME.y + 2}H${FRAME.x + FRAME.s - 2}`} fill="none" strokeWidth={1.6} strokeLinecap="round" className={signal} />
            </g>
          </g>
          <g fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d={CORNERS} className={GLYPH[palette]} />
            <path d={CORNERS} className={cn("isometric172-lock opacity-0", signal)} />
          </g>
          {/* Under the viewfinder: a hint line, a flash toggle and a gallery button */}
          <rect x={W / 2 - 14} y={78} width={28} height={2.8} rx={1.4} className={body.base} />
          <rect x={W / 2 - 9} y={84} width={18} height={2.4} rx={1.2} className={cn(body.base, "opacity-60")} />
          <circle cx={W / 2 - 12} cy={101} r={5} className={cn(body.base, "opacity-60")} />
          <circle cx={W / 2 + 12} cy={101} r={5} className={cn(body.base, "opacity-60")} />
          {/* The result sheet slides up from the bottom edge with the check already on it */}
          <g clipPath={`url(#${sheetId})`}>
            <g className="isometric172-sheet">
              <rect x={3} y={SHEET.y} width={W - 6} height={SHEET.h + 8} rx={7} className={body.base} />
              <rect x={W / 2 - 6} y={SHEET.y + 3} width={12} height={1.8} rx={0.9} className={body.ink} />
              <circle cx={16} cy={SHEET.y + 16} r={7} className={accent ? mine.base : body.ink} />
              <path d={`M12.5 ${SHEET.y + 16.3}l2.6 2.6l4.6 -5.4`} fill="none" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={onMine} />
              <rect x={27} y={SHEET.y + 11.5} width={26} height={3} rx={1.5} className={body.ink} />
              <rect x={27} y={SHEET.y + 17.5} width={18} height={2.4} rx={1.2} className={body.ink} />
              <rect x={9} y={SHEET.y + 28} width={W - 18} height={9} rx={4.5} className={accent ? mine.base : body.ink} />
            </g>
          </g>
        </g>
        {/* The lip of the stand holds the bottom edge of the phone */}
        <RoundBlock shape={roundBox(FOOT.x - 4, FOOT.y - 1, BASE + 3, W + 8, 6, 5, 2.5)} paint={body} />
      </svg>
    </div>
  );
}
