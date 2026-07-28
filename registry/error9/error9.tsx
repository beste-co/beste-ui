"use client";

import { CornerDownRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionLink {
  label: string;
  href: string;
}

interface Error9Props {
  code?: string;
  heading?: string;
  description?: string;
  requestedPath?: string;
  suggestionLabel?: string;
  suggestion?: ActionLink;
  button?: ActionLink;
  className?: string;
}

export const error9Demo: Error9Props = {
  code: "404",
  heading: "That page moved",
  description:
    "We could not match this address, but one page comes close. Old links keep working for six months after a move.",
  requestedPath: "/docs/install/quick-start",
  suggestionLabel: "Did you mean",
  suggestion: {
    label: "/docs/getting-started",
    href: "https://beste.co",
  },
  button: {
    label: "Back to home",
    href: "https://beste.co",
  },
};

export function Error9({
  code,
  heading,
  description,
  requestedPath,
  suggestionLabel,
  suggestion,
  button,
  className,
}: Error9Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-xl px-4 md:px-6">
        {code && (
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {code}
          </p>
        )}

        {heading && (
          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {heading}
          </h1>
        )}

        {description && (
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            {description}
          </p>
        )}

        {requestedPath && (
          <p className="mt-8 truncate font-mono text-sm text-muted-foreground line-through">
            {requestedPath}
          </p>
        )}

        {suggestion && (
          <div className="mt-3 flex items-start gap-3 rounded-md border bg-muted p-4">
            <CornerDownRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="min-w-0 text-sm">
              {suggestionLabel && (
                <span className="text-muted-foreground">
                  {suggestionLabel}{" "}
                </span>
              )}
              <Link
                href={suggestion.href}
                className="break-all font-mono font-medium text-foreground underline underline-offset-4"
              >
                {suggestion.label}
              </Link>
            </p>
          </div>
        )}

        {button && (
          <div className="mt-8">
            <Button variant="outline" asChild>
              <Link href={button.href}>{button.label}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
