"use client";

import { cn } from "@/lib/utils";
import { OTPInput, type SlotProps } from "input-otp";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface OtpFormProps {
  email: string;
  onSuccess?: () => void;
}

export const OtpForm = ({
  email,
  onSuccess,
}: OtpFormProps) => {
  const [value, setValue] = useState("");
  const [hasGuessed, setHasGuessed] = useState<undefined | boolean>(undefined);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isResendingLoading, setIsResendingLoading] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleVerifyEmail = async () => {
    if (value.length !== 4) return;

    setIsLoading(true);
    setHasGuessed(undefined);

    const response = await fetch(`/api/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp: value }),
    });

    if (response.ok) {
      setIsSuccess(true);
      setHasGuessed(true);
      onSuccess?.();

      router.push("/");
      router.refresh();
    } else {
      setHasGuessed(false);
    }

    setIsLoading(false);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setIsResendingLoading(true);
    setResendError(null);
    try {
      const response = await fetch(`/api/send-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, type: "sign-in" }),
      });

      if (response.ok) {
        setValue("");
        setHasGuessed(undefined);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      } else if (response.status === 429) {
        const errorData = await response.json();
        const retryAfter = errorData.retryAfter || 300;
        setResendError(
          `Too many attempts. Please try again in ${Math.ceil(
            retryAfter / 60
          )} minutes.`
        );
      } else {
        setResendError("Failed to resend code. Please try again.");
        setIsResendingLoading(false);
        setIsResending(false);
        console.error("Failed to resend code");
      }
    } catch (error) {
      setResendError("Failed to resend code. Please try again.");
      setIsResendingLoading(false);
      setIsResending(false);
      setIsSuccess(false);
      setIsLoading(false);
      console.error("Failed to resend code:", error);
    } finally {
      setValue("");
      setHasGuessed(undefined);
      setIsResending(false);
      setIsSuccess(false);
      setIsLoading(false);
      setIsResendingLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
        <p className="mt-1.5 text-balance text-base text-foreground/70">
          We&apos;ve sent a code to <span className="text-foreground">{email}</span>
        </p>
      </div>

      <form onSubmit={handleVerifyEmail} className="otp-container flex flex-col gap-4">
        <div className="flex justify-center">
          <OTPInput
            ref={inputRef}
            value={value}
            onChange={setValue}
            containerClassName="flex items-center gap-2 has-[:disabled]:opacity-50 otp-bg"
            maxLength={4}
            autoFocus={true}
            disabled={isLoading || isSuccess}
            onFocus={() => setHasGuessed(undefined)}
            render={({ slots }) => (
              <div className="flex gap-2">
                {slots.map((slot, idx) => (
                  <Slot key={idx} {...slot} value={value} />
                ))}
              </div>
            )}
            onComplete={handleVerifyEmail}
          />
        </div>
        {hasGuessed === false && (
          <p
            className="text-center text-base text-destructive"
            role="alert"
            aria-live="polite"
          >
            Invalid code. Please try again.
          </p>
        )}
        {isSuccess && (
          <p
            className="text-center text-base text-teal-600 dark:text-teal-400"
            role="alert"
            aria-live="polite"
          >
            Success! Redirecting...
          </p>
        )}
        {resendError && (
          <div className="rounded-xl bg-destructive/10 p-4 text-center text-base text-destructive">
            {resendError}
          </div>
        )}
        {hasGuessed === false ? (
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || isResendingLoading || isSuccess || !!resendError}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-muted/60 px-5 text-base transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
            >
              {isResendingLoading ? <HugeiconsIcon icon={Loading03Icon} size={16} strokeWidth={2} className="animate-spin" /> : null}
              Resend code
            </button>
          </div>
        ) : (
          <p className="text-center text-base text-foreground/70">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || isResendingLoading || isSuccess || !!resendError}
              className="cursor-pointer font-medium text-foreground underline underline-offset-4 disabled:pointer-events-none disabled:opacity-50"
            >
              Resend code
            </button>
          </p>
        )}
      </form>
    </div>
  );
};

function Slot(props: SlotProps & { value: string }) {
  return (
    <div
      className={cn(
        // Filled, round, no shadow — the shape every field on the site wears,
        // at the size a digit needs.
        "flex size-14 items-center justify-center rounded-2xl bg-muted/60 text-xl font-medium text-foreground transition-colors",
        { "z-10 bg-muted ring-2 ring-ring/50": props.isActive }
      )}
    >
      {props.isActive && props.value.length < 4 ? (
        <div className="animate-pulse">
          <div className="rounded-full bg-foreground h-1.5 w-1.5 animate-ping" />
        </div>
      ) : null}
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
