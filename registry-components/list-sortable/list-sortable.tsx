"use client";

import { GripVertical } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of each row. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Row size preset. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border bg-background",
  ghost: "border border-transparent hover:bg-muted/60",
};

const sizeStyles: Record<Size, string> = {
  sm: "min-h-9 gap-2 px-2 text-sm",
  default: "min-h-11 gap-2.5 px-3 text-sm",
  lg: "min-h-14 gap-3 px-4 text-base",
};

// Rows make room and settle on a soft ease-out, as list-kanban does: a spring's overshoot read as a second move after the drop
const MOVE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Pixels a mouse moves before a press becomes a drag. */
const DRAG_THRESHOLD = 4;
/** How long a finger rests on a row before it lifts, and how far it may wander meanwhile. */
const LONG_PRESS = 260;
const LONG_PRESS_SLOP = 8;
/** Distance from a scroll edge where the list starts scrolling on its own. */
const EDGE = 56;

const INTERACTIVE = "input, textarea, select, button, a[href], [contenteditable=''], [contenteditable='true'], [data-no-drag]";

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Returns a copy of `list` with the item at `from` moved to `to`. */
export function arrayMove<T>(list: readonly T[], from: number, to: number): T[] {
  const next = list.slice();
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

export interface SortableItemState {
  index: number;
  /** This row is lifted, by pointer or keyboard. */
  dragging: boolean;
}

export interface ListSortableProps<T> {
  /** The rows, in order. Pair with `onReorder` to control them. */
  items?: T[];
  /** The starting rows when uncontrolled. */
  defaultItems?: T[];
  /** Called with the reordered list when a row is dropped somewhere new. */
  onReorder?: (items: T[], move: { from: number; to: number; item: T }) => void;
  /** A stable key per row. Defaults to `item.id`; index keys break the settle animation. */
  getKey?: (item: T, index: number) => string;
  /** What screen readers call a row. Defaults to `label`, `title` or `name`. */
  getItemLabel?: (item: T) => string;
  /** The row's content. The grip and the surface are drawn around it. */
  renderItem?: (item: T, state: SortableItemState) => React.ReactNode;
  /** Only the grip starts a drag, so the rest of the row can hold links and buttons. */
  handle?: boolean;
  /**
   * Draw the grip at the start of each row. With `handle`, the grip is always drawn.
   * @defaultValue true */
  grip?: boolean;
  /** @defaultValue "outline" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  disabled?: boolean;
  /** @defaultValue "Sortable list" */
  "aria-label"?: string;
  className?: string;
  itemClassName?: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  length: string;
}

const setlist: Song[] = [
  { id: "1", title: "Motion Sickness", artist: "Phoebe Bridgers", length: "3:50" },
  { id: "2", title: "Nobody", artist: "Mitski", length: "3:13" },
  { id: "3", title: "Pink + White", artist: "Frank Ocean", length: "3:04" },
  { id: "4", title: "Seventeen", artist: "Sharon Van Etten", length: "4:31" },
  { id: "5", title: "Cellophane", artist: "FKA twigs", length: "3:24" },
  { id: "6", title: "Holocene", artist: "Bon Iver", length: "5:36" },
];

export const listSortableDemo: ListSortableProps<Song> = {
  defaultItems: setlist,
  "aria-label": "Setlist",
  getItemLabel: (song) => song.title,
  renderItem: (song, { index }) => (
    <span className="flex min-w-0 flex-1 items-center gap-3">
      <span className="w-5 shrink-0 text-right text-muted-foreground tabular-nums">{index + 1}</span>
      <span className="min-w-0 flex-1 truncate">
        <span className="font-medium text-foreground">{song.title}</span>
        <span className="text-muted-foreground"> · {song.artist}</span>
      </span>
      <span className="shrink-0 text-muted-foreground tabular-nums">{song.length}</span>
    </span>
  ),
  className: "w-full max-w-sm",
};

function defaultKey<T>(item: T, index: number) {
  const id = (item as { id?: unknown } | null)?.id;
  return id === undefined || id === null ? String(index) : String(id);
}

function defaultLabel<T>(item: T) {
  if (typeof item === "string" || typeof item === "number") return String(item);
  const record = item as { label?: unknown; title?: unknown; name?: unknown } | null;
  const text = record?.label ?? record?.title ?? record?.name;
  return typeof text === "string" ? text : "Item";
}

function scrollParent(node: HTMLElement | null): HTMLElement | null {
  for (let el = node?.parentElement ?? null; el; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) return el;
  }
  return null;
}

interface Drag {
  key: string;
  from: number;
  to: number;
  mode: "pointer" | "keyboard";
}

interface Slot {
  top: number;
  height: number;
}

/**
 * A list you reorder by dragging a row, or from the keyboard. The row lifts, the others
 * make room, the list scrolls near its edges, and every row settles in place.
 */
export function ListSortable<T>({
  items,
  defaultItems,
  onReorder,
  getKey = defaultKey,
  getItemLabel = defaultLabel,
  renderItem,
  handle = false,
  grip = true,
  tone = "outline",
  size = "default",
  disabled = false,
  "aria-label": ariaLabel = "Sortable list",
  className,
  itemClassName,
}: ListSortableProps<T>) {
  const [inner, setInner] = React.useState<T[]>(() => defaultItems ?? []);
  const list = items ?? inner;
  const keys = list.map((item, index) => getKey(item, index));
  const count = list.length;
  const instructionsId = React.useId();

  const [drag, setDrag] = React.useState<Drag | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const dragRef = React.useRef<Drag | null>(null);
  dragRef.current = drag;

  const listRef = React.useRef<HTMLUListElement>(null);
  const rowRefs = React.useRef(new Map<string, HTMLLIElement>());
  const focusRefs = React.useRef(new Map<string, HTMLElement>());
  const slots = React.useRef<Slot[]>([]);
  const gap = React.useRef(0);
  const flip = React.useRef<Map<string, number> | null>(null);
  const refocus = React.useRef<string | null>(null);
  const pointer = React.useRef({ y: 0, grab: 0, frame: 0, scroller: null as HTMLElement | null, cleanup: () => {} });

  const announce = (text: string) => setAnnouncement(text);
  const position = (index: number) => `position ${index + 1} of ${count}`;

  const measure = () => {
    const box = listRef.current?.getBoundingClientRect();
    if (!box) return;
    slots.current = keys.map((key) => {
      const rect = rowRefs.current.get(key)?.getBoundingClientRect();
      return { top: (rect?.top ?? box.top) - box.top, height: rect?.height ?? 0 };
    });
    const [a, b] = slots.current;
    gap.current = a && b ? Math.max(0, b.top - (a.top + a.height)) : 0;
  };

  /** Where the lifted row sits when it lands at `to`, relative to where it started. */
  const landingOffset = (from: number, to: number) => {
    const source = slots.current[from];
    const target = slots.current[to];
    if (!source || !target) return 0;
    return to > from ? target.top + target.height - source.height - source.top : target.top - source.top;
  };

  // Rows between the old and new place step aside by the lifted row's height plus the gap
  const shiftFor = (index: number) => {
    if (!drag || index === drag.from) return 0;
    const step = (slots.current[drag.from]?.height ?? 0) + gap.current;
    if (drag.from < drag.to && index > drag.from && index <= drag.to) return -step;
    if (drag.to < drag.from && index >= drag.to && index < drag.from) return step;
    return 0;
  };

  const finish = (commit: boolean) => {
    const current = dragRef.current;
    if (!current) return;
    pointer.current.cleanup();
    // Remember where every row is drawn now; the layout effect settles each one from here
    const drawn = new Map<string, number>();
    for (const [key, el] of rowRefs.current) drawn.set(key, el.getBoundingClientRect().top);
    // The lifted row keeps its transform until the layout effect pins it in the new order, so it is never painted back in its old slot
    flip.current = drawn;
    const moving = list[current.from];
    const label = moving === undefined ? "Item" : getItemLabel(moving);
    if (commit && moving !== undefined && current.to !== current.from) {
      const next = arrayMove(list, current.from, current.to);
      if (items === undefined) setInner(next);
      onReorder?.(next, { from: current.from, to: current.to, item: moving });
      announce(`${label} dropped at ${position(current.to)}.`);
    } else if (commit) {
      announce(`${label} dropped at ${position(current.from)}.`);
    } else {
      announce(`Reorder cancelled. ${label} returned to ${position(current.from)}.`);
    }
    if (current.mode === "keyboard") refocus.current = current.key;
    dragRef.current = null;
    setDrag(null);
  };

  // FLIP: each row starts where it was drawn and eases into its new home
  useIsoLayoutEffect(() => {
    const drawn = flip.current;
    if (!drawn) return;
    flip.current = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      for (const el of rowRefs.current.values()) el.style.transform = "";
    } else {
      // Every row is pinned first, even one that did not move, or dropping its shift would slide it from the wrong place
      const rows: HTMLElement[] = [];
      // Clear every leftover transform first (the lifted row still carries its drag offset), then measure the new order
      for (const el of rowRefs.current.values()) {
        el.style.transition = "none";
        el.style.transform = "";
      }
      for (const [key, el] of rowRefs.current) {
        const before = drawn.get(key);
        const delta = before === undefined ? 0 : before - el.getBoundingClientRect().top;
        el.style.transform = Math.abs(delta) < 0.5 ? "" : `translateY(${delta}px)`;
        rows.push(el);
      }
      void listRef.current?.offsetHeight;
      for (const el of rows) {
        el.style.transition = "";
        el.style.transform = "";
      }
    }
    if (refocus.current) {
      focusRefs.current.get(refocus.current)?.focus({ preventScroll: true });
      refocus.current = null;
    }
  });

  // A row that disappears mid-drag ends the drag
  React.useEffect(() => {
    if (drag && !keys.includes(drag.key)) finish(false);
  });

  React.useEffect(() => () => pointer.current.cleanup(), []);

  /* ------------------------------ Pointer ------------------------------ */

  const beginPointer = (key: string, index: number, startY: number) => {
    const row = rowRefs.current.get(key);
    if (!row) return;
    measure();
    const slot = slots.current[index];
    const box = listRef.current?.getBoundingClientRect();
    if (!slot || !box) return;
    pointer.current.grab = startY - (box.top + slot.top);
    pointer.current.scroller = scrollParent(listRef.current);
    const next: Drag = { key, from: index, to: index, mode: "pointer" };
    dragRef.current = next;
    setDrag(next);
    announce(`Picked up ${getItemLabel(list[index] as T)}, ${position(index)}.`);
    document.documentElement.style.cursor = "grabbing";
    document.documentElement.style.userSelect = "none";
    const tick = () => {
      frame();
      pointer.current.frame = requestAnimationFrame(tick);
    };
    pointer.current.frame = requestAnimationFrame(tick);
  };

  // One frame of a pointer drag: follow the finger, pick the new slot, scroll near the edges
  const frame = () => {
    const current = dragRef.current;
    const box = listRef.current?.getBoundingClientRect();
    const slot = current ? slots.current[current.from] : undefined;
    const row = current ? rowRefs.current.get(current.key) : undefined;
    if (!current || !box || !slot || !row) return;
    const last = slots.current[slots.current.length - 1];
    const bottom = last ? last.top + last.height : slot.top + slot.height;
    const y = pointer.current.y - box.top - pointer.current.grab - slot.top;
    const offset = Math.min(Math.max(y, -slot.top), bottom - slot.height - slot.top);
    row.style.transform = `translateY(${offset}px)`;

    const center = slot.top + offset + slot.height / 2;
    let to = 0;
    slots.current.forEach((other, index) => {
      if (index !== current.from && other.top + other.height / 2 < center) to++;
    });
    if (to !== current.to) {
      const next = { ...current, to };
      dragRef.current = next;
      setDrag(next);
    }

    const scroller = pointer.current.scroller;
    const top = scroller ? scroller.getBoundingClientRect().top : 0;
    const height = scroller ? scroller.clientHeight : window.innerHeight;
    const fromTop = pointer.current.y - top;
    const fromBottom = top + height - pointer.current.y;
    let speed = 0;
    if (fromTop < EDGE) speed = -((EDGE - Math.max(0, fromTop)) / EDGE) * 16;
    else if (fromBottom < EDGE) speed = ((EDGE - Math.max(0, fromBottom)) / EDGE) * 16;
    if (speed) (scroller ?? window).scrollBy(0, speed);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>, key: string, index: number) => {
    if (disabled || dragRef.current || event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (!handle && target !== event.currentTarget && target.closest(INTERACTIVE)) return;
    const touch = event.pointerType === "touch";
    const startX = event.clientX;
    const startY = event.clientY;
    pointer.current.y = startY;
    let armed = true;
    let started = false;
    let timer = 0;

    const start = () => {
      if (!armed || started) return;
      started = true;
      if (touch) navigator.vibrate?.(8);
      beginPointer(key, index, startY);
    };
    const onMove = (e: PointerEvent) => {
      pointer.current.y = e.clientY;
      if (started) return;
      const moved = Math.hypot(e.clientX - startX, e.clientY - startY);
      // A finger that moves before the long press is scrolling, so the drag never starts
      if (touch && !handle) {
        if (moved > LONG_PRESS_SLOP) cleanup();
      } else if (moved > DRAG_THRESHOLD) start();
    };
    const onUp = () => {
      if (started) {
        // The click that follows a drag must not reach the row's own handlers
        window.addEventListener("click", swallow, { capture: true, once: true });
        setTimeout(() => window.removeEventListener("click", swallow, { capture: true }), 0);
        finish(true);
      } else cleanup();
    };
    const onCancel = () => (started ? finish(false) : cleanup());
    const onTouchMove = (e: TouchEvent) => {
      if (started) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && started) {
        e.preventDefault();
        finish(false);
      }
    };
    const swallow = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };
    const cleanup = () => {
      armed = false;
      window.clearTimeout(timer);
      cancelAnimationFrame(pointer.current.frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.cursor = "";
      document.documentElement.style.userSelect = "";
    };
    pointer.current.cleanup = cleanup;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    if (touch && !handle) timer = window.setTimeout(start, LONG_PRESS);
  };

  /* ----------------------------- Keyboard ----------------------------- */

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>, key: string, index: number) => {
    if (disabled || event.target !== event.currentTarget) return;
    const current = dragRef.current;
    const label = getItemLabel(list[index] as T);
    if (!current) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        measure();
        const next: Drag = { key, from: index, to: index, mode: "keyboard" };
        dragRef.current = next;
        setDrag(next);
        announce(`Picked up ${label}, ${position(index)}. Use the arrow keys to move, Space to drop, Escape to cancel.`);
      }
      return;
    }
    if (current.mode !== "keyboard" || current.key !== key) return;
    let to = current.to;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") to = Math.max(0, to - 1);
    else if (event.key === "ArrowDown" || event.key === "ArrowRight") to = Math.min(count - 1, to + 1);
    else if (event.key === "Home") to = 0;
    else if (event.key === "End") to = count - 1;
    else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      finish(true);
      return;
    } else if (event.key === "Escape") {
      event.preventDefault();
      finish(false);
      return;
    } else if (event.key === "Tab") {
      finish(false);
      return;
    } else return;
    event.preventDefault();
    if (to === current.to) return;
    const next = { ...current, to };
    dragRef.current = next;
    setDrag(next);
    announce(`${label} moved to ${position(to)}.`);
  };

  // Keep the lifted row in view as the keyboard carries it
  React.useEffect(() => {
    if (drag?.mode !== "keyboard") return;
    const row = rowRefs.current.get(drag.key);
    const timer = window.setTimeout(() => row?.scrollIntoView({ block: "nearest" }), 180);
    return () => window.clearTimeout(timer);
  }, [drag]);

  return (
    <div data-slot="list-sortable" className={cn("w-full", className)}>
      <ul
        ref={listRef}
        aria-label={ariaLabel}
        data-dragging={drag ? true : undefined}
        className="relative flex flex-col gap-1.5"
      >
        {list.map((item, index) => {
          const key = keys[index] ?? String(index);
          const lifted = drag?.key === key;
          const pointerLift = lifted && drag?.mode === "pointer";
          const label = getItemLabel(item);
          const transform = lifted
            ? drag?.mode === "keyboard"
              ? `translateY(${landingOffset(drag.from, drag.to)}px)`
              : undefined
            : drag
              ? `translateY(${shiftFor(index)}px)`
              : undefined;
          const focusProps = {
            tabIndex: disabled ? -1 : 0,
            "aria-roledescription": "sortable item",
            "aria-describedby": instructionsId,
            onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => onKeyDown(event, key, index),
            onBlur: () => {
              const current = dragRef.current;
              if (current?.mode === "keyboard" && current.key === key) finish(false);
            },
          };
          const gripIcon = <GripVertical aria-hidden="true" className="size-4 shrink-0" />;
          return (
            <li
              key={key}
              ref={(node) => {
                if (node) rowRefs.current.set(key, node);
                else rowRefs.current.delete(key);
                if (!handle) {
                  if (node) focusRefs.current.set(key, node);
                  else focusRefs.current.delete(key);
                }
              }}
              data-lifted={lifted || undefined}
              data-disabled={disabled || undefined}
              {...(handle ? {} : focusProps)}
              onPointerDown={handle ? undefined : (event) => onPointerDown(event, key, index)}
              onContextMenu={(event) => {
                if (dragRef.current) event.preventDefault();
              }}
              className={cn(
                "relative flex items-center rounded-lg text-foreground outline-none [-webkit-touch-callout:none]",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "[transition-property:transform,scale,box-shadow,background-color,border-color] duration-[380ms] motion-reduce:transition-none",
                toneStyles[tone],
                sizeStyles[size],
                !handle && !disabled && "cursor-grab select-none active:cursor-grabbing",
                lifted && "z-20 scale-[1.02] border-border bg-background shadow-lg shadow-foreground/10",
                pointerLift && "[transition-property:scale,box-shadow,background-color,border-color]",
                disabled && "opacity-50",
                itemClassName,
              )}
              style={{ transform, transitionTimingFunction: MOVE_EASE }}
            >
              {handle ? (
                <button
                  type="button"
                  ref={(node) => {
                    if (node) focusRefs.current.set(key, node);
                    else focusRefs.current.delete(key);
                  }}
                  aria-label={`Reorder ${label}`}
                  disabled={disabled}
                  {...focusProps}
                  onPointerDown={(event) => onPointerDown(event, key, index)}
                  className="-ml-1 flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing disabled:cursor-default"
                >
                  {gripIcon}
                </button>
              ) : (
                grip && <span className="-ml-0.5 text-muted-foreground">{gripIcon}</span>
              )}
              {renderItem ? renderItem(item, { index, dragging: lifted }) : <span className="min-w-0 flex-1 truncate">{label}</span>}
            </li>
          );
        })}
      </ul>
      <p id={instructionsId} className="sr-only">
        Press Space or Enter to pick up a row. Use the arrow keys to move it, Space or Enter to drop it, and Escape to cancel.
      </p>
      <p aria-live="assertive" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
