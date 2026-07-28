"use client";

import { Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "received" | "sent";

interface Chat15Props {
  filename?: string;
  size?: string;
  pages?: string;
  role?: Role;
  className?: string;
}

export const chat15Demo: Chat15Props = {
  filename: "kickoff-brief.pdf",
  size: "2.4 MB",
  pages: "8 pages",
  role: "received",
};

export function Chat15({
  filename = "file",
  size,
  pages,
  role = "received",
  className,
}: Chat15Props) {
  const isSent = role === "sent";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-64 items-center gap-3 rounded-2xl px-3 py-2.5 shadow-sm",
          isSent
            ? "ml-auto rounded-br-md bg-primary text-primary-foreground"
            : "mr-auto rounded-bl-md bg-muted text-card-foreground"
        )}
      >
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-md",
            isSent ? "bg-primary-foreground/20" : "bg-card"
          )}
        >
          <FileText className="size-4" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold">{filename}</span>
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs",
              isSent ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {size && <span className="tabular-nums">{size}</span>}
            {size && pages && (
              <span className="size-1 shrink-0 rounded-full bg-current opacity-40" />
            )}
            {pages && <span>{pages}</span>}
          </div>
        </div>
        <button
          type="button"
          aria-label="Download file"
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
            isSent
              ? "hover:bg-primary-foreground/10"
              : "hover:bg-card-foreground/10"
          )}
        >
          <Download className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
