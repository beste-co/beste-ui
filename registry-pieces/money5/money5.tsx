"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "midnight"
  | "sunset"
  | "ocean"
  | "forest";

interface Money5Props {
  last4?: string;
  holder?: string;
  expiry?: string;
  brand?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  midnight: "bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900",
  sunset: "bg-gradient-to-br from-rose-500 via-fuchsia-600 to-violet-700",
  ocean: "bg-gradient-to-br from-sky-500 via-cyan-600 to-indigo-800",
  forest: "bg-gradient-to-br from-emerald-700 via-teal-700 to-zinc-900",
};

export const money5Demo: Money5Props = {
  last4: "4242",
  holder: "Deniz Arslan",
  expiry: "08/28",
  brand: "VISA",
  tone: "midnight",
};

export function Money5({
  last4 = "0000",
  holder = "Card Holder",
  expiry = "00/00",
  brand = "CARD",
  tone = "midnight",
  className,
}: Money5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "relative flex aspect-[1.586] w-52 flex-col justify-between rounded-xl p-3 text-white shadow-lg shadow-black/30",
          toneClasses[tone]
        )}
      >
        <div className="flex items-start justify-between">
          <div
            className="flex size-7 items-center justify-center rounded-sm bg-gradient-to-br from-amber-200 to-amber-500"
            aria-hidden="true"
          >
            <div className="grid size-4 grid-cols-2 grid-rows-2 gap-px">
              <span className="rounded-sm bg-amber-700/50" />
              <span className="rounded-sm bg-amber-700/50" />
              <span className="rounded-sm bg-amber-700/50" />
              <span className="rounded-sm bg-amber-700/50" />
            </div>
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-90">
            {brand}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-sm tracking-widest">
          <span className="opacity-60">••••</span>
          <span className="opacity-60">••••</span>
          <span className="opacity-60">••••</span>
          <span>{last4}</span>
        </div>
        <div className="flex items-end justify-between">
          <span className="max-w-32 truncate text-xs font-semibold uppercase tracking-wide">
            {holder}
          </span>
          <span className="font-mono text-xs tabular-nums">{expiry}</span>
        </div>
      </div>
    </div>
  );
}
