"use client";

import { Star } from "lucide-react";
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
  bordered?: boolean;
  className?: string;
}

const defaultImage = "https://images.unsplash.com/photo-1554727242-741c14fa561c?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fHBvcnRyYWl0fGVufDB8fDB8fHww";

export const education21Demo: Education21Props = {
  name: "Nils Frahm",
  title: "React instructor",
  initials: "NF",
  imageSrc: defaultImage,
  alt: "Nils Frahm",
  students: "24,182 students",
  rating: "4.9 average",
  bordered: false,
};

export function Education21({
  name,
  title,
  initials = "??",
  imageSrc = defaultImage,
  alt,
  students,
  rating,
  badge,
  bordered = false,
  className,
}: Education21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold text-white shadow-md",
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
          <div className="flex min-w-0 flex-1 flex-col">
            {name && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {name}
              </span>
            )}
            {title && (
              <span className="truncate text-xs text-muted-foreground">
                {title}
              </span>
            )}
          </div>
          {badge && (
            <span className="shrink-0 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
              {badge}
            </span>
          )}
        </div>
        {(students || rating) && (
          <div className="flex items-center justify-between border-t border-border pt-2 text-xs tabular-nums text-muted-foreground">
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
        )}
      </div>
    </div>
  );
}
