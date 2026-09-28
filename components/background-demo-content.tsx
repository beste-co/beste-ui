"use client";

import { Button23 } from "@/components/beste/component/button23";
import { cn } from "@/lib/utils";

/**
 * Sample content laid over a background component on its stage, in hero196's
 * type, centered. It always sits above the surface with a solid title; `theme`
 * swaps the white copy for foreground text on a patch of paper, for surfaces
 * drawn on a light page, `soft` keeps that patch barely there, and `plain` uses the same text with nothing behind it.
 * The pointer passes through to the surface.
 */
export type DemoContentTone = "light" | "theme" | "soft" | "plain";

export function BackgroundDemoContent({ tone = "light", className }: { tone?: DemoContentTone; className?: string }) {
  const themed = tone !== "light";
  return (
    <div className={cn("pointer-events-none absolute inset-0 flex flex-col", themed ? "text-foreground" : "text-white", "z-10", className)}>
      {tone !== "plain" && (
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0",
            themed
              ? "bg-[radial-gradient(58%_52%_at_50%_52%,var(--background)_0%,var(--background)_42%,transparent_74%)]"
              : "bg-[radial-gradient(70%_60%_at_50%_55%,rgba(0,0,0,0.45),transparent_75%)]",
            tone === "soft" && "opacity-15",
          )}
        />
      )}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-16 text-center md:px-8">
        <div className="flex flex-col items-center">
          <p className="mb-4 text-base">Surface study no. 04</p>
          <h2 className={cn("max-w-3xl text-balance text-4xl font-black leading-[0.9] tracking-[-0.05em] md:text-6xl lg:text-7xl")}>
            Form that refuses to hold still.
          </h2>
          <div className={cn("mt-7 flex w-full max-w-xl flex-col items-center gap-6 border-t pt-6", themed ? "border-foreground/15" : "border-white/15")}>
            <p className="max-w-md text-base leading-relaxed md:text-lg">
              A studio for identities that move. We cast brands in liquid metal, then let them settle into something you can hold.
            </p>
            <div className="pointer-events-auto flex flex-wrap justify-center gap-3">
              <Button23 label="Enter the studio" tone={themed ? "dark" : "light"} />
              <Button23 label="Watch the reel" tone="outline" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
