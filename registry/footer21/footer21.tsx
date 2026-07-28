"use client";

import { Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href?: string;
}

interface TrustBadge {
  icon: "shieldCheck" | "lock";
  label: string;
}

interface Footer21Props {
  logo?: {
    text?: string;
    href?: string;
  };
  links?: NavLink[];
  trustBadges?: TrustBadge[];
  paymentImage?: {
    src: string;
    alt: string;
  };
  copyright?: string;
  className?: string;
}

const trustIcons = {
  shieldCheck: ShieldCheck,
  lock: Lock,
};

export const footer21Demo: Footer21Props = {
  logo: {
    text: "Beste Inc.",
    href: "https://beste.co",
  },
  links: [
    { label: "Shop", href: "https://beste.co" },
    { label: "About", href: "https://beste.co" },
    { label: "Contact", href: "https://beste.co" },
    { label: "Shipping", href: "https://beste.co" },
    { label: "Returns", href: "https://beste.co" },
    { label: "Privacy", href: "https://beste.co" },
    { label: "Terms", href: "https://beste.co" },
  ],
  trustBadges: [
    { icon: "shieldCheck", label: "Secure Checkout" },
    { icon: "lock", label: "SSL Encrypted" },
  ],
  paymentImage: {
    src: "https://oud.pics/sm/l/payment-cards.png",
    alt: "Payment methods",
  },
  copyright: "© 2026 Beste Inc. All rights reserved.",
};

export function Footer21({
  logo,
  links = [],
  trustBadges = [],
  paymentImage,
  copyright,
  className,
}: Footer21Props) {
  return (
    <footer className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-8 text-center">
          {logo?.text && (
            <Link href={logo.href ?? "#"} className="text-xl font-bold tracking-tight">
              {logo.text}
            </Link>
          )}
          {links.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href ?? "#"}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center gap-6">
            {trustBadges.length > 0 && (
              <div className="flex flex-wrap justify-center gap-6">
                {trustBadges.map((badge, index) => {
                  const Icon = trustIcons[badge.icon];
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Icon className="size-4" />
                      <span>{badge.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {paymentImage && (
              <img
                src={paymentImage.src}
                alt={paymentImage.alt}
                width={200}
                height={32}
                className="h-8 w-auto"
              />
            )}
            {copyright && <p className="text-sm text-muted-foreground">{copyright}</p>}
          </div>
        </div>
      </div>
    </footer>
  );
}
