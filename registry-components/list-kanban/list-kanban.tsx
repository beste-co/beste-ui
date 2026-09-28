"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of the columns and cards. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Column width, card padding and type. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

const toneStyles: Record<Tone, { column: string; card: string }> = {
  muted: { column: "rounded-(--kanban-r) bg-muted/70", card: "border border-transparent bg-background shadow-sm shadow-foreground/5" },
  outline: { column: "rounded-[calc(var(--kanban-r)_+_1px)] border border-border bg-background", card: "border border-border bg-background" },
  ghost: { column: "rounded-(--kanban-r) bg-transparent", card: "border border-transparent bg-muted" },
};

// Concentric corners: the card's 8px plus the column's inset (the list's py-1 is taken off the bottom padding so all sides match)
const sizeStyles: Record<Size, { column: string; card: string; header: string }> = {
  sm: { column: "min-w-52 gap-2 p-2 pb-1 [--kanban-r:16px]", card: "p-2.5 text-sm", header: "px-1 text-sm" },
  default: { column: "min-w-56 gap-2.5 p-2.5 pb-1.5 [--kanban-r:18px]", card: "p-3 text-sm", header: "px-1 text-sm" },
  lg: { column: "min-w-64 gap-3 p-3 pb-2 [--kanban-r:20px]", card: "p-3.5 text-base", header: "px-1.5 text-base" },
};

/** Cards making room use a soft ease-out: a spring's overshoot on several cards at once reads as shaking. */
const MAKE_ROOM_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Pixels the pointer must travel past a boundary before the landing spot changes, so it never flickers on an edge. */
const HYSTERESIS = 10;

/** The inspector family's spring, so cards make room without an animation library. */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

/** Pixels a mouse moves before a press becomes a drag. */
const DRAG_THRESHOLD = 4;
/** How long a finger rests on a card before it lifts, and how far it may wander meanwhile. */
const LONG_PRESS = 260;
const LONG_PRESS_SLOP = 8;
/** Distance from a scroll edge where the board or a column starts scrolling on its own. */
const EDGE = 48;
const MAX_SPEED = 14;

const INTERACTIVE = "input, textarea, select, button, a[href], [contenteditable=''], [contenteditable='true'], [data-no-drag]";

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export interface KanbanColumn<T> {
  id: string;
  title: string;
  /** A dot beside the title, any CSS color. */
  color?: string;
  /** Work-in-progress limit; the header tints once the column holds more. */
  limit?: number;
  cards: T[];
}

export interface KanbanPosition {
  column: string;
  index: number;
}

export interface KanbanMove<T> {
  card: T;
  from: KanbanPosition;
  to: KanbanPosition;
}

export interface KanbanCardState {
  column: string;
  index: number;
  /** This card is lifted, by pointer or keyboard. */
  dragging: boolean;
}

export interface ListKanbanProps<T> {
  /** The columns and their cards. Pair with `onChange` to control them. */
  columns?: KanbanColumn<T>[];
  /** The starting board when uncontrolled. */
  defaultColumns?: KanbanColumn<T>[];
  /** Called with the new board when a card lands somewhere new. */
  onChange?: (columns: KanbanColumn<T>[], move: KanbanMove<T>) => void;
  /** A stable key per card, unique across the board. Defaults to `card.id`. */
  getKey?: (card: T) => string;
  /** What screen readers call a card. Defaults to `label`, `title` or `name`. */
  getCardLabel?: (card: T) => string;
  /** The card's content. The surface is drawn around it. */
  renderCard?: (card: T, state: KanbanCardState) => React.ReactNode;
  /**
   * Tallest a column's card list grows before it scrolls, any CSS length.
   * @defaultValue "28rem" */
  maxHeight?: string;
  /** @defaultValue "muted" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  disabled?: boolean;
  /** @defaultValue "Board" */
  "aria-label"?: string;
  className?: string;
  columnClassName?: string;
  cardClassName?: string;
}

interface Gig {
  id: string;
  city: string;
  venue: string;
  date: string;
  note?: string;
}

const tourBoard: KanbanColumn<Gig>[] = [
  {
    id: "ideas",
    title: "Ideas",
    color: "#a1a1aa",
    cards: [
      { id: "g1", city: "Lisbon", venue: "Coliseu dos Recreios", date: "Nov 2", note: "Ask Arooj Aftab to open" },
      { id: "g2", city: "Oslo", venue: "Sentralen", date: "Nov 9" },
      { id: "g3", city: "Kyoto", venue: "Taku Taku", date: "Dec 1", note: "Acoustic set only" },
    ],
  },
  {
    id: "booked",
    title: "Booked",
    color: "#3b82f6",
    cards: [
      { id: "g4", city: "Reykjavík", venue: "Harpa", date: "Oct 12", note: "Support: Ólafur Arnalds" },
      { id: "g5", city: "Berlin", venue: "Funkhaus", date: "Oct 18" },
    ],
  },
  {
    id: "road",
    title: "On the road",
    color: "#f59e0b",
    limit: 3,
    cards: [
      { id: "g6", city: "London", venue: "Barbican", date: "Oct 3", note: "Strings with Hania Rani" },
      { id: "g7", city: "Paris", venue: "La Cigale", date: "Oct 5" },
      { id: "g8", city: "Brussels", venue: "Ancienne Belgique", date: "Oct 7" },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "#10b981",
    cards: [{ id: "g9", city: "Glasgow", venue: "Barrowland", date: "Sep 28", note: "Sold out, record the encore" }],
  },
];

export const listKanbanDemo: ListKanbanProps<Gig> = {
  defaultColumns: tourBoard,
  "aria-label": "Autumn tour",
  getCardLabel: (gig) => `${gig.city}, ${gig.venue}`,
  renderCard: (gig) => (
    <span className="flex min-w-0 flex-col gap-1">
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate font-medium text-foreground">{gig.city}</span>
        <span className="shrink-0 text-muted-foreground tabular-nums">{gig.date}</span>
      </span>
      <span className="truncate text-muted-foreground">{gig.venue}</span>
      {gig.note && <span className="mt-1 truncate rounded-md bg-muted px-2 py-1 text-muted-foreground">{gig.note}</span>}
    </span>
  ),
  // Pinned to the top of the stage: a column growing mid-drag must not re-center the whole board
  className: "w-full max-w-5xl self-start",
};

function defaultKey<T>(card: T) {
  const id = (card as { id?: unknown } | null)?.id;
  return id === undefined || id === null ? String(card) : String(id);
}

function defaultLabel<T>(card: T) {
  if (typeof card === "string" || typeof card === "number") return String(card);
  const record = card as { label?: unknown; title?: unknown; name?: unknown } | null;
  const text = record?.label ?? record?.title ?? record?.name;
  return typeof text === "string" ? text : "Card";
}

/** Returns a copy of the board with one card moved; `to.index` counts the target column without the card. */
export function moveCard<T>(columns: KanbanColumn<T>[], from: KanbanPosition, to: KanbanPosition): KanbanColumn<T>[] {
  const source = columns.find((column) => column.id === from.column);
  const card = source?.cards[from.index];
  if (!source || card === undefined) return columns;
  const next = columns.map((column) => ({ ...column, cards: column.cards.slice() }));
  next.find((column) => column.id === from.column)?.cards.splice(from.index, 1);
  const target = next.find((column) => column.id === to.column);
  target?.cards.splice(Math.min(Math.max(0, to.index), target.cards.length), 0, card);
  return next;
}

interface Drag {
  key: string;
  fromCol: number;
  fromIndex: number;
  toCol: number;
  toIndex: number;
  mode: "pointer" | "keyboard";
}

interface Placed {
  x: number;
  y: number;
  col: string;
  scroll: number;
}

/**
 * A kanban board: cards dragged within and between columns, or carried from the keyboard.
 * The card lifts into a floating ghost, the target column lights up, the others make room on a spring.
 */
export function ListKanban<T>({
  columns,
  defaultColumns,
  onChange,
  getKey = defaultKey,
  getCardLabel = defaultLabel,
  renderCard,
  maxHeight = "28rem",
  tone = "muted",
  size = "default",
  disabled = false,
  "aria-label": ariaLabel = "Board",
  className,
  columnClassName,
  cardClassName,
}: ListKanbanProps<T>) {
  const [inner, setInner] = React.useState<KanbanColumn<T>[]>(() => defaultColumns ?? []);
  const board = columns ?? inner;
  const instructionsId = React.useId();

  const [drag, setDrag] = React.useState<Drag | null>(null);
  const [ghost, setGhost] = React.useState<{ card: T; width: number; x: number; y: number; col: string } | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const dragRef = React.useRef<Drag | null>(null);
  dragRef.current = drag;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const ghostRef = React.useRef<HTMLDivElement>(null);
  const columnRefs = React.useRef<(HTMLElement | null)[]>([]);
  const listRefs = React.useRef<(HTMLUListElement | null)[]>([]);
  const cardRefs = React.useRef(new Map<string, HTMLLIElement>());
  const placed = React.useRef(new Map<string, Placed>());
  const dropFrom = React.useRef<{ key: string; left: number; top: number } | null>(null);
  const refocus = React.useRef<string | null>(null);
  const pointer = React.useRef({
    x: 0,
    y: 0,
    grabX: 0,
    grabY: 0,
    height: 0,
    frame: 0,
    centers: [] as number[][],
    cleanup: () => {},
  });

  // While a card is lifted, the board shows it where it would land
  const display = React.useMemo(() => {
    if (!drag) return board;
    const from = board[drag.fromCol];
    const to = board[drag.toCol];
    if (!from || !to) return board;
    return moveCard(board, { column: from.id, index: drag.fromIndex }, { column: to.id, index: drag.toIndex });
  }, [board, drag]);

  const announce = (text: string) => setAnnouncement(text);
  const where = (col: number, index: number, cols = display) => {
    const column = cols[col];
    return `${column?.title ?? "Column"}, position ${index + 1} of ${column?.cards.length ?? 0}`;
  };

  const finish = (commit: boolean) => {
    const current = dragRef.current;
    if (!current) return;
    pointer.current.cleanup();
    const ghostBox = ghostRef.current?.getBoundingClientRect();
    if (ghostBox && current.mode === "pointer") dropFrom.current = { key: current.key, left: ghostBox.left, top: ghostBox.top };
    const fromColumn = board[current.fromCol];
    const toColumn = board[current.toCol];
    const card = fromColumn?.cards[current.fromIndex];
    const label = card === undefined ? "Card" : getCardLabel(card);
    const moved = current.fromCol !== current.toCol || current.fromIndex !== current.toIndex;
    if (commit && card !== undefined && fromColumn && toColumn && moved) {
      const from = { column: fromColumn.id, index: current.fromIndex };
      const to = { column: toColumn.id, index: current.toIndex };
      const next = moveCard(board, from, to);
      if (columns === undefined) setInner(next);
      onChange?.(next, { card, from, to });
      announce(`Moved ${label} to ${where(current.toCol, current.toIndex, next)}.`);
    } else if (commit) {
      announce(`${label} dropped at ${where(current.fromCol, current.fromIndex, board)}.`);
    } else {
      announce(`Move cancelled. ${label} returned to ${where(current.fromCol, current.fromIndex, board)}.`);
    }
    if (current.mode === "keyboard") refocus.current = current.key;
    dragRef.current = null;
    setDrag(null);
    setGhost(null);
  };

  // FLIP: each card starts where it was drawn and springs to its new place, even mid-flight
  useIsoLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const box = track.getBoundingClientRect();
    const next = new Map<string, Placed>();
    const moving: HTMLElement[] = [];
    const drop = dropFrom.current;
    dropFrom.current = null;
    display.forEach((column, c) => {
      const list = listRefs.current[c];
      if (!list) return;
      for (const card of column.cards) {
        const key = getKey(card);
        const el = cardRefs.current.get(key);
        if (!el) continue;
        const pos: Placed = { x: list.offsetLeft + el.offsetLeft, y: list.offsetTop + el.offsetTop, col: column.id, scroll: list.scrollTop };
        next.set(key, pos);
        if (reduce) continue;
        const rect = el.getBoundingClientRect();
        let dx = 0;
        let dy = 0;
        if (drop?.key === key) {
          el.style.transform = "";
          const home = el.getBoundingClientRect();
          dx = drop.left - home.left;
          dy = drop.top - home.top;
        } else {
          const before = placed.current.get(key);
          if (!before) continue;
          // Whatever is still in flight counts, so an interrupted move continues from where it is seen
          const flightX = rect.left - (box.left + pos.x);
          const flightY = rect.top - (box.top + pos.y - pos.scroll);
          dx = before.x - pos.x + flightX;
          dy = (before.col === pos.col ? before.y - pos.y : before.y - before.scroll - (pos.y - pos.scroll)) + flightY;
        }
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
        el.style.transition = "none";
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        moving.push(el);
      }
    });
    placed.current = next;
    if (moving.length > 0) {
      void track.offsetHeight;
      for (const el of moving) {
        el.style.transition = `transform 380ms ${MAKE_ROOM_EASE}`;
        el.style.transform = "";
      }
    }
    if (refocus.current) {
      cardRefs.current.get(refocus.current)?.focus({ preventScroll: true });
      if (!dragRef.current) refocus.current = null;
    }
  });

  // A card that disappears mid-drag ends the drag
  React.useEffect(() => {
    if (drag && !display.some((column) => column.cards.some((card) => getKey(card) === drag.key))) finish(false);
  });

  React.useEffect(() => () => pointer.current.cleanup(), []);

  /* ------------------------------ Pointer ------------------------------ */

  const beginPointer = (key: string, col: number, index: number) => {
    const el = cardRefs.current.get(key);
    const root = rootRef.current;
    const card = board[col]?.cards[index];
    if (!el || !root || card === undefined) return;
    const rect = el.getBoundingClientRect();
    const rootBox = root.getBoundingClientRect();
    const p = pointer.current;
    p.grabX = p.x - rect.left;
    p.grabY = p.y - rect.top;
    p.height = rect.height;
    // Card centers per column as they sit without the lifted card, in each list's scroll space
    p.centers = board.map((column, c) => {
      const list = listRefs.current[c];
      const gap = list ? Number.parseFloat(getComputedStyle(list).rowGap) || 0 : 0;
      const centers: number[] = [];
      column.cards.forEach((other, i) => {
        if (c === col && i === index) return;
        const node = cardRefs.current.get(getKey(other));
        if (!node) return;
        let center = node.offsetTop + node.offsetHeight / 2;
        if (c === col && i > index) center -= rect.height + gap;
        centers.push(center);
      });
      return centers;
    });
    const next: Drag = { key, fromCol: col, fromIndex: index, toCol: col, toIndex: index, mode: "pointer" };
    dragRef.current = next;
    setDrag(next);
    setGhost({ card, width: rect.width, x: rect.left - rootBox.left, y: rect.top - rootBox.top, col: board[col]?.id ?? "" });
    announce(`Picked up ${getCardLabel(card)}, ${where(col, index, board)}.`);
    document.documentElement.style.cursor = "grabbing";
    document.documentElement.style.userSelect = "none";
    const tick = () => {
      frame();
      p.frame = requestAnimationFrame(tick);
    };
    p.frame = requestAnimationFrame(tick);
  };

  // One frame of a pointer drag: move the ghost, pick the landing spot, scroll near the edges
  const frame = () => {
    const current = dragRef.current;
    const root = rootRef.current;
    const p = pointer.current;
    if (!current || !root) return;
    const rootBox = root.getBoundingClientRect();
    if (ghostRef.current) {
      ghostRef.current.style.transform = `translate(${p.x - rootBox.left - p.grabX}px, ${p.y - rootBox.top - p.grabY}px)`;
    }

    let col = current.toCol;
    let best = Number.POSITIVE_INFINITY;
    let currentDistance = Number.POSITIVE_INFINITY;
    columnRefs.current.forEach((node, c) => {
      if (!node) return;
      const r = node.getBoundingClientRect();
      const distance = p.x < r.left ? r.left - p.x : p.x > r.right ? p.x - r.right : 0;
      if (c === current.toCol) currentDistance = distance;
      if (distance < best) {
        best = distance;
        col = c;
      }
    });
    // The current column holds until the pointer is clearly in another one
    if (currentDistance <= HYSTERESIS && best > 0) col = current.toCol;
    const list = listRefs.current[col];
    let to = current.toIndex;
    if (list) {
      const r = list.getBoundingClientRect();
      const y = p.y - p.grabY + p.height / 2 - r.top + list.scrollTop;
      const centers = p.centers[col] ?? [];
      to = centers.filter((center) => center < y).length;
      // Within the same column, a boundary has to be crossed by a margin before the spot moves
      if (col === current.toCol) {
        const low = centers.filter((center) => center < y - HYSTERESIS).length;
        const high = centers.filter((center) => center < y + HYSTERESIS).length;
        if (current.toIndex >= low && current.toIndex <= high) to = current.toIndex;
      }
    }
    if (col !== current.toCol || to !== current.toIndex) {
      const next = { ...current, toCol: col, toIndex: to };
      dragRef.current = next;
      setDrag(next);
    }

    const speedFor = (near: number) => (near < EDGE ? ((EDGE - Math.max(0, near)) / EDGE) * MAX_SPEED : 0);
    const scroller = scrollerRef.current;
    if (scroller) {
      const r = scroller.getBoundingClientRect();
      const dx = speedFor(r.right - p.x) - speedFor(p.x - r.left);
      if (dx) scroller.scrollLeft += dx;
    }
    if (list && list.scrollHeight > list.clientHeight) {
      const r = list.getBoundingClientRect();
      if (p.x >= r.left && p.x <= r.right) {
        const dy = speedFor(r.bottom - p.y) - speedFor(p.y - r.top);
        if (dy) list.scrollTop += dy;
      }
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>, key: string, col: number, index: number) => {
    if (disabled || dragRef.current || event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target !== event.currentTarget && target.closest(INTERACTIVE)) return;
    const touch = event.pointerType === "touch";
    const startX = event.clientX;
    const startY = event.clientY;
    pointer.current.x = startX;
    pointer.current.y = startY;
    let armed = true;
    let started = false;
    let timer = 0;

    const start = () => {
      if (!armed || started) return;
      started = true;
      if (touch) navigator.vibrate?.(8);
      beginPointer(key, col, index);
    };
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      if (started) return;
      const moved = Math.hypot(e.clientX - startX, e.clientY - startY);
      // A finger that moves before the long press is scrolling, so the drag never starts
      if (touch) {
        if (moved > LONG_PRESS_SLOP) cleanup();
      } else if (moved > DRAG_THRESHOLD) start();
    };
    const onUp = () => {
      if (started) {
        // The click that follows a drag must not reach the card's own handlers
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
    if (touch) timer = window.setTimeout(start, LONG_PRESS);
  };

  /* ----------------------------- Keyboard ----------------------------- */

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>, key: string, col: number, index: number) => {
    if (disabled || event.target !== event.currentTarget) return;
    const current = dragRef.current;
    if (!current) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        const card = board[col]?.cards[index];
        if (card === undefined) return;
        const next: Drag = { key, fromCol: col, fromIndex: index, toCol: col, toIndex: index, mode: "keyboard" };
        dragRef.current = next;
        setDrag(next);
        refocus.current = key;
        announce(`Picked up ${getCardLabel(card)}, ${where(col, index, board)}. Arrow keys move it within and between columns, Space drops it, Escape cancels.`);
      }
      return;
    }
    if (current.mode !== "keyboard" || current.key !== key) return;
    // Room in a column once the lifted card has left it
    const room = (c: number) => (board[c]?.cards.length ?? 0) - (c === current.fromCol ? 1 : 0);
    let { toCol, toIndex } = current;
    if (event.key === "ArrowUp") toIndex = Math.max(0, toIndex - 1);
    else if (event.key === "ArrowDown") toIndex = Math.min(room(toCol), toIndex + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      toCol = Math.min(board.length - 1, Math.max(0, toCol + (event.key === "ArrowLeft" ? -1 : 1)));
      toIndex = Math.min(toIndex, room(toCol));
    } else if (event.key === "Home") toIndex = 0;
    else if (event.key === "End") toIndex = room(toCol);
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
    if (toCol === current.toCol && toIndex === current.toIndex) return;
    const next = { ...current, toCol, toIndex };
    dragRef.current = next;
    setDrag(next);
    refocus.current = key;
    const card = board[current.fromCol]?.cards[current.fromIndex];
    const preview = moveCard(
      board,
      { column: board[current.fromCol]?.id ?? "", index: current.fromIndex },
      { column: board[toCol]?.id ?? "", index: toIndex },
    );
    announce(`${card === undefined ? "Card" : getCardLabel(card)}, ${where(toCol, toIndex, preview)}.`);
  };

  // Keep the carried card in view
  React.useEffect(() => {
    if (drag?.mode !== "keyboard") return;
    const el = cardRefs.current.get(drag.key);
    const timer = window.setTimeout(() => el?.scrollIntoView({ block: "nearest", inline: "nearest" }), 180);
    return () => window.clearTimeout(timer);
  }, [drag]);

  const t = toneStyles[tone];
  const s = sizeStyles[size];

  return (
    <div ref={rootRef} data-slot="list-kanban" className={cn("relative w-full", disabled && "opacity-50", className)}>
      <div ref={scrollerRef} className="w-full overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:thin]">
        <div ref={trackRef} role="group" aria-label={ariaLabel} className="relative flex w-full min-w-max items-start gap-3">
          {display.map((column, c) => {
            const over = drag?.mode === "pointer" && drag.toCol === c;
            const count = column.cards.length;
            const exceeded = column.limit !== undefined && count > column.limit;
            return (
              <section
                key={column.id}
                ref={(node) => {
                  columnRefs.current[c] = node;
                }}
                aria-labelledby={`${instructionsId}-${column.id}`}
                data-over={over || undefined}
                className={cn(
                  "flex flex-1 basis-0 flex-col transition-[background-color,box-shadow] duration-300",
                  t.column,
                  s.column,
                  columnClassName,
                )}
              >
                <header
                  data-exceeded={exceeded || undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-lg py-1 transition-colors duration-300 select-none data-[exceeded=true]:bg-destructive/10 data-[exceeded=true]:text-destructive",
                    s.header,
                  )}
                >
                  {column.color && <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: column.color }} />}
                  <h3 id={`${instructionsId}-${column.id}`} className="min-w-0 flex-1 truncate font-medium">
                    {column.title}
                  </h3>
                  <span className={cn("shrink-0 tabular-nums", exceeded ? "text-destructive" : "text-muted-foreground")}>
                    {column.limit !== undefined ? `${count} / ${column.limit}` : count}
                    {exceeded && <span className="sr-only">, over the limit</span>}
                  </span>
                </header>
                <ul
                  ref={(node) => {
                    listRefs.current[c] = node;
                  }}
                  aria-labelledby={`${instructionsId}-${column.id}`}
                  className="relative -mx-1 flex min-h-16 flex-col gap-2 overflow-y-auto overscroll-y-contain px-1 py-1 [scrollbar-gutter:stable] [scrollbar-width:thin]"
                  style={{ maxHeight }}
                >
                  {column.cards.map((card, index) => {
                    const key = getKey(card);
                    const lifted = drag?.key === key;
                    const placeholder = lifted && drag?.mode === "pointer";
                    const keyboardLift = lifted && drag?.mode === "keyboard";
                    return (
                      <li
                        key={key}
                        ref={(node) => {
                          if (node) cardRefs.current.set(key, node);
                          else cardRefs.current.delete(key);
                        }}
                        tabIndex={disabled ? -1 : 0}
                        aria-roledescription="draggable card"
                        aria-describedby={instructionsId}
                        data-lifted={keyboardLift || undefined}
                        data-placeholder={placeholder || undefined}
                        onPointerDown={(event) => onPointerDown(event, key, c, index)}
                        onKeyDown={(event) => onKeyDown(event, key, c, index)}
                        onContextMenu={(event) => {
                          if (dragRef.current) event.preventDefault();
                        }}
                        className={cn(
                          "relative rounded-lg text-foreground outline-none [-webkit-touch-callout:none]",
                          "[transition-property:scale,box-shadow,background-color,border-color] duration-300 motion-reduce:transition-none",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          !disabled && "cursor-grab select-none active:cursor-grabbing",
                          t.card,
                          s.card,
                          keyboardLift && "z-10 scale-[1.03] shadow-lg shadow-foreground/10 ring-2 ring-ring",
                          placeholder && "border-dashed border-foreground/20 bg-foreground/[0.03] shadow-none",
                          cardClassName,
                        )}
                        style={{ transitionTimingFunction: SPRING_EASE }}
                      >
                        <div className={cn(placeholder && "invisible")}>
                          {renderCard ? renderCard(card, { column: column.id, index, dragging: lifted }) : <span className="truncate">{getCardLabel(card)}</span>}
                        </div>
                      </li>
                    );
                  })}
                  {count === 0 && (
                    <li aria-hidden="true" className="grid min-h-14 place-items-center rounded-lg border border-dashed border-foreground/15 text-sm text-muted-foreground select-none">
                      Drop here
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      {ghost && (
        <div
          ref={ghostRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-50"
          style={{ width: ghost.width, transform: `translate(${ghost.x}px, ${ghost.y}px)` }}
        >
          <div
            className={cn(
              "rotate-[1.5deg] scale-[1.03] rounded-lg text-foreground shadow-xl shadow-foreground/15 transition-[rotate,scale,box-shadow] duration-300 motion-safe:starting:rotate-0 motion-safe:starting:scale-100",
              t.card,
              s.card,
              "border-border bg-background",
              cardClassName,
            )}
            style={{ transitionTimingFunction: SPRING_EASE }}
          >
            {renderCard ? renderCard(ghost.card, { column: ghost.col, index: -1, dragging: true }) : <span className="truncate">{getCardLabel(ghost.card)}</span>}
          </div>
        </div>
      )}

      <p id={instructionsId} className="sr-only">
        Press Space or Enter to pick up a card. Use the up and down arrows to move it within a column, left and right to move it between columns, Space or Enter to drop it, and Escape to cancel.
      </p>
      <p aria-live="assertive" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
