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

interface AgendaEntry {
  time: string;
  title: string;
  description: string;
  who: string;
  optional?: boolean;
}

interface Onboarding36Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  dayLabel?: string;
  entries?: AgendaEntry[];
  optionalLabel?: string;
  closing?: string;
  button?: ActionLink;
  className?: string;
}

export const onboarding36Demo: Onboarding36Props = {
  badge: { label: "Day one" },
  heading: "The whole first day, hour by hour, written down in advance",
  description:
    "So you can see how much of your team's time this actually costs before you agree to it. The answer is about ninety minutes.",
  dayLabel: "A typical go-live Monday",
  entries: [
    {
      time: "08:00",
      title: "We watch, you work",
      description:
        "Your normal morning runs on Sirius for the first time while two of us sit on a call saying nothing unless asked.",
      who: "Your team, as usual",
    },
    {
      time: "09:30",
      title: "First fifteen minutes review",
      description:
        "Anything that felt wrong in the first stretch gets fixed while it is still fresh, not filed as a ticket.",
      who: "Reception lead, 15 minutes",
    },
    {
      time: "11:00",
      title: "Billing check",
      description:
        "We raise the first real invoice together and confirm it reconciles the way your finance team expects.",
      who: "Practice manager, 20 minutes",
    },
    {
      time: "13:00",
      title: "Clinician walkthrough",
      description:
        "Whoever is on the afternoon rota gets ten minutes on the record and the note template. That is the whole training.",
      who: "Clinicians, 10 minutes each",
      optional: true,
    },
    {
      time: "16:30",
      title: "End of day count",
      description:
        "Booked, seen, no-shows, and invoiced, compared against what your old system would have said.",
      who: "Practice manager, 15 minutes",
    },
    {
      time: "17:00",
      title: "We hand over the keys",
      description:
        "Admin access, the audit log, and a written list of everything you asked us to change during the day.",
      who: "Us, nothing needed from you",
    },
  ],
  optionalLabel: "Optional",
  closing:
    "Nothing above needs a room booked or a training day. The longest single commitment is twenty minutes.",
  button: { label: "Book a go-live date", href: "https://beste.co" },
};

export function Onboarding36({
  badge,
  heading,
  description,
  dayLabel,
  entries = [],
  optionalLabel,
  closing,
  button,
  className,
}: Onboarding36Props) {
  return (
    <section className={cn("bg-muted py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          {badge && <Badge23 label={badge.label} />}
          {heading && (
            <h2 className="mt-6 text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-5xl">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="mt-12 overflow-hidden rounded-md border border-border bg-background md:mt-16">
          {dayLabel && (
            <p className="border-b border-border px-6 py-4 text-base text-muted-foreground md:px-10">
              {dayLabel}
            </p>
          )}

          <div className="px-6 py-2 md:px-10">
            {entries.map((entry, index) => (
              <div
                key={index}
                className="grid gap-3 border-b border-border py-6 last:border-b-0 md:grid-cols-[5rem_minmax(0,1.6fr)_minmax(0,1fr)] md:gap-8"
              >
                <span className="text-base tabular-nums text-muted-foreground">{entry.time}</span>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-medium text-foreground">{entry.title}</h3>
                    {entry.optional && optionalLabel && (
                      <span className="rounded-full border border-border px-2.5 py-0.5 text-sm text-muted-foreground">
                        {optionalLabel}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {entry.description}
                  </p>
                </div>

                <p className="text-base text-muted-foreground md:text-right">{entry.who}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
          {closing && (
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">{closing}</p>
          )}
          {button && (
            <Button21 asChild label={button.label}>
              <Link href={button.href} />
            </Button21>
          )}
        </div>
      </div>
    </section>
  );
}
