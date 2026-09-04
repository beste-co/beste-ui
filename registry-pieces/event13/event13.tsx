"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface Event13Props {
  title?: string;
  start?: string;
  caption?: string;
  holdMs?: number;
  className?: string;
}

const LABELS = ["hours", "minutes", "seconds"];

export const event13Demo: Event13Props = {
  title: "Doors open in",
  start: "00:15:00",
  caption: "Early access closes when the clock hits zero.",
};

function parse(start: string): number {
  const [h = 0, m = 0, s = 0] = start.split(":").map((p) => Number(p) || 0);
  return Math.max(0, h * 3600 + m * 60 + s);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function Half({
  pos,
  digit,
  className,
  style,
}: {
  pos: "top" | "bottom";
  digit: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={cn(
        "absolute inset-x-0 h-5 overflow-hidden bg-card",
        pos === "top" ? "top-0 rounded-t-md" : "bottom-0 rounded-b-md",
        className
      )}
      style={style}
    >
      <span
        className={cn(
          "absolute inset-x-0 flex h-10 items-center justify-center text-2xl font-semibold tabular-nums",
          pos === "top" ? "top-0" : "bottom-0"
        )}
      >
        {digit}
      </span>
    </span>
  );
}

function Flap({ value }: { value: string }) {
  const [pair, setPair] = useState({ cur: value, prev: value });
  if (pair.cur !== value) setPair({ cur: value, prev: pair.cur });
  const flipping = pair.cur !== pair.prev;

  return (
    <span
      className="relative block h-10 w-7 rounded-md bg-card text-card-foreground shadow-sm"
      style={{ perspective: "8rem" }}
      aria-hidden="true"
    >
      <Half pos="top" digit={pair.cur} />
      <Half pos="bottom" digit={pair.prev} />
      {flipping && (
        <>
          <Half
            key={`top-${pair.cur}`}
            pos="top"
            digit={pair.prev}
            className="origin-bottom backface-hidden motion-reduce:hidden"
            style={{ animation: "event13-flip-top 280ms ease-in forwards" }}
          />
          <Half
            key={`bottom-${pair.cur}`}
            pos="bottom"
            digit={pair.cur}
            className="origin-top backface-hidden motion-reduce:hidden"
            style={{ animation: "event13-flip-bottom 280ms ease-out 280ms both" }}
          />
        </>
      )}
      <span className="absolute inset-x-0 top-1/2 z-10 h-px bg-border" />
    </span>
  );
}

export function Event13({
  title = "Starts in",
  start = "00:10:00",
  caption,
  holdMs = 2500,
  className,
}: Event13Props) {
  const total = parse(start);
  const [remaining, setRemaining] = useState(total);

  useEffect(() => {
    const id = setTimeout(
      () => setRemaining((r) => (r > 0 ? r - 1 : total)),
      remaining === 0 ? holdMs : 1000
    );
    return () => clearTimeout(id);
  }, [remaining, total, holdMs]);

  const groups = [
    pad(Math.floor(remaining / 3600)),
    pad(Math.floor((remaining % 3600) / 60)),
    pad(remaining % 60),
  ];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes event13-flip-top { from { transform: rotateX(0); } to { transform: rotateX(-90deg); } }
@keyframes event13-flip-bottom { from { transform: rotateX(90deg); } to { transform: rotateX(0); } }`}</style>
      <div className="flex w-full max-w-80 flex-col items-center gap-3 rounded-xl bg-foreground p-4 text-background shadow-md">
        <p className="text-sm opacity-70">{title}</p>
        <span className="sr-only">{groups.join(":")}</span>

        <div className="flex items-start gap-2" aria-hidden="true">
          {groups.map((group, gi) => (
            <div key={gi} className="contents">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex gap-0.5">
                  {group.split("").map((d, di) => (
                    <Flap key={di} value={d} />
                  ))}
                </div>
                <span className="text-xs uppercase tracking-wider opacity-60">
                  {LABELS[gi]}
                </span>
              </div>
              {gi < groups.length - 1 && (
                <span className="flex h-10 items-center text-xl font-semibold opacity-60">
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        {caption && (
          <p className="text-center text-xs leading-relaxed opacity-60">{caption}</p>
        )}
      </div>
    </div>
  );
}
