"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Auth38Props {
  heading?: string;
  description?: string;
  minLength?: number;
  labels?: {
    clear?: string;
  };
  unlockButton?: {
    label: string;
    href: string;
  };
  forgotPrompt?: {
    text: string;
    linkLabel: string;
    href: string;
  };
  className?: string;
}

export const auth38Demo: Auth38Props = {
  heading: "Draw your pattern",
  description: "Connect at least 4 dots to unlock your account.",
  minLength: 4,
  labels: {
    clear: "Clear",
  },
  unlockButton: {
    label: "Unlock",
    href: "https://beste.co",
  },
  forgotPrompt: {
    text: "Forgot your pattern?",
    linkLabel: "Reset it",
    href: "https://beste.co",
  },
};

const GRID = 3;
const STEP = 80;
const CANVAS = GRID * STEP;

function dotCenter(index: number) {
  return {
    x: (index % GRID) * STEP + STEP / 2,
    y: Math.floor(index / GRID) * STEP + STEP / 2,
  };
}

export function Auth38({
  heading,
  description,
  minLength = 4,
  labels = {},
  unlockButton,
  forgotPrompt,
  className,
}: Auth38Props) {
  const [selected, setSelected] = useState<number[]>([]);

  const { clear: clearLabel } = labels;

  const select = (index: number) =>
    setSelected((prev) => (prev.includes(index) ? prev : [...prev, index]));
  const clear = () => setSelected([]);

  const canUnlock = selected.length >= minLength;

  return (
    <section
      className={cn(
        "flex min-h-screen items-center justify-center px-4 py-16 md:py-24 w-full",
        className
      )}
    >
      <div className="w-full max-w-sm text-center">
        {heading && (
          <h1 className="text-2xl font-bold md:text-3xl">{heading}</h1>
        )}
        {description && (
          <p className="mx-auto mt-2 max-w-xs text-base text-muted-foreground">
            {description}
          </p>
        )}

        <div
          className="relative mx-auto mt-10"
          style={{ width: CANVAS, height: CANVAS }}
        >
          <svg
            viewBox={`0 0 ${CANVAS} ${CANVAS}`}
            className="pointer-events-none absolute inset-0 size-full text-primary"
            aria-hidden="true"
          >
            {selected.length > 1 && (
              <polyline
                points={selected
                  .map((index) => {
                    const center = dotCenter(index);
                    return `${center.x},${center.y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>

          {Array.from({ length: GRID * GRID }).map((_, index) => {
            const center = dotCenter(index);
            const isActive = selected.includes(index);
            return (
              <button
                key={index}
                type="button"
                onClick={() => select(index)}
                aria-pressed={isActive}
                style={{ left: `${center.x}px`, top: `${center.y}px` }}
                className="absolute flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  className={cn(
                    "rounded-full transition-all",
                    isActive
                      ? "size-5 bg-primary ring-4 ring-primary/20"
                      : "size-3.5 bg-muted-foreground/30"
                  )}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {unlockButton && (
            <Button
              size="lg"
              className="w-full"
              disabled={!canUnlock}
              asChild={canUnlock}
            >
              {canUnlock ? (
                <Link href={unlockButton.href}>{unlockButton.label}</Link>
              ) : (
                unlockButton.label
              )}
            </Button>
          )}
          {clearLabel && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={clear}
              disabled={selected.length === 0}
            >
              {clearLabel}
            </Button>
          )}
        </div>

        {forgotPrompt && (
          <p className="mt-6 text-sm text-muted-foreground">
            {forgotPrompt.text}{" "}
            <Link
              href={forgotPrompt.href}
              className="font-medium text-foreground hover:underline"
            >
              {forgotPrompt.linkLabel}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
