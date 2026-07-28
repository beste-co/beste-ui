"use client";

import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education17Props {
  instructor?: string;
  role?: string;
  title?: string;
  body?: string;
  postedAt?: string;
  className?: string;
}

export const education17Demo: Education17Props = {
  instructor: "Prof. Lira Vasquez",
  role: "Instructor",
  title: "Office hours moved to Thursday",
  body: "I'll be out Tuesday for a conference. Drop in Thursday 15:00 – 17:00 instead — same Zoom link in the syllabus.",
  postedAt: "Posted 2 hours ago",
};

export function Education17({
  instructor,
  role = "Instructor",
  title,
  body,
  postedAt,
  className,
}: Education17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-amber-500 text-white">
            <Megaphone className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {instructor && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {instructor}
              </span>
            )}
            <span className="truncate text-xs text-muted-foreground">
              {role} · Announcement
            </span>
          </div>
        </div>
        {title && (
          <span className="text-sm font-semibold text-card-foreground">
            {title}
          </span>
        )}
        {body && (
          <p className="text-xs leading-snug text-muted-foreground">
            {body}
          </p>
        )}
        {postedAt && (
          <span className="text-xs text-muted-foreground">{postedAt}</span>
        )}
      </div>
    </div>
  );
}
