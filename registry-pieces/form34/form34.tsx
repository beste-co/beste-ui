"use client";

import { cn } from "@/lib/utils";

interface Form34Props {
  title?: string;
  placeholder?: string;
  buttonLabel?: string;
  note?: string;
  className?: string;
}

export const form34Demo: Form34Props = {
  title: "Get early access",
  placeholder: "you@clinic.com",
  buttonLabel: "Notify me",
  note: "No spam, just one launch note.",
};

export function Form34({
  title,
  placeholder = "you@example.com",
  buttonLabel = "Subscribe",
  note,
  className,
}: Form34Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-5 shadow-xl">
        {title && (
          <p className="text-sm font-semibold text-card-foreground">{title}</p>
        )}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <div className="flex-1 truncate rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
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
