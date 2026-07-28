"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface Logo {
  src: string;
  alt: string;
}

interface Logos12Props {
  badge?: Badge;
  heading?: string;
  items?: Logo[];
  stat?: string;
  footnote?: string;
  className?: string;
}

export const logos12Demo: Logos12Props = {
  badge: { label: "Trusted by" },
  heading: "Groups, clinics, and single rooms, running the same quiet workflow",
  items: [
    { src: "https://oud.pics/sm/l/logoipsum-380.png", alt: "Logoipsum" },
    { src: "https://oud.pics/sm/l/logoipsum-388.png", alt: "Logoipsum" },
    { src: "https://oud.pics/sm/l/logoipsum-395.png", alt: "Logoipsum" },
    { src: "https://oud.pics/sm/l/logoipsum-406.png", alt: "Logoipsum" },
    { src: "https://oud.pics/sm/l/logoipsum-410.png", alt: "Logoipsum" },
    { src: "https://oud.pics/sm/l/logoipsum-414.png", alt: "Logoipsum" },
  ],
  stat: "240 practices, 9 countries, one shared way of working",
  footnote: "Names used with permission. Logos available in the press kit.",
};

export function Logos12({ badge, heading, items = [], stat, footnote, className }: Logos12Props) {
  return (
    <section className={cn("bg-background py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 md:items-end md:gap-12">
          <div>
            {badge && <Badge23 label={badge.label} />}
            {heading && (
              <h2 className="mt-6 max-w-xl text-2xl font-light leading-[1.1] tracking-tight text-foreground md:text-3xl">
                {heading}
              </h2>
            )}
          </div>
          {stat && (
            <div className="flex md:justify-end">
              <p className="max-w-xs text-base leading-relaxed text-muted-foreground">{stat}</p>
            </div>
          )}
        </div>

        <div className="mt-10 grid overflow-hidden rounded-md border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex h-24 items-center justify-center border-b border-r border-border px-6 md:h-28"
            >
              <img
                className="h-7 w-auto object-contain opacity-50 grayscale transition-opacity hover:opacity-100 md:h-8"
                src={item.src}
                alt={item.alt}
                width={120}
                height={28}
              />
            </div>
          ))}
        </div>

        {footnote && <p className="mt-6 text-sm text-muted-foreground">{footnote}</p>}
      </div>
    </section>
  );
}
