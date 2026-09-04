"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "building" | "deploying" | "live";

interface Indicator15Props {
  buildingLabel?: string;
  deployingLabel?: string;
  liveLabel?: string;
  holdMs?: number;
  className?: string;
}

const order: Status[] = ["building", "deploying", "live"];

const pillClasses: Record<Status, string> = {
  building: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  deploying: "border-sky-500/40 text-sky-600 dark:text-sky-400",
  live: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
};

export const indicator15Demo: Indicator15Props = {
  buildingLabel: "Building",
  deployingLabel: "Deploying",
  liveLabel: "Live",
};

export function Indicator15({
  buildingLabel = "Building",
  deployingLabel = "Deploying",
  liveLabel = "Live",
  holdMs = 1600,
  className,
}: Indicator15Props) {
  const [state, setState] = useState<{ status: Status; prev: Status | null }>({
    status: "building",
    prev: null,
  });
  const [width, setWidth] = useState<number | null>(null);
  const contentRef = useRef<HTMLSpanElement>(null);

  const labels: Record<Status, string> = {
    building: buildingLabel,
    deploying: deployingLabel,
    live: liveLabel,
  };

  useEffect(() => {
    const id = setInterval(() => {
      setState(({ status }) => {
        const nextIndex = (order.indexOf(status) + 1) % order.length;
        return { prev: status, status: order[nextIndex] };
      });
    }, holdMs);
    return () => clearInterval(id);
  }, [holdMs]);

  useEffect(() => {
    const el = contentRef.current;
    if (el) setWidth(el.offsetWidth);
  }, [state.status, buildingLabel, deployingLabel, liveLabel]);

  const { status, prev } = state;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes indicator15-in { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } } @keyframes indicator15-out { from { opacity: 1; } to { opacity: 0; } }`}</style>
      <span
        className={cn(
          "inline-flex h-8 items-center rounded-full border bg-card px-3 text-sm font-medium shadow-sm transition-colors duration-500 ease-in-out",
          pillClasses[status]
        )}
      >
        <span
          className="block overflow-hidden transition-all duration-500 ease-in-out motion-reduce:transition-none"
          style={{ maxWidth: width === null ? undefined : `${width}px` }}
        >
          <span
            ref={contentRef}
            className="inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
              {status === "live" ? (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
              ) : (
                <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" />
              )}
            </span>
            <span className="relative">
              <span
                key={status}
                className="block"
                style={{ animation: "indicator15-in 400ms ease-out" }}
              >
                {labels[status]}
              </span>
              {prev && (
                <span
                  key={`prev-${prev}`}
                  className="pointer-events-none absolute left-0 top-0"
                  style={{ animation: "indicator15-out 300ms ease-out forwards" }}
                  aria-hidden="true"
                >
                  {labels[prev]}
                </span>
              )}
            </span>
          </span>
        </span>
      </span>
    </div>
  );
}
