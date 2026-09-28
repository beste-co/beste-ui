"use client";

import { cn } from "@/lib/utils";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

export interface SplitFlapProps {
  /** Phrases the board flips through, wrapped into rows automatically */
  phrases: string[];
  /** Characters per row */
  columns?: number;
  /** Most rows a phrase may take */
  rows?: number;
  /** Milliseconds each phrase stays on the board */
  interval?: number;
  /** Most random glyphs a cell shows before it settles */
  flips?: number;
  /** How far the flips ripple across the board, 0 (all at once) to 1 (a slow wave) */
  stagger?: number;
  /** Show phrases in capitals, the way departure boards set them */
  uppercase?: boolean;
  /** Color of the flaps */
  flapColor?: string;
  /** Color of the characters */
  inkColor?: string;
  /** Color of the hairline split across each flap */
  splitColor?: string;
  /** Freeze the board on its current phrase */
  paused?: boolean;
  className?: string;
}

export const splitFlapDemo: SplitFlapProps = {
  phrases: ["Sleep in Paris, wake in Vienna", "Lisbon to Madrid, 22:05", "Eleven cities, one berth"],
  columns: 15,
  interval: 5200,
  className: "rounded-2xl bg-[#121211] p-6",
};

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const FLIP_MS = 110;

function wrap(text: string, columns: number) {
  const rows: string[] = [];
  let line = "";
  for (const raw of text.split(/\s+/)) {
    const word = raw.slice(0, columns);
    if (!word) continue;
    if (!line) line = word;
    else if (line.length + 1 + word.length <= columns) line += ` ${word}`;
    else {
      rows.push(line);
      line = word;
    }
  }
  if (line) rows.push(line);
  return rows;
}

interface Cell {
  flapTop: HTMLElement;
  flapBottom: HTMLElement;
  topText: HTMLElement;
  bottomText: HTMLElement;
  flapTopText: HTMLElement;
  flapBottomText: HTMLElement;
  current: string;
  next: string;
  queue: string[];
  step: number;
  startAt: number;
  flipStart: number;
  active: boolean;
}

const leaf = "absolute inset-x-0 h-1/2 overflow-hidden [backface-visibility:hidden]";
const glyph = "absolute inset-x-0 flex h-[200%] items-center justify-center";

function FlapCell({ top, bottom, split }: { top: CSSProperties; bottom: CSSProperties; split: string }) {
  return (
    <div data-cell="" className="relative h-[1.32em] w-[1em] shrink-0 [perspective:3em]">
      <div className={cn(leaf, "top-0 rounded-t-[0.09em]")} style={top}>
        <span className={cn(glyph, "top-0")} />
      </div>
      <div className={cn(leaf, "bottom-0 rounded-b-[0.09em]")} style={bottom}>
        <span className={cn(glyph, "bottom-0")} />
      </div>
      <div className={cn(leaf, "top-0 origin-bottom rounded-t-[0.09em]")} style={top}>
        <span className={cn(glyph, "top-0")} />
      </div>
      <div className={cn(leaf, "bottom-0 origin-top rounded-b-[0.09em]")} style={{ ...bottom, transform: "rotateX(90deg)" }}>
        <span className={cn(glyph, "bottom-0")} />
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-[0.035em] -translate-y-1/2" style={{ backgroundColor: split }} />
    </div>
  );
}

export function SplitFlap({
  phrases,
  columns = 15,
  rows: maxRows = 4,
  interval = 5200,
  flips = 5,
  stagger = 0.5,
  uppercase = true,
  flapColor = "#262624",
  inkColor = "#f3ede1",
  splitColor = "#0b0b0a",
  paused = false,
  className,
}: SplitFlapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [reduce, setReduce] = useState(false);
  const cols = Math.max(4, Math.min(24, Math.round(columns)));
  const layouts = useMemo(
    () => phrases.map((phrase) => wrap(uppercase ? phrase.toUpperCase() : phrase, cols).slice(0, Math.max(1, maxRows))),
    [phrases, cols, uppercase, maxRows],
  );
  const rowCount = Math.max(1, ...layouts.map((layout) => layout.length));
  const settings = useRef({ interval, flips, stagger, paused });
  settings.current = { interval, flips, stagger, paused };

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const board = ref.current;
    if (!board || layouts.length === 0) return;
    const nodes = board.querySelectorAll<HTMLElement>("[data-cell]");
    const cells: Cell[] = [];
    nodes.forEach((node) => {
      const [top, bottom, flapTop, flapBottom] = Array.from(node.children) as [HTMLElement, HTMLElement, HTMLElement, HTMLElement];
      const flapTopText = flapTop.firstElementChild as HTMLElement;
      cells.push({
        flapTop,
        flapBottom,
        topText: top.firstElementChild as HTMLElement,
        bottomText: bottom.firstElementChild as HTMLElement,
        flapTopText,
        flapBottomText: flapBottom.firstElementChild as HTMLElement,
        current: flapTopText.textContent || " ",
        next: " ",
        queue: [],
        step: 0,
        startAt: 0,
        flipStart: -1,
        active: false,
      });
    });

    const write = (el: HTMLElement, char: string) => {
      if (el.textContent !== char) el.textContent = char;
    };
    const settle = (cell: Cell, char: string) => {
      cell.current = char;
      write(cell.topText, char);
      write(cell.bottomText, char);
      write(cell.flapTopText, char);
      write(cell.flapBottomText, char);
      cell.flapTop.style.transform = "rotateX(0deg)";
      cell.flapBottom.style.transform = "rotateX(90deg)";
    };
    const target = (layout: string[] | undefined, index: number) => layout?.[Math.floor(index / cols)]?.[index % cols] ?? " ";

    if (reduce) {
      cells.forEach((cell, index) => settle(cell, target(layouts[0], index)));
      return;
    }

    let phrase = -1;
    let frame = 0;
    let running = false;
    let timer = 0;
    let visible = true;

    const show = (index: number) => {
      const layout = layouts[index];
      const now = performance.now();
      const s = settings.current;
      const most = Math.max(0, Math.round(s.flips));
      const spread = Math.max(0, Math.min(1, s.stagger)) * 2;
      cells.forEach((cell, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const next = target(layout, i);
        if (next === cell.current && !cell.active) return;
        cell.queue.length = 0;
        const blank = next === " " && cell.current === " ";
        const count = blank || most === 0 ? 0 : Math.min(most, 2) + Math.floor(Math.random() * Math.max(1, most - 1));
        for (let k = 0; k < count; k++) cell.queue.push(GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)));
        cell.queue.push(next);
        cell.step = 0;
        cell.startAt = now + (col * 42 + row * 120) * spread + Math.random() * 60;
        cell.active = true;
      });
    };

    const tick = (now: number) => {
      let busy = false;
      for (const cell of cells) {
        if (!cell.active) continue;
        busy = true;
        if (cell.flipStart < 0) {
          if (now < cell.startAt) continue;
          if (cell.step >= cell.queue.length) {
            cell.active = false;
            continue;
          }
          cell.next = cell.queue[cell.step++] ?? " ";
          write(cell.topText, cell.next);
          write(cell.flapBottomText, cell.next);
          cell.flipStart = now;
        }
        const p = Math.min(1, (now - cell.flipStart) / FLIP_MS);
        const q = p * p * (3 - 2 * p);
        if (q < 0.5) {
          cell.flapTop.style.transform = `rotateX(${-q * 180}deg)`;
        } else {
          cell.flapTop.style.transform = "rotateX(-90deg)";
          cell.flapBottom.style.transform = `rotateX(${(1 - q) * 180}deg)`;
        }
        if (p >= 1) {
          cell.current = cell.next;
          write(cell.flapTopText, cell.current);
          write(cell.bottomText, cell.current);
          cell.flapTop.style.transform = "rotateX(0deg)";
          cell.flapBottom.style.transform = "rotateX(90deg)";
          cell.flipStart = -1;
          if (cell.step >= cell.queue.length) cell.active = false;
        }
      }
      return busy;
    };

    const loop = (now: number) => {
      if (tick(now)) frame = requestAnimationFrame(loop);
      else running = false;
    };
    const kick = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const advance = () => {
      if (settings.current.paused) {
        timer = window.setTimeout(advance, 400);
        return;
      }
      phrase = (phrase + 1) % layouts.length;
      show(phrase);
      kick();
      if (layouts.length > 1) timer = window.setTimeout(advance, Math.max(1200, settings.current.interval));
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      running = false;
    };
    const resume = () => {
      stop();
      if (!visible || document.hidden) return;
      kick();
      timer = window.setTimeout(advance, phrase < 0 ? 300 : Math.max(1200, settings.current.interval));
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      resume();
    });
    io.observe(board);
    const onVisibility = () => resume();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [layouts, cols, reduce]);

  const divisor = cols + (cols - 1) * 0.09;
  const top: CSSProperties = { background: `linear-gradient(to bottom, ${flapColor}, color-mix(in oklab, ${flapColor} 78%, black))` };
  const bottom: CSSProperties = {
    background: `linear-gradient(to bottom, color-mix(in oklab, ${flapColor} 70%, black), color-mix(in oklab, ${flapColor} 58%, black))`,
  };

  return (
    <div className={cn("@container w-full", className)}>
      <span className="sr-only">{phrases[0]}</span>
      <div
        ref={ref}
        aria-hidden="true"
        style={{ fontSize: `min(${(100 / divisor).toFixed(3)}cqw, 6.5rem)`, color: inkColor }}
        className="flex select-none flex-col gap-[0.14em] font-sans font-medium tracking-normal"
      >
        {Array.from({ length: rowCount }, (_, row) => (
          <div key={row} className="flex gap-[0.09em]">
            {Array.from({ length: cols }, (_, col) => (
              <FlapCell key={col} top={top} bottom={bottom} split={splitColor} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
