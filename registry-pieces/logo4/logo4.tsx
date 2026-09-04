"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Logo {
  src: string;
  alt: string;
}

interface Logo4Props {
  lead?: string;
  logos?: Logo[];
  intervalMs?: number;
  className?: string;
}

export const logo4Demo: Logo4Props = {
  lead: "Used at",
  logos: [
    { src: "https://oud.pics/sm/l/stripe.jpeg", alt: "Stripe" },
    { src: "https://oud.pics/sm/l/notion.png", alt: "Notion" },
    { src: "https://oud.pics/sm/l/slack.svg", alt: "Slack" },
    { src: "https://oud.pics/sm/l/figma.png", alt: "Figma" },
    { src: "https://oud.pics/sm/l/dropbox.png", alt: "Dropbox" },
  ],
  intervalMs: 2200,
};

export function Logo4({
  lead = "Used at",
  logos = [],
  intervalMs = 2200,
  className,
}: Logo4Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (logos.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % logos.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [logos.length, intervalMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{lead}</span>
        <div className="relative flex items-center gap-2">
          <span className="relative size-8 shrink-0 overflow-hidden rounded-md bg-card shadow-sm">
            {logos.map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className={cn(
                  "absolute inset-0 size-full object-cover transition-all duration-700 ease-out",
                  i === index
                    ? "opacity-100 blur-none"
                    : "opacity-0 blur-md"
                )}
              />
            ))}
          </span>
          <span className="relative inline-block min-w-20 text-lg font-bold leading-none text-card-foreground">
            {logos.map((logo, i) => (
              <span
                key={i}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-out",
                  i === index
                    ? "opacity-100 blur-none"
                    : "opacity-0 blur-sm"
                )}
              >
                {logo.alt}
              </span>
            ))}
            <span className="invisible">
              {logos[index]?.alt ?? ""}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
