"use client";

import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sunset"
  | "ocean"
  | "violet"
  | "emerald";

interface Upload5Props {
  imageSrc?: string;
  alt?: string;
  initials?: string;
  caption?: string;
  tone?: Tone;
  className?: string;
}

const avatarClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sunset: "bg-gradient-to-br from-rose-500 to-orange-500 text-white",
  ocean: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  violet: "bg-gradient-to-br from-indigo-500 to-violet-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
};

const defaultImage =
  "https://images.unsplash.com/photo-1668262958669-f29c727d5a74?w=200&auto=format&fit=crop&q=90";

export const upload5Demo: Upload5Props = {
  imageSrc: defaultImage,
  alt: "Profile photo",
  initials: "BS",
  caption: "Change profile photo",
  tone: "primary",
};

export function Upload5({
  imageSrc = defaultImage,
  alt = "Profile photo",
  initials = "??",
  caption,
  tone = "primary",
  className,
}: Upload5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <div
            className={cn(
              "relative flex size-20 items-center justify-center overflow-hidden rounded-full text-xl font-semibold shadow-lg",
              !imageSrc && avatarClasses[tone]
            )}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={alt}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-card bg-foreground text-background shadow-md hover:opacity-90"
            aria-label="Upload photo"
          >
            <Camera className="size-3.5" aria-hidden="true" />
          </button>
        </div>
        {caption && (
          <span className="text-xs font-medium text-muted-foreground">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
