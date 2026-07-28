"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SocialProvider {
  label: string;
  icon: React.ReactNode;
  href?: string;
}

interface Auth6Props {
  icon?: React.ReactNode;
  heading?: string;
  description?: string;
  socialProviders?: SocialProvider[];
  signupPrompt?: {
    text: string;
    linkLabel: string;
    href: string;
  };
  labels?: {
    email?: string;
    emailPlaceholder?: string;
    submit?: string;
    helper?: string;
    divider?: string;
  };
  className?: string;
}

const GoogleIcon = (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const AppleIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
    <path d="M17.05 12.04c-.03-2.6 2.13-3.85 2.22-3.91-1.21-1.77-3.1-2.02-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.4-.89-1.75.03-3.37 1.02-4.27 2.58-1.82 3.16-.47 7.83 1.31 10.39.87 1.25 1.91 2.66 3.27 2.61 1.31-.05 1.81-.85 3.4-.85 1.59 0 2.03.85 3.41.82 1.41-.02 2.3-1.28 3.16-2.54.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.73-1.05-2.76-4.15zM14.5 4.5c.72-.87 1.21-2.08 1.08-3.29-1.04.04-2.3.69-3.04 1.56-.67.77-1.25 2-1.09 3.18 1.16.09 2.34-.59 3.05-1.45z" />
  </svg>
);

export const auth6Demo: Auth6Props = {
  icon: <Sparkles className="size-6" />,
  heading: "Sign in with email",
  description: "No password needed. We'll email you a secure link to sign in instantly.",
  socialProviders: [
    { label: "Continue with Google", icon: GoogleIcon, href: "https://beste.co" },
    { label: "Continue with Apple", icon: AppleIcon, href: "https://beste.co" },
  ],
  signupPrompt: {
    text: "New here?",
    linkLabel: "Create an account",
    href: "https://beste.co",
  },
  labels: {
    email: "Email",
    emailPlaceholder: "you@example.com",
    submit: "Send magic link",
    helper: "The link signs you in with one click and expires in 10 minutes.",
    divider: "or continue with",
  },
};

export function Auth6({
  icon,
  heading,
  description,
  socialProviders = [],
  signupPrompt,
  labels = {},
  className,
}: Auth6Props) {
  const fieldId = useId();

  const {
    email: emailLabel,
    emailPlaceholder,
    submit: submitLabel,
    helper: helperText,
    divider: dividerLabel,
  } = labels;

  return (
    <section
      className={cn("flex min-h-screen items-center justify-center px-4 py-16 md:py-24 w-full", className)}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          {icon && (
            <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              {icon}
            </div>
          )}
          {heading && <h1 className="text-2xl font-bold md:text-3xl">{heading}</h1>}
          {description && <p className="mt-2 text-base text-muted-foreground">{description}</p>}
        </div>

        <div className="rounded-md border bg-card p-6 md:p-8">
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <Field>
                {emailLabel && (
                  <FieldLabel htmlFor={`${fieldId}-email`}>{emailLabel}</FieldLabel>
                )}
                <Input
                  id={`${fieldId}-email`}
                  type="email"
                  placeholder={emailPlaceholder}
                  className="h-11"
                />
                {helperText && <FieldDescription>{helperText}</FieldDescription>}
              </Field>

              {submitLabel && (
                <Field>
                  <Button type="submit" size="lg">
                    {submitLabel}
                  </Button>
                </Field>
              )}

              {dividerLabel && (
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  {dividerLabel}
                </FieldSeparator>
              )}

              {socialProviders.length > 0 && (
                <Field>
                  {socialProviders.map((provider, index) => (
                    <Button key={index} variant="outline" size="lg" asChild>
                      <Link href={provider.href ?? "#"}>
                        {provider.icon}
                        {provider.label}
                      </Link>
                    </Button>
                  ))}
                </Field>
              )}
            </FieldGroup>
          </form>
        </div>

        {signupPrompt && (
          <FieldDescription className="!mt-6 text-center">
            {signupPrompt.text}{" "}
            <Link href={signupPrompt.href} className="font-medium text-foreground">
              {signupPrompt.linkLabel}
            </Link>
          </FieldDescription>
        )}
      </div>
    </section>
  );
}
