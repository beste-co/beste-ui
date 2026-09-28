"use client";

import { AudioLines, CalendarDays, Disc3, FolderOpen, Mail, MessageCircle, Mic2, Music, Settings, Trash2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of the dock. */
type Tone = "muted" | "outline" | "ghost";

/** Resting tile size. */
type Size = "sm" | "default" | "lg";

/** Which edge the dock sits on; tiles grow away from it. */
type Side = "bottom" | "top" | "left" | "right";

type IconLike = React.ComponentType<{ className?: string }> | React.ReactNode;

export interface DockAction {
  id: string;
  label: string;
  /** A component (a lucide icon) or any node, drawn on the tile. */
  icon?: IconLike;
  /** An image that fills the tile instead of an icon. */
  image?: string;
  /** Tile color behind a white icon. Without it the tile follows the surface. */
  tint?: string;
  href?: string;
  onClick?: () => void;
  /** A dot beside the tile, like a running app. */
  running?: boolean;
  /** A count or short text in the corner. */
  badge?: number | string;
  disabled?: boolean;
}

export interface DockSeparator {
  id: string;
  separator: true;
}

export type DockItem = DockAction | DockSeparator;

export interface DockMagnifyProps {
  items: DockItem[];
  /** Largest scale a tile reaches right under the pointer. @defaultValue 1.8 */
  magnification?: number;
  /** How far the swell reaches either side of the pointer, in px. @defaultValue 140 */
  distance?: number;
  /** Edge the dock sits on. Tiles grow away from it and labels show on the far side. @defaultValue "bottom" */
  side?: Side;
  /** A short hop when an item is pressed. @defaultValue true */
  bounceOnClick?: boolean;
  /** @defaultValue "muted" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  /** @defaultValue "Dock" */
  "aria-label"?: string;
  className?: string;
}

export const dockMagnifyDemo: DockMagnifyProps = {
  items: [
    { id: "music", label: "Music", icon: Music, tint: "#fb3c5b", running: true },
    { id: "studio", label: "Studio", icon: AudioLines, tint: "#7c5cff", running: true },
    { id: "records", label: "Records", icon: Disc3, tint: "#f59e0b" },
    { id: "voice", label: "Voice memos", icon: Mic2, tint: "#ef4444" },
    { id: "messages", label: "Messages", icon: MessageCircle, tint: "#22c55e", badge: 3, running: true },
    { id: "mail", label: "Mail", icon: Mail, tint: "#3b82f6", badge: 12 },
    { id: "calendar", label: "Calendar", icon: CalendarDays, tint: "#f97316" },
    { id: "divider", separator: true },
    { id: "files", label: "Files", icon: FolderOpen, tint: "#0ea5e9" },
    { id: "settings", label: "Settings", icon: Settings, tint: "#64748b" },
    { id: "trash", label: "Trash", icon: Trash2, tint: "#94a3b8", onClick: () => console.log("Open the trash") },
  ],
  magnification: 1.8,
  distance: 140,
};

// Same spring as inspector-slider: overshoots a hair, then settles, with no animation library
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const toneStyles: Record<Tone, string> = {
  muted: "border border-border/60 bg-muted/80 backdrop-blur-xl",
  outline: "border border-border bg-background shadow-lg",
  ghost: "border border-transparent",
};

const sizeStyles: Record<Size, { base: number; gap: number; pad: number; radius: string }> = {
  sm: { base: 36, gap: 6, pad: 6, radius: "rounded-[22%]" },
  default: { base: 46, gap: 8, pad: 8, radius: "rounded-[22%]" },
  lg: { base: 58, gap: 10, pad: 10, radius: "rounded-[22%]" },
};

const isSeparator = (item: DockItem): item is DockSeparator => "separator" in item && item.separator === true;

function renderIcon(icon: IconLike, className: string) {
  if (!icon) return null;
  if (typeof icon === "function" || (typeof icon === "object" && icon !== null && "render" in icon)) {
    const Icon = icon as React.ComponentType<{ className?: string }>;
    return <Icon className={className} />;
  }
  return icon as React.ReactNode;
}

/** Scale of one tile at `d` px from the pointer: a cosine hump that is 1 at the edge of `distance`. */
export function dockScale(d: number, magnification: number, distance: number) {
  if (d >= distance) return 1;
  return 1 + (magnification - 1) * ((Math.cos((Math.PI * d) / distance) + 1) / 2);
}

export function DockMagnify({
  items,
  magnification = 1.8,
  distance = 140,
  side = "bottom",
  bounceOnClick = true,
  tone = "muted",
  size = "default",
  "aria-label": ariaLabel = "Dock",
  className,
}: DockMagnifyProps) {
  const listRef = React.useRef<HTMLUListElement>(null);
  const tiles = React.useRef<(HTMLElement | null)[]>([]);
  const scales = React.useRef<number[]>([]);
  const pointer = React.useRef<number | null>(null);
  const focusIndex = React.useRef<number | null>(null);
  const frame = React.useRef(0);
  const reduce = React.useRef(false);
  const settings = React.useRef({ magnification, distance });
  settings.current = { magnification, distance };
  const actions = items.map((item, index) => ({ item, index })).filter((entry) => !isSeparator(entry.item));
  const [active, setActive] = React.useState(() => actions[0]?.index ?? 0);

  const vertical = side === "left" || side === "right";
  const s = sizeStyles[size];

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reduce.current = query.matches;
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Each frame eases every tile toward its target scale and writes it to --dock-s; React never renders
  const step = React.useCallback(() => {
    frame.current = 0;
    const { magnification: mag, distance: reach } = settings.current;
    let focusCenter: number | null = null;
    if (pointer.current === null && focusIndex.current !== null) {
      const el = tiles.current[focusIndex.current];
      const rect = el?.getBoundingClientRect();
      if (rect) focusCenter = vertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
    }
    const origin = pointer.current ?? focusCenter;
    let moving = false;
    tiles.current.forEach((el, i) => {
      if (!el) return;
      let target = 1;
      if (origin !== null && !reduce.current) {
        const rect = el.getBoundingClientRect();
        const center = vertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
        target = dockScale(Math.abs(origin - center), mag, reach);
      }
      const current = scales.current[i] ?? 1;
      const next = Math.abs(target - current) < 0.002 ? target : current + (target - current) * 0.28;
      if (next !== target) moving = true;
      scales.current[i] = next;
      el.style.setProperty("--dock-s", next.toFixed(4));
    });
    if (moving) frame.current = requestAnimationFrame(step);
  }, [vertical]);

  const kick = React.useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(step);
  }, [step]);

  React.useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const onPointerMove = (event: React.PointerEvent) => {
    if (event.pointerType === "touch") return;
    pointer.current = vertical ? event.clientY : event.clientX;
    kick();
  };
  const onPointerLeave = () => {
    pointer.current = null;
    kick();
  };

  const focusAt = (index: number) => {
    setActive(index);
    tiles.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const order = actions.map((entry) => entry.index);
    const at = order.indexOf(active);
    const prev = vertical ? "ArrowUp" : "ArrowLeft";
    const next = vertical ? "ArrowDown" : "ArrowRight";
    let target: number | undefined;
    if (event.key === next) target = order[(at + 1) % order.length];
    else if (event.key === prev) target = order[(at - 1 + order.length) % order.length];
    else if (event.key === "Home") target = order[0];
    else if (event.key === "End") target = order[order.length - 1];
    if (target === undefined) return;
    event.preventDefault();
    focusAt(target);
  };

  const bounce = (el: HTMLElement | null) => {
    if (!bounceOnClick || !el || reduce.current || typeof el.animate !== "function") return;
    const away = side === "bottom" ? "0 -45%" : side === "top" ? "0 45%" : side === "left" ? "45% 0" : "-45% 0";
    const half = side === "bottom" ? "0 -12%" : side === "top" ? "0 12%" : side === "left" ? "12% 0" : "-12% 0";
    el.animate(
      [{ translate: "0 0" }, { translate: away, offset: 0.35 }, { translate: "0 0", offset: 0.65 }, { translate: half, offset: 0.82 }, { translate: "0 0" }],
      { duration: 900, easing: "cubic-bezier(0.33, 0, 0.3, 1)" },
    );
  };

  // Tiles grow away from the edge the dock sits on; labels and dots sit on the matching sides
  const grow = { bottom: "items-end", top: "items-start", left: "items-start", right: "items-end" }[side];
  const labelPos = {
    bottom: "bottom-full left-1/2 mb-3 -translate-x-1/2",
    top: "top-full left-1/2 mt-3 -translate-x-1/2",
    left: "left-full top-1/2 ml-3 -translate-y-1/2",
    right: "right-full top-1/2 mr-3 -translate-y-1/2",
  }[side];
  const dotPos = {
    bottom: "top-full left-1/2 mt-1 -translate-x-1/2",
    top: "bottom-full left-1/2 mb-1 -translate-x-1/2",
    left: "right-full top-1/2 mr-1 -translate-y-1/2",
    right: "left-full top-1/2 ml-1 -translate-y-1/2",
  }[side];
  const origin = { bottom: "origin-bottom", top: "origin-top", left: "origin-left", right: "origin-right" }[side];

  return (
    <nav aria-label={ariaLabel} data-slot="dock-magnify" className={cn("inline-flex", className)}>
      <ul
        ref={listRef}
        data-side={side}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onKeyDown={onKeyDown}
        // Concentric corners: a resting tile's 22% radius plus the dock's padding plus its 1px border
        className={cn("flex rounded-[calc(var(--dock-base)*0.22_+_var(--dock-pad)_+_1px)]", vertical ? "flex-col" : "flex-row", grow, toneStyles[tone])}
        style={
          {
            "--dock-base": `${s.base}px`,
            "--dock-pad": `${s.pad}px`,
            gap: `${s.gap}px`,
            padding: `${s.pad}px`,
            [vertical ? "width" : "height"]: `${s.base + s.pad * 2 + 2}px`,
          } as React.CSSProperties
        }
      >
        {items.map((item, index) => {
          if (isSeparator(item)) {
            return (
              <li
                key={item.id}
                role="separator"
                aria-orientation={vertical ? "horizontal" : "vertical"}
                className={cn("shrink-0 self-center bg-foreground/15", vertical ? "mx-1 h-px w-[70%]" : "my-1 h-[70%] w-px")}
              />
            );
          }
          const label = item.badge !== undefined ? `${item.label}, ${item.badge}` : item.label;
          const face = item.image ? (
            // biome-ignore lint/performance/noImgElement: registry components ship plain img
            <img src={item.image} alt="" draggable={false} className="size-full object-cover" />
          ) : (
            renderIcon(item.icon, "size-[52%]")
          );
          const common = {
            "aria-label": label,
            tabIndex: index === active ? 0 : -1,
            onFocus: (event: React.FocusEvent<HTMLElement>) => {
              setActive(index);
              if (event.currentTarget.matches(":focus-visible")) {
                focusIndex.current = index;
                kick();
              }
            },
            onBlur: () => {
              focusIndex.current = null;
              kick();
            },
            onClick: (event: React.MouseEvent<HTMLElement>) => {
              bounce(event.currentTarget.parentElement);
              item.onClick?.();
            },
            className: cn(
              "group/tile peer absolute inset-0 grid cursor-pointer place-items-center overflow-hidden outline-none select-none",
              s.radius,
              origin,
              item.tint ? "text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_4px_10px_-4px_rgb(0_0_0/0.35)]" : "border border-border bg-background text-foreground shadow-sm",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-40",
            ),
            style: item.tint ? { background: `linear-gradient(180deg, color-mix(in oklab, ${item.tint} 82%, white), ${item.tint})` } : undefined,
          };
          return (
            <li
              key={item.id}
              ref={(el) => {
                tiles.current[index] = el;
              }}
              className="relative shrink-0 [--dock-s:1]"
              style={{ width: "calc(var(--dock-base) * var(--dock-s))", height: "calc(var(--dock-base) * var(--dock-s))" }}
            >
              {item.href ? (
                <a href={item.href} {...common}>
                  {face}
                </a>
              ) : (
                <button type="button" disabled={item.disabled} {...common}>
                  {face}
                </button>
              )}

              {item.badge !== undefined && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-sm leading-none font-medium text-white tabular-nums shadow-sm select-none"
                >
                  {item.badge}
                </span>
              )}
              {item.running && <span aria-hidden="true" className={cn("pointer-events-none absolute size-1 rounded-full bg-foreground/70", dotPos)} />}

              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute z-10 rounded-md border border-border bg-popover px-2.5 py-1 text-sm whitespace-nowrap text-popover-foreground shadow-md select-none",
                  "scale-95 opacity-0 transition-[opacity,scale] duration-200 peer-hover:scale-100 peer-hover:opacity-100 peer-focus-visible:scale-100 peer-focus-visible:opacity-100",
                  labelPos,
                )}
                style={{ transitionTimingFunction: SPRING_EASE }}
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
