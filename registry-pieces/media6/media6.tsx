"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "violet"
  | "mono";

interface Media6Props {
  title?: string;
  side?: "A" | "B";
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset:
    "bg-gradient-to-r from-rose-400 to-orange-300 text-zinc-900",
  ocean: "bg-gradient-to-r from-sky-400 to-indigo-400 text-zinc-900",
  violet:
    "bg-gradient-to-r from-violet-400 to-fuchsia-400 text-zinc-900",
  mono: "bg-zinc-100 text-zinc-900",
};

export const media6Demo: Media6Props = {
  title: "Midnight Synth",
  side: "A",
  tone: "mono",
};

export function Media6({
  title = "Mixtape",
  side = "A",
  tone = "mono",
  className,
}: Media6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative h-28 w-44 overflow-hidden rounded-md bg-zinc-900 shadow-lg shadow-black/30">
        <span
          className="absolute left-2 top-2 size-1 rounded-full bg-zinc-700"
          aria-hidden="true"
        />
        <span
          className="absolute right-2 top-2 size-1 rounded-full bg-zinc-700"
          aria-hidden="true"
        />
        <span
          className="absolute bottom-2 left-2 size-1 rounded-full bg-zinc-700"
          aria-hidden="true"
        />
        <span
          className="absolute bottom-2 right-2 size-1 rounded-full bg-zinc-700"
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute inset-x-4 top-4 flex items-center justify-between rounded-sm px-3 py-1.5 shadow-inner",
            toneClasses[tone]
          )}
        >
          <span className="truncate font-mono text-xs font-bold uppercase tracking-wider">
            {title}
          </span>
          <span className="rounded-sm border border-current px-1 font-mono text-xs font-bold">
            {side}
          </span>
        </div>
        <div className="absolute inset-x-4 bottom-3 flex items-center justify-between">
          <div
            className="flex size-7 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-950"
            aria-hidden="true"
          >
            <div className="relative size-3.5 rounded-full bg-zinc-800">
              {[0, 45, 90, 135].map((r) => (
                <span
                  key={r}
                  className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-zinc-600"
                  style={{ transform: `translate(-50%, -50%) rotate(${r}deg)` }}
                />
              ))}
            </div>
          </div>
          <div
            className="h-5 flex-1 mx-2 rounded-sm border border-zinc-700 bg-zinc-950"
            aria-hidden="true"
          />
          <div
            className="flex size-7 items-center justify-center rounded-full border-2 border-zinc-700 bg-zinc-950"
            aria-hidden="true"
          >
            <div className="relative size-3.5 rounded-full bg-zinc-800">
              {[0, 45, 90, 135].map((r) => (
                <span
                  key={r}
                  className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-zinc-600"
                  style={{ transform: `translate(-50%, -50%) rotate(${r}deg)` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
