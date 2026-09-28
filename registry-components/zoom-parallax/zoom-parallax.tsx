"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef } from "react";

/** Anything with a `get()` that returns 0 to 1, such as a framer-motion MotionValue, so scroll can drive the zoom without re-rendering. */
export interface ZoomProgressSource {
  get(): number;
}

export interface ZoomParallaxImage {
  src: string;
  alt?: string;
}

type Layout = "editorial" | "headline";

export interface ZoomParallaxProps {
  /** Up to seven photographs; the first is the center image that grows to fill the frame. */
  images?: ZoomParallaxImage[];
  /** Collage arrangement: balanced around the center, or with a clear band at the top for a headline. */
  layout?: Layout;
  /** How much faster the center grows than the photographs around it, 0 to 1. */
  depth?: number;
  /** Soft shadow under each photograph, 0 to 1. */
  shadow?: number;
  /** Zoom from collage (0) to the full center photograph (1): a number or a live source such as a scroll MotionValue. */
  progress?: number | ZoomProgressSource;
  /** Loop between collage and full frame on its own. Defaults to on when no progress is given. */
  autoplay?: boolean;
  /** Pace of the autoplay loop. */
  speed?: number;
  /** The collage drifts gently with the cursor, the nearest photographs most. */
  interactive?: boolean;
  /** Freeze the zoom where it is. */
  paused?: boolean;
  className?: string;
  /** Overlay content, positioned by the caller. */
  children?: ReactNode;
}

const defaultImages: ZoomParallaxImage[] = [
  { src: "https://images.unsplash.com/photo-1661887561938-a6fc6ab641a9?w=2000&q=80", alt: "A turquoise bay ringed by pines and limestone" },
  { src: "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=900&q=80", alt: "Concrete spiral staircase shot from below" },
  { src: "https://images.unsplash.com/photo-1658834951917-101ba5b8f65c?w=900&q=80", alt: "Turquoise shallows and a pebble beach seen from above" },
  { src: "https://images.unsplash.com/photo-1777523743687-233bbfdbd894?w=900&q=80", alt: "Quiet timber-clad interior" },
  { src: "https://images.unsplash.com/photo-1579437469180-e31a7aa7273d?w=900&q=80", alt: "A quiet pebble beach with a wooded headland" },
  { src: "https://images.unsplash.com/photo-1728755696561-f8fd6ff03630?w=900&q=80", alt: "A quiet, light-filled interior" },
  { src: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=900&q=80", alt: "Concrete stairwell lit from a single window" },
];

export const zoomParallaxDemo: ZoomParallaxProps = {
  images: defaultImages,
  layout: "editorial",
  depth: 0.7,
  shadow: 0.6,
  autoplay: true,
  speed: 1,
  interactive: true,
  className: "min-h-[32rem]",
};

// Boxes in percent of the frame: x, y, width, height, and how fast each grows relative to the center
type Box = [number, number, number, number, number];
const layouts: Record<Layout, { wide: Box[]; tall: Box[] }> = {
  editorial: {
    wide: [
      [35, 31, 30, 38, 1],
      [5, 8, 19, 32, 0.45],
      [57, 5, 15, 21, 0.6],
      [71, 30, 24, 30, 0.5],
      [52, 75, 19, 21, 0.65],
      [10, 57, 19, 30, 0.4],
      [30, 6, 13, 19, 0.7],
    ],
    tall: [
      [27, 34, 46, 32, 1],
      [4, 7, 30, 20, 0.45],
      [58, 4, 24, 16, 0.6],
      [78, 26, 19, 22, 0.5],
      [60, 72, 34, 20, 0.65],
      [3, 52, 20, 24, 0.4],
      [14, 80, 28, 16, 0.7],
    ],
  },
  headline: {
    wide: [
      [36, 40, 28, 36, 1],
      [4, 6, 18, 32, 0.45],
      [79, 5, 17, 26, 0.6],
      [74, 37, 22, 26, 0.5],
      [67, 71, 16, 25, 0.65],
      [6, 48, 21, 28, 0.4],
      [23, 80, 12, 16, 0.7],
    ],
    tall: [
      [28, 40, 44, 30, 1],
      [3, 38, 21, 20, 0.45],
      [76, 44, 21, 18, 0.6],
      [5, 62, 19, 16, 0.5],
      [77, 66, 19, 14, 0.65],
      [10, 82, 30, 15, 0.4],
      [46, 78, 28, 18, 0.7],
    ],
  },
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeInOut = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

export function ZoomParallax({
  images = defaultImages,
  layout = "editorial",
  depth = 0.7,
  shadow = 0.6,
  progress,
  autoplay,
  speed = 1,
  interactive = true,
  paused = false,
  className,
  children,
}: ZoomParallaxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const slots = images.slice(0, 7);
  const count = slots.length;
  const loop = autoplay ?? progress === undefined;
  const settings = useRef({ progress, loop, speed, interactive, paused });
  settings.current = { progress, loop, speed, interactive, paused };
  const imageKey = slots.map((image) => image.src).join("|");

  // A cached photo can finish loading before hydration, so reveal those directly
  useEffect(() => {
    for (const image of imageRefs.current) {
      if (image?.complete && image.naturalWidth > 0) image.style.opacity = "1";
    }
  }, [imageKey]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || count === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const deep = clamp01(depth);
    const shade = clamp01(shadow);

    // Per slot: collage box (px), final scale and the layout offset of its full-size box
    const bx = new Float32Array(count);
    const by = new Float32Array(count);
    const final = new Float32Array(count);
    const layoutX = new Float32Array(count);
    const layoutY = new Float32Array(count);
    const rate = new Float32Array(count);
    let px = 0;
    let py = 0;
    let cx = 0;
    let cy = 0;
    let span = 1;

    let frame = 0;
    let last = 0;
    let loopClock = 0;
    let visible = true;
    let current = reduce ? 1 : 0;
    let pointerX = 0;
    let pointerY = 0;
    let driftX = 0;
    let driftY = 0;
    let dirty = true;

    // Frames are laid out at their full zoomed size and scaled down, so photographs stay crisp all the way in
    const measure = () => {
      const width = root.clientWidth;
      const height = root.clientHeight;
      if (!width || !height) return;
      const boxes = layouts[layout][width / height < 0.95 ? "tall" : "wide"];
      cx = width / 2;
      cy = height / 2;
      const center = boxes[0] ?? [35, 31, 30, 38, 1];
      const cw = (center[2] / 100) * width;
      const ch = (center[3] / 100) * height;
      px = (center[0] / 100) * width + cw / 2;
      py = (center[1] / 100) * height + ch / 2;
      span = Math.max(1.001, Math.max(width / cw, height / ch) * 1.004);

      for (let i = 0; i < count; i++) {
        const box = boxes[i] ?? center;
        const x = (box[0] / 100) * width;
        const y = (box[1] / 100) * height;
        const w = (box[2] / 100) * width;
        const h = (box[3] / 100) * height;
        const r = i === 0 ? 1 : 1 - deep * (1 - box[4]);
        const f = 1 + (span - 1) * r;
        bx[i] = x;
        by[i] = y;
        rate[i] = r;
        final[i] = f;
        layoutX[i] = px + (x - px) * f + (cx - px);
        layoutY[i] = py + (y - py) * f + (cy - py);
        const el = frameRefs.current[i];
        if (!el) continue;
        el.style.left = `${layoutX[i]}px`;
        el.style.top = `${layoutY[i]}px`;
        el.style.width = `${w * f}px`;
        el.style.height = `${h * f}px`;
        el.style.zIndex = String(i === 0 ? 10 : Math.round(r * 8));
        el.style.boxShadow =
          shade > 0
            ? `0 ${(18 * f).toFixed(1)}px ${(48 * f).toFixed(1)}px ${(-14 * f).toFixed(1)}px rgba(18,14,10,${(0.34 * shade).toFixed(3)}), 0 ${(2 * f).toFixed(1)}px ${(6 * f).toFixed(1)}px rgba(18,14,10,${(0.1 * shade).toFixed(3)})`
            : "none";
      }
      root.style.opacity = "1";
      dirty = true;
    };

    const target = () => {
      const s = settings.current;
      if (reduce) return 1;
      if (s.loop) {
        // Collage rest, a slow push in, a long look at the full photograph, then back out
        const cycle = loopClock % 12;
        if (cycle < 1.8) return 0;
        if (cycle < 6) return (cycle - 1.8) / 4.2;
        if (cycle < 9) return 1;
        return 1 - (cycle - 9) / 3;
      }
      const source = s.progress;
      if (typeof source === "number") return clamp01(source);
      return clamp01(source?.get() ?? 0);
    };

    const write = () => {
      const e = easeInOut(current);
      const logSpan = Math.log(span);
      // Centering follows the center image's zoom, so the camera glides onto it as it grows
      const settle = (Math.exp(logSpan * e) - 1) / (span - 1);
      const away = 1 - e;
      for (let i = 0; i < count; i++) {
        const el = frameRefs.current[i];
        if (!el) continue;
        const f = final[i] ?? 1;
        const k = Math.exp(Math.log(f) * e);
        const lean = (1 - (rate[i] ?? 1) + 0.12) * 16 * away;
        const x = px + ((bx[i] ?? 0) - px) * k + (cx - px) * settle + driftX * lean;
        const y = py + ((by[i] ?? 0) - py) * k + (cy - py) * settle + driftY * lean;
        el.style.transform = `translate3d(${(x - (layoutX[i] ?? 0)).toFixed(2)}px,${(y - (layoutY[i] ?? 0)).toFixed(2)}px,0) scale(${(k / f).toFixed(5)})`;
        const image = imageRefs.current[i];
        if (image) image.style.transform = `scale(${(1 + 0.14 * deep * away).toFixed(4)})`;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const s = settings.current;
      if (!s.paused) {
        if (s.loop) loopClock += dt * Math.max(0, s.speed);
        const goal = target();
        const next = current + (goal - current) * (1 - Math.exp(-dt * (s.loop ? 30 : 9)));
        if (Math.abs(next - current) > 1e-5) dirty = true;
        current = Math.abs(goal - next) < 1e-4 ? goal : next;
      }
      const aimX = s.interactive ? pointerX : 0;
      const aimY = s.interactive ? pointerY : 0;
      const lerp = 1 - Math.exp(-dt * 3);
      if (Math.abs(aimX - driftX) > 1e-4 || Math.abs(aimY - driftY) > 1e-4) {
        driftX += (aimX - driftX) * lerp;
        driftY += (aimY - driftY) * lerp;
        dirty = true;
      }
      if (dirty) {
        write();
        dirty = false;
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
      const inside =
        event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      pointerX = inside ? ((event.clientX - rect.left) / rect.width - 0.5) * 2 : 0;
      pointerY = inside ? ((event.clientY - rect.top) / rect.height - 0.5) * 2 : 0;
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(() => {
      measure();
      if (reduce) write();
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
    write();
    play();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, layout, depth, shadow]);

  return (
    <div ref={rootRef} className={cn("relative w-full overflow-hidden opacity-0 transition-opacity duration-500", className)}>
      {slots.map((image, index) => (
        <div
          key={index}
          ref={(el) => {
            frameRefs.current[index] = el;
          }}
          className="absolute left-0 top-0 overflow-hidden bg-muted will-change-transform [transform-origin:0_0]"
        >
          <img
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            src={image.src}
            alt={image.alt ?? ""}
            draggable={false}
            decoding="async"
            onLoad={(event) => {
              event.currentTarget.style.opacity = "1";
            }}
            className="absolute inset-0 size-full select-none object-cover opacity-0 transition-opacity duration-700 will-change-transform"
          />
        </div>
      ))}
      {children}
    </div>
  );
}
