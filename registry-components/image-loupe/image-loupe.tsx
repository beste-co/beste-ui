"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the frame while the picture loads, and of the lens rim. */
type Tone = "muted" | "outline" | "ghost";

/** Lens size and frame rounding. */
type Size = "sm" | "default" | "lg";

interface ImageLoupeProps {
  src: string;
  /** Required: the picture is the content, so it must be described. */
  alt: string;
  /** Larger file for the magnified view, fetched the first time someone zooms. Defaults to `src`. */
  zoomSrc?: string;
  /** `lens` magnifies under the pointer; `side` opens a pane beside the image and marks the area it shows. */
  mode?: "lens" | "side";
  /** Which side the pane opens on in `side` mode. Falls back to the lens when there is no room. */
  side?: "right" | "left";
  zoom?: number;
  defaultZoom?: number;
  onZoomChange?: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
  /** Scrolling over the image changes the zoom while it is magnified. */
  wheelZoom?: boolean;
  lensShape?: "circle" | "rounded";
  /** Lens diameter in px. Defaults by `size`. */
  lensSize?: number;
  /** CSS aspect ratio of the frame. The picture covers it. */
  aspectRatio?: string;
  /** Hint in the corner. Set to an empty string to hide it. */
  hint?: string;
  disabled?: boolean;
  size?: Size;
  tone?: Tone;
  className?: string;
}

export const imageLoupeDemo: ImageLoupeProps = {
  src: "https://images.unsplash.com/photo-1783676167814-13057079dd43?q=80&w=1200&auto=format&fit=crop",
  zoomSrc: "https://images.unsplash.com/photo-1783676167814-13057079dd43?q=80&w=2400&auto=format&fit=crop",
  alt: "Van Gogh, a wheat field with cypresses under swirling clouds",
  mode: "lens",
  defaultZoom: 2.5,
  aspectRatio: "4 / 3",
  className: "max-w-xl",
};

const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const HOLD_MS = 320;
const TOUCH_SLOP = 8;

const toneStyles: Record<Tone, { frame: string; rim: string }> = {
  muted: { frame: "bg-muted", rim: "ring-4 ring-background/80 shadow-xl" },
  outline: { frame: "border border-border bg-muted", rim: "ring-1 ring-border shadow-xl" },
  ghost: { frame: "bg-transparent", rim: "ring-1 ring-white/40 shadow-lg" },
};

const sizeStyles: Record<Size, { lens: number; radius: string; hint: string }> = {
  sm: { lens: 130, radius: "rounded-lg", hint: "bottom-2 left-2 px-2 py-0.5" },
  default: { lens: 180, radius: "rounded-xl", hint: "bottom-3 left-3 px-2.5 py-1" },
  lg: { lens: 230, radius: "rounded-2xl", hint: "bottom-4 left-4 px-3 py-1" },
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function ImageLoupe({
  src,
  alt,
  zoomSrc,
  mode = "lens",
  side = "right",
  zoom: zoomProp,
  defaultZoom = 2.5,
  onZoomChange,
  minZoom = 1.5,
  maxZoom = 6,
  wheelZoom = true,
  lensShape = "circle",
  lensSize,
  aspectRatio = "1 / 1",
  hint,
  disabled = false,
  size = "default",
  tone = "muted",
  className,
}: ImageLoupeProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<HTMLButtonElement>(null);
  const baseRef = React.useRef<HTMLImageElement>(null);
  const hintId = React.useId();
  const [innerZoom, setInnerZoom] = React.useState(defaultZoom);
  const zoom = clamp(zoomProp ?? innerZoom, minZoom, maxZoom);
  const [active, setActive] = React.useState<null | "pointer" | "touch" | "keyboard">(null);
  const [useSide, setUseSide] = React.useState(false);
  const [requested, setRequested] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [baseLoaded, setBaseLoaded] = React.useState(false);
  const [touchDevice, setTouchDevice] = React.useState(false);
  const lens = lensSize ?? sizeStyles[size].lens;
  const big = zoomSrc ?? src;
  // Position, frame size and zoom live in a ref and reach the DOM as CSS variables: moving costs no renders
  const state = React.useRef({ x: 0.5, y: 0.5, w: 0, h: 0, z: zoom, lens });
  state.current.z = zoom;
  state.current.lens = lens;

  React.useEffect(() => {
    setTouchDevice(window.matchMedia("(hover: none)").matches);
    // A cached picture can finish before hydration and never fire onLoad
    const base = baseRef.current;
    if (base?.complete && base.naturalWidth > 0) setBaseLoaded(true);
  }, []);

  React.useEffect(() => {
    setLoaded(false);
    setRequested(false);
  }, [big]);

  // Written on the root so the side pane, a sibling of the frame, reads the same values
  const apply = React.useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const { x, y, w, h, z, lens: l } = state.current;
    const set = (name: string, value: number) => el.style.setProperty(name, `${value}px`);
    set("--loupe-zw", w * z);
    set("--loupe-zh", h * z);
    set("--loupe-lx", x * w);
    set("--loupe-ly", y * h);
    set("--loupe-ix", l / 2 - x * w * z);
    set("--loupe-iy", l / 2 - y * h * z);
    // Side pane: the magnified region stays inside the picture, and a box on the image marks it
    set("--loupe-tx", clamp(w / 2 - x * w * z, w - w * z, 0));
    set("--loupe-ty", clamp(h / 2 - y * h * z, h - h * z, 0));
    set("--loupe-rw", w / z);
    set("--loupe-rh", h / z);
    set("--loupe-rx", clamp(x * w - w / (2 * z), 0, w - w / z));
    set("--loupe-ry", clamp(y * h - h / (2 * z), 0, h - h / z));
  }, []);

  React.useEffect(() => {
    apply();
  }, [zoom, lens, apply]);

  React.useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => {
      state.current.w = el.clientWidth;
      state.current.h = el.clientHeight;
      apply();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [apply]);

  const setZoom = React.useCallback(
    (next: number) => {
      const value = clamp(Math.round(next * 100) / 100, minZoom, maxZoom);
      if (zoomProp === undefined) setInnerZoom(value);
      onZoomChange?.(value);
    },
    [zoomProp, minZoom, maxZoom, onZoomChange],
  );

  const start = (kind: "pointer" | "touch" | "keyboard") => {
    if (disabled) return;
    setRequested(true);
    const rect = frameRef.current?.getBoundingClientRect();
    // The side pane needs a frame's width of room; without it the lens takes over
    const room = rect ? (side === "right" ? window.innerWidth - rect.right : rect.left) : 0;
    setUseSide(mode === "side" && kind !== "touch" && rect !== undefined && room >= rect.width + 16);
    setActive(kind);
  };

  const moveTo = (clientX: number, clientY: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    state.current.x = clamp((clientX - rect.left) / rect.width, 0, 1);
    state.current.y = clamp((clientY - rect.top) / rect.height, 0, 1);
    apply();
  };

  // Touch: press and hold opens the lens above the finger; a quick swipe still scrolls the page
  const hold = React.useRef<{ timer: number; x: number; y: number } | null>(null);
  const activeRef = React.useRef(active);
  activeRef.current = active;

  React.useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onTouchMove = (event: TouchEvent) => {
      if (activeRef.current === "touch") event.preventDefault();
    };
    const onWheel = (event: WheelEvent) => {
      if (!wheelZoom || activeRef.current === null || activeRef.current === "touch") return;
      event.preventDefault();
      setZoom(state.current.z * Math.exp(-event.deltaY * 0.0015));
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("wheel", onWheel);
    };
  }, [wheelZoom, setZoom]);

  const cancelHold = () => {
    if (hold.current) window.clearTimeout(hold.current.timer);
    hold.current = null;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || event.pointerType !== "touch") return;
    const { clientX, clientY, pointerId } = event;
    const target = event.currentTarget;
    cancelHold();
    hold.current = {
      x: clientX,
      y: clientY,
      timer: window.setTimeout(() => {
        target.setPointerCapture?.(pointerId);
        moveTo(clientX, clientY);
        start("touch");
      }, HOLD_MS),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.pointerType === "touch") {
      const pending = hold.current;
      if (pending && active !== "touch" && Math.hypot(event.clientX - pending.x, event.clientY - pending.y) > TOUCH_SLOP) cancelHold();
      if (active === "touch") moveTo(event.clientX, event.clientY);
      return;
    }
    moveTo(event.clientX, event.clientY);
    if (active === null) start("pointer");
  };

  const endTouch = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "touch") return;
    cancelHold();
    if (active === "touch") setActive(null);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (active !== "keyboard") return;
    const step = event.shiftKey ? 0.01 : 0.05;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      state.current.x = clamp(state.current.x + move[0], 0, 1);
      state.current.y = clamp(state.current.y + move[1], 0, 1);
      apply();
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      setZoom(zoom * 1.25);
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      setZoom(zoom / 1.25);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setActive(null);
    }
  };

  const hintText = hint ?? (touchDevice ? "Press and hold to zoom" : "Hover to zoom");
  const round = lensShape === "circle" ? "rounded-full" : "rounded-2xl";
  const zoomLayer = (
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute left-0 top-0 max-w-none object-cover"
        style={{ width: "var(--loupe-zw)", height: "var(--loupe-zh)" }}
      />
      {requested && (
        <img
          src={big}
          alt=""
          aria-hidden="true"
          draggable={false}
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute left-0 top-0 max-w-none object-cover transition-opacity duration-500 motion-reduce:transition-none",
            loaded ? "opacity-100" : "opacity-0",
          )}
          style={{ width: "var(--loupe-zw)", height: "var(--loupe-zh)" }}
        />
      )}
      {requested && !loaded && (
        <span className="absolute right-3 top-3 size-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin" />
      )}
    </>
  );

  return (
    <div ref={rootRef} data-slot="image-loupe" className={cn("relative w-full", className)}>
      <button
        ref={frameRef}
        type="button"
        disabled={disabled}
        aria-pressed={active === "keyboard"}
        aria-describedby={hintId}
        data-active={active ?? undefined}
        data-side={useSide || undefined}
        onClick={(event) => {
          // Only keyboard activation toggles; the mouse already zooms on hover
          if (event.detail !== 0) return;
          if (active === "keyboard") setActive(null);
          else start("keyboard");
        }}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") {
            moveTo(event.clientX, event.clientY);
            start("pointer");
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "touch" && active === "pointer") setActive(null);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endTouch}
        onPointerCancel={endTouch}
        onContextMenu={(event) => {
          if (hold.current || active === "touch") event.preventDefault();
        }}
        onKeyDown={onKeyDown}
        onBlur={() => {
          if (active === "keyboard") setActive(null);
        }}
        className={cn(
          "group/loupe relative block w-full touch-pan-y select-none overflow-hidden outline-none [-webkit-touch-callout:none]",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "cursor-zoom-in disabled:cursor-default",
          useSide ? "data-[active]:cursor-crosshair" : "data-[active]:cursor-none",
          sizeStyles[size].radius,
          toneStyles[tone].frame,
        )}
        style={{ aspectRatio }}
      >
        <img
          ref={baseRef}
          src={src}
          alt={alt}
          draggable={false}
          decoding="async"
          onLoad={() => setBaseLoaded(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-500 motion-reduce:transition-none",
            baseLoaded ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Side mode marks the region shown in the pane */}
        {useSide && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 rounded-sm border border-white/80 bg-white/15 opacity-0 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)] transition-opacity duration-200 group-data-[active]/loupe:opacity-100"
            style={{
              width: "var(--loupe-rw)",
              height: "var(--loupe-rh)",
              transform: "translate(var(--loupe-rx), var(--loupe-ry))",
            }}
          />
        )}

        {!useSide && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-0 top-0 overflow-hidden bg-muted opacity-0 scale-50 transition-[opacity,scale] duration-[420ms] motion-reduce:transition-none",
              "group-data-[active]/loupe:scale-100 group-data-[active]/loupe:opacity-100",
              round,
              toneStyles[tone].rim,
            )}
            style={{
              width: lens,
              height: lens,
              // A finger would cover the lens, so on touch it floats above the contact point
              translate: `calc(var(--loupe-lx) - ${lens / 2}px) calc(var(--loupe-ly) - ${active === "touch" ? lens * 1.05 : lens / 2}px)`,
              transitionTimingFunction: SPRING_EASE,
            }}
          >
            <span className="absolute inset-0" style={{ transform: "translate(var(--loupe-ix), var(--loupe-iy))" }}>
              {zoomLayer}
            </span>
          </span>
        )}

        {hintText && (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute rounded-full bg-background/85 text-sm text-foreground backdrop-blur transition-opacity duration-300",
              sizeStyles[size].hint,
              active ? "opacity-0" : "opacity-100",
            )}
          >
            {hintText}
          </span>
        )}
      </button>
      <span id={hintId} className="sr-only">
        Press Enter to magnify, then use the arrow keys to move, plus or minus to change the zoom and Escape to close.
      </span>

      {useSide && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-0 z-20 overflow-hidden bg-muted opacity-0 transition-opacity duration-200 motion-reduce:transition-none",
            active && "opacity-100",
            side === "right" ? "left-[calc(100%+1rem)]" : "right-[calc(100%+1rem)]",
            sizeStyles[size].radius,
            toneStyles[tone].rim,
          )}
          style={{ width: "100%", aspectRatio }}
        >
          <span className="absolute inset-0" style={{ transform: "translate(var(--loupe-tx), var(--loupe-ty))" }}>
            {zoomLayer}
          </span>
        </div>
      )}
    </div>
  );
}
