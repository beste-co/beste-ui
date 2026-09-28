"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

export interface MurmurationProps {
  /** Birds in the flock, 200 to 2600. Fewer are flown on a device that can't keep up. */
  birds?: number;
  /** Color at the top of the sky. Any CSS color. */
  skyTop?: string;
  /** Color at the horizon. */
  skyHorizon?: string;
  /** Color of the birds. */
  birdColor?: string;
  /** Size of each bird, 0 (specks) to 1 (larger marks). */
  birdSize?: number;
  /** Flight speed, 1 is the default pace. */
  speed?: number;
  /** How strongly birds close in on their neighbors, 0 to 1. */
  cohesion?: number;
  /** How strongly birds match their neighbors' heading, 0 to 1. */
  alignment?: number;
  /** How strongly birds keep their personal space, 0 to 1. */
  separation?: number;
  /** How far the flock roams and reshapes across the sky, 0 to 1. */
  wander?: number;
  /** How hard birds flee the cursor, 0 to 1. */
  hawk?: number;
  /** Radius around the cursor that birds flee, in pixels. */
  hawkRadius?: number;
  /** The cursor acts as a hawk. */
  interactive?: boolean;
  /** Freeze the flock where it is. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const murmurationDemo: MurmurationProps = {
  birds: 1800,
  skyTop: "#353a5c",
  skyHorizon: "#e7b08a",
  birdColor: "#16141c",
  birdSize: 0.5,
  speed: 1,
  cohesion: 0.5,
  alignment: 0.6,
  separation: 0.5,
  wander: 0.5,
  hawk: 0.6,
  hawkRadius: 140,
  interactive: true,
  className: "min-h-[32rem]",
};

const MAX_BIRDS = 2600;
const MIN_BIRDS = 700;
const CELL = 28;
const NEIGHBORS = 12;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const INTRO_MS = 2400;

// Resolves any CSS color (tokens included) to an rgb() string the canvas accepts everywhere
function resolveColor(el: HTMLElement, color: string) {
  const previous = el.style.color;
  el.style.color = color;
  const computed = getComputedStyle(el).color;
  el.style.color = previous;
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

export function Murmuration({
  birds = 1800,
  skyTop = "#353a5c",
  skyHorizon = "#e7b08a",
  birdColor = "#16141c",
  birdSize = 0.5,
  speed = 1,
  cohesion = 0.5,
  alignment = 0.6,
  separation = 0.5,
  wander = 0.5,
  hawk = 0.6,
  hawkRadius = 140,
  interactive = true,
  paused = false,
  className,
  children,
}: MurmurationProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ birds, birdColor, birdSize, speed, cohesion, alignment, separation, wander, hawk, hawkRadius, interactive, paused });
  settings.current = { birds, birdColor, birdSize, speed, cohesion, alignment, separation, wander, hawk, hawkRadius, interactive, paused };
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
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const px = new Float32Array(MAX_BIRDS);
    const py = new Float32Array(MAX_BIRDS);
    const vx = new Float32Array(MAX_BIRDS);
    const vy = new Float32Array(MAX_BIRDS);
    const panic = new Float32Array(MAX_BIRDS);
    const order = new Int32Array(MAX_BIRDS);
    const cellOf = new Int32Array(MAX_BIRDS);
    const attract = new Float32Array(6);
    let cellCount = new Int32Array(1);
    let cellStart = new Int32Array(1);
    let cols = 1;
    let rows = 1;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let active = 0;
    let seeded = false;
    let ink = "#16141c";
    let time = 0;
    let frame = 0;
    let last = 0;
    let tick = 0;
    let calm = 0;
    let average = 16.7;
    let visible = true;
    let introStart = 0;
    let intro = reduce ? 1 : 0;
    const pointer = { x: 0, y: 0, inside: false };

    const target = () => Math.min(MAX_BIRDS, Math.max(200, Math.round(settings.current.birds)));

    const place = (from: number, to: number) => {
      for (let i = from; i < to; i++) {
        // Newcomers join the flock beside an existing bird, so the count can grow without stray specks
        const host = from > 0 ? Math.floor(Math.random() * from) : -1;
        if (host >= 0) {
          px[i] = (px[host] ?? 0) + (Math.random() - 0.5) * 12;
          py[i] = (py[host] ?? 0) + (Math.random() - 0.5) * 12;
          vx[i] = vx[host] ?? 1;
          vy[i] = vy[host] ?? 0;
        } else {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.sqrt(Math.random()) * Math.min(width, height) * 0.18;
          px[i] = width * 0.58 + Math.cos(angle) * radius * 1.7;
          py[i] = height * 0.38 + Math.sin(angle) * radius;
          const heading = Math.random() * 0.6 - 0.3;
          vx[i] = Math.cos(heading) * 2;
          vy[i] = Math.sin(heading) * 2;
        }
        panic[i] = 0;
      }
    };

    const step = (dt: number) => {
      const s = settings.current;
      const k = Math.min(3, dt * 60);
      time += dt * s.speed;
      const n = cols * rows;

      // Uniform grid: count, prefix, fill; nothing allocated per frame
      cellCount.fill(0, 0, n);
      for (let i = 0; i < active; i++) {
        const cx = Math.min(cols - 1, Math.max(0, Math.floor((px[i] ?? 0) / CELL)));
        const cy = Math.min(rows - 1, Math.max(0, Math.floor((py[i] ?? 0) / CELL)));
        const c = cy * cols + cx;
        cellOf[i] = c;
        cellCount[c] = (cellCount[c] ?? 0) + 1;
      }
      let acc = 0;
      for (let c = 0; c < n; c++) {
        cellStart[c] = acc;
        acc += cellCount[c] ?? 0;
        cellCount[c] = 0;
      }
      for (let i = 0; i < active; i++) {
        const c = cellOf[i] ?? 0;
        const slot = (cellStart[c] ?? 0) + (cellCount[c] ?? 0);
        order[slot] = i;
        cellCount[c] = (cellCount[c] ?? 0) + 1;
      }

      // Three slow attractors; each bird follows one, so the flock splits and rejoins as they drift
      for (let g = 0; g < 3; g++) {
        attract[g * 2] = width * (0.6 + 0.24 * Math.sin(time * 0.09 + g * 2.1) + 0.06 * Math.sin(time * 0.23 + g));
        attract[g * 2 + 1] = height * (0.36 + 0.16 * Math.sin(time * 0.13 + g * 1.7) + 0.05 * Math.cos(time * 0.29 + g * 3));
      }

      const align = clamp01(s.alignment) * 0.09;
      const cohere = clamp01(s.cohesion) * 0.004;
      const repel = 0.4 + clamp01(s.separation) * 2.2;
      const roam = 0.012 + clamp01(s.wander) * 0.05;
      const sepRadius = 7 + clamp01(s.birdSize) * 5;
      const sep2 = sepRadius * sepRadius;
      const reach2 = CELL * CELL;
      const margin = Math.min(width, height) * 0.08;
      const hawkOn = s.interactive && pointer.inside;
      const hawkR = Math.max(20, s.hawkRadius);
      const flee = clamp01(s.hawk) * 2.4;

      for (let i = 0; i < active; i++) {
        const x = px[i] ?? 0;
        const y = py[i] ?? 0;
        const ux = vx[i] ?? 0;
        const uy = vy[i] ?? 0;
        let count = 0;
        let alx = 0;
        let aly = 0;
        let cox = 0;
        let coy = 0;
        let sx = 0;
        let sy = 0;
        let fear = 0;
        const c = cellOf[i] ?? 0;
        const cx = c % cols;
        const cy = (c - cx) / cols;
        for (let oy = -1; oy <= 1 && count < NEIGHBORS; oy++) {
          const ry = cy + oy;
          if (ry < 0 || ry >= rows) continue;
          for (let ox = -1; ox <= 1 && count < NEIGHBORS; ox++) {
            const rx = cx + ox;
            if (rx < 0 || rx >= cols) continue;
            const cell = ry * cols + rx;
            const start = cellStart[cell] ?? 0;
            const end = start + (cellCount[cell] ?? 0);
            for (let o = start; o < end && count < NEIGHBORS; o++) {
              const j = order[o] ?? 0;
              if (j === i) continue;
              const dx = (px[j] ?? 0) - x;
              const dy = (py[j] ?? 0) - y;
              const d2 = dx * dx + dy * dy;
              if (d2 > reach2) continue;
              count++;
              alx += vx[j] ?? 0;
              aly += vy[j] ?? 0;
              cox += dx;
              coy += dy;
              if (d2 < sep2) {
                const inv = 1 / (d2 + 1);
                sx -= dx * inv;
                sy -= dy * inv;
              }
              const pj = panic[j] ?? 0;
              if (pj > fear) fear = pj;
            }
          }
        }

        let ax = 0;
        let ay = 0;
        if (count > 0) {
          ax += (alx / count - ux) * align + (cox / count) * cohere + sx * repel;
          ay += (aly / count - uy) * align + (coy / count) * cohere + sy * repel;
        }
        const g = i % 3;
        const tx = (attract[g * 2] ?? width / 2) - x;
        const ty = (attract[g * 2 + 1] ?? height / 2) - y;
        const td = Math.hypot(tx, ty) + 1;
        ax += (tx / td) * roam;
        ay += (ty / td) * roam;

        if (x < margin) ax += (margin - x) * 0.004;
        else if (x > width - margin) ax -= (x - (width - margin)) * 0.004;
        if (y < margin) ay += (margin - y) * 0.004;
        else if (y > height - margin * 2) ay -= (y - (height - margin * 2)) * 0.004;

        // Panic spreads from bird to bird, so the hawk's wake travels through the flock as a wave
        let scare = Math.max((panic[i] ?? 0) * 0.965, fear * 0.88);
        if (hawkOn) {
          const hx = x - pointer.x;
          const hy = y - pointer.y;
          const hd2 = hx * hx + hy * hy;
          if (hd2 < hawkR * hawkR) {
            const hd = Math.sqrt(hd2) + 0.001;
            const f = 1 - hd / hawkR;
            ax += (hx / hd) * f * flee;
            ay += (hy / hd) * f * flee;
            if (f > scare) scare = f;
          }
        }
        panic[i] = scare;

        let nx = ux + ax * k;
        let ny = uy + ay * k;
        const sp = Math.hypot(nx, ny) + 0.0001;
        const top = (2.3 + scare * 2.4) * s.speed;
        const floor = 1.1 * s.speed;
        if (sp > top) {
          nx = (nx / sp) * top;
          ny = (ny / sp) * top;
        } else if (sp < floor) {
          nx = (nx / sp) * floor;
          ny = (ny / sp) * floor;
        }
        vx[i] = nx;
        vy[i] = ny;
      }

      for (let i = 0; i < active; i++) {
        px[i] = (px[i] ?? 0) + (vx[i] ?? 0) * k;
        py[i] = (py[i] ?? 0) + (vy[i] ?? 0) * k;
      }
    };

    const draw = () => {
      const s = settings.current;
      const length = (1 + clamp01(s.birdSize) * 1.4) * (0.3 + 0.7 * intro);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1 + clamp01(s.birdSize) * 0.9;
      ctx.lineCap = "round";
      // Three alpha buckets: where the flock folds the marks stack up darker, where it thins it turns translucent
      for (let bucket = 0; bucket < 3; bucket++) {
        ctx.globalAlpha = (bucket === 0 ? 0.5 : bucket === 1 ? 0.68 : 0.86) * intro;
        ctx.beginPath();
        for (let i = bucket; i < active; i += 3) {
          const ux = vx[i] ?? 1;
          const uy = vy[i] ?? 0;
          const sp = Math.hypot(ux, uy) || 1;
          const dx = (ux / sp) * length;
          const dy = (uy / sp) * length;
          const x = px[i] ?? 0;
          const y = py[i] ?? 0;
          ctx.moveTo(x - dx, y - dy);
          ctx.lineTo(x + dx, y + dy);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const recolor = () => {
      ink = resolveColor(root, settings.current.birdColor);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      if (cols * rows > cellCount.length) {
        cellCount = new Int32Array(cols * rows);
        cellStart = new Int32Array(cols * rows);
      }
      if (!seeded) {
        active = target();
        place(0, active);
        seeded = true;
        if (reduce) for (let i = 0; i < 240; i++) step(1 / 60);
      }
      draw();
    };

    const loop = (now: number) => {
      const delta = last ? Math.min(100, now - last) : 16.7;
      last = now;
      average += (delta - average) * 0.05;
      tick++;
      // The flock gathers out of the empty sky on load
      if (intro < 1) {
        introStart ||= now;
        const k = Math.min(1, (now - introStart) / INTRO_MS);
        intro = k * k * k * (k * (k * 6 - 15) + 10);
      }
      if (settings.current.paused) {
        draw();
        frame = intro < 1 ? requestAnimationFrame(loop) : 0;
        return;
      }
      if (tick % 60 === 0) {
        const goal = target();
        if (active > goal) {
          active = goal;
        } else if (average > 22 && active > MIN_BIRDS) {
          active = Math.max(MIN_BIRDS, Math.floor(active * 0.85));
          calm = 0;
        } else if (average < 17.5 && active < goal) {
          calm++;
          if (calm >= 3) {
            const next = Math.min(goal, active + 150);
            place(active, next);
            active = next;
            calm = 0;
          }
        } else {
          calm = 0;
        }
      }
      step(Math.min(0.05, delta / 1000));
      draw();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!reduce && (!settings.current.paused || intro < 1) && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    refresh.current = (withColors = false) => {
      if (withColors) {
        recolor();
        draw();
      }
      play();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        pointer.inside = false;
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.x = x;
      pointer.y = y;
    };
    const onLeave = () => {
      pointer.inside = false;
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
    const mo = new MutationObserver(() => requestAnimationFrame(() => refresh.current(true)));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    play();

    return () => {
      cancelAnimationFrame(frame);
      refresh.current = () => {};
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  useEffect(() => {
    refresh.current(true);
  }, [birdColor]);

  useEffect(() => {
    refresh.current(false);
  }, [birds, birdSize, speed, cohesion, alignment, separation, wander, hawk, hawkRadius, interactive, paused]);

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate w-full overflow-hidden", className)}
      style={{ background: `linear-gradient(to bottom, ${skyTop} 0%, color-mix(in oklab, ${skyTop} 45%, ${skyHorizon}) 55%, ${skyHorizon} 100%)` }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
