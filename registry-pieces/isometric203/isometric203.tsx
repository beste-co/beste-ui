"use client";

import { type ReactNode, useId } from "react";
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

interface Isometric203Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the hero section and the nav button on every screen with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric203Demo: Isometric203Props = {
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
// The monitor stands upright on its neck; its screen is the plane y = MON.y
const MON = { x: 10, y: 24, z: BASE + 16, w: 92, h: 58, t: 4, bezel: 3 };
// The tablet and the phone lean back on their bottom front edge
const LEAN = (16 * Math.PI) / 180;
const SIN = Math.sin(LEAN);
const COS = Math.cos(LEAN);
interface Device {
  x: number;
  y: number;
  w: number;
  tall: number;
  r: number;
  bezel: number;
}
const TABLET: Device = { x: 121, y: 44, w: 42, tall: 60, r: 5, bezel: 3 };
const PHONE: Device = { x: 178, y: 52, w: 24, tall: 50, r: 5, bezel: 2 };
const THICK = 3;
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
/** The matrix that lays local (across, down) units onto a leaning device, `depth` behind its glass, starting `rise` up it. */
function plane(device: Device, depth: number, rise: number, left = 0) {
  const origin: Point = [device.x + left, device.y - SIN * rise - COS * depth, BASE + COS * rise - SIN * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, SIN, -COS]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
const REST = { side: 3, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);

/** A leaning device with its rest behind it and the lip in front; children are drawn on the screen, from its top left corner. */
function Leaning({ device, paint, children }: { device: Device; paint: Paint; children: ReactNode }) {
  const { w, tall, r, bezel } = device;
  const rest = tall * 0.5;
  return (
    <>
      {REST_LAYERS.map((depth, index) => (
        <g key={`rest-${depth}`} transform={plane(device, depth, rest, -REST.side)} className={paint.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
          <rect width={w + 2 * REST.side} height={rest} rx={4} className={paint.base} />
          <rect width={w + 2 * REST.side} height={rest} rx={4} className={index === REST_LAYERS.length - 1 ? paint.left : paint.right} stroke="none" />
        </g>
      ))}
      {LAYERS.map((depth) => (
        <g key={`layer-${depth}`} transform={plane(device, depth, tall)}>
          <rect width={w} height={tall} rx={r} className={paint.base} />
          <rect width={w} height={tall} rx={r} className={paint.right} />
        </g>
      ))}
      <g transform={plane(device, 0, tall)}>
        <rect width={w} height={tall} rx={r} strokeWidth={1} className={cn(paint.base, paint.edge)} />
        <g transform={`translate(${bezel} ${bezel})`}>{children}</g>
      </g>
      <RoundBlock shape={roundBox(device.x - 3, device.y - 1, BASE, w + 6, 5, 4, 2.5)} paint={paint} />
    </>
  );
}

// The visible part of each screen and how far its page scrolls; the lip hides the bottom of the leaning two
const VIEW = {
  desktop: { w: MON.w - 2 * MON.bezel, h: MON.h - 2 * MON.bezel, scroll: 28 },
  tablet: { w: TABLET.w - 2 * TABLET.bezel, h: TABLET.tall - 2 * TABLET.bezel, scroll: 20 },
  phone: { w: PHONE.w - 2 * PHONE.bezel, h: PHONE.tall - 2 * PHONE.bezel, scroll: 18 },
};
type Screen = keyof typeof VIEW;
const SCREENS = Object.keys(VIEW) as Screen[];

const PERIOD = 8;
const STYLES = `
${SCREENS.map((screen) => `@keyframes isometric203-${screen} { 0%, 14% { transform: translateY(0px); } 44%, 58% { transform: translateY(${-VIEW[screen].scroll}px); } 88%, 100% { transform: translateY(0px); } }
.isometric203-${screen} { animation: isometric203-${screen} ${PERIOD}s ease-in-out infinite; }`).join("\n")}
.isometric203-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric203-scene * { animation: none !important; } }
`;

export function Isometric203({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric203Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const hot = accent ? mine.base : body.ink;
  const hotInk = accent ? mine.ink : body.base;

  /** A feature card: icon and two lines. */
  const card = (key: string, x: number, y: number, w: number, h: number) => (
    <g key={key} transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx={2} className={body.ink} />
      <circle cx={h * 0.3} cy={h * 0.32} r={h * 0.14} className={body.base} />
      <rect x={h * 0.56} y={h * 0.22} width={w - h * 0.8} height={h * 0.16} rx={h * 0.08} className={body.base} />
      <rect x={h * 0.18} y={h * 0.62} width={w - h * 0.5} height={h * 0.13} rx={h * 0.065} className={body.base} />
    </g>
  );

  /** The same page laid out for each width: nav, hero, cards in three, two or one column, text and footer. */
  const page = (screen: Screen) => {
    if (screen === "desktop") {
      return (
        <>
          <rect width={86} height={84} className={body.base} />
          <rect x={4} y={3.6} width={11} height={3} rx={1.5} className={body.ink} />
          {[0, 1, 2].map((link) => (
            <rect key={`desktop-link-${link}`} x={44 + link * 8.5} y={4} width={6} height={2.2} rx={1.1} className={body.ink} />
          ))}
          <rect x={72} y={2.6} width={10} height={5} rx={2.5} className={hot} />
          <rect x={4} y={11} width={78} height={22} rx={3} className={hot} />
          <rect x={8} y={15.5} width={28} height={3.4} rx={1.7} className={hotInk} />
          <rect x={8} y={21.4} width={20} height={2.4} rx={1.2} className={hotInk} />
          <rect x={8} y={26} width={11} height={3.8} rx={1.9} className={hotInk} />
          <rect x={52} y={14} width={26} height={16} rx={2} className={hotInk} />
          {[0, 1, 2].map((index) => card(`desktop-card-${index}`, 4 + index * 27, 37, 24, 15))}
          <rect x={4} y={57} width={34} height={3} rx={1.5} className={body.ink} />
          <rect x={4} y={62.4} width={62} height={2} rx={1} className={body.ink} />
          <rect x={4} y={66.4} width={50} height={2} rx={1} className={body.ink} />
          <rect y={73} width={86} height={11} className={body.ink} />
        </>
      );
    }
    if (screen === "tablet") {
      return (
        <>
          <rect width={36} height={80} className={body.base} />
          <rect x={3} y={3.2} width={8} height={2.6} rx={1.3} className={body.ink} />
          <rect x={25} y={2.4} width={8} height={4.2} rx={2.1} className={hot} />
          <rect x={3} y={9.5} width={30} height={17} rx={2.5} className={hot} />
          <rect x={5.5} y={12.5} width={13} height={2.8} rx={1.4} className={hotInk} />
          <rect x={5.5} y={17} width={10} height={2} rx={1} className={hotInk} />
          <rect x={5.5} y={20.6} width={7} height={3} rx={1.5} className={hotInk} />
          <rect x={21} y={12} width={9.5} height={12} rx={1.6} className={hotInk} />
          {card("tablet-card-0", 3, 29.5, 14, 10)}
          {card("tablet-card-1", 19, 29.5, 14, 10)}
          {card("tablet-card-2", 3, 41.5, 30, 10)}
          <rect x={3} y={55} width={18} height={2.6} rx={1.3} className={body.ink} />
          <rect x={3} y={59.6} width={28} height={1.8} rx={0.9} className={body.ink} />
          <rect x={3} y={63} width={22} height={1.8} rx={0.9} className={body.ink} />
          <rect y={69} width={36} height={11} className={body.ink} />
        </>
      );
    }
    return (
      <>
        <rect width={20} height={70} className={body.base} />
        <rect x={2} y={2.6} width={6} height={2.2} rx={1.1} className={body.ink} />
        <rect x={13.5} y={2.2} width={4.5} height={3} rx={1.5} className={hot} />
        <rect x={2} y={7.5} width={16} height={14} rx={2} className={hot} />
        <rect x={4} y={10} width={9} height={2.2} rx={1.1} className={hotInk} />
        <rect x={4} y={13.6} width={7} height={1.6} rx={0.8} className={hotInk} />
        <rect x={4} y={16.6} width={6} height={2.6} rx={1.3} className={hotInk} />
        {[0, 1, 2].map((index) => card(`phone-card-${index}`, 2, 24 + index * 9.5, 16, 8))}
        <rect x={2} y={54} width={11} height={2} rx={1} className={body.ink} />
        <rect x={2} y={57.4} width={15} height={1.5} rx={0.75} className={body.ink} />
        <rect y={62} width={20} height={8} className={body.ink} />
      </>
    );
  };

  /** A screen: the glass, and the page scrolling behind its edges. */
  const screenOf = (screen: Screen, rx: number) => (
    <>
      <rect width={VIEW[screen].w} height={VIEW[screen].h} rx={rx} className={body.ink} />
      <g clipPath={`url(#${clipId}-${screen})`}>
        <g className={`isometric203-${screen}`}>{page(screen)}</g>
      </g>
    </>
  );

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric203-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -76 266 230" aria-hidden="true" className="isometric203-scene size-full overflow-visible">
        <defs>
          <clipPath id={`${clipId}-desktop`}>
            <rect width={VIEW.desktop.w} height={VIEW.desktop.h} rx={2} />
          </clipPath>
          <clipPath id={`${clipId}-tablet`}>
            <rect width={VIEW.tablet.w} height={VIEW.tablet.h} rx={3} />
          </clipPath>
          <clipPath id={`${clipId}-phone`}>
            <rect width={VIEW.phone.w} height={VIEW.phone.h} rx={3.5} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 216, 72, BASE, 14)} paint={body} />
        {/* The monitor: foot, neck, then the upright screen */}
        <RoundBlock shape={roundBox(MON.x + MON.w / 2 - 18, 8, BASE, 36, 24, 2, 7)} paint={body} />
        <Block faces={box(MON.x + MON.w / 2 - 5, MON.y - MON.t - 4, BASE + 2, 10, 4, MON.z - BASE + 8)} paint={body} />
        <Block faces={box(MON.x, MON.y - MON.t, MON.z, MON.w, MON.t, MON.h)} paint={body} />
        <g transform={`${onLeft(MON.y)} translate(${MON.x + MON.bezel} ${-(MON.z + MON.h) + MON.bezel})`}>{screenOf("desktop", 2)}</g>
        <Leaning device={TABLET} paint={body}>
          {screenOf("tablet", 3)}
        </Leaning>
        <Leaning device={PHONE} paint={body}>
          {screenOf("phone", 3.5)}
        </Leaning>
      </svg>
    </div>
  );
}
