"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Kind = "added" | "changed" | "fixed" | "removed";

interface Badge {
  label: string;
}

interface Entry {
  kind: Kind;
  text: string;
}

interface Release {
  version: string;
  date: string;
  entries: Entry[];
  href: string;
}

interface Month {
  label: string;
  releases: Release[];
}

interface Changelog28Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  kindLabels?: Record<Kind, string>;
  months?: Month[];
  footnote?: string;
  className?: string;
}

const kindStyles: Record<Kind, string> = {
  added: "bg-primary/10 text-primary",
  changed: "bg-amber-500/10 text-amber-600",
  fixed: "bg-emerald-500/10 text-emerald-600",
  removed: "bg-muted text-muted-foreground",
};

export const changelog28Demo: Changelog28Props = {
  badge: { label: "Release notes" },
  heading: "Everything that changed, line by line",
  description:
    "The full log rather than the highlights. Removals are in here too, which is usually the part that matters most.",
  kindLabels: { added: "Added", changed: "Changed", fixed: "Fixed", removed: "Removed" },
  months: [
    {
      label: "May 2026",
      releases: [
        {
          version: "3.4.0",
          date: "14 May",
          href: "https://beste.co",
          entries: [
            { kind: "added", text: "Shared waiting list and capacity across every site in a group" },
            { kind: "added", text: "Member site preference, respected before distance" },
            { kind: "changed", text: "Group reporting now rolls up without an export step" },
            { kind: "removed", text: "Per-site waiting list settings, replaced by the group model" },
          ],
        },
        {
          version: "3.3.2",
          date: "02 May",
          href: "https://beste.co",
          entries: [
            { kind: "changed", text: "Invoice export moved to a background job with progress" },
            { kind: "fixed", text: "Month-end export timing out for groups over eight sites" },
          ],
        },
      ],
    },
    {
      label: "April 2026",
      releases: [
        {
          version: "3.3.0",
          date: "11 April",
          href: "https://beste.co",
          entries: [
            { kind: "added", text: "Insurer and self-pay settlement on a single ledger" },
            { kind: "added", text: "Credit notes against a specific appointment" },
            { kind: "changed", text: "Invoice references now include the site code" },
            { kind: "fixed", text: "Partial insurer payments leaving a balance of a rounding error" },
          ],
        },
        {
          version: "3.2.6",
          date: "24 April",
          href: "https://beste.co",
          entries: [
            { kind: "fixed", text: "Booking pages slow in the UK region for 41 minutes" },
            { kind: "changed", text: "Added a query budget to the booking path" },
          ],
        },
      ],
    },
  ],
  footnote:
    "Nothing is ever quietly edited after publication. If a note turns out to be wrong we add a correction underneath it with the date.",
};

export function Changelog28({
  badge,
  heading,
  description,
  kindLabels,
  months = [],
  footnote,
  className,
}: Changelog28Props) {
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
          {months.map((month, monthIndex) => (
            <div key={monthIndex} className="mb-10 last:mb-0">
              <h3 className="text-2xl font-light tracking-tight text-foreground">{month.label}</h3>

              <div className="mt-4">
                {month.releases.map((release, releaseIndex) => (
                  <div
                    key={releaseIndex}
                    className="grid gap-4 border-t border-border py-6 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10"
                  >
                    <div>
                      <Link
                        href={release.href}
                        className="text-lg tabular-nums text-foreground transition-colors hover:text-primary"
                      >
                        {release.version}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">{release.date}</p>
                    </div>

                    <ul className="flex flex-col gap-3">
                      {release.entries.map((entry, entryIndex) => (
                        <li key={entryIndex} className="flex flex-wrap items-baseline gap-3">
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2.5 py-0.5 text-sm font-medium",
                              kindStyles[entry.kind]
                            )}
                          >
                            {kindLabels?.[entry.kind] ?? entry.kind}
                          </span>
                          <span className="flex-1 text-base leading-relaxed text-foreground">
                            {entry.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {footnote && (
          <p className="mt-8 max-w-2xl border-t border-border pt-6 text-base leading-relaxed text-muted-foreground">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
