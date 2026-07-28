"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FeatureCardItem {
  title: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
}

interface Feature177Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  items?: FeatureCardItem[];
  className?: string;
}

export const feature177Demo: Feature177Props = {
  badge: { label: "Features", variant: "default" },
  heading: "Everything you need to <strong>build faster</strong>",
  description:
    "Our platform provides all the tools you need to ship products quickly and confidently.",
  items: [
    {
      title: "Analytics Dashboard",
      description: "Track your metrics in real-time with our powerful analytics dashboard.",
      image: {
        src: "https://images.unsplash.com/photo-1697133081695-90070de25bc3?w=800&h=500&fit=crop",
        alt: "Analytics dashboard",
      },
    },
    {
      title: "Team Collaboration",
      description: "Work together seamlessly with built-in collaboration tools.",
      image: {
        src: "https://images.unsplash.com/photo-1574281160075-6eb5f7bfe645?w=800&h=500&fit=crop",
        alt: "Team collaboration",
      },
    },
    {
      title: "Automated Workflows",
      description: "Automate repetitive tasks and focus on what matters most.",
      image: {
        src: "https://images.unsplash.com/photo-1592838981793-f3ebf267056d?w=800&h=500&fit=crop",
        alt: "Automated workflows",
      },
    },
    {
      title: "Security First",
      description:
        "Enterprise-grade security with end-to-end encryption and compliance certifications.",
      image: {
        src: "https://images.unsplash.com/photo-1626033121423-c1a82ba72da0?w=800&h=500&fit=crop",
        alt: "Security features",
      },
    },
    {
      title: "Global Infrastructure",
      description:
        "Deploy to 30+ regions worldwide with automatic scaling and 99.99% uptime guarantee.",
      image: {
        src: "https://images.unsplash.com/photo-1606162446244-0e3fd9cf11c2?w=800&h=500&fit=crop",
        alt: "Global infrastructure",
      },
    },
  ],
};

export function Feature177({
  badge,
  heading,
  description,
  items = [],
  className,
}: Feature177Props) {
  const topItems = items.slice(0, 3);
  const bottomItems = items.slice(3, 5);

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
              </div>
            )}
            {heading && (
              <h2
                className="text-2xl font-semibold md:text-4xl [&>strong]:text-primary [&>strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}
            {description && (
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
            )}
          </div>
        )}

        {topItems.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {topItems.map((item, index) => (
              <div
                key={index}
                className="group/feature177 flex flex-col overflow-hidden rounded-md border bg-card"
              >
                <div className="flex-1 p-6">
                  <h3 className="text-base font-medium md:text-lg">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
                {item.image && (
                  <div className="relative mt-auto aspect-[16/10]">
                    <img
                      className="absolute inset-0 size-full object-cover"
                      src={item.image.src}
                      alt={item.image.alt}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {bottomItems.length > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {bottomItems.map((item, index) => (
              <div
                key={index}
                className="group/feature177 flex flex-col overflow-hidden rounded-md border bg-card"
              >
                <div className="flex-1 p-6">
                  <h3 className="text-base font-medium md:text-lg">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
                {item.image && (
                  <div className="relative mt-auto aspect-[16/10]">
                    <img
                      className="absolute inset-0 size-full object-cover"
                      src={item.image.src}
                      alt={item.image.alt}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
