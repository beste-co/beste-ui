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

interface Isometric246Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Stripe the awning and color the sold tags and page details with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric246Demo: Isometric246Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const BASE = 6;
// The counter: a block with a slightly wider top
const W = 114;
const CD = 34;
const CT = BASE + 18;
// The page templates stand on the counter in the plane y = FACE, facing the viewer
const PW = 31;
const TH = 40;
const FACE = 22;
const THICK = 3;
const RISE = 6;
const SLABS = [5.5, 41.5, 77.5];
// The awning slopes from the back down to a scalloped valance at the front
const AWNING = { x0: -8, x1: W + 8, yb: 2, yf: 36, zb: 107, zf: 99, lip: 3, scallop: 4, thick: 3 };
const STRIPES = 8;
const STRIPE = (AWNING.x1 - AWNING.x0) / STRIPES;
const POST = { y: 15, size: 4, top: 100 };
const PERIOD = 12;

// Middle first, then right, then left; each one stays sold until the stall resets
const TURNS = [
  { slab: 1, at: 6 },
  { slab: 2, at: 30 },
  { slab: 0, at: 54 },
];

const STYLES = `
${TURNS.map(
  ({ slab, at }) => `@keyframes isometric246-rise${slab} { 0%, ${at}% { transform: translateY(0px); } ${at + 6}%, ${at + 12}% { transform: translateY(${-RISE}px); } ${at + 18}%, 100% { transform: translateY(0px); } }
@keyframes isometric246-sold${slab} { 0%, ${at + 2}% { opacity: 0; } ${at + 8}%, 88% { opacity: 1; } 94%, 100% { opacity: 0; } }
.isometric246-rise${slab} { animation: isometric246-rise${slab} ${PERIOD}s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
.isometric246-sold${slab} { animation: isometric246-sold${slab} ${PERIOD}s linear infinite; }`,
).join("\n")}
.isometric246-still * { animation: none !important; }
.isometric246-still .isometric246-sold1 { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .isometric246-rise0, .isometric246-rise1, .isometric246-rise2, .isometric246-sold0, .isometric246-sold1, .isometric246-sold2 { animation: none; }
  .isometric246-sold1 { opacity: 1; }
}
`;

// A price tag hanging point up, drawn from its tip
const TAG = "M0 0L4.6 4.4V15.5H-4.6V4.4Z";
const CHECK = "M-2.9 0.3l2.1 2.1l3.9 -4.6";

/** One awning stripe: its sloped top panel, and the scalloped valance in front as a path on the front plane. */
function stripe(index: number) {
  const { x0, yb, yf, zb, zf, lip, scallop } = AWNING;
  const a = x0 + index * STRIPE;
  const b = a + STRIPE;
  return {
    top: polygon([[a, yb, zb], [b, yb, zb], [b, yf, zf], [a, yf, zf]]),
    valance: `M${a} ${-zf}H${b}V${-(zf - lip)}A${STRIPE / 2} ${scallop} 0 0 1 ${a} ${-(zf - lip)}Z`,
  };
}

/** The three page layouts, drawn on a slab's face from its top left corner. */
function Layout({ kind, body, detail }: { kind: number; body: Paint; detail: string }) {
  if (kind === 0) {
    // Article: a title, a cover picture and running text
    return (
      <g className={body.base}>
        <rect x={5} y={5} width={13} height={2.6} rx={1.3} />
        <rect x={5} y={10.5} width={PW - 10} height={11} rx={1.5} />
        <circle cx={10} cy={14.5} r={1.8} className={detail} />
        {[25, 28.5, 32, 35.5].map((y, index) => (
          <rect key={`line-${y}`} x={5} y={y} width={index === 3 ? 11 : PW - 10 - (index % 2) * 4} height={1.8} rx={0.9} />
        ))}
      </g>
    );
  }
  if (kind === 1) {
    // Hero: a headline, a button and a wide picture
    return (
      <g className={body.base}>
        <circle cx={6.2} cy={6.2} r={1.3} />
        <rect x={9.5} y={5.2} width={8} height={2} rx={1} />
        <rect x={5} y={11} width={16} height={3} rx={1.5} />
        <rect x={5} y={15.5} width={11} height={2} rx={1} />
        <rect x={5} y={19.5} width={10} height={4.2} rx={2.1} className={detail} />
        <rect x={5} y={26.5} width={PW - 10} height={9.5} rx={1.5} />
      </g>
    );
  }
  // Grid: a bar and six tiles, one picked
  return (
    <g className={body.base}>
      <rect x={5} y={5} width={11} height={2.6} rx={1.3} />
      {[0, 1, 2].flatMap((row) =>
        [0, 1].map((col) => (
          <rect key={`tile-${row}-${col}`} x={5 + col * 11} y={10.5 + row * 9} width={10} height={8} rx={1.5} className={row === 0 && col === 0 ? detail : undefined} />
        )),
      )}
    </g>
  );
}

export function Isometric246({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric246Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const mine = paint.accent;
  const detail = accent ? mine.base : body.base;
  const stripeFill = accent ? mine.base : body.ink;
  // The check on the sold plate, and the tag's lines once it is sold
  const onSold = accent ? (palette === "tone" ? "stroke-current" : "stroke-white") : body.edge;
  const soldInk = accent ? mine.ink : body.ink;
  const stripes = Array.from({ length: STRIPES }, (_, index) => stripe(index));
  const { x0, x1, yb, yf, zb, zf, thick } = AWNING;
  const top = CT + TH;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric246-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-60 -116 182 208" aria-hidden="true" className="size-full overflow-visible">
        <defs>
          {/* Each page is cut off at the counter, so it comes up out of it */}
          {SLABS.map((x, index) => (
            <clipPath key={`clip-${x}`} id={`${clipId}-${index}`}>
              <polygon points={polygon([[x - 1, FACE + 1, CT], [x + PW, FACE + 1, CT], [x + PW, FACE - THICK, CT], [x + PW, FACE - THICK, CT + 90], [x - 1, FACE + 1, CT + 90]])} />
            </clipPath>
          ))}
        </defs>
        <Block faces={box(-12, -6, 0, W + 24, CD + 18, BASE)} paint={body} />
        <Block faces={box(-POST.size - 1, POST.y, BASE, POST.size, POST.size, POST.top - BASE)} paint={body} />
        <Block faces={box(0, 0, BASE, W, CD, CT - BASE - 3)} paint={body} />
        <Block faces={box(-2, -2, CT - 3, W + 4, CD + 4, 3)} paint={body} />
        <g transform={onLeft(CD)} className={body.ink}>
          <rect x={8} y={-(CT - 7)} width={W - 16} height={2} rx={1} />
        </g>
        {SLABS.map((x, index) => (
          <g key={`slab-${x}`} clipPath={`url(#${clipId}-${index})`}>
            <g className={`isometric246-rise${index}`}>
              <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
                <g transform={onRight(x + PW)}>
                  <rect x={FACE - THICK} y={-top} width={THICK} height={TH + RISE + 1} className={body.base} />
                  <rect x={FACE - THICK} y={-top} width={THICK} height={TH + RISE + 1} className={body.right} stroke="none" />
                </g>
                <polygon points={polygon([[x, FACE - THICK, top], [x + PW, FACE - THICK, top], [x + PW, FACE, top], [x, FACE, top]])} className={body.base} />
                <g transform={onLeft(FACE)}>
                  <rect x={x} y={-top} width={PW} height={TH + RISE + 1} className={body.base} />
                </g>
              </g>
              <g transform={`${onLeft(FACE)} translate(${x} ${-top})`}>
                <rect x={2.5} y={2.5} width={PW - 5} height={TH - 5} rx={1.5} className={body.ink} />
                <Layout kind={index} body={body} detail={detail} />
              </g>
              {/* The sold plate: two layers, so it has an edge of its own */}
              <g className={cn(`isometric246-sold${index} opacity-0`)}>
                {[0.5, 1.6].map((lift) => (
                  <g key={`plate-${lift}`} transform={`${onLeft(FACE + lift)} translate(${x + PW / 2} ${-top + 29})`}>
                    {lift < 1 && <circle r={7.7} className={body.base} />}
                    <circle r={6.5} strokeWidth={0.8} className={cn(detail, lift < 1 ? "stroke-none" : accent ? "stroke-transparent" : body.edge)} />
                    {lift < 1 && <circle r={6.5} className={accent ? mine.right : body.right} />}
                    {lift > 1 && <path d={CHECK} fill="none" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={onSold} />}
                  </g>
                ))}
              </g>
              {/* The price tag on its cord, and the same tag in the tone once sold */}
              <g transform={`${onLeft(FACE + 0.5)} translate(${x + PW - 7.5} ${-top + 3})`}>
                <path d={TAG} className={body.base} />
                <path d={TAG} className={body.right} />
              </g>
              <g transform={`${onLeft(FACE + 1.6)} translate(${x + PW - 7.5} ${-top + 3})`}>
                <path d="M0 -3.4V3.4" fill="none" strokeWidth={0.9} strokeLinecap="round" className={body.edge} />
                <path d={TAG} strokeWidth={0.8} strokeLinejoin="round" className={cn(body.base, body.edge)} />
                <g className={body.ink}>
                  <circle cy={3.6} r={1.1} />
                  <rect x={-2.8} y={8} width={5.6} height={1.7} rx={0.85} />
                  <rect x={-2.8} y={11.2} width={3.6} height={1.7} rx={0.85} />
                </g>
                <g className={`isometric246-sold${index} opacity-0`}>
                  <path d={TAG} className={detail} />
                  <g className={soldInk}>
                    <circle cy={3.6} r={1.1} />
                    <rect x={-2.8} y={8} width={5.6} height={1.7} rx={0.85} />
                    <rect x={-2.8} y={11.2} width={3.6} height={1.7} rx={0.85} />
                  </g>
                </g>
              </g>
            </g>
          </g>
        ))}
        <Block faces={box(W + 1, POST.y, BASE, POST.size, POST.size, POST.top - BASE)} paint={body} />
        {/* The awning: the sloped top, its end, and the scalloped valance, striped in turn */}
        <g className={body.edge} strokeWidth={1} strokeLinejoin="round">
          <polygon points={polygon([[x1, yb, zb], [x1, yf, zf], [x1, yf, zf - thick], [x1, yb, zb - thick]])} className={body.base} />
          <polygon points={polygon([[x1, yb, zb], [x1, yf, zf], [x1, yf, zf - thick], [x1, yb, zb - thick]])} className={body.right} stroke="none" />
          <polygon points={polygon([[x0, yb, zb], [x1, yb, zb], [x1, yf, zf], [x0, yf, zf]])} className={body.base} />
        </g>
        {stripes.map(({ top: panel }, index) => index % 2 === 0 && <polygon key={`top-${panel}`} points={panel} className={stripeFill} />)}
        <g transform={onLeft(yf)} className={body.edge} strokeWidth={0.9} strokeLinejoin="round">
          {stripes.map(({ valance }, index) => (
            <g key={`valance-${valance}`}>
              <path d={valance} className={index % 2 === 0 ? stripeFill : body.base} />
              <path d={valance} className={index % 2 === 0 && accent ? mine.left : body.left} stroke="none" />
            </g>
          ))}
        </g>
        <polygon points={polygon([[x0, yb, zb], [x1, yb, zb], [x1, yf, zf], [x0, yf, zf]])} fill="none" strokeWidth={1} strokeLinejoin="round" className={body.edge} />
      </svg>
    </div>
  );
}
