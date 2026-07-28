"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "emerald"
  | "violet"
  | "sky"
  | "amber"
  | "rose";

interface Socialproof21Props {
  eyebrow?: string;
  value?: string;
  outcome?: string;
  name?: string;
  role?: string;
  avatar?: string;
  fallback?: string;
  tone?: Tone;
  className?: string;
}

const textClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const socialproof21Demo: Socialproof21Props = {
  eyebrow: "Result",
  value: "+312%",
  outcome: "organic signups within the first quarter of launch",
  name: "Mara Lindqvist",
  role: "Head of Growth, Northwind",
  avatar:
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  fallback: "ML",
  tone: "foreground",
};

export function Socialproof21({
  eyebrow = "Result",
  value = "",
  outcome,
  name,
  role,
  avatar,
  fallback = "",
  tone = "foreground",
  className,
}: Socialproof21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm">
        {eyebrow && (
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          <span
            className={cn(
              "text-4xl font-bold leading-none tracking-tight tabular-nums",
              textClasses[tone]
            )}
          >
            {value}
          </span>
          {outcome && (
            <p className="text-sm leading-snug text-muted-foreground">
              {outcome}
            </p>
          )}
        </div>
        {name && (
          <div className="flex items-center gap-2.5 border-t border-border pt-3">
            <Avatar className="size-8">
              <AvatarImage
                src={avatar}
                alt={name}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-semibold">
                {fallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-tight text-card-foreground">
                {name}
              </span>
              {role && (
                <span className="text-xs leading-tight text-muted-foreground">
                  {role}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
