"use client";

import { useEffect, useState } from "react";
import { Check, CheckCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "sending" | "sent" | "delivered" | "read";

interface Viewer {
  name: string;
  initials: string;
}

interface Chat38Props {
  message?: string;
  time?: string;
  seenBy?: Viewer[];
  stepMs?: number;
  holdMs?: number;
  className?: string;
}

const order: Status[] = ["sending", "sent", "delivered", "read"];

const labels: Record<Status, string> = {
  sending: "Sending",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
};

export const chat38Demo: Chat38Props = {
  message: "Soundcheck moved to 5pm, see you all there.",
  time: "16:08",
  seenBy: [
    { name: "Nina Simone", initials: "NS" },
    { name: "Miles Davis", initials: "MD" },
  ],
};

export function Chat38({
  message = "",
  time = "",
  seenBy = [],
  stepMs = 1000,
  holdMs = 2600,
  className,
}: Chat38Props) {
  const [step, setStep] = useState(0);
  const status = order[step] ?? "sending";
  const last = order.length - 1;

  useEffect(() => {
    const id = setTimeout(
      () => setStep((s) => (s >= last ? 0 : s + 1)),
      step >= last ? holdMs : stepMs
    );
    return () => clearTimeout(id);
  }, [step, last, stepMs, holdMs]);

  const names = seenBy.map((v) => v.name.split(" ")[0]).join(", ");

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes chat38-in { from { opacity: 0; transform: translateY(-0.25rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="flex w-full max-w-72 flex-col items-end gap-1">
        <p className="max-w-60 rounded-2xl rounded-br-md bg-primary px-3 py-2 text-sm leading-snug text-primary-foreground shadow-sm">
          {message}
        </p>
        <span className="inline-flex items-center gap-1 px-1 text-xs tabular-nums text-muted-foreground">
          {time}
          <span
            key={status}
            className={cn(
              "inline-flex items-center gap-1",
              status === "read" ? "text-sky-500" : "text-muted-foreground"
            )}
            style={{ animation: "chat38-in 300ms ease-out" }}
          >
            {status === "sending" && (
              <Clock className="size-3.5" aria-hidden="true" />
            )}
            {status === "sent" && (
              <Check className="size-3.5" aria-hidden="true" />
            )}
            {(status === "delivered" || status === "read") && (
              <CheckCheck className="size-3.5" aria-hidden="true" />
            )}
            <span className="sr-only">{labels[status]}</span>
          </span>
        </span>
        <div className="flex h-5 items-center justify-end px-1">
          {status === "read" && seenBy.length > 0 && (
            <span
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
              style={{ animation: "chat38-in 350ms ease-out" }}
            >
              <span className="flex -space-x-1" aria-hidden="true">
                {seenBy.map((v) => (
                  <span
                    key={v.initials}
                    className="flex size-4 items-center justify-center rounded-full bg-muted text-xs font-semibold text-card-foreground ring-2 ring-background"
                  >
                    {v.initials.charAt(0)}
                  </span>
                ))}
              </span>
              Seen by {names}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
