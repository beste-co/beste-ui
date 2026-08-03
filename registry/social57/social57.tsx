"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Badge {
  label: string;
}

interface ActionLink {
  label: string;
  href: string;
}

interface Frame {
  src: string;
  alt: string;
  caption: string;
  place: string;
  tall?: boolean;
}

interface Social57Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  frames?: Frame[];
  closing?: string;
  button?: ActionLink;
  className?: string;
}

export const social57Demo: Social57Props = {
  badge: { label: "In the wild" },
  heading: "Photographs from rooms we did not decorate",
  description:
    "Sent in by practices, published with their permission. None of these were staged and none of them feature our logo on a wall.",
  frames: [
    {
      src: "https://images.unsplash.com/photo-1782849324101-3ae636a0e270?q=80&w=2233&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "A healthcare professional smiling in a bright clinic",
      caption: "Go-live morning, and nothing on fire",
      place: "Bramble Health, Bristol",
      tall: true,
    },
    {
      src: "https://images.unsplash.com/photo-1744349350577-af263c4c9039?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Two colleagues talking in a clinic corridor",
      caption: "The handover that used to be a phone call",
      place: "Kingsway Clinic, Leeds",
    },
    {
      src: "https://images.unsplash.com/photo-1705599773422-c1066356f801?q=80&w=2316&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "A calculator and paperwork on a desk",
      caption: "Month-end, closed before lunch",
      place: "Harbour Practice, Southampton",
      tall: true,
    },
    {
      src: "https://images.unsplash.com/photo-1678380003465-e8b1b9e3877c?q=80&w=2228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "A small team talking around a laptop",
      caption: "First multi-site roundtable, twelve chairs",
      place: "Bristol",
    },
    {
      src: "https://images.unsplash.com/photo-1753631841572-126ae9d13234?q=80&w=2264&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "A clinician reviewing notes at a desk",
      caption: "Notes written in the room, not after it",
      place: "Kingsway Clinic, Leeds",
      tall: true,
    },
    {
      src: "https://images.unsplash.com/photo-1713813879455-aaab0cd2b904?q=80&w=2622&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "A tidy reception desk in soft light",
      caption: "Half seven, before the first arrival",
      place: "Bramble Health, Bristol",
    },
  ],
  closing:
    "Have one worth sending? We publish with a credit and never without asking, and we will take the photograph down the day you want it down.",
  button: { label: "Send us a photograph", href: "https://beste.co" },
};

export function Social57({
  badge,
  heading,
  description,
  frames = [],
  closing,
  button,
  className,
}: Social57Props) {
  return (
    <section className={cn("bg-background py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {badge && <Badge23 label={badge.label} />}

        <div className="mt-6 border-t border-border pt-8 md:pt-10">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            {heading && (
              <h2 className="text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <div className="flex md:justify-end">
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 md:mt-16 lg:columns-3">
          {frames.map((frame, index) => (
            <figure key={index} className="mb-4 break-inside-avoid">
              <div
                className={cn(
                  "relative w-full overflow-hidden rounded-md bg-muted",
                  frame.tall ? "h-96" : "h-64"
                )}
              >
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={frame.src}
                  alt={frame.alt}
                />
              </div>
              <figcaption className="mt-3">
                <p className="text-base text-foreground">{frame.caption}</p>
                <p className="mt-1 text-sm text-muted-foreground">{frame.place}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between md:gap-8">
          {closing && (
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{closing}</p>
          )}
          {button && (
            <Button21 asChild label={button.label} tone="outline">
              <Link href={button.href} />
            </Button21>
          )}
        </div>
      </div>
    </section>
  );
}
