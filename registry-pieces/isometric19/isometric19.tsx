"use client";

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

interface Isometric19Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the letter with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric19Demo: Isometric19Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 132;
const T = 12;
const H = 84;
const FLAP = 44;
const SLOT = 7;
const LETTER_X = 14;
const LETTER_W = W - LETTER_X * 2;
const LETTER_H = 72;
const LETTER_Z = 50;
const SINK = 44;
const PERIOD = 5.6;
const LINES = [56, 80, 44];

const TRIANGLE = `0,0 ${W},0 ${W / 2},${FLAP}`;

type Vec = [number, number, number];
const screen = ([x, y, z]: Vec) => [(x - y) * C, (x + y) * S - z] as const;
/** A CSS/SVG matrix that draws local (u, v) onto the plane through o spanned by a and b. */
function frame(o: Vec, a: Vec, b: Vec) {
  const [e, f] = screen(o);
  const [m0, m1] = screen(a);
  const [m2, m3] = screen(b);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(", ")})`;
}
/** The flap at a fold angle: 0 stands open, 90 lies over the top edge, 180 is shut down the front. */
function flapAt(angle: number) {
  const spine = (Math.min(angle, 90) * Math.PI) / 180;
  const fold = (angle * Math.PI) / 180;
  const along: Vec = [0, Math.sin(spine), Math.cos(spine)];
  const tip: Vec = [0, Math.sin(fold), Math.cos(fold)];
  return {
    spine: frame([0, 0, H], [1, 0, 0], along),
    flap: frame([0, along[1] * T, H + along[2] * T], [1, 0, 0], tip),
  };
}
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const SWING = Array.from({ length: 23 }, (_, index) => (index + 1) / 24);
// Shut until 8%, open from 24% to 82%, shut again by 98%: [percent, fold angle]
const STOPS: [number, number][] = [
  [0, 180],
  [8, 180],
  ...SWING.map((k): [number, number] => [8 + k * 16, 180 * (1 - ease(k))]),
  [24, 0],
  [82, 0],
  ...SWING.map((k): [number, number] => [82 + k * 16, 180 * ease(k)]),
  [98, 180],
  [100, 180],
];
const n = (value: number) => value.toFixed(4);
const turn = (degrees: number) => [Math.cos((degrees * Math.PI) / 180), Math.sin((degrees * Math.PI) / 180)] as const;
// Only cos and sin of the two fold angles are animated; both pieces derive their matrix from them, so the crease cannot drift apart
const FOLD = STOPS.map(([at, angle]) => {
  const [c, s2] = turn(angle);
  const [pc, ps] = turn(Math.min(angle, 90));
  return `${at.toFixed(2)}% { --isometric19-c: ${n(c)}; --isometric19-s: ${n(s2)}; --isometric19-pc: ${n(pc)}; --isometric19-ps: ${n(ps)}; }`;
}).join(" ");
const v = (name: string) => `var(--isometric19-${name})`;
const SPINE_CSS = `matrix(${n(C)}, ${n(S)}, calc(${n(-C)} * ${v("ps")}), calc(${n(S)} * ${v("ps")} - ${v("pc")}), 0, ${-H})`;
const FLAP_CSS = `matrix(${n(C)}, ${n(S)}, calc(${n(-C)} * ${v("s")}), calc(${n(S)} * ${v("s")} - ${v("c")}), calc(${n(-C * T)} * ${v("ps")}), calc(${n(S * T)} * ${v("ps")} - ${H} - ${T} * ${v("pc")}))`;
const OPEN = flapAt(0);
const STYLES = `
${["c", "pc"].map((name) => `@property --isometric19-${name} { syntax: "<number>"; inherits: true; initial-value: 1; }`).join("\n")}
${["s", "ps"].map((name) => `@property --isometric19-${name} { syntax: "<number>"; inherits: true; initial-value: 0; }`).join("\n")}
@keyframes isometric19-fold { ${FOLD} }
@keyframes isometric19-over { 0% { opacity: 1; } 24% { opacity: 0; } 82%, 100% { opacity: 1; } }
@keyframes isometric19-under { 0% { opacity: 0; } 24% { opacity: 1; } 82%, 100% { opacity: 0; } }
@keyframes isometric19-letter { 0%, 26% { transform: translateY(${SINK}px); } 44% { transform: translateY(-3px); } 50%, 68% { transform: translateY(0); } 80%, 100% { transform: translateY(${SINK}px); } }
.isometric19-fold { animation: isometric19-fold ${PERIOD}s linear infinite; }
.isometric19-spine { transform: ${SPINE_CSS}; }
.isometric19-flap { transform: ${FLAP_CSS}; }
.isometric19-over { animation: isometric19-over ${PERIOD}s step-end infinite; }
.isometric19-under { animation: isometric19-under ${PERIOD}s step-end infinite; }
.isometric19-letter { animation: isometric19-letter ${PERIOD}s ease-in-out infinite; will-change: transform; }
.isometric19-still, .isometric19-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric19-fold, .isometric19-over, .isometric19-under, .isometric19-letter { animation: none; } }
`;

/** The hinged flap: a strip as deep as the envelope, then the triangle; it rests standing open. */
function Flap({ paint, className }: { paint: Paint; className: string }) {
  return (
    <g className={cn(className, paint.edge)} strokeWidth={1} strokeLinejoin="round">
      <g className="isometric19-spine" transform={OPEN.spine}>
        <rect width={W} height={T} className={paint.base} />
        <rect width={W} height={T} className={paint.left} stroke="none" />
      </g>
      <g className="isometric19-flap" transform={OPEN.flap}>
        <polygon points={TRIANGLE} className={paint.base} />
        <polygon points={TRIANGLE} className={paint.left} stroke="none" />
      </g>
    </g>
  );
}

export function Isometric19({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric19Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const letterTop = LETTER_Z + LETTER_H;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric19-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-28 -128 158 212" aria-hidden="true" className="isometric19-fold size-full overflow-visible">
        <Flap paint={body} className="isometric19-under" />
        <Block faces={box(0, 0, 0, W, SLOT, H)} paint={body} />
        <g className="isometric19-letter">
          <Block faces={box(LETTER_X, SLOT - 2, LETTER_Z, LETTER_W, 2, LETTER_H)} paint={paint.accent} />
          <g transform={onLeft(SLOT)} className={paint.accent.ink}>
            {LINES.map((width, index) => (
              <rect key={index} x={LETTER_X + 12} y={-letterTop + 11 + index * 9} width={width} height={5} rx={2.5} />
            ))}
          </g>
        </g>
        <Block faces={box(0, SLOT, 0, W, T - SLOT, H)} paint={body} />
        <g transform={onLeft(T)}>
          <g className={body.ink}>
            <rect x={W - 34} y={-H + 14} width={20} height={24} rx={3} />
            <rect x={36} y={-34} width={52} height={5} rx={2.5} />
            <rect x={36} y={-24} width={36} height={5} rx={2.5} />
          </g>
        </g>
        <Flap paint={body} className="isometric19-over opacity-0" />
      </svg>
    </div>
  );
}
