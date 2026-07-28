"use client";

import {
  Clock,
  type LucideIcon,
  MapPin,
  Navigation,
  ParkingCircle,
  Phone,
  Train,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InfoItem {
  icon: LucideIcon;
  label: string;
  value: string | string[];
}

interface Fitness32Props {
  badge?: string;
  heading?: string;
  map?: {
    image: string;
    url: string;
    directionsLabel?: string;
  };
  items?: InfoItem[];
  className?: string;
}

export const fitness32Demo: Fitness32Props = {
  badge: "Visit Us",
  heading: "Find Our Gym",
  map: {
    image:
      "https://images.unsplash.com/photo-1516546453174-5e1098a4b4af?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    url: "https://beste.co",
    directionsLabel: "Get Directions",
  },
  items: [
    {
      icon: MapPin,
      label: "Address",
      value: ["123 Fitness Boulevard", "Downtown, San Francisco, CA 94102"],
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Open 24/7",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "(415) 555-0123",
    },
    {
      icon: ParkingCircle,
      label: "Parking",
      value: "Free underground parking for members (2 hours)",
    },
    {
      icon: Train,
      label: "Public Transit",
      value: ["BART: Powell St Station (5 min walk)", "Muni: Lines 5, 6, 9, 21"],
    },
  ],
};

export function Fitness32({ badge, heading, map, items = [], className }: Fitness32Props) {
  if (!map && items.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          {badge && (
            <Badge variant="secondary" className="mb-3">
              <MapPin className="mr-1 size-3" />
              {badge}
            </Badge>
          )}
          {heading && <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Map */}
          {map && (
            <div className="relative min-h-[300px] overflow-hidden rounded-2xl">
              <img
                className="absolute inset-0 size-full object-cover"
                src={map.image}
                alt="Location map"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {map.directionsLabel && (
                <Button className="absolute bottom-4 left-4" variant="secondary" asChild>
                  <Link href={map.url} target="_blank" rel="noopener noreferrer">
                    <Navigation className="size-4" />
                    {map.directionsLabel}
                  </Link>
                </Button>
              )}
            </div>
          )}

          {/* Info */}
          {items.length > 0 && (
            <div className="rounded-2xl border bg-card p-6">
              {items.map((item, index) => {
                const Icon = item.icon;
                const isLast = index === items.length - 1;
                const isArray = Array.isArray(item.value);

                return (
                  <div key={index} className={cn("flex items-start gap-3", !isLast && "mb-6")}>
                    <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-medium">{item.label}</h3>
                      {isArray ? (
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {(item.value as string[]).map((line, i) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
