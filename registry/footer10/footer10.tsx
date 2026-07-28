"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href?: string;
}

interface Footer10Props {
  logo?: {
    text?: string;
    href?: string;
  };
  tagline?: string;
  links?: NavLink[];
  copyright?: string;
  className?: string;
}

export const footer10Demo: Footer10Props = {
  logo: {
    text: "Beste Inc.",
    href: "https://beste.co",
  },
  tagline: "Building tools for the modern web.",
  links: [
    { label: "About", href: "https://beste.co" },
    { label: "Careers", href: "https://beste.co" },
    { label: "Privacy", href: "https://beste.co" },
    { label: "Terms", href: "https://beste.co" },
  ],
  copyright: "© 2026 Beste Inc.",
};

export function Footer10({
  logo,
  tagline,
  links = [],
  copyright,
  className,
}: Footer10Props) {
  return (
    <footer className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            {logo?.text && (
              <Link
                href={logo.href ?? "#"}
                className="text-xl font-bold tracking-tight"
              >
                {logo.text}
              </Link>
            )}
            {tagline && (
              <p className="text-sm text-muted-foreground">{tagline}</p>
            )}
            {copyright && (
              <p className="pt-2 text-xs text-muted-foreground">{copyright}</p>
            )}
          </div>
          {links.length > 0 && (
            <nav className="flex flex-wrap gap-4 md:gap-6">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href ?? "#"}
                  className="text-sm text-muted-foreground transition-colors hover:underline hover:underline-offset-4"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
