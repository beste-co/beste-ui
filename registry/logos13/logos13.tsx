"use client";

import Link from "next/link";
import { Badge7 } from "@/components/beste/component/badge7";
import { Button12 } from "@/components/beste/component/button12";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface ActionButton {
  label: string;
  href: string;
}

interface ClientLogo {
  src: string;
  alt: string;
  caption: string;
}

interface Logos13Labels {
  footnote?: string;
}

interface Logos13Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  items?: ClientLogo[];
  button?: ActionButton;
  labels?: Logos13Labels;
  className?: string;
}

export const logos13Demo: Logos13Props = {
  badge: { label: "The roster" },
  heading: "Nine years of work, mostly arriving by referral.",
  description:
    "The teams below handed us the pages their whole business runs through. Most of them came back for a second round.",
  items: [
    {
      src: "https://oud.pics/sm/l/logoipsum-380.png",
      alt: "Logoipsum",
      caption: "Editorial platform",
    },
    {
      src: "https://oud.pics/sm/l/logoipsum-388.png",
      alt: "Logoipsum",
      caption: "Museum wayfinding",
    },
    {
      src: "https://oud.pics/sm/l/logoipsum-395.png",
      alt: "Logoipsum",
      caption: "Coffee retail",
    },
    {
      src: "https://oud.pics/sm/l/logoipsum-406.png",
      alt: "Logoipsum",
      caption: "Audio hardware",
    },
    {
      src: "https://oud.pics/sm/l/logoipsum-410.png",
      alt: "Logoipsum",
      caption: "Independent press",
    },
    {
      src: "https://oud.pics/sm/l/logoipsum-414.png",
      alt: "Logoipsum",
      caption: "Textile studio",
    },
  ],
  button: {
    label: "See the client work",
    href: "https://beste.co",
  },
  labels: {
    footnote: "Eleven of the fourteen studios we worked with last year booked a second engagement.",
  },
};

export function Logos13({
  badge,
  heading,
  description,
  items = [],
  button,
  labels = {},
  className,
}: Logos13Props) {
  const { footnote } = labels;

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 md:items-end md:gap-12">
          <div>
            {badge && <Badge7 label={badge.label} />}
            {heading && (
              <h2 className="mt-6 max-w-xl text-balance text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}
          </div>

          {description && (
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground md:justify-self-end md:text-xl">
              {description}
            </p>
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 md:mt-16 md:grid-cols-3">
            {items.map((item, index) => (
              <div key={index} className="border-t pt-6">
                <img
                  className="h-8 w-auto object-contain opacity-50 grayscale md:h-9"
                  src={item.src}
                  alt={item.alt}
                  width={140}
                  height={36}
                />
                <p className="mt-5 text-base text-muted-foreground md:text-lg">{item.caption}</p>
              </div>
            ))}
          </div>
        )}

        {(footnote || button) && (
          <div className="mt-12 flex flex-wrap items-center justify-between gap-8 border-t pt-8 md:mt-16">
            {footnote && (
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {footnote}
              </p>
            )}
            {button && (
              <Button12 asChild label={button.label}>
                <Link href={button.href} />
              </Button12>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
