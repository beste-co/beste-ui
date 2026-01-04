"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TestimonialQuote {
  id: string;
  quote: string;
  author?: string;
  role?: string;
}

interface ButtonItem {
  id: string;
  label: string;
  href?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
}

interface Testimonial8Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  quotes?: TestimonialQuote[];
  buttons?: ButtonItem[];
  className?: string;
}

export const testimonial8Demo: Testimonial8Props = {
  badge: { label: "Testimonials", variant: "secondary" },
  heading: "What our users say",
  description:
    "Don't just take our word for it. Here's what teams are saying after switching to our platform.",
  quotes: [
    {
      id: "quote-1",
      quote:
        "We cut our deployment time from hours to minutes. The automation tools are incredibly intuitive.",
      author: "Sarah Chen",
      role: "CTO at Streamline",
    },
    {
      id: "quote-2",
      quote:
        "Finally, a platform that doesn't require a PhD to operate. Our entire team was onboarded in a day.",
      author: "Marcus Webb",
      role: "Engineering Lead at Pulse",
    },
    {
      id: "quote-3",
      quote:
        "The support team is phenomenal. Every question answered <strong>within the hour</strong>, every time.</strong>",
      author: "Lisa Park",
      role: "Product Manager at Vertex",
    },
  ],
  buttons: [
    { id: "btn-1", label: "Read more stories", href: "https://beste.co" },
  ],
};

export function Testimonial8({
  badge,
  heading,
  description,
  quotes = [],
  buttons = [],
  className,
}: Testimonial8Props) {
  if (quotes.length === 0) return null;

  const getGridColumns = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count % 4 === 0) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    if (count % 3 === 0) return "grid-cols-1 md:grid-cols-3";
    return "grid-cols-1 md:grid-cols-3";
  };

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 md:mb-16 max-w-3xl text-center">
            {badge && (
              <div className="mb-5 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl font-semibold md:text-5xl">{heading}</h2>
            )}
            {description && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className={cn("grid gap-6", getGridColumns(quotes.length))}>
          {quotes.map((item) => (
            <div
              key={item.id}
              className="relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 md:p-8"
            >
              {/* Large quote mark */}
              <div className="absolute -top-4 left-6 text-6xl font-serif text-primary/20">
                "
              </div>

              <blockquote className="relative pt-4">
                <div
                  className="text-base leading-relaxed md:text-lg text-card-foreground"
                  dangerouslySetInnerHTML={{ __html: item.quote }}
                />
              </blockquote>

              {/* Author info - at the bottom of the card */}
              {(item.author || item.role) && (
                <div className="mt-6 border-t border-border pt-4">
                  {item.author && (
                    <div className="font-semibold text-card-foreground">
                      {item.author}
                    </div>
                  )}
                  {item.role && (
                    <div className="text-sm text-muted-foreground">
                      {item.role}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {buttons.length > 0 && (
          <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-3">
            {buttons.map((button) => (
              <Button
                key={button.id}
                variant={button.variant ?? "default"}
                asChild
              >
                <Link href={button.href ?? "#"}>{button.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
