"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground";

interface Card7Props {
  /** Image shown at the top of the card */
  src: string;
  /** Monospace eyebrow above the title */
  eyebrow?: string;
  /** Card title */
  title: string;
  /** Card body text */
  description?: string;
  /** If set, the whole card links to this href */
  href?: string;
  /** Maximum tilt in degrees (defaults to 10) */
  maxTilt?: number;
  /** Eyebrow color */
  tone?: Tone;
  /** Additional classes merged onto the root */
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-muted-foreground",
};

export const card7Demo: Card7Props = {
  src: "https://images.unsplash.com/photo-1782252152135-f4fa52702e5f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  eyebrow: "Hardware",
  title: "Meet the Atlas Deck",
  description: "A modular controller for creative tools, machined from a single block of aluminum.",
};

/**
 * A 3D tilt card: the surface rotates in perspective toward the cursor while
 * a soft glare follows the pointer. Pointer only by nature and skipped
 * entirely under prefers-reduced-motion.
 */
export function Card7({
  src,
  eyebrow,
  title,
  description,
  href,
  maxTilt = 10,
  tone = "primary",
  className,
}: Card7Props) {
  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 2 * maxTilt;
    const rx = -(py - 0.5) * 2 * maxTilt;
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.02)`;
    el.style.setProperty("--glare-x", `${px * 100}%`);
    el.style.setProperty("--glare-y", `${py * 100}%`);
  };

  const handleLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.transform = "";
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "group/card7 relative w-full max-w-sm overflow-hidden rounded-xl border bg-card transition-transform duration-200 ease-out will-change-transform",
        className
      )}
    >
      {/* Pointer tracking glare */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/card7:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--glare-x, 50%) var(--glare-y, 50%), rgb(255 255 255 / 0.14), transparent 60%)",
        }}
      />

      <div className="relative h-44 overflow-hidden bg-muted">
        <img src={src} alt={title} className="absolute inset-0 size-full object-cover" />
      </div>
      <div className="flex flex-col gap-1.5 p-5">
        {eyebrow && (
          <span className={cn("font-mono text-sm uppercase tracking-[0.2em]", toneStyles[tone])}>
            {eyebrow}
          </span>
        )}
        <h3 className="text-lg font-semibold tracking-tight text-card-foreground">
          {href ? (
            <a
              href={href}
              className="rounded-sm before:absolute before:inset-0 before:z-20 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {description && <p className="text-base text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
