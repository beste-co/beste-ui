"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UseCaseFeature {
  id: string;
  text: string;
}

interface UseCaseItem {
  id: string;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  features?: UseCaseFeature[];
}

interface UseCase2Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  items: UseCaseItem[];
  columns?: 2 | 3;
  className?: string;
}

export const usecase2Demo: UseCase2Props = {
  badge: { label: "Solutions", variant: "secondary" },
  heading: "Tailored for Your Needs",
  description:
    "Explore how our platform adapts to different industries and use cases to deliver maximum value.",
  columns: 3,
  items: [
    {
      id: "startup",
      title: "Startups",
      description:
        "Launch faster with pre-built templates, automated workflows, and scalable infrastructure that grows with your business.",
      image: {
        src: "https://images.unsplash.com/photo-1765775356127-520bc54f6fa9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Startup workspace",
      },
      features: [
        { id: "f1", text: "Quick setup in minutes" },
        { id: "f2", text: "Scalable from day one" },
        { id: "f3", text: "Cost-effective pricing" },
      ],
    },
    {
      id: "enterprise",
      title: "Enterprise",
      description:
        "Enterprise-grade security, compliance, and customization options for large organizations with complex requirements.",
      image: {
        src: "https://images.unsplash.com/photo-1651935636718-9a1f34179b2a?q=80&w=1635&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Enterprise building",
      },
      features: [
        { id: "f4", text: "SOC 2 compliant" },
        { id: "f5", text: "Unlimited team members" },
        { id: "f6", text: "24/7 priority support" },
      ],
    },
    {
      id: "agency",
      title: "Agencies",
      description:
        "Manage multiple client projects, collaborate with teams, and deliver stunning results on time, every time.",
      image: {
        src: "https://images.unsplash.com/photo-1719689720051-0d76bce5f8a7?q=80&w=1635&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Agency workspace",
      },
      features: [
        { id: "f7", text: "Multi-project management" },
        { id: "f8", text: "Client collaboration" },
        { id: "f9", text: "White-label options" },
      ],
    },
  ],
};

export function UseCase2({
  badge,
  heading,
  description,
  items,
  columns = 3,
  className,
}: UseCase2Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          {badge?.label && (
            <div className="mb-6 flex justify-center">
              <Badge variant={badge.variant ?? "secondary"}>
                {badge.label}
              </Badge>
            </div>
          )}
          {heading && (
            <h2 className="text-2xl md:text-4xl font-semibold text-balance max-w-4xl mx-auto">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Cards Grid */}
        <div
          className={cn(
            "grid gap-6",
            columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="group/usecase2 rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Card Image */}
              {item.image && (
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/usecase2:scale-105"
                  />
                </div>
              )}

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>

                {/* Features */}
                {item.features && item.features.length > 0 && (
                  <ul className="space-y-2">
                    {item.features.map((feature) => (
                      <li
                        key={feature.id}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="size-4 flex-shrink-0 text-primary" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
