"use client";

import { Award, GraduationCap, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education21Props {
  name?: string;
  title?: string;
  initials?: string;
  imageSrc?: string;
  alt?: string;
  students?: string;
  rating?: string;
  badge?: string;
  className?: string;
}

const defaultImage = "https://images.unsplash.com/photo-1554727242-741c14fa561c?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fHBvcnRyYWl0fGVufDB8fDB8fHww";

export const education21Demo: Education21Props = {
  name: "Prof. Lira Vasquez",
  title: "Senior instructor · React track",
  initials: "LV",
  imageSrc: defaultImage,
  alt: "Prof. Lira Vasquez",
  students: "24,182 students",
  rating: "4.9 average",
  badge: "Top-rated",
};

export function Education21({
  name,
  title,
  initials = "??",
  imageSrc = defaultImage,
  alt,
  students,
  rating,
  badge = "Top-rated",
  className,
}: Education21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div
              className={cn(
                "relative flex size-12 items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white shadow-md",
                !imageSrc &&
                  "bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500"
              )}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={alt ?? name ?? ""}
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <span
              className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-card bg-emerald-500 text-white"
              aria-hidden="true"
            >
              <Award className="size-2.5" aria-hidden="true" />
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {name && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {name}
              </span>
            )}
            {title && (
              <span className="inline-flex items-center gap-1 truncate text-xs text-muted-foreground">
                <GraduationCap className="size-3" aria-hidden="true" />
                {title}
              </span>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
            {badge}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
          {students && <span>{students}</span>}
          {rating && (
            <span className="inline-flex items-center gap-1">
              <Star
                className="size-3 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              {rating}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
