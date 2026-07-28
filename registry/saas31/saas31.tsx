"use client";

import { ArrowRight, Clock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MetaItem {
  label: string;
  icon?: React.ReactNode;
}

interface JobPosition {
  title: string;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  meta?: MetaItem[];
  href: string;
}

interface Saas31Props {
  badge?: {
    label: string;
    icon?: React.ReactNode;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  positions?: JobPosition[];
  className?: string;
}

export const saas31Demo: Saas31Props = {
  heading: "Join our team",
  description: "We're building something special and looking for talented people.",
  positions: [
    {
      title: "Senior Frontend Engineer",
      badge: { label: "Engineering", variant: "secondary" },
      meta: [
        { label: "San Francisco, CA", icon: <MapPin className="size-4" /> },
        { label: "Full-time", icon: <Clock className="size-4" /> },
      ],
      href: "https://beste.co",
    },
    {
      title: "Product Designer",
      badge: { label: "Design", variant: "secondary" },
      meta: [
        { label: "Remote", icon: <MapPin className="size-4" /> },
        { label: "Full-time", icon: <Clock className="size-4" /> },
      ],
      href: "https://beste.co",
    },
    {
      title: "Developer Advocate",
      badge: { label: "Marketing", variant: "secondary" },
      meta: [
        { label: "New York, NY", icon: <MapPin className="size-4" /> },
        { label: "Full-time", icon: <Clock className="size-4" /> },
      ],
      href: "https://beste.co",
    },
    {
      title: "Customer Success Manager",
      badge: { label: "Sales", variant: "secondary" },
      meta: [
        { label: "Remote", icon: <MapPin className="size-4" /> },
        { label: "Full-time", icon: <Clock className="size-4" /> },
      ],
      href: "https://beste.co",
    },
  ],
};

export function Saas31({
  badge,
  heading,
  description,
  positions = [],
  className,
}: Saas31Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-3xl px-4 md:px-6">
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
          {positions.map((position, index) => (
            <Link
              key={index}
              href={position.href}
              className="group/saas31 flex justify-between gap-4 rounded-md border bg-card p-6 transition-colors hover:border-primary"
            >
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="font-semibold group-hover/saas31:text-primary">
                    {position.title}
                  </h3>
                  {position.badge && (
                    <Badge variant={position.badge.variant ?? "secondary"}>
                      {position.badge.label}
                    </Badge>
                  )}
                </div>
                {position.meta && position.meta.length > 0 && (
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {position.meta.map((item, metaIndex) => (
                      <div key={metaIndex} className="flex items-center gap-1">
                        {item.icon}
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover/saas31:translate-x-1 group-hover/saas31:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
