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

interface CtaImage {
  src: string;
  alt: string;
}

interface DetailRow {
  title: string;
  value: string;
}

interface Cta78Labels {
  note?: string;
}

interface Cta78Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  image?: CtaImage;
  button?: ActionButton;
  link?: ActionButton;
  details?: DetailRow[];
  labels?: Cta78Labels;
  className?: string;
}

export const cta78Demo: Cta78Props = {
  badge: { label: "Open commissions" },
  heading: "Bring the brief you keep rewriting.",
  description:
    "One hour, one room, and the version of the problem you have not managed to write down yet. We will tell you plainly whether we are the right studio for it.",
  image: {
    src: "https://images.unsplash.com/photo-1785293130707-d0ddb0ac8832?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Empty studio meeting room lit by a tall window",
  },
  button: {
    label: "Book a studio hour",
    href: "https://beste.co",
  },
  link: {
    label: "Or send the brief by email",
    href: "https://beste.co",
  },
  details: [
    { title: "First reply", value: "Within two days" },
    { title: "Next opening", value: "September" },
  ],
  labels: {
    note: "No deck, no paid discovery phase. If it is not a fit we say so and point you somewhere better.",
  },
};

export function Cta78({
  badge,
  heading,
  description,
  image,
  button,
  link,
  details = [],
  labels = {},
  className,
}: Cta78Props) {
  const { note } = labels;

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
          {image && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted md:aspect-[3/4]">
              <img
                className="absolute inset-0 size-full object-cover"
                src={image.src}
                alt={image.alt}
              />
            </div>
          )}

          <div>
            {badge && <Badge7 label={badge.label} />}

            {heading && (
              <h2 className="mt-6 text-balance text-4xl font-bold leading-[0.95] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                {heading}
              </h2>
            )}

            {description && (
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
                {description}
              </p>
            )}

            {(button || link) && (
              <div className="mt-10 flex flex-wrap items-center gap-8">
                {button && (
                  <Button12 asChild label={button.label}>
                    <Link href={button.href} />
                  </Button12>
                )}
                {link && (
                  <Link
                    href={link.href}
                    className="text-base font-bold text-foreground underline underline-offset-4 md:text-lg"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            )}

            {details.length > 0 && (
              <dl className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2">
                {details.map((detail, index) => (
                  <div key={index} className="border-t pt-5">
                    <dt className="text-base text-muted-foreground md:text-lg">{detail.title}</dt>
                    <dd className="mt-2 text-xl font-bold tracking-tight text-foreground md:text-2xl">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {note && (
              <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                {note}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
