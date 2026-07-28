"use client";

import { Video } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "sky" | "emerald" | "violet" | "amber" | "rose";

interface Attendee {
  initials: string;
  image?: string;
}

interface Calendar26Props {
  title?: string;
  window?: string;
  attendees?: Attendee[];
  joinLabel?: string;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const buttonClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const avatarClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
  violet: "bg-gradient-to-br from-indigo-500 to-violet-500 text-white",
  amber: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
  rose: "bg-gradient-to-br from-rose-500 to-pink-500 text-white",
};

export const calendar26Demo: Calendar26Props = {
  title: "Release planning · Q3",
  window: "In 3 min · 30 minutes",
  joinLabel: "Join",
  attendees: [
    {
      initials: "BS",
      image:
        "https://images.unsplash.com/photo-1625241189662-2980453ebffc?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D",
    },
    {
      initials: "KO",
      image:
        "https://images.unsplash.com/photo-1568392021577-fad7eb6efba1?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D",
    },
    { initials: "AK" },
    {
      initials: "JP",
      image:
        "https://images.unsplash.com/photo-1604072366595-e75dc92d6bdc?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjg2fHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
    },
    { initials: "NA" },
  ],
  tone: "sky",
};

export function Calendar26({
  title,
  window,
  attendees = [],
  joinLabel = "Join",
  tone = "sky",
  className,
}: Calendar26Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full",
              iconClasses[tone]
            )}
          >
            <Video className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">{title}</span>
            )}
            {window && (
              <span className="truncate text-xs">{window}</span>
            )}
          </div>
          <button
            type="button"
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1 text-sm font-semibold hover:opacity-90",
              buttonClasses[tone]
            )}
          >
            {joinLabel}
          </button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex -space-x-1.5">
            {attendees.map((a, idx) => (
              <span
                key={idx}
                className={cn(
                  "relative flex size-7 items-center justify-center overflow-hidden rounded-full text-xs font-semibold",
                  avatarClasses[tone]
                )}
              >
                {a.image ? (
                  <img
                    src={a.image}
                    alt={a.initials}
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  a.initials
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
