"use client";

import { Button21 } from "@/components/beste/component/button21";
import { Indicator14 } from "@/components/beste/piece/indicator14";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ActionLink {
  label: string;
  href: string;
}

interface TileImage {
  src: string;
  alt: string;
}

interface Reference {
  label: string;
  value: string;
}

interface Error35Props {
  code?: string;
  heading?: string;
  description?: string;
  buttons?: ActionLink[];
  references?: Reference[];
  media?: ReactNode;
  image?: TileImage;
  footnote?: string;
  className?: string;
}

export const error35Demo: Error35Props = {
  code: "Error 500",
  heading: "That one is ours, not yours",
  description:
    "Something on our side failed while loading this page. Nothing you were working on has been lost, and the request has already been reported to the engineer on call.",
  buttons: [
    { label: "Try again", href: "https://beste.co" },
    { label: "Back to the workspace", href: "https://beste.co" },
  ],
  references: [
    { label: "Reference", value: "SIR-9F4C-2201" },
    { label: "Time", value: "14 May 2026, 09:41 UK" },
    { label: "Reported", value: "Automatically, no action needed" },
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
    src: "https://images.unsplash.com/photo-1701979399033-1f720add6b91?q=80&w=2233&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Soft blue gradient backdrop",
  },
  footnote:
    "Quote the reference above if you write to us and we can pull the exact request out of the log.",
};

export function Error35({
  code,
  heading,
  description,
  buttons = [],
  references = [],
  media,
  image,
  footnote,
  className,
}: Error35Props) {
  return (
    <section className={cn("bg-background py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {code && (
            <p className="text-sm text-muted-foreground">
              {code}
            </p>
          )}
          {heading && (
            <h1 className="mt-6 text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {heading}
            </h1>
          )}
          {description && (
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
          {buttons.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
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
        </div>

        {media && (
          <div className="relative mx-auto mt-12 flex h-56 max-w-3xl items-center justify-center overflow-hidden rounded-md bg-muted md:mt-16 md:h-60">
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

        {references.length > 0 && (
          <dl className="mx-auto mt-10 max-w-3xl">
            {references.map((reference, index) => (
              <div
                key={index}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border py-3 last:border-b"
              >
                <dt className="text-sm text-muted-foreground">{reference.label}</dt>
                <dd className="font-mono text-base text-foreground">{reference.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {footnote && (
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
