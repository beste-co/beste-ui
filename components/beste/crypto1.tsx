"use client";

import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatItem {
  title: string;
  value: string;
}

interface TokenInfo {
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  priceLabel?: string;
  stats?: StatItem[];
  explorerLink?: {
    label: string;
    href: string;
  };
}

interface ButtonItem {
  id: string;
  label: string;
  href?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
}

interface Crypto1Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  token?: TokenInfo;
  buttons?: ButtonItem[];
  displayPosition?: "left" | "right";
  className?: string;
}

export const crypto1Demo: Crypto1Props = {
  badge: { label: "Live", variant: "default" },
  heading: "The Future of Decentralized Finance",
  description:
    "A next-generation blockchain protocol designed for speed, security, and scalability. Join millions of users building the decentralized economy.",
  token: {
    name: "Protocol Token",
    symbol: "BSTE",
    price: 42.58,
    priceChange: 5.23,
    priceLabel: "24h Change",
    stats: [
      { title: "Market Cap", value: "$4.2B" },
      { title: "24h Volume", value: "$892M" },
      { title: "Circulating Supply", value: "100M BSTE" },
      { title: "All-Time High", value: "$68.42" },
    ],
    explorerLink: {
      label: "View on Explorer",
      href: "https://beste.co",
    },
  },
  buttons: [
    { id: "btn-1", label: "Get Started", href: "https://beste.co" },
    {
      id: "btn-2",
      label: "View Documentation",
      href: "https://beste.co",
      variant: "outline",
    },
  ],
};

export function Crypto1({
  badge,
  heading,
  description,
  token,
  buttons = [],
  displayPosition = "left",
  className,
}: Crypto1Props) {
  const isPositive = token?.priceChange ? token.priceChange >= 0 : true;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className={cn(displayPosition === "right" && "lg:order-2")}>
            {badge && (
              <div className="mb-6">
                <Badge variant={badge.variant ?? "default"}>
                  {badge.label}
                </Badge>
              </div>
            )}
            {heading && (
              <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl text-balance">
                {heading}
              </h1>
            )}
            {description && (
              <div
                className="mt-4 text-lg text-muted-foreground text-balance"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
            {buttons.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {buttons.map((button) => (
                  <Button
                    key={button.id}
                    variant={button.variant ?? "default"}
                    asChild
                  >
                    <Link href={button.href ?? "#"}>{button.label}</Link>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Token Stats Card */}
          {token && (
            <div className="rounded-2xl border bg-card p-6 md:p-8">
              {/* Token Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">{token.name}</p>
                  <p className="text-2xl font-semibold">{token.symbol}</p>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium",
                    isPositive
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-rose-500/10 text-rose-500"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="size-4" />
                  ) : (
                    <TrendingDown className="size-4" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {token.priceChange}%
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold tracking-tight">
                  ${token.price.toLocaleString()}
                </p>
                {token.priceLabel && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {token.priceLabel}
                  </p>
                )}
              </div>

              {/* Stats Grid */}
              {token.stats && token.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {token.stats.map((stat, index) => (
                    <div key={index} className="rounded-lg bg-muted/50 p-4">
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-lg font-semibold mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* View More Link */}
              {token.explorerLink && (
                <Link
                  href={token.explorerLink.href}
                  className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {token.explorerLink.label}
                  <ArrowUpRight className="size-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
