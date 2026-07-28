"use client";

import {
  Check,
  ChevronRight,
  Clock,
  Dumbbell,
  Hand,
  Heart,
  type LucideIcon,
  Scissors,
  Sparkles,
  Star,
  Waves,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Service {
  name: string;
  description: string;
  duration: string;
  price: string;
  category: string;
  icon: LucideIcon;
  badge?: string;
}

interface Booking4Labels {
  allCategory?: string;
  noSelection?: string;
  nextButton?: string;
}

interface Booking4Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  services?: Service[];
  labels?: Booking4Labels;
  className?: string;
}

export const booking4Demo: Booking4Props = {
  badge: { label: "Step 1 of 3", variant: "secondary" },
  heading: "Choose your <strong>service</strong>",
  description: "Browse our menu and pick the treatment that suits you best.",
  services: [
    {
      name: "Swedish Massage",
      description: "Gentle full-body massage for relaxation and stress relief",
      duration: "60 min",
      price: "$89",
      category: "Massage",
      icon: Hand,
      badge: "Popular",
    },
    {
      name: "Deep Tissue Massage",
      description: "Targeted pressure for chronic muscle tension and pain",
      duration: "60 min",
      price: "$120",
      category: "Massage",
      icon: Hand,
    },
    {
      name: "Hot Stone Therapy",
      description: "Heated stones placed on key points for deep relaxation",
      duration: "75 min",
      price: "$140",
      category: "Massage",
      icon: Sparkles,
    },
    {
      name: "Classic Facial",
      description: "Deep cleansing facial with extraction and hydration",
      duration: "45 min",
      price: "$75",
      category: "Skincare",
      icon: Heart,
    },
    {
      name: "Anti-Aging Treatment",
      description: "Advanced serum and LED therapy for youthful skin",
      duration: "60 min",
      price: "$150",
      category: "Skincare",
      icon: Star,
      badge: "Popular",
    },
    {
      name: "Haircut & Styling",
      description: "Precision cut with wash, blow-dry, and styling",
      duration: "45 min",
      price: "$65",
      category: "Hair",
      icon: Scissors,
    },
    {
      name: "Color Treatment",
      description: "Full or partial color with premium products",
      duration: "120 min",
      price: "$180",
      category: "Hair",
      icon: Waves,
    },
    {
      name: "Personal Training",
      description: "One-on-one session tailored to your fitness goals",
      duration: "50 min",
      price: "$95",
      category: "Fitness",
      icon: Dumbbell,
    },
  ],
  labels: {
    allCategory: "All",
    noSelection: "No service selected",
    nextButton: "Next Step",
  },
};

export function Booking4({
  badge,
  heading,
  description,
  services = [],
  labels = {},
  className,
}: Booking4Props) {
  const { allCategory = "All", noSelection, nextButton } = labels;

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(allCategory);

  const categories = useMemo(
    () => [allCategory, ...new Set(services.map((s) => s.category))],
    [services, allCategory]
  );

  const filteredServices = useMemo(() => {
    if (activeCategory === allCategory) return services;
    return services.filter((s) => s.category === activeCategory);
  }, [services, activeCategory, allCategory]);

  const selected = services.find((s) => s.name === selectedService);

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-lg px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
              </div>
            )}
            {heading && (
              <h2
                className="text-2xl font-semibold md:text-4xl [&>strong]:font-bold [&>strong]:text-primary"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}
            {description && (
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
            )}
          </div>
        )}

        <div className="group/booking4 overflow-hidden rounded-md border bg-card shadow-sm">
          {categories.length > 2 && (
            <div className="border-b p-4">
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-[480px] divide-y overflow-y-auto">
            {filteredServices.map((service, index) => {
              const isSelected = selectedService === service.name;
              const Icon = service.icon;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedService(service.name)}
                  className={cn(
                    "flex w-full cursor-pointer items-start gap-3 px-5 py-4 text-left transition-all",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-md transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">{service.name}</h3>
                      {service.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {service.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {service.duration}
                      </span>
                      <span className="font-semibold text-foreground">{service.price}</span>
                    </div>
                  </div>

                  <div className="mt-1 shrink-0">
                    {isSelected ? (
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-4" />
                      </div>
                    ) : (
                      <div className="size-6 rounded-full border-2 border-muted-foreground/20" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/30 px-5 py-4">
            <div className="text-base">
              {selected ? (
                <span>
                  <span className="font-medium">{selected.name}</span>
                  <span className="text-muted-foreground"> · {selected.price}</span>
                </span>
              ) : (
                <span className="text-muted-foreground">{noSelection}</span>
              )}
            </div>
            <Button
              disabled={!selected}
              className="cursor-pointer"
              onClick={() => {
                if (selected) console.log("Selected service:", selected);
              }}
            >
              {nextButton}
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
