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

interface Isometric201Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the hero section, the nav button and the publish button with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric201Demo: Isometric201Props = {
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
// The browser lies flat on the desk; its sections stand on the page as solid blocks
const SLAB = { x: 10, y: 10, w: 130, d: 86, h: 5 };
const Z = BASE + SLAB.h;
const PAGE = { x: 15, y: 24, w: 120, d: 68 };
interface Section {
  id: string;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
}
const ROW = { x: 19, w: 112 };
const CARD = (ROW.w - 8) / 3;
const SECTIONS: Section[] = [
  { id: "nav", x: ROW.x, y: 27, w: ROW.w, d: 7, h: 6 },
  { id: "hero", x: ROW.x, y: 40, w: ROW.w, d: 22, h: 8 },
  ...[0, 1, 2].map((index) => ({ id: `card${index}`, x: ROW.x + index * (CARD + 4), y: 66, w: CARD, d: 12, h: 7 })),
  { id: "foot", x: ROW.x, y: 82, w: ROW.w, d: 7, h: 5 },
];
const TILE = { w: 36, inset: 4, h: 2 };

/** The outline of a section at full height, a hair wider: whatever sinks below the page falls outside it. */
function outline({ x, y, w, d, h }: Section, extra: number) {
  const m = 0.6;
  const lo = Z - m;
  const hi = Z + h + extra + m;
  return polygon([
    [x - m, y - m, hi],
    [x + w + m, y - m, hi],
    [x + w + m, y - m, lo],
    [x + w + m, y + d + m, lo],
    [x - m, y + d + m, lo],
    [x - m, y + d + m, hi],
  ]);
}

const PERIOD = 10;
// Each section rises out of the page in turn, the page holds, then they sink back in the same order
const rise = ({ id, h }: Section, index: number) => {
  const up = 6 + index * 7;
  const down = 66 + index * 4;
  return `@keyframes isometric201-${id} { 0%, ${up}% { transform: translateY(${h}px); } ${up + 7}%, ${down}% { transform: translateY(0px); } ${down + 6}%, 100% { transform: translateY(${h}px); } }
.isometric201-${id} { animation: isometric201-${id} ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; }`;
};

const STYLES = `
${SECTIONS.map(rise).join("\n")}
.isometric201-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric201-scene * { animation: none !important; } }
`;

export function Isometric201({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric201Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;

  /** What is printed on top of a section. */
  const detail = (section: Section) => {
    const { id, x, y, w, d } = section;
    if (id === "nav") {
      return (
        <>
          <rect x={x + 4} y={y + 2} width={12} height={3} rx={1.5} className={body.ink} />
          {[0, 1, 2].map((link) => (
            <rect key={`link-${link}`} x={x + 54 + link * 11} y={y + 2.4} width={8} height={2.2} rx={1.1} className={body.ink} />
          ))}
          <rect x={x + w - 19} y={y + 1.5} width={15} height={4} rx={2} className={accent ? mine.base : body.ink} />
        </>
      );
    }
    if (id === "hero") {
      return (
        <>
          <rect x={x + 6} y={y + 5} width={38} height={3.6} rx={1.8} className={accent ? mine.ink : body.ink} />
          <rect x={x + 6} y={y + 11} width={26} height={2.4} rx={1.2} className={accent ? mine.ink : body.ink} />
          <rect x={x + 6} y={y + 15.4} width={15} height={4} rx={2} className={accent ? mine.ink : body.ink} />
        </>
      );
    }
    if (id === "foot") {
      return (
        <>
          <rect x={x + 4} y={y + 2.3} width={10} height={2.4} rx={1.2} className={body.ink} />
          {[0, 1, 2, 3].map((link) => (
            <rect key={`foot-${link}`} x={x + 62 + link * 12} y={y + 2.5} width={8} height={2} rx={1} className={body.ink} />
          ))}
        </>
      );
    }
    return (
      <>
        <circle cx={x + 6} cy={y + d / 2 - 1.6} r={2.4} className={body.ink} />
        <rect x={x + 11} y={y + 3} width={w - 16} height={2.4} rx={1.2} className={body.ink} />
        <rect x={x + 4} y={y + 8} width={w - 8} height={1.8} rx={0.9} className={body.ink} />
      </>
    );
  };

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric201-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-100 -18 238 158" aria-hidden="true" className="isometric201-scene size-full overflow-visible">
        <defs>
          {SECTIONS.map((section) => (
            <clipPath key={`clip-${section.id}`} id={`${clipId}-${section.id}`}>
              <polygon points={outline(section, section.id === "hero" ? TILE.h : 0)} />
            </clipPath>
          ))}
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 150, 106, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(SLAB.x, SLAB.y, BASE, SLAB.w, SLAB.d, SLAB.h, 8)} paint={body} />
        {/* The browser bar, the publish button and the page */}
        <g transform={onTop(Z)}>
          {[0, 1, 2].map((dot) => (
            <circle key={`dot-${dot}`} cx={18 + dot * 5} cy={17} r={1.6} className={body.ink} />
          ))}
          <rect x={36} y={14.5} width={62} height={5} rx={2.5} className={body.ink} />
          <rect x={117} y={14.5} width={18} height={5} rx={2.5} className={accent ? mine.base : body.ink} />
          <rect x={PAGE.x} y={PAGE.y} width={PAGE.w} height={PAGE.d} rx={3} className={body.ink} />
        </g>
        {/* The sections, back to front; each is cut off at page level while it is sunk */}
        {SECTIONS.map((section) => {
          const skin = section.id === "hero" ? mine : body;
          return (
            <g key={`section-${section.id}`} clipPath={`url(#${clipId}-${section.id})`}>
              <g className={`isometric201-${section.id}`}>
                <Block faces={box(section.x, section.y, Z, section.w, section.d, section.h)} paint={skin} />
                <g transform={onTop(Z + section.h)}>{detail(section)}</g>
                {section.id === "hero" && (
                  <>
                    <Block faces={box(section.x + section.w - TILE.w - TILE.inset, section.y + TILE.inset, Z + section.h, TILE.w, section.d - 2 * TILE.inset, TILE.h)} paint={body} />
                    <g transform={onTop(Z + section.h + TILE.h)} className={body.ink}>
                      <circle cx={section.x + section.w - TILE.inset - 8} cy={section.y + TILE.inset + 5} r={2.2} />
                      <path d={`M${section.x + section.w - TILE.w - TILE.inset + 3} ${section.y + section.d - TILE.inset - 2}l8 -7l6 4l5 -3l9 6Z`} />
                    </g>
                  </>
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
