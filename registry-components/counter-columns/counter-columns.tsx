"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export interface CounterColumnsImage {
  src: string;
  alt: string;
}

export interface CounterColumnsProps {
  /** Photographs spread across the columns; fewer than the columns need are repeated. */
  images: CounterColumnsImage[];
  /** Number of columns on wider screens; phones show at most two. */
  columns?: number;
  /** Pace of the drift. */
  speed?: number;
  /** How far the wall leans back and turns, 0 (flat) to 1. */
  tilt?: number;
  /** Space between prints, in pixels. */
  gap?: number;
  /** Height of the soft fade at the top and bottom, 0 to 0.4 of the frame. */
  fade?: number;
  /** Hovering slows the wall, the page scroll pushes it and the wall leans toward the cursor. */
  interactive?: boolean;
  /** Stop the drift. */
  paused?: boolean;
  className?: string;
}

export const counterColumnsDemo: CounterColumnsProps = {
  images: [
    { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80", alt: "A model in wide striped trousers leaning on a teal wall" },
    { src: "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=900&q=80", alt: "A glass perfume bottle casting amber shadows on warm paper" },
    { src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&q=80", alt: "A woman in a dark check coat walking down a city street" },
    { src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80", alt: "Orange poppies against a clear blue sky" },
    { src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80", alt: "A singer with one hand raised in stage smoke and red light" },
    { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80", alt: "A model in a bright yellow fleece set on a concrete court" },
    { src: "https://images.unsplash.com/photo-1777214710531-7868414d662e?w=900&q=80", alt: "A red swing carousel spinning against a pale sky" },
    { src: "https://images.unsplash.com/photo-1621983266286-09645be8fd01?w=900&q=80", alt: "A woman with short hair looking back over her shoulder" },
    { src: "https://images.unsplash.com/photo-1617897903246-719242758050?w=900&q=80", alt: "A dropper bottle of golden oil on a round wooden board" },
    { src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=80", alt: "A model in a red jersey and black jacket against a teal sky" },
    { src: "https://images.unsplash.com/photo-1780323241887-8efcb9b85c71?w=900&q=80", alt: "A red taxi pulling out of a city gas station" },
    { src: "https://images.unsplash.com/photo-1579437469180-e31a7aa7273d?w=900&q=80", alt: "A pebble beach curving along a turquoise bay" },
    { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80", alt: "Portrait of a man in a grey sweater against a pale wall" },
    { src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=900&q=80", alt: "A city street at dusk with car lights and lit towers" },
    { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=900&q=80", alt: "Portrait of a woman with short red hair by a lake" },
  ],
  columns: 3,
  speed: 1,
  tilt: 0.6,
  gap: 16,
  fade: 0.16,
  interactive: true,
  className: "min-h-[32rem]",
};

// Each column drifts at its own pace so the wall never moves in lockstep
const PACE = [1, 0.82, 1.12, 0.9, 1.05];
const BASE = 34;

export function CounterColumns({
  images,
  columns = 3,
  speed = 1,
  tilt = 0.6,
  gap = 16,
  fade = 0.16,
  interactive = true,
  paused = false,
  className,
}: CounterColumnsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setRefs = useRef<(HTMLDivElement | null)[]>([]);
  const count = Math.max(1, Math.min(5, Math.round(columns)));
  const [copies, setCopies] = useState(2);
  const settings = useRef({ speed, tilt, interactive, paused });
  settings.current = { speed, tilt, interactive, paused };

  const perColumn = images.length > 0 ? Math.max(4, Math.ceil(images.length / count)) : 0;
  const lists = Array.from({ length: count }, (_, c) =>
    Array.from({ length: perColumn }, (_, j) => images[(c * perColumn + j) % Math.max(1, images.length)]),
  );

  useEffect(() => {
    const root = rootRef.current;
    const plane = planeRef.current;
    if (!root || !plane) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const offset = new Float64Array(count);
    const height = new Float64Array(count);
    for (let c = 0; c < count; c++) offset[c] = c * 0.37;
    let seeded = false;
    let frame = 0;
    let last = 0;
    let visible = true;
    let over = false;
    let px = 0;
    let py = 0;
    let leanX = 0;
    let leanY = 0;
    let slow = 1;
    let boost = 0;
    let lastScroll = window.scrollY;

    const measure = () => {
      let shortest = Number.POSITIVE_INFINITY;
      for (let c = 0; c < count; c++) {
        const h = setRefs.current[c]?.offsetHeight ?? 0;
        if (h > 1) {
          // Keep each column's phase when the size changes
          const prev = height[c] ?? 0;
          offset[c] = seeded && prev > 1 ? ((offset[c] ?? 0) / prev) * h : (offset[c] ?? 0) * h;
          shortest = Math.min(shortest, h);
        }
        height[c] = h;
      }
      seeded = shortest < Number.POSITIVE_INFINITY;
      if (seeded) {
        const needed = Math.min(8, Math.max(2, Math.ceil(plane.offsetHeight / shortest) + 1));
        setCopies((current) => (current === needed ? current : needed));
      }
    };

    const write = () => {
      const s = settings.current;
      const t = Math.min(1, Math.max(0, s.tilt));
      plane.style.transform = `translate(-50%, -50%) rotateX(${(t * 34 - leanY * 3).toFixed(3)}deg) rotateY(${(leanX * 3).toFixed(3)}deg) rotateZ(${(-t * 13).toFixed(3)}deg)`;
      for (let c = 0; c < count; c++) {
        const track = trackRefs.current[c];
        const h = height[c] ?? 0;
        if (!track || h < 1) continue;
        const y = (((offset[c] ?? 0) % h) + h) % h;
        track.style.transform = `translate3d(0, ${(-y).toFixed(2)}px, 0)`;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const s = settings.current;

      const scroll = window.scrollY;
      const scrollVelocity = (scroll - lastScroll) / Math.max(dt, 0.001);
      lastScroll = scroll;
      const push = s.interactive ? Math.max(-1400, Math.min(1400, scrollVelocity * 0.45)) : 0;
      // Quick to pick up the scroll, slow to let go of it
      const rate = Math.abs(push) > Math.abs(boost) ? 8 : 1.6;
      boost += (push - boost) * (1 - Math.exp(-dt * rate));

      const hover = s.interactive && over;
      slow += ((hover ? 0.18 : 1) - slow) * (1 - Math.exp(-dt * 3));
      const rect = hover ? root.getBoundingClientRect() : null;
      const targetX = rect ? ((px - rect.left) / rect.width) * 2 - 1 : 0;
      const targetY = rect ? ((py - rect.top) / rect.height) * 2 - 1 : 0;
      leanX += (targetX - leanX) * (1 - Math.exp(-dt * 2.5));
      leanY += (targetY - leanY) * (1 - Math.exp(-dt * 2.5));

      if (!s.paused) {
        for (let c = 0; c < count; c++) {
          const direction = c % 2 === 0 ? 1 : -1;
          const pace = BASE * Math.max(0, s.speed) * (PACE[c % PACE.length] ?? 1) * slow;
          offset[c] = (offset[c] ?? 0) + direction * (pace + boost) * dt;
        }
      }

      write();
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      lastScroll = window.scrollY;
      if (!reduce && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      px = event.clientX;
      py = event.clientY;
      if (event.pointerType === "touch") {
        over = false;
        return;
      }
      const rect = root.getBoundingClientRect();
      over = px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom;
    };
    const onLeave = (event: PointerEvent) => {
      if (!event.relatedTarget) over = false;
    };
    const onVisibility = () => play();

    const ro = new ResizeObserver(() => {
      measure();
      write();
    });
    ro.observe(root);
    for (let c = 0; c < count; c++) {
      const set = setRefs.current[c];
      if (set) ro.observe(set);
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    measure();
    write();
    play();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, perColumn]);

  const t = Math.min(1, Math.max(0, tilt));
  const edge = `${(Math.min(0.4, Math.max(0, fade)) * 100).toFixed(1)}%`;
  const mask = `linear-gradient(to bottom, transparent, #000 ${edge}, #000 calc(100% - ${edge}), transparent)`;

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate w-full overflow-hidden", className)}
      style={{ perspective: "1400px", maskImage: mask, WebkitMaskImage: mask }}
    >
      <div
        ref={planeRef}
        className="absolute left-1/2 top-1/2 flex [transform-style:preserve-3d] will-change-transform"
        style={{
          width: `${(100 + t * 45).toFixed(1)}%`,
          height: `${(100 + t * 90).toFixed(1)}%`,
          gap,
          transform: `translate(-50%, -50%) rotateX(${(t * 34).toFixed(3)}deg) rotateZ(${(-t * 13).toFixed(3)}deg)`,
        }}
      >
        {lists.map((list, c) => (
          <div key={c} className={cn("relative h-full min-w-0 flex-1 overflow-hidden", c >= 2 && "hidden md:block")}>
            <div
              ref={(el) => {
                trackRefs.current[c] = el;
              }}
              className="will-change-transform"
            >
              {Array.from({ length: copies }, (_, copy) => (
                <div
                  key={copy}
                  ref={
                    copy === 0
                      ? (el) => {
                          setRefs.current[c] = el;
                        }
                      : undefined
                  }
                  aria-hidden={copy > 0 ? true : undefined}
                  className="flex flex-col"
                  style={{ gap, paddingBottom: gap }}
                >
                  {list.map((image, j) =>
                    image ? (
                      <img
                        key={j}
                        src={image.src}
                        alt={copy === 0 ? image.alt : ""}
                        draggable={false}
                        decoding="async"
                        className="block aspect-[4/5] w-full select-none rounded-sm bg-muted object-cover shadow-[0_24px_48px_-24px_rgba(0,0,0,0.45)]"
                      />
                    ) : null,
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
