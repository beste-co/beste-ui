"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { AsciiRender, type AsciiRenderProps } from "@/components/beste/component/ascii-render";
import { Button23 } from "@/components/beste/component/button23";
import { FrostedGradient, type FrostedGradientProps } from "@/components/beste/component/frosted-gradient";
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

// The component's own palette behind frosted glass, on the page background so it follows the theme.
const FROSTED: Omit<FrostedGradientProps, "className" | "children"> = {
  colors: ["#ff6b4a", "#ffc75f", "#4d7cff", "#b28dff", "#1fc8a9", "#ff8fc7"],
  backgroundColor: "var(--background)",
  shapes: 6,
  size: 1,
  blur: 0.6,
  frost: 0.5,
  bevel: 0.5,
  flutes: 0,
  speed: 0.8,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  seed: 1,
  interactive: true,
};

// Paper is white (black in dark) and blended away, so only the lilac glyphs sit on the mesh.
const ASCII: Omit<AsciiRenderProps, "className" | "children"> = {
  inkColor: "var(--hero-ink)",
  paperColor: "var(--hero-paper)",
  accentColor: "var(--hero-accent)",
  glyphs: " .:-=+*#%@",
  cellSize: 14,
  scene: "asterisk",
  align: "center",
  size: 0.6,
  spin: 0.6,
  speed: 0.8,
  drift: 0,
  scanLine: false,
  contrast: 0.45,
  interactive: true,
  glow: 0.4,
  glowSize: 0.5,
};

// A CSS animation, so the copy starts rising at first paint instead of waiting for hydration.
const RISE = "animate-[hero-rise_1s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none";

/**
 * The site's one hero: a frosted gradient panel with an ASCII asterisk turning in its bottom-right
 * corner, and the release, the claim, the real inventory and the two ways in centered on it.
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
      <div className="relative isolate overflow-hidden rounded-3xl bg-background text-neutral-900 [--hero-accent:#e8a48c] [--hero-ink:#b9a9d4] [--hero-paper:#ffffff] dark:text-white dark:[--hero-accent:#d9967f] dark:[--hero-ink:#6a5f80] dark:[--hero-paper:#000000]">
        <FrostedGradient {...FROSTED} className="absolute inset-0" />
        <AsciiRender
          {...ASCII}
          className="pointer-events-none absolute -right-28 -bottom-36 size-[24rem] mix-blend-multiply [mask-image:radial-gradient(closest-side,black_75%,transparent)] md:-right-32 md:-bottom-44 md:size-[40rem] dark:mix-blend-screen"
        />
        <div className="relative flex min-h-[34rem] flex-col items-center justify-center px-6 py-20 text-center md:min-h-[38rem] md:px-10">
          {release && (
            <div className={cn("max-w-full", RISE)}>
              <Link
                href="/changelog"
                {...hostedLinkProps}
                className="inline-flex max-w-full items-center gap-2 rounded-full bg-neutral-900/5 py-1 pr-3.5 pl-1 text-sm backdrop-blur-sm transition-colors duration-500 hover:bg-neutral-900/10 dark:bg-white/10 dark:hover:bg-white/15"
              >
                <span className="rounded-full bg-neutral-900 px-2 py-0.5 font-medium text-white dark:bg-white dark:text-neutral-950">
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
              "mt-5 max-w-xl text-pretty text-base leading-relaxed text-neutral-600 md:text-lg dark:text-white/70",
              RISE,
            )}
          >
            <span className="font-medium text-neutral-900 dark:text-white">{blocks}</span> blocks,{" "}
            <span className="font-medium text-neutral-900 dark:text-white">{pieces}</span> pieces and{" "}
            <span className="font-medium text-neutral-900 dark:text-white">{components}</span> components for
            shadcn/ui and Tailwind. Install one with a command, or let your editor pull it in{" "}
            <Link
              href={DOCS_MCP_HREF}
              {...hostedLinkProps}
              className="font-medium text-neutral-900 underline underline-offset-4 transition-colors hover:text-neutral-600 dark:text-white dark:hover:text-white/70"
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
            />
            <Button23 size="sm" asChild label="See our plans" tone="outline">
              <Link href={PRICING_HREF} {...hostedLinkProps} />
            </Button23>
          </div>
        </div>
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={refreshSession} />
    </section>
  );
}
