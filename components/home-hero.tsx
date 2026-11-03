"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button23 } from "@/components/beste/component/button23";
import { MeshGradient } from "@/components/beste/component/mesh-gradient";
import { ComponentDemo } from "@/components/component-demo";
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

// A CSS animation, so the copy starts rising at first paint instead of waiting for hydration.
const RISE = "animate-[hero-rise_1s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none";

// The builder login's night sky (apps/builder/components/login-art.tsx), color for color:
// parliament blues and violet with one orange glow
const MESH_COLORS = ["#070b1f", "#1a2458", "#34307a", "#ff9b52", "#0f1638", "#5a3d8c"];

/* How long a piece stays before the next one takes its slot, and the crossfade between them. */
const HOLD_MS = 14000;
const FADE_MS = 900;

/*
 * Four slots of different shapes layered like cards on a desk, each cycling through
 * four pieces of its own kind: sixteen in all. Offsets spread the changes so only
 * one slot turns over at a time, about every three and a half seconds.
 */
const SLOTS = [
  {
    // Wide panel at the back: dashboards and full views
    names: ["dashboard36", "browser40", "location10", "dashboard37"],
    className: "-right-[30%] top-0 h-[52%] w-[120%] lg:-right-[10%] lg:h-[54%] lg:w-[92%]",
    offset: 0,
  },
  {
    // Small card in the top-left corner
    names: ["media28", "stats21", "health32", "calendar38"],
    className: "-left-[12%] top-[4%] z-10 h-[34%] w-[72%] lg:-left-[4%] lg:top-[2%] lg:h-[32%] lg:w-[56%]",
    offset: HOLD_MS / 4,
  },
  {
    // Middle card: money, travel, code and commerce moments
    names: ["money30", "travel32", "code20", "commerce36"],
    className: "-left-[10%] top-[34%] z-20 h-[46%] w-[108%] lg:-left-[4%] lg:top-[34%] lg:h-[48%] lg:w-[84%]",
    offset: HOLD_MS / 2,
  },
  {
    // Front toast: notifications, replies and reviews
    names: ["notification27", "socialproof34", "chat41", "progress21"],
    className: "-bottom-[6%] -right-[16%] z-30 h-[36%] w-[92%] lg:-bottom-[4%] lg:-right-[6%] lg:h-[36%] lg:w-[70%]",
    offset: (HOLD_MS * 3) / 4,
  },
];

/** One slot: a piece plays, blurs away, and the next one rises in its place. Slots are staggered so only one changes at a time. */
function RotatingSlot({ names, offset, className }: { names: string[]; offset: number; className: string }) {
  const [index, setIndex] = React.useState(0);
  const [shown, setShown] = React.useState(true);

  React.useEffect(() => {
    if (names.length < 2) return;
    let timer = 0;
    const leave = () => {
      setShown(false);
      timer = window.setTimeout(() => {
        setIndex((current) => (current + 1) % names.length);
        setShown(true);
        timer = window.setTimeout(leave, HOLD_MS);
      }, FADE_MS);
    };
    timer = window.setTimeout(leave, HOLD_MS + offset);
    return () => window.clearTimeout(timer);
  }, [names.length, offset]);

  const name = names[index] ?? names[0];
  if (!name) return null;

  return (
    <div className={cn("absolute", className)}>
      <div
        className="flex size-full transition-[opacity,filter,translate] ease-out motion-reduce:transition-none"
        style={{
          transitionDuration: `${FADE_MS}ms`,
          opacity: shown ? 1 : 0,
          filter: shown ? "blur(0px)" : "blur(8px)",
          translate: shown ? "0 0" : "0 0.5rem",
        }}
      >
        {/* Keyed by name so each piece mounts fresh and plays its own entrance */}
        <ComponentDemo key={name} name={name} />
      </div>
    </div>
  );
}

/**
 * The site's one hero: copy on the left and a rotating stack of real pieces on the
 * right, on the builder login's night mesh, which looks the same in either theme.
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
      <div className="relative isolate overflow-hidden rounded-3xl bg-[#070b1f] text-white">
        <MeshGradient
          colors={MESH_COLORS}
          speed={0.6}
          scale={1.1}
          distortion={0.6}
          swirl={0.3}
          softness={0.6}
          grain={0.2}
          grainMotion
          transition={1.8}
          seed={5}
          interactive={false}
          className="absolute! inset-0 h-full min-h-0"
        />

        <div className="relative grid gap-12 px-6 pt-14 pb-0 md:px-12 md:pt-20 lg:min-h-[40rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-8 lg:py-16">
          <div className="flex flex-col items-start">
            {release && (
              <div className={cn("max-w-full", RISE)}>
                <Link
                  href="/changelog"
                  {...hostedLinkProps}
                  className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 py-1 pr-3.5 pl-1 text-sm backdrop-blur-md transition-colors duration-500 hover:bg-white/15"
                >
                  <span className="rounded-full bg-white px-2 py-0.5 font-medium text-neutral-950">New</span>
                  <span className="truncate font-medium">{release.title}</span>
                </Link>
              </div>
            )}

            <h1
              className={cn(
                "mt-7 max-w-xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.045em] md:text-7xl",
                RISE,
              )}
            >
              Interfaces worth shipping.
            </h1>

            <p className={cn("mt-6 max-w-md text-pretty text-base leading-relaxed text-white/65 md:text-lg", RISE)}>
              <span className="font-medium text-white">{blocks}</span> blocks,{" "}
              <span className="font-medium text-white">{pieces}</span> pieces and{" "}
              <span className="font-medium text-white">{components}</span> components for shadcn/ui and Tailwind.
              Install one with a command, or let your agent pull it in{" "}
              <Link
                href={DOCS_MCP_HREF}
                {...hostedLinkProps}
                className="font-medium text-white underline underline-offset-4 transition-colors hover:text-white/70"
              >
                over MCP
              </Link>
              .
            </p>

            <div className={cn("mt-9 flex flex-wrap items-center gap-3", RISE)}>
              <Button23 size="sm" label="Get started" tone="light" direction="right" onClick={start} />
              <Button23 size="sm" asChild label="See our plans" tone="outline">
                <Link href={PRICING_HREF} {...hostedLinkProps} />
              </Button23>
            </div>
          </div>

          {/* A picture of the library, not a control: inert keeps the live demos out of the tab order */}
          {/* The slots run past the stack's edges on purpose; the hero's rounded frame crops them, so the pieces fill the space at full size */}
          <div inert className={cn("relative h-[30rem] select-none sm:h-[32rem] lg:h-[34rem]", RISE)}>
            {SLOTS.map((slot) => (
              <RotatingSlot key={slot.names[0]} names={slot.names} offset={slot.offset} className={slot.className} />
            ))}
          </div>
        </div>
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={refreshSession} />
    </section>
  );
}
