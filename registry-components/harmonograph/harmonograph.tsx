"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface HarmonographProps {
  /** Color of the ink line. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color of the plate the line is drawn on. */
  paperColor?: string;
  /** Seconds one figure takes to draw. */
  duration?: number;
  /** Seconds a finished figure rests before the next one begins drawing over its fading ghost. */
  hold?: number;
  /** Width of the ink line, in pixels. */
  lineWidth?: number;
  /** Strength of the ink, 0 to 1. Overlapping passes build up darker. */
  lineOpacity?: number;
  /** How slowly the pendulums settle, 0 (short, open figures) to 1 (long, dense rosettes). */
  damping?: number;
  /** How far the table turns under the pen, 0 (still table) to 1 (strong spiral). */
  spin?: number;
  /** Range of frequency ratios the pendulums pick from, 0 (simple loops) to 1 (intricate knots). */
  complexity?: number;
  /** How far the plate sways and leans toward the cursor, 0 (flat) to 1. */
  tilt?: number;
  /** Round plate; turn off for a square sheet. */
  round?: boolean;
  /** The plate leans toward the cursor and a click starts a new figure. */
  interactive?: boolean;
  /** Freeze the drawing and the sway where they are. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const harmonographDemo: HarmonographProps = {
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  duration: 12,
  hold: 0.8,
  lineWidth: 0.7,
  lineOpacity: 0.5,
  damping: 0.5,
  spin: 0.5,
  complexity: 0.5,
  tilt: 0.5,
  round: true,
  interactive: true,
  className: "aspect-square w-full max-w-[560px]",
};

const BASE_RATIOS: [number, number][] = [
  [1, 1],
  [1, 2],
  [2, 3],
  [3, 2],
];
const RICH_RATIOS: [number, number][] = [
  [3, 4],
  [4, 5],
  [2, 5],
  [5, 6],
];

interface Figure {
  f: Float32Array;
  a: Float32Array;
  p: Float32Array;
  d: number;
  spin: number;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function createFigure(seed: number, damping: number, spin: number, complexity: number): Figure {
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const pool = [...BASE_RATIOS, ...RICH_RATIOS.slice(0, Math.round(clamp01(complexity) * RICH_RATIOS.length))];
  const [lo, hi] = pool[Math.floor(random() * pool.length)] ?? [2, 3];
  const detune = () => (random() - 0.5) * 0.018;
  const f = new Float32Array([lo + detune(), hi + detune(), lo + detune(), hi + detune()]);
  const a = new Float32Array(4);
  for (let i = 0; i < 4; i++) a[i] = 0.14 + random() * 0.03;
  const p = new Float32Array(4);
  for (let i = 0; i < 4; i++) p[i] = random() * Math.PI * 2;
  const base = 0.0045 - clamp01(damping) * 0.0027;
  return { f, a, p, d: base * (0.85 + random() * 0.3), spin: (random() - 0.5) * 2 * clamp01(spin) * 0.008 };
}

// Resolves any CSS color (tokens and oklch included) to an rgb() string the canvas accepts everywhere
function resolveColor(el: HTMLElement, color: string) {
  el.style.color = color;
  const computed = getComputedStyle(el).color;
  el.style.color = "";
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) return computed;
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${data[0] ?? 0}, ${data[1] ?? 0}, ${data[2] ?? 0})`;
}

const FADE_SECONDS = 0.9;
const STEP = 0.025;

export function Harmonograph({
  inkColor = "var(--foreground)",
  paperColor = "var(--background)",
  duration = 12,
  hold = 0.8,
  lineWidth = 0.7,
  lineOpacity = 0.5,
  damping = 0.5,
  spin = 0.5,
  complexity = 0.5,
  tilt = 0.5,
  round = true,
  interactive = true,
  paused = false,
  className,
  children,
}: HarmonographProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ inkColor, duration, hold, lineWidth, lineOpacity, damping, spin, complexity, tilt, interactive, paused });
  settings.current = { inkColor, duration, hold, lineWidth, lineOpacity, damping, spin, complexity, tilt, interactive, paused };
  const refresh = useRef<(recolor?: boolean) => void>(() => {});

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const plate = plateRef.current;
    const first = frontRef.current;
    const second = backRef.current;
    if (!root || !plate || !first || !second) return;
    const firstCtx = first.getContext("2d");
    const secondCtx = second.getContext("2d");
    if (!firstCtx || !secondCtx) return;

    // Two layers: the new figure draws on the front while the finished one fades out behind it
    const layers = [
      { canvas: first, ctx: firstCtx },
      { canvas: second, ctx: secondCtx },
    ];
    let front = 0;
    let fade = 0;
    let seed = 20240917;
    let figure = createFigure(seed, settings.current.damping, settings.current.spin, settings.current.complexity);
    let t = 0;
    let tMax = Math.log(60) / figure.d;
    let rest = 0;
    let ink = "#111";
    let width = 1;
    let height = 1;
    let dpr = 1;
    let clock = 0;
    let frame = 0;
    let visible = true;
    let last = 0;
    const pointer = { x: 0, y: 0, inside: false };
    const sway = { x: 0, y: 0, vx: 0, vy: 0 };
    const cursor = { x: 0, y: 0 };

    const layer = (index: number) => layers[index] ?? layers[0];

    const point = (time: number) => {
      const { f, a, p, d } = figure;
      const decay = Math.exp(-d * time);
      const x = ((a[0] ?? 0) * Math.sin((f[0] ?? 1) * time + (p[0] ?? 0)) + (a[1] ?? 0) * Math.sin((f[1] ?? 1) * time + (p[1] ?? 0))) * decay;
      const y = ((a[2] ?? 0) * Math.sin((f[2] ?? 1) * time + (p[2] ?? 0)) + (a[3] ?? 0) * Math.cos((f[3] ?? 1) * time + (p[3] ?? 0))) * decay;
      const angle = figure.spin * time;
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const size = Math.min(width, height);
      cursor.x = width / 2 + (x * c - y * s) * size;
      cursor.y = height / 2 + (x * s + y * c) * size;
    };

    const stroke = (from: number, to: number) => {
      const s = settings.current;
      const ctx = layer(front)?.ctx;
      if (!ctx) return;
      ctx.globalAlpha = clamp01(s.lineOpacity);
      ctx.strokeStyle = ink;
      ctx.lineWidth = Math.max(0.2, s.lineWidth) * dpr;
      ctx.lineJoin = "round";
      ctx.beginPath();
      point(from);
      ctx.moveTo(cursor.x, cursor.y);
      for (let time = from + STEP; time < to; time += STEP) {
        point(time);
        ctx.lineTo(cursor.x, cursor.y);
      }
      point(to);
      ctx.lineTo(cursor.x, cursor.y);
      ctx.stroke();
    };

    const clearLayer = (index: number) => {
      const target = layer(index);
      target?.ctx.clearRect(0, 0, width, height);
    };

    const redrawFront = () => {
      clearLayer(front);
      if (t > 0) stroke(0, t);
    };

    const newFigure = () => {
      const s = settings.current;
      seed = (seed * 48271 + 11) % 2147483647;
      figure = createFigure(seed, s.damping, s.spin, s.complexity);
      t = 0;
      tMax = Math.log(60) / figure.d;
      rest = 0;
    };

    const next = () => {
      const back = 1 - front;
      clearLayer(back);
      const retiring = layer(front)?.canvas;
      const incoming = layer(back)?.canvas;
      if (retiring) retiring.style.opacity = "1";
      if (incoming) incoming.style.opacity = "1";
      if (retiring) retiring.style.zIndex = "0";
      if (incoming) incoming.style.zIndex = "1";
      front = back;
      fade = FADE_SECONDS;
      newFigure();
    };

    const finished = () => {
      clearLayer(front);
      clearLayer(1 - front);
      const other = layer(1 - front)?.canvas;
      if (other) other.style.opacity = "0";
      t = 0;
      stroke(0, tMax);
      t = tMax;
    };

    const tiltTo = (dt: number) => {
      const s = settings.current;
      const amount = clamp01(s.tilt);
      // Idle: a slow figure-eight sway; hover: a clear lean toward the cursor
      let tx = (Math.sin(clock * 0.31) * 11 + Math.sin(clock * 0.53 + 2) * 3) * amount;
      let ty = (Math.sin(clock * 0.23 + 1) * 14 + Math.sin(clock * 0.47) * 4) * amount;
      if (s.interactive && pointer.inside) {
        tx = -pointer.y * 24 * amount;
        ty = pointer.x * 24 * amount;
      }
      // Soft spring toward the target so both the sway and the lean stay smooth
      const k = 18;
      const damp = 7;
      sway.vx += ((tx - sway.x) * k - sway.vx * damp) * dt;
      sway.vy += ((ty - sway.y) * k - sway.vy * damp) * dt;
      sway.x += sway.vx * dt;
      sway.y += sway.vy * dt;
      plate.style.transform = `rotateX(${sway.x.toFixed(2)}deg) rotateY(${sway.y.toFixed(2)}deg)`;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      clock += dt;
      const s = settings.current;
      // One figure at a time: the old one fades out completely before the new one starts drawing
      if (fade > 0) {
        fade = Math.max(0, fade - dt);
        const retiring = layer(1 - front)?.canvas;
        if (retiring) retiring.style.opacity = (fade / FADE_SECONDS).toFixed(3);
      } else if (t < tMax) {
        const steps = (tMax / STEP / Math.max(1, s.duration)) * dt;
        const to = Math.min(tMax, t + steps * STEP);
        stroke(t, to);
        t = to;
      } else {
        rest += dt;
        if (rest >= Math.max(0, s.hold)) next();
      }
      tiltTo(dt);
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const readColors = () => {
      ink = resolveColor(root, settings.current.inkColor);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(plate.clientWidth * dpr));
      height = Math.max(1, Math.round(plate.clientHeight * dpr));
      for (const { canvas } of layers) {
        canvas.width = width;
        canvas.height = height;
      }
      readColors();
      if (reduce) finished();
      else redrawFront();
    };

    refresh.current = (recolor = false) => {
      if (recolor) {
        readColors();
        if (reduce) finished();
        else redrawFront();
      }
      play();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        pointer.inside = false;
        return;
      }
      const rect = root.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const y = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      pointer.inside = Math.abs(x) <= 0.5 && Math.abs(y) <= 0.5;
      pointer.x = x * 2;
      pointer.y = y * 2;
    };
    const onClick = () => {
      if (!settings.current.interactive) return;
      if (reduce) {
        newFigure();
        finished();
      } else next();
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(resize);
    ro.observe(plate);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    const mo = new MutationObserver(() => requestAnimationFrame(() => refresh.current(true)));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibility);
    play();

    return () => {
      cancelAnimationFrame(frame);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  useEffect(() => {
    refresh.current(true);
  }, [inkColor]);

  useEffect(() => {
    refresh.current(false);
  }, [paused]);

  return (
    <div ref={rootRef} className={cn("relative [perspective:900px]", interactive && "cursor-pointer", className)}>
      <div
        ref={plateRef}
        className={cn("relative size-full overflow-hidden will-change-transform", round ? "rounded-full" : "rounded-md")}
        style={{ backgroundColor: paperColor }}
      >
        <canvas ref={frontRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
        <canvas ref={backRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      </div>
      {children && <div className="pointer-events-none absolute inset-0">{children}</div>}
    </div>
  );
}
