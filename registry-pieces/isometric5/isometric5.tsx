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

interface Isometric5Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the app that gets the notification with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric5Demo: Isometric5Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const PHONE_W = 96;
const PHONE_D = 180;
const PHONE_H = 10;
const TILE = 20;
const TILE_H = 3;
const COLS = [12, 38, 64];
const ROWS = [26, 54, 82, 110];
const DOCK_Y = 144;
const HOVER = 38;
const PERIOD = 8;
// The app that lifts off the screen: middle column, second row
const PICK = { col: 1, row: 1 };
const TILES = ROWS.flatMap((y, row) => COLS.map((x, col) => ({ x, y, col, row, glyph: row * COLS.length + col })));
const DOCK = COLS.map((x, col) => ({ x, y: DOCK_Y, col, row: 5, glyph: 12 + col }));

// A thin bezel: the phone outline minus the screen
const SCREEN = `M18 0h${PHONE_W - 36}a18 18 0 0 1 18 18v${PHONE_D - 36}a18 18 0 0 1 -18 18h${-(PHONE_W - 36)}a18 18 0 0 1 -18 -18v${-(PHONE_D - 36)}a18 18 0 0 1 18 -18ZM17 5h${PHONE_W - 34}a12 12 0 0 1 12 12v${PHONE_D - 34}a12 12 0 0 1 -12 12h${-(PHONE_W - 34)}a12 12 0 0 1 -12 -12v${-(PHONE_D - 34)}a12 12 0 0 1 12 -12Z`;

const STYLES = `
@keyframes isometric5-land { 0% { transform: translateY(-14px); opacity: 0; } 5% { transform: translateY(0); opacity: 1; } 7% { transform: translateY(-2px); } 9%, 93% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(0); opacity: 0; } }
@keyframes isometric5-shade { 0% { opacity: 0; } 5%, 93% { opacity: 1; } 100% { opacity: 0; } }
@keyframes isometric5-pick { 0% { transform: translateY(-14px); opacity: 0; } 5% { transform: translateY(0); opacity: 1; } 7% { transform: translateY(-2px); } 9%, 28% { transform: translateY(0); } 32% { transform: translateY(1.5px); } 36% { transform: translateY(0); animation-timing-function: cubic-bezier(0.3, 0, 0.2, 1); } 50%, 76% { transform: translateY(${-HOVER}px); animation-timing-function: cubic-bezier(0.5, 0, 0.6, 1); } 88% { transform: translateY(0); } 90% { transform: translateY(-1.5px); } 92%, 93% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(0); opacity: 0; } }
@keyframes isometric5-slot { 0% { opacity: 0; } 5%, 36% { opacity: 1; } 50%, 76% { opacity: 0.45; } 88%, 93% { opacity: 1; } 100% { opacity: 0; } }
@keyframes isometric5-badge { 0%, 50% { transform: scale(0); } 54% { transform: scale(1.25); } 58%, 100% { transform: scale(1); } }
.isometric5-land { animation: isometric5-land ${PERIOD}s ease-out infinite; }
.isometric5-shade { animation: isometric5-shade ${PERIOD}s ease-out infinite; }
.isometric5-pick { animation: isometric5-pick ${PERIOD}s ease-out infinite; will-change: transform; }
.isometric5-slot { animation: isometric5-slot ${PERIOD}s ease-in-out infinite; }
.isometric5-badge { animation: isometric5-badge ${PERIOD}s ease-out infinite; transform-box: fill-box; transform-origin: center; }
.isometric5-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric5-land, .isometric5-shade, .isometric5-pick, .isometric5-slot, .isometric5-badge { animation: none; } }
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

/** A simple mark inked on top of an app tile, in the tile's own 20 by 20 units. */
function Glyph({ kind }: { kind: number }) {
  switch (kind % 8) {
    case 0:
      return <circle cx={10} cy={10} r={5} />;
    case 1:
      return (
        <>
          <rect x={5} y={6} width={10} height={2.5} rx={1.25} />
          <rect x={5} y={11.5} width={7} height={2.5} rx={1.25} />
        </>
      );
    case 2:
      return <path d="M7 5.5L15 10L7 14.5Z" />;
    case 3:
      return <path fillRule="evenodd" d="M10 4.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 1 0 0 -11ZM10 7.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 1 1 0 -5Z" />;
    case 4:
      return (
        <>
          <rect x={5} y={10} width={2.5} height={5} rx={1} />
          <rect x={8.75} y={7} width={2.5} height={8} rx={1} />
          <rect x={12.5} y={5} width={2.5} height={10} rx={1} />
        </>
      );
    case 5:
      return <rect x={5.5} y={5.5} width={9} height={9} rx={2.5} />;
    case 6:
      return <path d="M10 15.5C5 12 4.5 9 6 7.2C7.4 5.6 9.3 6.1 10 7.6C10.7 6.1 12.6 5.6 14 7.2C15.5 9 15 12 10 15.5Z" />;
    default:
      return (
        <>
          <circle cx={7} cy={7} r={2} />
          <circle cx={13} cy={7} r={2} />
          <circle cx={7} cy={13} r={2} />
          <circle cx={13} cy={13} r={2} />
        </>
      );
  }
}

export function Isometric5({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric5Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const top = PHONE_H;
  const picked = TILES.find((tile) => tile.col === PICK.col && tile.row === PICK.row) ?? { x: 0, y: 0, col: 0, row: 0, glyph: 0 };
  const rest = [...TILES.filter((tile) => tile !== picked), ...DOCK];
  const wave = (tile: { col: number; row: number }) => ({ animationDelay: `${((tile.col + tile.row) * 0.07).toFixed(2)}s` });
  const tile = (item: { x: number; y: number; glyph: number }, surface: Paint) => (
    <>
      <RoundBlock shape={roundBox(item.x, item.y, top, TILE, TILE, TILE_H, 6)} paint={surface} />
      <g transform={`${onTop(top + TILE_H)} translate(${item.x} ${item.y})`} className={surface.ink}>
        <Glyph kind={item.glyph} />
      </g>
    </>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric5-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-170 -80 266 232" aria-hidden="true" className="size-full overflow-visible">
        <RoundBlock shape={roundBox(0, 0, 0, PHONE_W, PHONE_D, PHONE_H, 18)} paint={body} />
        <RoundBlock shape={roundBox(PHONE_W - 1, 44, 3, 2, 22, 4, 1)} paint={body} />
        <g transform={onTop(top)} className={body.ink}>
          <path d={SCREEN} fillRule="evenodd" />
          <rect x={PHONE_W / 2 - 14} y={11} width={28} height={5} rx={2.5} />
          <rect x={8} y={DOCK_Y - 5} width={PHONE_W - 16} height={TILE + 10} rx={11} />
          {/* Contact shadows: each sits just past its tile's near edges and appears as the tile lands */}
          {rest.map((item) => (
            <rect key={`${item.x}-${item.y}`} x={item.x + 1.5} y={item.y + 1.5} width={TILE} height={TILE} rx={6} className="isometric5-shade" style={wave(item)} />
          ))}
          <rect x={picked.x + 1.5} y={picked.y + 1.5} width={TILE} height={TILE} rx={6} className="isometric5-slot" />
        </g>
        {rest.map((item) => (
          <g key={`${item.x}-${item.y}`} className="isometric5-land" style={wave(item)}>
            {tile(item, body)}
          </g>
        ))}
        <g className="isometric5-pick">
          {tile(picked, paint.accent)}
          <g className="isometric5-badge">
            <RoundBlock shape={roundBox(picked.x + TILE - 7, picked.y - 4, top + TILE_H, 11, 11, 2, 5.5)} paint={accent ? body : paint.accent} />
            <g transform={onTop(top + TILE_H + 2)} className={accent ? "fill-current" : body.ink}>
              <circle cx={picked.x + TILE - 1.5} cy={picked.y + 1.5} r={2.2} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
