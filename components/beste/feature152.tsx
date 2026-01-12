"use client";

import { Clock, Globe, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureItem {
  icon?: React.ReactNode;
  label: string;
}

interface ButtonItem {
  label: string;
  href?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
}

interface Feature152Props {
  badge?: { label: string; variant?: "default" | "secondary" | "outline" };
  heading?: string;
  description?: string;
  items?: FeatureItem[];
  buttons?: ButtonItem[];
  className?: string;
}

export const feature152Demo: Feature152Props = {
  badge: { label: "Features", variant: "default" },
  heading: "Built for speed",
  description: "Key features that make us different.",
  items: [
    { icon: <Zap className="size-4" />, label: "Lightning Fast" },
    { icon: <Shield className="size-4" />, label: "Secure" },
    { icon: <Globe className="size-4" />, label: "Global CDN" },
    { icon: <Clock className="size-4" />, label: "24/7 Support" },
  ],
  buttons: [],
};

export function Feature152({
  badge, heading, description, items = [], buttons = [], className,
}: Feature152Props) {
  if (items.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {(badge || heading || description) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {badge && <div className="mb-4 flex justify-center"><Badge variant={badge.variant ?? "default"}>{badge.label}</Badge></div>}
            {heading && <h2 className="text-3xl font-semibold md:text-5xl">{heading}</h2>}
            {description && <p className="mt-4 text-base md:text-lg text-muted-foreground">{description}</p>}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          {items.map((item, index) => (
            <div key={index} className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2">
              {item.icon && <span className="text-primary">{item.icon}</span>}
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {buttons.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {buttons.map((button, index) => (
              <Button key={index} variant={button.variant ?? "default"} asChild>
                <Link href={button.href ?? "#"}>{button.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
