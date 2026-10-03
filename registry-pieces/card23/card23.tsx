"use client";

import { cn } from "@/lib/utils";

interface Card23Props {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  bordered?: boolean;
  className?: string;
}

export const card23Demo: Card23Props = {
  name: "Joep Beving",
  title: "Principal, Beste Studio",
  email: "hello@beste.co",
  website: "beste.co",
  bordered: false,
};

export function Card23({
  name,
  title,
  email,
  phone,
  website,
  bordered = false,
  className,
}: Card23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
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
        {(email || phone || website) && (
          <div className="flex flex-col gap-1 border-t border-border pt-2 text-sm">
            {email && (
              <span className="truncate text-card-foreground">{email}</span>
            )}
            {phone && (
              <span className="tabular-nums text-card-foreground">{phone}</span>
            )}
            {website && (
              <span className="truncate text-card-foreground">{website}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
