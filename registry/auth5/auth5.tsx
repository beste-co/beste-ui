"use client";

import { Check, Eye, EyeOff, Lock } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordRequirement {
  label: string;
  regex: string;
}

interface Auth5Props {
  icon?: React.ReactNode;
  heading?: string;
  description?: string;
  requirements?: PasswordRequirement[];
  labels?: {
    newPassword?: string;
    newPasswordPlaceholder?: string;
    confirmPassword?: string;
    confirmPasswordPlaceholder?: string;
    submit?: string;
    passwordToggle?: string;
  };
  className?: string;
}

export const auth5Demo: Auth5Props = {
  icon: <Lock className="size-6" />,
  heading: "Set a new password",
  description:
    "Your new password must be different from previously used passwords.",
  requirements: [
    { label: "At least 8 characters", regex: ".{8,}" },
    { label: "One uppercase letter", regex: "[A-Z]" },
    { label: "One number", regex: "[0-9]" },
    { label: "One special character", regex: "[^A-Za-z0-9]" },
  ],
  labels: {
    newPassword: "New password",
    newPasswordPlaceholder: "Enter a new password",
    confirmPassword: "Confirm password",
    confirmPasswordPlaceholder: "Re-enter your password",
    submit: "Reset password",
    passwordToggle: "Toggle password visibility",
  },
};

export function Auth5({
  icon,
  heading,
  description,
  requirements = [],
  labels = {},
  className,
}: Auth5Props) {
  const fieldId = useId();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    newPassword: newPasswordLabel,
    newPasswordPlaceholder,
    confirmPassword: confirmPasswordLabel,
    confirmPasswordPlaceholder,
    submit: submitLabel,
    passwordToggle: passwordToggleLabel,
  } = labels;

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
                {newPasswordLabel && (
                  <FieldLabel htmlFor={`${fieldId}-new`}>
                    {newPasswordLabel}
                  </FieldLabel>
                )}
                <div className="relative">
                  <Input
                    id={`${fieldId}-new`}
                    type={showPassword ? "text" : "password"}
                    placeholder={newPasswordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </Field>

              <Field>
                {confirmPasswordLabel && (
                  <FieldLabel htmlFor={`${fieldId}-confirm`}>
                    {confirmPasswordLabel}
                  </FieldLabel>
                )}
                <div className="relative">
                  <Input
                    id={`${fieldId}-confirm`}
                    type={showConfirm ? "text" : "password"}
                    placeholder={confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 pr-11"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={passwordToggleLabel}
                    onClick={() => setShowConfirm((value) => !value)}
                    className="absolute right-1 top-1/2 size-9 -translate-y-1/2 text-muted-foreground"
                  >
                    {showConfirm ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
              </Field>

              {requirements.length > 0 && (
                <ul className="flex flex-col gap-2.5">
                  {requirements.map((requirement, index) => {
                    const met =
                      password.length > 0 &&
                      new RegExp(requirement.regex).test(password);
                    return (
                      <li
                        key={index}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <span
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full transition-colors",
                            met
                              ? "bg-emerald-500/15 text-emerald-500"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Check className="size-3.5" />
                        </span>
                        <span
                          className={cn(
                            met ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {requirement.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
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
        </div>
      </div>
    </section>
  );
}
