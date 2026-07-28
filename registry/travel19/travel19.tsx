"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TourType {
  name: string;
  description: string;
  image: string;
  tourCount: number;
  href: string;
}

interface Travel19Props {
  heading?: string;
  description?: string;
  types?: TourType[];
  labels?: { tours?: string; explore?: string };
  className?: string;
}

export const travel19Demo: Travel19Props = {
  heading: "Explore by Tour Type",
  description: "Find the perfect adventure style for your next trip",
  types: [
    {
      name: "Adventure Tours",
      description: "Thrilling experiences for the bold traveler",
      image:
        "https://images.unsplash.com/photo-1680974745644-46f41f65c516?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ4fHx8ZW58MHx8fHx8",
      tourCount: 45,
      href: "https://beste.co",
    },
    {
      name: "Cultural Tours",
      description: "Immerse yourself in local traditions",
      image:
        "https://images.unsplash.com/photo-1517355407835-869ed1aa0554?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDUzfHx8ZW58MHx8fHx8",
      tourCount: 38,
      href: "https://beste.co",
    },
    {
      name: "Beach Holidays",
      description: "Sun, sand, and relaxation",
      image:
        "https://images.unsplash.com/photo-1644899391215-7e7bf4467615?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDU3fHx8ZW58MHx8fHx8",
      tourCount: 52,
      href: "https://beste.co",
    },
    {
      name: "City Breaks",
      description: "Explore iconic urban destinations",
      image:
        "https://images.unsplash.com/photo-1718597438333-8e0c4e47556a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDYxfHx8ZW58MHx8fHx8",
      tourCount: 67,
      href: "https://beste.co",
    },
    {
      name: "Safari & Wildlife",
      description: "Get close to nature's wonders",
      image:
        "https://images.unsplash.com/photo-1727743112098-d21f8a4c36b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDY4fHx8ZW58MHx8fHx8",
      tourCount: 23,
      href: "https://beste.co",
    },
    {
      name: "Cruise Tours",
      description: "Sail to multiple destinations",
      image:
        "https://images.unsplash.com/photo-1661930247911-50a16152546f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDY5fHx8ZW58MHx8fHx8",
      tourCount: 31,
      href: "https://beste.co",
    },
  ],
  labels: { tours: "tours", explore: "Explore" },
};

export function Travel19({
  heading,
  description,
  types = [],
  labels = {},
  className,
}: Travel19Props) {
  const { tours: toursLabel, explore: exploreLabel } = labels;

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(heading || description) && (
          <div className="mx-auto mb-12 max-w-2xl text-center">
            {heading && <h2 className="text-3xl font-bold md:text-4xl">{heading}</h2>}
            {description && <p className="mt-4 text-muted-foreground">{description}</p>}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((type, idx) => (
            <Link
              key={idx}
              href={type.href}
              className="group/travel19 relative overflow-hidden rounded-md"
            >
              <div className="relative aspect-[4/3]">
                <img
                  className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover/travel19:scale-105"
                  src={type.image}
                  alt={type.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-sm text-white/80">
                  {type.tourCount} {toursLabel}
                </p>
                <h3 className="text-lg font-bold text-white">{type.name}</h3>
                <p className="mt-1 text-sm text-white/80">{type.description}</p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-white md:opacity-0 md:transition-opacity md:duration-300 md:group-hover/travel19:opacity-100">
                  {exploreLabel}
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
