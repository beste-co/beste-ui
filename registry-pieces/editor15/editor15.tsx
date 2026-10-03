"use client";

import { cn } from "@/lib/utils";

interface Editor15Props {
  prefix?: string;
  placeholders?: { index: number; label: string; active?: boolean }[];
  middle?: string;
  suffix?: string;
  bordered?: boolean;
  className?: string;
}

export const editor15Demo: Editor15Props = {
  prefix: "for (let ",
  placeholders: [
    { index: 1, label: "i", active: true },
    { index: 2, label: "arr" },
  ],
  middle: " = 0; $1 < ",
  suffix: ".length; $1++) {}",
  bordered: false,
};

export function Editor15({
  prefix = "",
  placeholders = [],
  middle = "",
  suffix = "",
  bordered = false,
  className,
}: Editor15Props) {
  const tagClass = (active?: boolean) =>
    cn(
      "inline-flex items-center rounded-sm px-1 font-semibold",
      active
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-card-foreground ring-1 ring-inset ring-border"
    );

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 rounded-md bg-card px-3 py-2 text-xs shadow-sm", bordered && "border border-border")}>
        <span className="text-card-foreground">{prefix}</span>
        {placeholders[0] && (
          <span className={tagClass(placeholders[0].active)}>
            ${placeholders[0].index}:{placeholders[0].label}
          </span>
        )}
        <span className="text-card-foreground">{middle}</span>
        {placeholders[1] && (
          <span className={tagClass(placeholders[1].active)}>
            ${placeholders[1].index}:{placeholders[1].label}
          </span>
        )}
        <span className="text-card-foreground">{suffix}</span>
      </div>
    </div>
  );
}
