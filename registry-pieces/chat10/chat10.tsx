"use client";

import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Status = "sent" | "delivered" | "read";

interface Chat10Props {
  time?: string;
  status?: Status;
  sentLabel?: string;
  deliveredLabel?: string;
  readLabel?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const chat10Demo: Chat10Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  time: "09:42",
  status: "read",
  sentLabel: "Sent",
  deliveredLabel: "Delivered",
  readLabel: "Read",
};

const statusColor: Record<Status, string> = {
  sent: "text-current/35",
  delivered: "text-current/60",
  read: "text-sky-500",
};

export function Chat10({
  time = "00:00",
  status = "sent",
  sentLabel = "Sent",
  deliveredLabel = "Delivered",
  readLabel = "Read",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Chat10Props) {
  const color = statusColor[status];
  const label =
    status === "sent" ? sentLabel : status === "delivered" ? deliveredLabel : readLabel;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span className="font-mono text-xs tabular-nums text-current/60">
          {time}
        </span>
        <CheckCheck
          className={cn("size-3.5", color)}
          aria-hidden="true"
        />
        <span className={cn("text-xs font-medium", color)}>
          {label}
        </span>
      </div>
    </div>
  );
}
