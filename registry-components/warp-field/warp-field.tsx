"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface WarpFieldProps {
  /** Color of empty space behind the stars. Any CSS color, tokens included. */
  spaceColor?: string;
  /** Color of the nearest, brightest stars. */
  starColor?: string;
  /** Color of the middle distance. */
  midColor?: string;
  /** Color of the faintest, farthest stars. */
  farColor?: string;
  /** Color of the tunnel glow that opens at warp. */
  glowColor?: string;
  /** How many stars fill the field, 0 to 1. */
  density?: number;
  /** Cruising speed, 1 is the default pace. */
  speed?: number;
  /** Throttle toward hyperspace, 0 (cruise) to 1 (full warp). Eased, so it can be toggled freely. */
  warp?: number;
  /** Length of the streaks at warp, 0 to 1. */
  streaks?: number;
  /** Strength of the tunnel glow at warp, 0 to 1. */
  glow?: number;
  /** Height of the vanishing point, 0 (top) to 1 (bottom). */
  horizon?: number;
  /** The vanishing point leans toward the cursor. */
  interactive?: boolean;
  /** How far it leans, 0 to 1. */
  follow?: number;
  /** Freeze the field where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const warpFieldDemo: WarpFieldProps = {
  spaceColor: "#04050a",
  starColor: "#ffffff",
  midColor: "#c9d5ff",
  farColor: "#6f82b8",
  glowColor: "#96afff",
  density: 0.5,
  speed: 1,
  warp: 0,
  streaks: 0.5,
  glow: 0.9,
  horizon: 0.42,
  interactive: true,
  follow: 0.4,
  className: "min-h-[32rem]",
};

const MAX_STARS = 3200;

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

export function WarpField({
  spaceColor = "#04050a",
  starColor = "#ffffff",
  midColor = "#c9d5ff",
  farColor = "#6f82b8",
  glowColor = "#96afff",
  density = 0.5,
  speed = 1,
  warp = 0,
  streaks = 0.5,
  glow = 0.9,
  horizon = 0.42,
  interactive = true,
  follow = 0.4,
  paused = false,
  className,
  children,
}: WarpFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ spaceColor, starColor, midColor, farColor, density, speed, warp, streaks, glow, horizon, interactive, follow, paused });
  settings.current = { spaceColor, starColor, midColor, farColor, density, speed, warp, streaks, glow, horizon, interactive, follow, paused };
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
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !root || !ctx) return;

    const xs = new Float32Array(MAX_STARS);
    const ys = new Float32Array(MAX_STARS);
    const zs = new Float32Array(MAX_STARS);
    const tiers = [
      { color: "#6f82b8", alpha: 0.55, width: 1, far: 0.62, near: 2 },
      { color: "#c9d5ff", alpha: 0.8, width: 1.4, far: 0.3, near: 0.62 },
      { color: "#ffffff", alpha: 1, width: 2, far: 0, near: 0.3 },
    ];
    let space = "#04050a";
    let dpr = 1;
    let count = 0;
    let quality = 1;
    let throttle = 0;
    let frame = 0;
    let tick = 0;
    let last = 0;
    let average = 16.7;
    let visible = true;
    let introStart = 0;
    let intro = reduce ? 1 : 0;
    const center = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const respawn = (k: number, z: number) => {
      const a = Math.random() * Math.PI * 2;
      const r = 0.03 + Math.sqrt(Math.random()) * 1.8;
      xs[k] = Math.cos(a) * r;
      ys[k] = Math.sin(a) * r;
      zs[k] = z;
    };

    const recolor = () => {
      const s = settings.current;
      space = resolveColor(root, s.spaceColor);
      const [far, mid, near] = tiers;
      if (far) far.color = resolveColor(root, s.farColor);
      if (mid) mid.color = resolveColor(root, s.midColor);
      if (near) near.color = resolveColor(root, s.starColor);
    };

    const home = () => {
      target.x = canvas.width * 0.5;
      target.y = canvas.height * clamp01(settings.current.horizon);
    };

    const fill = () => {
      const area = (canvas.clientWidth * canvas.clientHeight) / 650;
      const next = Math.min(MAX_STARS, Math.round(area * clamp01(settings.current.density) * 2 * quality));
      for (let k = count; k < next; k++) respawn(k, 0.05 + Math.random() * 0.95);
      count = next;
    };

    const draw = (velocity: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const scale = Math.max(w, h) * 0.1;
      const trail = 0.004 + velocity * 0.14 * clamp01(settings.current.streaks);
      ctx.globalAlpha = 1;
      ctx.fillStyle = space;
      ctx.fillRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const tier of tiers) {
        ctx.strokeStyle = tier.color;
        ctx.globalAlpha = tier.alpha * intro;
        ctx.lineWidth = tier.width * dpr;
        ctx.beginPath();
        for (let k = 0; k < count; k++) {
          const z = zs[k] ?? 1;
          if (z < tier.far || z >= tier.near) continue;
          const x = xs[k] ?? 0;
          const y = ys[k] ?? 0;
          const tz = Math.min(z + trail, 1.2);
          ctx.moveTo(center.x + (x / tz) * scale, center.y + (y / tz) * scale);
          ctx.lineTo(center.x + (x / z) * scale, center.y + (y / z) * scale);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      const delta = last ? Math.min(100, now - last) : 16.7;
      average += (delta - average) * 0.05;
      last = now;
      const dt = delta / 1000;
      const s = settings.current;
      // Stars fade in and pick up speed out of the empty space color
      if (intro < 1) {
        introStart ||= now;
        const p = clamp01((now - introStart) / INTRO_MS);
        intro = p * p * p * (p * (p * 6 - 15) + 10);
      }
      if (s.paused) {
        draw(0);
        frame = intro < 1 ? requestAnimationFrame(loop) : 0;
        return;
      }
      if (++tick % 90 === 0) {
        // Fewer stars on a device that can't keep up; more once it has room again
        if (average > 22 && quality > 0.4) quality = Math.max(0.4, quality - 0.15);
        else if (average < 17.5 && quality < 1) quality = Math.min(1, quality + 0.05);
        const area = (canvas.clientWidth * canvas.clientHeight) / 650;
        const next = Math.min(MAX_STARS, Math.round(area * clamp01(s.density) * 2 * quality));
        if (next < count) count = next;
        else fill();
      }
      const goal = clamp01(s.warp);
      const rate = goal > throttle ? 0.9 : 1.4;
      throttle += (goal - throttle) * (1 - Math.exp(-rate * dt));
      const eased = throttle * throttle * (3 - 2 * throttle);
      const velocity = (0.045 + eased * eased * 1.9) * Math.max(0, s.speed) * intro;
      center.x += (target.x - center.x) * (1 - Math.exp(-2.5 * dt));
      center.y += (target.y - center.y) * (1 - Math.exp(-2.5 * dt));

      const w = canvas.width;
      const h = canvas.height;
      const scale = Math.max(w, h) * 0.1;
      for (let k = 0; k < count; k++) {
        const z = (zs[k] ?? 1) - velocity * dt;
        const px = center.x + ((xs[k] ?? 0) / z) * scale;
        const py = center.y + ((ys[k] ?? 0) / z) * scale;
        if (z < 0.012 || px < -40 || py < -40 || px > w + 40 || py > h + 40) respawn(k, 0.85 + Math.random() * 0.35);
        else zs[k] = z;
      }
      draw(velocity);
      if (tick % 3 === 0 && glowRef.current) glowRef.current.style.opacity = String(eased * clamp01(s.glow) * intro);
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!reduce && (!settings.current.paused || intro < 1) && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      count = 0;
      fill();
      home();
      center.x = target.x;
      center.y = target.y;
      draw(0);
    };

    refresh.current = (withColors = false) => {
      if (withColors) recolor();
      const area = (canvas.clientWidth * canvas.clientHeight) / 650;
      const next = Math.min(MAX_STARS, Math.round(area * clamp01(settings.current.density) * 2 * quality));
      if (next < count) count = next;
      else fill();
      home();
      play();
      if (reduce || settings.current.paused) {
        center.x = target.x;
        center.y = target.y;
        draw(0);
      }
    };

    const onMove = (event: PointerEvent) => {
      const s = settings.current;
      if (!s.interactive || event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      home();
      if (!inside) return;
      const lean = clamp01(s.follow) * 0.3;
      const x = (event.clientX - rect.left) * dpr;
      const y = (event.clientY - rect.top) * dpr;
      target.x += (x - target.x) * lean;
      target.y += (y - target.y) * lean;
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
  }, [reduce]);

  useEffect(() => {
    refresh.current(true);
  }, [spaceColor, starColor, midColor, farColor]);

  useEffect(() => {
    refresh.current(false);
  }, [density, speed, warp, streaks, glow, horizon, interactive, follow, paused]);

  const glowAt = `${Math.round(clamp01(horizon) * 100)}%`;

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: spaceColor }}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background: `radial-gradient(60% 50% at 50% ${glowAt}, color-mix(in oklab, ${glowColor} 22%, transparent), color-mix(in oklab, ${glowColor} 10%, transparent) 45%, transparent 75%)`,
        }}
      />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
