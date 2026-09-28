"use client";

import { type MotionValue, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ConcertinaBookProps {
  /** One wide photo, printed across every page of the book */
  image: { src: string; alt: string };
  /** Number of folded pages */
  pages?: number;
  /** Largest fold angle of a closed page, in degrees */
  fold?: number;
  /** Light and shade on the folds, 0 to 1 */
  shade?: number;
  /** Page width divided by page height */
  pageAspect?: number;
  /**
   * How far the book has opened, 0 to 1. Pass a MotionValue (for example a pinned
   * section's scroll progress) or a number; when omitted the book opens as it
   * passes through the viewport.
   */
  progress?: MotionValue<number> | number;
  /** Fold and unfold on a loop by itself, with no scroll involved (ignored when `progress` is given) */
  autoplay?: boolean;
  /** Seconds for one open-and-close loop when autoplaying */
  cycle?: number;
  /** Hold the pages where they are */
  paused?: boolean;
  className?: string;
}

export const concertinaBookDemo: ConcertinaBookProps = {
  image: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=2400&q=80",
    alt: "A calm lake below dark pines and pale mountains",
  },
  pages: 6,
  fold: 78,
  shade: 0.5,
  pageAspect: 0.72,
  autoplay: true,
  className: "h-[32rem]",
};

function Slice({ index, count, image, described }: { index: number; count: number; image: { src: string; alt: string }; described: boolean }) {
  return (
    <img
      src={image.src}
      alt={described ? image.alt : ""}
      aria-hidden={described ? undefined : true}
      draggable={false}
      style={{ width: `calc(var(--page-w) * ${count})`, left: `calc(var(--page-w) * ${-index})` }}
      className="pointer-events-none absolute top-0 h-full max-w-none select-none object-cover"
    />
  );
}

function Page({ index, count, image }: { index: number; count: number; image: { src: string; alt: string } }) {
  // Each page has a front and a mirrored back: under perspective a steep fold can turn a page's
  // back toward the camera, and the picture must continue either way. The crease strip sits a
  // hair in front of the fold so the two pages' anti-aliased edges never let the background through;
  // it only shows while the fold is bent, since on a flat crease it would read as a light seam.
  const strip = "absolute inset-y-0 left-0 w-[3px] overflow-hidden bg-muted shadow-[inset_1px_0_0_rgba(0,0,0,0.08)] [backface-visibility:hidden]";
  const face = "absolute inset-0 overflow-hidden bg-muted shadow-[inset_1px_0_0_rgba(0,0,0,0.08),0_30px_60px_-30px_rgba(0,0,0,0.35)] [backface-visibility:hidden]";
  return (
    <div
      data-page=""
      className="absolute left-0 top-0 h-[var(--page-h)] w-[calc(var(--page-w)_+_1px)] origin-left [transform-style:preserve-3d]"
    >
      <div className={face}>
        <Slice index={index} count={count} image={image} described={index === 0} />
        <div data-shade-front="" className="absolute inset-0 bg-black opacity-0" />
      </div>
      <div className={cn(face, "[transform:rotateY(180deg)]")}>
        <div className="absolute inset-0 [transform:scaleX(-1)]">
          <Slice index={index} count={count} image={image} described={false} />
        </div>
        <div data-shade-back="" className="absolute inset-0 bg-black opacity-0" />
      </div>
      {index > 0 && (
        <>
          <div data-strip="" className={cn(strip, "opacity-0 [transform:translateZ(1.5px)]")}>
            <Slice index={index} count={count} image={image} described={false} />
            <div data-shade-front="" className="absolute inset-0 bg-black opacity-0" />
          </div>
          <div data-strip="" className={cn(strip, "opacity-0 [transform:translateZ(-1.5px)_rotateY(180deg)]")}>
            <div className="absolute inset-0 [transform:scaleX(-1)]">
              <Slice index={index} count={count} image={image} described={false} />
            </div>
            <div data-shade-back="" className="absolute inset-0 bg-black opacity-0" />
          </div>
        </>
      )}
    </div>
  );
}

const isMotionValue = (value: unknown): value is MotionValue<number> =>
  typeof value === "object" && value !== null && "get" in value && typeof (value as MotionValue<number>).get === "function";

export function ConcertinaBook({ image, pages = 6, fold = 78, shade = 0.5, pageAspect = 0.72, progress, autoplay = false, cycle = 9, paused = false, className }: ConcertinaBookProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start end", "end start"] });
  const settings = useRef({ fold, shade, pageAspect, progress, autoplay, cycle, paused });
  settings.current = { fold, shade, pageAspect, progress, autoplay, cycle, paused };
  const relayout = useRef<() => void>(() => {});
  const count = Math.max(2, Math.round(pages));

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (reduce || !root || !track) return;
    const leaves = Array.from(track.querySelectorAll<HTMLDivElement>("[data-page]"));
    const fronts = leaves.map((leaf) => Array.from(leaf.querySelectorAll<HTMLDivElement>("[data-shade-front]")));
    const backs = leaves.map((leaf) => Array.from(leaf.querySelectorAll<HTMLDivElement>("[data-shade-back]")));
    const strips = leaves.map((leaf) => Array.from(leaf.querySelectorAll<HTMLDivElement>("[data-strip]")));

    const source = () => {
      const given = settings.current.progress;
      if (typeof given === "number") return given;
      if (isMotionValue(given)) return given.get();
      if (settings.current.autoplay) {
        // Open, rest, close, rest: a cosine loop flattened at both ends
        const period = Math.max(2, settings.current.cycle);
        const raw = 0.5 - 0.5 * Math.cos(((performance.now() / 1000) % period) / period * Math.PI * 2);
        const t = Math.min(1, Math.max(0, (raw - 0.08) / 0.84));
        return t * t * (3 - 2 * t);
      }
      return scrollYProgress.get();
    };

    let vw = 1;
    let w = 1;
    let pad = 16;
    let distance = 0;
    let current = Math.min(1, Math.max(0, source()));
    let drawn = -1;
    let frame = 0;
    let visible = true;

    const layout = (p: number) => {
      const s = settings.current;
      const maxFold = (Math.min(88, Math.max(0, s.fold)) * Math.PI) / 180;
      const dark = Math.min(1, Math.max(0, s.shade)) * 2;
      let x = pad - p * distance;
      let z = 0;
      const flat = vw - w - pad;
      let previous = 0;
      for (let i = 0; i < leaves.length; i++) {
        const sign = i % 2 === 0 ? 1 : -1;
        const t = Math.min(1, Math.max(0, (x - flat) / (w * 0.9)));
        const angle = t * t * (3 - 2 * t) * maxFold;
        const leaf = leaves[i];
        if (leaf) {
          leaf.style.transform = `translate3d(${x.toFixed(2)}px,0,${z.toFixed(2)}px) rotateY(${((sign * angle * 180) / Math.PI).toFixed(3)}deg)`;
        }
        const shade = (Math.sin(angle) * (sign > 0 ? 0.42 : 0.14) * dark).toFixed(3);
        for (const cover of fronts[i] ?? []) cover.style.opacity = shade;
        for (const cover of backs[i] ?? []) cover.style.opacity = shade;
        // The crease strip only covers a bent fold; on a flat crease it would show as a light seam
        const bend = Math.min(1, Math.max(0, (previous + angle - 0.02) / 0.1));
        for (const cover of strips[i] ?? []) cover.style.opacity = bend.toFixed(3);
        previous = angle;
        x += w * Math.cos(angle);
        z -= sign * w * Math.sin(angle);
      }
      drawn = p;
    };

    const resize = () => {
      const aspect = Math.min(2, Math.max(0.3, settings.current.pageAspect));
      vw = root.clientWidth;
      const areaH = root.clientHeight;
      const h = Math.max(200, Math.min(areaH * 0.92, 660));
      w = Math.min(h * aspect, vw * 0.74);
      const pageH = w / aspect;
      pad = vw < 768 ? 16 : 32;
      distance = Math.max(0, leaves.length * w + pad * 2 - vw);
      track.style.setProperty("--page-w", `${w}px`);
      track.style.setProperty("--page-h", `${pageH}px`);
      track.style.top = `${Math.max(0, (areaH - pageH) / 2)}px`;
      layout(current);
    };

    const tick = () => {
      if (!settings.current.paused) {
        const goal = Math.min(1, Math.max(0, source()));
        current += (goal - current) * 0.12;
        if (Math.abs(current - drawn) > 0.0002) layout(current);
      }
      frame = requestAnimationFrame(tick);
    };
    const play = () => {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    relayout.current = resize;

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    const onVisibility = () => play();
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    play();

    return () => {
      cancelAnimationFrame(frame);
      relayout.current = () => {};
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce, count, scrollYProgress]);

  useEffect(() => {
    relayout.current();
  }, [fold, shade, pageAspect]);

  if (reduce) {
    const aspect = Math.min(2, Math.max(0.3, pageAspect));
    return (
      <div ref={rootRef} className={cn("relative w-full overflow-hidden", className)}>
        <div
          className="flex h-full snap-x snap-mandatory items-center overflow-x-auto px-4 pb-4 [--page-h:22rem] md:px-8 md:[--page-h:30rem]"
          style={{ ["--page-w" as string]: `calc(var(--page-h) * ${aspect})` }}
        >
          {Array.from({ length: count }, (_, index) => (
            <div key={index} className="relative h-[var(--page-h)] w-[var(--page-w)] shrink-0 snap-start">
              <Page index={index} count={count} image={image} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("relative w-full overflow-hidden [perspective:1800px]", className)}>
      <div ref={trackRef} className="absolute inset-x-0 top-0 [transform-style:preserve-3d]">
        {Array.from({ length: count }, (_, index) => (
          <Page key={index} index={index} count={count} image={image} />
        ))}
      </div>
    </div>
  );
}
