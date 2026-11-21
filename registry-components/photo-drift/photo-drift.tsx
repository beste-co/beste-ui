"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface PhotoDriftProps {
  src: string;
  alt: string;
  /** How far the photo drifts against the scroll, as a share of the frame height. 0 holds it still. */
  drift?: number;
  /** Blur the photo into focus once it has loaded */
  reveal?: boolean;
  /** Load straight away for photos above the fold */
  priority?: boolean;
  /** Sizes and shapes the frame: give it a height or an aspect ratio, plus any radius */
  className?: string;
  /** Additional classes merged onto the image */
  imageClassName?: string;
}

export const photoDriftDemo: PhotoDriftProps = {
  src: "https://oud.pics/b/dental/mira-reception.webp",
  alt: "A calm reception lounge with a teal sofa and a stone desk",
  drift: 0.08,
  reveal: true,
  className: "aspect-4/3 w-full max-w-xl rounded-4xl",
};

/** A photo in a fixed frame that drifts slower than the page and blurs into focus once loaded. */
export function PhotoDrift({ src, alt, drift = 0.06, reveal = true, priority = false, className, imageClassName }: PhotoDriftProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(!reveal);

  useEffect(() => {
    if (imageRef.current?.complete) setLoaded(true);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const layer = layerRef.current;
    if (!frame || !layer || drift <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let visible = false;
    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const view = window.innerHeight;
      // 0 as the frame enters at the bottom, 1 as it leaves at the top
      const progress = Math.min(1, Math.max(0, (view - rect.top) / (view + rect.height)));
      layer.style.transform = `translate3d(0, ${((progress - 0.5) * 2 * drift * rect.height).toFixed(1)}px, 0)`;
    };
    const schedule = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      schedule();
    });
    observer.observe(frame);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      layer.style.removeProperty("transform");
    };
  }, [drift]);

  return (
    <div ref={frameRef} className={cn("relative overflow-hidden bg-muted", className)}>
      {/* The layer is taller than the frame by the drift on each side, so no edge ever shows */}
      <div ref={layerRef} className="absolute inset-x-0 will-change-transform" style={{ top: `${-drift * 100}%`, bottom: `${-drift * 100}%` }}>
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "size-full object-cover transition-[opacity,filter,scale] duration-1400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            loaded ? "scale-100 opacity-100 blur-[0px]" : "scale-105 opacity-0 blur-xl",
            imageClassName,
          )}
        />
      </div>
    </div>
  );
}
