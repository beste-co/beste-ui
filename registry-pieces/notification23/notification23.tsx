"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "rose" | "emerald" | "sky" | "violet";

interface Notification23Props {
  label?: string;
  previews?: string[];
  max?: number;
  intervalMs?: number;
  tone?: Tone;
  className?: string;
}

const badgeClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  rose: "bg-rose-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

export const notification23Demo: Notification23Props = {
  label: "Notifications",
  previews: [
    "Nina Simone mentioned you in #design",
    "Miles Davis approved your pull request",
    "Your invoice for September is ready",
    "Patti Smith shared a folder with you",
    "Deploy to production finished",
  ],
  tone: "rose",
};

export function Notification23({
  label = "Notifications",
  previews = [],
  max = 5,
  intervalMs = 2000,
  tone = "rose",
  className,
}: Notification23Props) {
  const [count, setCount] = useState(0);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => (c >= max ? 0 : c + 1));
      setBeat((b) => b + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [max, intervalMs]);

  const preview = count > 0 && previews.length ? previews[(count - 1) % previews.length] : null;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes notification23-ring { 0%, 100% { transform: rotate(0); } 15% { transform: rotate(14deg); } 30% { transform: rotate(-12deg); } 45% { transform: rotate(8deg); } 60% { transform: rotate(-5deg); } 75% { transform: rotate(2deg); } }
@keyframes notification23-pop { 0% { transform: scale(0.6); } 45% { transform: scale(1.35); } 100% { transform: scale(1); } }
@keyframes notification23-fade { from { opacity: 0; transform: translateY(0.25rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={`${count} unread notifications`}
            className="relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border bg-background text-card-foreground shadow-sm transition-colors hover:bg-muted"
          >
            <span
              key={beat}
              className="flex origin-top motion-reduce:animate-none"
              style={{ animation: count > 0 ? "notification23-ring 700ms ease-in-out" : undefined }}
              aria-hidden="true"
            >
              <Bell className="size-5" />
            </span>
            {count > 0 && (
              <span
                key={`badge-${beat}`}
                className={cn(
                  "absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold tabular-nums motion-reduce:animate-none",
                  badgeClasses[tone]
                )}
                style={{ animation: "notification23-pop 400ms ease-out" }}
                aria-hidden="true"
              >
                {count}
              </span>
            )}
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-card-foreground">{label}</p>
            <p className="text-xs tabular-nums text-muted-foreground">
              {count > 0 ? `${count} unread` : "All caught up"}
            </p>
          </div>
        </div>

        <div className="flex h-8 items-center border-t border-border pt-2">
          {preview ? (
            <p
              key={beat}
              className="truncate text-sm text-card-foreground motion-reduce:animate-none"
              style={{ animation: "notification23-fade 400ms ease-out" }}
            >
              {preview}
            </p>
          ) : (
            <p className="truncate text-sm text-muted-foreground">Nothing new right now</p>
          )}
        </div>
      </div>
    </div>
  );
}
