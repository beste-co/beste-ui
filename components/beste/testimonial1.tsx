"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TestimonialItem {
  id: string;
  text: string;
  name: string;
  role: string;
  avatar?: {
    src: string;
    alt: string;
  };
}

interface Testimonial1Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  testimonials: TestimonialItem[];
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
}

export const testimonial1Demo: Testimonial1Props = {
  badge: { label: "Testimonials", variant: "secondary" },
  heading: "Loved by teams worldwide",
  description:
    "Hear from the people who use our platform every day to build amazing things.",
  testimonials: [
    {
      id: "testimonial-1",
      text: "This platform has completely transformed how our team collaborates. The intuitive interface and powerful features have made us more productive than ever.",
      name: "Sarah Chen",
      role: "Engineering Manager at TechCorp",
      avatar: {
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
        alt: "Sarah Chen",
      },
    },
    {
      id: "testimonial-2",
      text: "I've tried many similar tools, but nothing comes close. The attention to detail and customer support are unmatched in the industry.",
      name: "Marcus Johnson",
      role: "Product Designer at Startup Inc",
      avatar: {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        alt: "Marcus Johnson",
      },
    },
    {
      id: "testimonial-3",
      text: "We reduced our development time by 40% after switching. It's not just a tool, it's a game changer for our entire workflow.",
      name: "Emily Rodriguez",
      role: "CTO at Innovation Labs",
      avatar: {
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        alt: "Emily Rodriguez",
      },
    },
  ],
  autoplay: true,
  autoplayDelay: 5000,
};

export function Testimonial1({
  badge,
  heading,
  description,
  testimonials,
  autoplay = true,
  autoplayDelay = 5000,
  className,
}: Testimonial1Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const autoplayPlugin = Autoplay({
    delay: autoplayDelay,
    stopOnInteraction: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    autoplay ? [autoplayPlugin] : []
  );

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto w-full px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-16 max-w-3xl text-center">
            {badge && (
              <div className="mb-5 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl font-semibold md:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="min-w-0 flex-[0_0_100%] px-4"
              >
                <div className="flex flex-col items-center text-center">
                  <p className="mb-8 max-w-4xl text-lg font-normal md:px-8 lg:text-2xl">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  {testimonial.avatar?.src && (
                    <div className="relative size-24 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.avatar.src}
                        alt={testimonial.avatar.alt ?? testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="mt-4 text-sm font-medium md:text-lg">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {testimonials.length > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => scrollTo(index)}
                className="p-2"
              >
                <div
                  className={cn(
                    "size-2 rounded-full transition-colors",
                    index === selectedIndex ? "bg-primary" : "bg-muted"
                  )}
                />
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
