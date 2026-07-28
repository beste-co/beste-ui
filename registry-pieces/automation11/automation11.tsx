"use client";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Automation11App {
  src: string;
  alt: string;
}

interface Automation11Props {
  placeholder?: string;
  heading?: string;
  apps?: Automation11App[];
  className?: string;
}

export const automation11Demo: Automation11Props = {
  placeholder: "Search trigger apps",
  heading: "Popular",
  apps: [
    { src: "https://oud.pics/sm/l/stripe.jpeg", alt: "Stripe" },
    { src: "https://oud.pics/sm/l/gmail.jpeg", alt: "Gmail" },
    { src: "https://oud.pics/sm/l/slack.svg", alt: "Slack" },
    { src: "https://oud.pics/sm/l/notion.png", alt: "Notion" },
  ],
};

export function Automation11({
  placeholder = "Search",
  heading = "Popular",
  apps = [],
  className,
}: Automation11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2 rounded-sm border border-border px-2 py-1.5">
          <Search
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 text-xs text-muted-foreground">
            {placeholder}
          </span>
          <kbd className="rounded-sm border border-border bg-muted px-1 font-mono text-xs text-muted-foreground">
            ⌘K
          </kbd>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {heading}
        </span>
        <div className="grid grid-cols-4 gap-2">
          {apps.slice(0, 4).map((a, i) => (
            <button
              key={i}
              type="button"
              className="flex flex-col items-center gap-1 rounded-sm border border-transparent p-1.5 text-center hover:border-border hover:bg-muted"
            >
              <span className="relative size-8 overflow-hidden rounded-md bg-muted">
                <img
                  src={a.src}
                  alt={a.alt}
                  className="absolute inset-0 size-full object-cover"
                />
              </span>
              <span className="max-w-full truncate text-xs text-card-foreground">
                {a.alt}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
