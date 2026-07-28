"use client";

import { Badge7 } from "@/components/beste/component/badge7";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "@/lib/command-palette-store";

interface HomeHeroSearchProps {
  badge?: { label: string };
  heading?: string;
  subheading?: string;
  backgroundImage?: { src: string; alt: string };
  className?: string;
}

/**
 * The home page's hero, in hero130's shape with its announcement ticker replaced
 * by the search.
 *
 * A copy rather than a prop: hero130 is a catalogue asset, and a search field is
 * not something a studio hero should grow because this site wanted one. The
 * block stays exactly as it ships; this file is the site's own version of it and
 * is free to diverge.
 *
 * The bar drops its own search on this route rather than watching for this one:
 * the header does not stick, so scrolling past the hero takes it away anyway.
 */
export function HomeHeroSearch({
  badge,
  heading,
  subheading,
  backgroundImage,
  className,
}: HomeHeroSearchProps) {
  const { setOpen } = useCommandPalette();
  return (
    <section
      className={cn(
        "group/hero relative isolate flex min-h-[600px] w-full flex-col overflow-hidden md:min-h-[760px]",
        className
      )}
    >
      {backgroundImage && (
        // Not next/image: the block this is modelled on ships a plain img, and
        // the hero is one photograph rather than a gallery to optimise.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="absolute inset-0 -z-10 size-full object-cover"
          src={backgroundImage.src}
          alt={backgroundImage.alt}
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-foreground/70 via-foreground/20 to-foreground/40" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-col gap-6">
          {badge && <Badge7 label={badge.label} className="text-background" />}
          {heading && (
            <h1 className="text-balance text-6xl font-bold leading-[0.95] tracking-tight text-background sm:text-7xl md:text-8xl lg:text-9xl">
              {heading}
            </h1>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-8">
          {subheading && (
            <h2 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-background md:text-5xl">
              {subheading}
            </h2>
          )}

          {/*
            A button wearing a field, like the one in the bar: the real search is
            the ⌘K palette, and a second input that has to hand its text over
            would only be a slower way in.
          */}
          <div className="w-full max-w-xl">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-16 w-full cursor-pointer items-center gap-4 rounded-full bg-background px-6 text-left transition-colors hover:bg-background/90"
            >
              <HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={2} className="shrink-0 text-foreground/50" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-lg text-foreground/50">
                Search blocks, pieces and components…
              </span>
              {/*
                One chip per key rather than one tray behind both: the fill then
                traces the letters instead of leaving a grey block in the corner
                of a white field, and no outline is needed to say where a key
                starts.
              */}
              <span className="hidden shrink-0 items-center gap-1 sm:flex">
                {["⌘", "K"].map((key) => (
                  <span
                    key={key}
                    aria-hidden="true"
                    className="flex size-7 items-center justify-center rounded-md bg-foreground/5 text-sm font-medium text-foreground/50"
                  >
                    {key}
                  </span>
                ))}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
