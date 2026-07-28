"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Check, ChevronRight, Clock, Shuffle, Star, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProviderInfo {
  name: string;
  specialty: string;
  avatar?: string;
  rating: number;
  reviews: number;
  experience: string;
  availability: string;
  availableToday?: boolean;
}

interface Booking5Labels {
  anyProviderTitle?: string;
  anyProviderDescription?: string;
  availableTodayBadge?: string;
  noSelection?: string;
  anyProviderSummary?: string;
  nextButton?: string;
}

interface Booking5Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  providers?: ProviderInfo[];
  allowAny?: boolean;
  labels?: Booking5Labels;
  className?: string;
}

export const booking5Demo: Booking5Props = {
  badge: { label: "Step 2 of 3", variant: "secondary" },
  heading: "Choose your <strong>specialist</strong>",
  description: "Pick a provider for your Deep Tissue Massage appointment.",
  allowAny: true,
  providers: [
    {
      name: "Dr. Emily Carter",
      specialty: "Sports & Deep Tissue",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      rating: 4.9,
      reviews: 127,
      experience: "8 years",
      availability: "Next: Today, 2:00 PM",
      availableToday: true,
    },
    {
      name: "Marcus Chen",
      specialty: "Therapeutic & Recovery",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      rating: 4.8,
      reviews: 94,
      experience: "12 years",
      availability: "Next: Tomorrow, 10:00 AM",
      availableToday: false,
    },
    {
      name: "Sofia Andersson",
      specialty: "Relaxation & Prenatal",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      rating: 5.0,
      reviews: 203,
      experience: "15 years",
      availability: "Next: Today, 4:30 PM",
      availableToday: true,
    },
    {
      name: "James Okafor",
      specialty: "Deep Tissue & Myofascial",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      rating: 4.7,
      reviews: 68,
      experience: "5 years",
      availability: "Next: April 18, 9:00 AM",
      availableToday: false,
    },
  ],
  labels: {
    anyProviderTitle: "Any Available Provider",
    anyProviderDescription: "We'll match you with the next available specialist",
    availableTodayBadge: "Today",
    noSelection: "No provider selected",
    anyProviderSummary: "Any Provider",
    nextButton: "Next Step",
  },
};

export function Booking5({
  badge,
  heading,
  description,
  providers = [],
  allowAny = false,
  labels = {},
  className,
}: Booking5Props) {
  const {
    anyProviderTitle,
    anyProviderDescription,
    availableTodayBadge,
    noSelection,
    anyProviderSummary,
    nextButton,
  } = labels;

  const [selected, setSelected] = useState<string | null>(null);

  const selectedProvider =
    selected && selected !== "any" ? providers.find((p) => p.name === selected) : null;

  const handleConfirm = () => {
    if (!selected) return;
    if (selected === "any") {
      console.log("Selected provider: any available");
    } else if (selectedProvider) {
      console.log("Selected provider:", selectedProvider);
    }
  };

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-lg px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && (
              <div className="mb-4 flex justify-center">
                <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
              </div>
            )}
            {heading && (
              <h2
                className="text-2xl font-semibold md:text-4xl [&>strong]:font-bold [&>strong]:text-primary"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}
            {description && (
              <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
            )}
          </div>
        )}

        <div className="group/booking5 overflow-hidden rounded-md border bg-card shadow-sm">
          <div className="divide-y">
            {allowAny && (
              <button
                type="button"
                onClick={() => setSelected("any")}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition-all",
                  selected === "any" ? "bg-primary/5" : "hover:bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-full",
                    selected === "any"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Shuffle className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold">{anyProviderTitle}</h3>
                  <p className="text-sm text-muted-foreground">{anyProviderDescription}</p>
                </div>
                <div className="shrink-0">
                  {selected === "any" ? (
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-4" />
                    </div>
                  ) : (
                    <div className="size-6 rounded-full border-2 border-muted-foreground/20" />
                  )}
                </div>
              </button>
            )}

            {providers.map((provider, index) => {
              const isSelected = selected === provider.name;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelected(provider.name)}
                  className={cn(
                    "flex w-full cursor-pointer items-start gap-4 px-5 py-4 text-left transition-all",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar
                      className={cn(
                        "size-14",
                        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      )}
                    >
                      {provider.avatar && (
                        <AvatarImage
                          src={provider.avatar}
                          alt={provider.name}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback>
                        <User className="size-5" />
                      </AvatarFallback>
                    </Avatar>
                    {provider.availableToday && (
                      <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full border-2 border-background bg-emerald-500">
                        <span className="size-1.5 rounded-full bg-white" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">{provider.name}</h3>
                      {provider.availableToday && availableTodayBadge && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-xs text-emerald-500"
                        >
                          {availableTodayBadge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{provider.specialty}</p>

                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 font-medium">
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                        {provider.rating}
                        <span className="text-muted-foreground">({provider.reviews})</span>
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Award className="size-4" />
                        {provider.experience}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="size-4" />
                      {provider.availability}
                    </div>
                  </div>

                  <div className="mt-2 shrink-0">
                    {isSelected ? (
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-4" />
                      </div>
                    ) : (
                      <div className="size-6 rounded-full border-2 border-muted-foreground/20" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/30 px-5 py-4">
            <div className="text-base">
              {selected ? (
                <span className="font-medium">
                  {selected === "any" ? anyProviderSummary : selected}
                </span>
              ) : (
                <span className="text-muted-foreground">{noSelection}</span>
              )}
            </div>
            <Button disabled={!selected} className="cursor-pointer" onClick={handleConfirm}>
              {nextButton}
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
