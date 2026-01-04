"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, SkipForward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Onboarding4Props {
  badge?: string;
  heading?: string;
  description?: string;
  video?: {
    thumbnailSrc: string;
    thumbnailAlt: string;
    duration?: string;
  };
  primaryButton?: {
    label: string;
    href: string;
  };
  secondaryButton?: {
    label: string;
    href: string;
  };
  className?: string;
}

export const onboarding4Demo: Onboarding4Props = {
  badge: "Quick Tour",
  heading: "See how it works",
  description:
    "Watch a 2-minute video to learn the basics and get up to speed quickly.",
  video: {
    thumbnailSrc:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2918&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    thumbnailAlt: "Video thumbnail",
    duration: "2:15",
  },
  primaryButton: {
    label: "Watch Video",
    href: "https://beste.co",
  },
  secondaryButton: {
    label: "Skip",
    href: "https://beste.co",
  },
};

export function Onboarding4({
  badge,
  heading,
  description,
  video,
  primaryButton,
  secondaryButton,
  className,
}: Onboarding4Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          {badge && (
            <Badge variant="outline" className="mb-4">
              <Play className="mr-1 size-3" />
              {badge}
            </Badge>
          )}

          {/* Heading */}
          {heading && (
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">{heading}</h1>
          )}

          {/* Description */}
          {description && (
            <p className="mb-8 max-w-xl text-lg text-muted-foreground">
              {description}
            </p>
          )}

          {/* Video Thumbnail */}
          {video && (
            <div className="group relative mb-8 aspect-video w-full cursor-pointer overflow-hidden rounded-xl border bg-muted">
              <Image
                src={video.thumbnailSrc}
                alt={video.thumbnailAlt}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                <div className="flex size-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                  <Play className="size-6 fill-current text-primary" />
                </div>
              </div>
              {/* Duration badge */}
              {video.duration && (
                <div className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                  {video.duration}
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {primaryButton && (
              <Button size="lg" asChild>
                <Link href={primaryButton.href}>
                  <Play className="size-4" />
                  {primaryButton.label}
                </Link>
              </Button>
            )}
            {secondaryButton && (
              <Button variant="ghost" size="lg" asChild>
                <Link href={secondaryButton.href}>
                  <SkipForward className="size-4" />
                  {secondaryButton.label}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
