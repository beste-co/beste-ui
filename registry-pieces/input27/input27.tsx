"use client";

import { cn } from "@/lib/utils";

interface Token {
  text: string;
  type?: "at" | "hash" | "plain";
}

interface Input27Props {
  label?: string;
  tokens?: Token[];
  className?: string;
}

export const input27Demo: Input27Props = {
  label: "Thread",
  tokens: [
    { text: "Can we ping " },
    { text: "mira", type: "at" },
    { text: " about the " },
    { text: "launch-prep", type: "hash" },
    { text: " agenda?" },
  ],
};

const typeClasses = {
  at: "bg-sky-500/15 text-sky-700 dark:text-sky-300 px-1 rounded font-semibold",
  hash: "bg-violet-500/15 text-violet-700 dark:text-violet-300 px-1 rounded font-semibold",
  plain: "text-card-foreground",
};

export function Input27({
  label,
  tokens = [],
  className,
}: Input27Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="rounded-md border border-border bg-card px-3 py-2 shadow-sm">
          <span className="text-sm leading-relaxed">
            {tokens.map((t, idx) => (
              <span key={idx} className={typeClasses[t.type ?? "plain"]}>
                {t.type === "at" && "@"}
                {t.type === "hash" && "#"}
                {t.text}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
