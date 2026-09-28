"use client";

import { type ElementType, type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "div";
type Tone = "paper" | "ink" | "accent";

export interface TrivisionFace {
  /** The statement; a "\n" sets the line break, so every face can fill the board */
  text: string;
  /** Surface the statement is printed on */
  tone?: Tone;
}

export interface Text22Props {
  /** Statements the board turns through, in order */
  faces: TrivisionFace[];
  /** Element the board renders as; screen readers read every statement */
  as?: Tag;
  /** Number of turning slats across the board */
  slats?: number;
  /** Seconds each statement holds before the board turns */
  interval?: number;
  /** Seconds one slat takes to turn */
  turn?: number;
  /** Seconds between neighboring slats starting to turn */
  stagger?: number;
  /** Darkening of faces as they turn away, 0 to 1 */
  shading?: number;
  /** Hairline seams between slats, drawn in difference so they read on every surface */
  seams?: boolean;
  /** Hold the current statement while the pointer is over the board */
  pauseOnHover?: boolean;
  /** Stop turning */
  paused?: boolean;
  /** Font and size of the statements */
  className?: string;
  /** Padding inside each face, as Tailwind classes */
  faceClassName?: string;
}

export const text22Demo: Text22Props = {
  faces: [
    { text: "Seen from across the street.", tone: "paper" },
    { text: "Read by someone in a hurry.", tone: "ink" },
    { text: "Remembered for years after.", tone: "accent" },
  ],
  as: "h2",
  className: "text-6xl font-semibold leading-[1] tracking-[-0.045em] md:text-8xl",
};

const toneClass: Record<Tone, string> = {
  paper: "bg-background text-foreground",
  ink: "bg-foreground text-background",
  accent: "bg-primary text-primary-foreground",
};

const APOTHEM = 0.2887; // distance from a triangular prism's axis to a face, per unit of face width
const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

export function Text22({
  faces,
  as = "div",
  slats = 18,
  interval = 3.2,
  turn = 0.9,
  stagger = 0.035,
  shading = 0.6,
  seams = true,
  pauseOnHover = true,
  paused = false,
  className,
  faceClassName = "px-[0.08em] py-[0.12em]",
}: Text22Props) {
  const rootRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLSpanElement>(null);
  const slatRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prismRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const seamRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const count = Math.max(4, Math.min(48, Math.round(slats)));
  const total = faces.length;
  // Which statement each of the prism's three faces carries; the hidden face is refilled before it turns into view
  const [slots, setSlots] = useState<[number, number, number]>([0, 1 % Math.max(1, total), 2 % Math.max(1, total)]);
  const [ready, setReady] = useState(false);
  const settings = useRef({ interval, turn, stagger, shading, pauseOnHover, paused });
  settings.current = { interval, turn, stagger, shading, pauseOnHover, paused };
  const Tag = as as ElementType;

  useEffect(() => {
    const root = rootRef.current;
    const board = boardRef.current;
    if (!root || !board || total < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const from = new Float32Array(count);
    const to = new Float32Array(count);
    const angle = new Float32Array(count);
    let step = 0;
    let turnStart = -1;
    let wait = 0;
    let last = 0;
    let clock = 0;
    let frame = 0;
    let visible = true;
    let hovering = false;

    // Slats sit on whole pixels so every seam is the same crisp 1px gap
    const measure = () => {
      const width = board.clientWidth;
      board.style.setProperty("--board-w", `${width}px`);
      board.style.setProperty("--apothem", `${(width / count) * APOTHEM}px`);
      for (let i = 0; i < count; i++) {
        const slat = slatRefs.current[i];
        if (!slat) continue;
        const left = Math.round((i * width) / count);
        const right = Math.round(((i + 1) * width) / count);
        slat.style.left = `${left}px`;
        slat.style.width = `${right - left}px`;
        slat.style.setProperty("--slat-x", `${left}px`);
        const seam = seamRefs.current[i];
        if (seam) seam.style.left = `${right}px`;
      }
      setReady(true);
    };

    const write = () => {
      const s = settings.current;
      const dim = Math.min(1, Math.max(0, s.shading)) * 0.7;
      for (let i = 0; i < count; i++) {
        const prism = prismRefs.current[i];
        const a = angle[i] ?? 0;
        if (prism) prism.style.transform = `translateZ(calc(var(--apothem) * -1)) rotateY(${(-a).toFixed(2)}deg)`;
        for (let f = 0; f < 3; f++) {
          const shade = shadeRefs.current[i * 3 + f];
          if (!shade) continue;
          const facing = Math.cos(((f * 120 - a) * Math.PI) / 180);
          shade.style.opacity = ((1 - Math.max(0, facing)) * dim).toFixed(3);
        }
      }
    };

    const advance = () => {
      step += 1;
      for (let i = 0; i < count; i++) {
        from[i] = angle[i] ?? 0;
        to[i] = step * 120;
      }
      turnStart = clock;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      clock += dt;
      const s = settings.current;
      const duration = Math.max(0.2, s.turn);
      const spread = Math.max(0, s.stagger);

      if (turnStart < 0) {
        if (!s.paused && !(s.pauseOnHover && hovering)) wait += dt;
        if (wait >= Math.max(0.5, s.interval)) {
          wait = 0;
          advance();
        }
      } else {
        let done = true;
        for (let i = 0; i < count; i++) {
          const local = (clock - turnStart - i * spread) / duration;
          if (local < 1) done = false;
          angle[i] = (from[i] ?? 0) + ((to[i] ?? 0) - (from[i] ?? 0)) * ease(local);
        }
        if (done) {
          turnStart = -1;
          // Refill the face that is now hidden with the statement after next
          const hidden = (step + 1) % 3;
          const nextFace = (step + 1) % total;
          setSlots((current) => {
            const copy: [number, number, number] = [current[0], current[1], current[2]];
            copy[hidden] = nextFace;
            return copy;
          });
        }
      }

      write();
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!reduce && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = board.getBoundingClientRect();
      hovering =
        event.pointerType !== "touch" &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
    };
    const onVisibility = () => play();

    // Reduced motion: the statement changes in place, the slats stay still
    let timer = 0;
    if (reduce) {
      timer = window.setInterval(() => {
        if (settings.current.paused) return;
        step += 1;
        const front = step % 3;
        setSlots((current) => {
          const copy: [number, number, number] = [current[0], current[1], current[2]];
          copy[front] = step % total;
          return copy;
        });
        for (let i = 0; i < count; i++) angle[i] = front * 120;
        write();
      }, Math.max(0.5, interval) * 1000);
    }

    const ro = new ResizeObserver(measure);
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
      window.clearInterval(timer);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, total, interval]);

  const face = (slot: number, slat: number): ReactNode => {
    const index = slots[slot] ?? 0;
    const entry = faces[index] ?? faces[0];
    return (
      <span
        key={slot}
        className={cn("absolute inset-0 overflow-hidden [backface-visibility:hidden]", toneClass[entry?.tone ?? "paper"])}
        style={{ transform: `rotateY(${slot * 120}deg) translateZ(var(--apothem))` }}
      >
        <span
          className={cn("absolute top-0 block h-full whitespace-pre-line", faceClassName)}
          style={{ width: "var(--board-w)", left: "calc(var(--slat-x) * -1)" }}
        >
          {entry?.text}
        </span>
        <span
          ref={(el) => {
            shadeRefs.current[slat * 3 + slot] = el;
          }}
          className="absolute inset-0 bg-black opacity-0"
        />
      </span>
    );
  };

  return (
    <Tag ref={rootRef} className={cn("relative", className)}>
      <span className="sr-only">{faces.map((entry) => entry.text.replace(/\n/g, " ")).join(" ")}</span>
      <span aria-hidden="true" className="relative block">
        {/* Invisible stack of every statement gives the board the height of the longest one */}
        <span className="invisible grid">
          {faces.map((entry, index) => (
            <span key={index} className={cn("block whitespace-pre-line", faceClassName)} style={{ gridArea: "1 / 1" }}>
              {entry.text}
            </span>
          ))}
        </span>
        <span
          ref={boardRef}
          className={cn(
            "absolute inset-0 [perspective:1600px] transition-opacity duration-500",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          {Array.from({ length: count }, (_, slat) => (
            <span
              key={slat}
              ref={(el) => {
                slatRefs.current[slat] = el;
              }}
              className="absolute inset-y-0 [transform-style:preserve-3d]"
            >
              <span
                ref={(el) => {
                  prismRefs.current[slat] = el;
                }}
                className="absolute inset-0 [transform-style:preserve-3d] will-change-transform"
              >
                {face(0, slat)}
                {face(1, slat)}
                {face(2, slat)}
              </span>
            </span>
          ))}
          {/* Seams sit flat above the slats, the way a real board's gaps stay put while the slats turn */}
          {seams &&
            Array.from({ length: count - 1 }, (_, seam) => (
              <span
                key={seam}
                ref={(el) => {
                  seamRefs.current[seam] = el;
                }}
                className="pointer-events-none absolute inset-y-0 w-px bg-white opacity-25 mix-blend-difference"
              />
            ))}
        </span>
      </span>
    </Tag>
  );
}
