"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  description: string;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
}

interface Saas16Props {
  badge?: {
    label: string;
    icon?: React.ReactNode;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  items?: ChangelogItem[];
  className?: string;
}

export const saas16Demo: Saas16Props = {
  heading: "What's new",
  description: "The latest updates and improvements to our platform.",
  items: [
    {
      version: "2.4.0",
      date: "Dec 15, 2024",
      title: "Real-time collaboration",
      description:
        "Work together with your team in real-time. See cursors, selections, and changes as they happen.",
      badge: { label: "Feature", variant: "default" },
    },
    {
      version: "2.3.2",
      date: "Dec 10, 2024",
      title: "Performance improvements",
      description:
        "We've optimized our backend to reduce API response times by 40%.",
      badge: { label: "Improvement", variant: "secondary" },
    },
    {
      version: "2.3.1",
      date: "Dec 5, 2024",
      title: "Bug fixes",
      description:
        "Fixed an issue where exports would occasionally fail for large datasets.",
      badge: { label: "Fix", variant: "outline" },
    },
  ],
};

export function Saas16({
  badge,
  heading,
  description,
  items = [],
  className,
}: Saas16Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-2xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"} className="gap-1.5">
                  {badge.icon}
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <div className="mx-auto max-w-xl space-y-4">
          {items.map((item, index) => (
            <div key={index} className="rounded-md border bg-card p-6">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge variant="outline">{item.version}</Badge>
                {item.badge && (
                  <Badge variant={item.badge.variant ?? "default"}>
                    {item.badge.label}
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {item.date}
                </span>
              </div>
              <h3 className="mb-2 font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
