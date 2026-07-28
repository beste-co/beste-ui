"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chart1 } from "@/components/beste/piece/chart1";
import Link from "next/link";
import { Stats5 } from "@/components/beste/piece/stats5";
import { Terminal1 } from "@/components/beste/piece/terminal1";
import { cn } from "@/lib/utils";

type ComponentBackground =
  | { type: "dots" }
  | { type: "none" }
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string };

type CardMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string }
  | {
      type: "component";
      component: React.ReactNode;
      background?: ComponentBackground;
    };

interface FeatureCard {
  eyebrow: string;
  title: string;
  description: string;
  media: CardMedia;
}

interface ButtonItem {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
}

interface Feature194Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  cards?: FeatureCard[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature194Demo: Feature194Props = {
  badge: { label: "Built for builders", variant: "secondary" },
  heading: "Ship faster, measure everything",
  description:
    "A toolkit that meets your team where it works — analytics in the dashboard, wins in the changelog, install in the terminal.",
  cards: [
    {
      eyebrow: "Analytics",
      title: "Insights you trust",
      description:
        "Live dashboards with the metrics that matter. No SQL required, no waiting for a data team.",
      media: {
        type: "component",
        component: (
          <Chart1
            label="Sessions · this week"
            value="8,214"
            data={[42, 68, 54, 81, 36, 72, 90]}
            tone="primary"
          />
        ),
      },
    },
    {
      eyebrow: "Performance",
      title: "Wins worth shipping",
      description:
        "Every release ships with measurable improvements. Track regressions before they reach customers.",
      media: {
        type: "component",
        component: (
          <Stats5
            label="Page load time"
            before="3.4s"
            after="0.8s"
            beforeCaption="Before"
            afterCaption="After"
          />
        ),
      },
    },
    {
      eyebrow: "Developer experience",
      title: "One command away",
      description:
        "Install in seconds with our CLI. Type-safe, framework-aware, no lock-in to anyone's stack.",
      media: {
        type: "component",
        background: {
          type: "image",
          src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=900&fit=crop",
          alt: "Developer workspace with code on screen",
        },
        component: <Terminal1 prompt="$" command="npx beste-ui@latest add feature194" />,
      },
    },
  ],
  buttons: [
    { label: "Read the docs", href: "https://beste.co/docs" },
    {
      label: "View on GitHub",
      href: "https://github.com/beste-co",
      variant: "outline",
    },
  ],
};

export function Feature194({
  badge,
  heading,
  description,
  cards = [],
  buttons = [],
  className,
}: Feature194Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-10 md:mb-14 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
              </div>
            )}
            {heading && <h2 className="text-3xl font-semibold md:text-5xl">{heading}</h2>}
            {description && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
          {cards.map((card, index) => (
            <div key={index} className="flex flex-col overflow-hidden rounded-xl border bg-card">
              <CardMediaSurface media={card.media} />
              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {card.eyebrow}
                </span>
                <h3 className="mt-2 text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {buttons.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {buttons.map((button, index) => (
              <Button key={index} variant={button.variant ?? "default"} asChild>
                <Link href={button.href ?? "#"}>{button.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CardMediaSurface({ media }: { media: CardMedia }) {
  const componentBackground =
    media.type === "component" ? (media.background ?? { type: "dots" }) : null;
  const showDots = componentBackground?.type === "dots";

  return (
    <div
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b bg-muted/30"
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
