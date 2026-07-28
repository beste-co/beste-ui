"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href?: string;
}

interface Footer9Props {
  logo?: {
    text?: string;
    href?: string;
  };
  links?: NavLink[];
  copyright?: string;
  className?: string;
}

export const footer9Demo: Footer9Props = {
  logo: {
    text: "Beste Inc.",
    href: "https://beste.co",
  },
  links: [
    { label: "About", href: "https://beste.co" },
    { label: "Features", href: "https://beste.co" },
    { label: "Pricing", href: "https://beste.co" },
    { label: "Contact", href: "https://beste.co" },
  ],
  copyright: "© 2026 Beste Inc. All rights reserved.",
};

export function Footer9({
  logo,
  links = [],
  copyright,
  className,
}: Footer9Props) {
  return (
    <footer className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            {logo?.text && (
              <Link
                href={logo.href ?? "#"}
                className="text-xl font-bold tracking-tight"
              >
                {logo.text}
              </Link>
            )}
            {links.length > 0 && (
              <nav className="flex flex-wrap gap-4 md:gap-6">
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
          {copyright && (
            <p className="text-sm text-muted-foreground">{copyright}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
