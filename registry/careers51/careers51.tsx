"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge23 } from "@/components/beste/component/badge23";
import { Button21 } from "@/components/beste/component/button21";
import { cn } from "@/lib/utils";

interface Badge {
  label: string;
}

interface ActionLink {
  label: string;
  href: string;
}

interface Role {
  title: string;
  team: string;
  location: string;
  type: string;
  href: string;
}

interface MediaImage {
  src: string;
  alt: string;
}

interface Media {
  image: MediaImage;
  title?: string;
  description?: string;
}

interface Footnote {
  label: string;
  button: ActionLink;
}

interface Careers51Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  media?: Media;
  allLabel?: string;
  items?: Role[];
  footnote?: Footnote;
  className?: string;
}

export const careers51Demo: Careers51Props = {
  badge: { label: "Careers" },
  heading: "Open roles at Sirius",
  description:
    "We are building the surface care teams live in all day. Small teams, long horizons, and work you can point at a year from now.",
  media: {
    image: {
      src: "https://images.unsplash.com/photo-1678380003465-e8b1b9e3877c?q=80&w=2228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "A small team talking around a laptop",
    },
    title: "42 people, 9 countries",
    description:
      "Four-day summer weeks, a real budget for craft, and quiet hours the whole company keeps.",
  },
  allLabel: "All roles",
  items: [
    {
      title: "Senior Product Designer",
      team: "Design",
      location: "Remote, Europe",
      type: "Full-time",
      href: "https://beste.co",
    },
    {
      title: "Design Engineer",
      team: "Design",
      location: "Lisbon or remote",
      type: "Full-time",
      href: "https://beste.co",
    },
    {
      title: "Backend Engineer, Records",
      team: "Engineering",
      location: "Remote, Europe",
      type: "Full-time",
      href: "https://beste.co",
    },
    {
      title: "Infrastructure Engineer",
      team: "Engineering",
      location: "Berlin, hybrid",
      type: "Full-time",
      href: "https://beste.co",
    },
    {
      title: "Implementation Specialist",
      team: "Customer",
      location: "Remote, Americas",
      type: "Full-time",
      href: "https://beste.co",
    },
    {
      title: "Clinical Support Lead",
      team: "Customer",
      location: "London, hybrid",
      type: "Contract",
      href: "https://beste.co",
    },
    {
      title: "Revenue Operations Analyst",
      team: "Operations",
      location: "Remote, Europe",
      type: "Part-time",
      href: "https://beste.co",
    },
  ],
  footnote: {
    label: "Nothing here fits, but you think you belong with us?",
    button: { label: "Send an open application", href: "https://beste.co" },
  },
};

export function Careers51({
  badge,
  heading,
  description,
  media,
  allLabel,
  items = [],
  footnote,
  className,
}: Careers51Props) {
  const [activeTeam, setActiveTeam] = useState("");

  const teams = Array.from(new Set(items.map((role) => role.team)));
  const filtered = activeTeam ? items.filter((role) => role.team === activeTeam) : items;

  const filters = [{ value: "", label: allLabel ?? "", count: items.length }].concat(
    teams.map((team) => ({
      value: team,
      label: team,
      count: items.filter((role) => role.team === team).length,
    }))
  );

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

        <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          {media && (
            <div className="relative flex h-64 flex-col justify-end overflow-hidden rounded-md sm:h-80 lg:sticky lg:top-24 lg:h-[32rem] lg:self-start">
              <img
                className="absolute inset-0 size-full object-cover"
                src={media.image.src}
                alt={media.image.alt}
              />
              {(media.title || media.description) && (
                <>
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="relative z-10 p-6 md:p-8">
                    {media.title && (
                      <p className="text-xl font-light tracking-tight text-background md:text-2xl">
                        {media.title}
                      </p>
                    )}
                    {media.description && (
                      <p className="mt-2 text-sm leading-relaxed text-background/70">
                        {media.description}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => {
                const active = activeTeam === filter.value;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveTeam(filter.value)}
                    aria-pressed={active}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-sm leading-none transition-colors",
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    )}
                  >
                    {filter.label}
                    <span
                      className={cn(active ? "text-background/60" : "text-muted-foreground/70")}
                    >
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border-t border-border">
              {filtered.map((role, index) => (
                <Link
                  key={index}
                  href={role.href}
                  className="group/careers51 flex flex-col gap-3 border-b border-border py-6 md:flex-row md:items-center md:justify-between md:gap-8"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-xl font-light tracking-tight text-foreground transition-colors group-hover/careers51:text-primary md:text-2xl">
                      {role.title}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {role.team}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground md:items-end">
                      <span className="text-foreground">{role.location}</span>
                      <span>{role.type}</span>
                    </div>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border transition-colors group-hover/careers51:border-foreground">
                      <ArrowUpRight
                        className="size-4 text-muted-foreground transition-transform motion-safe:group-hover/careers51:translate-x-0.5 motion-safe:group-hover/careers51:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {footnote && (
              <div className="mt-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                  {footnote.label}
                </p>
                <Button21 asChild label={footnote.button.label} tone="outline">
                  <Link href={footnote.button.href} />
                </Button21>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
