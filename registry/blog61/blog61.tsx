"use client";

import { Badge23 } from "@/components/beste/component/badge23";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface Badge {
  label: string;
}

interface ArchivePost {
  date: string;
  topic: string;
  title: string;
  readingTime: string;
  href: string;
}

interface Blog61Props {
  badge?: Badge;
  heading?: string;
  description?: string;
  allLabel?: string;
  posts?: ArchivePost[];
  emptyLabel?: string;
  className?: string;
}

export const blog61Demo: Blog61Props = {
  badge: { label: "Archive" },
  heading: "Everything we have written, by subject",
  description:
    "No infinite scroll and no recommended reading. Pick a subject and the list narrows to it.",
  allLabel: "Everything",
  posts: [
    {
      date: "12 May 2026",
      topic: "Operations",
      title: "The waiting list is a scheduling problem, not a queue",
      readingTime: "6 min",
      href: "https://beste.co",
    },
    {
      date: "28 Apr 2026",
      topic: "Billing",
      title: "Why we raise the invoice from the appointment, not the month",
      readingTime: "8 min",
      href: "https://beste.co",
    },
    {
      date: "16 Apr 2026",
      topic: "Migration",
      title: "What eleven years of records looks like when you export it",
      readingTime: "9 min",
      href: "https://beste.co",
    },
    {
      date: "09 Apr 2026",
      topic: "Security",
      title: "Six roles beat forty checkboxes, and we can prove it",
      readingTime: "5 min",
      href: "https://beste.co",
    },
    {
      date: "21 Mar 2026",
      topic: "Product",
      title: "We deleted the settings page and nobody noticed",
      readingTime: "4 min",
      href: "https://beste.co",
    },
    {
      date: "02 Mar 2026",
      topic: "Operations",
      title: "Twelve receptionists, one stopwatch, and a very long Tuesday",
      readingTime: "11 min",
      href: "https://beste.co",
    },
    {
      date: "18 Feb 2026",
      topic: "Billing",
      title: "Reconciliation is a reading task, not a data-entry one",
      readingTime: "7 min",
      href: "https://beste.co",
    },
    {
      date: "04 Feb 2026",
      topic: "Migration",
      title: "The four fields nobody at any practice could explain",
      readingTime: "6 min",
      href: "https://beste.co",
    },
  ],
  emptyLabel: "Nothing filed under that yet.",
};

export function Blog61({
  badge,
  heading,
  description,
  allLabel = "All",
  posts = [],
  emptyLabel,
  className,
}: Blog61Props) {
  const [topic, setTopic] = useState<string | null>(null);

  const topics = Array.from(new Set(posts.map((post) => post.topic)));
  const visible = topic ? posts.filter((post) => post.topic === topic) : posts;

  const filters = [
    { label: allLabel, value: null, count: posts.length },
    ...topics.map((name) => ({
      label: name,
      value: name,
      count: posts.filter((post) => post.topic === name).length,
    })),
  ];

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

        <div className="mt-10 flex flex-wrap gap-2">
          {filters.map((filter, index) => {
            const isActive = topic === filter.value;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setTopic(filter.value)}
                aria-pressed={isActive}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {filter.label}
                <span className="ml-2 tabular-nums opacity-60">{filter.count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-x-12 md:grid-cols-2">
          {visible.map((post, index) => (
            <Link
              key={index}
              href={post.href}
              className="flex flex-col gap-1 border-t border-border py-5 transition-colors hover:bg-muted md:flex-row md:items-baseline md:gap-6"
            >
              <span className="w-28 shrink-0 text-sm text-muted-foreground">
                {post.date}
              </span>
              <span className="flex-1 text-lg font-medium text-foreground">{post.title}</span>
              <span className="shrink-0 text-sm text-muted-foreground">{post.readingTime}</span>
            </Link>
          ))}
        </div>

        {visible.length === 0 && emptyLabel && (
          <p className="mt-10 border-t border-border pt-6 text-base text-muted-foreground">
            {emptyLabel}
          </p>
        )}
      </div>
    </section>
  );
}
