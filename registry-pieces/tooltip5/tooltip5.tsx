"use client";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

type Presence = "online" | "away" | "offline";

interface Tooltip5Props {
  name?: string;
  role?: string;
  initials?: string;
  presence?: Presence;
  imageSrc?: string;
  alt?: string;
  tone?: Tone;
  className?: string;
}

const presenceClasses: Record<Presence, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-slate-400",
};

const presenceLabel: Record<Presence, string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
};

const fallbackClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
  violet: "bg-gradient-to-br from-indigo-500 to-violet-500 text-white",
  amber: "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
  rose: "bg-gradient-to-br from-rose-500 to-pink-500 text-white",
};

const defaultImage = "https://images.unsplash.com/photo-1733421331070-59ce0b57917a?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDd8fHxlbnwwfHx8fHw%3D";

export const tooltip5Demo: Tooltip5Props = {
  name: "Noor Ahmed",
  role: "Staff engineer · Platform",
  initials: "NA",
  presence: "online",
  imageSrc: defaultImage,
  alt: "Noor Ahmed",
  tone: "violet",
};

export function Tooltip5({
  name,
  role,
  initials = "??",
  presence = "online",
  imageSrc = defaultImage,
  alt,
  tone = "violet",
  className,
}: Tooltip5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        <div className="flex w-64 items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-lg">
          <div className="relative shrink-0">
            <div
              className={cn(
                "relative flex size-10 items-center justify-center overflow-hidden rounded-full text-sm font-semibold",
                !imageSrc && fallbackClasses[tone]
              )}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={alt ?? name ?? ""}
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card",
                presenceClasses[presence]
              )}
              aria-hidden="true"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {name && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {name}
              </span>
            )}
            {role && (
              <span className="truncate text-xs text-muted-foreground">
                {role}
              </span>
            )}
            <span className="mt-0.5 text-xs text-muted-foreground">
              {presenceLabel[presence]}
            </span>
          </div>
        </div>
        <div
          className="absolute -top-1 left-8 size-2 rotate-45 border-l border-t border-border bg-card"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
