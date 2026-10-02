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

interface Isometric36Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the sold plate and the lit windows with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric36Demo: Isometric36Props = {
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

const W = 64;
const D = 56;
const BASE = 6;
const EAVE = BASE + 40;
const RIDGE = EAVE + 26;
const O = 4;
const DOOR = { x: 25, w: 14, h: 27 };
const FRONT_WINDOWS = [7, 45];
const SIDE_WINDOW = 20;
const PANE = { w: 12, h: 14, z: BASE + 14 };
const CHIMNEY = { x: 42, y: 10 };

// The sign stands on the lawn at the front right corner: a post, an arm, a hanging board and the sold plate under it
const SIGN = { x: 72, w: 28, y: 100, post: 101, top: BASE + 40 };
const BOARD = { z: BASE + 19, h: 15 };
const HOOK_Z = BOARD.z - 2;
const PLATE = { h: 12 };
const PERIOD = 7;

const screen = (x: number, y: number, z: number) => [(x - y) * C, (x + y) * S - z] as const;
const [PLATE_X, PLATE_Y] = screen(SIGN.x, SIGN.y + 0.4, HOOK_Z);
// The plate hangs from the hook line, which runs along x: its width keeps the x direction, its drop turns with the swing
const PLATE_MATRIX = `matrix(${C}, ${S}, calc(${-C} * var(--isometric36-s)), calc(${S} * var(--isometric36-s) + var(--isometric36-c)), ${PLATE_X.toFixed(2)}, ${PLATE_Y.toFixed(2)})`;
// Let go at 115 degrees, it drops past plumb and swings out in ever smaller arcs: [percent, degrees] at each turning point
const TURNS: [number, number][] = [[10, 115], [22, -20], [30, 12], [37, -6], [43, 3], [48, 0]];
const SWING = TURNS.slice(1).flatMap(([end, to], index) => {
  const [start, from] = TURNS[index] ?? [end, to];
  return Array.from({ length: 6 }, (_, step) => {
    const k = (step + 1) / 6;
    return [start + (end - start) * k, from + ((to - from) * (1 - Math.cos(Math.PI * k))) / 2] as const;
  });
});
const pose = (degrees: number) => `--isometric36-c: ${Math.cos((degrees * Math.PI) / 180).toFixed(4)}; --isometric36-s: ${Math.sin((degrees * Math.PI) / 180).toFixed(4)};`;
const light = (index: number) =>
  `@keyframes isometric36-light${index} { 0%, ${50 + index * 6}% { opacity: 0; } ${55 + index * 6}%, 88% { opacity: 1; } 95%, 100% { opacity: 0; } }\n.isometric36-light${index} { animation: isometric36-light${index} ${PERIOD}s ease-in-out infinite; }`;
const puff = (index: number) => {
  const at = 60 + index * 8;
  return `@keyframes isometric36-puff${index} { 0%, ${at}% { transform: translate(0, 0) scale(0.6); opacity: 0; } ${at + 3}% { opacity: 0.8; } ${at + 22}%, 100% { transform: translate(7px, -20px) scale(1.5); opacity: 0; } }\n.isometric36-puff${index} { animation: isometric36-puff${index} ${PERIOD}s ease-out infinite; transform-box: fill-box; transform-origin: center; }`;
};

const STYLES = `
@property --isometric36-c { syntax: "<number>"; inherits: true; initial-value: 1; }
@property --isometric36-s { syntax: "<number>"; inherits: true; initial-value: 0; }
@keyframes isometric36-swing { 0%, 10% { ${pose(115)} } ${SWING.map(([at, degrees]) => `${at.toFixed(2)}% { ${pose(degrees)} }`).join(" ")} 97% { ${pose(0)} } 98%, 100% { ${pose(115)} } }
@keyframes isometric36-hang { 0%, 3% { opacity: 0; } 9%, 90% { opacity: 1; } 96%, 100% { opacity: 0; } }
.isometric36-plate { transform: ${PLATE_MATRIX}; animation: isometric36-swing ${PERIOD}s linear infinite, isometric36-hang ${PERIOD}s linear infinite; }
${[0, 1, 2].map(light).join("\n")}
${[0, 1, 2].map(puff).join("\n")}
.isometric36-still * { animation: none !important; }
.isometric36-still .isometric36-rest { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .isometric36-plate, .isometric36-light0, .isometric36-light1, .isometric36-light2, .isometric36-puff0, .isometric36-puff1, .isometric36-puff2 { animation: none; } .isometric36-rest { opacity: 1; } }
`;

const ROOF_BACK = polygon([[-O, -O, EAVE], [W + O, -O, EAVE], [W + O, D / 2, RIDGE], [-O, D / 2, RIDGE]]);
const ROOF_FRONT = polygon([[-O, D / 2, RIDGE], [W + O, D / 2, RIDGE], [W + O, D + O, EAVE], [-O, D + O, EAVE]]);
const FASCIA = polygon([[-O, D + O, EAVE], [W + O, D + O, EAVE], [W + O, D + O, EAVE - 3], [-O, D + O, EAVE - 3]]);
const GABLE_EDGE = polygon([[W + O, -O, EAVE], [W + O, D / 2, RIDGE], [W + O, D + O, EAVE], [W + O, D + O, EAVE - 3], [W + O, D / 2, RIDGE - 3], [W + O, -O, EAVE - 3]]);
const GABLE = polygon([[W, 0, EAVE], [W, D / 2, RIDGE - 2], [W, D, EAVE]]);
const RIDGE_CAP = polygon([[-O, D / 2 - 1.5, RIDGE - 0.6], [W + O, D / 2 - 1.5, RIDGE - 0.6], [W + O, D / 2 + 1.5, RIDGE - 0.6], [-O, D / 2 + 1.5, RIDGE - 0.6]]);
const [SMOKE_X, SMOKE_Y] = screen(CHIMNEY.x + 4, CHIMNEY.y + 4, RIDGE + 12);

export function Isometric36({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric36Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const sold = paint.accent;
  const glow = accent ? sold.base : body.base;
  const lettering = !accent ? body.ink : palette === "tone" ? "fill-current" : "fill-white";
  const line = body.ink.replace("fill-", "stroke-");

  /** A framed window in face units (across, -z): sash, dark pane, the warm light, then the glazing bars. */
  const pane = (across: number, index: number) => (
    <g key={across}>
      <rect x={across - 1.5} y={-PANE.z - PANE.h - 1.5} width={PANE.w + 3} height={PANE.h + 3} rx={1.5} className={body.base} />
      <rect x={across - 1.5} y={-PANE.z - PANE.h - 1.5} width={PANE.w + 3} height={PANE.h + 3} rx={1.5} fill="none" strokeWidth={0.75} className={line} />
      <rect x={across} y={-PANE.z - PANE.h} width={PANE.w} height={PANE.h} rx={1} className={body.ink} />
      <rect x={across} y={-PANE.z - PANE.h} width={PANE.w} height={PANE.h} rx={1} className={cn(`isometric36-light${index} isometric36-rest opacity-0`, glow)} />
      <rect x={across + PANE.w / 2 - 0.5} y={-PANE.z - PANE.h} width={1} height={PANE.h} className={body.base} />
      <rect x={across} y={-PANE.z - PANE.h / 2 - 0.5} width={PANE.w} height={1} className={body.base} />
    </g>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric36-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-106 -84 212 198" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(-10, -10, 0, W + 56, D + 60, BASE, 16)} paint={body} />
        <g transform={onTop(BASE)} className={body.ink}>
          <rect x={DOOR.x + 1} y={D + 5} width={DOOR.w - 2} height={40} rx={2} />
          <ellipse cx={8} cy={D + 18} rx={9} ry={6} />
          <ellipse cx={54} cy={D + 22} rx={10} ry={6} />
        </g>
        <Block faces={box(0, 0, BASE, W, D, EAVE - BASE)} paint={body} />
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={GABLE} className={body.base} />
          <polygon points={GABLE} className={body.right} stroke="none" />
          <polygon points={ROOF_BACK} className={body.base} />
        </g>
        <Block faces={box(CHIMNEY.x, CHIMNEY.y, RIDGE - 16, 8, 8, 24)} paint={body} />
        <Block faces={box(CHIMNEY.x - 1, CHIMNEY.y - 1, RIDGE + 8, 10, 10, 2)} paint={body} />
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={ROOF_FRONT} className={body.base} />
          <polygon points={ROOF_FRONT} className={body.left} stroke="none" />
          <polygon points={RIDGE_CAP} className={body.ink} stroke="none" />
          <polygon points={FASCIA} className={body.base} />
          <polygon points={FASCIA} className={body.left} stroke="none" />
          <polygon points={GABLE_EDGE} className={body.base} />
          <polygon points={GABLE_EDGE} className={body.right} stroke="none" />
        </g>
        {[0, 1, 2].map((index) => (
          <circle key={index} cx={SMOKE_X} cy={SMOKE_Y} r={3} className={cn(`isometric36-puff${index} opacity-0`, body.ink)} />
        ))}
        <g transform={onLeft(D)}>
          {FRONT_WINDOWS.map((across, index) => pane(across, index))}
          <rect x={DOOR.x - 1.5} y={-BASE - DOOR.h - 1.5} width={DOOR.w + 3} height={DOOR.h + 1.5} rx={1.5} className={body.base} />
          <rect x={DOOR.x - 1.5} y={-BASE - DOOR.h - 1.5} width={DOOR.w + 3} height={DOOR.h + 1.5} rx={1.5} fill="none" strokeWidth={0.75} className={line} />
          <rect x={DOOR.x} y={-BASE - DOOR.h} width={DOOR.w} height={DOOR.h} rx={1} className={body.ink} />
          <rect x={DOOR.x + 2.5} y={-BASE - DOOR.h + 2.5} width={DOOR.w - 5} height={8} rx={1} className={body.ink} />
          <circle cx={DOOR.x + DOOR.w - 3} cy={-BASE - 12} r={1.4} className={body.base} />
        </g>
        <g transform={onRight(W)}>{pane(SIDE_WINDOW, 2)}</g>
        {FRONT_WINDOWS.map((across) => (
          <Block key={across} faces={box(across - 2, D, PANE.z - 3, PANE.w + 4, 2, 1.5)} paint={body} />
        ))}
        <Block faces={box(W, SIDE_WINDOW - 2, PANE.z - 3, 2, PANE.w + 4, 1.5)} paint={body} />
        <Block faces={box(DOOR.x - 3, D, BASE, DOOR.w + 6, 6, 2)} paint={body} />
        <Block faces={box(10, D + 26, BASE, 2, 2, 11)} paint={body} />
        <Block faces={box(7, D + 24.5, BASE + 11, 8, 5, 5)} paint={body} />
        <g transform={onLeft(D + 29.5)} className={body.ink}>
          <rect x={8.5} y={-(BASE + 14.5)} width={5} height={1.5} rx={0.75} />
        </g>
        <Block faces={box(SIGN.x, SIGN.y - 1.5, BOARD.z, SIGN.w, 1.5, BOARD.h)} paint={body} />
        <g transform={onLeft(SIGN.y)} className={body.ink}>
          {[4, SIGN.w - 6].map((across) => (
            <rect key={across} x={SIGN.x + across} y={-(BOARD.z + BOARD.h + 3)} width={2} height={3.5} rx={0.5} />
          ))}
          <text x={SIGN.x + SIGN.w / 2} y={-(BOARD.z + 8.6)} textAnchor="middle" fontSize={6} fontWeight={700}>
            FOR
          </text>
          <text x={SIGN.x + SIGN.w / 2} y={-(BOARD.z + 2.4)} textAnchor="middle" fontSize={6} fontWeight={700}>
            SALE
          </text>
          {[5, SIGN.w - 7].map((across) => (
            <rect key={across} x={SIGN.x + across} y={-BOARD.z} width={2} height={2.6} rx={0.5} />
          ))}
        </g>
        {/* The plate turns about the hook line; its own plane carries the lettering */}
        <g className="isometric36-plate">
          <rect width={SIGN.w} height={PLATE.h} rx={1.2} className={sold.base} />
          <rect y={PLATE.h - 1.4} width={SIGN.w} height={1.4} rx={0.7} className={sold.right} />
          <text x={SIGN.w / 2} y={9.3} textAnchor="middle" fontSize={8.5} fontWeight={800} className={lettering}>
            SOLD
          </text>
        </g>
        <Block faces={box(SIGN.post, SIGN.y - 3, BASE, 3, 3, SIGN.top - BASE)} paint={body} />
        <Block faces={box(SIGN.x - 3, SIGN.y - 3, SIGN.top - 5, SIGN.post - SIGN.x + 6, 3, 3)} paint={body} />
      </svg>
    </div>
  );
}
