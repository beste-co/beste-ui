"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionLink {
  label: string;
  href: string;
}

interface Error6Props {
  code?: string;
  heading?: string;
  description?: string;
  link?: ActionLink;
  className?: string;
}

export const error6Demo: Error6Props = {
  code: "404",
  heading: "This page could not be found",
  description: "The link is broken or the page has been removed.",
  link: {
    label: "Back to home",
    href: "https://beste.co",
  },
};

export function Error6({
  code,
  heading,
  description,
  link,
  className,
}: Error6Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
          {code && (
            <p className="text-2xl font-semibold tracking-tight md:text-3xl">
              {code}
            </p>
          )}

          {code && (heading || description) && (
            <span
              aria-hidden="true"
              className="hidden h-12 w-px bg-border sm:block"
            />
          )}

          <div>
            {heading && (
              <h1 className="text-base font-medium md:text-lg">{heading}</h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        {link && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
