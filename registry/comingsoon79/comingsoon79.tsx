"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
import { Indicator14 } from "@/components/beste/piece/indicator14";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Badge {
  label: string;
}

interface ActionLink {
  label: string;
  href: string;
}

interface TileImage {
  src: string;
  alt: string;
}

interface DetailRow {
  label: string;
  value: string;
}

interface Comingsoon79Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  details?: DetailRow[];
  media?: ReactNode;
  image?: TileImage;
  buttons?: ActionLink[];
  contactNote?: string;
  className?: string;
}

export const comingsoon79Demo: Comingsoon79Props = {
  badge: { label: "Scheduled maintenance" },
  heading: "Back at 06:00, and bookings are safe in the meantime",
  description:
    "We are moving the scheduling database onto faster storage. Nothing is being changed, deleted, or migrated between regions while we do it.",
  details: [
    { label: "Window", value: "Sunday 02:00 – 06:00 UK" },
    { label: "Affected", value: "Web app and admin only" },
    { label: "Unaffected", value: "Member booking links and reminders" },
    { label: "Data", value: "Nothing moves outside your region" },
  ],
  media: (
    <Indicator14
      title="Booking service"
      uptime="99.98%"
      range="Last 45 days"
      bars={[
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "partial",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "down",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "partial",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
        "up",
      ]}
    />
  ),
  image: {
    src: "https://images.unsplash.com/photo-1703593693037-3f816218baa1?q=80&w=2199&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Deep green gradient backdrop",
  },
  buttons: [
    { label: "Follow the status page", href: "https://beste.co" },
    { label: "Read the change note", href: "https://beste.co" },
  ],
  contactNote:
    "If a clinic is opening inside this window, write to us and we will hold the maintenance until you are done.",
};

export function Comingsoon79({
  badge,
  heading,
  description,
  details = [],
  media,
  image,
  buttons = [],
  contactNote,
  className,
}: Comingsoon79Props) {
  return (
    <section className={cn("bg-background py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            {badge && <Badge23 label={badge.label} />}
            {heading && (
              <h1 className="mt-6 text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-5xl">
                {heading}
              </h1>
            )}
            {description && (
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                {description}
              </p>
            )}

            {details.length > 0 && (
              <dl className="mt-8">
                {details.map((detail, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border py-3 last:border-b"
                  >
                    <dt className="text-sm text-muted-foreground">{detail.label}</dt>
                    <dd className="text-base text-foreground">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {buttons.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {buttons.map((button, index) => (
                  <Button21
                    asChild
                    key={index}
                    label={button.label}
                    tone={index === 0 ? "primary" : "outline"}
                  >
                    <Link href={button.href} />
                  </Button21>
                ))}
              </div>
            )}

            {contactNote && (
              <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                {contactNote}
              </p>
            )}
          </div>

          {media && (
            <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-md bg-muted md:h-96">
              {image && (
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={image.src}
                  alt={image.alt}
                />
              )}
              <div className="relative z-10 size-full">{media}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
