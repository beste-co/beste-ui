"use client";

import { Linkedin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card25Props {
  name?: string;
  role?: string;
  company?: string;
  bio?: string;
  initials?: string;
  badge?: string;
  image?: string;
  className?: string;
}

export const card25Demo: Card25Props = {
  name: "Aisha Patel",
  role: "Angel investor · Advisor",
  company: "Formerly VP Product at Lattice",
  bio: "40+ seed investments across developer tools, fintech, and health.",
  initials: "AP",
  badge: "Advisor",
  image:
    "https://images.unsplash.com/photo-1581182786510-168e6bc0013d?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQ2fHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
};

export function Card25({
  name,
  role,
  company,
  bio,
  initials = "??",
  badge = "Advisor",
  image,
  className,
}: Card25Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 text-sm font-bold text-white shadow-md">
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
              <span className="truncate text-sm font-semibold text-card-foreground">
                {name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {role}
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3" aria-hidden="true" />
            {badge}
          </span>
        </div>
        {company && (
          <span className="text-sm italic text-muted-foreground">
            {company}
          </span>
        )}
        {bio && (
          <p className="text-sm leading-snug text-card-foreground">{bio}</p>
        )}
        <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold text-sky-600 hover:underline dark:text-sky-400"
          >
            <Linkedin className="size-3.5" aria-hidden="true" />
            LinkedIn
          </button>
          <button
            type="button"
            className="rounded-md bg-foreground px-2.5 py-1 font-semibold text-background hover:opacity-90"
          >
            Intro
          </button>
        </div>
      </div>
    </div>
  );
}
