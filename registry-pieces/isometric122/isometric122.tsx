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

interface Isometric122Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the moving queen and its target square with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric122Demo: Isometric122Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

// A circle of radius r in plan projects to an ellipse with these radii
const ELLIPSE_X = C * Math.SQRT2;
const ELLIPSE_Y = S * Math.SQRT2;

/** An upright cylinder centered on the origin in plan, shaded in two halves like a box. */
function Cylinder({ r, z, h, paint }: { r: number; z: number; h: number; paint: Paint }) {
  const rx = r * ELLIPSE_X;
  const ry = r * ELLIPSE_Y;
  const top = -z - h;
  const bottom = -z;
  const left = `M${-rx} ${top} L${-rx} ${bottom} A${rx} ${ry} 0 0 0 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 1 ${-rx} ${top} Z`;
  const right = `M${rx} ${top} L${rx} ${bottom} A${rx} ${ry} 0 0 1 0 ${bottom + ry} L0 ${top + ry} A${rx} ${ry} 0 0 0 ${rx} ${top} Z`;
  return (
    <g className={paint.edge} strokeWidth={1} strokeLinejoin="round">
      <path d={left} className={paint.base} />
      <path d={left} className={paint.left} stroke="none" />
      <path d={right} className={paint.base} />
      <path d={right} className={paint.right} stroke="none" />
      <ellipse cx={0} cy={top} rx={rx} ry={ry} className={paint.base} />
    </g>
  );
}
const BOARD = 10;
const SQ = 12;
const RIM = 4;
const SIZE = SQ * 8 + RIM * 2;
const SQUARES = Array.from({ length: 64 }, (_, k) => ({ i: k % 8, j: Math.floor(k / 8) })).filter(({ i, j }) => (i + j) % 2 === 1);
const centre = (i: number, j: number) => [RIM + SQ * i + SQ / 2, RIM + SQ * j + SQ / 2] as const;

type Kind = "pawn" | "rook" | "knight" | "bishop" | "king" | "queen";
const K = 1.2;
const STACK_UNITS: Record<Kind, { r: number; h: number }[]> = {
  pawn: [{ r: 4, h: 2 }, { r: 3, h: 1.5 }, { r: 1.8, h: 6 }, { r: 3, h: 1.5 }],
  rook: [{ r: 4.2, h: 2 }, { r: 3.2, h: 11 }, { r: 4, h: 4 }],
  knight: [{ r: 4.2, h: 2 }, { r: 3.2, h: 1.5 }, { r: 2.6, h: 5 }],
  bishop: [{ r: 4, h: 2 }, { r: 3, h: 1.5 }, { r: 2, h: 10 }, { r: 3, h: 1.5 }],
  king: [{ r: 4.4, h: 2 }, { r: 3.4, h: 1.5 }, { r: 2.4, h: 14 }, { r: 3.6, h: 1.5 }, { r: 2.8, h: 4 }],
  queen: [{ r: 4.4, h: 2 }, { r: 3.4, h: 1.5 }, { r: 2.2, h: 12 }, { r: 3.6, h: 1.5 }, { r: 3, h: 4 }],
};
const BALL_UNITS: Record<Kind, { r: number; z: number }[]> = {
  pawn: [{ r: 3.2, z: 13.5 }],
  rook: [],
  knight: [],
  bishop: [{ r: 3.2, z: 18 }, { r: 1.2, z: 22.5 }],
  king: [],
  queen: [{ r: 1.8, z: 23 }],
};

// Piece proportions are written small and scaled up so they read at card size
const STACKS = Object.fromEntries(Object.entries(STACK_UNITS).map(([kind, parts]) => [kind, parts.map((p) => ({ r: p.r * K, h: p.h * K }))])) as typeof STACK_UNITS;
const BALLS = Object.fromEntries(Object.entries(BALL_UNITS).map(([kind, balls]) => [kind, balls.map((b) => ({ r: b.r * K, z: b.z * K }))])) as typeof BALL_UNITS;

// Files a to h run along i and rank 1 is the near edge, so a1 is a dark square
const at = (square: string) => ({ i: square.charCodeAt(0) - 97, j: 8 - Number(square[1]) });
// A back rank mate: the white queen runs up the open d file from d1 to d8
const FROM = at("d1");
const TO = at("d8");
const WHITE: [Kind, string][] = [["king", "g1"], ["pawn", "a2"], ["pawn", "b2"], ["pawn", "f2"], ["pawn", "g2"], ["pawn", "h2"]];
const BLACK: [Kind, string][] = [["king", "g8"], ["knight", "a5"], ["pawn", "a7"], ["pawn", "b7"], ["pawn", "f7"], ["pawn", "g7"], ["pawn", "h7"]];
const PIECES = [
  ...WHITE.map(([kind, square]) => ({ kind, side: "white" as const, ...at(square) })),
  ...BLACK.map(([kind, square]) => ({ kind, side: "black" as const, ...at(square) })),
  { kind: "queen" as Kind, side: "queen" as const, ...TO },
].sort((a, b) => a.i + a.j - (b.i + b.j));
// The queen is drawn on d8; the loop starts it back on d1
const BACK = (FROM.j - TO.j) * SQ;
const HOME = `${(-BACK * C).toFixed(1)}px, ${(BACK * S).toFixed(1)}px`;
const HOME_UP = `${(-BACK * C).toFixed(1)}px, ${(BACK * S - 10).toFixed(1)}px`;
const STYLES = `
@keyframes isometric122-move {
  0%, 12% { transform: translate(${HOME}); opacity: 1; }
  19% { transform: translate(${HOME_UP}); }
  47% { transform: translate(0, -10px); }
  54%, 84% { transform: translate(0, 0); opacity: 1; }
  89% { transform: translate(0, 0); opacity: 0; }
  90% { transform: translate(${HOME}); opacity: 0; }
  96%, 100% { transform: translate(${HOME}); opacity: 1; }
}
@keyframes isometric122-mark { 0%, 12% { opacity: 0.25; } 54%, 84% { opacity: 1; } 90%, 100% { opacity: 0.25; } }
.isometric122-queen { animation: isometric122-move 7s ease-in-out infinite; }
.isometric122-mark { animation: isometric122-mark 7s ease-in-out infinite; }
.isometric122-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric122-queen, .isometric122-mark { animation: none; } }
`;
// The black side: a dark body whose side shading lightens instead of darkening
const DARK: Record<Palette, Paint> = {
  theme: { base: "fill-foreground", left: "fill-background/10", right: "fill-background/25", edge: "stroke-foreground", ink: "fill-background/30" },
  light: { base: "fill-zinc-800", left: "fill-white/10", right: "fill-black/25", edge: "stroke-zinc-900", ink: "fill-white/30" },
  dark: { base: "fill-zinc-950", left: "fill-white/10", right: "fill-white/5", edge: "stroke-zinc-600", ink: "fill-white/30" },
  tone: { base: "fill-zinc-900", left: "fill-white/10", right: "fill-black/25", edge: "stroke-transparent", ink: "fill-white/30" },
};
function Ball({ r, z, paint }: { r: number; z: number; paint: Paint }) {
  return (
    <g>
      <circle cy={-z} r={r} strokeWidth={1} className={cn(paint.base, paint.edge)} />
      <circle cy={-z} r={r} className={paint.right} />
      <circle cx={-r * 0.18} cy={-z - r * 0.18} r={r * 0.78} className={paint.base} />
    </g>
  );
}

function Piece({ kind, paint }: { kind: Kind; paint: Paint }) {
  let z = 0;
  return (
    <g>
      {STACKS[kind].map((part) => {
        const node = <Cylinder key={z} r={part.r} z={z} h={part.h} paint={paint} />;
        z += part.h;
        return node;
      })}
      {kind === "rook" && (
        <g transform={onTop(z)} className={paint.ink}>
          <rect x={-0.9} y={-4.8} width={1.8} height={9.6} />
          <rect x={-4.8} y={-0.9} width={9.6} height={1.8} />
        </g>
      )}
      {kind === "knight" && (
        <>
          <Block faces={box(-2.6 * K, -3 * K, z, 5.2 * K, 5 * K, 9 * K)} paint={paint} />
          <Block faces={box(-2.2 * K, 2 * K, z + 4 * K, 4.4 * K, 4.5 * K, 4 * K)} paint={paint} />
          <Block faces={box(-0.8 * K, -3.6 * K, z + 9 * K, 1.6 * K, 4 * K, 2 * K)} paint={paint} />
        </>
      )}
      {kind === "king" && (
        <>
          <Block faces={box(-1, -1, z, 2, 2, 8)} paint={paint} />
          <Block faces={box(-3.5, -1, z + 3.5, 7, 2, 2)} paint={paint} />
        </>
      )}
      {BALLS[kind].map((ball) => (
        <Ball key={ball.z} r={ball.r} z={ball.z} paint={paint} />
      ))}
    </g>
  );
}

export function Isometric122({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric122Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const [tx, ty] = centre(TO.i, TO.j);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric122-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-96 -40 192 156" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, SIZE, SIZE, BOARD)} paint={paint.body} />
        <g transform={onTop(BOARD)}>
          <rect x={RIM} y={RIM} width={SQ * 8} height={SQ * 8} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className={paint.body.edge} />
          {SQUARES.map(({ i, j }) => (
            <rect key={`${i}-${j}`} x={RIM + SQ * i} y={RIM + SQ * j} width={SQ} height={SQ} className={paint.body.ink} />
          ))}
          <g className="isometric122-mark">
            <rect x={tx - SQ / 2} y={ty - SQ / 2} width={SQ} height={SQ} className={accent ? cn(paint.accent.base, "opacity-40") : paint.body.ink} />
          </g>
        </g>
        {PIECES.map((piece) => {
          const [px, py] = centre(piece.i, piece.j);
          const queen = piece.side === "queen";
          return (
            <g key={`${piece.i}-${piece.j}`} className={queen ? "isometric122-queen" : undefined}>
              <g transform={`translate(${((px - py) * C).toFixed(1)} ${((px + py) * S - BOARD).toFixed(1)})`}>
                <Piece kind={piece.kind} paint={queen ? paint.accent : piece.side === "black" ? DARK[palette] : paint.body} />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
