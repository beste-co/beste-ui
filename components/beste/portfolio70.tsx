"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BookItem {
  title: string;
  subtitle?: string;
  image: {
    src: string;
    alt: string;
  };
  rating: number;
  badge?: string;
}

interface Portfolio70Props {
  heading?: string;
  description?: string;
  items?: BookItem[];
  className?: string;
}

export const portfolio70Demo: Portfolio70Props = {
  heading: "What I'm Reading",
  description: "Books that have shaped my thinking and work.",
  items: [
    {
      title: "The Design of Everyday Things",
      subtitle: "Don Norman",
      image: {
        src: "https://oud.pics/sm/l/book1.webp",
        alt: "The Design of Everyday Things book cover",
      },
      rating: 5,
      badge: "Design",
    },
    {
      title: "Thinking, Fast and Slow",
      subtitle: "Daniel Kahneman",
      image: {
        src: "https://oud.pics/sm/l/book2.webp",
        alt: "Thinking, Fast and Slow book cover",
      },
      rating: 5,
      badge: "Psychology",
    },
    {
      title: "Atomic Habits",
      subtitle: "James Clear",
      image: {
        src: "https://oud.pics/sm/l/book3.webp",
        alt: "Atomic Habits book cover",
      },
      rating: 4,
      badge: "Productivity",
    },
    {
      title: "Zero to One",
      subtitle: "Peter Thiel",
      image: {
        src: "https://oud.pics/sm/l/book4.webp",
        alt: "Zero to One book cover",
      },
      rating: 4,
      badge: "Business",
    },
  ],
};

export function Portfolio70({
  heading,
  description,
  items = [],
  className,
}: Portfolio70Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(heading || description) && (
          <div className="mb-12 text-center">
            {heading && (
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="group/portfolio70 flex flex-col rounded-md border bg-card p-4 text-center transition-colors hover:bg-muted/50"
            >
              <div className="relative mx-auto h-44 w-28">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className="rounded-md object-cover shadow-md transition-transform group-hover/portfolio70:scale-105"
                />
              </div>
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              )}
              <div className="mt-auto pt-3">
                <div className="flex justify-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-4",
                        i < item.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                {item.badge && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {item.badge}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
