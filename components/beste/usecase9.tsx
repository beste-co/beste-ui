"use client";

import { Cloud, PenTool, Rocket, ShoppingCart, Users } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UseCaseItem {
  id: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  size?: "small" | "medium" | "large";
}

interface UseCase9Props {
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

export const usecase9Demo: UseCase9Props = {
  badge: { label: "Solutions", variant: "secondary" },
  heading: "Built for Every Use Case",
  description:
    "Discover how our platform adapts to your unique needs with flexible solutions.",
  columns: 3,
  items: [
    {
      id: "startups",
      icon: <Rocket className="size-5" />,
      title: "Startups",
      description:
        "Launch faster with pre-built templates and scalable infrastructure that grows with you.",
      size: "large",
      image: {
        src: "https://images.unsplash.com/photo-1724701414511-83daf4090439?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Startups",
      },
    },
    {
      id: "agencies",
      icon: <Users className="size-5" />,
      title: "Agencies",
      description:
        "Manage multiple client projects with ease using our multi-tenant architecture.",
      size: "small",
    },
    {
      id: "ecommerce",
      icon: <ShoppingCart className="size-5" />,
      title: "E-Commerce",
      description:
        "Build and scale online stores with integrated payments and inventory.",
      size: "medium",
      image: {
        src: "https://images.unsplash.com/photo-1760647832580-ac00747e199b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "E-Commerce",
      },
    },
    {
      id: "saas",
      icon: <Cloud className="size-5" />,
      title: "SaaS Products",
      description:
        "Create subscription-based products with built-in billing and user management.",
      size: "medium",
      image: {
        src: "https://images.unsplash.com/photo-1567336371425-96291e39b80a?q=80&w=2576&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "SaaS",
      },
    },
    {
      id: "creators",
      icon: <PenTool className="size-5" />,
      title: "Creators",
      description: "Showcase your portfolio and monetize your content.",
      size: "small",
    },
  ],
};

export function UseCase9({
  badge,
  heading,
  description,
  items,
  columns = 3,
  className,
}: UseCase9Props) {
  const getColumnClasses = () => {
    switch (columns) {
      case 2:
        return "columns-1 md:columns-2";
      case 4:
        return "columns-1 sm:columns-2 lg:columns-4";
      default:
        return "columns-1 sm:columns-2 lg:columns-3";
    }
  };

  const getSizeClasses = (size?: "small" | "medium" | "large") => {
    switch (size) {
      case "large":
        return "min-h-72 sm:min-h-0 sm:h-[632px]";
      case "medium":
        return "min-h-72 sm:min-h-0 sm:h-[416px]";
      default:
        return "min-h-72 sm:min-h-0 sm:h-[200px]";
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

        {/* Masonry Grid */}
        <div className={cn(getColumnClasses(), "gap-4")}>
          {items.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid mb-4 group/usecase9"
            >
              <div
                className={cn(
                  "flex flex-col rounded-lg overflow-hidden relative group bg-muted/30 ring-1 ring-foreground/5",
                  getSizeClasses(item.size)
                )}
              >
                {/* Background Image */}
                {item.image && (
                  <div className="absolute inset-0">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className="relative flex-1 flex flex-col justify-end p-6">
                  {item.icon && (
                    <span className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-primary/10 text-primary group-hover/usecase9:bg-primary group-hover/usecase9:text-background">
                      {item.icon}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-base text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
