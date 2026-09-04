"use client";

import { Text1 } from "@/components/beste/component/text1";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "@/lib/command-palette-store";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

interface HomeHeroAltairProps {
  heading: string;
  description?: string;
  image: { src: string; alt: string };
  className?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * The home page's hero: hero187's shape and motion, kept as the site's own copy
 * so it can set its type a step smaller and heavier than the catalogue block,
 * and hand the search field to the ⌘K palette. Not a registry asset.
 */
export function HomeHeroAltair({ heading, description, image, className }: HomeHeroAltairProps) {
  const { setOpen } = useCommandPalette();
  const reduce = useReducedMotion() ?? false;
  const grainId = useId();
  const ref = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "26%"]);

  useEffect(() => {
    if (photoRef.current?.complete) setLoaded(true);
  }, []);

  const hidden = reduce ? {} : { opacity: 0, y: 14, filter: "blur(10px)" };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };
  const afterHeading = 0.4 + heading.split(" ").length * 0.07;

  return (
    <section
      ref={ref}
      className={cn(
        "relative isolate flex min-h-[40rem] flex-col items-center justify-center overflow-hidden bg-foreground py-24 text-background md:min-h-[46rem] md:py-32",
        className
      )}
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0 -z-30 will-change-transform">
        {/* Not next/image: one photograph, and the block this copies ships a plain img. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          ref={photoRef}
          src={image.src}
          alt={image.alt}
          onLoad={() => setLoaded(true)}
          initial={reduce ? false : { scale: 1.12, opacity: 0, filter: "blur(24px)" }}
          animate={loaded || reduce ? { scale: 1, opacity: 1, filter: "blur(0px)" } : { scale: 1.12, opacity: 0, filter: "blur(24px)" }}
          transition={{ duration: 2.4, ease }}
          className="size-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 -z-20 bg-foreground/55" />
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 size-full opacity-[0.08] mix-blend-soft-light">
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center md:px-6">
        {/* A step smaller and heavier than hero187: this is a site title, not a poster. */}
        <Text1
          as="h1"
          text={heading}
          trigger="mount"
          delay={0.35}
          stagger={0.07}
          className="font-serif text-5xl font-semibold leading-[0.95] tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-8xl"
        />
        {description && (
          <motion.p
            initial={hidden}
            animate={shown}
            transition={{ duration: 1.1, ease, delay: afterHeading }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-background/80 md:text-xl"
          >
            {description}
          </motion.p>
        )}

        {/*
          A button wearing a field, like the one in the bar: the real search is
          the ⌘K palette, and a second input that has to hand its text over
          would only be a slower way in.
        */}
        <motion.div initial={hidden} animate={shown} transition={{ duration: 1.1, ease, delay: afterHeading + 0.15 }} className="mt-10 w-full max-w-xl">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Search"
            className="flex h-16 w-full cursor-pointer items-center gap-4 rounded-full bg-background px-6 text-foreground transition-colors duration-300 hover:bg-background/90"
          >
            <Search className="size-5 shrink-0 text-foreground/50" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-left text-lg text-foreground/50">Search blocks, pieces and components…</span>
            <span className="hidden shrink-0 items-center gap-1 sm:flex" aria-hidden="true">
              {["⌘", "K"].map((key) => (
                <span key={key} className="flex size-7 items-center justify-center rounded-md bg-foreground/5 text-sm font-medium text-foreground/50">
                  {key}
                </span>
              ))}
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
