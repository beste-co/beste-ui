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

interface Isometric130Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the tool tray with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric130Demo: Isometric130Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const BASE = 6;
const X0 = 12;
const Y0 = 16;
const W = 72;
const D = 36;
const H = 26;
const RIM = BASE + H;
const T = 3;
const TRAY = RIM + 2;
const LID = 6;
const RISE = 30;
const MID = Y0 + D / 2;
const PERIOD = 7;

type Vec = [number, number, number];
const screen = ([x, y, z]: Vec) => [(x - y) * C, (x + y) * S - z] as const;
/** A CSS/SVG matrix that draws local (u, v) onto the plane through o spanned by a and b. */
function frame(o: Vec, a: Vec, b: Vec) {
  const [e, f] = screen(o);
  const [m0, m1] = screen(a);
  const [m2, m3] = screen(b);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(", ")})`;
}
const ACROSS: Vec = [1, 0, 0];
/** Every lid and handle face with the lid turned about its back edge by an angle in degrees. */
function lidFrames(angle: number) {
  const t = (angle * Math.PI) / 180;
  const along: Vec = [0, Math.cos(t), Math.sin(t)];
  const out: Vec = [0, -Math.sin(t), Math.cos(t)];
  const at = (x: number, u: number, m: number): Vec => [X0 + x, Y0 + along[1] * u + out[1] * m, RIM + along[2] * u + out[2] * m];
  return {
    outer: frame(at(0, 0, LID), ACROSS, along),
    inner: frame(at(0, 0, 0), ACROSS, along),
    end: frame(at(0, D, 0), ACROSS, out),
    side: frame(at(W, 0, 0), along, out),
    bartop: frame(at(0, 0, LID + 10), ACROSS, along),
    barunder: frame(at(0, 0, LID + 6), ACROSS, along),
    grip: frame(at(0, 20, LID), ACROSS, out),
    posta: frame(at(26, 16, LID), along, out),
    postb: frame(at(W - 22, 16, LID), along, out),
  };
}
type Face = keyof ReturnType<typeof lidFrames>;
// The lid swings past upright and leans back on its hinge
const REST = 105;
const OPEN = lidFrames(REST);
const FACES = Object.keys(OPEN) as Face[];
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const unease = (r: number) => (r < 0.5 ? Math.sqrt(r / 2) : 1 - Math.sqrt((1 - r) / 2));
// The lid swings open from 8% to 28% and shut from 78% to 96%, in small even steps so the turn stays smooth
const KS = [...Array.from({ length: 23 }, (_, index) => (index + 1) / 24), unease(44 / REST), unease(46 / REST)].sort((a, b) => a - b);
const STOPS: [number, number][] = [
  [0, 0],
  [8, 0],
  ...KS.map((k): [number, number] => [8 + k * 20, REST * ease(k)]),
  [28, REST],
  [78, REST],
  ...KS.map((k): [number, number] => [78 + k * 18, REST * (1 - ease(k))]),
  [96, 0],
  [100, 0],
];
const n = (value: number) => value.toFixed(4);
/** A number that depends on the lid angle: k + c * cos + s * sin, written for calc(). */
const mix = (k: number, c: number, s: number) => `calc(${n(k)} + ${n(c)} * var(--isometric130-c) + ${n(s)} * var(--isometric130-s))`;
type Axis = "across" | "along" | "out";
// Screen directions of the lid's own axes as [k, cos, sin] parts for x and y
const AXES: Record<Axis, [[number, number, number], [number, number, number]]> = {
  across: [[C, 0, 0], [S, 0, 0]],
  along: [[0, -C, 0], [0, S, -1]],
  out: [[0, 0, C], [0, -1, -S]],
};
/** The matrix of a face at lid position (x, u, m) spanned by two lid axes; it follows cos and sin, so shared edges cannot drift apart. */
function face(x: number, u: number, m: number, a: Axis, b: Axis) {
  const [e, f] = screen([X0, Y0, RIM]);
  const [ax, ay] = AXES[a];
  const [bx, by] = AXES[b];
  return `matrix(${mix(...ax)}, ${mix(...ay)}, ${mix(...bx)}, ${mix(...by)}, ${mix(e + x * C, -u * C, m * C)}, ${mix(f + x * S, u * S - m, -u - m * S)})`;
}
const FACE_CSS: Record<Face, string> = {
  outer: face(0, 0, LID, "across", "along"),
  inner: face(0, 0, 0, "across", "along"),
  end: face(0, D, 0, "across", "out"),
  side: face(W, 0, 0, "along", "out"),
  bartop: face(0, 0, LID + 10, "across", "along"),
  barunder: face(0, 0, LID + 6, "across", "along"),
  grip: face(0, 20, LID, "across", "out"),
  posta: face(26, 16, LID, "along", "out"),
  postb: face(W - 22, 16, LID, "along", "out"),
};
const TURN = STOPS.map(([p, a]) => `${p.toFixed(2)}% { --isometric130-c: ${n(Math.cos((a * Math.PI) / 180))}; --isometric130-s: ${n(Math.sin((a * Math.PI) / 180))}; }`).join(" ");
// The top of the lid shows below 45 degrees, its underside above
const show = (above: boolean) => STOPS.map(([p, a], index) => `${p.toFixed(2)}% { opacity: ${(a < 45 && (STOPS[index + 1]?.[1] ?? a) < 45) === above ? 1 : 0}; }`).join(" ");
const STYLES = `
@property --isometric130-c { syntax: "<number>"; inherits: true; initial-value: ${n(Math.cos((REST * Math.PI) / 180))}; }
@property --isometric130-s { syntax: "<number>"; inherits: true; initial-value: ${n(Math.sin((REST * Math.PI) / 180))}; }
@keyframes isometric130-lid { ${TURN} }
@keyframes isometric130-above { ${show(true)} }
@keyframes isometric130-below { ${show(false)} }
@keyframes isometric130-rise { 0%, 30% { transform: translateY(${RISE}px); } 44%, 62% { transform: translateY(0); } 72%, 100% { transform: translateY(${RISE}px); } }
.isometric130-lid { animation: isometric130-lid ${PERIOD}s linear infinite; }
${FACES.map((name) => `.isometric130-${name} { transform: ${FACE_CSS[name]}; }`).join("\n")}
.isometric130-above { animation: isometric130-above ${PERIOD}s step-end infinite; }
.isometric130-below { animation: isometric130-below ${PERIOD}s step-end infinite; }
.isometric130-rise { animation: isometric130-rise ${PERIOD}s cubic-bezier(0.3, 0, 0.3, 1) infinite; }
@keyframes isometric130-under { ${STOPS.map(([p, a], index) => `${p.toFixed(2)}% { opacity: ${a < 45 && (STOPS[index + 1]?.[1] ?? a) < 45 && (a > 0 || (STOPS[index + 1]?.[1] ?? a) > 0) ? 1 : 0}; }`).join(" ")} }
.isometric130-under { animation: isometric130-under ${PERIOD}s step-end infinite; }
.isometric130-rise2 { animation-delay: 0.15s; }
.isometric130-rise3 { animation-delay: 0.3s; }
.isometric130-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric130-lid, .isometric130-part, .isometric130-rise, .isometric130-under { animation: none; } }
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

const SPANNER = (x: number, z: number) =>
  `M${x - 2} ${-z}V${-z - 22}A6 6 0 1 1 ${x + 2} ${-z - 22}V${-z}A2 2 0 0 1 ${x - 2} ${-z}Z`;

/** Everything above the tray inside one tool's slot, so the tool sinks into its own hole. */
function column(x0: number, y0: number, x1: number, y1: number) {
  const [lx, ly] = project([x0, y1, TRAY]).split(",").map(Number) as [number, number];
  const [fx, fy] = project([x1, y1, TRAY]).split(",").map(Number) as [number, number];
  const [rx, ry] = project([x1, y0, TRAY]).split(",").map(Number) as [number, number];
  return `${lx},${ly} ${fx},${fy} ${rx},${ry} ${rx},${ry - 200} ${lx},${ly - 200}`;
}

export function Isometric130({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric130Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const tray = paint.accent;
  const hole = palette === "dark" ? "fill-black/40" : "fill-black/20";
  const sx = X0 + 18;
  const hx = X0 + 36;
  const wx = X0 + 54;
  const slots = [column(sx - 4.5, MID - 4.5, sx + 4.5, MID + 4.5), column(hx - 3, MID - 9, hx + 3, MID + 9), column(wx - 6.5, MID - 2, wx + 6.5, MID + 2)];
  const part = (face: Face) => ({ className: `isometric130-part isometric130-${face}`, transform: OPEN[face] });
  const plate = (x: number, y: number, w: number, h: number, shade?: string) => (
    <>
      <rect x={x} y={y} width={w} height={h} className={body.base} />
      {shade && <rect x={x} y={y} width={w} height={h} className={shade} stroke="none" />}
    </>
  );

  // The tools, drawn once under the lid for while it still covers them and once over it for when it has swung clear
  const tools = (
    <>
        <g clipPath={`url(#${clipId}-0)`}>
          <g className="isometric130-rise">
            <RoundBlock shape={cylinder(sx, MID, TRAY - 8, 6, 1.5)} paint={body} />
            <RoundBlock shape={cylinder(sx, MID, TRAY - 2, 16, 4)} paint={body} />
            <g transform={onTop(TRAY + 14)}>
              <circle cx={sx} cy={MID} r={2} className={body.ink} />
            </g>
          </g>
        </g>
        <g clipPath={`url(#${clipId}-1)`}>
          <g className="isometric130-rise isometric130-rise2">
            <Block faces={box(hx - 2, MID - 2, TRAY - 8, 4, 4, 30)} paint={body} />
            <Block faces={box(hx - 3, MID - 9, TRAY + 22, 6, 18, 6)} paint={body} />
          </g>
        </g>
        <g clipPath={`url(#${clipId}-2)`}>
          <g className="isometric130-rise isometric130-rise3">
            {[MID - 1, MID, MID + 1].map((y, index) => (
              <g key={y} transform={onLeft(y)} className={index === 2 ? body.edge : undefined} strokeWidth={1}>
                <path d={SPANNER(wx, TRAY - 8)} className={body.base} stroke={index === 2 ? undefined : "none"} vectorEffect="non-scaling-stroke" />
                <path d={SPANNER(wx, TRAY - 8)} className={index === 2 ? body.left : body.right} stroke="none" />
                {index === 2 && <circle cx={wx} cy={-TRAY - 20} r={2.5} className={hole} />}
              </g>
            ))}
          </g>
        </g>
    </>
  );
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric130-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-64 -62 152 148" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          {slots.map((points, index) => (
            <clipPath key={points} id={`${clipId}-${index}`}>
              <polygon points={points} />
            </clipPath>
          ))}
        </defs>
        <Block faces={box(0, 0, 0, 96, 68, BASE)} paint={body} />
        <Block faces={box(X0, Y0, BASE, W, D, H)} paint={body} />
        <g transform={onLeft(Y0 + D)} className={body.ink}>
          <rect x={X0 + 6} y={-RIM + 4} width={W - 12} height={2} rx={1} />
          <rect x={X0 + W / 2 - 10} y={-BASE - 14} width={20} height={8} rx={2} />
        </g>
        {[X0 + 10, X0 + W - 16].map((x) => (
          <Block key={x} faces={box(x, Y0 + D, RIM - 10, 6, 2, 8)} paint={body} />
        ))}
        <Block faces={box(X0 + T, Y0 + T, RIM, W - 2 * T, D - 2 * T, TRAY - RIM)} paint={tray} />
        <g transform={onTop(TRAY)} className={hole}>
          <circle cx={sx} cy={MID} r={4.5} />
          <rect x={hx - 3} y={MID - 9} width={6} height={18} rx={1} />
          <rect x={wx - 6.5} y={MID - 2} width={13} height={4} rx={1} />
        </g>
        <g className="isometric130-under opacity-0">{tools}</g>
        <g className={cn("isometric130-lid", body.edge)} strokeWidth={1} strokeLinejoin="round">
          {/* The handle seen from behind, once the lid has turned past 45 degrees */}
          <g className="isometric130-part isometric130-below">
            <g {...part("barunder")}>{plate(26, 16, W - 52, 4, body.right)}</g>
            <g {...part("posta")}>{plate(0, 0, 4, 6, body.right)}</g>
            <g {...part("grip")}>
              {plate(22, 0, 4, 6, body.left)}
              {plate(W - 26, 0, 4, 6, body.left)}
              {plate(22, 6, W - 44, 4, body.left)}
            </g>
            <g {...part("postb")}>{plate(0, 0, 4, 10, body.right)}</g>
          </g>
          <g className="isometric130-part isometric130-below">
            <g {...part("inner")}>
              {plate(0, 0, W, D, body.left)}
              <rect x={6} y={6} width={W - 12} height={D - 12} rx={2} className={body.ink} stroke="none" />
            </g>
          </g>
          <g className="isometric130-part isometric130-above opacity-0">
            <g {...part("outer")}>{plate(0, 0, W, D)}</g>
          </g>
          <g {...part("end")}>{plate(0, 0, W, LID, body.left)}</g>
          <g {...part("side")}>{plate(0, 0, D, LID, body.right)}</g>
          <g className="isometric130-part isometric130-above opacity-0">
            <g {...part("posta")}>{plate(0, 0, 4, 6, body.right)}</g>
            <g {...part("grip")}>
              {plate(22, 0, 4, 6, body.left)}
              {plate(W - 26, 0, 4, 6, body.left)}
              {plate(22, 6, W - 44, 4, body.left)}
            </g>
            <g {...part("bartop")}>{plate(22, 16, W - 44, 4)}</g>
            <g {...part("postb")}>{plate(0, 0, 4, 10, body.right)}</g>
          </g>
        </g>
        <g className="isometric130-part isometric130-below">{tools}</g>
      </svg>
    </div>
  );
}
