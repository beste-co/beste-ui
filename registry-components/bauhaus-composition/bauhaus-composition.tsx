"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

export interface BauhausCompositionProps {
  /** Color of the bars, rules and dark forms. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color of the ground behind the composition. */
  paperColor?: string;
  /** The loud color, usually the big circle. */
  accentColor?: string;
  /** First muted color for quarter circles and squares. */
  secondaryColor?: string;
  /** Second muted color. */
  tertiaryColor?: string;
  /** Number of forms in the composition, 6 to 24. */
  shapes?: number;
  /** Seed for the cast of forms and every arrangement they move through. */
  seed?: number;
  /** Seconds each arrangement holds before the next one. */
  interval?: number;
  /** How briskly forms travel to their new place, 0 to 1. */
  stiffness?: number;
  /** Overshoot as they arrive, 0 (settled) to 1 (lively). */
  bounce?: number;
  /** Seconds between one form leaving and the next. */
  stagger?: number;
  /** How far forms lean away from the cursor, 0 to 1. */
  repel?: number;
  /** Columns of the modular grid the forms snap to. */
  columns?: number;
  /** One muted form prints over the others with multiply, like overlapping inks. */
  overprint?: boolean;
  /** Forms lean away from the cursor and a click moves to the next arrangement. */
  interactive?: boolean;
  /** Hold the current arrangement. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const bauhausCompositionDemo: BauhausCompositionProps = {
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  accentColor: "#d9412b",
  secondaryColor: "#e3b23c",
  tertiaryColor: "#2c5aa0",
  shapes: 14,
  seed: 7,
  interval: 4,
  stiffness: 0.5,
  bounce: 0.5,
  stagger: 0.06,
  repel: 0.5,
  columns: 12,
  overprint: true,
  interactive: true,
  className: "min-h-[32rem]",
};

type Kind = "circle" | "half" | "quarter" | "square" | "triangle" | "bar" | "rule";
type Role = "ink" | "accent" | "secondary" | "tertiary";

interface Shape {
  kind: Kind;
  role: Role;
  blend: boolean;
  lead: boolean;
}

interface Pose {
  x: number;
  y: number;
  r: number;
  s: number;
}

const WIDTH = 1200;
const RECIPE: Kind[] = [
  "circle",
  "bar",
  "quarter",
  "rule",
  "half",
  "square",
  "quarter",
  "bar",
  "triangle",
  "rule",
  "circle",
  "half",
  "bar",
  "square",
  "rule",
  "quarter",
  "triangle",
  "circle",
  "bar",
  "rule",
  "half",
  "square",
  "quarter",
  "rule",
];
const LAYER: Record<Kind, number> = { circle: 0, quarter: 1, half: 1, square: 2, triangle: 2, bar: 3, rule: 4 };

function random(seed: number) {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const clamp01 = (value: number) => clamp(value, 0, 1);
const INTRO = 2.4;
const smoother = (k: number) => k * k * k * (k * (k * 6 - 15) + 10);

function buildCast(count: number, seed: number): Shape[] {
  const rand = random(seed * 7919 + 13);
  const n = Math.round(clamp(count, 6, 24));
  let blended = false;
  const cast = RECIPE.slice(0, n).map((kind, index) => {
    const pick = rand();
    let role: Role = "ink";
    if (kind === "circle") role = index === 0 ? "accent" : pick < 0.5 ? "ink" : "tertiary";
    else if (kind === "quarter") role = pick < 0.5 ? "secondary" : "tertiary";
    else if (kind === "half") role = pick < 0.6 ? "ink" : "accent";
    else if (kind === "square") role = pick < 0.5 ? "tertiary" : "secondary";
    const blend = !blended && (role === "secondary" || role === "tertiary") && kind !== "circle";
    if (blend) blended = true;
    return { kind, role, blend, lead: index === 0, order: LAYER[kind] + rand() * 0.5 };
  });
  return cast.sort((a, b) => a.order - b.order).map(({ kind, role, blend, lead }) => ({ kind, role, blend, lead }));
}

// Rough radius used to keep forms from crowding each other
function reach(kind: Kind, size: number) {
  if (kind === "rule") return 0;
  if (kind === "bar") return size * 0.12;
  if (kind === "quarter") return size * 0.6;
  if (kind === "square") return size * 0.55;
  return size * 0.5;
}

function compose(cast: Shape[], index: number, seed: number, columns: number, height: number, previous?: Pose[]): Pose[] {
  const rand = random(seed * 1013 + index * 7919 + 1);
  const cols = Math.round(clamp(columns, 4, 24));
  const cell = WIDTH / cols;
  const step = cell / 2;
  const placed: { x: number; y: number; r: number }[] = [];
  const snap = (value: number) => Math.round(value / step) * step;

  return cast.map((shape, i) => {
    const before = previous?.[i];
    const turn = before?.r ?? 0;
    let best: Pose = { x: WIDTH / 2, y: height / 2, r: turn, s: cell };
    let bestScore = Number.POSITIVE_INFINITY;
    for (let attempt = 0; attempt < 10; attempt++) {
      let size = cell;
      let rotation = turn;
      switch (shape.kind) {
        case "circle":
          size = cell * (shape.lead ? 3.6 + rand() * 1.6 : 1 + rand() * 1.2);
          break;
        case "half":
        case "quarter":
          size = cell * (2 + rand() * 1.6);
          rotation = turn + ([-90, 0, 90, 180][Math.floor(rand() * 4)] ?? 0);
          break;
        case "triangle":
          size = cell * (1.4 + rand() * 1.1);
          rotation = turn + ([-90, 0, 90, 180][Math.floor(rand() * 4)] ?? 0);
          break;
        case "square":
          size = cell * (1 + rand() * 1.3);
          rotation = rand() < 0.7 ? turn : turn + 90;
          break;
        case "bar":
          size = cell * (4 + rand() * 4);
          rotation = rand() < 0.65 ? turn : turn + (rand() < 0.5 ? 90 : -90);
          break;
        case "rule":
          size = cell * (5 + rand() * (cols - 5));
          rotation = rand() < 0.65 ? turn : turn + (rand() < 0.5 ? 90 : -90);
          break;
      }
      const x = snap(cell * 0.5 + rand() * (WIDTH - cell));
      const y = snap(cell * 0.5 + rand() * Math.max(cell, height - cell));
      const radius = reach(shape.kind, size);
      let score = 0;
      for (const other of placed) {
        const overlap = radius + other.r - Math.hypot(x - other.x, y - other.y);
        if (overlap > 0) score += overlap;
      }
      // Keep the whole arrangement loosely centered so it reads balanced
      score += Math.abs(x - WIDTH / 2) * 0.04 + Math.abs(y - height / 2) * 0.04;
      if (score < bestScore) {
        bestScore = score;
        best = { x, y, r: rotation, s: size };
      }
    }
    placed.push({ x: best.x, y: best.y, r: reach(shape.kind, best.s) });
    return best;
  });
}

function transformFor(kind: Kind, pose: Pose, cell: number) {
  const sy = kind === "bar" ? cell * 0.32 : kind === "rule" ? 3 : pose.s;
  return `translate(${pose.x.toFixed(1)} ${pose.y.toFixed(1)}) rotate(${pose.r.toFixed(2)}) scale(${pose.s.toFixed(2)} ${sy.toFixed(2)})`;
}

function Form({ kind }: { kind: Kind }) {
  switch (kind) {
    case "circle":
      return <circle r="0.5" />;
    case "half":
      return <path d="M-0.5 0.25A0.5 0.5 0 0 1 0.5 0.25Z" />;
    case "quarter":
      return <path d="M-0.5 0.5L-0.5 -0.5A1 1 0 0 1 0.5 0.5Z" />;
    case "triangle":
      return <path d="M-0.5 0.43L0 -0.43L0.5 0.43Z" />;
    default:
      return <rect x="-0.5" y="-0.5" width="1" height="1" />;
  }
}

export function BauhausComposition({
  inkColor = "var(--foreground)",
  paperColor = "var(--background)",
  accentColor = "#d9412b",
  secondaryColor = "#e3b23c",
  tertiaryColor = "#2c5aa0",
  shapes = 14,
  seed = 7,
  interval = 4,
  stiffness = 0.5,
  bounce = 0.5,
  stagger = 0.06,
  repel = 0.5,
  columns = 12,
  overprint = true,
  interactive = true,
  paused = false,
  className,
  children,
}: BauhausCompositionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(800);
  const [reduce, setReduce] = useState(false);
  const [started, setStarted] = useState(false);
  const introPlayed = useRef(false);
  const heightRef = useRef(800);
  const settings = useRef({ interval, stiffness, bounce, stagger, repel, interactive, paused });
  settings.current = { interval, stiffness, bounce, stagger, repel, interactive, paused };
  const refresh = useRef<() => void>(() => {});

  const cols = Math.round(clamp(columns, 4, 24));
  const cell = WIDTH / cols;
  const cast = useMemo(() => buildCast(shapes, seed), [shapes, seed]);
  const initial = useMemo(() => compose(cast, 0, seed, cols, 800), [cast, seed, cols]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const host = svgRef.current;
    if (!root || !host) return;
    const nodes = Array.from(host.querySelectorAll<SVGGElement>("[data-form]"));
    const n = cast.length;
    const cur = new Float32Array(n * 4);
    const vel = new Float32Array(n * 4);
    const tgt = new Float32Array(n * 4);
    const queued = new Float32Array(n * 4);
    const switchAt = new Float32Array(n).fill(Number.POSITIVE_INFINITY);
    const order = new Uint8Array(n);
    const pose: Pose = { x: 0, y: 0, r: 0, s: 0 };
    initial.forEach((p, i) => {
      cur.set([p.x, p.y, p.r, p.s], i * 4);
      tgt.set([p.x, p.y, p.r, p.s], i * 4);
    });

    let index = 0;
    let clock = 0;
    let nextAt = settings.current.interval;
    let frame = 0;
    let last = 0;
    let visible = true;
    let quiet = 0;
    const pointer = { x: 0, y: 0, active: false };
    // Forms grow in one after another, biggest layers first, over the first 2.4 seconds
    let introT = introPlayed.current || reduce ? INTRO : 0;
    const grow = (i: number) => (introT >= INTRO ? 1 : smoother(clamp01((introT - (i / Math.max(1, n - 1)) * INTRO * 0.5) / (INTRO * 0.5))));

    const write = (i: number) => {
      const node = nodes[i];
      const shape = cast[i];
      if (!node || !shape) return;
      pose.x = cur[i * 4] ?? 0;
      pose.y = cur[i * 4 + 1] ?? 0;
      pose.r = cur[i * 4 + 2] ?? 0;
      const g = grow(i);
      pose.s = (cur[i * 4 + 3] ?? 0) * g;
      node.setAttribute("transform", transformFor(shape.kind, pose, cell));
      node.style.opacity = g < 1 ? g.toFixed(3) : "";
    };

    const targets = (): Pose[] =>
      cast.map((_, i) => ({ x: tgt[i * 4] ?? 0, y: tgt[i * 4 + 1] ?? 0, r: tgt[i * 4 + 2] ?? 0, s: tgt[i * 4 + 3] ?? 0 }));

    const schedule = (poses: Pose[], snapNow: boolean) => {
      for (let i = 0; i < n; i++) order[i] = i;
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const a = order[i] ?? 0;
        order[i] = order[j] ?? 0;
        order[j] = a;
      }
      const gap = Math.max(0, settings.current.stagger);
      for (let k = 0; k < n; k++) {
        const i = order[k] ?? 0;
        const p = poses[i];
        if (!p) continue;
        queued.set([p.x, p.y, p.r, p.s], i * 4);
        if (snapNow) {
          tgt.set([p.x, p.y, p.r, p.s], i * 4);
          cur.set([p.x, p.y, p.r, p.s], i * 4);
          vel.fill(0, i * 4, i * 4 + 4);
          switchAt[i] = Number.POSITIVE_INFINITY;
          write(i);
        } else {
          switchAt[i] = clock + k * gap;
        }
      }
    };

    const advance = () => {
      index++;
      schedule(compose(cast, index, seed, cols, heightRef.current, targets()), reduce);
      nextAt = clock + Math.max(1, settings.current.interval);
      quiet = 0;
    };

    const step = (dt: number) => {
      const s = settings.current;
      const k = 40 + clamp01(s.stiffness) * 200;
      const zeta = 1 - clamp01(s.bounce) * 0.7;
      const damp = 2 * zeta * Math.sqrt(k);
      const push = s.interactive && pointer.active ? clamp01(s.repel) * 90 : 0;
      const spread = 2 * 170 * 170;
      let motion = 0;
      for (let i = 0; i < n; i++) {
        if (clock >= (switchAt[i] ?? Number.POSITIVE_INFINITY)) {
          for (let c = 0; c < 4; c++) tgt[i * 4 + c] = queued[i * 4 + c] ?? 0;
          switchAt[i] = Number.POSITIVE_INFINITY;
        }
        const tx = tgt[i * 4] ?? 0;
        const ty = tgt[i * 4 + 1] ?? 0;
        let ox = 0;
        let oy = 0;
        if (push > 0) {
          const dx = tx - pointer.x;
          const dy = ty - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          const f = Math.exp(-(dist * dist) / spread) * push;
          ox = (dx / dist) * f;
          oy = (dy / dist) * f;
        }
        for (let c = 0; c < 4; c++) {
          const at = i * 4 + c;
          const goal = (tgt[at] ?? 0) + (c === 0 ? ox : c === 1 ? oy : 0);
          const x = cur[at] ?? 0;
          const v = vel[at] ?? 0;
          const nv = v + (k * (goal - x) - damp * v) * dt;
          vel[at] = nv;
          cur[at] = x + nv * dt;
          motion = Math.max(motion, Math.abs(nv) + Math.abs(goal - x));
        }
      }
      return motion;
    };

    const loop = (now: number) => {
      const elapsed = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const growing = introT < INTRO;
      if (growing) {
        introT = Math.min(INTRO, introT + elapsed);
        if (introT >= INTRO) introPlayed.current = true;
      }
      if (!settings.current.paused) {
        clock += elapsed;
        if (clock >= nextAt) advance();
      }
      let motion = 0;
      const sub = Math.max(1, Math.ceil(elapsed / (1 / 120)));
      for (let i = 0; i < sub; i++) motion = Math.max(motion, step(elapsed / sub));
      // Once everything has settled and nothing is pending, skip the DOM writes
      quiet = motion < 0.05 ? quiet + 1 : 0;
      if (quiet < 3 || growing) for (let i = 0; i < n; i++) write(i);
      frame = !settings.current.paused || introT < INTRO ? requestAnimationFrame(loop) : 0;
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      const running = (!reduce && !settings.current.paused) || introT < INTRO;
      if (running && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    refresh.current = play;

    const toView = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      // The viewBox is sliced to cover the box, so map through the covered scale
      const scale = Math.max(rect.width / WIDTH, rect.height / heightRef.current);
      const x = WIDTH / 2 + (event.clientX - rect.left - rect.width / 2) / scale;
      const y = heightRef.current / 2 + (event.clientY - rect.top - rect.height / 2) / scale;
      return { inside, x, y };
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const view = toView(event);
      pointer.active = view.inside;
      pointer.x = view.x;
      pointer.y = view.y;
      if (view.inside) quiet = 0;
    };
    const onDown = (event: PointerEvent) => {
      if (!settings.current.interactive) return;
      const target = event.target as Element | null;
      if (target?.closest("a, button, input, textarea, select, label")) return;
      if (!toView(event).inside) return;
      advance();
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(() => {
      const rect = root.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const next = Math.round(clamp((WIDTH * rect.height) / rect.width, 480, 2400));
      if (Math.abs(next - heightRef.current) < 8) return;
      heightRef.current = next;
      setHeight(next);
      schedule(compose(cast, index, seed, cols, next, targets()), reduce);
      quiet = 0;
    });
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    document.addEventListener("visibilitychange", onVisibility);
    for (let i = 0; i < n; i++) write(i);
    setStarted(true);
    play();

    return () => {
      cancelAnimationFrame(frame);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [cast, initial, seed, cols, cell, reduce]);

  useEffect(() => {
    refresh.current();
  }, [paused, interval, stiffness, bounce, stagger, repel, interactive]);

  const fills: Record<Role, string> = { ink: inkColor, accent: accentColor, secondary: secondaryColor, tertiary: tertiaryColor };

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      <div ref={svgRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0", !started && "opacity-0")}>
        <svg viewBox={`0 0 ${WIDTH} ${height}`} preserveAspectRatio="xMidYMid slice" className="size-full">
          {cast.map((shape, i) => {
            const pose = initial[i];
            return (
              <g
                key={`${seed}-${i}`}
                data-form=""
                transform={pose ? transformFor(shape.kind, pose, cell) : undefined}
                style={{ fill: fills[shape.role], mixBlendMode: overprint && shape.blend ? "multiply" : undefined }}
              >
                <Form kind={shape.kind} />
              </g>
            );
          })}
        </svg>
      </div>
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
