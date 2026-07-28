"use client";

import { ArrowDataTransferVerticalIcon, Bookmark02Icon, CrownIcon, Login01Icon, Logout01Icon, Settings01Icon, User02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { COUNTDOWN_END, DISCOUNTS_ENABLED } from "@/lib/pricing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

import Link from "next/link";
import { LoginModal } from "@/components/login-modal";
import { authClient } from "@/lib/auth.client";
import { generateGradient } from "@/lib/generate-avatar";
import { useAuth } from "@/lib/auth-context";
import { useLicense } from "@/lib/license-context";
import {
  ACCOUNT_HREF,
  FAVORITES_HREF,
  PRICING_HREF,
  hostedLinkProps,
} from "@/lib/site-links";

interface UserFooterProps {
  variant?: "desktop" | "mobile";
}

export function UserFooter({ variant = "desktop" }: UserFooterProps) {
  const { session, loading, refreshSession } = useAuth();
  const { hasPro, loading: licenseLoading } = useLicense();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [avatarGradient, setAvatarGradient] = useState<{
    fromColor: string;
    toColor: string;
  } | null>(null);
  const [earlyAccessActive, setEarlyAccessActive] = useState(false);

  useEffect(() => {
    if (DISCOUNTS_ENABLED && Date.now() < COUNTDOWN_END) {
      setEarlyAccessActive(true);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      generateGradient(session.user.email).then(setAvatarGradient);
    }
    // Reset image error when user changes
    setImageError(false);
  }, [session?.user?.email]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0]?.trim();
      if (name?.startsWith("better-auth")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
    window.location.href = "/";
  };

  const getInitials = (name: string | undefined, email: string | undefined) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email && email.length > 0) {
      return email.charAt(0).toUpperCase();
    }
    return "U";
  };

  if (loading) {
    return (
      <footer className={variant === "mobile" ? "mt-16 pt-8 border-t" : "mt-auto py-4 px-4 pt-8"}>
        <div className="flex w-full items-center gap-2 rounded-lg p-2">
          <div className="size-8 shrink-0 rounded-full bg-muted animate-pulse" />
          <div className="grid flex-1 text-left text-base leading-tight min-w-0 gap-1.5">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <>
      <footer className={variant === "mobile" ? "mt-16 pt-8 border-t" : "mt-auto py-4 px-4 pt-4"}>
        {/* Early Access Banner - only for non-Pro users when discount is active */}
        {!licenseLoading && !hasPro && earlyAccessActive && (
          <Link
            href={PRICING_HREF}
            {...hostedLinkProps}
            className="mb-3 flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500/10 to-amber-500/10 border border-teal-500/20 p-2.5 text-sm hover:from-teal-500/20 hover:to-amber-500/20 transition-colors group"
          >
            <HugeiconsIcon icon={CrownIcon} size={16} strokeWidth={2} className="text-teal-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">Early Access Pricing</p>
              <p className="text-muted-foreground truncate">
                Get lifetime access at a special rate
              </p>
            </div>
          </Link>
        )}
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-muted transition-colors"
              >
                {session.user.image && !imageError ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="size-8 shrink-0 rounded-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-white text-sm font-medium"
                    style={
                      avatarGradient
                        ? {
                            background: `linear-gradient(135deg, ${avatarGradient.fromColor}, ${avatarGradient.toColor})`,
                          }
                        : {
                            background: "linear-gradient(135deg, #FF7322, #f5af19)",
                          }
                    }
                  >
                    {getInitials(session.user.name, session.user.email)}
                  </div>
                )}
                <div className="grid flex-1 text-left text-base leading-tight min-w-0">
                  <span className="truncate font-medium text-foreground flex items-center gap-1.5">
                    {session.user.name || session.user.email?.split("@")[0]}
                    {hasPro && <HugeiconsIcon icon={CrownIcon} size={14} strokeWidth={2} className="text-teal-500 shrink-0" />}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    {session.user.email}
                  </span>
                </div>
                <HugeiconsIcon icon={ArrowDataTransferVerticalIcon} size={16} strokeWidth={2} className="ml-auto text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem
                className="flex items-center gap-2"
                onSelect={(e) => e.preventDefault()}
              >
                <HugeiconsIcon icon={User02Icon} size={16} strokeWidth={2} />
                <div className="flex flex-col">
                  <span className="text-base font-medium flex items-center gap-1.5">
                    {session.user.name || "User"}
                    {hasPro && <HugeiconsIcon icon={CrownIcon} size={14} strokeWidth={2} className="text-teal-500 shrink-0" />}
                  </span>
                  <span className="text-sm text-muted-foreground">{session.user.email}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!hasPro && (
                <DropdownMenuItem asChild>
                  <Link
                    href={PRICING_HREF}
                    {...hostedLinkProps}
                    className="flex items-center gap-2 bg-teal-500/10 text-teal-600"
                  >
                    <HugeiconsIcon icon={CrownIcon} size={16} strokeWidth={2} className="text-teal-500" />
                    Upgrade to Pro
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={ACCOUNT_HREF} {...hostedLinkProps} className="flex items-center gap-2">
                  <HugeiconsIcon icon={Settings01Icon} size={16} strokeWidth={2} />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={FAVORITES_HREF} {...hostedLinkProps} className="flex items-center gap-2">
                  <HugeiconsIcon icon={Bookmark02Icon} size={16} strokeWidth={2} />
                  Favorites
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2">
                <HugeiconsIcon icon={Logout01Icon} size={16} strokeWidth={2} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-muted transition-colors"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon icon={User02Icon} size={16} strokeWidth={2} className="text-muted-foreground" />
            </div>
            <div className="grid flex-1 text-left text-base leading-tight min-w-0">
              <span className="truncate font-medium text-foreground">Login</span>
              <span className="truncate text-sm text-muted-foreground">
                Sign in to your account
              </span>
            </div>
            <HugeiconsIcon icon={Login01Icon} size={16} strokeWidth={2} className="ml-auto text-muted-foreground" />
          </button>
        )}
      </footer>

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onLoginSuccess={refreshSession}
      />
    </>
  );
}
