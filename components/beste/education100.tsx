"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuickFact {
  value: string;
  label: string;
  description?: string;
}

interface Education100Props {
  badge?: { label: string; variant?: "default" | "secondary" | "outline" };
  heading: string;
  description?: string;
  facts?: QuickFact[];
  className?: string;
}

export const education100Demo: Education100Props = {
  badge: { label: "At a Glance", variant: "secondary" },
  heading: "Quick Facts",
  description:
    "Key numbers that define who we are and what we've accomplished.",
  facts: [
    {
      value: "1890",
      label: "Year Founded",
      description: "Over 130 years of academic excellence",
    },
    {
      value: "22,000+",
      label: "Students",
      description: "Undergraduate and graduate enrollment",
    },
    {
      value: "1,800+",
      label: "Faculty Members",
      description: "World-class educators and researchers",
    },
    {
      value: "200+",
      label: "Degree Programs",
      description: "Across 12 schools and colleges",
    },
    {
      value: "15:1",
      label: "Student-Faculty Ratio",
      description: "Personalized attention for every student",
    },
    {
      value: "95%",
      label: "Placement Rate",
      description: "Employment within 6 months of graduation",
    },
    {
      value: "$500M+",
      label: "Financial Aid",
      description: "Awarded annually to students",
    },
    {
      value: "300+",
      label: "Student Organizations",
      description: "Clubs, sports, and activities",
    },
  ],
};

export function Education100({
  badge,
  heading,
  description,
  facts = [],
  className,
}: Education100Props) {
  return (
    <section className={cn("py-24", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {badge && (
            <Badge variant={badge.variant} className="mb-4">
              {badge.label}
            </Badge>
          )}
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        {facts.length > 0 && (
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact, i) => (
              <div
                key={i}
                className="rounded-xl border p-6 text-center transition-colors hover:bg-muted/50"
              >
                <p className="text-3xl font-bold text-primary">{fact.value}</p>
                <p className="mt-2 font-medium">{fact.label}</p>
                {fact.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {fact.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
