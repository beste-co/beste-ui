"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar1 } from "@/components/beste/piece/calendar1";
import { Terminal2 } from "@/components/beste/piece/terminal2";
import { Upload1 } from "@/components/beste/piece/upload1";
import { cn } from "@/lib/utils";

type ComponentBackground =
  | { type: "dots" }
  | { type: "none" }
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string };

type StepMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string }
  | {
      type: "component";
      component: React.ReactNode;
      background?: ComponentBackground;
    };

interface StepCard {
  title: string;
  description: string;
  media: StepMedia;
}

interface Feature9Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  cards?: StepCard[];
  className?: string;
}

export const feature9Demo: Feature9Props = {
  badge: { label: "How it works", variant: "outline" },
  heading: "Ship your next release in three steps",
  description:
    "Each step shows the surface you'll touch — a real asset, not a mockup — so the workflow stays grounded in what your team actually sees.",
  cards: [
    {
      title: "Drop in your assets",
      description:
        "Upload designs, brand guidelines, or reference images. The upload card tracks progress so the team knows when it's safe to start.",
      media: {
        type: "component",
        component: <Upload1 filename="brand-guidelines.pdf" size="12.4 MB" progress={68} />,
      },
    },
    {
      title: "Plan the release window",
      description:
        "A single calendar tile keeps the launch date front and center. Tone reflects whether you're on track or running hot.",
      media: {
        type: "component",
        background: { type: "none" },
        component: <Calendar1 month="APR" day="21" weekday="Tuesday" tone="primary" />,
      },
    },
    {
      title: "Ship the change",
      description:
        "One copy-and-paste command pushes the release. The terminal pill drops into changelogs and onboarding docs without extra wiring.",
      media: {
        type: "component",
        component: <Terminal2 command="pnpm dlx shadcn@latest add feature9" />,
      },
    },
  ],
};

export function Feature9({ badge, heading, description, cards = [], className }: Feature9Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-9 max-w-2xl text-center">
          {badge && (
            <div className="mb-4 flex justify-center">
              <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
            </div>
          )}
          {heading && (
            <h2 className="mb-4 text-2xl font-semibold tracking-tight md:text-4xl">{heading}</h2>
          )}
          {description && (
            <p className="text-base md:text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex flex-col items-stretch justify-center gap-6 md:flex-row">
          {cards.map((card, index) => (
            <article
              key={index}
              className="flex w-full flex-col gap-3 rounded-md border bg-muted/30 p-6 md:w-[350px]"
            >
              <h3 className="text-base font-medium md:text-lg">{card.title}</h3>
              <p className="text-sm text-muted-foreground md:text-base">{card.description}</p>
              <div className="mt-auto pt-4">
                <StepMediaSurface media={card.media} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepMediaSurface({ media }: { media: StepMedia }) {
  const componentBackground =
    media.type === "component" ? (media.background ?? { type: "dots" }) : null;
  const showDots = componentBackground?.type === "dots";

  return (
    <div
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border bg-card"
      style={
        showDots
          ? {
              backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }
          : undefined
      }
    >
      {componentBackground?.type === "image" && (
        <img
          className="absolute inset-0 size-full object-cover"
          src={componentBackground.src}
          alt={componentBackground.alt ?? ""}
          aria-hidden="true"
        />
      )}
      {componentBackground?.type === "video" && (
        <video
          src={componentBackground.src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      )}

      {media.type === "video" ? (
        <video
          src={media.src}
          autoPlay
          loop
          muted
          playsInline
          aria-label={media.alt}
          className="size-full object-cover"
        />
      ) : media.type === "image" ? (
        <img
          className="absolute inset-0 size-full object-cover"
          src={media.src}
          alt={media.alt ?? ""}
        />
      ) : (
        <div className="relative flex size-full items-center justify-center">{media.component}</div>
      )}
    </div>
  );
}
