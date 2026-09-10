"use client";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Automation11App {
  src: string;
  alt: string;
}

interface Automation11Props {
  placeholder?: string;
  heading?: string;
  apps?: Automation11App[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const automation11Demo: Automation11Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation11Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2 rounded-sm border border-current/15 px-2 py-1.5">
          <Search
            className="size-3.5 text-current/60"
            aria-hidden="true"
          />
          <span className="flex-1 text-xs text-current/60">
            {placeholder}
          </span>
          <kbd className="rounded-sm border border-current/15 bg-current/10 px-1 font-mono text-xs text-current/60">
            ⌘K
          </kbd>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
          {heading}
        </span>
        <div className="grid grid-cols-4 gap-2">
          {apps.slice(0, 4).map((a, i) => (
            <button
              key={i}
              type="button"
              className="flex flex-col items-center gap-1 rounded-sm border border-transparent p-1.5 text-center hover:border-current/15 hover:bg-current/10"
            >
              <span className="relative size-8 overflow-hidden rounded-md bg-current/10">
                <img
                  src={a.src}
                  alt={a.alt}
                  className="absolute inset-0 size-full object-cover"
                />
              </span>
              <span className="max-w-full truncate text-xs">
                {a.alt}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
