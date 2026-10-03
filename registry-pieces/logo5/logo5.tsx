"use client";
import { cn } from "@/lib/utils";

interface Logo {
  name: string;
  src: string;
  alt?: string;
}

interface Logo5Props {
  heading?: string;
  logos?: Logo[];
  bordered?: boolean;
  className?: string;
}

export const logo5Demo: Logo5Props = {
  heading: "Loved by modern teams",
  logos: [
    { name: "Stripe", src: "https://oud.pics/sm/l/stripe.jpeg" },
    { name: "Notion", src: "https://oud.pics/sm/l/notion.png" },
    { name: "Slack", src: "https://oud.pics/sm/l/slack.svg" },
    { name: "Figma", src: "https://oud.pics/sm/l/figma.png" },
    { name: "Dropbox", src: "https://oud.pics/sm/l/dropbox.png" },
    { name: "Gmail", src: "https://oud.pics/sm/l/gmail.jpeg" },
  ],
  bordered: false,
};

export function Logo5({
  heading,
  logos = [],
  bordered = false,
  className,
}: Logo5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3">
        {heading && (
          <span className="text-center text-xs font-semibold text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="grid grid-cols-3 gap-2">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className={cn("flex aspect-square items-center justify-center rounded-lg bg-card p-3 shadow-sm", bordered && "border border-border")}
              title={logo.name}
            >
              <div className="relative size-8">
                <img
                  src={logo.src}
                  alt={logo.alt ?? logo.name}
                  className="absolute inset-0 size-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
