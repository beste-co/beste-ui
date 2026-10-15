"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button23 } from "@/components/beste/component/button23";
import { WaveGradient, type WaveGradientProps } from "@/components/beste/component/wave-gradient";
import { LoginModal } from "@/components/login-modal";
import { useAuth } from "@/lib/auth-context";
import { DOCS_MCP_HREF, hostedLinkProps, PRICING_HREF } from "@/lib/site-links";
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

// Layered waves, warm at the bottom and deep navy above, so the light copy sits on the dark bands.
const WAVES: Omit<WaveGradientProps, "className" | "children"> = {
  colors: ["#ff7a45", "#ff3d7f", "#6b3df5", "#1c1a66", "#0a0920"],
  angle: -8,
  bands: 5,
  amplitude: 0.5,
  frequency: 0.4,
  speed: 0.8,
  softness: 0.45,
  glow: 0.4,
  depth: 0.45,
  saturation: 1.05,
  grain: 0.18,
  grainSize: 1,
  grainMotion: true,
  seed: 2,
  interactive: true,
};

// A CSS animation, so the copy starts rising at first paint instead of waiting for hydration.
const RISE = "animate-[hero-rise_1s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none";

/**
 * The site's one hero: a wave gradient panel in the page column, with the release, the claim,
 * the real inventory and the two ways in centered on it. Search lives in the bar.
 */
export function HomeHero({ blocks, pieces, components, release, className }: HomeHeroProps) {
  const router = useRouter();
  const { session, refreshSession } = useAuth();
  const [loginOpen, setLoginOpen] = React.useState(false);

  // The session is only known on the client, so the label stays the same and the click decides.
  const start = () => {
    if (session?.user) {
      router.push("/blocks");
      return;
    }
    setLoginOpen(true);
  };

  return (
    <section className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", className)}>
      <WaveGradient {...WAVES} className="rounded-3xl text-white">
        <div className="flex min-h-[34rem] flex-col items-center justify-center px-6 py-20 text-center md:min-h-[38rem] md:px-10">
          {release && (
            <div className={cn("max-w-full", RISE)}>
              <Link
                href="/changelog"
                {...hostedLinkProps}
                className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 py-1 pr-3.5 pl-1 text-sm backdrop-blur-sm transition-colors duration-500 hover:bg-white/15"
              >
                <span className="rounded-full bg-white px-2 py-0.5 font-medium text-neutral-950">
                  New
                </span>
                <span className="truncate font-medium">{release.title}</span>
              </Link>
            </div>
          )}

          <h1
            className={cn(
              "mt-6 max-w-3xl text-balance text-4xl font-medium leading-[1.02] tracking-[-0.04em] md:text-6xl",
              RISE,
            )}
          >
            Your agent&rsquo;s favorite component library.
          </h1>

          <p
            className={cn(
              "mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/70 md:text-lg",
              RISE,
            )}
          >
            <span className="font-medium text-white">{blocks}</span> blocks,{" "}
            <span className="font-medium text-white">{pieces}</span> pieces and{" "}
            <span className="font-medium text-white">{components}</span> components for
            shadcn/ui and Tailwind. Install one with a command, or let your editor pull it in{" "}
            <Link
              href={DOCS_MCP_HREF}
              {...hostedLinkProps}
              className="font-medium text-white underline underline-offset-4 transition-colors hover:text-white/70"
            >
              over MCP
            </Link>
            .
          </p>

          <div className={cn("mt-8 flex flex-wrap items-center justify-center gap-3", RISE)}>
            <Button23
              size="sm"
              label="Get started"
              tone="dark"
              direction="right"
              onClick={start}
              className="bg-white text-neutral-950 hover:bg-white/85"
            />
            <Button23 size="sm" asChild label="See our plans" tone="outline">
              <Link href={PRICING_HREF} {...hostedLinkProps} />
            </Button23>
          </div>
        </div>
      </WaveGradient>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={refreshSession} />
    </section>
  );
}
