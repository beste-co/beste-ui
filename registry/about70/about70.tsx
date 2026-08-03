"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import type { ReactNode } from "react";
import { Stats16 } from "@/components/beste/piece/stats16";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface TileImage {
  src: string;
  alt: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  marker?: string;
}

interface Photo {
  image: TileImage;
  caption: string;
}

interface About70Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  milestones?: Milestone[];
  closing?: string;
  media?: ReactNode;
  image?: TileImage;
  mediaCaption?: string;
  photo?: Photo;
  className?: string;
}

export const about70Demo: About70Props = {
  badge: { label: "How we got here" },
  heading: "Six years, one problem, and a lot of very long Tuesdays",
  description:
    "We started by sitting behind a reception desk for a fortnight. Most of what follows came out of that.",
  milestones: [
    {
      year: "2020",
      title: "A fortnight behind the desk",
      description:
        "Two of us spent ten working days at a Bristol practice doing the receptionist's job badly. We came out with a list of forty things that were nobody's fault and everybody's problem.",
      marker: "The beginning",
    },
    {
      year: "2021",
      title: "The first booking anyone else made",
      description:
        "One clinic, one room, and a scheduler that did nothing but avoid double-bookings. It ran for eight months before we added a second feature.",
    },
    {
      year: "2023",
      title: "Records and money in the same product",
      description:
        "Practices kept telling us the scheduler was fine and the rest of their week was not. Billing and records arrived together because separating them was what had broken everything else.",
    },
    {
      year: "2024",
      title: "Multi-site, because groups asked twice",
      description:
        "Four clinics sharing one waiting list turned out to be a different product, not a bigger one. It took a year and a rewrite of how capacity is modelled.",
    },
    {
      year: "2026",
      title: "Eleven practices, thirteen rooms, still no sales team",
      description:
        "Everyone who has bought Sirius spoke to an engineer first. We intend to keep that true for as long as it is possible.",
      marker: "Today",
    },
  ],
  closing:
    "We are eighteen people. Nine of them write code, four have worked in a clinic, and all of them take support shifts.",
  media: (
    <Stats16
      label="Appointments booked"
      value="1,284"
      delta="12.4%"
      direction="up"
      caption="every month, across eleven practices"
      bars={[12, 21, 30, 38, 47, 61, 72, 86]}
    />
  ),
  image: {
    src: "https://images.unsplash.com/photo-1750918619871-dc74c9a57394?q=80&w=2222&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Soft blue gradient backdrop",
  },
  mediaCaption:
    "One bar for each year on this page. The first four are the ones nobody would have called a business.",
  photo: {
    image: {
      src: "https://images.unsplash.com/photo-1744349350577-af263c4c9039?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Two colleagues talking in a clinic corridor",
    },
    caption: "Bristol, the fortnight that started it",
  },
};

export function About70({
  badge,
  heading,
  description,
  milestones = [],
  closing,
  media,
  image,
  mediaCaption,
  photo,
  className,
}: About70Props) {
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

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="grid gap-4 border-t border-border py-8 last:border-b sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-10"
              >
                <div>
                  <p className="text-2xl font-light tracking-tight tabular-nums text-foreground">
                    {milestone.year}
                  </p>
                  {milestone.marker && (
                    <p className="mt-2 text-sm text-muted-foreground">{milestone.marker}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground">{milestone.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}

            {closing && (
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {closing}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            {media && (
              <div>
                <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-md bg-muted">
                  {image && (
                    <img
                      className="absolute inset-0 size-full object-cover"
                      src={image.src}
                      alt={image.alt}
                    />
                  )}
                  <div className="relative z-10 size-full">{media}</div>
                </div>
                {mediaCaption && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {mediaCaption}
                  </p>
                )}
              </div>
            )}

            {photo && (
              <figure>
                <div className="relative h-64 w-full overflow-hidden rounded-md bg-muted">
                  <img
                    className="absolute inset-0 size-full object-cover"
                    src={photo.image.src}
                    alt={photo.image.alt}
                  />
                </div>
                <figcaption className="mt-3 text-sm text-muted-foreground">
                  {photo.caption}
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
