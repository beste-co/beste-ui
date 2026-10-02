"use client";

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

interface Isometric47Props {
  tone?: Tone;
  /** Hex color the piece takes when tone is "color". */
  color?: string;
  /** Body color: follows the theme, stays light or dark, takes the tone, or turns see-through over whatever is behind it. */
  palette?: Palette;
  /** Bind the top book in the tone; off keeps the piece one color. */
  accent?: boolean;
  animated?: boolean;
  className?: string;
}

export const isometric47Demo: Isometric47Props = {
  tone: "color",
  color: "#2F6FED",
  palette: "theme",
  accent: true,
  animated: true,
};

const STACK = [
  { x: 0, y: 0, z: 0, w: 100, d: 70, h: 14, pages: "left" },
  { x: 6, y: 6, z: 14, w: 90, d: 60, h: 12, pages: "right" },
  { x: 2, y: 10, z: 26, w: 94, d: 56, h: 12, pages: "left" },
] as const;
const BASE = 38;
const HINGE = 47;
const COVER_W = 46;
const PAGE_W = 43;
const Y0 = 10;
const Y1 = 60;
const TOP = BASE + 12;
const THICK = 2;
// Both leaves turn about one fixed line: the spine edge on top of the page block
const HINGE_Z = TOP - THICK;
const DEPTH = Y1 - Y0;
const INSET = 2;
const PERIOD = 6.4;
// Opened, the cover lies flat on the closed book beside it, whose top sits one board thickness under the hinge
const COVER_OPEN = 180;
const REST_BOOK = { x: 1, y: Y0, w: HINGE - 1, d: DEPTH + 2, z: BASE, h: HINGE_Z - THICK - BASE };
// The leaves riffle over one after another; each lands a hair above the one before it
const LEAVES = [0, 1, 2, 3, 4];
const LEAF_TURN = 5;
const LEAF_GAP = 2.5;

type Stop = [number, number];
const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
const unease = (r: number) => (r < 0.5 ? Math.sqrt(r / 2) : 1 - Math.sqrt((1 - r) / 2));
/** [percent, angle] stops of a leaf that opens over t0..t1 and closes over t2..t3, with a stop exactly on every mark. */
function swing(open: number, [t0, t1, t2, t3]: [number, number, number, number], marks: number[], steps = 24): Stop[] {
  const ks = [...Array.from({ length: steps - 1 }, (_, index) => (index + 1) / steps), ...marks.map((mark) => unease(mark / open))].sort((a, b) => a - b);
  return [
    [0, 0],
    [t0, 0],
    ...ks.map((k): Stop => [t0 + k * (t1 - t0), open * ease(k)]),
    [t1, open],
    [t2, open],
    ...ks.map((k): Stop => [t2 + (1 - k) * (t3 - t2), open * ease(k)]).reverse(),
    [t3, 0],
    [100, 0],
  ];
}
// Faces swap where a leaf is edge-on to the viewer (45 and 135 degrees) and where it passes upright (90)
const COVER_STOPS = swing(COVER_OPEN, [6, 26, 82, 96], [45, 90, 135]);
// Leaf 0 is the top one: first over, last back
const LEAF_STOPS = LEAVES.map((leaf) => {
  const out = 27 + leaf * LEAF_GAP;
  const back = 64 + (LEAVES.length - 1 - leaf) * LEAF_GAP;
  return swing(179.4 - leaf * 0.9, [out, out + LEAF_TURN, back, back + LEAF_TURN], [45, 90], 10);
});
const leafName = (leaf: number) => `isometric47-l${leaf}`;
const n = (value: number) => value.toFixed(4);
/** Keyframes that carry cos and sin of a leaf angle; every face derives its matrix from them, so edges cannot drift apart. */
const turn = (name: string, stops: Stop[]) =>
  `@keyframes ${name} { ${stops.map(([at, angle]) => `${at.toFixed(2)}% { --${name}-c: ${n(Math.cos((angle * Math.PI) / 180))}; --${name}-s: ${n(Math.sin((angle * Math.PI) / 180))}; }`).join(" ")} }`;
/** Step keyframes that show a face only while the leaf angle is inside [from, to). */
function show(name: string, stops: Stop[], from: number, to: number) {
  const frames = stops.map(([at, angle], index) => {
    const mid = (angle + (stops[index + 1]?.[1] ?? angle)) / 2;
    return `${at.toFixed(2)}% { opacity: ${mid >= from && mid < to ? 1 : 0}; }`;
  });
  return `@keyframes ${name} { ${frames.join(" ")} }\n.${name} { animation: ${name} ${PERIOD}s step-end infinite; }`;
}
type Axis = "along" | "out" | "depth";
// Screen directions of a leaf's own axes as [k, cos, sin] parts for x and y
const AXES: Record<Axis, [[number, number, number], [number, number, number]]> = {
  along: [[0, C, 0], [0, S, -1]],
  out: [[0, 0, -C], [0, -1, -S]],
  depth: [[-C, 0, 0], [S, 0, 0]],
};
/** The matrix of a face whose corner sits (u along, m out, dy deep) from the hinge, spanned by two leaf axes. */
function face(leaf: string, u: number, m: number, dy: number, a: Axis, b: Axis) {
  const mix = (k: number, c: number, s: number) => `calc(${n(k)} + ${n(c)} * var(--${leaf}-c) + ${n(s)} * var(--${leaf}-s))`;
  const e = (HINGE - Y0) * C;
  const f = (HINGE + Y0) * S - HINGE_Z;
  const [ax, ay] = AXES[a];
  const [bx, by] = AXES[b];
  return `matrix(${mix(...ax)}, ${mix(...ay)}, ${mix(...bx)}, ${mix(...by)}, ${mix(e - dy * C, u * C, -m * C)}, ${mix(f + dy * S, u * S - m, -u - m * S)})`;
}
const FACES: Record<string, string> = {
  "isometric47-outer": face("isometric47-cover", 0, THICK, 0, "along", "depth"),
  "isometric47-inner": face("isometric47-cover", 0, 0, 0, "along", "depth"),
  "isometric47-free": face("isometric47-cover", COVER_W, 0, 0, "out", "depth"),
  "isometric47-spine": face("isometric47-cover", 0, 0, 0, "out", "depth"),
  "isometric47-end": face("isometric47-cover", 0, 0, DEPTH, "along", "out"),
  ...Object.fromEntries(LEAVES.map((leaf) => [`${leafName(leaf)}-face`, face(leafName(leaf), 0, 0, INSET, "along", "depth")])),
};
const register = (name: string) => `@property --${name}-c { syntax: "<number>"; inherits: true; initial-value: 1; }\n@property --${name}-s { syntax: "<number>"; inherits: true; initial-value: 0; }`;

const STYLES = [
  register("isometric47-cover"),
  ...LEAVES.map((leaf) => register(leafName(leaf))),
  turn("isometric47-cover", COVER_STOPS),
  ...LEAVES.map((leaf) => turn(leafName(leaf), LEAF_STOPS[leaf] ?? [])),
  `.isometric47-book { animation: ${["isometric47-cover", ...LEAVES.map(leafName)].map((name) => `${name} ${PERIOD}s linear infinite`).join(", ")}; }`,
  ...Object.entries(FACES).map(([name, matrix]) => `.${name} { transform: ${matrix}; }`),
  // Before upright a leaf is drawn over the page block, after it behind; each face shows while it faces the viewer
  show("isometric47-near-outer", COVER_STOPS, 0, 45),
  show("isometric47-near-inner", COVER_STOPS, 45, 90),
  show("isometric47-near-side", COVER_STOPS, 0, 90),
  show("isometric47-far-inner", COVER_STOPS, 90, 360),
  show("isometric47-far-free", COVER_STOPS, 90, 135),
  show("isometric47-far-spine", COVER_STOPS, 135, 360),
  show("isometric47-far-side", COVER_STOPS, 90, 360),
  ...LEAVES.flatMap((leaf) => [
    show(`${leafName(leaf)}-top`, LEAF_STOPS[leaf] ?? [], 0, 45),
    show(`${leafName(leaf)}-under`, LEAF_STOPS[leaf] ?? [], 45, 90),
    show(`${leafName(leaf)}-far`, LEAF_STOPS[leaf] ?? [], 90, 360),
  ]),
  ".isometric47-still, .isometric47-still * { animation: none !important; }",
  "@media (prefers-reduced-motion: reduce) { [class*=\"isometric47-\"] { animation: none !important; } }",
].join("\n");

export function Isometric47({ tone = "color", color = DEFAULT_COLOR, palette: paletteProp = "theme", accent: accentProp = true, animated = true, className }: Isometric47Props) {
  // "No tone" drops the tone color everywhere; colors that belong to the object itself stay
  const accent = accentProp && tone !== "none";
  const palette: Palette = tone === "none" && paletteProp === "tone" ? "theme" : paletteProp;
  const paint = paints(palette, accent, tone, color);
  const cover = paint.accent;
  const page = paint.body;
  const hidden = "opacity-0";
  const board = (shade: string, w: number, h: number) => (
    <>
      <rect width={w} height={h} className={cover.base} />
      <rect width={w} height={h} className={shade} stroke="none" />
    </>
  );
  const inner = (
    <>
      {board(cover.left, COVER_W, DEPTH)}
      <rect x={4} y={4} width={COVER_W - 8} height={DEPTH - 8} rx={1.5} className={cover.ink} stroke="none" />
      <rect x={0} y={0} width={1.5} height={DEPTH} className={cover.right} stroke="none" />
    </>
  );
  const sheet = (shade?: string) => (
    <>
      <rect width={PAGE_W} height={DEPTH - INSET * 2} className={page.base} />
      {shade && <rect width={PAGE_W} height={DEPTH - INSET * 2} className={shade} stroke="none" />}
    </>
  );
  const SHEET_D = DEPTH - INSET * 2;
  // The front of a leaf carries text; its back alternates between text and a picture block, the last one under a heading in the tone
  const text = (
    <g className={page.ink} stroke="none">
      {[0, 1, 2, 3, 4].map((line) => (
        <rect key={line} x={7 + line * 6} y={6} width={2.5} height={line % 2 ? 26 : 34} rx={1} />
      ))}
    </g>
  );
  const back = (leaf: number) =>
    leaf === LEAVES.length - 1 ? (
      <g stroke="none">
        <rect x={7} y={6} width={4} height={SHEET_D - 12} rx={1.5} className={cover.base} />
        <g className={page.ink}>
          {[0, 1, 2, 3].map((line) => (
            <rect key={line} x={16 + line * 6} y={6} width={2.5} height={line % 2 ? 24 : 32} rx={1} />
          ))}
        </g>
      </g>
    ) : leaf % 2 ? (
      <rect x={8} y={7} width={PAGE_W - 16} height={SHEET_D - 14} rx={2} className={page.ink} stroke="none" />
    ) : (
      text
    );
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", toneClasses[tone], !animated && "isometric47-still", className)} style={tone === "color" ? { color } : undefined}>
      <style>{STYLES}</style>
      <svg viewBox="-68 -74 164 164" aria-hidden="true" className="isometric47-book size-full overflow-visible">
        {STACK.map((book) => (
          <Block key={book.z} faces={box(book.x, book.y, book.z, book.w, book.d, book.h)} paint={paint.body} />
        ))}
        {STACK.map((book) =>
          book.pages === "left" ? (
            <g key={`p${book.z}`} transform={onLeft(book.y + book.d)} className={paint.body.ink}>
              <rect x={book.x + 3} y={-book.z - book.h + 3} width={book.w - 3} height={book.h - 6} />
            </g>
          ) : (
            <g key={`p${book.z}`} transform={onRight(book.x + book.w)} className={paint.body.ink}>
              <rect x={book.y + 3} y={-book.z - book.h + 3} width={book.d - 3} height={book.h - 6} />
            </g>
          ),
        )}
        <Block faces={box(REST_BOOK.x, REST_BOOK.y, REST_BOOK.z, REST_BOOK.w, REST_BOOK.d, REST_BOOK.h)} paint={paint.body} />
        <g transform={onLeft(REST_BOOK.y + REST_BOOK.d)} className={paint.body.ink}>
          <rect x={REST_BOOK.x + 3} y={-REST_BOOK.z - REST_BOOK.h + 2} width={REST_BOOK.w - 3} height={REST_BOOK.h - 4} />
        </g>
        <Block faces={box(HINGE, Y0, BASE, COVER_W, Y1 - Y0, 2)} paint={cover} />
        <g className={cover.edge} strokeWidth={1} strokeLinejoin="round">
          <g className={cn("isometric47-inner isometric47-far-inner", hidden)}>{inner}</g>
          <g className={cn("isometric47-free isometric47-far-free", hidden)}>{board(cover.right, THICK, DEPTH)}</g>
          <g className={cn("isometric47-spine isometric47-far-spine", hidden)}>{board(cover.right, THICK, DEPTH)}</g>
          <g className={cn("isometric47-end isometric47-far-side", hidden)}>{board(cover.left, COVER_W, THICK)}</g>
        </g>
        {/* Turned leaves lie on the open cover, the first one over lowest */}
        {LEAVES.map((leaf) => (
          <g key={leaf} className={cn(`${leafName(leaf)}-face ${leafName(leaf)}-far`, hidden, page.edge)} strokeWidth={1} strokeLinejoin="round">
            {sheet()}
            {back(leaf)}
          </g>
        ))}
        <Block faces={box(HINGE + 1, Y0 + 2, BASE + 2, COVER_W - 3, Y1 - Y0 - 4, 8)} paint={page} />
        <g transform={onLeft(Y1 - 2)} className={page.ink}>
          <rect x={HINGE + 1} y={-TOP + 4} width={COVER_W - 3} height={1} />
          <rect x={HINGE + 1} y={-TOP + 6.5} width={COVER_W - 3} height={1} />
        </g>
        <g transform={onTop(TOP - 2)} className={page.ink}>
          {[0, 1, 2, 3, 4].map((line) => (
            <rect key={line} x={HINGE + 8 + line * 6} y={Y0 + 8} width={2.5} height={line % 2 ? 26 : 34} rx={1} />
          ))}
        </g>
        <g className={page.edge} strokeWidth={1} strokeLinejoin="round">
          {/* Leaves still on the block, the top one last: seen from above until edge-on, then from below */}
          {[...LEAVES].reverse().map((leaf) => (
            <g key={leaf}>
              <g className={`${leafName(leaf)}-face ${leafName(leaf)}-top`}>
                {sheet()}
                {leaf === 0 ? (
                  <g className={page.ink} stroke="none">
                    <rect x={18} y={12} width={3} height={SHEET_D - 24} rx={1.5} />
                    <rect x={24} y={17} width={2} height={SHEET_D - 34} rx={1} />
                  </g>
                ) : (
                  text
                )}
              </g>
              <g className={cn(`${leafName(leaf)}-face ${leafName(leaf)}-under`, hidden)}>
                {sheet(page.right)}
                {back(leaf)}
              </g>
            </g>
          ))}
        </g>
        <g className={cover.edge} strokeWidth={1} strokeLinejoin="round">
          <g className={cn("isometric47-inner isometric47-near-inner", hidden)}>{inner}</g>
          <g className="isometric47-free isometric47-near-side">{board(cover.right, THICK, DEPTH)}</g>
          <g className="isometric47-end isometric47-near-side">{board(cover.left, COVER_W, THICK)}</g>
          <g className="isometric47-outer isometric47-near-outer">
            <rect width={COVER_W} height={DEPTH} className={cover.base} />
            <rect x={36} y={10} width={3} height={DEPTH - 20} rx={1.5} className={cover.ink} stroke="none" />
          </g>
        </g>
      </svg>
    </div>
  );
}
