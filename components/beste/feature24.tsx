"use client";

import {
  Activity,
  ArrowRight,
  Check,
  ChevronRight,
  Search,
  ShieldCheck,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Bullet {
  text: string;
}

interface Item {
  id: string;
  icon?: React.ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  bullets?: Bullet[];
  href?: string;
  linkLabel?: string;
}

interface Feature24Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  items?: Item[];
  className?: string;
}

export const feature24Demo: Feature24Props = {
  badge: { label: "Capabilities", variant: "default" },
  heading: "One section, four workflows",
  description:
    "Hover to preview. Each workflow comes with a focused UI and a clear outcome—less hunting, more shipping.",
  items: [
    {
      id: "workflow-1",
      icon: <Search className="size-5" />,
      eyebrow: "Find",
      title: "Search that understands intent",
      description:
        "Filter across content, sections, and assets. Save views for repeatable audits.",
      image: {
        src: "https://images.unsplash.com/photo-1749703935846-9981088d6d39?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDV8TThqVmJMYlRSd3N8fGVufDB8fHx8fA%3D%3D",
        alt: "Dashboard search",
      },
      bullets: [
        { text: "Saved filters and shortcuts" },
        { text: "Fast keyboard navigation" },
        { text: "Index health indicators" },
      ],
      href: "#",
      linkLabel: "Explore search",
    },
    {
      id: "workflow-2",
      icon: <Wand2 className="size-5" />,
      eyebrow: "Build",
      title: "Reusable blocks, consistent pages",
      description:
        "Compose pages from section presets and keep styles consistent with smart defaults.",
      image: {
        src: "https://images.unsplash.com/photo-1749705319317-f9a2bf24fe3d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8M3x8fGVufDB8fHx8fA%3D%3D",
        alt: "Building UI",
      },
      bullets: [
        { text: "Section presets with sensible spacing" },
        { text: "Reusable components across pages" },
        { text: "Fast preview without publish" },
      ],
      href: "#",
      linkLabel: "See builder",
    },
    {
      id: "workflow-3",
      icon: <ShieldCheck className="size-5" />,
      eyebrow: "Protect",
      title: "Publish with guardrails",
      description:
        "Preflight checks for broken links, missing alt text, and incomplete metadata.",
      image: {
        src: "https://images.unsplash.com/photo-1749704015814-edb3a318abe5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Mjd8fHxlbnwwfHx8fHw%3D",
        alt: "Quality checks",
      },
      bullets: [
        { text: "Automated preflight validation" },
        { text: "Role-based approvals" },
        { text: "One-click rollback" },
      ],
      href: "#",
      linkLabel: "View checks",
    },
    {
      id: "workflow-4",
      icon: <Activity className="size-5" />,
      eyebrow: "Measure",
      title: "Know what worked",
      description:
        "Track conversions and content performance without wiring up custom dashboards.",
      image: {
        src: "https://images.unsplash.com/photo-1749704002530-d076ba0ea2c9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MzV8fHxlbnwwfHx8fHw%3D",
        alt: "Analytics overview",
      },
      bullets: [
        { text: "Per-section click tracking" },
        { text: "Form conversion insights" },
        { text: "Performance alerts" },
      ],
      href: "#",
      linkLabel: "Open insights",
    },
  ],
};

export function Feature24({
  badge,
  heading,
  description,
  items = [],
  className,
}: Feature24Props) {
  const [activeId, setActiveId] = useState(items[0]?.id || "");

  const activeItem = useMemo(
    () => items.find((i) => i.id === activeId) || items[0],
    [items, activeId]
  );

  if (!items.length) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mb-12 flex flex-col gap-4 text-center">
            {badge && (
              <div className="flex justify-center">
                <Badge variant={badge.variant ?? "default"}>
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl font-semibold md:text-5xl">{heading}</h2>
            )}
            {description && (
              <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Mobile: stacked cards */}
        <div className="grid gap-4 lg:hidden">
          {items.map((item) => {
            const bullets = (item.bullets || [])
              .map((b) => b.text)
              .filter(Boolean)
              .slice(0, 4);
            return (
              <div key={item.id} className="rounded-lg bg-muted p-6">
                <div className="flex items-start gap-3">
                  {item.icon && (
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">
                      {item.icon}
                    </span>
                  )}
                  <div className="min-w-0">
                    {item.eyebrow && (
                      <p className="text-xs font-medium text-muted-foreground">
                        {item.eyebrow}
                      </p>
                    )}
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    {item.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {item.image && (
                  <div className="mt-5 overflow-hidden rounded-lg relative aspect-video">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {bullets.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {bullets.map((text, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{text}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {item.href && (
                  <div className="mt-5">
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.href} className="gap-2">
                        {item.linkLabel || "Learn more"}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop: hover-to-preview */}
        <div className="hidden gap-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-3">
            {items.map((item) => {
              const isActive = item.id === activeItem?.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActiveId(item.id)}
                  onFocus={() => setActiveId(item.id)}
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "w-full text-left rounded-lg border border-transparent bg-muted p-5 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive && "bg-background border-primary"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "inline-flex size-10 shrink-0 items-center justify-center rounded-lg",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background"
                      )}
                    >
                      {item.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          {item.eyebrow && (
                            <p className="text-xs font-medium text-muted-foreground">
                              {item.eyebrow}
                            </p>
                          )}
                          <h3 className="text-base font-semibold">
                            {item.title}
                          </h3>
                        </div>
                        <ChevronRight
                          className={cn(
                            "w-5 h-5 shrink-0 opacity-40 transition-opacity",
                            isActive && "opacity-100"
                          )}
                        />
                      </div>
                      {item.description && (
                        <p className="mt-2 text-sm line-clamp-2 text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-lg bg-muted p-6">
            {activeItem && (
              <div key={activeItem.id}>
                {activeItem.image ? (
                  <div className="overflow-hidden rounded-lg relative aspect-video">
                    <Image
                      src={activeItem.image.src}
                      alt={activeItem.image.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-lg bg-background" />
                )}

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      {activeItem.eyebrow && (
                        <p className="text-xs font-medium text-muted-foreground">
                          {activeItem.eyebrow}
                        </p>
                      )}
                      <h3 className="text-xl font-semibold">
                        {activeItem.title}
                      </h3>
                    </div>
                  </div>

                  {activeItem.description && (
                    <p className="mt-2 text-sm md:text-base text-muted-foreground">
                      {activeItem.description}
                    </p>
                  )}

                  {activeItem.bullets && activeItem.bullets.length > 0 && (
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {activeItem.bullets
                        .map((b) => b.text)
                        .filter(Boolean)
                        .slice(0, 6)
                        .map((text, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Check className="w-3 h-3 mt-1 text-primary" />
                            <span className="text-muted-foreground">
                              {text}
                            </span>
                          </li>
                        ))}
                    </ul>
                  )}

                  {activeItem.href && (
                    <div className="mt-6">
                      <Button variant="outline" asChild>
                        <Link href={activeItem.href} className="gap-2">
                          {activeItem.linkLabel || "Learn more"}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
