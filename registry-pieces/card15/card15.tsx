"use client";

import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card15Props {
  name?: string;
  description?: string;
  features?: string[];
  action?: string;
  className?: string;
}

export const card15Demo: Card15Props = {
  name: "Enterprise",
  description:
    "For organizations that need SSO, audit logs, and a dedicated solutions team.",
  features: ["SAML SSO & SCIM", "Custom data residency", "Named success manager"],
  action: "Talk to sales",
};

export function Card15({
  name,
  description,
  features = [],
  action = "Talk to sales",
  className,
}: Card15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-xl bg-foreground p-4 text-background shadow-xl">
        <div className="flex items-center gap-2">
          <Building2 className="size-5 shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold">
            {name}
          </span>
        </div>
        {description && (
          <span className="text-xs leading-snug text-background/80">
            {description}
          </span>
        )}
        <div className="flex flex-col gap-1 border-t border-background/20 pt-2">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs text-background/85"
            >
              <span
                className="size-1 rounded-full bg-background/60"
                aria-hidden="true"
              />
              {f}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-background px-3 py-2 text-xs font-semibold text-foreground hover:opacity-90"
        >
          {action}
        </button>
      </div>
    </div>
  );
}
