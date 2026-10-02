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

interface Isometric46Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the mat with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric46Demo: Isometric46Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const L = 124;
const Y0 = 36;
const Y1 = 84;
const T = 3;
// The roll starts this thick and is down to a thin curl when the last of the mat pays out
const R0 = 11;
const R1 = 2;
const PERIOD = 7;
/** Radius of the roll once d units of mat lie flat: the spiral's area shrinks with the length paid out. */
const radius = (d: number) => Math.sqrt(R0 * R0 - ((R0 * R0 - R1 * R1) * d) / L);
/** How far the roll has turned by then, in degrees: the sum of distance over radius. */
const turned = (d: number) => (((2 * L) / (R0 * R0 - R1 * R1)) * (R0 - radius(d)) * 180) / Math.PI;
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const unease = (r: number) => (r < 0.5 ? Math.sqrt(r / 2) : 1 - Math.sqrt((1 - r) / 2));
// Unrolls from 8% to 44%, lies flat, rolls back up from 70% to 96%: [percent, length lying flat]
const STEPS = Array.from({ length: 19 }, (_, index) => index / 18);
const STOPS: [number, number][] = [
  [0, 0],
  ...STEPS.map((k): [number, number] => [8 + k * 36, L * ease(k)]),
  ...STEPS.map((k): [number, number] => [70 + k * 26, L * (1 - ease(k))]),
  [100, 0],
];
const frames = (rule: (d: number) => string) => STOPS.map(([at, d]) => `${at.toFixed(2)}% { ${rule(d)} }`).join(" ");
// The roll fades out over the last stretch, where it is only a curl
const solid = (d: number) => Math.min(1, Math.max(0, (L - d) / 10));
// Printed stripes sit at these distances from the free edge and show once the roll has passed them
const STRIPES = [10, L - 16];
const passed = (x: number) => {
  const k = unease((x + R0 * 0.6) / L);
  const out = 8 + k * 36;
  const back = 70 + (1 - k) * 26;
  return `0% { opacity: 0; } ${out.toFixed(2)}% { opacity: 1; } ${back.toFixed(2)}%, 100% { opacity: 0; }`;
};
const STYLES = `
@keyframes isometric46-roll { ${frames((d) => `transform: translate(${(d * C).toFixed(1)}px, ${(d * S).toFixed(1)}px); opacity: ${solid(d).toFixed(2)};`)} }
@keyframes isometric46-unroll { ${frames((d) => `transform: scaleX(${(d / L).toFixed(4)});`)} }
@keyframes isometric46-size { ${frames((d) => `transform: scale(${(radius(d) / R0).toFixed(4)});`)} }
@keyframes isometric46-turn { ${frames((d) => `transform: rotate(${turned(d).toFixed(1)}deg);`)} }
${STRIPES.map((x, index) => `@keyframes isometric46-stripe${index} { ${passed(x)} }\n.isometric46-stripe${index} { animation: isometric46-stripe${index} ${PERIOD}s step-end infinite; }`).join("\n")}
.isometric46-roll { animation: isometric46-roll ${PERIOD}s linear infinite; will-change: transform, opacity; }
.isometric46-unroll { transform-box: fill-box; transform-origin: left center; animation: isometric46-unroll ${PERIOD}s linear infinite; }
.isometric46-size { animation: isometric46-size ${PERIOD}s linear infinite; }
.isometric46-turn { animation: isometric46-turn ${PERIOD}s linear infinite; }
.isometric46-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric46-roll, .isometric46-unroll, .isometric46-size, .isometric46-turn, .isometric46-stripe0, .isometric46-stripe1 { animation: none; } }
`;
// The roll is cut into discs along its length; each one shrinks about the line where it touches the floor
const DISCS = Array.from({ length: Math.floor((Y1 - Y0) / 1.5) + 1 }, (_, index) => Y0 + index * 1.5);
const UNDER = `M${-R0} ${-R0}A${R0} ${R0} 0 0 0 ${R0} ${-R0}Z`;
// The rolled layers seen end on: a spiral from the core out to the surface
const SPIRAL = (() => {
  const edge = (shift: number) =>
    Array.from({ length: 85 }, (_, index) => {
      const turn = (index / 84) * 3.5 * 2 * Math.PI;
      const reach = 1.5 + shift + ((R0 - 3) * index) / 84;
      return `${(reach * Math.cos(turn)).toFixed(2)},${(reach * Math.sin(turn)).toFixed(2)}`;
    });
  return [...edge(0), ...edge(1.1).reverse()].join(" ");
})();
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
export function Isometric46({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric46Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const mat = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric46-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-80 -46 168 158" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={cylinder(18, 16, 0, 44, 11)} paint={paint.body} />
        <g transform={onTop(44)} className={paint.body.ink}>
          <circle cx={18} cy={16} r={9} />
        </g>
        <RoundBlock shape={cylinder(18, 16, 44, 10, 7)} paint={paint.body} />
        <Block faces={box(54, 4, 0, 40, 24, 20)} paint={paint.body} />
        <g transform={onLeft(28)} className={paint.body.ink}>
          <rect x={60} y={-14} width={28} height={2} rx={1} />
        </g>
        <g transform={onTop(T)}>
          <g className="isometric46-unroll">
            <rect x={0} y={Y0} width={L} height={Y1 - Y0} className={mat.base} />
          </g>
          {/* Stripes are printed on the mat: they stay put and appear as the roll passes over them */}
          <g className={mat.ink}>
            {STRIPES.map((x, index) => (
              <rect key={x} x={x} y={Y0 + 6} width={2} height={Y1 - Y0 - 12} rx={1} className={`isometric46-stripe${index}`} />
            ))}
          </g>
        </g>
        <g transform={onLeft(Y1)}>
          <g className="isometric46-unroll">
            <rect x={0} y={-T} width={L} height={T} className={mat.base} />
            <rect x={0} y={-T} width={L} height={T} className={mat.left} />
          </g>
        </g>
        <g className="isometric46-roll opacity-0">
          <g transform={onTop(0)}>
            <rect x={-2} y={Y0 + 1} width={12} height={Y1 - Y0} rx={3} className="fill-black/10" />
          </g>
          {DISCS.map((y, index) => {
            const front = index === DISCS.length - 1;
            return (
              <g key={y} transform={onLeft(y)}>
                <g className="isometric46-size">
                  <circle cx={0} cy={-R0} r={R0} className={mat.base} />
                  {front ? <circle cx={0} cy={-R0} r={R0} className={mat.left} /> : <path d={UNDER} className={mat.right} />}
                  {front && (
                    <g transform={`translate(0 ${-R0})`}>
                      <g className="isometric46-turn">
                        <polygon points={SPIRAL} className={mat.ink} />
                      </g>
                    </g>
                  )}
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
