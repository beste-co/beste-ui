"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

interface AuthField {
  label: string;
  placeholder: string;
  type?: string;
}

interface Auth2Props {
  heading?: string;
  description?: string;
  socialProviders?: SocialProvider[];
  fields?: AuthField[];
  signinPrompt?: {
    text: string;
    linkLabel: string;
    href: string;
  };
  labels?: {
    divider?: string;
    terms?: string;
    submit?: string;
    passwordToggle?: string;
  };
  showcase?: {
    image: {
      src: string;
      alt: string;
    };
    quote?: string;
    author?: {
      name: string;
      title: string;
      avatar?: {
        src: string;
        alt: string;
      };
    };
  };
  mediaPosition?: "left" | "right";
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

const GithubIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
    <path d="M12 1C5.92 1 1 5.92 1 12c0 4.87 3.15 8.99 7.52 10.45.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.04-3.06.66-3.71-1.3-3.71-1.3-.5-1.27-1.22-1.61-1.22-1.61-1-.68.07-.67.07-.67 1.1.08 1.69 1.13 1.69 1.13.98 1.69 2.58 1.2 3.21.92.1-.71.39-1.2.7-1.48-2.45-.28-5.02-1.22-5.02-5.45 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.24-2.58 5.16-5.04 5.44.4.34.75 1.02.75 2.06 0 1.49-.01 2.69-.01 3.05 0 .29.2.64.76.53C19.85 20.99 23 16.87 23 12c0-6.08-4.92-11-11-11z" />
  </svg>
);

export const auth2Demo: Auth2Props = {
  heading: "Create your account",
  description: "Start your 14-day free trial. No credit card required.",
  socialProviders: [
    { label: "Google", icon: GoogleIcon, href: "https://beste.co" },
    { label: "GitHub", icon: GithubIcon, href: "https://beste.co" },
  ],
  fields: [
    { label: "Full name", placeholder: "Jane Cooper", type: "text" },
    { label: "Email", placeholder: "you@example.com", type: "email" },
    { label: "Password", placeholder: "Create a password", type: "password" },
  ],
  signinPrompt: {
    text: "Already have an account?",
    linkLabel: "Sign in",
    href: "https://beste.co",
  },
  labels: {
    divider: "or sign up with email",
    terms:
      'I agree to the <a href="https://beste.co">Terms of Service</a> and <a href="https://beste.co">Privacy Policy</a>',
    submit: "Create account",
    passwordToggle: "Toggle password visibility",
  },
  showcase: {
    image: {
      src: "https://images.unsplash.com/photo-1779243829348-85bf26cff23b?q=80&w=987&auto=format&fit=crop",
      alt: "Team collaborating in a modern workspace",
    },
    quote:
      "Switching to this platform cut our onboarding time in half. The whole team was up and running within a single afternoon.",
    author: {
      name: "Maria Santos",
      title: "Head of Operations, Northwind",
      avatar: {
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        alt: "Maria Santos",
      },
    },
  },
  mediaPosition: "right",
};

export function Auth2({
  heading,
  description,
  socialProviders = [],
  fields = [],
  signinPrompt,
  labels = {},
  showcase,
  mediaPosition = "right",
  className,
}: Auth2Props) {
  const [showPassword, setShowPassword] = useState(false);
  const fieldId = useId();

  const {
    divider: dividerLabel,
    terms: termsLabel,
    submit: submitLabel,
    passwordToggle: passwordToggleLabel,
  } = labels;

  return (
    <section className={cn("min-h-screen w-full", className)}>
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Form column */}
        <div
          className={cn(
            "flex items-center justify-center px-4 py-16 md:px-6 md:py-24",
            mediaPosition === "left" ? "lg:order-2" : "lg:order-1"
          )}
        >
          <div className="w-full max-w-md">
            <div className="mb-8">
              {heading && <h1 className="text-2xl font-bold md:text-3xl">{heading}</h1>}
              {description && <p className="mt-2 text-base text-muted-foreground">{description}</p>}
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <FieldGroup>
                {socialProviders.length > 0 && (
                  <Field className="grid grid-cols-2 gap-4">
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

                {dividerLabel && <FieldSeparator>{dividerLabel}</FieldSeparator>}

                {fields.map((field, index) => {
                  const isPassword = field.type === "password";
                  const inputId = `${fieldId}-${index}`;
                  return (
                    <Field key={index}>
                      <FieldLabel htmlFor={inputId}>{field.label}</FieldLabel>
                      {isPassword ? (
                        <div className="relative">
                          <Input
                            id={inputId}
                            type={showPassword ? "text" : "password"}
                            placeholder={field.placeholder}
                            className="h-11 pr-11"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={passwordToggleLabel}
                            onClick={() => setShowPassword((value) => !value)}
                            className="absolute right-1 top-1/2 size-9 -translate-y-1/2 text-muted-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Input
                          id={inputId}
                          type={field.type ?? "text"}
                          placeholder={field.placeholder}
                          className="h-11"
                        />
                      )}
                    </Field>
                  );
                })}

                {termsLabel && (
                  <Field orientation="horizontal">
                    <Checkbox id={`${fieldId}-terms`} className="mt-0.5" />
                    <FieldLabel
                      htmlFor={`${fieldId}-terms`}
                      className="font-normal text-muted-foreground [&_a]:font-medium [&_a]:text-foreground [&_a]:underline"
                      dangerouslySetInnerHTML={{ __html: termsLabel }}
                    />
                  </Field>
                )}

                {submitLabel && (
                  <Field>
                    <Button type="submit" size="lg">
                      {submitLabel}
                    </Button>
                  </Field>
                )}
              </FieldGroup>
            </form>

            {signinPrompt && (
              <FieldDescription className="!mt-6 text-center">
                {signinPrompt.text}{" "}
                <Link href={signinPrompt.href} className="font-medium text-foreground">
                  {signinPrompt.linkLabel}
                </Link>
              </FieldDescription>
            )}
          </div>
        </div>

        {/* Showcase column */}
        {showcase && (
          <div
            className={cn(
              "relative hidden overflow-hidden lg:block",
              mediaPosition === "left" ? "lg:order-1" : "lg:order-2"
            )}
          >
            <img
              className="absolute inset-0 size-full object-cover"
              src={showcase.image.src}
              alt={showcase.image.alt}
            />
            <div className="absolute inset-0 bg-foreground/50" />

            {(showcase.quote || showcase.author) && (
              <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
                {showcase.quote && (
                  <blockquote className="text-xl font-medium text-background xl:text-2xl">
                    “{showcase.quote}”
                  </blockquote>
                )}
                {showcase.author && (
                  <div className="mt-6 flex items-center gap-3">
                    {showcase.author.avatar && (
                      <Avatar className="size-11">
                        <AvatarImage
                          src={showcase.author.avatar.src}
                          alt={showcase.author.avatar.alt}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {showcase.author.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p className="font-semibold text-background">{showcase.author.name}</p>
                      <p className="text-sm text-background/70">{showcase.author.title}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
