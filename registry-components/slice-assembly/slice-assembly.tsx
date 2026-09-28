"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

/** Anything with a `get()` that returns 0 to 1, such as a framer-motion MotionValue, so scroll can drive the strips without re-rendering. */
export interface SliceProgressSource {
  get(): number;
}

export interface SliceAssemblyProps {
  /** The photograph that is cut into strips. */
  imageSrc?: string;
  /** Description of the photograph for screen readers. */
  imageAlt?: string;
  /** Number of vertical strips. */
  strips?: number;
  /** How far the strips spread forward and back in space, 0 to 1. */
  depth?: number;
  /** How far the strips lift, turn and fan apart, 0 to 1. */
  scatter?: number;
  /** How much the strips arrive one after another instead of together, 0 to 1. */
  stagger?: number;
  /** Light and shade on the turned strips, 0 to 1. */
  shading?: number;
  /** Soft shadow under the lifted strips, 0 to 1. */
  shadow?: number;
  /** Assembly from scattered (0) to whole (1): a number or a live source such as a scroll MotionValue. */
  progress?: number | SliceProgressSource;
  /** Loop between scattered and whole on its own. Defaults to on when no progress is given. */
  autoplay?: boolean;
  /** Pace of the autoplay loop and the idle drift. */
  speed?: number;
  /** The image leans gently toward the cursor. */
  interactive?: boolean;
  /** Freeze the strips where they are. */
  paused?: boolean;
  className?: string;
  children?: ReactNode;
}

export const sliceAssemblyDemo: SliceAssemblyProps = {
  imageSrc: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1400&q=80",
  imageAlt: "A woman in a dark check coat walking down a city street",
  strips: 14,
  depth: 0.6,
  scatter: 0.6,
  stagger: 0.6,
  shading: 0.6,
  shadow: 0.6,
  autoplay: true,
  speed: 1,
  interactive: true,
  className: "aspect-[4/5] w-full max-w-sm md:max-w-md",
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeInOut = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2);
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export function SliceAssembly({
  imageSrc = "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1400&q=80",
  imageAlt = "",
  strips = 14,
  depth = 0.6,
  scatter = 0.6,
  stagger = 0.6,
  shading = 0.6,
  shadow = 0.6,
  progress,
  autoplay,
  speed = 1,
  interactive = true,
  paused = false,
  className,
  children,
}: SliceAssemblyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const shadowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sheenRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [loaded, setLoaded] = useState(false);
  // When the photo arrived; the strips drift in from this moment instead of appearing at once
  const arrivedAt = useRef<number | null>(null);
  const count = Math.max(3, Math.min(40, Math.round(strips)));
  const loop = autoplay ?? progress === undefined;
  const settings = useRef({ depth, scatter, stagger, shading, shadow, progress, loop, speed, interactive, paused });
  settings.current = { depth, scatter, stagger, shading, shadow, progress, loop, speed, interactive, paused };

  // A cached photo can finish loading before hydration, so check it directly as well
  useEffect(() => {
    const first = imageRefs.current[0];
    setLoaded(Boolean(first?.complete && first.naturalWidth > 0));
  }, [imageSrc]);

  useEffect(() => {
    arrivedAt.current = loaded ? performance.now() : null;
  }, [loaded]);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const seedA = new Float32Array(count);
    const seedB = new Float32Array(count);
    const seedC = new Float32Array(count);
    const seedD = new Float32Array(count);
    const order = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seedA[i] = hash(i + 1);
      seedB[i] = hash(i + 41);
      seedC[i] = hash(i + 83);
      seedD[i] = hash(i + 127);
      // Mostly left to right, loosened by a little jitter so the arrival feels hand placed
      order[i] = clamp01((i + ((seedD[i] ?? 0) - 0.5) * 2.2) / Math.max(1, count - 1));
    }

    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let clock = 0;
    let loopClock = 0;
    let visible = true;
    let current = reduce ? 1 : 0;
    let tiltX = 0;
    let tiltY = 0;
    let targetX = 0;
    let targetY = 0;
    let hovering = false;
    let settled = false;

    // Whole-pixel strip edges with a 1px overlap, so the assembled picture has no seams
    const measure = () => {
      width = root.clientWidth;
      height = root.clientHeight;
      for (let i = 0; i < count; i++) {
        const left = Math.round((i * width) / count);
        const right = Math.round(((i + 1) * width) / count);
        const strip = stripRefs.current[i];
        if (strip) {
          strip.style.left = `${left}px`;
          strip.style.width = `${right - left + (i < count - 1 ? 1 : 0)}px`;
        }
        const image = imageRefs.current[i];
        if (image) {
          image.style.width = `${width}px`;
          image.style.height = `${height}px`;
          image.style.left = `${-left}px`;
        }
      }
      settled = false;
    };

    const target = () => {
      const s = settings.current;
      if (reduce) return 1;
      if (s.loop) {
        // Scattered rest, slow assembly, a long look at the whole picture, then apart again
        const cycle = loopClock % 11;
        if (cycle < 1.4) return 0;
        if (cycle < 4.8) return (cycle - 1.4) / 3.4;
        if (cycle < 8.2) return 1;
        return 1 - (cycle - 8.2) / 2.8;
      }
      const source = s.progress;
      if (typeof source === "number") return clamp01(source);
      return clamp01(source?.get() ?? 1);
    };

    const write = () => {
      const s = settings.current;
      const spread = clamp01(s.stagger) * 0.65;
      const lift = clamp01(s.scatter);
      const deep = clamp01(s.depth);
      const light = clamp01(s.shading);
      const shade = clamp01(s.shadow);
      const drift = reduce ? 0 : clock * 0.5 * Math.max(0, s.speed);
      const since = arrivedAt.current === null ? -1 : (performance.now() - arrivedAt.current) / 1000;
      let whole = true;

      for (let i = 0; i < count; i++) {
        const strip = stripRefs.current[i];
        if (!strip) continue;
        // Arrival: each strip floats in from further back and a little below, one after another
        const arrive = reduce ? 1 : since < 0 ? 0 : easeOut(clamp01((since - (order[i] ?? 0) * 0.7) / 1.3));
        strip.style.opacity = arrive.toFixed(3);
        if (arrive < 1) whole = false;
        const late = 1 - arrive;
        const delay = (order[i] ?? 0) * spread;
        const e = easeInOut(clamp01((current - delay) / Math.max(0.001, 1 - spread)));
        const away = 1 - e;
        const a = seedA[i] ?? 0;
        const b = seedB[i] ?? 0;
        const c = seedC[i] ?? 0;

        if (away < 0.0005 && late < 0.0005) {
          strip.style.transform = "none";
          const sh = shadowRefs.current[i];
          const sd = shadeRefs.current[i];
          const sn = sheenRefs.current[i];
          if (sh) sh.style.opacity = "0";
          if (sd) sd.style.opacity = "0";
          if (sn) sn.style.opacity = "0";
          continue;
        }
        whole = false;

        const fan = (i - (count - 1) / 2) / Math.max(1, count - 1);
        const x = fan * width * 0.16 * lift;
        const y = ((i % 2 ? 1 : -1) * (0.35 + 0.65 * a) * 0.16 + Math.sin(drift + a * 6.28) * 0.012) * height * lift;
        const z = ((b * 2 - 1) * 0.35 - 0.12) * width * deep;
        const turn = ((c * 2 - 1) * 30 + Math.sin(drift * 0.8 + b * 6.28) * 3) * lift;
        const roll = (a * 2 - 1) * 2.2 * lift;
        const inY = late * height * 0.07;
        const inZ = -late * width * 0.22;
        strip.style.transform = `translate3d(${(x * away).toFixed(2)}px,${(y * away + inY).toFixed(2)}px,${(z * away + inZ).toFixed(2)}px) rotateY(${(turn * away).toFixed(2)}deg) rotateZ(${(roll * away).toFixed(2)}deg)`;

        const facing = Math.sin((turn * away * Math.PI) / 180);
        const far = clamp01(-z / Math.max(1, width * 0.47));
        const near = clamp01(z / Math.max(1, width * 0.23));
        const sh = shadowRefs.current[i];
        const sd = shadeRefs.current[i];
        const sn = sheenRefs.current[i];
        if (sh) sh.style.opacity = (shade * away * (0.45 + 0.55 * near)).toFixed(3);
        if (sd) sd.style.opacity = (light * away * (Math.max(0, -facing) * 0.9 + far * 0.28)).toFixed(3);
        if (sn) sn.style.opacity = (light * away * Math.max(0, facing) * 0.55).toFixed(3);
      }

      const scale = 1 - 0.05 * (1 - easeInOut(current)) * lift;
      stage.style.transform = `scale(${scale.toFixed(4)}) rotateX(${tiltX.toFixed(3)}deg) rotateY(${tiltY.toFixed(3)}deg)`;
      return whole;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const s = settings.current;
      if (!s.paused) {
        clock += dt;
        if (s.loop) loopClock += dt * Math.max(0, s.speed);
      }
      const goal = target();
      const before = current;
      current += (goal - current) * (s.loop ? 1 : 1 - Math.exp(-dt * 9));
      if (Math.abs(goal - current) < 0.0002) current = goal;

      const tx = s.interactive && hovering ? targetY * -3 : 0;
      const ty = s.interactive && hovering ? targetX * 4 : 0;
      const k = 1 - Math.exp(-dt * 4);
      const prevX = tiltX;
      const prevY = tiltY;
      tiltX += (tx - tiltX) * k;
      tiltY += (ty - tiltY) * k;
      const tiltMoving = Math.abs(tiltX - prevX) + Math.abs(tiltY - prevY) > 0.0005;

      if (!settled || current !== before || tiltMoving || current < 1 || arrivedAt.current === null) {
        settled = write() && !tiltMoving && current === goal;
      }
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (reduce) {
        write();
        return;
      }
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = root.getBoundingClientRect();
      hovering =
        event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (hovering) {
        targetX = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
        targetY = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;
      }
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(() => {
      measure();
      write();
    });
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    measure();
    current = reduce ? 1 : target();
    write();
    play();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count]);

  return (
    <div ref={rootRef} role="img" aria-label={imageAlt} className={cn("relative isolate w-full [perspective:1400px]", className)}>
      <div
        ref={stageRef}
        className={cn(
          "absolute inset-0 [transform-style:preserve-3d] will-change-transform",
        )}
      >
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              stripRefs.current[i] = el;
            }}
            className="absolute inset-y-0 will-change-transform"
          >
            <div
              ref={(el) => {
                shadowRefs.current[i] = el;
              }}
              className="absolute inset-0 opacity-0 shadow-[0_28px_48px_-18px_rgba(0,0,0,0.55),0_8px_16px_-10px_rgba(0,0,0,0.35)]"
            />
            <div className="absolute inset-0 overflow-hidden">
              {/* biome-ignore lint/performance/noImgElement: installable component, framework free */}
              <img
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                src={imageSrc}
                alt=""
                draggable={false}
                onLoad={i === 0 ? () => setLoaded(true) : undefined}
                className="absolute top-0 max-w-none select-none object-cover"
              />
              <div
                ref={(el) => {
                  shadeRefs.current[i] = el;
                }}
                className="absolute inset-0 bg-black opacity-0"
              />
              <div
                ref={(el) => {
                  sheenRefs.current[i] = el;
                }}
                className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/15 to-transparent opacity-0"
              />
            </div>
          </div>
        ))}
      </div>
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
