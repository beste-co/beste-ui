"use client";

import { ArrowRight, Shield, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Hotspot {
  id: string;
  x: number;
  y: number;
  icon?: React.ReactNode;
  title: string;
  description: string;
  link?: {
    href: string;
    label?: string;
  };
  size?: "sm" | "md" | "lg";
  appearance?: "light" | "dark";
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

interface Showcase2Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  buttons?: ButtonItem[];
  image?: {
    src: string;
    alt: string;
  };
  hotspots?: Hotspot[];
  reversed?: boolean;
  className?: string;
}

export const showcase2Demo: Showcase2Props = {
  badge: { label: "Features", variant: "secondary" },
  heading: "Powerful analytics at your fingertips",
  description:
    "Explore the interactive dashboard and discover how our platform can transform your data into actionable insights.",
  buttons: [
    {
      id: "btn-1",
      label: "Get started",
      href: "https://beste.co",
      variant: "default",
    },
    {
      id: "btn-2",
      label: "Watch demo",
      href: "https://beste.co",
      variant: "outline",
    },
  ],
  image: {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop&q=80",
    alt: "Analytics dashboard",
  },
  hotspots: [
    {
      id: "hotspot-1",
      x: 20,
      y: 35,
      icon: <Zap className="size-4" />,
      title: "Quick Actions",
      description:
        "Access frequently used features with one click from the sidebar.",
      size: "lg",
      appearance: "light",
    },
    {
      id: "hotspot-2",
      x: 55,
      y: 50,
      icon: <Shield className="size-4" />,
      title: "Data Protection",
      description:
        "Your data is encrypted end-to-end and stored in secure servers.",
      size: "lg",
      appearance: "light",
    },
    {
      id: "hotspot-3",
      x: 75,
      y: 25,
      icon: <Sparkles className="size-4" />,
      title: "Smart Reports",
      description:
        "AI-generated reports that highlight the most important metrics.",
      size: "lg",
      appearance: "light",
    },
  ],
  reversed: false,
};

function HotspotButton({ hotspot }: { hotspot: Hotspot }) {
  const size = hotspot.size || "lg";
  const appearance = hotspot.appearance || "light";

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const pulseSizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-18 h-18",
  };

  const appearanceClasses = {
    light: "bg-background text-foreground border-foreground",
    dark: "bg-foreground text-background border-background",
  };

  const pulseClasses = {
    light: "bg-background/40",
    dark: "bg-foreground/40",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "cursor-pointer absolute transform -translate-x-1/2 -translate-y-1/2 z-20",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-full"
          )}
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          aria-label={`View details: ${hotspot.title}`}
        >
          {/* Pulse animation ring */}
          <span
            className={cn(
              "absolute inset-0 transform -translate-x-1/2 -translate-y-1/2",
              "left-1/2 top-1/2",
              pulseSizeClasses[size],
              "rounded-full animate-ping",
              pulseClasses[appearance]
            )}
          />
          {/* Main hotspot button */}
          <span
            className={cn(
              sizeClasses[size],
              "relative flex items-center justify-center rounded-full",
              "border-2 shadow-lg",
              "transition-all duration-200",
              "hover:scale-110 hover:shadow-xl",
              appearanceClasses[appearance]
            )}
          >
            {hotspot.icon || (
              <span className="text-xs font-bold">{hotspot.id}</span>
            )}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="center"
        sideOffset={12}
        className={cn(
          "w-72 p-4 rounded-lg",
          "bg-background/95 backdrop-blur-md border shadow-2xl"
        )}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {hotspot.icon && (
              <span className="p-2 rounded-lg bg-primary/10 text-primary">
                {hotspot.icon}
              </span>
            )}
            <h4 className="font-semibold text-base">{hotspot.title}</h4>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {hotspot.description}
          </p>
          {hotspot.link && (
            <Link
              href={hotspot.link.href}
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium",
                "text-primary hover:underline mt-2"
              )}
            >
              {hotspot.link.label || "Learn more"}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function Showcase2({
  badge,
  heading,
  description,
  buttons = [],
  image,
  hotspots = [],
  reversed = false,
  className,
}: Showcase2Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center",
            reversed &&
              "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"
          )}
        >
          {/* Content */}
          <div className="flex flex-col gap-6 justify-center">
            {badge && (
              <div>
                <Badge variant={badge.variant ?? "default"}>
                  {badge.label}
                </Badge>
              </div>
            )}

            {heading && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
                {heading}
              </h2>
            )}

            {description && (
              <p className="text-base md:text-lg text-muted-foreground">
                {description}
              </p>
            )}

            {buttons.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {buttons.map((button) => (
                  <Button
                    key={button.id}
                    variant={button.variant ?? "default"}
                    size="lg"
                    asChild
                  >
                    <Link href={button.href ?? "#"}>{button.label}</Link>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Media with Hotspots */}
          <div className="relative w-full">
            <div className="relative rounded-lg overflow-hidden shadow-2xl border aspect-video">
              {image?.src ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">Showcase image</span>
                </div>
              )}

              {/* Overlay for better hotspot visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

              {/* Hotspots with Popovers */}
              {hotspots.map((hotspot) => (
                <HotspotButton key={hotspot.id} hotspot={hotspot} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
