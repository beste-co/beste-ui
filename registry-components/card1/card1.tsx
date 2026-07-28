"use client";

import { ArrowRight, type LucideIcon, Zap } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground";

interface Card1Props {
  /** Icon in the leading tile (defaults to Zap) */
  icon?: LucideIcon;
  /** Card title */
  title: string;
  /** Card body text */
  description: string;
  /** If set, the whole card links to this href and shows the link row */
  href?: string;
  /** Link row label (defaults to "Learn more") */
  linkLabel?: string;
  /** Icon and spotlight hue */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, { icon: string; spot: string }> = {
  primary: {
    icon: "text-primary",
    spot: "color-mix(in oklab, var(--primary) 12%, transparent)",
  },
  foreground: {
    icon: "text-foreground",
    spot: "color-mix(in oklab, var(--foreground) 8%, transparent)",
  },
};

export const card1Demo: Card1Props = {
  title: "Ship in minutes",
  description:
    "Copy a block, wire up your content, and deploy. No boilerplate, no configuration, no lock in.",
  href: "#",
};

/**
 * A feature card with a cursor tracking spotlight: a soft radial glow follows
 * the pointer across the surface while hovered. The whole card becomes a link
 * when href is set.
 */
export function Card1({
  icon: Icon = Zap,
  title,
  description,
  href,
  linkLabel = "Learn more",
  tone = "primary",
  className,
}: Card1Props) {
  const styles = toneStyles[tone];

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      onMouseMove={handleMove}
      className={cn(
        "group/card1 relative w-full max-w-sm overflow-hidden rounded-xl border bg-card p-6 transition-colors hover:border-foreground/20",
        className
      )}
    >
      {/* Cursor tracking spotlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card1:opacity-100"
        style={{
          background: `radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${styles.spot}, transparent 70%)`,
        }}
      />

      <span className="relative flex size-11 items-center justify-center rounded-lg bg-muted">
        <Icon aria-hidden="true" className={cn("size-5", styles.icon)} />
      </span>
      <h3 className="relative mt-4 text-lg font-semibold tracking-tight text-card-foreground">
        {href ? (
          <a
            href={href}
            className="rounded-sm before:absolute before:inset-0 before:z-10 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {title}
          </a>
        ) : (
          title
        )}
      </h3>
      <p className="relative mt-2 text-base text-muted-foreground">{description}</p>
      {href && (
        <span
          className={cn(
            "relative mt-4 inline-flex items-center gap-1.5 text-sm font-medium",
            styles.icon
          )}
        >
          {linkLabel}
          <ArrowRight className="size-3.5 transition-transform duration-300 ease-out motion-safe:group-hover/card1:translate-x-1" />
        </span>
      )}
    </div>
  );
}
