"use client";

import { cn } from "@/lib/utils";

interface Form34Props {
  title?: string;
  placeholder?: string;
  buttonLabel?: string;
  note?: string;
  bordered?: boolean;
  className?: string;
}

export const form34Demo: Form34Props = {
  title: "Get early access",
  placeholder: "hello@beste.co",
  buttonLabel: "Notify me",
  note: "No spam, just one launch note.",
  bordered: false,
};

export function Form34({
  title,
  placeholder = "you@example.com",
  buttonLabel = "Subscribe",
  note,
  bordered = false,
  className,
}: Form34Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 rounded-md bg-card p-5 shadow-xl", bordered && "border border-border")}>
        {title && (
          <p className="text-sm font-semibold text-card-foreground">{title}</p>
        )}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <div className={cn("flex-1 truncate rounded-md px-3 py-2 text-sm text-muted-foreground", bordered ? "border border-border bg-background" : "bg-muted")}>
            {placeholder}
          </div>
          <span className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
            {buttonLabel}
          </span>
        </div>
        {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
      </div>
    </div>
  );
}
