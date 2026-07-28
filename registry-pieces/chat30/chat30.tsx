"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "received" | "sent";
type Direction = "request" | "send";

interface Chat30Props {
  amount?: string;
  currency?: string;
  note?: string;
  direction?: Direction;
  role?: Role;
  className?: string;
}

export const chat30Demo: Chat30Props = {
  amount: "48.60",
  currency: "$",
  note: "Dinner split · Packer's Coffee",
  direction: "request",
  role: "received",
};

export function Chat30({
  amount = "0.00",
  currency = "$",
  note,
  direction = "request",
  role = "received",
  className,
}: Chat30Props) {
  const isSent = role === "sent";
  const isRequest = direction === "request";
  const Icon = isRequest ? ArrowDownLeft : ArrowUpRight;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-60 flex-col gap-2 rounded-2xl px-4 py-3 shadow-sm",
          isSent
            ? "ml-auto rounded-br-md bg-primary text-primary-foreground"
            : "mr-auto rounded-bl-md bg-muted text-card-foreground"
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              isSent ? "bg-primary-foreground/20" : "bg-card"
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </div>
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wide",
              isSent ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {isRequest ? "Payment request" : "Sent you"}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "text-sm font-semibold",
              isSent ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {currency}
          </span>
          <span className="text-3xl font-bold tabular-nums leading-none">
            {amount}
          </span>
        </div>
        {note && (
          <span
            className={cn(
              "text-xs italic leading-snug",
              isSent ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {note}
          </span>
        )}
        <div className="flex items-center gap-1.5 pt-0.5">
          <button
            type="button"
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors",
              isSent
                ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                : "bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            {isRequest ? "Pay" : "Accept"}
          </button>
          <button
            type="button"
            className={cn(
              "rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              isSent
                ? "text-primary-foreground/80 hover:bg-primary-foreground/10"
                : "text-muted-foreground hover:bg-card-foreground/5"
            )}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
