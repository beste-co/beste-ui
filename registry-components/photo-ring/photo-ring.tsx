"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface PhotoRingImage {
  src: string;
  alt: string;
}

export interface PhotoRingProps {
  /** Photographs around the ring, in order */
  images: PhotoRingImage[];
  /** Space between neighboring photos as a share of a photo's width; the ring's size follows from it, so it always stays closed */
  gap?: number;
  /** Panel width as a share of the width */
  panelWidth?: number;
  /** Panel width divided by height */
  aspect?: number;
  /** Degrees the camera looks down on the ring */
  tilt?: number;
  /** Idle turning pace, 0 stops it */
  speed?: number;
  /** Strength of the floor reflection, 0 to 1 */
  reflection?: number;
  /** How far panels at the back fade into the surface, 0 to 1 */
  fog?: number;
  /** Surface color the far panels and the reflection fade into */
  fogColor?: string;
  /** Light and gloss on the panels as they turn, 0 to 1 */
  shading?: number;
  /** Drag and scroll give the ring momentum; the cursor leans the view */
  interactive?: boolean;
  /** Stop the idle turn */
  paused?: boolean;
  className?: string;
}

export const photoRingDemo: PhotoRingProps = {
  images: [
    { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&q=80", alt: "Portrait of a woman smiling in soft light" },
    { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop&q=80", alt: "Portrait of a man with a beard" },
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&q=80", alt: "Portrait of a woman with freckles" },
    { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop&q=80", alt: "Portrait of a man in a dark shirt" },
    { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop&q=80", alt: "Portrait of a woman with curly hair" },
    { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&q=80", alt: "Portrait of a man smiling" },
    { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop&q=80", alt: "Portrait of a woman laughing" },
    { src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop&q=80", alt: "Portrait of a man in a blue shirt" },
    { src: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&h=800&fit=crop&q=80", alt: "Portrait of a man with a mustache" },
    { src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop&q=80", alt: "A woman in a check coat on a city street" },
    { src: "https://images.unsplash.com/photo-1637920448395-4173703a18c8?w=600&h=800&fit=crop&q=80", alt: "Portrait of a man in warm light" },
    { src: "https://images.unsplash.com/photo-1648556873591-4b378146bd1c?w=600&h=800&fit=crop&q=80", alt: "Portrait of a woman in window light" },
  ],
  className: "h-[32rem]",
};

const FACETS = 4;
const DEG = Math.PI / 180;
const LIGHT = -28 * DEG;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function PhotoRing({
  images,
  gap = 0.2,
  panelWidth = 0.18,
  aspect = 0.75,
  tilt = 8,
  speed = 1,
  reflection = 0.5,
  fog = 0.7,
  fogColor = "var(--background)",
  shading = 0.6,
  interactive = true,
  paused = false,
  className,
}: PhotoRingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const fogRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mirrorFogRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glossRefs = useRef<(HTMLDivElement | null)[]>([]);
  const motion = useRef({ angle: 0, vel: 0, dir: 1 });
  const [box, setBox] = useState({ w: 0, h: 0 });
  const settings = useRef({ tilt, speed, fog, shading, interactive, paused });
  settings.current = { tilt, speed, fog, shading, interactive, paused };
  const count = images.length;

  const geo = useMemo(() => {
    if (!box.w || !box.h || count === 0) return null;
    const ratio = clamp(aspect, 0.4, 1.6);
    const perspective = Math.max(900, box.w * 1.05);
    const lean = Math.sin((clamp(tilt, 0, 30) + 3) * DEG);
    const margin = Math.max(12, box.h * 0.04);
    let pw = Math.max(140, clamp(panelWidth, 0.08, 0.4) * box.w);
    if (pw / ratio > box.h * 0.56) pw = box.h * 0.56 * ratio;
    let ph = pw / ratio;
    let R = 0;
    let top = 0;
    // Shrink the panels until the back row, the front row and the start of the reflection all fit the box
    const spacing = 1 + clamp(gap, 0, 0.6);
    for (let i = 0; i < 10; i++) {
      ph = pw / ratio;
      R = Math.max((count * pw * spacing) / (2 * Math.PI), pw * 0.9);
      // Never wider than the box, so the ring reads as one closed object
      if (R * 2 > box.w * 0.94 && pw > 60) {
        pw *= Math.max(0.6, (box.w * 0.94) / (R * 2));
        continue;
      }
      const back = perspective / (perspective + R * 2);
      top = (R * lean + ph / 2) * back;
      const bottom = R * lean + ph / 2 + ph * 0.45;
      const need = top + bottom + margin * 2;
      if (need <= box.h || pw <= 60) break;
      pw *= Math.max(0.6, (box.h - margin * 2) / need);
    }
    const facetDeg = (pw / R / DEG) / FACETS;
    const facetW = 2 * R * Math.sin((facetDeg * DEG) / 2);
    const angles = new Float32Array(count * FACETS);
    for (let i = 0; i < count; i++) {
      for (let k = 0; k < FACETS; k++) angles[i * FACETS + k] = (i * 360) / count + (k + 0.5 - FACETS / 2) * facetDeg;
    }
    const idealAnchor = box.h * 0.66 - ph / 2 - R * Math.sin(clamp(tilt, 0, 30) * DEG);
    return { pw, ph, R, facetW, angles, perspective, anchor: Math.max(idealAnchor, margin + top) };
  }, [box.w, box.h, count, panelWidth, aspect, gap, tilt]);

  const floorGap = geo ? Math.max(6, geo.ph * 0.02) : 0;
  // Front panel's lower edge lands a little below the middle, never pushing the back row past the top
  const anchor = geo ? geo.anchor : 0;

  const ringTransform = (angle: number, t: number, mirrored: boolean) =>
    geo
      ? `translate3d(0,0,${(-geo.R).toFixed(1)}px) rotateX(${(-t).toFixed(3)}deg)${
          mirrored ? ` translate3d(0,${(geo.ph + floorGap * 2).toFixed(1)}px,0) scale3d(1,-1,1)` : ""
        } rotateY(${angle.toFixed(3)}deg)`
      : "none";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(() => {
      const w = Math.round(root.clientWidth);
      const h = Math.round(root.clientHeight);
      setBox((b) => (b.w === w && b.h === h ? b : { w, h }));
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!root || !stage || !ring || !geo) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = geo.angles.length;
    const last = new Float32Array(n * 3).fill(-1);
    const state = motion.current;
    let frame = 0;
    let prev = 0;
    let visible = true;
    let dragging = false;
    let dragX = 0;
    let dragT = 0;
    let lastScroll = window.scrollY;
    let hoverX = 0;
    let hoverY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastTilt = Number.NaN;
    let lastAngle = Number.NaN;
    let lastOrigin = Number.NaN;

    const set = (el: HTMLDivElement | null | undefined, slot: number, value: number) => {
      if (Math.abs((last[slot] ?? -1) - value) < 0.003) return false;
      last[slot] = value;
      if (el) el.style.opacity = value.toFixed(3);
      return true;
    };

    const write = () => {
      const s = settings.current;
      const t = clamp(s.tilt, 0, 30) + hoverY * 3;
      if (state.angle !== lastAngle || t !== lastTilt) {
        lastAngle = state.angle;
        lastTilt = t;
        ring.style.transform = ringTransform(state.angle, t, false);
        if (mirrorRef.current) mirrorRef.current.style.transform = ringTransform(state.angle, t, true);
      }
      const origin = 50 + hoverX * 6;
      if (Math.abs(origin - lastOrigin) > 0.01) {
        lastOrigin = origin;
        stage.style.perspectiveOrigin = `${origin.toFixed(2)}% ${anchor.toFixed(1)}px`;
      }
      const fogK = clamp(s.fog, 0, 1) * 0.92;
      const shadeK = clamp(s.shading, 0, 1);
      for (let j = 0; j < n; j++) {
        const phi = ((geo.angles[j] ?? 0) + state.angle) * DEG;
        const back = (1 - Math.cos(phi)) * 0.5;
        const lit = Math.max(0, Math.cos(phi - LIGHT));
        const fogA = fogK * back ** 0.85;
        if (set(fogRefs.current[j], j * 3, fogA)) {
          const mirror = mirrorFogRefs.current[j];
          if (mirror) mirror.style.opacity = fogA.toFixed(3);
        }
        set(shadeRefs.current[j], j * 3 + 1, shadeK * 0.5 * (1 - lit));
        set(glossRefs.current[j], j * 3 + 2, shadeK * 0.28 * lit ** 16 * (1 - back));
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, prev ? (now - prev) / 1000 : 0.016);
      prev = now;
      const s = settings.current;
      if (!dragging) {
        const base = s.paused ? 0 : clamp(s.speed, 0, 5) * 5 * state.dir;
        state.vel += (base - state.vel) * (1 - Math.exp(-dt * 1.1));
        state.angle += state.vel * dt;
      }
      state.angle %= 360;
      const k = 1 - Math.exp(-dt * 4);
      hoverX += (targetX - hoverX) * k;
      hoverY += (targetY - hoverY) * k;
      write();
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      cancelAnimationFrame(frame);
      prev = 0;
      if (!reduce && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !settings.current.interactive) return;
      const rect = root.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      targetX = inside ? (event.clientX - rect.left) / rect.width - 0.5 : 0;
      targetY = inside ? (event.clientY - rect.top) / rect.height - 0.5 : 0;
    };

    const onDown = (event: PointerEvent) => {
      if (!settings.current.interactive || event.button !== 0) return;
      dragging = true;
      dragX = event.clientX;
      dragT = event.timeStamp;
      root.setPointerCapture(event.pointerId);
      root.dataset.dragging = "";
    };
    const onDrag = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - dragX;
      const dtMs = Math.max(1, event.timeStamp - dragT);
      dragX = event.clientX;
      dragT = event.timeStamp;
      const deg = dx / geo.R / DEG;
      state.angle += deg;
      state.vel = state.vel * 0.6 + ((deg * 1000) / dtMs) * 0.4;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      delete root.dataset.dragging;
      state.vel = clamp(state.vel, -240, 240);
      if (Math.abs(state.vel) > 1) state.dir = Math.sign(state.vel);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastScroll;
      lastScroll = y;
      if (!visible || !settings.current.interactive || dragging) return;
      state.vel = clamp(state.vel + dy * 0.12 * state.dir, -120, 120);
    };
    const onVisibility = () => play();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      play();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      root.addEventListener("pointerdown", onDown);
      root.addEventListener("pointermove", onDrag);
      root.addEventListener("pointerup", onUp);
      root.addEventListener("pointercancel", onUp);
    }
    write();
    play();

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onDrag);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
    };
    // ringTransform and anchor derive from geo, tilt and the box
  }, [geo, anchor]);

  const showImage = (el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) el.style.opacity = "1";
  };

  const facets = (mirrored: boolean) =>
    geo
      ? images.map((image, i) =>
          Array.from({ length: FACETS }, (_, k) => {
            const j = i * FACETS + k;
            return (
              <div
                key={j}
                className={cn(
                  "absolute overflow-hidden bg-muted",
                  k === 0 && "rounded-l-md",
                  k === FACETS - 1 && "rounded-r-md",
                )}
                style={{
                  left: -geo.facetW / 2 - 0.5,
                  top: -geo.ph / 2,
                  width: geo.facetW + 1,
                  height: geo.ph,
                  transform: `rotateY(${(geo.angles[j] ?? 0).toFixed(3)}deg) translateZ(${geo.R.toFixed(1)}px)`,
                }}
              >
                <img
                  ref={showImage}
                  src={image.src}
                  alt={!mirrored && k === 0 ? image.alt : ""}
                  draggable={false}
                  onLoad={(event) => {
                    event.currentTarget.style.opacity = "1";
                  }}
                  className="absolute top-0 h-full max-w-none object-cover opacity-0 transition-opacity duration-700"
                  style={{ left: -(k * geo.pw) / FACETS, width: geo.pw }}
                />
                {mirrored ? (
                  <>
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, color-mix(in srgb, ${fogColor} ${Math.round(
                          (1 - clamp(reflection, 0, 1) * 0.55) * 100,
                        )}%, transparent), ${fogColor} 58%)`,
                      }}
                    />
                    <div
                      ref={(el) => {
                        mirrorFogRefs.current[j] = el;
                      }}
                      className="absolute inset-0 opacity-0"
                      style={{ background: fogColor }}
                    />
                  </>
                ) : (
                  <>
                    <div
                      ref={(el) => {
                        glossRefs.current[j] = el;
                      }}
                      className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/15 to-transparent opacity-0"
                    />
                    <div
                      ref={(el) => {
                        shadeRefs.current[j] = el;
                      }}
                      className="absolute inset-0 bg-black opacity-0"
                    />
                    <div
                      ref={(el) => {
                        fogRefs.current[j] = el;
                      }}
                      className="absolute inset-0 opacity-0"
                      style={{ background: fogColor }}
                    />
                  </>
                )}
              </div>
            );
          }),
        )
      : null;

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative isolate w-full touch-pan-y select-none overflow-hidden",
        interactive && "cursor-grab data-[dragging]:cursor-grabbing",
        className,
      )}
    >
      {geo && (
        <div
          ref={stageRef}
          className="absolute inset-0"
          style={{ perspective: `${geo.perspective.toFixed(0)}px`, perspectiveOrigin: `50% ${anchor.toFixed(1)}px` }}
        >
          {reflection > 0 && (
            <div
              ref={mirrorRef}
              aria-hidden="true"
              className="absolute left-1/2 size-0 [transform-style:preserve-3d]"
              style={{ top: anchor, transform: ringTransform(motion.current.angle, tilt, true) }}
            >
              {facets(true)}
            </div>
          )}
          <div
            ref={ringRef}
            className="absolute left-1/2 size-0 [transform-style:preserve-3d]"
            style={{ top: anchor, transform: ringTransform(motion.current.angle, tilt, false) }}
          >
            {facets(false)}
          </div>
        </div>
      )}
    </div>
  );
}
