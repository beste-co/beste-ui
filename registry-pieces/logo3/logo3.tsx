"use client";
import { cn } from "@/lib/utils";

interface Logo {
  name: string;
  src: string;
  alt?: string;
}

interface Logo3Props {
  heading?: string;
  logos?: Logo[];
  durationSeconds?: number;
  className?: string;
}

export const logo3Demo: Logo3Props = {
  heading: "Trusted by teams at",
  logos: [
    { name: "Stripe", src: "https://oud.pics/sm/l/stripe.jpeg" },
    { name: "Notion", src: "https://oud.pics/sm/l/notion.png" },
    { name: "Slack", src: "https://oud.pics/sm/l/slack.svg" },
    { name: "Gmail", src: "https://oud.pics/sm/l/gmail.jpeg" },
    { name: "Figma", src: "https://oud.pics/sm/l/figma.png" },
    { name: "Dropbox", src: "https://oud.pics/sm/l/dropbox.png" },
    { name: "Apple", src: "https://oud.pics/sm/l/apple.png" },
    { name: "Drive", src: "https://oud.pics/sm/l/google-drive.png" },
  ],
  durationSeconds: 40,
};

export function Logo3({
  heading,
  logos = [],
  durationSeconds = 40,
  className,
}: Logo3Props) {
  const loop = [...logos, ...logos];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
        @keyframes logo3-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div className="flex w-full max-w-80 flex-col gap-2">
        {heading && (
          <span className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {heading}
          </span>
        )}
        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div
            className="flex w-fit items-center gap-6 py-1"
            style={{
              animation: `logo3-scroll ${durationSeconds}s linear infinite`,
            }}
            aria-hidden="true"
          >
            {loop.map((logo, idx) => (
              <div
                key={idx}
                className="relative size-8 shrink-0 overflow-hidden rounded-md"
              >
                <img
                  src={logo.src}
                  alt={logo.alt ?? logo.name}
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
