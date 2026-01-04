"use client";

import { Check, Hammer, Palette, Rocket, Search } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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

interface UseCase8Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  items: UseCaseItem[];
  className?: string;
}

export const usecase8Demo: UseCase8Props = {
  badge: { label: "Journey", variant: "secondary" },
  heading: "Your Path to Success",
  description:
    "Follow this proven journey to transform your business and achieve your goals.",
  items: [
    {
      id: "discovery",
      icon: <Search className="size-5" />,
      title: "Discovery & Planning",
      description:
        "We start by understanding your unique challenges, goals, and requirements. Our team conducts thorough research and creates a customized roadmap.",
      image: {
        src: "https://images.unsplash.com/photo-1765498068281-67e9971c0b98?w=900&auto=format&fit=crop&q=60",
        alt: "Discovery",
      },
      features: [
        { id: "d1", text: "Requirements analysis" },
        { id: "d2", text: "Strategic roadmap" },
      ],
    },
    {
      id: "design",
      icon: <Palette className="size-5" />,
      title: "Design & Architecture",
      description:
        "Our experts design a scalable solution architecture and create intuitive user experiences that align with your brand.",
      image: {
        src: "https://images.unsplash.com/photo-1759979743853-d2dfa0619a23?w=900&auto=format&fit=crop&q=60",
        alt: "Design",
      },
      features: [
        { id: "de1", text: "UI/UX design" },
        { id: "de2", text: "System architecture" },
      ],
    },
    {
      id: "build",
      icon: <Hammer className="size-5" />,
      title: "Development & Testing",
      description:
        "We build your solution using modern technologies and best practices, with rigorous testing at every stage.",
      image: {
        src: "https://images.unsplash.com/photo-1765230182338-9542f1bb7a39?w=900&auto=format&fit=crop&q=60",
        alt: "Development",
      },
      features: [
        { id: "b1", text: "Agile development" },
        { id: "b2", text: "Quality assurance" },
      ],
    },
    {
      id: "launch",
      icon: <Rocket className="size-5" />,
      title: "Launch & Optimize",
      description:
        "We deploy your solution and continuously monitor and optimize performance to ensure maximum impact.",
      image: {
        src: "https://images.unsplash.com/photo-1765448054070-0a37ade9477e?w=900&auto=format&fit=crop&q=60",
        alt: "Launch",
      },
      features: [
        { id: "l1", text: "Global deployment" },
        { id: "l2", text: "Performance monitoring" },
      ],
    },
  ],
};

export function UseCase8({
  badge,
  heading,
  description,
  items,
  className,
}: UseCase8Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
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

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line - hidden on mobile */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block bg-foreground/10" />

          {/* Timeline Items */}
          <div className="space-y-12 md:space-y-16">
            {items.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={item.id} className="relative">
                  {/* Timeline Dot - hidden on mobile */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 z-10 hidden md:block bg-background border-primary" />

                  {/* Content */}
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6 items-center">
                    {/* Text Content */}
                    <div
                      className={cn(
                        "space-y-4 md:space-y-6",
                        isEven
                          ? "md:pr-12 md:text-right"
                          : "md:pl-12 md:order-2"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3",
                          isEven && "md:flex-row-reverse"
                        )}
                      >
                        {item.icon && (
                          <span className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary group-hover/usecase8:bg-primary group-hover/usecase8:text-background">
                            {item.icon}
                          </span>
                        )}
                        <h3 className="text-lg md:text-xl font-semibold">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-muted-foreground text-base md:text-lg">
                        {item.description}
                      </p>

                      {item.features && item.features.length > 0 && (
                        <ul
                          className={cn(
                            "space-y-1.5",
                            isEven && "md:flex md:flex-col md:items-end"
                          )}
                        >
                          {item.features.map((feature) => (
                            <li
                              key={feature.id}
                              className={cn(
                                "flex items-center gap-2 text-sm md:text-base text-muted-foreground",
                                isEven && "md:flex-row-reverse"
                              )}
                            >
                              <Check className="size-4 text-primary flex-shrink-0" />
                              <span>{feature.text}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Image */}
                    <div
                      className={cn(
                        isEven ? "md:pl-12 md:order-2" : "md:pr-12"
                      )}
                    >
                      {item.image && (
                        <div className="aspect-video rounded-lg overflow-hidden ring-1 ring-foreground/10">
                          <Image
                            src={item.image.src}
                            alt={item.image.alt}
                            width={800}
                            height={450}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
