"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type From = "me" | "them";

interface Message {
  from: From;
  text: string;
}

interface Chat35Props {
  messages?: Message[];
  themName?: string;
  themInitials?: string;
  gapMs?: number;
  typingMs?: number;
  bordered?: boolean;
  className?: string;
}

export const chat35Demo: Chat35Props = {
  messages: [
    { from: "them", text: "Hey, is the new mix ready?" },
    { from: "me", text: "Almost. Bouncing the final version now." },
    { from: "them", text: "Perfect. Can you send the stems too?" },
    { from: "me", text: "Sure, sharing the folder in a minute." },
  ],
  themName: "Nina Simone",
  themInitials: "NS",
  bordered: false,
};

export function Chat35({
  messages = [],
  themName = "Contact",
  themInitials = "??",
  gapMs = 700,
  typingMs = 1300,
  bordered = false,
  className,
}: Chat35Props) {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (shown >= messages.length) return;
    const next = messages[shown];
    if (next.from === "them") {
      const t1 = setTimeout(() => setTyping(true), gapMs);
      const t2 = setTimeout(() => {
        setTyping(false);
        setShown((s) => s + 1);
      }, gapMs + typingMs);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    const id = setTimeout(() => setShown((s) => s + 1), gapMs);
    return () => clearTimeout(id);
  }, [shown, messages, gapMs, typingMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes chat35-in { from { opacity: 0; transform: translateY(0.5rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-2xl bg-card shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2.5 border-b border-border px-3 py-2.5">
          <span
            className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-card-foreground"
            aria-hidden="true"
          >
            {themInitials}
          </span>
          <span className="min-w-0 truncate text-sm font-medium text-card-foreground">
            {themName}
          </span>
        </div>

        <div className="flex h-46 flex-col justify-end gap-2 overflow-hidden p-3">
          {messages.slice(0, shown).map((m, i) => {
            const mine = m.from === "me";
            return (
              <div
                key={i}
                className={cn("flex", mine ? "justify-end" : "justify-start")}
                style={{ animation: "chat35-in 350ms ease-out" }}
              >
                <p
                  className={cn(
                    "max-w-56 rounded-2xl px-3 py-1.5 text-sm leading-snug",
                    mine
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-muted text-card-foreground"
                  )}
                >
                  {m.text}
                </p>
              </div>
            );
          })}
          {typing && (
            <div
              className="flex justify-start"
              style={{ animation: "chat35-in 350ms ease-out" }}
            >
              <span
                className="inline-flex h-8 items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-3"
                aria-label={`${themName} is typing`}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
                    style={{ animationDelay: `${i * 150}ms` }}
                    aria-hidden="true"
                  />
                ))}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
