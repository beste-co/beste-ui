"use client";
import { ChevronDown, Mail, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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

export const automation2Demo: Automation2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col overflow-hidden rounded-md shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2 border-b border-current/15 px-3 py-2">
          {image ? (
            <span className="relative size-7 shrink-0 overflow-hidden rounded-md bg-current/10">
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
            <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
              {kind}
            </span>
            <span className="truncate text-sm font-semibold">
              {app} · {event}
            </span>
          </div>
          <button
            type="button"
            className="text-current/60 hover:text-foreground"
            aria-label="More"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
        <div className="flex flex-col">
          {fields.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 border-t border-current/15 px-3 py-1.5 first:border-t-0"
            >
              <span className="text-xs text-current/60">{f.label}</span>
              <span className="truncate font-mono text-xs">
                {f.value}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-center gap-1 border-t border-current/15 bg-current/5 py-1.5 text-xs text-current/60">
            <ChevronDown className="size-3" aria-hidden="true" />
            <span>{configureLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
