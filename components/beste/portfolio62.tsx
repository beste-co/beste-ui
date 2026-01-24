"use client";

import {
  Dribbble,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SocialLink {
  platform: string;
  href: string;
  followers?: string;
}

interface Portfolio62Props {
  heading?: string;
  description?: string;
  links?: SocialLink[];
  labels?: {
    followers?: string;
  };
  className?: string;
}

const platformIcons: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble,
  instagram: Instagram,
  youtube: Youtube,
};

export const portfolio62Demo: Portfolio62Props = {
  heading: "Connect With Me",
  description: "Follow my work and updates on social media.",
  links: [
    { platform: "twitter", href: "https://beste.co", followers: "12.5K" },
    { platform: "github", href: "https://beste.co", followers: "8.2K" },
    { platform: "linkedin", href: "https://beste.co", followers: "15K" },
    { platform: "dribbble", href: "https://beste.co", followers: "6.8K" },
    { platform: "instagram", href: "https://beste.co", followers: "22K" },
    { platform: "youtube", href: "https://beste.co", followers: "45K" },
  ],
  labels: {
    followers: "followers",
  },
};

export function Portfolio62({
  heading,
  description,
  links = [],
  labels = {},
  className,
}: Portfolio62Props) {
  const { followers: followersLabel } = labels;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(heading || description) && (
          <div className="mb-12 text-center">
            {heading && (
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-3">
          {links.map((link, index) => {
            const Icon = platformIcons[link.platform.toLowerCase()] || Github;
            return (
              <Button
                key={index}
                variant="outline"
                size="lg"
                className="h-auto flex-col gap-2 py-6"
                asChild
              >
                <Link href={link.href}>
                  <Icon className="size-6" />
                  <span className="capitalize">{link.platform}</span>
                  {link.followers && followersLabel && (
                    <span className="text-xs text-muted-foreground font-normal">
                      {link.followers} {followersLabel}
                    </span>
                  )}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
