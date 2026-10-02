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

interface Isometric61Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the wings and tail of the plane with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric61Demo: Isometric61Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

type Plan = [number, number][];

/** A flat solid standing on a plan outline, showing only the sides that face the viewer. */
function prism(outline: Plan, z: number, h: number) {
  const area = outline.reduce((sum, [ax, ay], index) => {
    const [bx, by] = outline[(index + 1) % outline.length] as [number, number];
    return sum + ax * by - bx * ay;
  }, 0);
  const points = area < 0 ? [...outline].reverse() : outline;
  const sides = points.flatMap(([ax, ay], index) => {
    const [bx, by] = points[(index + 1) % points.length] as [number, number];
    const [nx, ny] = [by - ay, ax - bx];
    if (nx + ny <= 0) return [];
    return [{ points: polygon([[ax, ay, z + h], [bx, by, z + h], [bx, by, z], [ax, ay, z]]), left: ny > nx }];
  });
  return { top: polygon(points.map(([px, py]): Point => [px, py, z + h])), sides };
}

function Prism({ shape, paint }: { shape: ReturnType<typeof prism>; paint: Paint }) {
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      {shape.sides.map((side) => (
        <g key={side.points}>
          <polygon points={side.points} className={paint.base} />
          <polygon points={side.points} className={side.left ? paint.left : paint.right} stroke="none" />
        </g>
      ))}
      <polygon points={shape.top} className={paint.base} />
    </g>
  );
}

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

const GROUND = box(0, -28, 0, 152, 112, 8);
const DASHES = [32, 56, 80, 104, 128];
const LIGHTS = Array.from({ length: 10 }, (_, index) => 4 + index * 16);
const TOWER = [box(8, -24, 8, 12, 12, 40), box(4, -28, 48, 20, 20, 12), box(6, -26, 60, 16, 16, 3)];

// The plane points toward +x along the runway center line; TX is the tail
const CY = 40;
const TX = 38;
const Z = 12;
const FIN = `M${TX + 22} ${-Z - 14}L${TX + 10} ${-Z - 34}H${TX + 2}V${-Z - 14}Z`;
const WINDOWS = Array.from({ length: 8 }, (_, index) => TX + 16 + index * 6);
// The plane is cut into upright slices along its length, so every slice can pitch about the main wheels
const SPAN = 44;
const R = 8;
const AXIS = Z + R;
const SLICES = Array.from({ length: 2 * R + 1 }, (_, index) => index - R);
/** The parts of the plane that the plane y = CY + off cuts through, as rects in (x, -z) units. */
function cut(off: number) {
  const out = Math.abs(off);
  const tube = out < R ? Math.sqrt(R * R - off * off) : 0;
  return {
    tube,
    fin: out <= 2,
    nose: out <= 2,
    main: out >= 8 && out <= 12,
    glass: out < 5,
  };
}
// The plane pitches about the point where its main wheels touch the runway
const PIVOT = { x: TX + 38, z: 8 };
// Wings and tailplanes are flat sheets, stacked a few times for thickness, on planes that pitch with the plane
const WING_LAYERS = [Z + 3, Z + 4, Z + 5, Z + 6];
const TAIL_LAYERS = [Z + 12, Z + 13, Z + 14];
const WING: [number, number][] = [[TX + 32, R - 2], [TX + 50, R - 2], [TX + 34, SPAN], [TX + 26, SPAN]];
const TAIL: [number, number][] = [[TX + 4, R - 2], [TX + 14, R - 2], [TX + 6, 20], [TX + 2, 20]];
/** A sheet outline in (along from the pivot, across) units; side -1 is the far wing. */
const sheet = (outline: [number, number][], side: 1 | -1) => outline.map(([x, out]) => `${x - PIVOT.x},${CY + side * out}`).join(" ");
/** The matrix of the level plane at height z once pitched: it follows the same angle as the slices. */
function level(z: number) {
  const up = z - PIVOT.z;
  const cos = "cos(var(--isometric61-p))";
  const sin = "sin(var(--isometric61-p))";
  return `matrix(calc(${C} * ${cos}), calc(${S} * ${cos} + ${sin}), ${-C}, ${S}, calc(${(C * PIVOT.x).toFixed(3)} + ${(C * up).toFixed(3)} * ${sin}), calc(${(S * PIVOT.x - PIVOT.z).toFixed(3)} + ${(S * up).toFixed(3)} * ${sin} - ${up} * ${cos}))`;
}
// Ground run, rotation and climb, sampled so the speed never jumps: [percent, travel along x, height, pitch]
const LIFT = 54;
const PATH = Array.from({ length: 22 }, (_, index) => {
  const at = 6 + index * 4;
  const run = Math.min(1, (at - 6) / (LIFT - 6));
  const air = Math.max(0, at - LIFT);
  const speed = (2 * 76) / (LIFT - 6);
  const turn = Math.min(1, Math.max(0, (at - 46) / 14));
  return { at, x: -40 + 76 * run * run + speed * air, z: 0.05 * air * air, pitch: -12 * turn * turn * (3 - 2 * turn) };
});
const shown = (at: number) => (at <= 6 ? 0 : at < 10 ? 1 : at <= 74 ? 1 : at >= 84 ? 0 : (84 - at) / 10);
const FLY = PATH.map((step) => `${step.at}% { transform: translate(${(step.x * C).toFixed(1)}px, ${(step.x * S - step.z).toFixed(1)}px); opacity: ${shown(step.at).toFixed(2)}; }`).join(" ");
const PITCH = PATH.map((step) => `${step.at}% { --isometric61-p: ${step.pitch.toFixed(2)}deg; }`).join(" ");
// The shadow stays on the runway under the plane and thins out as it climbs
const SHADE = PATH.map((step) => `${step.at}% { transform: translateX(${step.x.toFixed(1)}px); opacity: ${(shown(step.at) * Math.max(0, 1 - step.z / 24)).toFixed(2)}; }`).join(" ");
const START = PATH[0] ?? { x: 0, z: 0 };
const STYLES = `
@keyframes isometric61-fly { 0% { transform: translate(${(START.x * C).toFixed(1)}px, ${(START.x * S).toFixed(1)}px); opacity: 0; } ${FLY} 100% { transform: translate(${(START.x * C).toFixed(1)}px, ${(START.x * S).toFixed(1)}px); opacity: 0; } }
@property --isometric61-p { syntax: "<angle>"; inherits: true; initial-value: 0deg; }
@keyframes isometric61-pitch { 0% { --isometric61-p: 0deg; } ${PITCH} 100% { --isometric61-p: 0deg; } }
@keyframes isometric61-shadow { 0% { transform: translateX(${START.x.toFixed(1)}px); opacity: 0; } ${SHADE} 100% { transform: translateX(${START.x.toFixed(1)}px); opacity: 0; } }
.isometric61-plane { animation: isometric61-fly 7s linear infinite, isometric61-pitch 7s linear infinite; will-change: transform, opacity; }
.isometric61-pitch { transform: rotate(var(--isometric61-p)); transform-origin: ${PIVOT.x}px ${-PIVOT.z}px; }
${[...WING_LAYERS.map((z, index) => `.isometric61-wing${index} { transform: ${level(z)}; }`), ...TAIL_LAYERS.map((z, index) => `.isometric61-tail${index} { transform: ${level(z)}; }`)].join("\n")}
.isometric61-shadow { animation: isometric61-shadow 7s linear infinite; }
.isometric61-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric61-plane, .isometric61-shadow { animation: none; } }
`;

function Slice({ off, body, trim, outline }: { off: number; body: Paint; trim: Paint; outline?: boolean }) {
  const part = cut(off);
  const tubeRect = { x: TX + (R - part.tube), y: -(AXIS + part.tube), width: 78 - 2 * (R - part.tube), height: 2 * part.tube, rx: part.tube };
  const shade = off < 0 ? "right" : "left";
  return (
    <g transform={onLeft(CY + off)}>
      <g className="isometric61-pitch">
        {outline ? (
          part.tube > 0 && <rect {...tubeRect} fill="none" strokeWidth={2} className={body.edge} />
        ) : (
          <>
            {part.nose && <rect x={TX + 62} y={-12} width={4} height={4} className={body.ink} />}
            {part.main && <rect x={TX + 36} y={-12} width={4} height={4} className={body.ink} />}
            {part.tube > 0 && (
              <>
                <rect {...tubeRect} className={body.base} />
                {off < 3 && <rect {...tubeRect} className={off < -2 ? body.right : body.left} />}
              </>
            )}
            {part.fin && (
              <>
                <path d={FIN} className={trim.base} />
                <path d={FIN} className={off === 2 ? trim.left : trim.right} />
              </>
            )}
            {part.glass && part.tube > 0 && <rect x={TX + 63} y={-(AXIS + part.tube) - 0.2} width={8} height={2.4} rx={1} className={body.ink} />}
            {off === 6 && WINDOWS.map((x) => <rect key={x} x={x} y={-(AXIS + 3.5)} width={3} height={4} rx={1.5} className={body.ink} />)}
          </>
        )}
      </g>
    </g>
  );
}

export function Isometric61({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric61Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);

  const trim = paint.accent;
  const sheets = (side: 1 | -1) =>
    [
      ...WING_LAYERS.map((z, index) => ({ key: `w${z}`, name: `isometric61-wing${index}`, points: sheet(WING, side), top: index === WING_LAYERS.length - 1 })),
      ...TAIL_LAYERS.map((z, index) => ({ key: `t${z}`, name: `isometric61-tail${index}`, points: sheet(TAIL, side), top: index === TAIL_LAYERS.length - 1 })),
    ].map((layer) => (
      <g key={layer.key} className={cn(layer.name, trim.edge)} strokeWidth={1} strokeLinejoin="round">
        <polygon points={layer.points} className={trim.base} stroke={layer.top ? undefined : "none"} />
        {!layer.top && <polygon points={layer.points} className={side === 1 ? trim.left : trim.right} stroke="none" />}
      </g>
    ));
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric61-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-84 -88 252 212" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={GROUND} paint={paint.body} />
        <g transform={onTop(8)}>
          <rect x={4} y={12} width={144} height={56} rx={2} className={paint.body.ink} />
          {DASHES.map((x) => (
            <rect key={x} x={x} y={CY - 2} width={12} height={4} rx={1} className={paint.body.base} />
          ))}
          {[18, 24, 30, 46, 52, 58].map((y) => (
            <rect key={y} x={8} y={y} width={12} height={2} className={paint.body.base} />
          ))}
          {LIGHTS.map((x) => (
            <g key={x} className={paint.body.ink}>
              <circle cx={x} cy={6} r={1.5} />
              <circle cx={x} cy={74} r={1.5} />
            </g>
          ))}
          <g className="isometric61-shadow">
            <ellipse cx={TX + 40} cy={CY} rx={34} ry={7} className={paint.body.ink} />
            <ellipse cx={TX + 38} cy={CY} rx={8} ry={40} className={paint.body.ink} />
          </g>
        </g>
        {TOWER.map((faces, index) => (
          <Block key={index} faces={faces} paint={paint.body} />
        ))}
        <g transform={onLeft(-8)} className={paint.body.ink}>
          <rect x={6} y={-58} width={16} height={6} rx={1} />
        </g>
        <g transform={onRight(24)} className={paint.body.ink}>
          <rect x={-26} y={-58} width={16} height={6} rx={1} />
        </g>
        <g className="isometric61-plane">
          {sheets(-1)}
          {SLICES.filter((off) => Math.abs(off) < R).map((off) => (
            <Slice key={off} off={off} body={paint.body} trim={paint.accent} outline />
          ))}
          {SLICES.map((off) => (
            <Slice key={off} off={off} body={paint.body} trim={paint.accent} />
          ))}
          {sheets(1)}
        </g>
      </svg>
    </div>
  );
}
