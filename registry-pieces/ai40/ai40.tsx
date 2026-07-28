"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "sunset";

interface Ai40Props {
  name?: string;
  role?: string;
  traits?: string[];
  tone?: Tone;
  className?: string;
}

const headerClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
  sky: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  amber: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500 text-white",
};

export const ai40Demo: Ai40Props = {
  name: "Nova",
  role: "Senior engineer",
  traits: ["Concise", "Code-first", "Terminal-friendly"],
  tone: "sunset",
};

export function Ai40({
  name = "Persona",
  role,
  traits = [],
  tone = "violet",
  className,
}: Ai40Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2",
            headerClasses[tone]
          )}
        >
          <span
            className="flex size-7 items-center justify-center rounded-full bg-white/20 text-sm font-bold"
            aria-hidden="true"
          >
            {name.charAt(0).toUpperCase()}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">{name}</span>
            {role && (
              <span className="text-xs leading-tight opacity-80">{role}</span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 p-3">
          {traits.map((t) => (
            <span
              key={t}
              className="rounded-sm bg-muted px-1.5 py-0.5 text-xs text-card-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
