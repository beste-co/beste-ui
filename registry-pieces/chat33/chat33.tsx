"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type From = "them" | "me";

interface Message {
  from: From;
  text: string;
}

interface Chat33Props {
  name?: string;
  status?: string;
  items?: Message[];
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

export const chat33Demo: Chat33Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  name: "Care team",
  status: "Online",
  items: [
    { from: "them", text: "Rowan's intake is ready for review." },
    { from: "me", text: "Great, I'll approve the plan now." },
    { from: "them", text: "Thanks, I'll book the first session." },
  ],
};

export function Chat33({ name, status, items = [], surface = "card", bordered = true, inverted = false, className }: Chat33Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 rounded-md p-4 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        {name && (
          <div className="mb-3 flex items-center gap-2 border-b border-current/15 pb-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-current/10 text-sm font-semibold text-current/60">
              {name.charAt(0)}
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium">{name}</p>
              {status && (
                <p className="flex items-center gap-1 text-xs text-current/60">
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
                    : "bg-current/10"
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
