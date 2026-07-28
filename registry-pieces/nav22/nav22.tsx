"use client";

import { cn } from "@/lib/utils";

interface AnchorLink {
  label: string;
  anchor: string;
  active?: boolean;
}

interface Nav22Props {
  title?: string;
  links?: AnchorLink[];
  className?: string;
}

export const nav22Demo: Nav22Props = {
  title: "On this page",
  links: [
    { label: "Overview", anchor: "#overview" },
    { label: "Installation", anchor: "#installation", active: true },
    { label: "Usage", anchor: "#usage" },
    { label: "API reference", anchor: "#api" },
    { label: "Troubleshooting", anchor: "#trouble" },
  ],
};

export function Nav22({
  title,
  links = [],
  className,
}: Nav22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-52 flex-col gap-1.5">
        {title && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
        )}
        <div className="flex flex-col gap-0.5">
          {links.map((link, idx) => (
            <button
              key={idx}
              type="button"
              className={cn(
                "flex items-center gap-2 border-l-2 px-3 py-1 text-left text-xs transition-colors",
                link.active
                  ? "border-primary font-semibold text-primary"
                  : "border-border text-muted-foreground hover:text-card-foreground"
              )}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
