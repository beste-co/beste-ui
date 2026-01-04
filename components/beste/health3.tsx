"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Stethoscope,
  Brain,
  Heart,
  Bone,
  Eye,
  Baby,
  Clock,
  Star,
  type LucideIcon,
} from "lucide-react";

interface Specialist {
  id: string;
  icon: LucideIcon;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  availability: "available" | "busy" | "unavailable";
  nextSlot?: string;
}

interface ButtonItem {
  id: string;
  label: string;
  href?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
}

interface Health3Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  specialists?: Specialist[];
  buttons?: ButtonItem[];
  className?: string;
}

const availabilityMap = {
  available: {
    label: "Available",
    color: "bg-emerald-500",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  busy: {
    label: "Busy",
    color: "bg-amber-500",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  unavailable: {
    label: "Unavailable",
    color: "bg-gray-400",
    textColor: "text-gray-500",
  },
};

export const health3Demo: Health3Props = {
  badge: { label: "Find a Specialist", variant: "outline" },
  heading: "Expert care, when you need it",
  description:
    "Connect with top-rated specialists across all medical fields. Book your appointment today.",
  specialists: [
    {
      id: "cardio",
      icon: Heart,
      name: "Dr. Sarah Chen",
      specialty: "Cardiologist",
      rating: 4.9,
      reviewCount: 128,
      availability: "available",
      nextSlot: "Today, 2:00 PM",
    },
    {
      id: "neuro",
      icon: Brain,
      name: "Dr. Michael Park",
      specialty: "Neurologist",
      rating: 4.8,
      reviewCount: 94,
      availability: "busy",
      nextSlot: "Tomorrow, 10:00 AM",
    },
    {
      id: "ortho",
      icon: Bone,
      name: "Dr. Emily Watson",
      specialty: "Orthopedist",
      rating: 4.7,
      reviewCount: 156,
      availability: "available",
      nextSlot: "Today, 4:30 PM",
    },
    {
      id: "general",
      icon: Stethoscope,
      name: "Dr. James Miller",
      specialty: "General Practitioner",
      rating: 4.9,
      reviewCount: 203,
      availability: "available",
      nextSlot: "Today, 11:00 AM",
    },
    {
      id: "eye",
      icon: Eye,
      name: "Dr. Lisa Thompson",
      specialty: "Ophthalmologist",
      rating: 4.6,
      reviewCount: 87,
      availability: "unavailable",
    },
    {
      id: "pediatric",
      icon: Baby,
      name: "Dr. David Kim",
      specialty: "Pediatrician",
      rating: 4.8,
      reviewCount: 312,
      availability: "available",
      nextSlot: "Today, 3:00 PM",
    },
  ],
  buttons: [
    { id: "btn-1", label: "View all specialists", href: "https://beste.co" },
    {
      id: "btn-2",
      label: "Emergency care",
      href: "https://beste.co",
      variant: "outline",
    },
  ],
};

export function Health3({
  badge,
  heading,
  description,
  specialists = [],
  buttons = [],
  className,
}: Health3Props) {
  if (specialists.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-14 max-w-3xl text-center">
            {badge && (
              <div className="mb-5 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h2 className="text-3xl font-semibold md:text-5xl text-balance">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base md:text-lg text-balance text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specialists.map((specialist) => {
            const Icon = specialist.icon;
            const availability = availabilityMap[specialist.availability];

            return (
              <div
                key={specialist.id}
                className="group flex flex-col rounded-2xl border bg-card p-6 transition-all hover:shadow-lg"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={cn("size-2 rounded-full", availability.color)}
                    />
                    <span className={cn("text-xs", availability.textColor)}>
                      {availability.label}
                    </span>
                  </div>
                </div>

                {/* Doctor info */}
                <div className="mt-4">
                  <h3 className="font-semibold">{specialist.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {specialist.specialty}
                  </p>
                </div>

                {/* Rating */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">
                      {specialist.rating}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({specialist.reviewCount} reviews)
                  </span>
                </div>

                {/* Next available slot */}
                {specialist.nextSlot && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-sm">
                      Next:{" "}
                      <span className="font-medium">{specialist.nextSlot}</span>
                    </span>
                  </div>
                )}

                {/* Spacer to push button to bottom */}
                <div className="flex-1" />

                {/* Book button */}
                <Button
                  className="mt-4 w-full"
                  variant={
                    specialist.availability === "unavailable"
                      ? "secondary"
                      : "default"
                  }
                  disabled={specialist.availability === "unavailable"}
                >
                  {specialist.availability === "unavailable"
                    ? "Not Available"
                    : "Book Appointment"}
                </Button>
              </div>
            );
          })}
        </div>

        {buttons.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {buttons.map((button) => (
              <Button
                key={button.id}
                variant={button.variant ?? "default"}
                asChild
              >
                <Link href={button.href ?? "#"}>{button.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
