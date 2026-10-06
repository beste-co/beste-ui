"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "muted" | "ghost";

export interface AutoCarouselSlide {
  /** What the slide shows. It fills the frame. */
  content: React.ReactNode;
  /** Makes the whole slide a link. */
  href?: string;
  /** Accessible name of the slide, and of its link. */
  label?: string;
}

export interface AutoCarouselProps {
  slides: AutoCarouselSlide[];
  /** The active slide, zero-based. Pair with `onValueChange` to control it. */
  value?: number;
  /** The slide shown first when uncontrolled. */
  defaultValue?: number;
  /** Called with the new slide whenever it changes: the timer running out or a press on the progress ring. */
  onValueChange?: (value: number) => void;
  /** Milliseconds each slide stays before the next one fades in. */
  duration?: number;
  /** Milliseconds the crossfade between two slides takes. */
  transition?: number;
  /** Hold the timer while the pointer is over the carousel or focus is inside it. */
  pauseOnHover?: boolean;
  /** Surface behind the progress ring: a frosted chip, or bare for use over a plain slide. */
  tone?: Tone;
  /** Accessible name of the carousel. */
  "aria-label"?: string;
  className?: string;
}

const RADIUS = 13;
const LENGTH = 2 * Math.PI * RADIUS;

const toneClasses: Record<Tone, string> = {
  muted: "bg-background/70 text-foreground shadow-sm backdrop-blur-md",
  ghost: "bg-transparent",
};

/** A photograph with its title over a soft scrim, the demo's slide. */
function DemoSlide({ src, alt, title, caption }: { src: string; alt: string; title: string; caption: string }) {
  return (
    <div className="relative size-full bg-muted">
      <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-16">
        <p className="text-xl font-semibold tracking-tight text-white">{title}</p>
        <p className="mt-0.5 text-sm text-white/80">{caption}</p>
      </div>
    </div>
  );
}

export const autoCarouselDemo: AutoCarouselProps = {
  duration: 6000,
  transition: 1200,
  pauseOnHover: true,
  tone: "muted",
  className: "aspect-video w-full max-w-xl rounded-xl",
  slides: [
    {
      label: "Low tide",
      content: <DemoSlide src="https://images.unsplash.com/photo-1701870856373-bc7273fe6c2c?w=1400&q=80" alt="Swimmers seen from above near a rocky shoreline" title="Low tide" caption="Chet Baker, 2023" />,
    },
    {
      label: "The long bay",
      content: <DemoSlide src="https://images.unsplash.com/photo-1579437469180-e31a7aa7273d?w=1400&q=80" alt="A pebble beach curving along a turquoise bay" title="The long bay" caption="Nina Simone, 2022" />,
    },
    {
      label: "Under the pines",
      content: <DemoSlide src="https://images.unsplash.com/photo-1689202893906-7528e0e89379?w=1400&q=80" alt="Swimmers in a narrow rocky bay below pine trees" title="Under the pines" caption="Miles Davis, 2024" />,
    },
    {
      label: "Inlet",
      content: <DemoSlide src="https://images.unsplash.com/photo-1785861835336-247eaef97cb3?w=1400&q=80" alt="A deep turquoise inlet between two cliffs" title="Inlet" caption="Joni Mitchell, 2024" />,
    },
    {
      label: "Green water",
      content: <DemoSlide src="https://images.unsplash.com/photo-1688926984205-74eb653edeae?w=1400&q=80" alt="A limestone cove with clear green water" title="Green water" caption="Bill Evans, 2023" />,
    },
  ],
};

/**
 * A carousel that plays on its own: slides crossfade slowly, and a ring in the corner fills
 * with the time the current slide has left. The ring is the timer, a CSS animation whose end
 * moves on, so pausing it pauses the carousel and nothing drifts out of step. Only the active
 * slide and the one fading out are mounted, which keeps heavy slides cheap.
 */
export function AutoCarousel({
  slides,
  value,
  defaultValue = 0,
  onValueChange,
  duration = 6000,
  transition = 1200,
  pauseOnHover = true,
  tone = "muted",
  "aria-label": ariaLabel = "Carousel",
  className,
}: AutoCarouselProps) {
  const count = slides.length;
  const [inner, setInner] = React.useState(defaultValue);
  const active = count > 0 ? (((value ?? inner) % count) + count) % count : 0;
  const [leaving, setLeaving] = React.useState<number | null>(null);
  const [held, setHeld] = React.useState(false);
  const [still, setStill] = React.useState(false);

  // Reduced motion: no timer, the ring only moves on when pressed
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const previous = React.useRef(active);

  // The outgoing slide stays mounted until the crossfade has finished
  React.useEffect(() => {
    if (previous.current === active) return;
    setLeaving(previous.current);
    previous.current = active;
    const id = window.setTimeout(() => setLeaving(null), transition);
    return () => window.clearTimeout(id);
  }, [active, transition]);

  const go = (next: number) => {
    if (count === 0) return;
    const index = ((next % count) + count) % count;
    setInner(index);
    onValueChange?.(index);
  };

  const hold = pauseOnHover
    ? {
        onPointerEnter: () => setHeld(true),
        onPointerLeave: () => setHeld(false),
        onFocus: () => setHeld(true),
        onBlur: () => setHeld(false),
      }
    : {};

  return (
    <section
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cn("relative isolate overflow-hidden", className)}
      {...hold}
    >
      <style>{`@keyframes auto-carousel-fill { from { stroke-dashoffset: ${LENGTH.toFixed(2)}; } to { stroke-dashoffset: 0; } }`}</style>

      {slides.map((slide, index) => {
        if (index !== active && index !== leaving) return null;
        const shown = index === active;
        const frame = cn(
          "absolute inset-0 block size-full transition-opacity ease-in-out motion-reduce:transition-none",
          shown ? "opacity-100" : "pointer-events-none opacity-0",
        );
        const style = { transitionDuration: `${transition}ms` };
        return slide.href ? (
          <a
            key={index}
            href={slide.href}
            aria-label={slide.label}
            aria-hidden={!shown}
            tabIndex={shown ? undefined : -1}
            className={cn(frame, "cursor-pointer starting:opacity-0")}
            style={style}
          >
            {slide.content}
          </a>
        ) : (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={slide.label}
            aria-hidden={!shown}
            className={cn(frame, "starting:opacity-0")}
            style={style}
          >
            {slide.content}
          </div>
        );
      })}

      {count > 1 && (
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label={`Slide ${active + 1} of ${count}. Show the next slide`}
          className={cn(
            "absolute bottom-3 right-3 z-10 flex size-9 cursor-pointer select-none items-center justify-center rounded-full outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring",
            toneClasses[tone],
          )}
        >
          <svg viewBox="0 0 32 32" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
            <circle cx="16" cy="16" r={RADIUS} fill="none" strokeWidth="2" className="stroke-current opacity-15" />
            <circle
              key={active}
              cx="16"
              cy="16"
              r={RADIUS}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={LENGTH}
              strokeDashoffset={LENGTH}
              onAnimationEnd={() => go(active + 1)}
              className="stroke-current"
              style={
                still
                  ? undefined
                  : {
                      animation: `auto-carousel-fill ${duration}ms linear forwards`,
                      animationPlayState: held ? "paused" : "running",
                    }
              }
            />
          </svg>
          <span className="text-sm font-medium tabular-nums">{active + 1}</span>
        </button>
      )}
    </section>
  );
}
