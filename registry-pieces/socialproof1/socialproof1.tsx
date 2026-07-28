"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarEntry {
  src: string;
  alt: string;
  fallback: string;
}

interface Socialproof1Props {
  avatars?: AvatarEntry[];
  extraCount?: number;
  className?: string;
}

export const socialproof1Demo: Socialproof1Props = {
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
  extraCount: 12,
};

export function Socialproof1({
  avatars = [],
  extraCount,
  className,
}: Socialproof1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center -space-x-2">
        {avatars.map((avatar, index) => (
          <Avatar
            key={index}
            className="size-8 border-2 border-background shadow-sm"
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
          <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-semibold text-muted-foreground shadow-sm">
            +{extraCount}
          </div>
        )}
      </div>
    </div>
  );
}
