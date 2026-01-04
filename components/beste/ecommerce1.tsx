"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
}

interface Ecommerce1Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  products?: Product[];
  currency?: string;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

export const ecommerce1Demo: Ecommerce1Props = {
  badge: { label: "New Arrivals", variant: "outline" },
  heading: "Shop our latest collection",
  description:
    "Discover our handpicked selection of premium products designed for modern living.",
  currency: "$",
  products: [
    {
      id: "prod-1",
      name: "Minimal Desk Lamp",
      price: 89,
      originalPrice: 129,
      image:
        "https://images.unsplash.com/photo-1731762524352-b5663f83a830?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
      badge: "Sale",
      rating: 4.8,
      reviewCount: 124,
    },
    {
      id: "prod-2",
      name: "Ceramic Vase Set",
      price: 65,
      image:
        "https://images.unsplash.com/photo-1654856842864-145a630cd603?w=900&auto=format&fit=crop&q=60",
      rating: 4.9,
      reviewCount: 89,
    },
    {
      id: "prod-3",
      name: "Wooden Side Table",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1749703836810-361f30aba87a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
      badge: "Bestseller",
      rating: 4.7,
      reviewCount: 256,
    },
    {
      id: "prod-4",
      name: "Linen Throw Blanket",
      price: 79,
      originalPrice: 99,
      image:
        "https://images.unsplash.com/photo-1745613999710-1aaf60145502?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
      rating: 4.6,
      reviewCount: 67,
    },
  ],
};

export function Ecommerce1({
  badge,
  heading,
  description,
  products = [],
  currency = "$",
  onAddToCart,
  className,
}: Ecommerce1Props) {
  if (products.length === 0) return null;

  const productCount = products.length;
  const gridCols =
    productCount % 4 === 0
      ? "lg:grid-cols-4"
      : productCount % 3 === 0 || productCount > 4
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
              <h2 className="text-2xl font-semibold md:text-4xl">{heading}</h2>
            )}
            {description && (
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className={cn("grid gap-6 sm:grid-cols-2", gridCols)}>
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-lg border bg-card overflow-hidden transition-all hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  width={500}
                  height={500}
                  alt={product.name}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {product.badge && (
                  <Badge className="absolute left-3 top-3" variant="secondary">
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium">{product.name}</h3>

                {/* Rating */}
                {product.rating && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <span className="text-yellow-500">★</span>
                    <span>{product.rating}</span>
                    {product.reviewCount && (
                      <span>({product.reviewCount})</span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-semibold">
                    {currency}
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {currency}
                      {product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <Button
                  className="mt-4 w-full"
                  size="lg"
                  onClick={() => onAddToCart?.(product.id)}
                >
                  <ShoppingCart className="size-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
