"use client";

import { CheckCircle2, MessageCircle, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education16Props {
  author?: string;
  role?: string;
  initials?: string;
  imageSrc?: string;
  alt?: string;
  question?: string;
  replies?: number;
  likes?: number;
  resolved?: boolean;
  className?: string;
}

const defaultImage = "https://images.unsplash.com/photo-1685703206477-aa1df00a1f0e?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww";

export const education16Demo: Education16Props = {
  author: "Noor Ahmed",
  role: "Student · Cohort 12",
  initials: "NA",
  imageSrc: defaultImage,
  alt: "Noor Ahmed",
  question:
    "In lesson 6, the dependency array skips the `setCount` setter. Isn't it a stale closure risk?",
  replies: 4,
  likes: 12,
  resolved: true,
};

export function Education16({
  author,
  role,
  initials = "??",
  imageSrc = defaultImage,
  alt,
  question,
  replies = 0,
  likes = 0,
  resolved = false,
  className,
}: Education16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
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
            {role && (
              <span className="truncate text-xs text-muted-foreground">
                {role}
              </span>
            )}
          </div>
          {resolved && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              Resolved
            </span>
          )}
        </div>
        {question && (
          <p className="line-clamp-3 text-xs leading-snug text-card-foreground">
            {question}
          </p>
        )}
        <div className="flex items-center gap-4 border-t border-border pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="size-3" aria-hidden="true" />
            {replies} replies
          </span>
          <span className="inline-flex items-center gap-1">
            <ThumbsUp className="size-3" aria-hidden="true" />
            {likes}
          </span>
        </div>
      </div>
    </div>
  );
}
