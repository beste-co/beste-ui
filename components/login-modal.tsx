"use client";

import { LoginForm } from "@/components/login-form";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/**
 * Public-build sign-in dialog. Same trigger points as the private build, but
 * what opens is an explanation rather than a form. See login-form.tsx.
 */

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: () => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        {/* The visible heading is EmptyTitle inside the form; this is the one
            the dialog itself needs to announce. */}
        <DialogTitle className="sr-only">Sign in</DialogTitle>
        <LoginForm isModal />
      </DialogContent>
    </Dialog>
  );
}
