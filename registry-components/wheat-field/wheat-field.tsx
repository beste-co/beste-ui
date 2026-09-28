"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface WheatFieldProps {
  /** How thickly the field is planted, 0 to 1 */
  density?: number;
  /** Sky color at the top. Any CSS color. */
  skyTop?: string;
  /** Sky color at the horizon; distant stalks fade into it */
  skyHorizon?: string;
  /** Glow of the low sun on the horizon */
  sunColor?: string;
  /** Color of the ripe grain in the foreground */
  grainColor?: string;
  /** Strength of the gusts rolling across the field, 0 to 1 */
  wind?: number;
  /** How fast the gusts travel, 1 is the default pace */
  gustSpeed?: number;
  /** Gentle sway of every stalk between gusts, 0 to 1 */
  sway?: number;
  /** How strongly the cursor parts the stalks, 0 to 1 */
  brush?: number;
  /** The cursor brushes through the field like a hand */
  interactive?: boolean;
  /** Hold the field still */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const wheatFieldDemo: WheatFieldProps = {
  density: 0.5,
  skyTop: "#6f87a6",
  skyHorizon: "#f3d6a8",
  sunColor: "#ffd28a",
  grainColor: "#d9a441",
  wind: 0.5,
  gustSpeed: 1,
  sway: 0.5,
  brush: 0.6,
  interactive: true,
  className: "min-h-[32rem]",
};

const HORIZON = 0.44;
const BUCKETS = 8;
const MAX_STALKS = 6000;
const RIPPLES = 4;

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

// Resolves any CSS color (tokens and oklch included) to 0-255 RGB
function resolveColor(el: HTMLElement, color: string): [number, number, number] {
  el.style.color = color;
  const computed = getComputedStyle(el).color;
  el.style.color = "";
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [0, 0, 0];
  ctx.fillStyle = "#000";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0];
}

const mix = (a: [number, number, number], b: [number, number, number], t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const INTRO_MS = 2400;

export function WheatField({
  density = 0.5,
  skyTop = "#6f87a6",
  skyHorizon = "#f3d6a8",
  sunColor = "#ffd28a",
  grainColor = "#d9a441",
  wind = 0.5,
  gustSpeed = 1,
  sway = 0.5,
  brush = 0.6,
  interactive = true,
  paused = false,
  className,
  children,
}: WheatFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ density, skyHorizon, grainColor, wind, gustSpeed, sway, brush, interactive, paused });
  settings.current = { density, skyHorizon, grainColor, wind, gustSpeed, sway, brush, interactive, paused };
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

    const bx = new Float32Array(MAX_STALKS);
    const by = new Float32Array(MAX_STALKS);
    const bh = new Float32Array(MAX_STALKS);
    const bf = new Float32Array(MAX_STALKS);
    const rank = new Float32Array(MAX_STALKS);
    const angle = new Float32Array(MAX_STALKS);
    const vel = new Float32Array(MAX_STALKS);
    const bucketEnd = new Int32Array(BUCKETS);
    const ripples = new Float32Array(RIPPLES * 4).fill(-100);
    const stemColors: string[] = new Array(BUCKETS).fill("#000");
    const headColors: string[] = new Array(BUCKETS).fill("#000");

    let width = 1;
    let height = 1;
    let dpr = 1;
    let count = 0;
    let quality = 1;
    let average = 16.7;
    let lastFrame = 0;
    let tick = 0;
    let time = 0;
    let frame = 0;
    let visible = true;
    let nextRipple = 0;
    let introStart = 0;
    let intro = reduce ? 1 : 0;
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, inside: false, movedAt: -1e9, lastRipple: -1e9 };

    const plant = () => {
      const s = settings.current;
      const area = width * height;
      count = Math.min(MAX_STALKS, Math.round((area / 320) * (0.4 + clamp01(s.density) * 1.2)));
      const horizon = height * HORIZON;
      // Deterministic planting so a resize never reshuffles the field
      let seed = 1234567;
      const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      const order: number[] = [];
      const ys = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const depth = rand() ** 1.35;
        ys[i] = depth;
        order.push(i);
      }
      order.sort((a, b) => (ys[a] ?? 0) - (ys[b] ?? 0));
      const rows = order.map(() => [rand(), rand(), rand()] as const);
      for (let k = 0; k < count; k++) {
        const f = ys[order[k] ?? 0] ?? 0;
        const [r1, r2, r3] = rows[k] ?? [0, 0, 0];
        bf[k] = f;
        bx[k] = -0.06 * width + r1 * width * 1.12;
        by[k] = horizon + (height * 1.06 - horizon) * f;
        bh[k] = height * 0.4 * (0.04 + 0.96 * f ** 1.3) * (0.8 + r2 * 0.4);
        rank[k] = r3;
        angle[k] = 0;
        vel[k] = 0;
      }
      for (let b = 0; b < BUCKETS; b++) {
        const limit = (b + 1) / BUCKETS;
        let end = 0;
        while (end < count && (bf[end] ?? 0) < limit) end++;
        bucketEnd[b] = b === BUCKETS - 1 ? count : end;
      }
    };

    const recolor = () => {
      const s = settings.current;
      const grain = resolveColor(root, s.grainColor);
      const haze = resolveColor(root, s.skyHorizon);
      const shadow: [number, number, number] = [grain[0] * 0.38, grain[1] * 0.3, grain[2] * 0.22];
      // Backlit field: near stems fall toward shadow, far ones dissolve into the horizon haze
      for (let b = 0; b < BUCKETS; b++) {
        const near = (b + 0.5) / BUCKETS;
        const fade = (1 - near) ** 1.4 * 0.88;
        headColors[b] = mix(grain, haze, fade * 0.92);
        const stem: [number, number, number] = [
          shadow[0] + (grain[0] - shadow[0]) * (1 - near) * 0.6,
          shadow[1] + (grain[1] - shadow[1]) * (1 - near) * 0.6,
          shadow[2] + (grain[2] - shadow[2]) * (1 - near) * 0.6,
        ];
        stemColors[b] = mix(stem, haze, fade);
      }
    };

    const ripple = (x: number, y: number, strength: number) => {
      const i = nextRipple * 4;
      ripples[i] = x;
      ripples[i + 1] = y;
      ripples[i + 2] = time;
      ripples[i + 3] = strength;
      nextRipple = (nextRipple + 1) % RIPPLES;
    };

    const simulate = (dt: number) => {
      const s = settings.current;
      const windAmount = clamp01(s.wind) * 0.55;
      const swayAmount = clamp01(s.sway) * 0.07;
      const speed = Math.max(0, s.gustSpeed);
      const brushAmount = clamp01(s.brush);
      const radius = Math.min(width, height) * 0.2;
      for (let i = 0; i < count; i++) {
        if ((rank[i] ?? 0) >= quality) continue;
        const x = bx[i] ?? 0;
        const y = by[i] ?? 0;
        const f = bf[i] ?? 0;
        const h = bh[i] ?? 0;
        const nx = x / width;
        // Gusts are bands of a slowly advected noise field rolling across the field
        const gust = noise(nx * 3.2 - time * 0.22 * speed, f * 2.4 + time * 0.05);
        let target = Math.max(0, gust - 0.38) * 1.6 * windAmount + Math.sin(time * 1.4 + x * 0.013 + f * 5) * swayAmount + windAmount * 0.12;
        if (s.interactive && pointer.inside) {
          const my = y - h * 0.5;
          const dx = x - pointer.x;
          const dy = my - pointer.y;
          const reach = radius * (0.35 + 0.65 * f);
          const dist = Math.hypot(dx, dy);
          if (dist < reach) {
            const fall = (1 - dist / reach) ** 2;
            target += Math.sign(dx || 1) * fall * brushAmount * 0.9;
          }
        }
        for (let r = 0; r < RIPPLES; r++) {
          const age = time - (ripples[r * 4 + 2] ?? -100);
          if (age < 0 || age > 2.2) continue;
          const rx = ripples[r * 4] ?? 0;
          const ry = ripples[r * 4 + 1] ?? 0;
          const dx = x - rx;
          const dist = Math.hypot(dx, (y - ry) * 1.8);
          const front = age * 520;
          const band = Math.exp(-((dist - front) ** 2) / 3600) * (1 - age / 2.2);
          target += Math.sign(dx || 1) * band * (ripples[r * 4 + 3] ?? 0) * 0.35;
        }
        // A damped spring gives each stalk its springy lag behind the wind
        const a = angle[i] ?? 0;
        let v = vel[i] ?? 0;
        v += ((target - a) * 34 - v * 5.5) * dt;
        vel[i] = v;
        angle[i] = a + v * dt;
      }
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      // On load the stalks fade in and grow up out of the ground
      ctx.globalAlpha = intro;
      ctx.lineCap = "round";
      let start = 0;
      for (let b = 0; b < BUCKETS; b++) {
        const end = bucketEnd[b] ?? 0;
        const near = (b + 0.5) / BUCKETS;
        // Stems
        ctx.strokeStyle = stemColors[b] ?? "#000";
        ctx.lineWidth = 0.35 + near * 1.5;
        ctx.beginPath();
        for (let i = start; i < end; i++) {
          if ((rank[i] ?? 0) >= quality) continue;
          const x = bx[i] ?? 0;
          const y = by[i] ?? 0;
          const h = (bh[i] ?? 0) * intro;
          const a = angle[i] ?? 0;
          const tx = x + Math.sin(a) * h;
          const ty = y - Math.cos(a) * h;
          const ca = a * 0.4;
          ctx.moveTo(x, y);
          ctx.quadraticCurveTo(x + Math.sin(ca) * h * 0.55, y - Math.cos(ca) * h * 0.55, tx, ty);
        }
        ctx.stroke();
        // Seed heads along the last stretch of each stem
        ctx.strokeStyle = headColors[b] ?? "#000";
        ctx.lineWidth = 0.9 + near * 4.2;
        ctx.beginPath();
        for (let i = start; i < end; i++) {
          if ((rank[i] ?? 0) >= quality) continue;
          const x = bx[i] ?? 0;
          const y = by[i] ?? 0;
          const h = (bh[i] ?? 0) * intro;
          const a = angle[i] ?? 0;
          const tx = x + Math.sin(a) * h;
          const ty = y - Math.cos(a) * h;
          const head = h * 0.13;
          ctx.moveTo(tx - Math.sin(a) * head, ty + Math.cos(a) * head);
          ctx.lineTo(tx, ty);
        }
        ctx.stroke();
        start = end;
      }
    };

    const loop = (now: number) => {
      const delta = lastFrame ? Math.min(100, now - lastFrame) : 16.7;
      average += (delta - average) * 0.05;
      lastFrame = now;
      tick++;
      if (tick % 90 === 0) {
        // Fewer stalks on a device that can't keep up; more once it has room again
        if (average > 22 && quality > 0.35) quality = Math.max(0.35, quality - 0.12);
        else if (average < 17.5 && quality < 1) quality = Math.min(1, quality + 0.05);
      }
      if (intro < 1) {
        introStart ||= now;
        const p = clamp01((now - introStart) / INTRO_MS);
        intro = p * p * p * (p * (p * 6 - 15) + 10);
      }
      if (settings.current.paused) {
        draw();
        frame = intro < 1 ? requestAnimationFrame(loop) : 0;
        return;
      }
      const dt = Math.min(0.05, delta / 1000);
      time += dt;
      simulate(dt);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const still = () => {
      time = 3;
      for (let i = 0; i < 90; i++) simulate(1 / 60);
      draw();
    };

    const play = () => {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (!reduce && (!settings.current.paused || intro < 1) && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      plant();
      if (reduce || settings.current.paused) still();
      else draw();
    };

    refresh.current = (withColors = false) => {
      if (withColors) recolor();
      draw();
      play();
    };

    const onMove = (event: PointerEvent) => {
      const s = settings.current;
      if (!s.interactive || event.pointerType === "touch" || reduce) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (!inside) {
        pointer.inside = false;
        return;
      }
      if (pointer.inside) {
        pointer.vx = x - pointer.x;
        pointer.vy = y - pointer.y;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.inside = true;
      pointer.movedAt = time;
      // A quick sweep sends a ripple running out through the stalks
      const fast = Math.hypot(pointer.vx, pointer.vy);
      if (fast > 18 && time - pointer.lastRipple > 0.35 && y > height * HORIZON) {
        pointer.lastRipple = time;
        ripple(x, y, Math.min(1, fast / 60) * clamp01(s.brush));
      }
    };
    const onVisibility = () => play();

    recolor();
    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    // Themes can be scoped to any wrapper, not just <html>, so every ancestor is watched for token changes
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        refresh.current(true);
      });
    });
    for (let node = root.parentElement; node; node = node.parentElement) {
      mo.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    play();

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce, density]);

  useEffect(() => {
    refresh.current(true);
  }, [skyHorizon, grainColor]);

  useEffect(() => {
    refresh.current(false);
  }, [wind, gustSpeed, sway, brush, interactive, paused]);

  const horizon = `${HORIZON * 100}%`;
  return (
    <div
      ref={rootRef}
      className={cn("relative isolate w-full overflow-hidden", className)}
      style={{
        background: [
          `radial-gradient(ellipse 34% 26% at 72% ${horizon}, ${sunColor}, transparent 70%)`,
          `radial-gradient(ellipse 90% 40% at 72% ${horizon}, color-mix(in oklab, ${sunColor} 45%, transparent), transparent 75%)`,
          `linear-gradient(to bottom, ${skyTop} 0%, ${skyHorizon} ${horizon}, color-mix(in oklab, ${grainColor} 55%, ${skyHorizon}) calc(${horizon} + 6%), color-mix(in oklab, ${grainColor} 60%, #2a1a08) 100%)`,
        ].join(", "),
      }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
