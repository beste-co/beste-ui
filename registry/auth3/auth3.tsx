"use client";

import { ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

interface Auth3Props {
  icon?: React.ReactNode;
  heading?: string;
  description?: string;
  otpLength?: number;
  resendPrompt?: {
    text: string;
    linkLabel: string;
  };
  resendSeconds?: number;
  backLink?: {
    label: string;
    href: string;
  };
  labels?: {
    verify?: string;
    resendCountdown?: string;
  };
  className?: string;
}

export const auth3Demo: Auth3Props = {
  icon: <MailCheck className="size-6" />,
  heading: "Check your email",
  description:
    'Enter the 6-digit verification code we sent to <strong>jane@example.com</strong>',
  otpLength: 6,
  resendPrompt: {
    text: "Didn't get the code?",
    linkLabel: "Resend",
  },
  resendSeconds: 30,
  backLink: {
    label: "Back to sign in",
    href: "https://beste.co",
  },
  labels: {
    verify: "Verify email",
    resendCountdown: "Resend code in {seconds}s",
  },
};

export function Auth3({
  icon,
  heading,
  description,
  otpLength = 6,
  resendPrompt,
  resendSeconds = 30,
  backLink,
  labels = {},
  className,
}: Auth3Props) {
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(resendSeconds);

  const { verify: verifyLabel, resendCountdown: resendCountdownLabel } = labels;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleResend = () => {
    setCode("");
    setSecondsLeft(resendSeconds);
  };

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
            <p
              className="mt-2 text-base text-muted-foreground [&>strong]:font-semibold [&>strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        <div className="rounded-md border bg-card p-6 md:p-8">
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <Field>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={otpLength}
                    value={code}
                    onChange={setCode}
                    containerClassName="justify-center"
                  >
                    <InputOTPGroup>
                      {Array.from({ length: otpLength }).map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="size-12 text-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </Field>

              {verifyLabel && (
                <Field>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={code.length < otpLength}
                  >
                    {verifyLabel}
                  </Button>
                </Field>
              )}

              {resendPrompt && (
                <FieldDescription className="text-center">
                  {secondsLeft > 0 ? (
                    (resendCountdownLabel ?? "Resend code in {seconds}s").replace(
                      "{seconds}",
                      String(secondsLeft)
                    )
                  ) : (
                    <>
                      {resendPrompt.text}{" "}
                      <button
                        type="button"
                        onClick={handleResend}
                        className="font-medium text-primary hover:underline"
                      >
                        {resendPrompt.linkLabel}
                      </button>
                    </>
                  )}
                </FieldDescription>
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
