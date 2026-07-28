"use client";
import { cn } from "@/lib/utils";

interface Logo {
  name: string;
  src: string;
  alt?: string;
}

interface Logo7Props {
  logos?: Logo[];
  total?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const logo7Demo: Logo7Props = {
  logos: [
    { name: "Stripe", src: "https://oud.pics/sm/l/stripe.jpeg" },
    { name: "Notion", src: "https://oud.pics/sm/l/notion.png" },
    { name: "Slack", src: "https://oud.pics/sm/l/slack.svg" },
    { name: "Figma", src: "https://oud.pics/sm/l/figma.png" },
  ],
  total: 428,
  label: "Teams already onboarded",
  sublabel: "Joining every week",
};

export function Logo7({
  logos = [],
  total = 0,
  label,
  sublabel,
  className,
}: Logo7Props) {
  const visible = logos.slice(0, 4);
  const extra = Math.max(0, total - visible.length);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-3">
        <div className="flex -space-x-2">
          {visible.map((logo, idx) => (
            <span
              key={idx}
              className="relative size-9 overflow-hidden rounded-full bg-card ring-2 ring-card"
            >
              <img
                src={logo.src}
                alt={logo.alt ?? logo.name}
                className="absolute inset-0 size-full object-cover"
              />
            </span>
          ))}
          {extra > 0 && (
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-card-foreground ring-2 ring-card">
              +{extra}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-semibold text-card-foreground">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="text-xs text-muted-foreground">{sublabel}</span>
          )}
        </div>
      </div>
    </div>
  );
}
