"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Story {
  src?: string;
  alt?: string;
  fallback: string;
  seen?: boolean;
}

interface Media7Props {
  stories?: Story[];
  className?: string;
}

export const media7Demo: Media7Props = {
  stories: [
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
      alt: "Ayşe",
      fallback: "AK",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      alt: "Merve",
      fallback: "MÖ",
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      alt: "Sarah",
      fallback: "SB",
      seen: true,
    },
    {
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      alt: "John",
      fallback: "JD",
    },
  ],
};

export function Media7({ stories = [], className }: Media7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {stories.map((story, i) => (
          <div
            key={i}
            className={cn(
              "rounded-full p-0.5",
              story.seen
                ? "bg-muted"
                : "bg-gradient-to-br from-rose-500 via-orange-400 to-amber-300"
            )}
          >
            <div className="rounded-full border-2 border-card bg-card">
              <Avatar className="size-10">
                <AvatarImage
                  src={story.src}
                  alt={story.alt}
                  className="object-cover"
                />
                <AvatarFallback className="text-xs font-semibold">
                  {story.fallback}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
