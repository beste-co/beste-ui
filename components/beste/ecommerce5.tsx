"use client";

import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Ecommerce5Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline" | "destructive";
  };
  name?: string;
  tagline?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  onAddToCart?: () => void;
  imagePosition?: "left" | "right";
  className?: string;
}

export const ecommerce5Demo: Ecommerce5Props = {
  badge: { label: "Limited Edition", variant: "outline" },
  name: "Artisan Coffee Table",
  tagline: "Handcrafted with care",
  description:
    "A statement piece for your living room. Each table is individually crafted from sustainably sourced walnut, featuring organic curves and a hand-rubbed oil finish that highlights the natural grain.",
  price: 1299,
  originalPrice: 1599,
  currency: "$",
  image:
    "https://images.unsplash.com/photo-1694679741124-cd87cf3f18aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fEFydGlzYW4lMjBDb2ZmZWUlMjBUYWJsZXxlbnwwfHwwfHx8MA%3D%3D",
  rating: 4.9,
  reviewCount: 47,
  features: [
    "Sustainably sourced American walnut",
    "Hand-rubbed natural oil finish",
    "Unique grain patterns on every piece",
    "10-year craftsmanship warranty",
  ],
  ctaLabel: "Shop Now",
  ctaHref: "https://beste.co",
  imagePosition: "right",
};

export function Ecommerce5({
  badge,
  name,
  tagline,
  description,
  price,
  originalPrice,
  currency = "$",
  image,
  rating,
  reviewCount,
  features = [],
  ctaLabel = "Add to Cart",
  ctaHref,
  onAddToCart,
  imagePosition = "right",
  className,
}: Ecommerce5Props) {
  const discount = originalPrice
    ? Math.round(((originalPrice - (price ?? 0)) / originalPrice) * 100)
    : 0;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div
          className={cn(
            "grid gap-8 items-start lg:grid-cols-2 lg:gap-12",
            imagePosition === "left" && "lg:[&>*:first-child]:order-2"
          )}
        >
          {/* Content */}
          <div>
            {badge && (
              <Badge className="mb-4" variant={badge.variant ?? "secondary"}>
                {badge.label}
              </Badge>
            )}

            {tagline && (
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {tagline}
              </p>
            )}

            {name && (
              <h2 className="mt-2 text-3xl font-semibold md:text-4xl lg:text-5xl">
                {name}
              </h2>
            )}

            {/* Rating */}
            {rating && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-4",
                        i < Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{rating}</span>
                {reviewCount && (
                  <span className="text-sm text-muted-foreground">
                    ({reviewCount} reviews)
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-bold">
                {currency}
                {price}
              </span>
              {originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {currency}
                    {originalPrice}
                  </span>
                  <Badge variant="outline">Save {discount}%</Badge>
                </>
              )}
            </div>

            {description && (
              <p className="mt-6 text-lg text-foreground">{description}</p>
            )}

            {/* Features */}
            {features.length > 0 && (
              <ul className="mt-6 space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            <div className="mt-8 flex gap-3">
              <Button size="lg" onClick={onAddToCart} asChild={!!ctaHref}>
                {ctaHref ? (
                  <Link href={ctaHref}>
                    <ShoppingCart className="size-4" />
                    {ctaLabel}
                  </Link>
                ) : (
                  <>
                    <ShoppingCart className="size-4" />
                    {ctaLabel}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-[3/3] overflow-hidden rounded-2xl bg-muted group/ecommerce5">
            {image && (
              <Image
                src={image}
                width={500}
                height={500}
                alt={name ?? "Product Image"}
                className="size-full object-cover transition-transform duration-300 group-hover/ecommerce5:scale-105 w-full h-full"
              />
            )}
            {discount > 0 && (
              <div className="absolute right-4 top-4 rounded-full bg-foreground px-3 py-1 text-sm font-semibold text-background">
                -{discount}%
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
