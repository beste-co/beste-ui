"use client";

import { cn } from "@/lib/utils";
import { useEffect, useId, useRef, useState } from "react";

export interface TextOrbitRing {
  /** Line of text set around the ring; it repeats to close the circle */
  text: string;
  /** Size of the ring relative to the object, 1 sits on its edge */
  radius?: number;
  /** Turning speed, 1 is the default pace */
  speed?: number;
  /** Turning direction */
  direction?: "clockwise" | "counterclockwise";
  /** Tilts the ring into an orbit, in degrees; 0 keeps it flat to the reader */
  tilt?: number;
  /** Distance the ring floats in front of the object, in pixels */
  depth?: number;
  /** Text size on the ring, in units of a 200-wide circle */
  size?: number;
}

export interface TextOrbitProps {
  /** Rings of text, outer first */
  rings?: TextOrbitRing[];
  /** Round photo at the center */
  image?: { src: string; alt: string };
  /** Zoom of the center photo */
  imageScale?: number;
  /** Point of the photo the zoom centers on, as a CSS position */
  imageFocus?: string;
  /** Color of the ring text. Any CSS color, tokens included */
  color?: string;
  /** Global turning speed, 1 is the default pace */
  speed?: number;
  /** How far the object leans toward the cursor, 0 to 1 */
  tilt?: number;
  /** How much the object sways on its own, 0 to 1 */
  sway?: number;
  /** Faded mirror image of the photo below the object */
  reflection?: boolean;
  /** Lean toward the cursor; otherwise it only sways */
  interactive?: boolean;
  /** Stop turning and swaying */
  paused?: boolean;
  className?: string;
}

export const textOrbitDemo: TextOrbitProps = {
  rings: [
    { text: "Ember No. 9 · Eau de parfum · 50 ml ·", radius: 1.04, speed: 1, depth: 70, size: 6.4 },
    { text: "Bitter orange · Fig leaf · Smoked amber · Vetiver ·", radius: 0.8, speed: 1.7, direction: "counterclockwise", depth: 35, size: 7.2 },
    { text: "Composed in Grasse · Poured by hand ·", radius: 1.32, speed: 0.7, tilt: 74, size: 5.6 },
  ],
  image: {
    src: "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=2000&q=80",
    alt: "A clear glass perfume bottle and two small jars casting amber shadows on warm paper",
  },
  imageScale: 1.7,
  imageFocus: "28% 56%",
  color: "var(--foreground)",
  className: "mx-auto max-w-[520px] font-serif",
};

const RADIUS = 94;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CIRCLE = `M100 100 m-${RADIUS} 0 a${RADIUS} ${RADIUS} 0 1 1 ${RADIUS * 2} 0 a${RADIUS} ${RADIUS} 0 1 1 -${RADIUS * 2} 0`;

const DEFAULT_RADIUS = [1.04, 0.8, 1.32];
const DEFAULT_DEPTH = [70, 35, 0];
const DEFAULT_SIZE = [6.4, 7.2, 5.6];

export function TextOrbit({
  rings = [],
  image,
  imageScale = 1.7,
  imageFocus = "50% 50%",
  color = "currentColor",
  speed = 1,
  tilt = 0.5,
  sway = 0.5,
  reflection = true,
  interactive = true,
  paused = false,
  className,
}: TextOrbitProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ringRefs = useRef<(SVGSVGElement | null)[]>([]);
  const [reduce, setReduce] = useState(false);
  const settings = useRef({ rings, speed, tilt, sway, interactive, paused });
  settings.current = { rings, speed, tilt, sway, interactive, paused };

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const body = bodyRef.current;
    if (!root || !body) return;
    let frame = 0;
    let visible = true;
    let last = 0;
    let angle = 0;
    let clock = 0;
    const pointer = { x: 0, y: 0, active: false };
    const lean = { x: 0, y: 0 };

    const apply = () => {
      const s = settings.current;
      for (let i = 0; i < s.rings.length; i++) {
        const ring = s.rings[i];
        const svg = ringRefs.current[i];
        if (!ring || !svg) continue;
        const turn = (ring.speed ?? 1) * (ring.direction === "counterclockwise" ? -1 : 1);
        svg.style.transform = `rotate(${(angle * turn).toFixed(2)}deg)`;
      }
      const strength = Math.max(0, Math.min(1, s.tilt)) * 2;
      body.style.transform = `rotateX(${(lean.y * -16 * strength + 6).toFixed(2)}deg) rotateY(${(lean.x * 20 * strength).toFixed(2)}deg)`;
    };

    const loop = (now: number) => {
      const dt = last ? Math.min(now - last, 50) : 16.7;
      last = now;
      const s = settings.current;
      clock += dt;
      angle = (angle + dt * 0.006 * s.speed) % 3600;
      const drift = Math.max(0, Math.min(1, s.sway)) * 2;
      const tx = pointer.active && s.interactive ? pointer.x : Math.sin(clock * 0.00031) * 0.45 * drift;
      const ty = pointer.active && s.interactive ? pointer.y : Math.cos(clock * 0.00023) * 0.3 * drift;
      lean.x += (tx - lean.x) * 0.05;
      lean.y += (ty - lean.y) * 0.05;
      apply();
      frame = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!reduce && !settings.current.paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
      else apply();
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = root.getBoundingClientRect();
      const padX = rect.width * 0.5;
      const padY = rect.height * 0.5;
      pointer.active =
        event.clientX >= rect.left - padX && event.clientX <= rect.right + padX && event.clientY >= rect.top - padY && event.clientY <= rect.bottom + padY;
      if (!pointer.active) return;
      pointer.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2));
      pointer.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2));
    };
    const onVisibility = () => play();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    play();

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce, paused]);

  const photoStyle = { transform: `scale(${imageScale})`, transformOrigin: imageFocus };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <div className="relative aspect-square [perspective:1400px]">
        <div ref={bodyRef} className="absolute inset-[12%] will-change-transform" style={{ transformStyle: "preserve-3d", transform: "rotateX(6deg)", color }}>
          {image && (
            <div className="absolute inset-[16%] overflow-hidden rounded-full shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
              <img src={image.src} alt={image.alt} className="size-full object-cover" style={photoStyle} />
              <span aria-hidden="true" className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18),inset_0_-30px_60px_rgba(0,0,0,0.4)]" />
            </div>
          )}
          {rings.map((ring, index) => {
            const size = ring.size ?? DEFAULT_SIZE[index] ?? 6;
            const radius = ring.radius ?? DEFAULT_RADIUS[index] ?? 1;
            const depth = ring.depth ?? DEFAULT_DEPTH[index] ?? 0;
            const inset = `${((1 - radius) / 2) * 100}%`;
            const repeats = Math.max(1, Math.floor(CIRCUMFERENCE / Math.max(1, ring.text.length * size * 0.8)));
            const content = Array.from({ length: repeats }, () => ring.text).join(" ");
            const orbit = ring.tilt ? ` rotateX(${ring.tilt}deg) rotateZ(-14deg)` : "";
            const pathId = `${id}-ring-${index}`;
            return (
              <div
                key={index}
                className="pointer-events-none absolute"
                style={{ inset, transform: `translateZ(${depth}px)${orbit}`, transformStyle: "preserve-3d" }}
              >
                <svg
                  ref={(el) => {
                    ringRefs.current[index] = el;
                  }}
                  aria-hidden="true"
                  viewBox="0 0 200 200"
                  className="size-full overflow-visible will-change-transform"
                >
                  <defs>
                    <path id={pathId} d={CIRCLE} />
                  </defs>
                  <text fill="currentColor" fontSize={size} letterSpacing={size * 0.18}>
                    <textPath href={`#${pathId}`} textLength={CIRCUMFERENCE - size} lengthAdjust="spacing">
                      {content}
                    </textPath>
                  </text>
                </svg>
              </div>
            );
          })}
        </div>
      </div>
      {image && reflection && (
        <div aria-hidden="true" className="pointer-events-none relative -mt-[21%] h-32 md:h-40">
          <div className="absolute left-1/2 top-0 aspect-square w-[52%] -translate-x-1/2 -scale-y-100 overflow-hidden rounded-full opacity-25 [mask-image:linear-gradient(to_top,black,transparent_45%)]">
            <img src={image.src} alt="" className="size-full object-cover" style={photoStyle} />
          </div>
          <div
            className="absolute inset-x-[14%] -top-4 h-10 rounded-[50%] opacity-20"
            style={{ background: `radial-gradient(closest-side, ${color}, transparent)` }}
          />
        </div>
      )}
      {rings.length > 0 && <span className="sr-only">{rings.map((ring) => ring.text).join(" ")}</span>}
    </div>
  );
}
