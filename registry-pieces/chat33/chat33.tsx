"use client";

import { cn } from "@/lib/utils";

type From = "them" | "me";

interface Message {
  from: From;
  text: string;
}

interface Chat33Props {
  name?: string;
  status?: string;
  items?: Message[];
  className?: string;
}

export const chat33Demo: Chat33Props = {
  name: "Care team",
  status: "Online",
  items: [
    { from: "them", text: "Rowan's intake is ready for review." },
    { from: "me", text: "Great, I'll approve the plan now." },
    { from: "them", text: "Thanks, I'll book the first session." },
  ],
};

export function Chat33({ name, status, items = [], className }: Chat33Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-4 shadow-xl">
        {name && (
          <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
              {name.charAt(0)}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium text-card-foreground">{name}</p>
              {status && (
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span
                    className="size-1.5 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />
                  {status}
                </p>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {items.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.from === "me" ? "justify-end" : "justify-start"
              )}
            >
              <span
                className={cn(
                  "max-w-56 rounded-md px-3 py-2 text-sm",
                  message.from === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-card-foreground"
                )}
              >
                {message.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
