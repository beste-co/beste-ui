"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface RidgelinesProps {
  /** Color of the lines. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color behind the lines, also used to hide the ridges further back. */
  paperColor?: string;
  /** Number of stacked ridgelines, 12 to 96. */
  lines?: number;
  /** Height of the ridges, 0 to 1. */
  amplitude?: number;
  /** Width of the central band where the ridges rise, 0 (narrow) to 1 (wide). */
  spread?: number;
  /** How fast the noise travels through the ridges, 1 is the default pace. */
  speed?: number;
  /** Line weight, 0 (hairline) to 1 (heavy). */
  weight?: number;
  /** Ridges rise from flat lines on mount. */
  riseIn?: boolean;
  /** Nearby lines lift under the cursor. */
  interactive?: boolean;
  /** How high the cursor lifts the lines, 0 to 1. */
  peak?: number;
  /** Freeze the plot on its current frame. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const ridgelinesDemo: RidgelinesProps = {
  inkColor: "var(--background)",
  paperColor: "var(--foreground)",
  lines: 56,
  amplitude: 0.5,
  spread: 0.5,
  speed: 1,
  weight: 0.35,
  riseIn: true,
  interactive: true,
  peak: 0.5,
  className: "aspect-square",
};

const TABLE = 4096;
const MASK = TABLE - 1;
const INTRO_MS = 2400;

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

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function Ridgelines({
  inkColor = "var(--background)",
  paperColor = "var(--foreground)",
  lines = 56,
  amplitude = 0.5,
  spread = 0.5,
  speed = 1,
  weight = 0.35,
  riseIn = true,
  interactive = true,
  peak = 0.5,
  paused = false,
  className,
  children,
}: RidgelinesProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ inkColor, paperColor, amplitude, speed, weight, interactive, peak, paused });
  settings.current = { inkColor, paperColor, amplitude, speed, weight, interactive, peak, paused };
  const refresh = useRef<(recolor?: boolean) => void>(() => {});

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !root || !ctx) return;

    const table = new Float32Array(TABLE);
    for (let i = 0; i < TABLE; i++) table[i] = Math.random();
    const noise = (x: number, y: number) => {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      let fx = x - xi;
      let fy = y - yi;
      fx = fx * fx * (3 - 2 * fx);
      fy = fy * fy * (3 - 2 * fy);
      const row = yi * 131;
      const a = table[(xi + row) & MASK] ?? 0;
      const b = table[(xi + 1 + row) & MASK] ?? 0;
      const c = table[(xi + row + 131) & MASK] ?? 0;
      const d = table[(xi + 1 + row + 131) & MASK] ?? 0;
      const top = a + (b - a) * fx;
      return top + (c + (d - c) * fx - top) * fy;
    };

    const count = Math.max(12, Math.min(96, Math.round(lines)));
    const width = 0.08 + clamp01(spread) * 0.18;
    let samples = 0;
    let xs = new Float32Array(0);
    let us = new Float32Array(0);
    let env = new Float32Array(0);
    let ys = new Float32Array(0);
    let dpr = 1;
    let top = 0;
    let gap = 0;
    let left = 0;
    let right = 0;
    let paper = "#000";
    let ink = "#fff";
    let frame = 0;
    let visible = true;
    let hovering = false;
    let hover = 0;
    let time = 0;
    let lastFrame = 0;
    let fadeStart = 0;
    let fade = reduce ? 1 : 0;
    const target = { u: 0.5, line: count * 0.5 };
    const pointer = { u: 0.5, line: count * 0.5 };

    const draw = () => {
      if (!samples) return;
      const s = settings.current;
      const still = reduce || s.paused;
      const k = still ? 1 : 0.08;
      pointer.u += (target.u - pointer.u) * k;
      pointer.line += (target.line - pointer.line) * k;
      hover += ((hovering && s.interactive ? 1 : 0) - hover) * (still ? 1 : 0.05);
      const intro = !riseIn || reduce ? 1 : Math.min(1, time / 2.4);
      const rise = intro * intro * (3 - 2 * intro);
      const amp = gap * (2 + clamp01(s.amplitude) * 11) * rise;
      const lift = clamp01(s.peak) * 2.6;
      const t = (reduce ? 20 : time) * 0.32;

      ctx.globalAlpha = 1;
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = ink;
      ctx.lineJoin = "round";
      ctx.lineWidth = (0.6 + clamp01(s.weight) * 2) * dpr;

      for (let j = 0; j < count; j++) {
        const base = top + j * gap;
        const dl = (j - pointer.line) / 3.2;
        const raise = hover * Math.exp(-dl * dl) * amp * lift;
        const seed = j * 7.31;
        for (let i = 0; i < samples; i++) {
          const u = us[i] ?? 0;
          const coarse = noise(u * 7 + seed, j * 0.37 + t);
          const fine = noise(u * 26 + seed * 3, j * 1.3 - t * 1.7);
          const shape = coarse * 0.75 + fine * 0.35;
          let y = (env[i] ?? 0) * shape * shape * amp + (fine - 0.5) * gap * 0.12 * rise;
          if (raise > 0.01) {
            const du = (u - pointer.u) / 0.07;
            y += raise * Math.exp(-du * du) * (0.7 + fine * 0.5);
          }
          ys[i] = base - Math.max(0, y);
        }

        ctx.beginPath();
        ctx.moveTo(left, ys[0] ?? base);
        for (let i = 1; i < samples; i++) ctx.lineTo(xs[i] ?? right, ys[i] ?? base);
        ctx.lineTo(right, base + gap);
        ctx.lineTo(left, base + gap);
        ctx.closePath();
        ctx.fill();

        // The lines fade up out of the flat paper
        ctx.globalAlpha = fade;
        ctx.beginPath();
        ctx.moveTo(left, ys[0] ?? base);
        for (let i = 1; i < samples; i++) ctx.lineTo(xs[i] ?? right, ys[i] ?? base);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    const recolor = () => {
      paper = resolveColor(root, settings.current.paperColor);
      ink = resolveColor(root, settings.current.inkColor);
      ctx.fillStyle = paper;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      const w = canvas.width;
      const h = canvas.height;
      left = w * 0.18;
      right = w * 0.82;
      top = h * 0.2;
      gap = (h * 0.86 - top) / (count - 1);
      samples = Math.max(80, Math.min(220, Math.round((right - left) / (3 * dpr))));
      xs = new Float32Array(samples);
      us = new Float32Array(samples);
      env = new Float32Array(samples);
      ys = new Float32Array(samples);
      for (let i = 0; i < samples; i++) {
        const u = i / (samples - 1);
        us[i] = u;
        xs[i] = left + (right - left) * u;
        const center = (u - 0.5) / width;
        env[i] = Math.exp(-center * center) * 0.92 + 0.08 * Math.sin(Math.PI * u);
      }
      draw();
    };

    const loop = (now: number) => {
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      lastFrame = now;
      const arriving = fade < 1;
      if (arriving) {
        fadeStart ||= now;
        const k = clamp01((now - fadeStart) / INTRO_MS);
        fade = k * k * k * (k * (k * 6 - 15) + 10);
      }
      const paused = settings.current.paused;
      if (!paused) time += (delta / 1000) * settings.current.speed;
      draw();
      frame = paused && !arriving ? 0 : requestAnimationFrame(loop);
    };
    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && (!settings.current.paused || fade < 1) && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    refresh.current = (withColors = false) => {
      if (withColors) recolor();
      play();
      draw();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      hovering = inside;
      if (inside) {
        const x = (event.clientX - rect.left) * dpr;
        const y = (event.clientY - rect.top) * dpr;
        target.u = clamp01((x - left) / Math.max(1, right - left));
        target.line = Math.max(0, Math.min(count - 1, (y - top) / Math.max(1, gap) + 3));
      }
      if (reduce || settings.current.paused) draw();
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    const mo = new MutationObserver(() => requestAnimationFrame(() => refresh.current(true)));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    play();

    return () => {
      cancelAnimationFrame(frame);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [lines, spread, riseIn, reduce]);

  useEffect(() => {
    refresh.current(true);
  }, [inkColor, paperColor]);

  useEffect(() => {
    refresh.current(false);
  }, [amplitude, speed, weight, interactive, peak, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
