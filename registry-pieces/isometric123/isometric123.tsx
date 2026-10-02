"use client";

import type { ReactNode } from "react";
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

interface Isometric123Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, or takes the tone. */
  palette?: Palette;
  /** Color the hood with the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric123Demo: Isometric123Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const FLOOR = 6;
const Y0 = 14;
const Y1 = 38;
const MID = (Y0 + Y1) / 2;
const HALF = (Y1 - Y0) / 2;
const WHEEL_R = 12;
const AXLE_Z = FLOOR + WHEEL_R;
const WHEELS = [22, 62];
const SLICES = Array.from({ length: Y1 - Y0 + 1 }, (_, index) => Y0 + index);
// The fills are cut twice as fine as the outlines so the rounded ends stay smooth
const FINE = Array.from({ length: 2 * (Y1 - Y0) + 1 }, (_, index) => Y0 + index / 2);
const SIDE = 4;
const PIVOT = { x: 42, z: 30 };
// Side profiles are drawn in planes of constant y, in (x, -z); stacked across the depth they make the solid
const RIM = { x: 41, z: 46 };
const TUB = "M10 -46H72C73 -36 67 -27 56 -27H26C15 -27 9 -36 10 -46Z";
const BOW = "M72 -44C72 -35 66 -27 56 -27H50C60 -28 66 -35 66 -44Z";
/** How much a slice shrinks toward the two ends of the body, so the tub and hood are rounded in depth. */
const girth = (offset: number) => (1 - (Math.abs(offset) / (HALF + 1.5)) ** 3) ** (1 / 3);
const HINGE = { x: 31, z: 46 };
const HOOD_R = 22;
const SHELL = 2.6;
const HOOD_END = 285;
const polar = (r: number, degrees: number) => `${(r * Math.cos((degrees * Math.PI) / 180)).toFixed(2)} ${(r * Math.sin((degrees * Math.PI) / 180)).toFixed(2)}`;
const SECTOR = `M0 0L${-HOOD_R} 0A${HOOD_R} ${HOOD_R} 0 0 1 ${polar(HOOD_R, HOOD_END)}Z`;
const arcBand = (inner: number, outer: number) => `M${-outer} 0A${outer} ${outer} 0 0 1 ${polar(outer, HOOD_END)}L${polar(inner, HOOD_END)}A${inner} ${inner} 0 0 0 ${-inner} 0Z`;
const SHELL_OUT = arcBand(HOOD_R - SHELL / 2, HOOD_R);
const SHELL_IN = arcBand(HOOD_R - SHELL, HOOD_R - SHELL / 2);
const SHELL_ALL = arcBand(HOOD_R - SHELL, HOOD_R);
const RIB_ANGLES = [206, 232, 258];
// Folds of the hood: wedges on the side panel and small ridges across the canopy
const PANEL_RIBS = RIB_ANGLES.map((degrees) => `M0 0L${polar(HOOD_R - 1, degrees - 1.6)}L${polar(HOOD_R - 1, degrees + 1.6)}Z`).join("");
const CANOPY_RIBS = RIB_ANGLES.map((degrees) => `M${polar(HOOD_R - 1.2, degrees - 2)}L${polar(HOOD_R + 0.5, degrees - 2)}L${polar(HOOD_R + 0.5, degrees + 2)}L${polar(HOOD_R - 1.2, degrees + 2)}Z`).join("");
/** A round bar bent along a quadratic curve, as an outline in (x, -z). */
function bent(from: [number, number], via: [number, number], to: [number, number], width: number) {
  const points = Array.from({ length: 13 }, (_, index) => {
    const k = index / 12;
    const x = (1 - k) ** 2 * from[0] + 2 * k * (1 - k) * via[0] + k ** 2 * to[0];
    const z = (1 - k) ** 2 * from[1] + 2 * k * (1 - k) * via[1] + k ** 2 * to[1];
    const dx = 2 * (1 - k) * (via[0] - from[0]) + 2 * k * (to[0] - via[0]);
    const dz = 2 * (1 - k) * (via[1] - from[1]) + 2 * k * (to[1] - via[1]);
    const length = Math.hypot(dx, dz) || 1;
    return { x, z, nx: (-dz / length) * (width / 2), nz: (dx / length) * (width / 2) };
  });
  const edge = (sign: number) => points.map((point) => `${(point.x + sign * point.nx).toFixed(2)} ${(-(point.z + sign * point.nz)).toFixed(2)}`);
  return `M${[...edge(1), ...edge(-1).reverse()].join("L")}Z`;
}
const GRIP = { x: -7, z: 73, r: 2.4 };
const ARM = bent([13, 43], [3, 50], [GRIP.x, GRIP.z], 3);
const ARM_AT = 10;
// The chassis: a bar between the axles and a C spring from each axle up to the body
const SPRINGS = [bent([WHEELS[0] ?? 0, AXLE_Z], [(WHEELS[0] ?? 0) - 1, 31], [34, 28], 2.4), bent([WHEELS[1] ?? 0, AXLE_Z], [(WHEELS[1] ?? 0) + 1, 31], [50, 28], 2.4)].join(" ");
const AXLE_BAR = `M${WHEELS[0]} ${-AXLE_Z - 1.2}H${WHEELS[1]}V${-AXLE_Z + 1.2}H${WHEELS[0]}Z`;
const ring = (outer: number, inner: number) =>
  `M${-outer} 0A${outer} ${outer} 0 1 0 ${outer} 0A${outer} ${outer} 0 1 0 ${-outer} 0Z M${-inner} 0A${inner} ${inner} 0 1 1 ${inner} 0A${inner} ${inner} 0 1 1 ${-inner} 0Z`;
const TIRE = ring(WHEEL_R, WHEEL_R - 2.6);
const WHEEL_RIM = ring(WHEEL_R - 2.6, WHEEL_R - 4);
const SPOKES = [0, 45, 90, 135];

const STYLES = `
@keyframes isometric123-rock { 0%, 100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); } }
.isometric123-rock { transform-origin: 0 0; animation: isometric123-rock 4s ease-in-out infinite; }
.isometric123-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { .isometric123-rock { animation: none; } }
`;

export function Isometric123({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric123Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const body = paint.body;
  const hood = paint.accent;
  const fold = accent ? hood.ink : body.ink;
  const outline = (d: string) => <path d={d} fill="none" strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={body.edge} />;
  // The body rocks on its springs about a pivot over the chassis; the wheels stay planted
  const rock = (y: number, children: ReactNode) => (
    <g key={y} transform={onLeft(y)}>
      <g transform={`translate(${PIVOT.x} ${-PIVOT.z})`}>
        <g className="isometric123-rock">
          <g transform={`translate(${-PIVOT.x} ${PIVOT.z})`}>{children}</g>
        </g>
      </g>
    </g>
  );
  const tubAt = (offset: number) => {
    const k = girth(offset);
    return `translate(${RIM.x} ${-RIM.z}) scale(${(0.85 + 0.15 * k).toFixed(3)} ${k.toFixed(3)}) translate(${-RIM.x} ${RIM.z})`;
  };
  const hoodAt = (offset: number) => `translate(${HINGE.x} ${-HINGE.z}) scale(${girth(offset).toFixed(3)})`;
  const panel = (offset: number) => Math.abs(offset) >= HALF - 2;
  const arm = (offset: number) => Math.abs(Math.abs(offset) - ARM_AT) <= 1;

  const tub = (offset: number) => (
    <g transform={tubAt(offset)}>
      <path d={TUB} className={body.base} />
      {offset >= 6 && <path d={TUB} className={body.left} />}
      <path d={BOW} className={body.right} />
      {Math.abs(offset) <= HALF - 3 && (
        <>
          <rect x={14} y={-46} width={54} height={2.5} className={body.ink} />
          <rect x={34} y={-46.5} width={31} height={3} rx={1} className={body.base} />
        </>
      )}
      {offset === HALF && <rect x={30} y={-41} width={30} height={2.5} rx={1.25} className={body.ink} />}
    </g>
  );
  const canopy = (offset: number) => (
    <g transform={hoodAt(offset)}>
      {panel(offset) ? (
        <>
          <path d={SECTOR} className={hood.base} />
          <path d={SECTOR} className={offset < 0 ? hood.right : hood.left} />
          {offset === HALF && <path d={PANEL_RIBS} className={fold} />}
        </>
      ) : (
        <>
          <path d={SHELL_IN} className={hood.base} />
          <path d={SHELL_IN} className={hood.right} />
          <path d={SHELL_OUT} className={hood.base} />
          <path d={CANOPY_RIBS} className={fold} />
        </>
      )}
    </g>
  );
  const handle = (offset: number) => (
    <>
      {arm(offset) && (
        <>
          <path d={ARM} className={body.base} />
          <path d={ARM} className={offset > 0 ? body.left : body.right} />
        </>
      )}
      {Math.abs(offset) <= ARM_AT + 1 && (
        <>
          <circle cx={GRIP.x} cy={-GRIP.z} r={GRIP.r} className={body.base} />
          <circle cx={GRIP.x} cy={-GRIP.z} r={GRIP.r} className={offset === ARM_AT + 1 ? body.left : body.right} />
        </>
      )}
    </>
  );
  const wheel = (x: number, front: boolean) => (
    <g key={x} transform={`translate(${x} ${-AXLE_Z})`}>
      <path d={TIRE} className={body.base} />
      <path d={TIRE} className={front ? body.ink : body.right} />
      {!front && <path d={TIRE} className={body.ink} />}
      <path d={WHEEL_RIM} className={body.base} />
      {!front && <path d={WHEEL_RIM} className={body.right} />}
      {front && (
        <g className={body.edge} strokeWidth={1} fill="none">
          <circle r={WHEEL_R} vectorEffect="non-scaling-stroke" />
          <circle r={WHEEL_R - 4} vectorEffect="non-scaling-stroke" />
        </g>
      )}
      {front && SPOKES.map((degrees) => <rect key={degrees} x={-(WHEEL_R - 4)} y={-0.45} width={2 * (WHEEL_R - 4)} height={0.9} transform={`rotate(${degrees})`} className={body.ink} />)}
      <circle r={2.8} className={body.base} />
      <circle r={2.8} className={front ? body.left : body.right} />
      {front && <circle r={2.8} fill="none" strokeWidth={1} vectorEffect="non-scaling-stroke" className={body.edge} />}
      {front && <circle r={1} className={body.ink} />}
    </g>
  );
  // One side of the chassis: wheels, the bar between them and the springs, a few slices thick
  const side = (from: number) =>
    Array.from({ length: SIDE }, (_, index) => {
      const front = index === SIDE - 1;
      return (
        <g key={index} transform={onLeft(from + index)}>
          <path d={AXLE_BAR} className={body.base} />
          <path d={AXLE_BAR} className={front ? body.left : body.right} />
          <path d={SPRINGS} className={body.base} />
          <path d={SPRINGS} className={front ? body.left : body.right} />
          {front && <path d={SPRINGS} fill="none" strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" className={body.edge} />}
          {WHEELS.map((x) => wheel(x, front))}
        </g>
      );
    });

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric123-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-60 -82 138 156" aria-hidden="true" className="size-full overflow-visible">
        <Block faces={box(-8, 2, 0, 92, 48, FLOOR)} paint={body} />
        <g transform={onTop(FLOOR)}>
          <ellipse cx={42} cy={MID} rx={32} ry={13} className={body.left} />
        </g>
        {side(Y0 - SIDE - 1)}
        {SLICES.map((y) => (
          <g key={y} transform={onLeft(y)}>
            {WHEELS.map((x) => (
              <g key={x}>
                <circle cx={x} cy={-AXLE_Z} r={1.4} className={body.base} />
                <circle cx={x} cy={-AXLE_Z} r={1.4} className={body.right} />
              </g>
            ))}
          </g>
        ))}
        {SLICES.map((y) =>
          rock(
            y,
            <>
              <g transform={tubAt(y - MID)}>{outline(TUB)}</g>
              <g transform={hoodAt(y - MID)}>{outline(panel(y - MID) ? SECTOR : SHELL_ALL)}</g>
              {arm(y - MID) && outline(ARM)}
              {Math.abs(y - MID) <= ARM_AT + 1 && <circle cx={GRIP.x} cy={-GRIP.z} r={GRIP.r} fill="none" strokeWidth={2} vectorEffect="non-scaling-stroke" className={body.edge} />}
            </>,
          ),
        )}
        {FINE.map((y) => rock(y, tub(y - MID)))}
        {FINE.map((y) =>
          rock(
            y,
            <>
              {handle(y - MID)}
              {canopy(y - MID)}
            </>,
          ),
        )}
        {side(Y1 + 2)}
      </svg>
    </div>
  );
}
