"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Signup {
  name: string;
  city: string;
  avatar?: string;
}

interface Socialproof28Props {
  heading?: string;
  action?: string;
  items?: Signup[];
  intervalMs?: number;
  tone?: Tone;
  className?: string;
}

interface Entry {
  id: number;
  item: Signup;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

const dotClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

const ages = ["Just now", "1 min ago", "3 min ago", "6 min ago"];

export const socialproof28Demo: Socialproof28Props = {
  heading: "Recent signups",
  action: "just signed up",
  items: [
    {
      name: "Nina Simone",
      city: "Berlin",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    },
    {
      name: "Miles Davis",
      city: "New York",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    },
    {
      name: "Björk",
      city: "Reykjavik",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    },
    { name: "Patti Smith", city: "Chicago" },
    { name: "Prince", city: "Minneapolis" },
    { name: "Aretha Franklin", city: "Detroit" },
    { name: "Herbie Hancock", city: "Los Angeles" },
  ],
  tone: "emerald",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Socialproof28({
  heading = "Recent activity",
  action = "just signed up",
  items = [],
  intervalMs = 2000,
  tone = "emerald",
  className,
}: Socialproof28Props) {
  // Newest card sits first, so the seed ids count down and every new id is unique.
  const [feed, setFeed] = useState<Entry[]>(() => {
    const seed = items.slice(0, 3);
    return seed.map((item, i) => ({ id: seed.length - 1 - i, item }));
  });

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setFeed((prev) => {
        const nextId = (prev[0]?.id ?? -1) + 1;
        const next = items[nextId % items.length];
        if (!next) return prev;
        return [{ id: nextId, item: next }, ...prev].slice(0, 4);
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [items, intervalMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes socialproof28-in { from { opacity: 0; transform: translateY(-0.75rem) scale(0.97); } to { opacity: 1; transform: none; } }`}</style>
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-medium text-card-foreground">{heading}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="relative flex size-1.5" aria-hidden="true">
              <span
                className={cn(
                  "absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:animate-none",
                  dotClasses[tone]
                )}
              />
              <span className={cn("relative inline-flex size-1.5 rounded-full", dotClasses[tone])} />
            </span>
            Live
          </span>
        </div>

        <div className="relative h-40 overflow-hidden">
          {feed.map((entry, index) => (
            <div
              key={entry.id}
              className={cn(
                "absolute inset-x-0 top-0 flex h-12 items-center gap-2.5 rounded-lg bg-muted px-2.5 transition-all duration-500 ease-out motion-reduce:transition-none",
                index >= 3 ? "opacity-0" : "opacity-100"
              )}
              style={{
                transform: `translateY(${index * 3.5}rem)`,
                animation: index === 0 ? "socialproof28-in 450ms ease-out" : undefined,
              }}
              aria-hidden={index >= 3 ? "true" : undefined}
            >
              {entry.item.avatar ? (
                <img
                  src={entry.item.avatar}
                  alt=""
                  className="size-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    tileClasses[tone]
                  )}
                  aria-hidden="true"
                >
                  {initials(entry.item.name)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium text-card-foreground">
                    {entry.item.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {ages[index] ?? ages[ages.length - 1]}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {entry.item.city} · {action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
