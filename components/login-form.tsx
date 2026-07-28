import { ArrowUpRight01Icon, SquareLock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

/**
 * Public-build sign-in.
 *
 * There is no account system in this repository, and a button that silently
 * does nothing is worse than one that explains itself. So this borrows the
 * library's own empty state and says where accounts actually live.
 */

interface LoginFormProps extends ComponentProps<"div"> {
  onLoginSuccess?: () => void;
  message?: string | null;
  isModal?: boolean;
}

export function LoginForm({
  className,
  onLoginSuccess: _onLoginSuccess,
  isModal = false,
  message,
  ...props
}: LoginFormProps) {
  return (
    <Empty
      // Inside a dialog the surface already has its own padding, and Empty's
      // `md:p-12` on top of it reads as a gap rather than breathing room.
      className={cn(isModal && "p-2 md:p-4", className)}
      {...props}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={SquareLock01Icon} size={20} strokeWidth={2} />
        </EmptyMedia>
        <EmptyTitle>{message ?? "Sign-in lives on the hosted site"}</EmptyTitle>
        <EmptyDescription>
          Every block in this repository is free and needs no account. Sign-in,
          favorites that follow you between devices, and the Pro catalogue are
          part of ui.beste.co.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild variant="outline">
          <a href="https://ui.beste.co" rel="noreferrer" target="_blank">
            Open ui.beste.co
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} strokeWidth={2} />
          </a>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
