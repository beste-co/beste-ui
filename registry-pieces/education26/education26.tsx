"use client";

import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education26Props {
  author?: string;
  cohort?: string;
  initials?: string;
  imageSrc?: string;
  alt?: string;
  rating?: number;
  body?: string;
  className?: string;
}

const defaultImage = "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fHBvcnRyYWl0fGVufDB8fDB8fHww";

export const education26Demo: Education26Props = {
  author: "Andrea Kim",
  cohort: "Cohort 12 · Graduated Mar 2026",
  initials: "AK",
  imageSrc: defaultImage,
  alt: "Andrea Kim",
  rating: 5,
  body: "The office hours alone were worth the tuition. I came in wanting to learn Next.js and left with a new role.",
};

export function Education26({
  author,
  cohort,
  initials = "??",
  imageSrc = defaultImage,
  alt,
  rating = 0,
  body,
  className,
}: Education26Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Quote
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={cn(
                  "size-3.5",
                  idx < rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground"
                )}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
        {body && (
          <p className="text-xs leading-snug text-card-foreground">{body}</p>
        )}
        <div className="flex items-center gap-2 border-t border-border pt-2">
          <div
            className={cn(
              "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white",
              !imageSrc &&
                "bg-gradient-to-br from-sky-500 to-indigo-500"
            )}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={alt ?? author ?? ""}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {author && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {author}
              </span>
            )}
            {cohort && (
              <span className="truncate text-xs text-muted-foreground">
                {cohort}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
