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

interface Isometric38Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Color the tumbling laundry with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric38Demo: Isometric38Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const W = 64;
const D = 60;
const BASE = 4;
const H = 80;
const TOP = BASE + H;
const DOOR = { x: W / 2, z: BASE + 34, r: 25, glass: 18 };
// The bezel stands this far proud of the front face, one disc per unit
const BEZEL = [0, 1, 2, 3, 4];
// Depth inside the drum is drawn in the door plane: one unit back is one unit right and one up
const DRUM = { depth: 10, r: 17 };
const RINGS = [0, 3, 6, 9];
const RIBS = [2, 4, 6, 8];
const HOLES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => {
  const angle = (index * 30 * Math.PI) / 180;
  const reach = index % 2 ? 6 : 11;
  return [reach * Math.cos(angle), reach * Math.sin(angle)] as const;
});
const SPIN = 4;
// One tumble: the drum carries a garment up its rising side, then it drops across the middle
const CARRY = { from: 100, to: 225, r: 10.5 };
const TUMBLE = (() => {
  const rate = 360 / SPIN;
  const carryTime = (CARRY.to - CARRY.from) / rate;
  const fallTime = 0.5;
  const total = carryTime + fallTime;
  const at = (degrees: number) => [CARRY.r * Math.cos((degrees * Math.PI) / 180), CARRY.r * Math.sin((degrees * Math.PI) / 180)] as const;
  const [x0, y0] = at(CARRY.from);
  const [x1, y1] = at(CARRY.to);
  const speed = ((rate * Math.PI) / 180) * CARRY.r;
  const vx = -Math.sin((CARRY.to * Math.PI) / 180) * speed;
  const vy = Math.cos((CARRY.to * Math.PI) / 180) * speed;
  const pull = (2 * (y0 - y1 - vy * fallTime)) / fallTime ** 2;
  const stops: string[] = [];
  for (let k = 0; k <= 8; k++) {
    const degrees = CARRY.from + ((CARRY.to - CARRY.from) * k) / 8;
    const [x, y] = at(degrees);
    stops.push(`${(((carryTime * k) / 8 / total) * 100).toFixed(1)}% { transform: translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(degrees - CARRY.from).toFixed(0)}deg); }`);
  }
  for (let k = 1; k <= 5; k++) {
    const t = (fallTime * k) / 5;
    const x = k === 5 ? x0 : x1 + vx * t + ((x0 - x1 - vx * fallTime) * t) / fallTime;
    const y = k === 5 ? y0 : y1 + vy * t + (pull * t * t) / 2;
    const turn = CARRY.to - CARRY.from + ((360 - (CARRY.to - CARRY.from)) * k) / 5;
    stops.push(`${(((carryTime + t) / total) * 100).toFixed(1)}% { transform: translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${turn.toFixed(0)}deg); }`);
  }
  return { css: stops.join(" "), total };
})();
// Each garment: how deep it sits, where it rests when still, and how far into the cycle it starts
const LAUNDRY = [
  { depth: 7, rest: [-10, 1], lead: 0.1, lit: false, size: 6.5 },
  { depth: 5, rest: [4, 9], lead: 0.55, lit: true, size: 7.5 },
  { depth: 3, rest: [-6, 9], lead: 0.3, lit: false, size: 6 },
  { depth: 2, rest: [-3, -6], lead: 0.8, lit: true, size: 7 },
];
const SUDS = [
  { x: -8, y: 13, r: 1.6 },
  { x: 2, y: 14, r: 1.2 },
];

const STYLES = `
@keyframes isometric38-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes isometric38-tumble { ${TUMBLE.css} }
@keyframes isometric38-slosh { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
.isometric38-drum { animation: isometric38-spin ${SPIN}s linear infinite; }
.isometric38-tumble { animation: isometric38-tumble ${TUMBLE.total.toFixed(2)}s linear infinite; }
.isometric38-water { animation: isometric38-slosh 1.8s ease-in-out infinite; }
.isometric38-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric38-drum, .isometric38-tumble, .isometric38-water { animation: none; } }
`;

// Tints for the dark drum, the suds and the glass, spelled out so Tailwind sees every class
const INSIDE: Record<Palette, { dark: string; glass: string; glint: string }> = {
  theme: { dark: "fill-foreground/20", glass: "fill-background/20", glint: "stroke-background/70" },
  light: { dark: "fill-zinc-950/20", glass: "fill-white/20", glint: "stroke-white/70" },
  dark: { dark: "fill-black/40", glass: "fill-white/10", glint: "stroke-white/40" },
  tone: { dark: "fill-black/25", glass: "fill-white/20", glint: "stroke-white/60" },
  glass: { dark: "fill-foreground/20", glass: "fill-background/20", glint: "stroke-background/70" },
};

/** A bunched piece of cloth: a few stacked blobs with a lighter crown and a darker underside. */
function Garment({ size, paint }: { size: number; paint: Paint }) {
  return (
    <>
      {[2, 1, 0].map((back) => (
        <g key={back} transform={`translate(${back} ${-back})`}>
          <ellipse rx={size} ry={size * 0.72} className={paint.base} />
          <ellipse cx={size * 0.45} cy={-size * 0.2} rx={size * 0.62} ry={size * 0.55} className={paint.base} />
          {back > 0 && <ellipse rx={size} ry={size * 0.72} className={paint.right} />}
        </g>
      ))}
      <path d={`M${-size * 0.9} ${size * 0.15}A${size} ${size * 0.72} 0 0 0 ${size * 0.9} ${size * 0.15}A${size * 1.1} ${size * 0.5} 0 0 1 ${-size * 0.9} ${size * 0.15}Z`} className={paint.left} />
    </>
  );
}

export function Isometric38({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric38Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const clipId = useId();
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const inside = INSIDE[palette];
  // Plain pieces take a slightly inked body paint so they stand off the drum
  const cloth: Paint = { ...body, right: body.ink, left: body.ink };

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric38-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-70 -90 142 164" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-8, -8, 0, W + 16, D + 12, BASE)} paint={body} />
        <Block faces={box(0, 0, BASE, W, D, H)} paint={body} />
        <g transform={onLeft(D)}>
          <rect x={0} y={-TOP + 14} width={W} height={1.2} className={body.ink} />
          <rect x={5} y={-TOP + 4} width={20} height={7} rx={1.5} className={body.ink} />
          <rect x={8} y={-TOP + 6.5} width={8} height={2} rx={1} className={body.base} />
          <rect x={30} y={-TOP + 4.5} width={14} height={6} rx={1} className={body.ink} />
          <rect x={32} y={-TOP + 6.5} width={6} height={2} rx={1} className={accent ? paint.accent.base : body.base} />
        </g>
        {[0, 1, 2].map((out) => (
          <g key={out} transform={onLeft(D + out)} className={body.edge} strokeWidth={out === 2 ? 1 : 0}>
            <circle cx={W - 10} cy={-TOP + 7.5} r={4.5} className={body.base} />
            <circle cx={W - 10} cy={-TOP + 7.5} r={4.5} className={out === 2 ? body.left : body.right} stroke="none" />
            {out === 2 && <rect x={W - 10.75} y={-TOP + 4} width={1.5} height={4} rx={0.75} className={body.ink} stroke="none" />}
          </g>
        ))}
        {BEZEL.map((out) => {
          const face = out === BEZEL.length - 1;
          return (
            <g key={out} transform={onLeft(D + out)} className={body.edge} strokeWidth={face || out === 0 ? 1 : 0}>
              <rect x={DOOR.x - DOOR.r - 2.5} y={-DOOR.z - 5} width={4} height={10} rx={1.5} className={body.base} />
              <circle cx={DOOR.x} cy={-DOOR.z} r={DOOR.r} className={body.base} />
              <circle cx={DOOR.x} cy={-DOOR.z} r={DOOR.r} className={face ? body.left : body.right} stroke="none" />
            </g>
          );
        })}
        <g transform={onLeft(D + 2)}>
          <defs>
            <clipPath id={clipId}>
              <circle cx={DOOR.x} cy={-DOOR.z} r={DOOR.glass} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <g transform={`translate(${DOOR.x} ${-DOOR.z})`}>
              <circle r={DOOR.glass + 2} className={body.base} />
              {/* The drum wall darkens toward the back plate */}
              {RINGS.map((back) => (
                <circle key={back} cx={back} cy={-back} r={DOOR.glass + 1 - back / 6} className={inside.dark} />
              ))}
              <g transform={`translate(${DRUM.depth} ${-DRUM.depth})`}>
                <circle r={DRUM.r} className={body.base} />
                <circle r={DRUM.r} className={inside.dark} />
                <g className="isometric38-drum">
                  {HOLES.map(([x, y]) => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r={1.1} className={inside.dark} />
                  ))}
                  <circle r={2.5} className={inside.dark} />
                </g>
              </g>
              {RIBS.map((back) => (
                <g key={back} transform={`translate(${back} ${-back})`}>
                  <g className="isometric38-drum">
                    {[0, 120, 240].map((turn) => (
                      <g key={turn} transform={`rotate(${turn})`}>
                        <rect x={-2.5} y={DRUM.r - 4} width={5} height={5} rx={2} className={body.base} />
                        <rect x={-2.5} y={DRUM.r - 4} width={5} height={5} rx={2} className={back < 8 ? inside.dark : body.right} />
                      </g>
                    ))}
                  </g>
                </g>
              ))}
              {LAUNDRY.map((item) => (
                <g key={item.depth} transform={`translate(${item.depth} ${-item.depth})`}>
                  <g
                    className="isometric38-tumble"
                    style={{ transform: `translate(${item.rest[0]}px, ${item.rest[1]}px)`, animationDelay: `${(-item.lead * TUMBLE.total).toFixed(2)}s` }}
                  >
                    <Garment size={item.size} paint={item.lit ? paint.accent : cloth} />
                  </g>
                </g>
              ))}
              <g className="isometric38-water">
                <rect x={-DOOR.glass} y={10} width={DOOR.glass * 2} height={DOOR.glass} className={inside.dark} />
                {SUDS.map((bubble) => (
                  <circle key={bubble.x} cx={bubble.x} cy={bubble.y - 3} r={bubble.r} className={body.base} />
                ))}
              </g>
              <circle r={DOOR.glass} className={inside.glass} />
            </g>
          </g>
        </g>
        <g transform={onLeft(D + 4)} fill="none" strokeLinecap="round">
          <circle cx={DOOR.x} cy={-DOOR.z} r={DOOR.glass + 0.5} strokeWidth={2.5} className={body.ink.replace("fill-", "stroke-")} />
          <path d={`M${DOOR.x - 12} ${-DOOR.z - 4}A13 13 0 0 1 ${DOOR.x - 3} ${-DOOR.z - 12.5}`} strokeWidth={2.5} className={inside.glint} />
          <path d={`M${DOOR.x + 1.5} ${-DOOR.z - 13.5}A13.5 13.5 0 0 1 ${DOOR.x + 4} ${-DOOR.z - 13}`} strokeWidth={2.5} className={inside.glint} />
        </g>
        {[4, 5, 6].map((out) => (
          <g key={out} transform={onLeft(D + out)} className={body.edge} strokeWidth={out === 6 ? 1 : 0}>
            <rect x={DOOR.x + DOOR.r - 6} y={-DOOR.z - 7} width={4} height={14} rx={2} className={body.base} />
            <rect x={DOOR.x + DOOR.r - 6} y={-DOOR.z - 7} width={4} height={14} rx={2} className={out === 6 ? body.left : body.right} stroke="none" />
          </g>
        ))}
      </svg>
    </div>
  );
}
