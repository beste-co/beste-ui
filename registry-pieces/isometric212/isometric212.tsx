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

interface Isometric212Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color a detail or two on each page with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric212Demo: Isometric212Props = {
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
// The rack: a long tray the pages stand in, facing the viewer, one pitch apart
const RACK = { x: 14, y: 12, w: 78, d: 84, h: 7 };
const RIM = BASE + RACK.h;
const PAGE = { x: 20, w: 66, h: 84, t: 3.5 };
const PITCH = 22;
const PLACES = 4;
// The front place; the others run back from it
const FRONT = RACK.y + 7 + (PLACES - 1) * PITCH;
// Far enough under the rim that the whole page is inside the rack
const SUNK = PAGE.h + PAGE.t + 2;

const KINDS = ["pricing", "blog", "contact", "gallery", "home"] as const;
type Kind = (typeof KINDS)[number];
// Every page of the loop in the order it stands, back to front: the four already there, then the five that rise
const SHEETS = Array.from({ length: PLACES + KINDS.length }, (_, index) => index - PLACES);

const LEAD = 1;
const STEP = 2;
const PERIOD = LEAD + KINDS.length * STEP + 2;
const at = (step: number) => LEAD + step * STEP;
const shifted = (place: number) => `translate(${(place * PITCH * C).toFixed(2)}px, ${(-place * PITCH * S).toFixed(2)}px)`;
const lifted = (down: boolean) => `translate(0px, ${down ? SUNK : 0}px)`;
const frames = (name: string, points: [number, string][]) =>
  `@keyframes ${name} { ${points.map(([time, value]) => `${((time / PERIOD) * 100).toFixed(2)}% { transform: ${value}; }`).join(" ")} }`;

/** Where a sheet stands before the loop moves anything, and whether it starts inside the rack. */
const rest = (sheet: number) => ({ place: Math.max(0, -1 - sheet), down: sheet >= 0 });

/** One sheet's life: it rises at the front on its own step, moves back a place on each later one, and sinks from the last place. */
function life(sheet: number, index: number) {
  const start = rest(sheet);
  const move: [number, string][] = [[0, shifted(start.place)]];
  let place = start.place;
  for (let step = Math.max(0, sheet + 1); step <= Math.min(KINDS.length - 1, sheet + PLACES - 1); step++) {
    move.push([at(step) + 0.3, shifted(step - 1 - sheet)], [at(step) + 0.9, shifted(step - sheet)]);
    place = step - sheet;
  }
  move.push([PERIOD, shifted(place)]);

  const lift: [number, string][] = [[0, lifted(start.down)]];
  let down = start.down;
  if (sheet >= 0) {
    lift.push([at(sheet) + 0.7, lifted(true)], [at(sheet) + 1.5, lifted(false)]);
    down = false;
  }
  if (sheet + PLACES < KINDS.length) {
    lift.push([at(sheet + PLACES), lifted(false)], [at(sheet + PLACES) + 0.5, lifted(true)]);
    down = true;
  }
  lift.push([PERIOD, lifted(down)]);

  return `${frames(`isometric212-shift${index}`, move)}
${frames(`isometric212-lift${index}`, lift)}
.isometric212-shift${index} { animation: isometric212-shift${index} ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.isometric212-lift${index} { animation: isometric212-lift${index} ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }`;
}

const STYLES = `
${SHEETS.map(life).join("\n")}
.isometric212-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric212-scene * { animation: none !important; } }
`;

// Everything above the front slot: a page moving in it is cut off at the rim
const SLOT = [
  project([PAGE.x - 1, FRONT + PAGE.t, RIM]),
  project([PAGE.x + PAGE.w, FRONT + PAGE.t, RIM]),
  project([PAGE.x + PAGE.w + 1, FRONT, RIM]),
  project([PAGE.x + PAGE.w + 1, FRONT, RIM + 200]),
  project([PAGE.x - 1, FRONT + PAGE.t, RIM + 200]),
].join(" ");

const COLUMNS = [5, 24.5, 44];

/** The layout printed on a page, in face units from its top left corner. */
function Layout({ kind, ink, paper, mark }: { kind: Kind; ink: string; paper: string; mark: string }) {
  return (
    <g className={ink}>
      <circle cx={7.5} cy={8.5} r={1.9} />
      {[14, 23, 32].map((x) => (
        <rect key={`nav-${x}`} x={x} y={7.6} width={6.5} height={1.8} rx={0.9} />
      ))}
      <rect x={49} y={6.2} width={12} height={4.6} rx={2.3} />
      <rect x={5} y={13.4} width={56} height={0.6} />
      {kind === "home" && (
        <>
          <rect x={5} y={18.5} width={25} height={3.8} rx={1.9} />
          <rect x={5} y={24} width={19} height={3.8} rx={1.9} />
          <rect x={5} y={31} width={23} height={1.8} rx={0.9} />
          <rect x={5} y={34.4} width={17} height={1.8} rx={0.9} />
          <rect x={5} y={39.5} width={16} height={5.6} rx={2.8} className={mark} />
          <rect x={34} y={18} width={27} height={27} rx={3} />
          <polygon points="36.5,42.5 43.5,32 48,37.5 52.5,30.5 58.5,42.5" className={paper} />
          <circle cx={54.5} cy={24} r={2.6} className={mark} />
          {COLUMNS.map((x) => (
            <g key={`card-${x}`}>
              <rect x={x} y={51} width={17} height={24} rx={2.5} />
              <circle cx={x + 4.5} cy={56.5} r={2} className={paper} />
              <rect x={x + 2.5} y={62} width={12} height={1.8} rx={0.9} className={paper} />
              <rect x={x + 2.5} y={65.6} width={8} height={1.8} rx={0.9} className={paper} />
            </g>
          ))}
        </>
      )}
      {kind === "pricing" && (
        <>
          <rect x={18} y={18.5} width={30} height={3.8} rx={1.9} />
          <rect x={23} y={24.5} width={20} height={1.8} rx={0.9} />
          {COLUMNS.map((x, column) => {
            const best = column === 1;
            const y = best ? 29.5 : 32;
            const h = best ? 47 : 42;
            return (
              <g key={`plan-${x}`}>
                <rect x={x} y={y} width={17} height={h} rx={2.5} />
                {best && <rect x={x + 4} y={y + 3} width={9} height={2.6} rx={1.3} className={mark} />}
                <rect x={x + 3} y={y + (best ? 9 : 5)} width={8} height={3.4} rx={1.2} className={paper} />
                {[0, 1, 2].map((line) => (
                  <rect key={`line-${line}`} x={x + 3} y={y + (best ? 17 : 13) + line * 4} width={line === 2 ? 7 : 11} height={1.5} rx={0.75} className={paper} />
                ))}
                <rect x={x + 3} y={y + h - 8} width={11} height={4.4} rx={2.2} className={best ? mark : paper} />
              </g>
            );
          })}
        </>
      )}
      {kind === "blog" && (
        <>
          <rect x={5} y={18.5} width={24} height={3.8} rx={1.9} />
          <rect x={5} y={25} width={10} height={3.6} rx={1.8} className={mark} />
          <rect x={17} y={25} width={10} height={3.6} rx={1.8} />
          {[33, 48.5, 64].map((y, row) => (
            <g key={`post-${y}`}>
              <rect x={5} y={y} width={16} height={12} rx={2} />
              <polygon points={`7,${y + 10.5} 11.5,${y + 4.5} 14.5,${y + 8} 16.5,${y + 6} 19,${y + 10.5}`} className={paper} />
              <rect x={24} y={y + 1} width={row === 1 ? 26 : 31} height={2.8} rx={1.4} />
              <rect x={24} y={y + 5.8} width={37} height={1.6} rx={0.8} />
              <rect x={24} y={y + 9} width={25} height={1.6} rx={0.8} />
            </g>
          ))}
          <circle cx={58.5} cy={35.4} r={1.7} className={mark} />
        </>
      )}
      {kind === "contact" && (
        <>
          <rect x={5} y={18.5} width={22} height={3.8} rx={1.9} />
          <rect x={5} y={24.5} width={31} height={1.8} rx={0.9} />
          {[
            [5, 31, 26.5, 7.5],
            [34.5, 31, 26.5, 7.5],
            [5, 42, 56, 7.5],
            [5, 53, 56, 15],
          ].map(([x = 0, y = 0, w = 0, h = 0]) => (
            <g key={`field-${x}-${y}`}>
              <rect x={x} y={y} width={w} height={h} rx={2.2} />
              <rect x={x + 3} y={y + 2.9} width={Math.min(14, w - 12)} height={1.6} rx={0.8} className={paper} />
            </g>
          ))}
          <rect x={5} y={71.5} width={19} height={5.8} rx={2.9} className={mark} />
        </>
      )}
      {kind === "gallery" && (
        <>
          <rect x={5} y={18.5} width={20} height={3.8} rx={1.9} />
          {[5, 16.5, 28].map((x, chip) => (
            <rect key={`chip-${x}`} x={x} y={25} width={9.5} height={3.6} rx={1.8} className={chip === 0 ? mark : undefined} />
          ))}
          {[32.5, 48.5, 64.5].map((y, row) =>
            COLUMNS.map((x, column) => {
              const picked = row === 1 && column === 1;
              return (
                <g key={`tile-${x}-${y}`}>
                  <rect x={x} y={y} width={17} height={13.5} rx={2.2} className={picked ? mark : undefined} />
                  {(row + column) % 2 === 0 ? (
                    <polygon points={`${x + 2},${y + 11.5} ${x + 7},${y + 5} ${x + 10},${y + 8.5} ${x + 12.5},${y + 6} ${x + 15},${y + 11.5}`} className={paper} />
                  ) : (
                    <circle cx={x + 8.5} cy={y + 6.75} r={3} className={paper} />
                  )}
                </g>
              );
            }),
          )}
        </>
      )}
    </g>
  );
}

export function Isometric212({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric212Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const slotId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric212-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-100 -86 198 200" aria-hidden="true" className="isometric212-scene size-full overflow-visible">
        <defs>
          <clipPath id={slotId}>
            <polygon points={SLOT} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 106, 108, BASE, 14)} paint={body} />
        {/* The rack, its floor, and the slots a page rises from and sinks into */}
        <RoundBlock shape={roundBox(RACK.x, RACK.y, BASE, RACK.w, RACK.d, RACK.h, 6)} paint={body} />
        <g transform={onTop(RIM)} className={body.ink}>
          <rect x={PAGE.x - 2} y={FRONT - (PLACES - 1) * PITCH - 2} width={PAGE.w + 4} height={(PLACES - 1) * PITCH + PAGE.t + 4} rx={2} />
          <rect x={PAGE.x - 1} y={FRONT - 0.5} width={PAGE.w + 2} height={PAGE.t + 1} rx={1} />
          <rect x={PAGE.x - 1} y={FRONT - (PLACES - 1) * PITCH - 0.5} width={PAGE.w + 2} height={PAGE.t + 1} rx={1} />
        </g>
        {/* The pages, back to front; each is drawn at the front place and moved from there */}
        {SHEETS.map((sheet, index) => {
          const start = rest(sheet);
          const kind = KINDS[(sheet + KINDS.length) % KINDS.length] ?? "home";
          return (
            <g
              key={`sheet-${sheet}`}
              className={`isometric212-shift${index}`}
              transform={`translate(${(start.place * PITCH * C).toFixed(2)} ${(-start.place * PITCH * S).toFixed(2)})`}
              clipPath={`url(#${slotId})`}
            >
              <g className={`isometric212-lift${index}`} transform={`translate(0 ${start.down ? SUNK : 0})`}>
                <Block faces={box(PAGE.x, FRONT, RIM, PAGE.w, PAGE.t, PAGE.h)} paint={body} />
                <g transform={`${onLeft(FRONT + PAGE.t)} translate(${PAGE.x} ${-(RIM + PAGE.h)})`}>
                  <Layout kind={kind} ink={body.ink} paper={body.base} mark={accent ? mine.base : body.ink} />
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
