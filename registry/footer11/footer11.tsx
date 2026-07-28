"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href?: string;
}

interface SocialLink {
  icon: "twitter" | "github" | "linkedin";
  href?: string;
  label?: string;
}

interface Footer11Props {
  logo?: {
    text?: string;
    href?: string;
  };
  navLinks?: NavLink[];
  socialLinks?: SocialLink[];
  copyright?: string;
  className?: string;
}

const socialIcons = {
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
};

export const footer11Demo: Footer11Props = {
  logo: {
    text: "Beste Inc.",
    href: "https://beste.co",
  },
  navLinks: [
    { label: "About", href: "https://beste.co" },
    { label: "Features", href: "https://beste.co" },
    { label: "Pricing", href: "https://beste.co" },
    { label: "Blog", href: "https://beste.co" },
    { label: "Contact", href: "https://beste.co" },
  ],
  socialLinks: [
    { icon: "twitter", href: "https://beste.co", label: "Twitter" },
    { icon: "github", href: "https://beste.co", label: "GitHub" },
    { icon: "linkedin", href: "https://beste.co", label: "LinkedIn" },
  ],
  copyright: "© 2026 Beste Inc. All rights reserved.",
};

export function Footer11({
  logo,
  navLinks = [],
  socialLinks = [],
  copyright,
  className,
}: Footer11Props) {
  return (
    <footer className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          {logo?.text && (
            <Link
              href={logo.href ?? "#"}
              className="text-xl font-bold tracking-tight"
            >
              {logo.text}
            </Link>
          )}
          {navLinks.length > 0 && (
            <nav className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6">
              {navLinks.map((link, index) => (
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
          {socialLinks.length > 0 && (
            <div className="mt-8 flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = socialIcons[social.icon];
                return (
                  <Link
                    key={index}
                    href={social.href ?? "#"}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={social.label}
                  >
                    <Icon className="size-5" />
                  </Link>
                );
              })}
            </div>
          )}
          {copyright && (
            <p className="mt-8 text-sm text-muted-foreground">{copyright}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
