"use client";

import {
  Building,
  Check,
  Cloud,
  GraduationCap,
  HeartPulse,
  Landmark,
  ShoppingCart,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UseCaseFeature {
  id: string;
  text: string;
}

interface UseCaseItem {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  features?: UseCaseFeature[];
}

interface UseCase4Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  items: UseCaseItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const usecase4Demo: UseCase4Props = {
  badge: { label: "Industries", variant: "secondary" },
  heading: "Trusted Across Industries",
  description:
    "See how leading companies in various sectors leverage our platform to drive growth and innovation.",
  columns: 3,
  items: [
    {
      id: "healthcare",
      icon: <HeartPulse className="size-5" />,
      title: "Healthcare",
      description:
        "HIPAA-compliant solutions for patient data management, telehealth, and medical records.",
      image: {
        src: "https://images.unsplash.com/photo-1621253339533-fb93d1e5e0ab?q=80&w=3111&auto=format&fit=crop",
        alt: "Healthcare",
      },
      features: [
        { id: "h1", text: "HIPAA compliant" },
        { id: "h2", text: "Telehealth ready" },
      ],
    },
    {
      id: "fintech",
      icon: <Landmark className="size-5" />,
      title: "Financial Services",
      description:
        "Secure banking solutions with real-time fraud detection and regulatory compliance built-in.",
      image: {
        src: "https://images.unsplash.com/photo-1661155636384-3ce2911d9772?q=80&w=2950&auto=format&fit=crop",
        alt: "Finance",
      },
      features: [
        { id: "f1", text: "Bank-grade security" },
        { id: "f2", text: "SOC 2 Type II" },
      ],
    },
    {
      id: "ecommerce",
      icon: <ShoppingCart className="size-5" />,
      title: "E-Commerce",
      description:
        "Scalable storefronts with inventory management, payment processing, and analytics.",
      image: {
        src: "https://images.unsplash.com/photo-1561133350-0a798c546e93?q=80&w=3132&auto=format&fit=crop",
        alt: "E-commerce",
      },
      features: [
        { id: "e1", text: "Multi-payment support" },
        { id: "e2", text: "Inventory sync" },
      ],
    },
    {
      id: "education",
      icon: <GraduationCap className="size-5" />,
      title: "Education",
      description:
        "Learning management systems with course creation, student tracking, and certification.",
      image: {
        src: "https://images.unsplash.com/photo-1675894661450-270b00dea37e?q=80&w=2874&auto=format&fit=crop",
        alt: "Education",
      },
      features: [
        { id: "ed1", text: "Course builder" },
        { id: "ed2", text: "Certifications" },
      ],
    },
    {
      id: "saas",
      icon: <Cloud className="size-5" />,
      title: "SaaS",
      description:
        "Build and scale your software products with multi-tenancy, billing, and user management.",
      image: {
        src: "https://images.unsplash.com/photo-1577108786363-f273694ff170?q=80&w=2940&auto=format&fit=crop",
        alt: "SaaS",
      },
      features: [
        { id: "s1", text: "Multi-tenant" },
        { id: "s2", text: "Billing integration" },
      ],
    },
    {
      id: "real-estate",
      icon: <Building className="size-5" />,
      title: "Real Estate",
      description:
        "Property management systems with listing management, tenant management, and rental analytics.",
      image: {
        src: "https://images.unsplash.com/photo-1650953745406-41602ae284e3?q=80&w=2940&auto=format&fit=crop",
        alt: "Real Estate",
      },
      features: [
        { id: "r1", text: "Listing management" },
        { id: "r2", text: "Tenant management" },
      ],
    },
  ],
};

export function UseCase4({
  badge,
  heading,
  description,
  items,
  columns = 3,
  className,
}: UseCase4Props) {
  const getColumnClasses = () => {
    switch (columns) {
      case 2:
        return "md:grid-cols-2";
      case 4:
        return "sm:grid-cols-2 lg:grid-cols-4";
      default:
        return "sm:grid-cols-2 lg:grid-cols-3";
    }
  };

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

        {/* Grid Cards */}
        <div className={cn("grid gap-6", getColumnClasses())}>
          {items.map((item) => (
            <div
              key={item.id}
              className="group/usecase4 rounded-lg overflow-hidden transition-all duration-300 bg-muted/30 ring-1 ring-foreground/5"
            >
              {/* Card Media */}
              {item.image && (
                <div className="aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={800}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/usecase4:scale-105"
                  />
                </div>
              )}

              {/* Card Content */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  {item.icon && (
                    <span className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary group-hover/usecase4:bg-primary group-hover/usecase4:text-background">
                      {item.icon}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>

                {item.features && item.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature) => (
                      <span
                        key={feature.id}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full bg-foreground/5 text-foreground/70"
                      >
                        <Check className="size-3" />
                        {feature.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
