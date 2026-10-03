"use client";

import { DownloadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "sky" | "emerald" | "violet";

interface Notification9Props {
  title?: string;
  version?: string;
  description?: string;
  action?: string;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
};

const buttonClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
};

export const notification9Demo: Notification9Props = {
  title: "Update available",
  description: "Restart to install new editor shortcuts and bug fixes.",
  action: "Restart now",
  tone: "primary",
  bordered: false,
};

export function Notification9({
  title,
  version,
  description,
  action,
  tone = "primary",
  bordered = false,
  className,
}: Notification9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-3 rounded-lg bg-card p-3 shadow-lg", bordered && "border border-border")}>
        <div className="flex items-start gap-3">
          <DownloadCloud
            className={cn("mt-0.5 size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex items-center gap-2">
              {title && (
                <span className="text-sm font-semibold text-card-foreground">
                  {title}
                </span>
              )}
              {version && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                  {version}
                </span>
              )}
            </div>
            {description && (
              <span className="text-xs leading-snug text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        </div>
        {action && (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Later
            </button>
            <button
              type="button"
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold hover:opacity-90",
                buttonClasses[tone]
              )}
            >
              {action}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
