"use client";

import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat13Props {
  message?: string;
  className?: string;
}

export const chat13Demo: Chat13Props = {
  message: "Ayşe joined the conversation",
};

export function Chat13({
  message = "System event",
  className,
}: Chat13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
        <UserPlus className="size-3" aria-hidden="true" />
        {message}
      </div>
    </div>
  );
}
