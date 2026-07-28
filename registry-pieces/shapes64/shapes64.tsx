"use client";

import { Github, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes64Props {
  className?: string;
}

export const shapes64Demo: Shapes64Props = {};

const ICONS = [Twitter, Github, Linkedin, Youtube, Instagram];

export function Shapes64({ className }: Shapes64Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        {ICONS.map((Icon, i) => (
          <span
            key={i}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-card"
          >
            <Icon className="size-3.5 text-foreground/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
