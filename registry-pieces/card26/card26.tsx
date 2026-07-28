"use client";

import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card26Props {
  body?: string;
  author?: string;
  role?: string;
  initials?: string;
  company?: string;
  image?: string;
  className?: string;
}

export const card26Demo: Card26Props = {
  body: "Our team went from pitching mockups to shipping prod features in the same sprint. The switch paid for itself in one quarter.",
  author: "Priya Shah",
  role: "Head of design",
  initials: "PS",
  company: "Linear",
  image:
    "https://images.unsplash.com/photo-1586965529163-8c7d69503892?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjM0fHxwb3J0cmFpdHxlbnwwfHwwfHx8MA%3D%3D",
};

export function Card26({
  body,
  author,
  role,
  initials = "??",
  company,
  image,
  className,
}: Card26Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <Quote className="size-4 text-muted-foreground" aria-hidden="true" />
        {body && <p className="text-sm leading-snug text-card-foreground">{body}</p>}
        <div className="flex items-center gap-3 border-t border-border pt-2">
          <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-xs font-bold text-white">
            {image ? (
              <img src={image} alt={author ?? ""} className="absolute inset-0 size-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {author && (
              <span className="truncate text-sm font-semibold text-card-foreground">{author}</span>
            )}
            <span className="truncate text-xs text-muted-foreground">
              {role}
              {company && ` · ${company}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
