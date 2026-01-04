"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Testimonial6Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  quote: string;
  author?: {
    name: string;
    position?: string;
    avatar?: {
      src: string;
      alt: string;
    };
  };
  className?: string;
}

export const testimonial6Demo: Testimonial6Props = {
  badge: { label: "Testimonial", variant: "outline" },
  quote:
    "Switching to this platform completely changed how our team works. Tasks that used to take hours are now done in minutes — and collaboration feels effortless.",
  author: {
    name: "Ava Thompson",
    position: "Product Lead at NovaLabs",
    avatar: {
      src: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=150&h=150&fit=crop&crop=face",
      alt: "Ava Thompson",
    },
  },
};

export function Testimonial6({
  badge,
  quote,
  author,
  className,
}: Testimonial6Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-8 text-center">
          {badge && (
            <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
          )}

          <blockquote className="text-xl font-medium md:text-2xl lg:text-3xl">
            &ldquo;{quote}&rdquo;
          </blockquote>

          {author && (
            <div className="flex flex-col items-center gap-4">
              {author.avatar && (
                <div className="relative size-12 overflow-hidden rounded-xl ring-2 ring-border md:size-14">
                  <Image
                    src={author.avatar.src}
                    alt={author.avatar.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col items-center gap-1 md:flex-row md:gap-2">
                {author.name && (
                  <span className="text-base font-medium">{author.name}</span>
                )}
                {author.position && (
                  <>
                    <span className="hidden text-muted-foreground md:inline-block">
                      •
                    </span>
                    <span className="text-base text-muted-foreground">
                      {author.position}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
