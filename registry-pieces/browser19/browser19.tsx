"use client";
import { cn } from "@/lib/utils";

type TileTint = "sky" | "emerald" | "rose" | "amber" | "violet" | "slate";

interface Shortcut {
  name: string;
  url: string;
  tint: TileTint;
  src?: string;
  alt?: string;
}

interface Browser19Props {
  shortcuts?: Shortcut[];
  className?: string;
}

const tintClasses: Record<TileTint, string> = {
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  rose: "bg-rose-500 text-white",
  amber: "bg-amber-500 text-white",
  violet: "bg-violet-500 text-white",
  slate: "bg-slate-600 text-white",
};

export const browser19Demo: Browser19Props = {
  shortcuts: [
    { name: "GitHub", url: "github.com", tint: "slate" },
    { name: "Linear", url: "linear.app", tint: "violet" },
    {
      name: "Stripe",
      url: "stripe.com",
      tint: "emerald",
      src: "https://oud.pics/sm/l/stripe.jpeg",
      alt: "Stripe",
    },
    {
      name: "Notion",
      url: "notion.so",
      tint: "amber",
      src: "https://oud.pics/sm/l/notion.png",
      alt: "Notion",
    },
    {
      name: "Slack",
      url: "slack.com",
      tint: "violet",
      src: "https://oud.pics/sm/l/slack.svg",
      alt: "Slack",
    },
    {
      name: "Gmail",
      url: "gmail.com",
      tint: "rose",
      src: "https://oud.pics/sm/l/gmail.jpeg",
      alt: "Gmail",
    },
  ],
};

export function Browser19({ shortcuts = [], className }: Browser19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid w-full max-w-72 grid-cols-3 gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
        {shortcuts.slice(0, 6).map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "relative flex size-10 items-center justify-center overflow-hidden rounded-xl font-mono text-sm font-bold shadow-sm",
                s.src ? "bg-card" : tintClasses[s.tint]
              )}
              aria-hidden="true"
            >
              {s.src ? (
                <img
                  src={s.src}
                  alt={s.alt ?? s.name}
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                s.name.charAt(0).toUpperCase()
              )}
            </div>
            <span className="max-w-full truncate text-xs font-medium text-card-foreground">
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
