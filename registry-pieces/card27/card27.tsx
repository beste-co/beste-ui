"use client";

import { cn } from "@/lib/utils";

interface Card27Props {
  name?: string;
  talkTitle?: string;
  stage?: string;
  time?: string;
  initials?: string;
  org?: string;
  image?: string;
  bordered?: boolean;
  className?: string;
}

export const card27Demo: Card27Props = {
  name: "Hildur Guðnadóttir",
  org: "Chief scientist",
  talkTitle: "Agents in medicine: cautious optimism",
  stage: "Hall A",
  time: "Fri, May 8 · 10:00",
  initials: "HG",
  image:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop",
  bordered: false,
};

export function Card27({
  name,
  talkTitle,
  stage,
  time,
  initials = "??",
  org,
  image,
  bordered = false,
  className,
}: Card27Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-3">
          <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500 text-sm font-bold text-white shadow-md">
            {image ? (
              <img
                src={image}
                alt={name ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {name && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {name}
              </span>
            )}
            {org && (
              <span className="truncate text-xs text-muted-foreground">
                {org}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-md bg-muted p-2">
          {talkTitle && (
            <span className="text-sm font-semibold text-card-foreground">
              {talkTitle}
            </span>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {stage && <span>{stage}</span>}
            {time && <span className="tabular-nums">{time}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
