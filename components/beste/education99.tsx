"use client";

import { Building, Globe, type LucideIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string;
}

interface OrganizationItem {
  id?: string;
  name: string;
  location: string;
  icon?: LucideIcon;
}

interface Education99Props {
  badge?: { label: string; variant?: "default" | "secondary" | "outline" };
  heading?: string;
  description?: string;
  stats?: StatItem[];
  organizations?: OrganizationItem[];
  className?: string;
}

export const education99Demo: Education99Props = {
  badge: { label: "Global Network", variant: "secondary" },
  heading: "International Partnerships",
  description:
    "We collaborate with leading institutions worldwide, providing students with global learning opportunities.",
  stats: [
    { label: "Countries", value: "45+" },
    { label: "Partner Institutions", value: "150+" },
    { label: "Annual Exchanges", value: "500+" },
  ],
  organizations: [
    {
      id: "1",
      name: "University of Oxford",
      location: "United Kingdom",
      icon: Building,
    },
    {
      id: "2",
      name: "Technical University of Munich",
      location: "Germany",
      icon: Building,
    },
    {
      id: "3",
      name: "National University of Singapore",
      location: "Singapore",
      icon: Building,
    },
    {
      id: "4",
      name: "ETH Zurich",
      location: "Switzerland",
      icon: Globe,
    },
    {
      id: "5",
      name: "CERN",
      location: "Switzerland",
      icon: Globe,
    },
    {
      id: "6",
      name: "Microsoft Research",
      location: "United States",
      icon: Users,
    },
  ],
};

export function Education99({
  badge,
  heading,
  description,
  stats = [],
  organizations = [],
  className,
}: Education99Props) {
  const count = organizations.length;
  const columnCount =
    count >= 5 ? 3 : count % 4 === 0 ? 4 : count % 3 === 0 ? 3 : 2;
  const gridCols =
    columnCount === 4
      ? "lg:grid-cols-"
      : columnCount === 3
      ? "lg:grid-cols-3"
      : "lg:grid-cols-2";

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {badge && (
            <Badge variant={badge.variant} className="mb-4">
              {badge.label}
            </Badge>
          )}
          {heading && (
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        {stats.length > 0 && (
          <div className="mx-auto mt-12 flex max-w-3xl gap-6 md:gap-8 justify-center items-center">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {organizations.length > 0 && (
          <div
            className={cn(
              "mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-2",
              gridCols
            )}
          >
            {organizations.map((org) => {
              const Icon = org.icon || Building;
              return (
                <div
                  key={org.id ?? org.name}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-4"
                  )}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="size-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{org.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {org.location}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
