"use client";

import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SocialLink {
  id: string;
  icon?: React.ReactNode;
  label: string;
  href?: string;
}

interface ComingSoon3Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  socialHeading?: string;
  socialLinks?: SocialLink[];
  className?: string;
}

export const comingsoon3Demo: ComingSoon3Props = {
  badge: { label: "Launching Soon", variant: "secondary" },
  heading: "Stay connected",
  description:
    "Follow us on social media to get the latest updates and be the first to know when we launch.",
  socialHeading: "Find us on",
  socialLinks: [
    {
      id: "social-1",
      icon: <Twitter className="size-5" />,
      label: "Twitter",
      href: "https://x.com/withbeste",
    },
    {
      id: "social-2",
      icon: <Github className="size-5" />,
      label: "GitHub",
      href: "#",
    },
    {
      id: "social-3",
      icon: <Linkedin className="size-5" />,
      label: "LinkedIn",
      href: "#",
    },
    {
      id: "social-4",
      icon: <Mail className="size-5" />,
      label: "Email",
      href: "#",
    },
  ],
};

export function ComingSoon3({
  badge,
  heading,
  description,
  socialHeading,
  socialLinks = [],
  className,
}: ComingSoon3Props) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="flex flex-col items-center text-center gap-6 md:gap-8">
          {badge && (
            <div>
              <Badge variant={badge.variant ?? "default"}>{badge.label}</Badge>
            </div>
          )}

          {heading && (
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance max-w-4xl">
              {heading}
            </h2>
          )}

          {description && (
            <p className="text-lg md:text-xl text-balance max-w-2xl text-muted-foreground">
              {description}
            </p>
          )}

          {socialLinks.length > 0 && (
            <div className="mt-6">
              {socialHeading && (
                <div className="text-sm font-medium mb-4 uppercase tracking-wider text-muted-foreground">
                  {socialHeading}
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4">
                {socialLinks.map((social) => {
                  const content = (
                    <span className="flex items-center gap-3">
                      {social.icon && (
                        <span className="transition-transform group-hover:scale-110">
                          {social.icon}
                        </span>
                      )}
                      <span className="font-medium">{social.label}</span>
                    </span>
                  );

                  const linkClassName = cn(
                    "group flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300",
                    "bg-muted hover:bg-muted/80"
                  );

                  if (social.href) {
                    return (
                      <Link
                        key={social.id}
                        href={social.href}
                        className={linkClassName}
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <div key={social.id} className={linkClassName}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full animate-pulse bg-green-500" />
            <span>Launching soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
