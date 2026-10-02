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

interface Isometric11Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the hub and the pulses with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric11Demo: Isometric11Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const PLATE = 176;
const BASE = 10;
const HUB = { x: 86, y: 86, size: 32, height: 26 };
const NODE = 22;
const NODE_H = 14;
const NODES = [
  { x: 98, y: 22 },
  { x: 148, y: 64 },
  { x: 22, y: 74 },
  { x: 40, y: 134 },
  { x: 110, y: 148 },
];
const GRID = Array.from({ length: 64 }, (_, index) => ({ x: 18 + (index % 8) * 20, y: 18 + Math.floor(index / 8) * 20 }));

const toScreen = (point: Point) => project(point).split(",").map(Number) as [number, number];
const HUB_TOP = toScreen([HUB.x, HUB.y, BASE + HUB.height]);

// Each link is a raised quadratic arc from the hub to a node, sampled for the pulse keyframes
const LINKS = NODES.map((node) => {
  const end = toScreen([node.x, node.y, BASE + NODE_H]);
  const lift = 40 + Math.hypot(node.x - HUB.x, node.y - HUB.y) * 0.12;
  const control: [number, number] = [(HUB_TOP[0] + end[0]) / 2, (HUB_TOP[1] + end[1]) / 2 - lift];
  const at = (t: number): [number, number] => {
    const u = 1 - t;
    return [u * u * HUB_TOP[0] + 2 * u * t * control[0] + t * t * end[0], u * u * HUB_TOP[1] + 2 * u * t * control[1] + t * t * end[1]];
  };
  return { d: `M${HUB_TOP.join(" ")}Q${control.join(" ")} ${end.join(" ")}`, at, mid: at(0.5) };
});

const STYLES = [
  ...LINKS.map(({ at, mid }, index) => {
    const frames = Array.from({ length: 9 }, (_, k) => {
      const [x, y] = at(k / 8);
      const fade = k === 0 || k === 8 ? " opacity: 0;" : k === 1 || k === 7 ? " opacity: 1;" : "";
      return `${(k * 12.5).toFixed(1)}% { transform: translate(${(x - mid[0]).toFixed(1)}px, ${(y - mid[1]).toFixed(1)}px);${fade} }`;
    });
    return `@keyframes isometric11-pulse-${index} { ${frames.join(" ")} }`;
  }),
  ...LINKS.map((_, index) => `.isometric11-pulse-${index} { animation: isometric11-pulse-${index} 2.8s linear infinite both; }`),
  "@keyframes isometric11-beat { 0%, 100% { transform: scale(1); } 8% { transform: scale(1.18); } 24% { transform: scale(1); } }",
  ".isometric11-beat { transform-box: fill-box; transform-origin: center; animation: isometric11-beat 2.8s ease-out infinite; }",
  ".isometric11-still * { animation: none !important; }",
  ".isometric11-still .isometric11-rest { opacity: 1; }",
  "@media (prefers-reduced-motion: reduce) { [class*='isometric11-pulse'], .isometric11-beat { animation: none; } .isometric11-rest { opacity: 1; } }",
].join("\n");

const LINE: Record<Palette, string> = {
  theme: "stroke-foreground/20",
  light: "stroke-zinc-950/20",
  dark: "stroke-white/25",
  tone: "stroke-white/50",
};
const DOT: Record<Palette, string> = {
  theme: "fill-foreground/40",
  light: "fill-zinc-950/40",
  dark: "fill-white/60",
  tone: "fill-white",
};

export function Isometric11({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric11Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const pulse = accent ? paint.accent.base : DOT[palette];
  const hubX = HUB.x - HUB.size / 2;
  const hubY = HUB.y - HUB.size / 2;
  const solids = NODES.map((node) => ({ key: `${node.x}-${node.y}`, x: node.x - NODE / 2, y: node.y - NODE / 2, size: NODE, height: NODE_H, hub: false }));
  const hub = { key: "hub", x: hubX, y: hubY, size: HUB.size, height: HUB.height, hub: true };
  const solid = (item: (typeof solids)[number]) => {
    const surface = item.hub ? paint.accent : paint.body;
    return (
      <g key={item.key}>
        <Block faces={box(item.x, item.y, BASE, item.size, item.size, item.height)} paint={surface} />
        <g transform={onTop(BASE + item.height)}>
          <circle cx={item.x + item.size / 2} cy={item.y + item.size / 2} r={item.hub ? 7 : 4} className={cn(surface.ink, item.hub && "isometric11-beat")} />
        </g>
      </g>
    );
  };

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric11-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-166 -50 332 246" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, PLATE, PLATE, BASE)} paint={paint.body} />
        <g transform={onTop(BASE)} className={paint.body.ink}>
          {GRID.map((dot) => (
            <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={1.6} />
          ))}
        </g>
        {solids.map(solid)}
        <g fill="none" strokeWidth={1.5} strokeLinecap="round" className={LINE[palette]}>
          {LINKS.map((link) => (
            <path key={link.d} d={link.d} />
          ))}
        </g>
        {solid(hub)}
        {LINKS.map((link, index) => (
          <circle
            key={link.d}
            cx={link.mid[0]}
            cy={link.mid[1]}
            r={3.5}
            className={cn(`isometric11-pulse-${index} opacity-0`, index === 1 && "isometric11-rest", pulse)}
            style={{ animationDelay: `${index * -0.56}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
