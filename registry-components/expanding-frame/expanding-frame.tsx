"use client";

import { cn } from "@/lib/utils";
import { type ElementType, type ReactNode, useEffect, useRef, useState } from "react";

/** Anything with a `get()` that returns 0 to 1, such as a framer-motion MotionValue, so scroll can drive the frame without re-rendering. */
export interface ExpandingFrameProgressSource {
  get(): number;
}

type Tag = "h1" | "h2" | "h3" | "p" | "div";

export interface ExpandingFrameProps {
  /** The two headline lines: the first slides away to the left, the second to the right. */
  lines?: [string, string];
  /** Element the headline renders as for screen readers. */
  as?: Tag;
  /** The photograph inside the frame. */
  imageSrc?: string;
  /** Description of the photograph for screen readers. */
  imageAlt?: string;
  /** Starting width of the frame as a share of the stage width, 0.15 to 0.6. */
  startWidth?: number;
  /** Starting corner radius of the frame in pixels; it eases to square as the frame fills the stage. */
  radius?: number;
  /** How far the photograph is zoomed in while the frame is small; it settles to 1 when full. */
  zoom?: number;
  /** From small frame (0) to full bleed (1): a number or a live source such as a scroll MotionValue. */
  progress?: number | ExpandingFrameProgressSource;
  /** Open and close on its own. Defaults to on when no progress is given. */
  autoplay?: boolean;
  /** Pace of the autoplay loop. */
  speed?: number;
  /** Hold the frame where it is. */
  paused?: boolean;
  /** Font and size of the headline lines, as Tailwind classes. */
  lineClassName?: string;
  className?: string;
  /** Overlay that settles in once the photograph fills the stage. */
  children?: ReactNode;
}

export const expandingFrameDemo: ExpandingFrameProps = {
  lines: ["Built around", "the light."],
  imageSrc: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=2000&q=80",
  imageAlt: "Curved white bands of a building rising around an opening of blue sky",
  startWidth: 0.3,
  radius: 28,
  zoom: 1.3,
  autoplay: true,
  speed: 1,
  lineClassName: "text-5xl font-semibold leading-[0.9] tracking-[-0.05em] md:text-7xl",
  className: "min-h-[32rem] bg-background text-foreground",
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeInOut = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

export function ExpandingFrame({
  lines = ["Built around", "the light."],
  as = "h2",
  imageSrc = "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=2000&q=80",
  imageAlt = "",
  startWidth = 0.3,
  radius = 28,
  zoom = 1.3,
  progress,
  autoplay,
  speed = 1,
  paused = false,
  lineClassName = "text-5xl font-semibold leading-[0.9] tracking-[-0.05em] sm:text-7xl md:text-8xl lg:text-[9rem]",
  className,
  children,
}: ExpandingFrameProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const loop = autoplay ?? progress === undefined;
  const settings = useRef({ startWidth, radius, zoom, progress, loop, speed, paused });
  settings.current = { startWidth, radius, zoom, progress, loop, speed, paused };
  const Tag = as as ElementType;

  // A cached photo can finish loading before hydration, so check it directly as well
  useEffect(() => {
    const image = imageRef.current;
    setLoaded(Boolean(image?.complete && image.naturalWidth > 0));
  }, [imageSrc]);

  useEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const image = imageRef.current;
    const first = firstRef.current;
    const second = secondRef.current;
    if (!root || !frame || !image || !first || !second) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let firstW = 0;
    let firstH = 0;
    let secondW = 0;
    let frameId = 0;
    let last = 0;
    let loopClock = 0;
    let visible = true;
    let current = 0;
    let dirty = true;
    let isOpen = false;
    let seen = settings.current;

    const measure = () => {
      width = root.clientWidth;
      height = root.clientHeight;
      firstW = first.offsetWidth;
      firstH = first.offsetHeight;
      secondW = second.offsetWidth;
      dirty = true;
      setReady(true);
    };

    const target = () => {
      const s = settings.current;
      if (reduce) return 1;
      if (s.loop) {
        // Rest small, open, a long look at the full photograph, then close again
        const cycle = loopClock % 9.5;
        if (cycle < 1.4) return 0;
        if (cycle < 4.8) return (cycle - 1.4) / 3.4;
        if (cycle < 7.8) return 1;
        return 1 - (cycle - 7.8) / 1.7;
      }
      const source = s.progress;
      if (typeof source === "number") return clamp01(source);
      return clamp01(source?.get() ?? 1);
    };

    const write = () => {
      const s = settings.current;
      const share = Math.min(0.6, Math.max(0.15, s.startWidth));
      // Phones keep a readable frame instead of a thumbnail
      const startW = Math.min(width, Math.max(width * share, Math.min(width * 0.6, 220)));
      const startH = Math.min(startW * 0.64, height * 0.34);

      const grow = easeInOut(clamp01((current - 0.04) / 0.92));
      const w = startW + (width - startW) * grow;
      const h = startH + (height - startH) * grow;
      const insetX = Math.max(0, (width - w) / 2);
      const insetY = Math.max(0, (height - h) / 2);
      const corner = Math.max(0, s.radius) * (1 - grow);
      frame.style.clipPath = `inset(${insetY.toFixed(2)}px ${insetX.toFixed(2)}px ${insetY.toFixed(2)}px ${insetX.toFixed(2)}px round ${corner.toFixed(2)}px)`;
      const scale = Math.max(1, s.zoom) + (1 - Math.max(1, s.zoom)) * grow;
      image.style.transform = `scale(${scale.toFixed(4)})`;

      // The lines part before the frame reaches them, so the photograph slides over empty space
      const part = easeInOut(clamp01(current / 0.62));
      const gap = Math.max(12, height * 0.022);
      const top = (height - startH) / 2;
      const bottom = (height + startH) / 2;
      const outFirst = (width / 2 + firstW / 2 + 32) * part;
      const outSecond = (width / 2 + secondW / 2 + 32) * part;
      first.style.transform = `translate3d(${((width - firstW) / 2 - outFirst).toFixed(2)}px,${(top - gap - firstH).toFixed(2)}px,0)`;
      second.style.transform = `translate3d(${((width - secondW) / 2 + outSecond).toFixed(2)}px,${(bottom + gap).toFixed(2)}px,0)`;

      // Two clean states for the overlay, with hysteresis so it never flickers half shown
      const nextOpen = isOpen ? current > 0.8 : current >= 0.96;
      if (nextOpen !== isOpen) {
        isOpen = nextOpen;
        setOpen(nextOpen);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const s = settings.current;
      if (!s.paused && s.loop) loopClock += dt * Math.max(0, s.speed);
      const goal = s.paused ? current : target();
      const before = current;
      current += (goal - current) * (s.loop ? 1 : 1 - Math.exp(-dt * 10));
      if (Math.abs(goal - current) < 0.0002) current = goal;
      if (seen !== s) {
        seen = s;
        dirty = true;
      }
      if (dirty || current !== before) {
        dirty = false;
        write();
      }
      frameId = requestAnimationFrame(tick);
    };

    const play = () => {
      cancelAnimationFrame(frameId);
      last = 0;
      if (reduce) {
        write();
        return;
      }
      if (visible && !document.hidden) frameId = requestAnimationFrame(tick);
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(() => {
      measure();
      write();
    });
    ro.observe(root);
    ro.observe(first);
    ro.observe(second);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", onVisibility);
    document.fonts?.ready.then(() => {
      measure();
      write();
    });
    measure();
    current = target();
    write();
    play();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const line = "block whitespace-nowrap transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:transition-none";

  return (
    <div ref={rootRef} className={cn("relative isolate w-full overflow-hidden", className)}>
      <Tag className="sr-only">{lines.join(" ")}</Tag>

      <div aria-hidden="true" className={cn(lineClassName)}>
        <div ref={firstRef} className="absolute left-0 top-0 py-[0.06em] [clip-path:inset(0_-0.12em_-0.24em_-0.12em)] will-change-transform">
          <span className={cn(line, ready ? "translate-y-0" : "translate-y-[140%]")}>{lines[0]}</span>
        </div>
        <div ref={secondRef} className="absolute left-0 top-0 py-[0.06em] [clip-path:inset(0_-0.12em_-0.24em_-0.12em)] will-change-transform">
          <span className={cn(line, "delay-100", ready ? "translate-y-0" : "translate-y-[140%]")}>{lines[1]}</span>
        </div>
      </div>

      <div
        ref={frameRef}
        className={cn(
          "absolute inset-0 z-10 overflow-hidden bg-muted transition-opacity duration-700 [clip-path:inset(50%_50%_50%_50%)]",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        {/* biome-ignore lint/performance/noImgElement: installable component, framework free */}
        <img
          ref={imageRef}
          src={imageSrc}
          alt={imageAlt}
          draggable={false}
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 size-full select-none object-cover transition-opacity duration-700 will-change-transform",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      {children && (
        <div
          aria-hidden={!open}
          className={cn(
            "absolute inset-0 z-20 transition-[opacity,transform,visibility] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            open ? "visible translate-y-0 opacity-100 duration-700" : "pointer-events-none invisible translate-y-3 opacity-0 duration-300",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
