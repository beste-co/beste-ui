"use client";

import { ArrowUpRight } from "lucide-react";
import { Badge23 } from "@/components/beste/component/badge23";
import { BookOpen, MessagesSquare, Radio, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Badge {
  label: string;
}

interface Channel {
  icon: LucideIcon;
  name: string;
  description: string;
  count: string;
  countLabel: string;
  href: string;
}

interface Social48Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  channels?: Channel[];
  footnote?: string;
  className?: string;
}

export const social48Demo: Social48Props = {
  badge: { label: "Where people talk" },
  heading: "The rooms our users are already in",
  description:
    "None of these are marketing lists. They are places practices ask each other things we would not have thought to answer.",
  channels: [
    {
      icon: MessagesSquare,
      name: "The forum",
      description:
        "Practices swapping rota patterns, insurer quirks, and the workarounds they wish we had shipped.",
      count: "2,140",
      countLabel: "members",
      href: "https://beste.co",
    },
    {
      icon: BookOpen,
      name: "The monthly note",
      description:
        "One letter on the first Tuesday about what shipped, what broke, and one longer piece of writing.",
      count: "3,860",
      countLabel: "subscribers",
      href: "https://beste.co",
    },
    {
      icon: Radio,
      name: "Office hours",
      description:
        "An open call every second Thursday. No agenda, no demo, and no obligation to turn your camera on.",
      count: "40",
      countLabel: "seats each session",
      href: "https://beste.co",
    },
    {
      icon: Users,
      name: "The practice group",
      description:
        "A smaller room for managers running four or more sites, where the questions get considerably more specific.",
      count: "118",
      countLabel: "practices",
      href: "https://beste.co",
    },
  ],
  footnote:
    "We read everything and answer in public wherever we can, because the next practice with that question should not have to ask it again.",
};

export function Social48({
  badge,
  heading,
  description,
  channels = [],
  footnote,
  className,
}: Social48Props) {
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

        <div className="mt-12 md:mt-16">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <Link
                key={index}
                href={channel.href}
                className="group/social48 grid gap-4 border-t border-border py-6 transition-colors hover:bg-muted md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_2rem] md:items-center md:gap-10 md:px-4"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-medium text-foreground">{channel.name}</h3>
                    <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground">
                      {channel.description}
                    </p>
                  </div>
                </div>

                <div className="pl-14 md:pl-0">
                  <p className="text-3xl font-light tracking-tight tabular-nums text-foreground">
                    {channel.count}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{channel.countLabel}</p>
                </div>

                <ArrowUpRight
                  className="hidden size-4 shrink-0 text-muted-foreground transition-transform motion-safe:group-hover/social48:-translate-y-0.5 md:block"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>

        {footnote && (
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
