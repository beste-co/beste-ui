"use client";

import { type LucideIcon, SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButton {
  label: string;
  href: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  icon?: LucideIcon;
}

interface Error7Props {
  icon?: LucideIcon;
  code?: string;
  heading?: string;
  description?: string;
  buttons?: ActionButton[];
  className?: string;
}

export const error7Demo: Error7Props = {
  icon: SearchX,
  code: "Error 404",
  heading: "Page not found",
  description:
    "We looked, but there is nothing at this address. It may have been moved or deleted.",
  buttons: [
    { label: "Back to home", href: "https://beste.co" },
    { label: "Contact support", href: "https://beste.co", variant: "ghost" },
  ],
};

export function Error7({
  icon: Icon,
  code,
  heading,
  description,
  buttons = [],
  className,
}: Error7Props) {
  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-md px-4 md:px-6">
        <div className="rounded-md border bg-card p-8 text-center">
          {Icon && (
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon className="size-5" />
            </div>
          )}

          {code && (
            <p className="mt-6 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {code}
            </p>
          )}

          {heading && (
            <h1 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
              {heading}
            </h1>
          )}

          {description && (
            <p className="mt-3 text-base text-muted-foreground">
              {description}
            </p>
          )}

          {buttons.length > 0 && (
            <div className="mt-6 flex flex-col gap-2">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant ?? "default"}
                  className="w-full"
                  asChild
                >
                  <Link href={button.href}>
                    {button.icon && <button.icon className="size-4" />}
                    {button.label}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
