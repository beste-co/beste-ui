"use client";

import { Eye, Heart, MessageCircle, Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats12Props {
  views?: string;
  likes?: string;
  comments?: string;
  shares?: string;
  className?: string;
}

export const stats12Demo: Stats12Props = {
  views: "48.2K",
  likes: "3.1K",
  comments: "284",
  shares: "612",
};

export function Stats12({
  views,
  likes,
  comments,
  shares,
  className,
}: Stats12Props) {
  const items = [
    { Icon: Eye, value: views, label: "Views" },
    { Icon: Heart, value: likes, label: "Likes" },
    { Icon: MessageCircle, value: comments, label: "Comments" },
    { Icon: Repeat2, value: shares, label: "Shares" },
  ].filter((i) => typeof i.value === "string");

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-4 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
        {items.map(({ Icon, value, label }, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5"
            aria-label={label}
          >
            <Icon
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold tabular-nums text-card-foreground">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
