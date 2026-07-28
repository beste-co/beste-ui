"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarEntry {
  src: string;
  alt: string;
  fallback: string;
}

interface Socialproof22Props {
  avatars?: AvatarEntry[];
  extraCount?: number;
  title?: string;
  rating?: number;
  ratingNote?: string;
  className?: string;
}

export const socialproof22Demo: Socialproof22Props = {
  avatars: [
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      alt: "Ayşe Kaya",
      fallback: "AK",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      alt: "Merve Özkan",
      fallback: "MÖ",
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      alt: "Sarah Brown",
      fallback: "SB",
    },
    {
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      alt: "John Doe",
      fallback: "JD",
    },
  ],
  extraCount: 2000,
  title: "Loved by product teams everywhere",
  rating: 5,
  ratingNote: "4.9 average from 2,400+ reviews",
};

export function Socialproof22({
  avatars = [],
  extraCount,
  title,
  rating = 0,
  ratingNote,
  className,
}: Socialproof22Props) {
  const rounded = Math.round(rating);
  const extraLabel =
    typeof extraCount === "number" && extraCount >= 1000
      ? `${Math.floor(extraCount / 1000)}k+`
      : `+${extraCount}`;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col items-center gap-3 text-center">
        <div className="flex items-center -space-x-2">
          {avatars.map((avatar, index) => (
            <Avatar
              key={index}
              className="size-9 border-2 border-background shadow-sm"
            >
              <AvatarImage
                src={avatar.src}
                alt={avatar.alt}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-semibold">
                {avatar.fallback}
              </AvatarFallback>
            </Avatar>
          ))}
          {typeof extraCount === "number" && extraCount > 0 && (
            <div className="flex h-9 items-center justify-center rounded-full border-2 border-background bg-muted px-2 text-xs font-semibold text-muted-foreground shadow-sm">
              {extraLabel}
            </div>
          )}
        </div>

        {title && (
          <p className="text-base font-semibold leading-snug text-card-foreground">
            {title}
          </p>
        )}

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  "size-4",
                  i <= rounded
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                )}
                aria-hidden="true"
              />
            ))}
          </div>
          {ratingNote && (
            <span className="text-xs text-muted-foreground">{ratingNote}</span>
          )}
        </div>
      </div>
    </div>
  );
}
