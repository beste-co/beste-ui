"use client";

import { cn } from "@/lib/utils";

interface Browser16Props {
  code?: number;
  message?: string;
  className?: string;
}

export const browser16Demo: Browser16Props = {
  code: 200,
  message: "OK",
};

function classify(code: number) {
  if (code < 300)
    return {
      tint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
      family: "Success",
    };
  if (code < 400)
    return {
      tint: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
      family: "Redirect",
    };
  if (code < 500)
    return {
      tint: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
      family: "Client error",
    };
  return {
    tint: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
    family: "Server error",
  };
}

export function Browser16({
  code = 200,
  message,
  className,
}: Browser16Props) {
  const cfg = classify(code);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-2 shadow-sm",
          cfg.tint
        )}
      >
        <span className="font-mono text-xl font-bold tabular-nums">
          {code}
        </span>
        <div className="flex flex-col">
          {message && (
            <span className="text-xs font-bold uppercase tracking-wide">
              {message}
            </span>
          )}
          <span className="text-xs opacity-70">{cfg.family}</span>
        </div>
      </div>
    </div>
  );
}
