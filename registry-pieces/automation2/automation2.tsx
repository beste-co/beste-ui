"use client";
import { ChevronDown, Mail, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Automation2Field {
  label: string;
  value: string;
}

interface Automation2Props {
  kind?: string;
  app?: string;
  event?: string;
  image?: string;
  alt?: string;
  fields?: Automation2Field[];
  configureLabel?: string;
  className?: string;
}

export const automation2Demo: Automation2Props = {
  kind: "Action",
  app: "Gmail",
  event: "Send email",
  image: "https://oud.pics/sm/l/gmail.jpeg",
  alt: "Gmail",
  configureLabel: "Configure",
  fields: [
    { label: "To", value: "{{customer.email}}" },
    { label: "Subject", value: "Your receipt is ready" },
    { label: "Template", value: "receipt-v3" },
  ],
};

export function Automation2({
  kind = "Step",
  app = "App",
  event = "Event",
  image,
  alt,
  fields = [],
  configureLabel = "Configure",
  className,
}: Automation2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          {image ? (
            <span className="relative size-7 shrink-0 overflow-hidden rounded-md bg-muted">
              <img
                src={image}
                alt={alt ?? app}
                className="absolute inset-0 size-full object-cover"
              />
            </span>
          ) : (
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted-foreground text-background"
              aria-hidden="true"
            >
              <Mail className="size-3.5" />
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {kind}
            </span>
            <span className="truncate text-sm font-semibold text-card-foreground">
              {app} · {event}
            </span>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
            aria-label="More"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
        <div className="flex flex-col">
          {fields.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 border-t border-border px-3 py-1.5 first:border-t-0"
            >
              <span className="text-xs text-muted-foreground">{f.label}</span>
              <span className="truncate font-mono text-xs text-card-foreground">
                {f.value}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-center gap-1 border-t border-border bg-muted/40 py-1.5 text-xs text-muted-foreground">
            <ChevronDown className="size-3" aria-hidden="true" />
            <span>{configureLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
