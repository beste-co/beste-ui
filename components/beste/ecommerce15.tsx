"use client";

import { Clock, MapPin, Shield, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShippingOption {
  id: string;
  icon?: "truck" | "clock" | "location" | "shield";
  title: string;
  description: string;
}

interface Ecommerce15Props {
  heading?: string;
  options?: ShippingOption[];
  className?: string;
}

const iconMap = {
  truck: Truck,
  clock: Clock,
  location: MapPin,
  shield: Shield,
};

export const ecommerce15Demo: Ecommerce15Props = {
  heading: "Shipping & Returns",
  options: [
    {
      id: "1",
      icon: "truck",
      title: "Free Shipping",
      description: "Free shipping on all orders",
    },
    {
      id: "2",
      icon: "clock",
      title: "Fast Delivery",
      description: "2-5 business days delivery time",
    },
    {
      id: "3",
      icon: "location",
      title: "Order Tracking",
      description: "Track your order in real-time",
    },
    {
      id: "4",
      icon: "shield",
      title: "Easy Returns",
      description: "30-day hassle-free return policy",
    },
  ],
};

export function Ecommerce15({
  heading,
  options = [],
  className,
}: Ecommerce15Props) {
  return (
    <section className={cn("py-12 md:py-24", className)}>
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        {heading && (
          <h2 className="mb-8 text-center text-2xl font-semibold">{heading}</h2>
        )}

        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {options.map((option) => {
            const Icon = option.icon ? iconMap[option.icon] : Truck;
            return (
              <div
                key={option.id}
                className="flex flex-col items-center rounded-lg border bg-card p-6 text-center"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-medium">{option.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
