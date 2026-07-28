"use client";

import { Mic, Paperclip, Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat17Props {
  placeholder?: string;
  value?: string;
  className?: string;
}

export const chat17Demo: Chat17Props = {
  placeholder: "Message Ayşe",
  value: "",
};

export function Chat17({
  placeholder = "Message",
  value = "",
  className,
}: Chat17Props) {
  const hasValue = value.length > 0;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-1 rounded-full border border-border bg-card py-1 pl-1 pr-1.5 shadow-sm">
        <button
          type="button"
          aria-label="Attach file"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <Paperclip className="size-4" aria-hidden="true" />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 px-1">
          <span
            className={cn(
              "flex-1 truncate text-sm",
              hasValue ? "text-card-foreground" : "text-muted-foreground"
            )}
          >
            {hasValue ? value : placeholder}
          </span>
          <button
            type="button"
            aria-label="Emoji"
            className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <Smile className="size-4" aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          aria-label={hasValue ? "Send message" : "Record voice"}
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full shadow-sm transition-colors",
            hasValue
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-foreground text-background hover:bg-foreground/90"
          )}
        >
          {hasValue ? (
            <Send
              className="size-3.5 translate-x-px"
              aria-hidden="true"
            />
          ) : (
            <Mic className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
