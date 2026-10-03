"use client";

import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education17Props {
  instructor?: string;
  role?: string;
  title?: string;
  body?: string;
  postedAt?: string;
  bordered?: boolean;
  className?: string;
}

export const education17Demo: Education17Props = {
  instructor: "Ólafur Arnalds",
  title: "Office hours moved to Thursday",
  body: "I'll be out Tuesday for a conference. Drop in Thursday from 15:00 to 17:00 instead.",
  bordered: false,
};

export function Education17({
  instructor,
  role,
  title,
  body,
  postedAt,
  bordered = false,
  className,
}: Education17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Megaphone className="size-5 shrink-0 text-amber-500" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            {instructor && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {instructor}
              </span>
            )}
            <span className="truncate text-xs text-muted-foreground">
              {role ? `${role} · ` : ""}Announcement
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
