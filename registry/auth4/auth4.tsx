"use client";

import { ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Auth4Props {
  icon?: React.ReactNode;
  heading?: string;
  description?: string;
  backLink?: {
    label: string;
    href: string;
  };
  labels?: {
    email?: string;
    emailPlaceholder?: string;
    submit?: string;
  };
  className?: string;
}

export const auth4Demo: Auth4Props = {
  icon: <KeyRound className="size-6" />,
  heading: "Forgot your password?",
  description:
    "Enter the email linked to your account and we'll send you a link to reset your password.",
  backLink: {
    label: "Back to sign in",
    href: "https://beste.co",
  },
  labels: {
    email: "Email",
    emailPlaceholder: "you@example.com",
    submit: "Send reset link",
  },
};

export function Auth4({
  icon,
  heading,
  description,
  backLink,
  labels = {},
  className,
}: Auth4Props) {
  const fieldId = useId();

  const { email: emailLabel, emailPlaceholder, submit: submitLabel } = labels;

  return (
    <section
      className={cn(
        "flex min-h-screen items-center justify-center px-4 py-16 md:py-24 w-full",
        className
      )}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          {icon && (
            <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              {icon}
            </div>
          )}
          {heading && (
            <h1 className="text-2xl font-bold md:text-3xl">{heading}</h1>
          )}
          {description && (
            <p className="mt-2 text-base text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="rounded-md border bg-card p-6 md:p-8">
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <Field>
                {emailLabel && (
                  <FieldLabel htmlFor={`${fieldId}-email`}>
                    {emailLabel}
                  </FieldLabel>
                )}
                <Input
                  id={`${fieldId}-email`}
                  type="email"
                  placeholder={emailPlaceholder}
                  className="h-11"
                />
              </Field>

              {submitLabel && (
                <Field>
                  <Button type="submit" size="lg">
                    {submitLabel}
                  </Button>
                </Field>
              )}
            </FieldGroup>
          </form>
        </div>

        {backLink && (
          <div className="mt-6 flex justify-center">
            <Link
              href={backLink.href}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {backLink.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
