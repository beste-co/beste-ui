"use client";

import { Globe, Mail, Phone } from "lucide-react";

import { cn } from "@/lib/utils";

interface Card23Props {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  className?: string;
}

export const card23Demo: Card23Props = {
  name: "Beste Sözen",
  title: "Principal · Beste Design Studio",
  email: "mira@solano.studio",
  phone: "+90 532 000 12 34",
  website: "solano.studio",
};

export function Card23({
  name,
  title,
  email,
  phone,
  website,
  className,
}: Card23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex flex-col">
          {name && (
            <span className="text-base font-semibold text-card-foreground">
              {name}
            </span>
          )}
          {title && (
            <span className="text-xs text-muted-foreground">{title}</span>
          )}
        </div>
        <div className="flex flex-col gap-1 border-t border-border pt-2 text-sm">
          {email && (
            <div className="flex items-center gap-2">
              <Mail
                className="size-3 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="truncate font-mono text-card-foreground">
                {email}
              </span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2">
              <Phone
                className="size-3 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="font-mono text-card-foreground">{phone}</span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-2">
              <Globe
                className="size-3 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="truncate font-mono text-card-foreground">
                {website}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
