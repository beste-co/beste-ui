"use client";

import {
  BarChart3,
  Code,
  Headphones,
  Plug,
  Shield,
  Smartphone,
  Users,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UseCaseItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface UseCase5Props {
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

export const usecase5Demo: UseCase5Props = {
  badge: { label: "Features", variant: "secondary" },
  heading: "Everything You Need",
  description:
    "A comprehensive toolkit designed to help you accomplish more with less effort.",
  columns: 4,
  items: [
    {
      id: "analytics",
      icon: <BarChart3 className="size-7" />,
      title: "Analytics",
      description:
        "Track performance with real-time dashboards and detailed reports.",
    },
    {
      id: "automation",
      icon: <Wand2 className="size-7" />,
      title: "Automation",
      description: "Automate repetitive tasks and workflows to save time.",
    },
    {
      id: "collaboration",
      icon: <Users className="size-7" />,
      title: "Collaboration",
      description: "Work together seamlessly with team features and sharing.",
    },
    {
      id: "security",
      icon: <Shield className="size-7" />,
      title: "Security",
      description:
        "Enterprise-grade security with encryption and access controls.",
    },
    {
      id: "integrations",
      icon: <Plug className="size-7" />,
      title: "Integrations",
      description: "Connect with 100+ tools and services you already use.",
    },
    {
      id: "support",
      icon: <Headphones className="size-7" />,
      title: "24/7 Support",
      description: "Get help whenever you need it from our expert team.",
    },
    {
      id: "api",
      icon: <Code className="size-7" />,
      title: "Developer API",
      description: "Build custom solutions with our comprehensive API.",
    },
    {
      id: "mobile",
      icon: <Smartphone className="size-7" />,
      title: "Mobile Ready",
      description: "Access everything on the go with native mobile apps.",
    },
  ],
};

export function UseCase5({
  badge,
  heading,
  description,
  items,
  columns = 4,
  className,
}: UseCase5Props) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
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

        {/* Icon Grid */}
        <div className={cn("grid gap-6", gridCols[columns])}>
          {items.map((item) => (
            <div
              key={item.id}
              className="group/usecase5 text-center p-6 rounded-xl transition-all duration-300 hover:bg-foreground/[0.03]"
            >
              {item.icon && (
                <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center transition-all duration-300 bg-primary/10 group-hover/usecase5:bg-primary group-hover/usecase5:text-background text-primary">
                  {item.icon}
                </div>
              )}
              <h3 className="text-base font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
