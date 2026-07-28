"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "foreground" | "primary";

interface Badge18Props {
  /** Target date-time, ISO string (e.g. "2027-01-01T00:00:00Z") */
  target: string;
  /** Muted label before the numbers (e.g. "Launch in") */
  label?: string;
  /** Shown once the target has passed */
  finishedText?: string;
  /** Number color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  foreground: "text-foreground",
  primary: "text-primary",
};

export const badge18Demo: Badge18Props = {
  target: "2027-01-01T00:00:00Z",
  label: "Launch in",
};

const pad = (n: number) => String(n).padStart(2, "0");

function format(msLeft: number): string {
  const s = Math.floor(msLeft / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

/**
 * A live countdown chip for launches and limited offers. The numbers only
 * start ticking after mount (the server renders a placeholder), so SSR and
 * client markup never disagree.
 */
export function Badge18({
  target,
  label,
  finishedText = "It's live!",
  tone = "foreground",
  className,
}: Badge18Props) {
  const [msLeft, setMsLeft] = React.useState<number | null>(null);

  React.useEffect(() => {
    const tick = () => setMsLeft(new Date(target).getTime() - Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span
      role="timer"
      className={cn(
        "inline-flex w-fit items-center gap-2.5 rounded-lg border bg-background px-3.5 py-2",
        className
      )}
    >
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <span
        className={cn(
          "font-mono text-sm font-semibold tabular-nums tracking-wide",
          toneStyles[tone]
        )}
      >
        {msLeft === null ? "--d --h --m --s" : msLeft <= 0 ? finishedText : format(msLeft)}
      </span>
    </span>
  );
}
