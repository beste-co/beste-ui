"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SocialLink {
  platform: string;
  handle: string;
  url: string;
  followers?: string;
}

interface Education86Props {
  badge?: { label: string; variant?: "default" | "secondary" | "outline" };
  heading: string;
  description?: string;
  socialLinks?: SocialLink[];
  className?: string;
}

export const education86Demo: Education86Props = {
  badge: { label: "Connect", variant: "outline" },
  heading: "Follow Us on Social Media",
  description: "Stay updated with campus news, events, and student life.",
  socialLinks: [
    {
      platform: "Instagram",
      handle: "@universitylife",
      url: "https://instagram.com/beste.official",
      followers: "125K",
    },
    {
      platform: "Twitter",
      handle: "@university",
      url: "https://x.com/withbeste",
      followers: "89K",
    },
    {
      platform: "LinkedIn",
      handle: "University",
      url: "https://linkedin.com/company/bestestudio",
      followers: "245K",
    },
    {
      platform: "YouTube",
      handle: "University Channel",
      url: "#",
      followers: "50K",
    },
  ],
};

export function Education86({
  badge,
  heading,
  description,
  socialLinks = [],
  className,
}: Education86Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {badge && (
            <Badge variant={badge.variant} className="mb-4">
              {badge.label}
            </Badge>
          )}
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 md:grid-cols-2">
            {socialLinks.map((social, i) => (
              <Link
                key={i}
                href={social.url}
                className="flex items-center justify-between rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="font-semibold">{social.platform}</p>
                  <p className="text-sm text-muted-foreground">
                    {social.handle}
                  </p>
                </div>
                {social.followers && (
                  <div className="text-right">
                    <p className="text-lg font-bold">{social.followers}</p>
                    <p className="text-xs text-muted-foreground">followers</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
