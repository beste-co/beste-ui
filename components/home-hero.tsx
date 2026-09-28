"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button23 } from "@/components/beste/component/button23";
import { AsciiRender, type AsciiRenderProps } from "@/components/beste/component/ascii-render";
import { LoginModal } from "@/components/login-modal";
import { useAuth } from "@/lib/auth-context";
import { DOCS_MCP_HREF, PRICING_HREF, hostedLinkProps } from "@/lib/site-links";
import { cn } from "@/lib/utils";

interface HomeHeroRelease {
  /** Title of the newest changelog entry. */
  title: string;
}

interface HomeHeroProps {
  /** How many blocks, pieces and components the library holds right now. */
  blocks: number;
  pieces: number;
  components: number;
  /** The newest release, shown as a pill above the title. */
  release?: HomeHeroRelease;
  className?: string;
}

// Theme tokens: black on white in light, inverted in dark; the accent matches the ink so it reads as one-colour print.
const ASCII: Omit<AsciiRenderProps, "className" | "children"> = {
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  accentColor: "var(--foreground)",
  glyphs: " .:-=+*#%@",
  cellSize: 14,
  scene: "asterisk",
  align: "right",
  size: 0.55,
  spin: 0.8,
  speed: 1,
  drift: 0.35,
  scanLine: true,
  contrast: 0.6,
  interactive: true,
  glow: 0.5,
  glowSize: 0.5,
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * The site's one hero: an ASCII form drawn in the page's ink on its paper, with the release, the
 * claim, the real inventory and the two ways in on top of it. Search lives in the bar.
 */
export function HomeHero({ blocks, pieces, components, release, className }: HomeHeroProps) {
  const router = useRouter();
  const { session, refreshSession } = useAuth();
  const [loginOpen, setLoginOpen] = React.useState(false);
  const reduce = useReducedMotion() ?? false;

  const rise = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, ease, delay } };

  // The session is only known on the client, so the label stays the same and the click decides.
  const start = () => {
    if (session?.user) {
      router.push("/blocks");
      return;
    }
    setLoginOpen(true);
  };

  return (
    <section
      className={cn(
        "relative isolate flex min-h-[34rem] flex-col overflow-hidden bg-background text-foreground md:min-h-[38rem]",
        className
      )}
    >
      {/* The form is placed right by the component; the wash keeps the drifting glyphs off the copy. */}
      <AsciiRender {...ASCII} className="absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent md:bg-gradient-to-r md:from-background md:via-background/70 md:via-40% md:to-transparent md:to-60%"
      />

      <div className="relative mx-auto mt-auto w-full max-w-6xl px-4 pt-28 pb-12 md:px-6 md:pb-16">
        <div className="max-w-2xl">
          {release && (
            <motion.div {...rise(0.1)}>
              <Link
                href="/changelog"
                {...hostedLinkProps}
                className="inline-flex max-w-full items-center gap-2 rounded-full bg-foreground/5 py-1 pr-3.5 pl-1 text-sm backdrop-blur-sm transition-colors duration-500 hover:bg-foreground/10"
              >
                <span className="rounded-full bg-foreground px-2 py-0.5 font-medium text-background">New</span>
                <span className="truncate font-medium">{release.title}</span>
              </Link>
            </motion.div>
          )}

          <motion.h1
            {...rise(0.2)}
            className="mt-6 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.04em] md:text-6xl"
          >
            Your agent&rsquo;s favorite component library.
          </motion.h1>

          <motion.p {...rise(0.3)} className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            <span className="font-medium text-foreground">{blocks}</span> blocks,{" "}
            <span className="font-medium text-foreground">{pieces}</span> pieces and{" "}
            <span className="font-medium text-foreground">{components}</span> components for shadcn/ui and Tailwind.
            Install one with a command, or let your editor pull it in{" "}
            <Link
              href={DOCS_MCP_HREF}
              {...hostedLinkProps}
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/70"
            >
              over MCP
            </Link>
            .
          </motion.p>

          <motion.div {...rise(0.4)} className="mt-8 flex flex-wrap items-center gap-3">
            <Button23 size="sm" label="Get started" tone="dark" direction="right" onClick={start} />
            <Button23 size="sm" asChild label="See our plans" tone="outline">
              <Link href={PRICING_HREF} {...hostedLinkProps} />
            </Button23>
          </motion.div>
        </div>
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={refreshSession} />
    </section>
  );
}
