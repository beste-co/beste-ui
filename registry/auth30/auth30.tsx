"use client";

import { Delete, Fingerprint } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Auth30Props {
  heading?: string;
  description?: string;
  pinLength?: number;
  labels?: {
    biometric?: string;
    backspace?: string;
  };
  forgotPrompt?: {
    text: string;
    linkLabel: string;
    href: string;
  };
  className?: string;
}

export const auth30Demo: Auth30Props = {
  heading: "Enter your PIN",
  description: "Use your 4-digit PIN to unlock your account.",
  pinLength: 4,
  labels: {
    biometric: "Use biometrics",
    backspace: "Delete",
  },
  forgotPrompt: {
    text: "Forgot your PIN?",
    linkLabel: "Reset it",
    href: "https://beste.co",
  },
};

export function Auth30({
  heading,
  description,
  pinLength = 4,
  labels = {},
  forgotPrompt,
  className,
}: Auth30Props) {
  const [pin, setPin] = useState("");

  const { biometric: biometricLabel, backspace: backspaceLabel } = labels;

  const append = (digit: string) =>
    setPin((value) => (value.length < pinLength ? value + digit : value));
  const backspace = () => setPin((value) => value.slice(0, -1));

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <section
      className={cn(
        "flex min-h-screen items-center justify-center px-4 py-16 md:py-24 w-full",
        className
      )}
    >
      <div className="w-full max-w-xs text-center">
        {heading && (
          <h1 className="text-2xl font-bold md:text-3xl">{heading}</h1>
        )}
        {description && (
          <p className="mt-2 text-base text-muted-foreground">{description}</p>
        )}

        <div className="mt-8 flex justify-center gap-3">
          {Array.from({ length: pinLength }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "size-3.5 rounded-full transition-colors",
                index < pin.length ? "bg-foreground" : "border bg-transparent"
              )}
            />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-3 place-items-center gap-4">
          {digits.map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => append(digit)}
              className="flex size-16 items-center justify-center rounded-full border bg-card text-2xl font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-muted"
            >
              {digit}
            </button>
          ))}

          {biometricLabel ? (
            <button
              type="button"
              aria-label={biometricLabel}
              className="flex size-16 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Fingerprint className="size-6" />
            </button>
          ) : (
            <span aria-hidden="true" />
          )}

          <button
            type="button"
            onClick={() => append("0")}
            className="flex size-16 items-center justify-center rounded-full border bg-card text-2xl font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-muted"
          >
            0
          </button>

          <button
            type="button"
            aria-label={backspaceLabel}
            onClick={backspace}
            className="flex size-16 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            disabled={pin.length === 0}
          >
            <Delete className="size-6" />
          </button>
        </div>

        {forgotPrompt && (
          <p className="mt-10 text-sm text-muted-foreground">
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
