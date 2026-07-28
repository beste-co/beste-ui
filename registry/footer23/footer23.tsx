"use client";

import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SocialLink {
  icon:
    | "twitter"
    | "github"
    | "linkedin"
    | "facebook"
    | "instagram"
    | "youtube";
  href?: string;
  label?: string;
}

interface NavLink {
  label: string;
  href?: string;
}

interface Footer23Props {
  logo?: {
    text?: string;
    href?: string;
  };
  heading?: string;
  description?: string;
  socialLinks?: SocialLink[];
  links?: NavLink[];
  copyright?: string;
  className?: string;
}

const socialIcons = {
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
};

export const footer23Demo: Footer23Props = {
  logo: {
    text: "Beste Inc.",
    href: "https://beste.co",
  },
  heading: "Follow us on social media",
  description: "Stay connected and get the latest updates",
  socialLinks: [
    { icon: "twitter", href: "https://beste.co", label: "Twitter" },
    { icon: "facebook", href: "https://beste.co", label: "Facebook" },
    { icon: "instagram", href: "https://beste.co", label: "Instagram" },
    { icon: "linkedin", href: "https://beste.co", label: "LinkedIn" },
    { icon: "youtube", href: "https://beste.co", label: "YouTube" },
    { icon: "github", href: "https://beste.co", label: "GitHub" },
  ],
  links: [
    { label: "About", href: "https://beste.co" },
    { label: "Contact", href: "https://beste.co" },
    { label: "Privacy", href: "https://beste.co" },
    { label: "Terms", href: "https://beste.co" },
  ],
  copyright: "© 2026 Beste Inc. All rights reserved.",
};

export function Footer23({
  logo,
  heading,
  description,
  socialLinks = [],
  links = [],
  copyright,
  className,
}: Footer23Props) {
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
          {heading && (
            <h2 className="mt-8 text-xl font-semibold md:text-2xl">
              {heading}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-muted-foreground">{description}</p>
          )}
          {socialLinks.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {socialLinks.map((social, index) => {
                const Icon = socialIcons[social.icon];
                return (
                  <Link
                    key={index}
                    href={social.href ?? "#"}
                    className="flex size-12 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={social.label}
                  >
                    <Icon className="size-5" />
                  </Link>
                );
              })}
            </div>
          )}
          {links.length > 0 && (
            <nav className="mt-12 flex flex-wrap justify-center gap-4 md:gap-6">
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
          {copyright && (
            <p className="mt-8 text-sm text-muted-foreground">{copyright}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
