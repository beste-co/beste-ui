"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

/** Anything with a `get()` that returns 0 to 1, such as a framer-motion MotionValue, so scroll can drive the rail without re-rendering. */
export interface GalleryRailProgressSource {
  get(): number;
}

export interface GalleryRailItem {
  /** The photograph. */
  src: string;
  /** Description of the photograph for screen readers. */
  alt?: string;
  /** Title of the work, shown under the frame. */
  title?: string;
  /** Credit line under the title, such as the photographer and year. */
  caption?: string;
  /** Width divided by height of the frame, such as 0.75 for portrait or 1.5 for landscape. */
  aspect?: number;
}

export interface GalleryRailProps {
  /** The photographs along the wall, in order. */
  items?: GalleryRailItem[];
  /** Content hung first on the wall, such as a heading and buttons. */
  lead?: ReactNode;
  /** Space between frames in pixels; narrow screens use less. */
  gap?: number;
  /** Frame height as a share of the rail height, 0.3 to 0.8. */
  frameHeight?: number;
  /** How much slower each photograph moves than its frame, 0 to 1. */
  parallax?: number;
  /** How much a frame grows as it reaches the middle, 0 to 1. */
  lift?: number;
  /** Soft cast shadow under each print. */
  shadow?: boolean;
  /** Travel along the wall from start (0) to end (1): a number or a live source such as a scroll MotionValue. */
  progress?: number | GalleryRailProgressSource;
  /** Drift slowly along the wall and back on its own. Defaults to on when no progress is given. */
  autoplay?: boolean;
  /** Pace of the autoplay drift. */
  speed?: number;
  /** Stop the drift where it is. */
  paused?: boolean;
  className?: string;
}

export const galleryRailDemo: GalleryRailProps = {
  items: [
    {
      src: "https://images.unsplash.com/photo-1701870856373-bc7273fe6c2c?w=1400&q=80",
      alt: "Swimmers seen from above near a rocky shoreline",
      title: "Low tide",
      caption: "Chet Baker, 2023",
      aspect: 0.8,
    },
    {
      src: "https://images.unsplash.com/photo-1579437469180-e31a7aa7273d?w=1400&q=80",
      alt: "A pebble beach curving along a turquoise bay",
      title: "The long bay",
      caption: "Nina Simone, 2022",
      aspect: 1.5,
    },
    {
      src: "https://images.unsplash.com/photo-1689202893906-7528e0e89379?w=1400&q=80",
      alt: "Swimmers in a narrow rocky bay below pine trees",
      title: "Under the pines",
      caption: "Miles Davis, 2024",
      aspect: 0.75,
    },
    {
      src: "https://images.unsplash.com/photo-1785861835336-247eaef97cb3?w=1400&q=80",
      alt: "A deep turquoise inlet between two cliffs",
      title: "Inlet",
      caption: "Joni Mitchell, 2024",
      aspect: 1,
    },
    {
      src: "https://images.unsplash.com/photo-1688926984205-74eb653edeae?w=1400&q=80",
      alt: "A limestone cove with clear green water",
      title: "Green water",
      caption: "Bill Evans, 2023",
      aspect: 1.33,
    },
  ],
  gap: 72,
  frameHeight: 0.62,
  parallax: 0.5,
  lift: 0.5,
  shadow: true,
  autoplay: true,
  speed: 1,
  className: "min-h-[32rem]",
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (x: number) => x * x * (3 - 2 * x);
const DRIFT_SECONDS = 44;

export function GalleryRail({
  items = galleryRailDemo.items ?? [],
  lead,
  gap = 72,
  frameHeight = 0.62,
  parallax = 0.5,
  lift = 0.5,
  shadow = true,
  progress,
  autoplay,
  speed = 1,
  paused = false,
  className,
}: GalleryRailProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const measureRef = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const loop = autoplay ?? progress === undefined;
  const settings = useRef({ items, gap, frameHeight, parallax, lift, progress, loop, speed, paused });
  settings.current = { items, gap, frameHeight, parallax, lift, progress, loop, speed, paused };
  const itemsKey = items.map((item) => `${item.src}:${item.aspect ?? 1}`).join("|");

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduce);

    const count = settings.current.items.length;
    const left = new Float32Array(count);
    const widths = new Float32Array(count);
    const requested = new Uint8Array(count);
    let viewW = 0;
    let travel = 0;
    let current = -1;
    let written = -1;
    let phase = 0;
    let last = 0;
    let frame = 0;
    let visible = true;
    let dirty = true;

    const request = (i: number) => {
      const img = imageRefs.current[i];
      const item = settings.current.items[i];
      if (requested[i] || !img || !item) return;
      requested[i] = 1;
      img.src = item.src;
    };

    const measure = () => {
      const s = settings.current;
      const w = root.clientWidth;
      const h = root.clientHeight;
      if (!w || !h) return;
      viewW = w;
      const edge = Math.round(Math.max(16, Math.min(96, w * 0.06)));
      const space = Math.round(Math.min(Math.max(0, s.gap), w * 0.1));
      const tall = Math.min(h * Math.min(0.8, Math.max(0.3, s.frameHeight)), h - 112);
      track.style.paddingLeft = `${edge}px`;
      track.style.paddingRight = `${edge}px`;
      track.style.gap = `${space}px`;
      const k = 0.26 * clamp01(s.parallax);
      for (let i = 0; i < count; i++) {
        const item = s.items[i];
        const box = frameRefs.current[i];
        const holder = itemRefs.current[i];
        const img = imageRefs.current[i];
        if (!item || !box || !holder) continue;
        const aspect = Math.max(0.3, item.aspect ?? 1);
        let fw = tall * aspect;
        let fh = tall;
        if (fw > w * 0.84) {
          fw = w * 0.84;
          fh = fw / aspect;
        }
        fw = Math.round(fw);
        fh = Math.round(fh);
        holder.style.width = `${fw}px`;
        box.style.width = `${fw}px`;
        box.style.height = `${fh}px`;
        if (img) {
          const extra = Math.round(fw * k);
          img.style.width = `${fw + extra * 2}px`;
          img.style.left = `${-extra}px`;
        }
        widths[i] = fw;
      }
      for (let i = 0; i < count; i++) left[i] = itemRefs.current[i]?.offsetLeft ?? 0;
      travel = Math.max(0, track.scrollWidth - w);
      dirty = true;
      setReady(true);
      if (reduce) for (let i = 0; i < count; i++) request(i);
    };
    measureRef.current = measure;

    const target = () => {
      const s = settings.current;
      if (s.loop) return 0.5 - 0.5 * Math.cos(phase);
      const source = s.progress;
      if (typeof source === "number") return clamp01(source);
      return clamp01(source?.get() ?? 0);
    };

    const write = () => {
      const s = settings.current;
      const dpr = window.devicePixelRatio || 1;
      const x = Math.round(-current * travel * dpr) / dpr;
      track.style.transform = `translate3d(${x}px,0,0)`;
      const k = 0.26 * clamp01(s.parallax);
      const grow = 0.07 * clamp01(s.lift);
      for (let i = 0; i < count; i++) {
        const fw = widths[i] ?? 0;
        const center = (left[i] ?? 0) + fw / 2 + x;
        const reach = viewW / 2 + fw / 2;
        const offset = reach > 0 ? (center - viewW / 2) / reach : 0;
        const near = smooth(clamp01(1 - Math.abs(offset)));
        if (center - fw / 2 < viewW * 2.2) request(i);
        const box = frameRefs.current[i];
        const img = imageRefs.current[i];
        const caption = captionRefs.current[i];
        if (box) box.style.transform = `scale(${(1 - grow + grow * near).toFixed(4)})`;
        if (img) {
          const shift = Math.round(-Math.max(-1, Math.min(1, offset)) * fw * k * 0.5 * dpr) / dpr;
          img.style.transform = `translate3d(${shift}px,0,0)`;
        }
        if (caption) caption.style.opacity = (0.5 + 0.5 * near).toFixed(3);
      }
      written = current;
      dirty = false;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const s = settings.current;
      if (s.loop && !s.paused) phase += (dt * Math.max(0, s.speed) * Math.PI * 2) / DRIFT_SECONDS;
      const goal = target();
      if (current < 0) current = goal;
      else if (!s.paused) current += (goal - current) * (1 - Math.exp(-dt * 9));
      if (dirty || Math.abs(current - written) * travel > 0.05) write();
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!reduce && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    // The lead can change width when its fonts arrive
    ro.observe(track);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", onVisibility);
    measure();
    if (!reduce) {
      current = target();
      write();
    }
    play();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      measureRef.current = () => {};
    };
  }, [itemsKey]);

  useEffect(() => {
    measureRef.current();
  }, [gap, frameHeight, parallax]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative isolate w-full bg-background text-foreground",
        reduced ? "overflow-x-auto overflow-y-hidden" : "overflow-hidden",
        className,
      )}
    >
      <div
        ref={trackRef}
        className={cn(
          "absolute inset-y-0 left-0 flex w-max items-center transition-opacity duration-700",
          !reduced && "will-change-transform",
          ready ? "opacity-100" : "opacity-0",
        )}
      >
        {lead && <div className="relative shrink-0">{lead}</div>}
        {items.map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="relative shrink-0"
          >
            <div
              ref={(el) => {
                frameRefs.current[i] = el;
              }}
              className={cn(
                "relative overflow-hidden bg-muted [transform-origin:50%_100%]",
                shadow && "shadow-[0_1px_2px_rgb(0_0_0/0.08),0_18px_40px_-18px_rgb(0_0_0/0.35)]",
              )}
            >
              <img
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                alt={item.alt ?? ""}
                decoding="async"
                draggable={false}
                onLoad={(event) => {
                  event.currentTarget.style.opacity = "1";
                }}
                className="absolute top-0 h-full max-w-none select-none object-cover opacity-0 transition-opacity duration-700"
              />
            </div>
            {(item.title || item.caption) && (
              <div
                ref={(el) => {
                  captionRefs.current[i] = el;
                }}
                className="absolute left-0 top-full mt-4 max-w-full text-sm leading-snug"
              >
                {item.title && <p className="truncate text-foreground">{item.title}</p>}
                {item.caption && <p className="truncate text-muted-foreground">{item.caption}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
