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

interface Isometric202Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the prompt, the assistant mark and the hero section with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric202Demo: Isometric202Props = {
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
const TALL = 82;
const THICK = 5;
// Both panels stand on their bottom front edge and lean back by this much
const LEAN = (14 * Math.PI) / 180;
const SIN = Math.sin(LEAN);
const COS = Math.cos(LEAN);
const FOOT = { y: 46, z: BASE + 3 };
const CHAT = { x: 16, w: 46 };
const SITE = { x: 70, w: 100 };
const flat = ([x, y, z]: Point) => [(x - y) * C, (x + y) * S - z] as const;
/** The matrix that lays local (across, down) units onto the leaning plane `depth` behind the glass, starting `rise` up the panel. */
function plane(x: number, depth: number, rise: number) {
  const origin: Point = [x, FOOT.y - SIN * rise - COS * depth, FOOT.z + COS * rise - SIN * depth];
  const [e, f] = flat(origin);
  const [m0, m1] = flat([1, 0, 0]);
  const [m2, m3] = flat([0, SIN, -COS]);
  return `matrix(${[m0, m1, m2, m3, e, f].map((n) => n.toFixed(3)).join(" ")})`;
}
// Behind the glass each panel is a stack of thin layers, far to near
const LAYERS = Array.from({ length: THICK }, (_, index) => THICK - index);
const REST = { side: 3, tall: 40, depth: 3 };
const REST_LAYERS = Array.from({ length: REST.depth }, (_, index) => THICK + REST.depth - index);

/** A leaning panel with its rest behind it; children are drawn on the glass. */
function Panel({ x, w, paint, children }: { x: number; w: number; paint: Paint; children: ReactNode }) {
  return (
    <>
      {REST_LAYERS.map((depth, index) => (
        <g key={`rest-${depth}`} transform={plane(x - REST.side, depth, REST.tall)} className={paint.edge} strokeWidth={index === REST_LAYERS.length - 1 ? 1 : 0}>
          <rect width={w + 2 * REST.side} height={REST.tall} rx={6} className={paint.base} />
          <rect width={w + 2 * REST.side} height={REST.tall} rx={6} className={index === REST_LAYERS.length - 1 ? paint.left : paint.right} stroke="none" />
        </g>
      ))}
      {LAYERS.map((depth) => (
        <g key={`layer-${depth}`} transform={plane(x, depth, TALL)}>
          <rect width={w} height={TALL} rx={7} className={paint.base} />
          <rect width={w} height={TALL} rx={7} className={paint.right} />
        </g>
      ))}
      <g transform={plane(x, 0, TALL)}>
        <rect width={w} height={TALL} rx={7} strokeWidth={1} className={cn(paint.base, paint.edge)} />
        <rect x={3} y={3} width={w - 6} height={TALL - 6} rx={5} className={paint.ink} />
        {children}
      </g>
    </>
  );
}

const PERIOD = 10;
// The thread area of the chat; the prompt slides up into it from the input
const THREAD = { y: 16, h: 45 };
const SLIDE = 46;
const SPARK = "M0 -4C0.5 -1.3 1.3 -0.5 4 0C1.3 0.5 0.5 1.3 0 4C-0.5 1.3 -1.3 0.5 -4 0C-1.3 -0.5 -0.5 -1.3 0 -4Z";
const CHECK = "M-2.2 0.2L-0.6 1.8L2.4 -1.6";
const PARTS = ["nav", "hero", "cards", "foot"] as const;

const part = (id: string, index: number) => {
  const from = 24 + index * 8;
  return `@keyframes isometric202-${id} { 0%, ${from}% { opacity: 0; } ${from + 6}%, 90% { opacity: 1; } 95%, 100% { opacity: 0; } }
.isometric202-${id} { animation: isometric202-${id} ${PERIOD}s ease-in-out infinite; }`;
};

const STYLES = `
@keyframes isometric202-prompt { 0%, 8% { transform: translateY(${SLIDE}px); } 16%, 100% { transform: translateY(0px); } }
@keyframes isometric202-thread { 0%, 90% { opacity: 1; } 95%, 100% { opacity: 0; } }
@keyframes isometric202-busy { 0%, 18% { opacity: 0; } 21%, 58% { opacity: 1; } 62%, 100% { opacity: 0; } }
@keyframes isometric202-dot { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }
@keyframes isometric202-reply { 0%, 63% { opacity: 0; } 68%, 100% { opacity: 1; } }
@keyframes isometric202-check { 0%, 68% { stroke-dashoffset: 7; } 74%, 100% { stroke-dashoffset: 0; } }
${PARTS.map(part).join("\n")}
.isometric202-prompt { animation: isometric202-prompt ${PERIOD}s cubic-bezier(0.3, 0, 0.2, 1) infinite; }
.isometric202-thread { animation: isometric202-thread ${PERIOD}s linear infinite; }
.isometric202-busy { animation: isometric202-busy ${PERIOD}s linear infinite; }
.isometric202-dot { animation: isometric202-dot 1.2s ease-in-out infinite; }
.isometric202-reply { animation: isometric202-reply ${PERIOD}s linear infinite; }
.isometric202-check { stroke-dasharray: 7; animation: isometric202-check ${PERIOD}s ease-out infinite; }
.isometric202-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric202-scene * { animation: none !important; } }
`;

export function Isometric202({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric202Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  // A line drawn on top of an accent fill
  const onAccent = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const hot = accent ? mine.base : body.base;
  const hotInk = accent ? mine.ink : body.ink;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric202-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-72 -86 242 224" aria-hidden="true" className="isometric202-scene size-full overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <rect x={3} y={THREAD.y} width={CHAT.w - 6} height={THREAD.h} />
          </clipPath>
        </defs>
        <RoundBlock shape={roundBox(0, 0, 0, 186, 72, BASE, 14)} paint={body} />
        <RoundBlock shape={roundBox(CHAT.x - 6, 14, BASE, SITE.x + SITE.w - CHAT.x + 12, 44, 3, 8)} paint={body} />
        {/* The chat panel: the assistant, the thread and the prompt input */}
        <Panel x={CHAT.x} w={CHAT.w} paint={body}>
          <path d={SPARK} transform="translate(10 9.5) scale(0.9)" className={hot} />
          <rect x={16.5} y={8} width={16} height={3} rx={1.5} className={body.base} />
          <g clipPath={`url(#${clipId})`}>
            <g className="isometric202-thread">
              <g className="isometric202-prompt">
                <rect x={11} y={19} width={30} height={15} rx={4.5} className={hot} />
                <rect x={15} y={22.6} width={22} height={2.4} rx={1.2} className={hotInk} />
                <rect x={15} y={27.4} width={14} height={2.4} rx={1.2} className={hotInk} />
              </g>
              {/* While the page is being built the assistant shows it is working */}
              <g className="isometric202-busy opacity-0">
                <rect x={5} y={38} width={19} height={8} rx={4} className={body.base} />
                {[0, 1, 2].map((dot) => (
                  <circle key={`dot-${dot}`} cx={10 + dot * 4.5} cy={42} r={1.3} className={cn("isometric202-dot", body.ink)} style={{ animationDelay: `${dot * 0.2}s` }} />
                ))}
              </g>
              <g className="isometric202-reply">
                <rect x={5} y={38} width={31} height={17} rx={4.5} className={body.base} />
                <circle cx={11} cy={44} r={3.4} className={accent ? mine.base : body.ink} />
                <path d={CHECK} transform="translate(11 44)" fill="none" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" className={cn("isometric202-check", onAccent)} />
                <rect x={17} y={42.8} width={15} height={2.4} rx={1.2} className={body.ink} />
                <rect x={8} y={49.6} width={22} height={2.2} rx={1.1} className={body.ink} />
              </g>
            </g>
          </g>
          <rect x={5} y={63} width={CHAT.w - 10} height={8} rx={4} className={body.base} />
          <rect x={9} y={65.9} width={14} height={2.2} rx={1.1} className={body.ink} />
          <circle cx={CHAT.w - 9} cy={67} r={2.6} className={accent ? mine.base : body.ink} />
        </Panel>
        {/* The browser: its bar, and the page that fills in section by section */}
        <Panel x={SITE.x} w={SITE.w} paint={body}>
          {[0, 1, 2].map((dot) => (
            <circle key={`bar-${dot}`} cx={8.5 + dot * 4.5} cy={8.5} r={1.4} className={body.base} />
          ))}
          <rect x={24} y={6} width={52} height={5} rx={2.5} className={body.base} />
          <rect x={5} y={14} width={SITE.w - 10} height={55} rx={3} className={body.base} />
          <g className="isometric202-nav">
            <rect x={9} y={17.6} width={11} height={3} rx={1.5} className={body.ink} />
            {[0, 1, 2].map((link) => (
              <rect key={`link-${link}`} x={50 + link * 9} y={18} width={6} height={2.2} rx={1.1} className={body.ink} />
            ))}
            <rect x={80} y={16.6} width={11} height={5} rx={2.5} className={accent ? mine.base : body.ink} />
          </g>
          <g className="isometric202-hero">
            <rect x={9} y={24.5} width={SITE.w - 18} height={20} rx={3} className={accent ? mine.base : body.ink} />
            <rect x={13} y={28.5} width={30} height={3.4} rx={1.7} className={hotInk} />
            <rect x={13} y={34} width={21} height={2.4} rx={1.2} className={hotInk} />
            <rect x={13} y={38} width={12} height={3.6} rx={1.8} className={hotInk} />
            <rect x={60} y={27.5} width={27} height={14} rx={2} className={hotInk} />
          </g>
          <g className="isometric202-cards">
            {[0, 1, 2].map((card) => (
              <g key={`card-${card}`} transform={`translate(${9 + card * 28.33} 47.5)`}>
                <rect width={25.33} height={12.5} rx={2.5} className={body.ink} />
                <circle cx={5} cy={4.6} r={2} className={body.base} />
                <rect x={9} y={3.4} width={12} height={2.2} rx={1.1} className={body.base} />
                <rect x={3} y={8.2} width={18} height={1.8} rx={0.9} className={body.base} />
              </g>
            ))}
          </g>
          <g className="isometric202-foot">
            <rect x={9} y={63} width={10} height={2.4} rx={1.2} className={body.ink} />
            {[0, 1, 2].map((link) => (
              <rect key={`foot-${link}`} x={62 + link * 10} y={63.2} width={7} height={2} rx={1} className={body.ink} />
            ))}
          </g>
        </Panel>
        {/* The lip of the stand holds the bottom edge of both panels */}
        <RoundBlock shape={roundBox(CHAT.x - 4, FOOT.y - 1, BASE + 3, SITE.x + SITE.w - CHAT.x + 8, 6, 5, 2.5)} paint={body} />
      </svg>
    </div>
  );
}
