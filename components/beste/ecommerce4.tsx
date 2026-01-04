"use client";

import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  description?: string;
  image: string;
  href: string;
  productCount?: string;
  featured?: boolean;
}

interface Ecommerce4Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  categories?: Category[];
  className?: string;
}

export const ecommerce4Demo: Ecommerce4Props = {
  badge: { label: "Shop by Category", variant: "default" },
  heading: "Browse our collections",
  description:
    "Find exactly what you're looking for in our curated categories.",
  categories: [
    {
      id: "cat-1",
      name: "Living Room",
      description: "Sofas, tables and decor",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
      href: "https://beste.co",
      productCount: "124 products",
      featured: true,
    },
    {
      id: "cat-2",
      name: "Bedroom",
      description: "Beds, nightstands and linens",
      image:
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=400&fit=crop",
      href: "https://beste.co",
      productCount: "89 products",
    },
    {
      id: "cat-3",
      name: "Kitchen",
      description: "Cookware and dining",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
      href: "https://beste.co",
      productCount: "156 products",
    },
    {
      id: "cat-4",
      name: "Office",
      description: "Desks, chairs and storage",
      image:
        "https://images.unsplash.com/photo-1595846265893-f433f6cca81d?w=900&auto=format&fit=crop&q=60",
      href: "https://beste.co",
      productCount: "67 products",
    },
  ],
};

export function Ecommerce4({
  badge,
  heading,
  description,
  categories = [],
  className,
}: Ecommerce4Props) {
  if (categories.length === 0) return null;

  const count = categories.length;
  const columnCount =
    count >= 5 ? 3 : count % 4 === 0 ? 4 : count % 3 === 0 ? 3 : 2;
  const gridCols =
    columnCount === 4
      ? "lg:grid-cols-4"
      : columnCount === 3
      ? "lg:grid-cols-3"
      : "lg:grid-cols-2";

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        {(badge || heading || description) && (
          <div className="mx-auto mb-8 md:mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl font-semibold md:text-4xl text-balance">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground text-balance">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Categories Grid */}
        <div className={cn("grid gap-6 sm:grid-cols-2", gridCols)}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group/ecommerce4 relative overflow-hidden rounded-2xl"
            >
              {/* Image */}
              <div className="aspect-[3/2] md:aspect-square overflow-hidden bg-muted">
                <Image
                  src={category.image}
                  width={800}
                  height={500}
                  alt={category.name}
                  className="size-full object-cover transition-transform duration-500 group-hover/ecommerce4:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                {category.featured && (
                  <Badge className="mb-2" variant="secondary">
                    Featured
                  </Badge>
                )}
                <h3 className="text-xl font-semibold text-white md:text-2xl">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-1 text-sm text-white/80">
                    {category.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2 text-sm text-white/90">
                  {category.productCount && (
                    <span>{category.productCount}</span>
                  )}
                  <ArrowRight className="size-4 transition-transform group-hover/ecommerce4:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
