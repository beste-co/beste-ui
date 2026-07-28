"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Ai43 } from "@/components/beste/piece/ai43";
import { Automation1 } from "@/components/beste/piece/automation1";
import { Automation10 } from "@/components/beste/piece/automation10";
import { Automation2 } from "@/components/beste/piece/automation2";
import { Automation8 } from "@/components/beste/piece/automation8";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

type ComponentBackground =
  | { type: "dots" }
  | { type: "none" }
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string };

type FeatureMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; alt?: string }
  | {
      type: "component";
      component: React.ReactNode;
      background?: ComponentBackground;
    };

interface FeatureItem {
  title: string;
  description: string;
  media: FeatureMedia;
}

interface Feature1Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  features?: FeatureItem[];
  className?: string;
}

export const feature1Demo: Feature1Props = {
  badge: { label: "Automations", variant: "secondary" },
  heading: "Pick a capability, see the surface",
  description:
    "Open any row to expand its story. The right side updates with the live asset that ships with that capability.",
  features: [
    {
      title: "Wire up a single workflow node",
      description:
        "Drop a trigger or action node onto any canvas. Field labels and values come prebuilt, the app icon picks up your brand mark.",
      media: {
        type: "component",
        component: (
          <Automation2
            kind="action"
            app="Gmail"
            event="Send email"
            image="https://oud.pics/sm/l/gmail.jpeg"
            alt="Gmail"
            fields={[
              { label: "To", value: "{{customer.email}}" },
              { label: "Subject", value: "Your receipt is ready" },
              { label: "Template", value: "receipt-v3" },
            ]}
          />
        ),
      },
    },
    {
      title: "Trigger meets action, in one tile",
      description:
        "Show the full workflow at a glance. Two apps, two events, an arrow tells the story without an extra paragraph.",
      media: {
        type: "component",
        component: (
          <Automation1
            trigger={{
              src: "https://oud.pics/sm/l/stripe.jpeg",
              alt: "Stripe",
              event: "Payment received",
            }}
            action={{
              src: "https://oud.pics/sm/l/slack.svg",
              alt: "Slack",
              event: "Send #revenue alert",
            }}
          />
        ),
      },
    },
    {
      title: "Hand off the raw model output",
      description:
        "Download or copy the response as JSON. Useful in debug panels, eval reports, and tool-call documentation.",
      media: {
        type: "component",
        component: (
          <Ai43
            filename="response.json"
            content={`{
  "answer": "Use Redis INCR",
  "sources": 3,
  "latency_ms": 420
}`}
          />
        ),
      },
    },
    {
      title: "Toggle automations live",
      description:
        "An on/off card with run counts and a brand-aware tone. Drop it into dashboards so the team sees what's running without opening the editor.",
      media: {
        type: "component",
        component: (
          <Automation8
            name="Stripe → Slack revenue alerts"
            description="Posts a message in #revenue when a payment over $500 lands."
            image="https://oud.pics/sm/l/stripe.jpeg"
            alt="Stripe"
            active
            runsToday={28}
            tone="emerald"
          />
        ),
      },
    },
    {
      title: "Package recipes for installs",
      description:
        "Pre-built workflow recipes with a multi-app stack and an install count. Perfect for an integrations marketplace.",
      media: {
        type: "component",
        component: (
          <Automation10
            apps={[
              { image: "https://oud.pics/sm/l/stripe.jpeg", alt: "Stripe" },
              { image: "https://oud.pics/sm/l/notion.png", alt: "Notion" },
              { image: "https://oud.pics/sm/l/slack.svg", alt: "Slack" },
            ]}
            name="Sync paid invoices to Notion and ping Slack"
            description="Triggers on Stripe payment, logs the invoice in Notion, and posts a thread to #revenue."
            installs={4280}
            tone="primary"
          />
        ),
      },
    },
  ],
};

export function Feature1({ badge, heading, description, features = [], className }: Feature1Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = features[activeIndex]?.media;

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
              </div>
            )}
            {heading && <h2 className="text-2xl font-semibold md:text-4xl">{heading}</h2>}
            {description && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            onValueChange={(value) => {
              if (!value) return;
              const next = Number(value.replace("item-", ""));
              if (!Number.isNaN(next)) setActiveIndex(next);
            }}
          >
            {features.map((feature, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium md:text-lg">
                  {feature.title}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {feature.description}
                  </p>
                  <div className="mt-4 md:hidden">
                    <FeatureMediaSurface media={feature.media} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="hidden md:block">
            {activeMedia && <FeatureMediaSurface media={activeMedia} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureMediaSurface({ media }: { media: FeatureMedia }) {
  const componentBackground =
    media.type === "component" ? (media.background ?? { type: "dots" }) : null;
  const showDots = componentBackground?.type === "dots";

  return (
    <div
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border bg-muted/30"
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
