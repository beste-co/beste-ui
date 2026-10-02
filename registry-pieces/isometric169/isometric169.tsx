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

interface Isometric169Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the bucket with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric169Demo: Isometric169Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const G = 6;
const GROUND = { w: 146, d: 68 };
const HOUSE_Z = G + 12;
const HOUSE_TOP = HOUSE_Z + 22;
// The arm works in the plane y = 34; angles run clockwise from straight up
const PIN = { x: 62, z: HOUSE_TOP + 2 };
const BOOM = 52;
const STICK = 34;
const ARM_Y = [31, 37] as const;
const BUCKET_Y = [28, 40] as const;
const LAYERS = Array.from({ length: BUCKET_Y[1] - BUCKET_Y[0] + 1 }, (_, index) => BUCKET_Y[0] + index);
// Joint angles relative to the part before, per pose
const REACH = { boom: 50, stick: 100, bucket: -20 };
const DIG = { boom: 62, stick: 96, bucket: -20 };
const CURL = { boom: 62, stick: 96, bucket: 50 };
const CARRY = { boom: 38, stick: 102, bucket: 50 };
type Joint = keyof typeof REACH;
// A low leveled heap: its top sits just under the bucket's teeth
const PILE = { x: 122, y: 34, r: 20, h: 12 };
const HEAP = Array.from({ length: PILE.h + 1 }, (_, z) => ({ z: G + z, r: PILE.r * Math.cos(Math.asin((z / PILE.h) * 0.8)) }));
const GRAINS = [
  [-6, -4],
  [3, -7],
  [7, 2],
  [-2, 5],
  [-8, 3],
  [1, -1],
] as const;
const SCOOP = "-3,2 -8,-5 -8,-12 -2,-17 7,-17 4,2";
const DIRT = "4.5,0 9,-5 9.5,-12 6.5,-16";

const turn = (joint: Joint) => {
  const at = (pose: Record<Joint, number>) => `{ transform: rotate(${pose[joint] - REACH[joint]}deg); }`;
  return `@keyframes isometric169-${joint} { 0%, 8% ${at(REACH)} 20% ${at(DIG)} 30% ${at(CURL)} 46%, 68% ${at(CARRY)} 82% ${at(CURL)} 91% ${at(DIG)} 100% ${at(REACH)} }`;
};

const STYLES = `
${turn("boom")}
${turn("stick")}
${turn("bucket")}
@keyframes isometric169-dirt { 0%, 22% { opacity: 0; } 28%, 84% { opacity: 1; } 89%, 100% { opacity: 0; } }
.isometric169-boom { animation: isometric169-boom 8s ease-in-out infinite; }
.isometric169-stick { animation: isometric169-stick 8s ease-in-out infinite; }
.isometric169-bucket { animation: isometric169-bucket 8s ease-in-out infinite; }
.isometric169-dirt { animation: isometric169-dirt 8s linear infinite; }
.isometric169-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric169-boom, .isometric169-stick, .isometric169-bucket, .isometric169-dirt { animation: none; } }
`;

/** One arm segment drawn upward from its pin, as a slice of the extruded beam. */
function Beam({ length, width, face, paint }: { length: number; width: number; face: boolean; paint: Paint }) {
  const rect = { x: -width / 2, y: -length - width / 2, width, height: length + width, rx: width / 2 };
  return (
    <g className={paint.edge} strokeWidth={1}>
      <rect {...rect} className={paint.base} stroke={face ? undefined : "none"} />
      <rect {...rect} className={face ? paint.left : paint.right} stroke="none" />
      {face && <circle r={2} className={paint.ink} stroke="none" />}
      {face && <circle cy={-length} r={2} className={paint.ink} stroke="none" />}
    </g>
  );
}

/** The boom, stick and bucket in the plane y: every slice turns about the same three pins. */
function Slice({ y, arm, bucket }: { y: number; arm: Paint; bucket: Paint }) {
  const beam = y >= ARM_Y[0] && y <= ARM_Y[1];
  const beamFace = y === ARM_Y[1];
  const bucketFace = y === BUCKET_Y[1];
  const inside = y > BUCKET_Y[0] && y < BUCKET_Y[1];
  return (
    <g transform={onLeft(y)}>
      <g transform={`translate(${PIN.x} ${-PIN.z}) rotate(${REACH.boom})`}>
        <g className="isometric169-boom">
          {beam && <Beam length={BOOM} width={8} face={beamFace} paint={arm} />}
          <g transform={`translate(0 ${-BOOM}) rotate(${REACH.stick})`}>
            <g className="isometric169-stick">
              {beam && <Beam length={STICK} width={6} face={beamFace} paint={arm} />}
              <g transform={`translate(0 ${-STICK}) rotate(${REACH.bucket})`}>
                <g className="isometric169-bucket">
                  {inside && (
                    <g className="isometric169-dirt opacity-0">
                      <polygon points={DIRT} className={arm.base} />
                      <polygon points={DIRT} className={arm.right} />
                    </g>
                  )}
                  <g className={bucket.edge} strokeWidth={1} strokeLinejoin="round">
                    <polygon points={SCOOP} className={bucket.base} stroke={bucketFace ? undefined : "none"} />
                    <polygon points={SCOOP} className={bucketFace ? bucket.left : bucket.right} stroke="none" />
                    {bucketFace && <circle r={1.5} className={bucket.ink} stroke="none" />}
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

// The part of a heap layer whose side faces right
const wedge = (r: number) => {
  const k = r * Math.SQRT1_2;
  return `M0 0L${k} ${-k}A${r} ${r} 0 0 1 ${k} ${k}Z`;
};

/** The sand heap as stacked discs: outlines first, fills over them, then the flat top. */
function Heap({ paint }: { paint: Paint }) {
  const top = HEAP[HEAP.length - 1];
  return (
    <g className={paint.edge} strokeWidth={1}>
      {HEAP.map(({ z, r }) => (
        <circle key={z} cx={PILE.x} cy={PILE.y} r={r} transform={onTop(z)} className={paint.base} />
      ))}
      {HEAP.map(({ z, r }) => (
        <g key={z} transform={`${onTop(z)} translate(${PILE.x} ${PILE.y})`} stroke="none">
          <circle r={r} className={paint.base} />
          <circle r={r} className={paint.left} />
          <path d={wedge(r)} className={paint.right} />
        </g>
      ))}
      {top && (
        <g transform={`${onTop(top.z)} translate(${PILE.x} ${PILE.y})`}>
          <circle r={top.r} className={paint.base} />
          <g className={paint.ink} stroke="none">
            {GRAINS.map(([x, y]) => (
              <circle key={`${x}:${y}`} cx={x} cy={y} r={1} />
            ))}
          </g>
        </g>
      )}
    </g>
  );
}

export function Isometric169({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric169Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const scoop = paint.accent;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric169-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-66 -40 200 154" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(0, 0, 0, GROUND.w, GROUND.d, G)} paint={body} />
        <Block faces={box(16, 12, G, 62, 12, 10)} paint={body} />
        <Block faces={box(26, 24, G + 3, 42, 20, 7)} paint={body} />
        <Block faces={box(16, 44, G, 62, 12, 10)} paint={body} />
        <g transform={onLeft(56)} className={body.ink}>
          {[23, 35, 47, 59, 71].map((x) => (
            <circle key={x} cx={x} cy={-(G + 5)} r={3} />
          ))}
        </g>
        <g transform={onTop(G + 10)} className={body.ink}>
          {[20, 28, 36, 44, 52, 60, 68].map((x) => (
            <rect key={x} x={x} y={46} width={3} height={8} rx={1} />
          ))}
        </g>
        <Block faces={box(22, 14, HOUSE_Z, 50, 40, 22)} paint={body} />
        <g transform={onLeft(54)} className={body.ink}>
          {[0, 1, 2].map((index) => (
            <rect key={index} x={26} y={-(HOUSE_Z + 16) + index * 5} width={14} height={2} rx={1} />
          ))}
        </g>
        <Block faces={box(26, 18, HOUSE_TOP, 4, 4, 10)} paint={body} />
        <Block faces={box(56, 30, HOUSE_TOP, 12, 8, 4)} paint={body} />
        <Heap paint={body} />
        {LAYERS.map((y) => (
          <Slice key={y} y={y} arm={body} bucket={scoop} />
        ))}
        <Block faces={box(44, 38, HOUSE_TOP, 22, 16, 20)} paint={body} />
        <g transform={onLeft(54)} className={body.ink}>
          <rect x={47} y={-(HOUSE_TOP + 17)} width={16} height={11} rx={1.5} />
        </g>
        <g transform={onRight(66)} className={body.ink}>
          <rect x={41} y={-(HOUSE_TOP + 17)} width={10} height={13} rx={1.5} />
        </g>
      </svg>
    </div>
  );
}
