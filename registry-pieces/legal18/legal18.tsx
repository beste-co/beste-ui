"use client";

import { Briefcase, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal18Props {
  name?: string;
  title?: string;
  firm?: string;
  practice?: string[];
  barNumber?: string;
  rating?: string;
  initials?: string;
  image?: string;
  className?: string;
}

export const legal18Demo: Legal18Props = {
  name: "Nadine Alcalá",
  title: "Managing Partner",
  firm: "Alcalá & Partners LLP",
  practice: ["M&A", "Tech transactions", "Data privacy"],
  barNumber: "NY Bar · 284,911",
  rating: "4.9 across 128 matters",
  initials: "NA",
  image:
    "https://images.unsplash.com/photo-1644375391947-eeee9b4fed17?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGIlMjZ3JTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D",
};

export function Legal18({
  name,
  title,
  firm,
  practice = [],
  barNumber,
  rating,
  initials = "??",
  image,
  className,
}: Legal18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-md">
            {image ? (
              <img
                src={image}
                alt={name ?? ""}
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
            {firm && (
              <span className="inline-flex items-center gap-1 truncate text-xs text-card-foreground">
                <Briefcase className="size-3" aria-hidden="true" />
                {firm}
              </span>
            )}
          </div>
        </div>
        {practice.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {practice.map((p, idx) => (
              <span
                key={idx}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
          {barNumber && <span>{barNumber}</span>}
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
