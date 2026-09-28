"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

type Gather = "left" | "center" | "right" | "none";

export interface InkFlowProps {
  /** Color of the strokes. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color of the paper the strokes fade into. */
  paperColor?: string;
  /** How many strokes are drawn at once, 0 to 1. */
  density?: number;
  /** Motion speed, 1 is the default pace. */
  speed?: number;
  /** How tightly the currents curl, 0 (long sweeps) to 1 (tight eddies). */
  swirl?: number;
  /** How long strokes linger before the paper takes them back, 0 to 1. */
  trail?: number;
  /** Stroke weight, 0 (hairline) to 1 (heavy brush). */
  weight?: number;
  /** Ink strength of each stroke, 0 to 1. */
  opacity?: number;
  /** Side of the surface the ink gathers on, leaving the rest quiet for text. */
  gather?: Gather;
  /** Heavier brush strokes gather around the cursor. */
  interactive?: boolean;
  /** How strongly the cursor bends and thickens the ink, 0 to 1. */
  brush?: number;
  /** Freeze the drawing where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const inkFlowDemo: InkFlowProps = {
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  density: 0.5,
  speed: 1,
  swirl: 0.5,
  trail: 0.5,
  weight: 0.4,
  opacity: 0.5,
  gather: "right",
  interactive: true,
  brush: 0.5,
  className: "min-h-[32rem]",
};

const MAX_PARTICLES = 2800;

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  const top = a + (b - a) * ux;
  return top + (c + (d - c) * ux - top) * uy;
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

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const INTRO_MS = 2400;

export function InkFlow({
  inkColor = "var(--foreground)",
  paperColor = "var(--background)",
  density = 0.5,
  speed = 1,
  swirl = 0.5,
  trail = 0.5,
  weight = 0.4,
  opacity = 0.5,
  gather = "right",
  interactive = true,
  brush = 0.5,
  paused = false,
  className,
  children,
}: InkFlowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ inkColor, paperColor, density, speed, swirl, trail, weight, opacity, gather, interactive, brush, paused });
  settings.current = { inkColor, paperColor, density, speed, swirl, trail, weight, opacity, gather, interactive, brush, paused };
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

    const xs = new Float32Array(MAX_PARTICLES);
    const ys = new Float32Array(MAX_PARTICLES);
    const life = new Float32Array(MAX_PARTICLES);
    const heavy = new Uint8Array(MAX_PARTICLES);
    let ink = "#111";
    let paper = "#fff";
    let dpr = 1;
    let count = 0;
    let quality = 1;
    let clock = 0;
    let tick = 0;
    let frame = 0;
    let visible = true;
    let average = 16.7;
    let lastFrame = 0;
    let introStart = 0;
    let intro = reduce ? 1 : 0;
    const pointer = { x: 0, y: 0, active: false };

    const spawn = (i: number, withBrush: boolean) => {
      const w = canvas.width;
      const h = canvas.height;
      if (withBrush) {
        xs[i] = pointer.x + (Math.random() - 0.5) * 60 * dpr;
        ys[i] = pointer.y + (Math.random() - 0.5) * 60 * dpr;
      } else {
        const side = settings.current.gather;
        const biased = side !== "none" && Math.random() < 0.8;
        const start = side === "left" ? 0 : side === "center" ? 0.21 : 0.42;
        xs[i] = biased ? w * (start + Math.random() * 0.58) : Math.random() * w;
        ys[i] = Math.random() * h;
      }
      life[i] = 60 + Math.random() * 160;
      heavy[i] = withBrush ? 1 : 0;
    };

    const target = () => {
      const area = (canvas.clientWidth * canvas.clientHeight) / 900;
      return Math.min(MAX_PARTICLES, Math.round(area * (0.3 + clamp01(settings.current.density) * 1.4) * quality));
    };

    const clear = () => {
      ctx.globalAlpha = 1;
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const recolor = () => {
      ink = resolveColor(root, settings.current.inkColor);
      paper = resolveColor(root, settings.current.paperColor);
      clear();
    };

    const fill = () => {
      const next = target();
      for (let i = count; i < next; i++) spawn(i, false);
      count = next;
    };

    const step = (fade: boolean, dt: number) => {
      const s = settings.current;
      clock += dt * s.speed;
      tick++;
      const scale = 0.0014 / dpr;
      // Early in the intro strokes are faint and short, so the ink gathers out of the bare paper
      const move = 1.3 * dpr * s.speed * (dt / (1 / 60)) * (0.4 + 0.6 * intro);
      const curl = Math.PI * (2 + clamp01(s.swirl) * 4);
      const reach = 220 * dpr;
      const bend = Math.PI * 1.8 * clamp01(s.brush);
      if (fade && tick % 2 === 0) {
        ctx.globalAlpha = 0.012 + (1 - clamp01(s.trail)) * 0.056;
        ctx.fillStyle = paper;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.strokeStyle = ink;
      ctx.lineCap = "round";
      const base = (0.4 + clamp01(s.weight) * 1.4) * dpr;
      for (let pass = 0; pass < 2; pass++) {
        const brushPass = pass === 1;
        ctx.globalAlpha = (0.04 + clamp01(s.opacity) * 0.18) * (brushPass ? 1.7 : 1) * intro;
        ctx.lineWidth = base * (brushPass ? 1 + clamp01(s.brush) * 3 : 1);
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          if ((heavy[i] === 1) !== brushPass) continue;
          const x = xs[i] ?? 0;
          const y = ys[i] ?? 0;
          let angle = noise(x * scale, y * scale + clock * 0.24) * curl;
          if (pointer.active) {
            const dist = Math.hypot(x - pointer.x, y - pointer.y);
            if (dist < reach) angle += (1 - dist / reach) * bend;
          }
          const nx = x + Math.cos(angle) * move;
          const ny = y + Math.sin(angle) * move;
          ctx.moveTo(x, y);
          ctx.lineTo(nx, ny);
          xs[i] = nx;
          ys[i] = ny;
          const left = (life[i] ?? 0) - 1;
          life[i] = left;
          if (left <= 0 || nx < 0 || ny < 0 || nx > canvas.width || ny > canvas.height) {
            spawn(i, pointer.active && s.brush > 0 && Math.random() < 0.18);
          }
        }
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      average += (delta - average) * 0.05;
      lastFrame = now;
      if (tick % 90 === 0 && tick > 0) {
        // Fewer strokes on a device that can't keep up; more once it has room again
        if (average > 22 && quality > 0.4) quality = Math.max(0.4, quality - 0.15);
        else if (average < 17.5 && quality < 1) quality = Math.min(1, quality + 0.05);
        const next = target();
        if (next < count) count = next;
        else fill();
      }
      if (intro < 1) {
        introStart ||= now;
        const k = clamp01((now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      step(true, Math.min(0.05, delta / 1000));
      frame = requestAnimationFrame(loop);
    };

    const still = () => {
      recolor();
      for (let i = 0; i < 240; i++) step(false, 1 / 60);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      count = 0;
      fill();
      if (reduce) still();
      else recolor();
    };

    refresh.current = (withColors = false) => {
      if (withColors) {
        if (reduce) still();
        else recolor();
      }
      const next = target();
      if (next < count) count = next;
      else fill();
      play();
    };

    const onMove = (event: PointerEvent) => {
      if (!settings.current.interactive || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      pointer.active = inside;
      if (!inside) return;
      pointer.x = (event.clientX - rect.left) * dpr;
      pointer.y = (event.clientY - rect.top) * dpr;
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => requestAnimationFrame(() => refresh.current(true)));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
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
  }, [reduce]);

  useEffect(() => {
    refresh.current(true);
  }, [inkColor, paperColor]);

  useEffect(() => {
    refresh.current(false);
  }, [density, speed, swirl, trail, weight, opacity, gather, interactive, brush, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
