"use client";

import { cn } from "@/lib/utils";

interface Logo {
  src: string;
  alt: string;
}

interface Logo10Props {
  label?: string;
  logos?: Logo[];
  durationMs?: number;
  className?: string;
}

export const logo10Demo: Logo10Props = {
  label: "Trusted by product teams",
  logos: [
    { src: "https://oud.pics/sm/l/stripe.jpeg", alt: "Stripe" },
    { src: "https://oud.pics/sm/l/notion.png", alt: "Notion" },
    { src: "https://oud.pics/sm/l/slack.svg", alt: "Slack" },
    { src: "https://oud.pics/sm/l/figma.png", alt: "Figma" },
    { src: "https://oud.pics/sm/l/dropbox.png", alt: "Dropbox" },
  ],
};

export function Logo10({
  label,
  logos = [],
  durationMs = 18000,
  className,
}: Logo10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes logo10-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
`}</style>

      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        {label && (
          <p className="text-center text-xs text-muted-foreground">{label}</p>
        )}

        <div className="relative overflow-hidden">
          <div
            className="flex w-max items-center gap-8"
            style={{ animation: `logo10-scroll ${durationMs}ms linear infinite` }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-8" aria-hidden={copy === 1}>
                {logos.map((logo) => (
                  <img
                    key={logo.alt}
                    src={logo.src}
                    alt={copy === 0 ? logo.alt : ""}
                    className="h-6 w-auto shrink-0 rounded-sm object-contain opacity-70 grayscale"
                  />
                ))}
              </div>
            ))}
          </div>

          <span
            className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
