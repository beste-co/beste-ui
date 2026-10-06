"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button23 } from "@/components/beste/component/button23";
import { MeshGradient, type MeshGradientProps } from "@/components/beste/component/mesh-gradient";
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

// The builder's afternoon palette with one orange field, fixed and light, so the dark copy holds in every theme.
const MESH: Omit<MeshGradientProps, "className" | "children"> = {
  colors: ["#eef6ff", "#bfe0ff", "#ffc79c", "#fff1d6", "#d9f0ff", "#ffffff"],
  speed: 0.6,
  scale: 1.1,
  distortion: 0.6,
  swirl: 0.3,
  softness: 0.6,
  saturation: 1,
  grain: 0.2,
  grainSize: 1,
  grainMotion: true,
  seed: 4,
  interactive: true,
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * The site's one hero: a mesh gradient panel in the page column, with the release, the claim,
 * the real inventory and the two ways in centered on it. Search lives in the bar.
 */
export function HomeHero({ blocks, pieces, components, release, className }: HomeHeroProps) {
  const router = useRouter();
  const { session, refreshSession } = useAuth();
  const [loginOpen, setLoginOpen] = React.useState(false);
  const reduce = useReducedMotion() ?? false;

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, ease, delay },
        };

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
      <MeshGradient {...MESH} className="rounded-3xl text-neutral-950">
        <div className="flex min-h-[34rem] flex-col items-center justify-center px-6 py-20 text-center md:min-h-[38rem] md:px-10">
          {release && (
            <motion.div {...rise(0.1)} className="max-w-full">
              <Link
                href="/changelog"
                {...hostedLinkProps}
                className="inline-flex max-w-full items-center gap-2 rounded-full bg-neutral-950/5 py-1 pr-3.5 pl-1 text-sm backdrop-blur-sm transition-colors duration-500 hover:bg-neutral-950/10"
              >
                <span className="rounded-full bg-neutral-950 px-2 py-0.5 font-medium text-white">
                  New
                </span>
                <span className="truncate font-medium">{release.title}</span>
              </Link>
            </motion.div>
          )}

          <motion.h1
            {...rise(0.2)}
            className="mt-6 max-w-3xl text-balance text-4xl font-medium leading-[1.02] tracking-[-0.04em] md:text-6xl"
          >
            Your agent&rsquo;s favorite component library.
          </motion.h1>

          <motion.p
            {...rise(0.3)}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-neutral-950/70 md:text-lg"
          >
            <span className="font-medium text-neutral-950">{blocks}</span> blocks,{" "}
            <span className="font-medium text-neutral-950">{pieces}</span> pieces and{" "}
            <span className="font-medium text-neutral-950">{components}</span> components for
            shadcn/ui and Tailwind. Install one with a command, or let your editor pull it in{" "}
            <Link
              href={DOCS_MCP_HREF}
              {...hostedLinkProps}
              className="font-medium text-neutral-950 underline underline-offset-4 transition-colors hover:text-neutral-950/70"
            >
              over MCP
            </Link>
            .
          </motion.p>

          <motion.div
            {...rise(0.4)}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button23
              size="sm"
              label="Get started"
              tone="dark"
              direction="right"
              onClick={start}
              className="bg-neutral-950 text-white hover:bg-neutral-950/85"
            />
            <Button23 size="sm" asChild label="See our plans" tone="outline">
              <Link href={PRICING_HREF} {...hostedLinkProps} />
            </Button23>
          </motion.div>
        </div>
      </MeshGradient>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={refreshSession} />
    </section>
  );
}
