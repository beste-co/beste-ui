"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsentLink {
  label: string;
  href?: string;
}

interface Form33Props {
  lead?: string;
  links?: ConsentLink[];
  connector?: string;
  tail?: string;
  agreed?: boolean;
  required?: boolean;
  className?: string;
}

export const form33Demo: Form33Props = {
  lead: "I agree to the",
  links: [
    { label: "Terms of service" },
    { label: "Privacy policy" },
  ],
  connector: " and ",
  tail: ".",
  agreed: true,
  required: true,
};

export function Form33({
  lead,
  links = [],
  connector = " and ",
  tail,
  agreed = false,
  required = false,
  className,
}: Form33Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <label className="flex w-full max-w-80 cursor-pointer items-start gap-2.5 rounded-md border border-border bg-card p-3 shadow-sm">
        <span
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
            agreed
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card"
          )}
          aria-hidden="true"
        >
          {agreed && <Check className="size-3" aria-hidden="true" />}
        </span>
        <span className="text-sm leading-snug text-card-foreground">
          {lead}{" "}
          {links.map((link, idx) => (
            <span key={idx}>
              <a
                href={link.href ?? "#"}
                className="font-semibold text-primary underline underline-offset-2 hover:opacity-80"
                onClick={(event) => event.preventDefault()}
              >
                {link.label}
              </a>
              {idx < links.length - 1 && connector}
            </span>
          ))}
          {tail}
          {required && (
            <span
              className="ml-0.5 text-rose-500"
              aria-label="Required"
            >
              *
            </span>
          )}
        </span>
      </label>
    </div>
  );
}
