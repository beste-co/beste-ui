"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionLink {
  label: string;
  href: string;
}

interface Error8Labels {
  redirect?: string;
  seconds?: string;
  cancel?: string;
  canceled?: string;
}

interface Error8Props {
  code?: string;
  heading?: string;
  description?: string;
  seconds?: number;
  labels?: Error8Labels;
  action?: ActionLink;
  onRedirect?: () => void;
  className?: string;
}

export const error8Demo: Error8Props = {
  code: "404",
  heading: "This page does not exist",
  description:
    "Nothing to see here. We will take you somewhere useful unless you would rather stay.",
  seconds: 10,
  labels: {
    redirect: "Redirecting to the homepage in",
    seconds: "seconds",
    cancel: "Stay on this page",
    canceled: "Automatic redirect canceled.",
  },
  action: {
    label: "Go now",
    href: "https://beste.co",
  },
};

export function Error8({
  code,
  heading,
  description,
  seconds,
  labels = {},
  action,
  onRedirect,
  className,
}: Error8Props) {
  const {
    redirect: redirectLabel,
    seconds: secondsLabel,
    cancel: cancelLabel,
    canceled: canceledLabel,
  } = labels;

  const [remaining, setRemaining] = React.useState(seconds ?? 0);
  const [canceled, setCanceled] = React.useState(false);
  const hasFired = React.useRef(false);

  React.useEffect(() => {
    if (canceled || remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [canceled, remaining]);

  React.useEffect(() => {
    if (!seconds || canceled || remaining > 0 || hasFired.current) return;
    hasFired.current = true;
    onRedirect?.();
  }, [seconds, canceled, remaining, onRedirect]);

  return (
    <section className={cn("py-16 md:py-24 w-full", className)}>
      <div className="mx-auto max-w-xl px-4 text-center md:px-6">
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
          <p className="mt-4 text-balance text-base text-muted-foreground md:text-lg">
            {description}
          </p>
        )}

        <p aria-live="polite" className="mt-8 text-base text-muted-foreground">
          {canceled ? (
            canceledLabel
          ) : (
            <>
              {redirectLabel}{" "}
              <span className="font-semibold text-foreground">{remaining}</span>{" "}
              {secondsLabel}
            </>
          )}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {action && (
            <Button size="lg" asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          )}
          {cancelLabel && !canceled && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setCanceled(true)}
            >
              {cancelLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
