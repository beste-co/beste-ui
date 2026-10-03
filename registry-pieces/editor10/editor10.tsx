"use client";

import { cn } from "@/lib/utils";

interface Editor10Props {
  title?: string;
  lede?: string;
  bullets?: string[];
  code?: string;
  bordered?: boolean;
  className?: string;
}

export const editor10Demo: Editor10Props = {
  title: "Launch Checklist",
  lede: "Ship with confidence by running through the five-point review.",
  bullets: [
    "Verify preview URL",
    "Run smoke suite",
    "Tag the release",
  ],
  bordered: false,
};

export function Editor10({
  title = "Heading",
  lede,
  bullets = [],
  code,
  bordered = false,
  className,
}: Editor10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card px-3 py-3 shadow-sm", bordered && "border border-border")}>
        <h3 className="text-base font-bold text-card-foreground">
          {title}
        </h3>
        {lede && (
          <p className="text-xs leading-snug text-muted-foreground">
            {lede}
          </p>
        )}
        {bullets.length > 0 && (
          <ul className="flex flex-col gap-1 pl-1">
            {bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-card-foreground"
              >
                <span
                  className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground"
                  aria-hidden="true"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {code && (
          <code className="rounded-sm bg-muted px-2 py-1 text-xs text-card-foreground">
            {code}
          </code>
        )}
      </div>
    </div>
  );
}
