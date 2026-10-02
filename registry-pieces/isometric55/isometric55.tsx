"use client";

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

interface Isometric55Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the folder inside with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric55Demo: Isometric55Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 116;
const D = 76;
const BASE = 22;
const LID = 14;
const OPEN = 105;
const PERIOD = 5.6;

type Vec = [number, number, number];
const screen = ([x, y, z]: Vec) => [(x - y) * C, (x + y) * S - z] as const;
/** A CSS/SVG matrix that draws local (u, v) onto the plane through o spanned by a and b. */
function frame(o: Vec, a: Vec, b: Vec) {
  const [e, f] = screen(o);
  const [m0, m1] = screen(a);
  const [m2, m3] = screen(b);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(", ")})`;
}
const ALONG: Vec = [1, 0, 0];
/** The lid faces at an opening angle in degrees; it hinges on the back edge. */
function lidFrames(angle: number) {
  const t = (angle * Math.PI) / 180;
  const up: Vec = [0, Math.cos(t), Math.sin(t)];
  const out: Vec = [0, -Math.sin(t), Math.cos(t)];
  const at = (u: number, w: number, n: number): Vec => [u, up[1] * w + out[1] * n, BASE + up[2] * w + out[2] * n];
  return {
    outer: frame(at(0, 0, LID), ALONG, up),
    inner: frame(at(0, 0, 0), ALONG, up),
    front: frame(at(0, D, 0), ALONG, out),
    end: frame(at(W, 0, 0), up, out),
  };
}
const OPENED = lidFrames(OPEN);
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const unease = (r: number) => (r < 0.5 ? Math.sqrt(r / 2) : 1 - Math.sqrt((1 - r) / 2));
// Closed until 14%, opens by 36%, holds, closes from 74% to 94%, with extra stops either side of 45 degrees where the faces swap
const KS = [...Array.from({ length: 15 }, (_, index) => (index + 1) / 16), unease(43 / OPEN), unease(47 / OPEN)].sort((a, b) => a - b);
const STOPS: [number, number][] = [
  [0, 0],
  [14, 0],
  ...KS.map((k): [number, number] => [14 + k * 22, OPEN * ease(k)]),
  [36, OPEN],
  [74, OPEN],
  ...KS.map((k): [number, number] => [74 + k * 20, OPEN * (1 - ease(k))]),
  [94, 0],
  [100, 0],
];
const n = (value: number) => value.toFixed(4);
/** A number that depends on the lid angle: k + c * cos + s * sin, written for calc(). */
const mix = (k: number, c: number, s: number) => `calc(${n(k)} + ${n(c)} * var(--isometric55-c) + ${n(s)} * var(--isometric55-s))`;
type Axis = "along" | "up" | "out";
// Screen directions of the lid's own axes as [k, cos, sin] parts for x and y
const AXES: Record<Axis, [[number, number, number], [number, number, number]]> = {
  along: [[C, 0, 0], [S, 0, 0]],
  up: [[0, -C, 0], [0, S, -1]],
  out: [[0, 0, C], [0, -1, -S]],
};
/** The matrix of a lid face at (u along, w up, m out) from the hinge; it follows cos and sin, so shared edges cannot drift apart. */
function face(u: number, w: number, m: number, a: Axis, b: Axis) {
  const [ax, ay] = AXES[a];
  const [bx, by] = AXES[b];
  return `matrix(${mix(...ax)}, ${mix(...ay)}, ${mix(...bx)}, ${mix(...by)}, ${mix(u * C, -w * C, m * C)}, ${mix(u * S - BASE, w * S - m, -w - m * S)})`;
}
type Face = keyof typeof OPENED;
const FACE_CSS: Record<Face, string> = {
  outer: face(0, 0, LID, "along", "up"),
  inner: face(0, 0, 0, "along", "up"),
  front: face(0, D, 0, "along", "out"),
  end: face(W, 0, 0, "up", "out"),
};
const TURN = STOPS.map(([p, a]) => `${p.toFixed(2)}% { --isometric55-c: ${n(Math.cos((a * Math.PI) / 180))}; --isometric55-s: ${n(Math.sin((a * Math.PI) / 180))}; }`).join(" ");
// The top of the lid shows below 45 degrees, its inside above
const show = (top: boolean) => STOPS.map(([p, a], index) => `${p.toFixed(2)}% { opacity: ${(a < 45 && (STOPS[index + 1]?.[1] ?? a) < 45) === top ? 1 : 0}; }`).join(" ");

const STYLES = `
@property --isometric55-c { syntax: "<number>"; inherits: true; initial-value: ${n(Math.cos((OPEN * Math.PI) / 180))}; }
@property --isometric55-s { syntax: "<number>"; inherits: true; initial-value: ${n(Math.sin((OPEN * Math.PI) / 180))}; }
@keyframes isometric55-lid { ${TURN} }
@keyframes isometric55-show { ${show(true)} }
@keyframes isometric55-hide { ${show(false)} }
@keyframes isometric55-latch { 0%, 4% { transform: translateY(0); } 8%, 12% { transform: translateY(2px); } 16%, 100% { transform: translateY(0); } }
.isometric55-lid { animation: isometric55-lid ${PERIOD}s linear infinite; }
${(Object.keys(FACE_CSS) as Face[]).map((name) => `.isometric55-${name} { transform: ${FACE_CSS[name]}; }`).join("\n")}
.isometric55-outer { animation: isometric55-show ${PERIOD}s step-end infinite; }
.isometric55-inner { animation: isometric55-hide ${PERIOD}s step-end infinite; }
.isometric55-latch { animation: isometric55-latch ${PERIOD}s ease-in-out infinite; }
.isometric55-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric55-lid, .isometric55-outer, .isometric55-inner, .isometric55-latch { animation: none; } }
`;

const HANDLE = `M${W / 2 - 18} ${D + 2}V${D + 6}Q${W / 2 - 18} ${D + 12} ${W / 2 - 12} ${D + 12}H${W / 2 + 12}Q${W / 2 + 18} ${D + 12} ${W / 2 + 18} ${D + 6}V${D + 2}`;
const LATCHES = [16, W - 26];
const MOUNTS = [W / 2 - 21, W / 2 + 15];

export function Isometric55({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric55Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const stroke = (fill: string) => fill.replace("fill-", "stroke-");

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric55-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-74 -114 212 216" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, W, D, BASE)} paint={paint.body} />
        <g transform={onTop(BASE)} className={paint.body.ink}>
          <rect x={6} y={6} width={W - 12} height={D - 12} rx={4} />
        </g>
        <Block faces={box(16, 14, BASE, 76, 50, 3)} paint={paint.accent} />
        <Block faces={box(16, 10, BASE, 22, 6, 3)} paint={paint.accent} />
        <Block faces={box(28, 20, BASE + 3, 70, 44, 2)} paint={paint.body} />
        <g transform={onTop(BASE + 5)} className={paint.body.ink}>
          <rect x={36} y={28} width={30} height={4} rx={2} />
          {[38, 45, 52].map((y) => (
            <rect key={y} x={36} y={y} width={50} height={3} rx={1.5} />
          ))}
        </g>
        <g className={cn("isometric55-lid", paint.body.edge)} strokeWidth={1} strokeLinejoin="round">
          <g className="isometric55-end" transform={OPENED.end}>
            <rect width={D} height={LID} className={paint.body.base} />
            <rect width={D} height={LID} className={paint.body.right} stroke="none" />
          </g>
          <g className="isometric55-inner" transform={OPENED.inner}>
            <rect width={W} height={D} className={paint.body.base} />
            <rect width={W} height={D} className={paint.body.left} stroke="none" />
            <rect x={10} y={10} width={W - 20} height={D - 30} rx={4} className={paint.body.ink} stroke="none" />
          </g>
          <g className="isometric55-front" transform={OPENED.front}>
            <rect width={W} height={LID} className={paint.body.base} />
            <rect width={W} height={LID} className={paint.body.left} stroke="none" />
            {LATCHES.map((x) => (
              <rect key={x} x={x + 1} y={0} width={8} height={4} rx={1} className={paint.body.ink} stroke="none" />
            ))}
          </g>
          <g className="isometric55-outer opacity-0" transform={OPENED.outer}>
            <rect width={W} height={D} className={paint.body.base} />
            <rect x={8} y={8} width={W - 16} height={D - 16} rx={4} fill="none" strokeWidth={1.5} className={palette === "tone" ? "stroke-white/30" : "stroke-black/10"} />
          </g>
        </g>
        {/* Latches and mounts sit on the front of the base; the handle reaches out past them, so it is drawn last */}
        {LATCHES.map((x) => (
          <g key={x} className="isometric55-latch">
            <Block faces={box(x, D, BASE - 8, 10, 2, 8)} paint={paint.body} />
          </g>
        ))}
        {MOUNTS.map((x) => (
          <Block key={x} faces={box(x, D, BASE - 7, 6, 2, 6)} paint={paint.body} />
        ))}
        {[BASE - 5, BASE - 4, BASE - 3, BASE - 2].map((z, index, all) => (
          <g key={z} transform={onTop(z)}>
            {index === 0 && <path d={HANDLE} fill="none" strokeWidth={8} strokeLinecap="round" className={paint.body.edge} />}
            <path d={HANDLE} fill="none" strokeWidth={6} strokeLinecap="round" className={stroke(paint.body.base)} />
            {index < all.length - 1 && <path d={HANDLE} fill="none" strokeWidth={6} strokeLinecap="round" className={stroke(paint.body.right)} />}
          </g>
        ))}
      </svg>
    </div>
  );
}
