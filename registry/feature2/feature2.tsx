"use client";

import { Badge } from "@/components/ui/badge";
import { Browser27 } from "@/components/beste/piece/browser27";
import { Browser28 } from "@/components/beste/piece/browser28";
import { Button } from "@/components/ui/button";
import { Calendar19 } from "@/components/beste/piece/calendar19";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ComponentBackground =
  | { type: "dots" }
  | { type: "none" }
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string };

type RowMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string }
  | {
      type: "component";
      component: React.ReactNode;
      background?: ComponentBackground;
    };

interface FeatureRow {
  title: string;
  description: string;
  media: RowMedia;
}

interface ButtonItem {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
}

interface Feature2Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  buttons?: ButtonItem[];
  rows?: FeatureRow[];
  className?: string;
}

export const feature2Demo: Feature2Props = {
  badge: { label: "Browser-grade surfaces", variant: "secondary" },
  heading: "Three pieces of the customer-facing toolkit",
  description:
    "Tiny cards that mimic real browser and calendar chrome — drop them into hero shots, marketing pages, and product walkthroughs without rebuilding the surface from scratch.",
  buttons: [{ label: "Read the playbook", href: "https://beste.co/playbook" }],
  rows: [
    {
      title: "Site identity, made glanceable",
      description:
        "A site-info popover that mirrors the lock icon and permission list users already know from their browser. Useful for trust pages, security marketing, and developer docs.",
      media: {
        type: "component",
        component: <Browser27 domain="stripe.com" />,
      },
    },
    {
      title: "Stack the domains your customers ship",
      description:
        "Layered browser windows show the multi-tenant story without diagrams. Drop in the subdomains that matter, the layout adapts to any depth.",
      media: {
        type: "component",
        component: (
          <Browser28
            domains={["customer.beste.co", "project.beste.co", "jane.beste.co", "joe.beste.co"]}
          />
        ),
      },
    },
    {
      title: "Plan the day, not the week",
      description:
        "A vertical day planner with tone-coded blocks. Pulls focus, meetings, and admin into one column so the schedule reads as a single shape.",
      media: {
        type: "component",
        component: (
          <Calendar19
            date="Mon · Apr 27"
            blocks={[
              { start: "09:00", label: "Focus · API refactor", tone: "focus" },
              { start: "10:30", label: "Standup", tone: "meeting" },
              { start: "11:00", label: "Focus · API refactor", tone: "focus" },
              { start: "12:00", label: "Lunch", tone: "break" },
              { start: "13:00", label: "Design review", tone: "meeting" },
              { start: "14:30", label: "Email & admin", tone: "admin" },
            ]}
          />
        ),
      },
    },
  ],
};

export function Feature2({
  badge,
  heading,
  description,
  buttons = [],
  rows = [],
  className,
}: Feature2Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex max-w-2xl flex-col gap-4">
          {badge && (
            <div>
              <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
            </div>
          )}
          {heading && (
            <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">{heading}</h2>
          )}
          {description && (
            <p className="text-base md:text-lg text-muted-foreground">{description}</p>
          )}
          {buttons.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">
              {buttons.map((button, index) => (
                <Button key={index} variant={button.variant ?? "default"} asChild>
                  <Link href={button.href ?? "#"}>{button.label}</Link>
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 flex flex-col gap-10 md:gap-16">
          {rows.map((row, index) => {
            const reverse = index % 2 === 1;
            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col gap-6 md:items-center md:gap-10",
                  reverse ? "md:flex-row-reverse" : "md:flex-row"
                )}
              >
                <div className="md:w-1/2">
                  <RowMediaSurface media={row.media} />
                </div>
                <div className="flex flex-col gap-3 md:w-1/2">
                  <h3 className="text-lg font-semibold md:text-2xl">{row.title}</h3>
                  <p className="text-sm text-muted-foreground md:text-base">{row.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RowMediaSurface({ media }: { media: RowMedia }) {
  const componentBackground =
    media.type === "component" ? (media.background ?? { type: "dots" }) : null;
  const showDots = componentBackground?.type === "dots";

  return (
    <div
      className="relative flex aspect-video items-center justify-center overflow-hidden rounded-md border bg-muted/30"
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
