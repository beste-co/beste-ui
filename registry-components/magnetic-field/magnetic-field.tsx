"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface MagneticFieldProps {
  /** Color of the filings. Any CSS color, tokens included. */
  inkColor?: string;
  /** Color of the surface behind them. */
  paperColor?: string;
  /** Distance between filings, in CSS pixels. */
  spacing?: number;
  /** Length of each filing, 0 (short ticks) to 1 (long needles). */
  length?: number;
  /** Stroke weight, 0 (hairline) to 1 (heavy). */
  weight?: number;
  /** Difference between faint filings far from the poles and strong ones near them, 0 to 1. */
  contrast?: number;
  /** How quickly filings swing into line with the field, 0 (lazy) to 1 (snappy). */
  stiffness?: number;
  /** How hard the lead pole pulls the filings toward it, 0 to 1. */
  poleStrength?: number;
  /** A second, opposite pole drifting on its own, which curves the field lines between the two. */
  secondPole?: boolean;
  /** Strength of the shockwave a click or tap sends through the grid, 0 to 1. */
  shockwave?: number;
  /** Seconds between the pulses the field sends on its own while idle; 0 turns them off. */
  pulseInterval?: number;
  /** Speed of the poles' drift, 1 is the default pace. */
  speed?: number;
  /** The lead pole follows the cursor and clicks send shockwaves. */
  interactive?: boolean;
  /** Freeze the field where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const magneticFieldDemo: MagneticFieldProps = {
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  spacing: 24,
  length: 0.5,
  weight: 0.4,
  contrast: 0.5,
  stiffness: 0.5,
  poleStrength: 0.5,
  secondPole: true,
  shockwave: 0.5,
  pulseInterval: 6.5,
  speed: 1,
  interactive: true,
  className: "min-h-[32rem]",
};

const MAX_WAVES = 4;
const MAX_FILINGS = 4200;
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

export function MagneticField({
  inkColor = "var(--foreground)",
  paperColor = "var(--background)",
  spacing = 24,
  length = 0.5,
  weight = 0.4,
  contrast = 0.5,
  stiffness = 0.5,
  poleStrength = 0.5,
  secondPole = true,
  shockwave = 0.5,
  pulseInterval = 6.5,
  speed = 1,
  interactive = true,
  paused = false,
  className,
  children,
}: MagneticFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ inkColor, paperColor, spacing, length, weight, contrast, stiffness, poleStrength, secondPole, shockwave, pulseInterval, speed, interactive, paused });
  settings.current = { inkColor, paperColor, spacing, length, weight, contrast, stiffness, poleStrength, secondPole, shockwave, pulseInterval, speed, interactive, paused };
  const refresh = useRef<(options?: { recolor?: boolean; relayout?: boolean }) => void>(() => {});

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

    let ink = "#111";
    let dpr = 1;
    let count = 0;
    let rx = new Float32Array(0);
    let ry = new Float32Array(0);
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let angle = new Float32Array(0);
    let spin = new Float32Array(0);
    let mag = new Float32Array(0);
    const waveX = new Float32Array(MAX_WAVES);
    const waveY = new Float32Array(MAX_WAVES);
    const waveT = new Float32Array(MAX_WAVES).fill(-99);
    const waveA = new Float32Array(MAX_WAVES);
    let waveNext = 0;
    let lastIdleWave = 0;

    const north = { x: 0, y: 0 };
    const south = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0, active: false };
    let frame = 0;
    let visible = true;
    let clock = 0;
    let drift = 0;
    let last = 0;
    let quality = 1;
    let average = 16.7;
    let tick = 0;
    let introStart = 0;
    let intro = reduce ? 1 : 0;

    const idleNorth = (t: number) => {
      north.x = canvas.width * (0.62 + 0.22 * Math.sin(t * 0.13) + 0.06 * Math.sin(t * 0.37));
      north.y = canvas.height * (0.34 + 0.16 * Math.sin(t * 0.17 + 1.2));
    };
    const setSouth = (t: number) => {
      if (!settings.current.secondPole) {
        south.x = -1e7;
        south.y = -1e7;
        return;
      }
      south.x = canvas.width * (0.34 + 0.2 * Math.sin(t * 0.11 + 2.4));
      south.y = canvas.height * (0.42 + 0.2 * Math.cos(t * 0.09 + 0.6));
    };

    const recolor = () => {
      ink = resolveColor(root, settings.current.inkColor);
    };

    const simulate = (dt: number, settle: boolean) => {
      const s = settings.current;
      const soft = 30 * dpr * (30 * dpr);
      const near = 64 * dpr;
      const reach = 150 * dpr * (150 * dpr);
      const pull = clamp01(s.poleStrength) * 32 * dpr;
      const swing = 0.4 + clamp01(s.stiffness) * 1.2;
      const blast = clamp01(s.shockwave) * 2;
      const waveSpeed = 820 * dpr;
      const waveWidth = 46 * dpr;
      for (let k = 0; k < count; k++) {
        const offX = ox[k] ?? 0;
        const offY = oy[k] ?? 0;
        const x = (rx[k] ?? 0) + offX;
        const y = (ry[k] ?? 0) + offY;
        const nx = x - north.x;
        const ny = y - north.y;
        const sx = x - south.x;
        const sy = y - south.y;
        const dn = nx * nx + ny * ny + soft;
        const ds = sx * sx + sy * sy + soft;
        const ex = nx / dn - sx / ds;
        const ey = ny / dn - sy / ds;
        const strength = Math.min(1, Math.sqrt(ex * ex + ey * ey) * near);
        const target = Math.atan2(ey, ex);
        if (settle) {
          angle[k] = target;
          mag[k] = strength;
          continue;
        }
        const a = angle[k] ?? 0;
        let diff = target - a;
        diff -= Math.PI * Math.round(diff / Math.PI);
        let turn = ((spin[k] ?? 0) + diff * (0.05 + strength * 0.1) * swing) * 0.8;
        const m = mag[k] ?? 0;
        mag[k] = m + (strength - m) * 0.12;

        const len = Math.sqrt(nx * nx + ny * ny) + 0.001;
        const fall = Math.exp(-(len * len) / reach) * pull;
        let ax = ((-nx / len) * fall - offX) * 0.05;
        let ay = ((-ny / len) * fall - offY) * 0.05;
        for (let w = 0; w < MAX_WAVES; w++) {
          const age = clock - (waveT[w] ?? -99);
          if (age > 1.8) continue;
          const wx = x - (waveX[w] ?? 0);
          const wy = y - (waveY[w] ?? 0);
          const wd = Math.sqrt(wx * wx + wy * wy) + 0.001;
          const band = (wd - age * waveSpeed) / waveWidth;
          if (band < -3 || band > 3) continue;
          const push = Math.exp(-band * band) * (waveA[w] ?? 0) * blast * (1 - age / 1.8) * 5 * dpr * dt * 60;
          ax += (wx / wd) * push;
          ay += (wy / wd) * push;
          turn += push * 0.012;
        }
        spin[k] = turn;
        angle[k] = a + turn;
        const velX = ((vx[k] ?? 0) + ax) * 0.86;
        const velY = ((vy[k] ?? 0) + ay) * 0.86;
        vx[k] = velX;
        vy[k] = velY;
        ox[k] = offX + velX;
        oy[k] = offY + velY;
      }
    };

    const draw = () => {
      const s = settings.current;
      const base = 0.5 + clamp01(s.length) * 1;
      const faint = 0.6 - clamp01(s.contrast) * 0.6;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = ink;
      ctx.lineCap = "round";
      ctx.lineWidth = (0.6 + clamp01(s.weight) * 1.5) * dpr;
      for (let pass = 0; pass < 2; pass++) {
        ctx.globalAlpha = (pass === 0 ? Math.max(0.06, faint) : 0.92) * intro;
        ctx.beginPath();
        for (let k = 0; k < count; k++) {
          const m = mag[k] ?? 0;
          if ((pass === 0) !== (m < 0.38)) continue;
          const half = (2.4 + m * 7.5) * base * dpr * (0.15 + 0.85 * intro);
          const a = angle[k] ?? 0;
          const cx = (rx[k] ?? 0) + (ox[k] ?? 0);
          const cy = (ry[k] ?? 0) + (oy[k] ?? 0);
          const dx = Math.cos(a) * half;
          const dy = Math.sin(a) * half;
          ctx.moveTo(cx - dx, cy - dy);
          ctx.lineTo(cx + dx, cy + dy);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      // Coarser grid on a device that can't keep up, and never more than the cap
      let gap = Math.max(8, settings.current.spacing) / quality;
      const area = canvas.clientWidth * canvas.clientHeight;
      if (area / (gap * gap) > MAX_FILINGS) gap = Math.sqrt(area / MAX_FILINGS);
      const step = gap * dpr;
      const cols = Math.ceil(canvas.width / step) + 1;
      const rows = Math.ceil(canvas.height / step) + 1;
      count = cols * rows;
      rx = new Float32Array(count);
      ry = new Float32Array(count);
      ox = new Float32Array(count);
      oy = new Float32Array(count);
      vx = new Float32Array(count);
      vy = new Float32Array(count);
      angle = new Float32Array(count);
      spin = new Float32Array(count);
      mag = new Float32Array(count);
      const offX = (canvas.width - (cols - 1) * step) / 2;
      const offY = (canvas.height - (rows - 1) * step) / 2;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          rx[k] = offX + i * step;
          ry[k] = offY + j * step;
        }
      }
      idleNorth(drift);
      setSouth(drift);
      simulate(0, true);
      draw();
    };

    const pulse = (x: number, y: number, amp: number) => {
      waveX[waveNext] = x;
      waveY[waveNext] = y;
      waveT[waveNext] = clock;
      waveA[waveNext] = amp;
      waveNext = (waveNext + 1) % MAX_WAVES;
    };

    const loop = (now: number) => {
      const delta = last ? Math.min(100, now - last) : 16.7;
      average += (delta - average) * 0.05;
      last = now;
      tick++;
      if (tick % 90 === 0) {
        if (average > 22 && quality > 0.5) {
          quality = Math.max(0.5, quality - 0.15);
          layout();
        } else if (average < 17.5 && quality < 1 && tick % 450 === 0) {
          quality = Math.min(1, quality + 0.1);
          layout();
        }
      }
      const s = settings.current;
      // The filings grow and darken out of the bare paper on load
      if (intro < 1) {
        introStart ||= now;
        const k = Math.min(1, (now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      if (s.paused) {
        draw();
        frame = intro < 1 ? requestAnimationFrame(loop) : 0;
        return;
      }
      const dt = Math.min(0.05, delta / 1000);
      clock += dt;
      drift += dt * s.speed;
      setSouth(drift);
      if (pointer.active && s.interactive) {
        north.x += (pointer.x - north.x) * 0.14;
        north.y += (pointer.y - north.y) * 0.14;
      } else {
        const tx = north.x;
        const ty = north.y;
        idleNorth(drift);
        north.x = tx + (north.x - tx) * 0.04;
        north.y = ty + (north.y - ty) * 0.04;
        if (s.pulseInterval > 0 && clock - lastIdleWave > s.pulseInterval) {
          lastIdleWave = clock;
          pulse(north.x, north.y, 0.55);
        }
      }
      simulate(dt, false);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (!reduce && (!settings.current.paused || intro < 1) && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    refresh.current = (options = {}) => {
      if (options.recolor) recolor();
      if (options.relayout) layout();
      else if (!frame) {
        setSouth(drift);
        simulate(0, true);
        draw();
      }
      play();
    };

    const locate = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      return { inside, x: (event.clientX - rect.left) * dpr, y: (event.clientY - rect.top) * dpr };
    };

    const onMove = (event: PointerEvent) => {
      const hit = locate(event);
      const wasActive = pointer.active;
      pointer.active = hit.inside && event.pointerType !== "touch";
      if (hit.inside) {
        pointer.x = hit.x;
        pointer.y = hit.y;
      }
      if (wasActive && !pointer.active) lastIdleWave = clock;
    };
    const onDown = (event: PointerEvent) => {
      const s = settings.current;
      if (reduce || s.paused || !s.interactive) return;
      const hit = locate(event);
      if (!hit.inside) return;
      pulse(hit.x, hit.y, 1);
      lastIdleWave = clock;
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(() => layout());
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(canvas);
    const mo = new MutationObserver(() =>
      requestAnimationFrame(() => {
        recolor();
        if (!frame) draw();
      }),
    );
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    recolor();
    layout();
    play();

    return () => {
      cancelAnimationFrame(frame);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  useEffect(() => {
    refresh.current({ recolor: true });
  }, [inkColor, paperColor]);

  useEffect(() => {
    refresh.current({ relayout: true });
  }, [spacing]);

  useEffect(() => {
    refresh.current();
  }, [length, weight, contrast, stiffness, poleStrength, secondPole, shockwave, pulseInterval, speed, interactive, paused]);

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)} style={{ backgroundColor: paperColor }}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
