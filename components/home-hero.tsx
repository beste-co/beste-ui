"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button12 } from "@/components/beste/component/button12";
import { LoginModal } from "@/components/login-modal";
import { useAuth } from "@/lib/auth-context";
import { DOCS_MCP_HREF, PRICING_HREF, hostedLinkProps } from "@/lib/site-links";

interface HomeHeroProps {
  /** How many blocks, pieces and components the library holds right now. */
  blocks: number;
  pieces: number;
  components: number;
}

/**
 * The first thing on the site.
 *
 * The counts are passed in rather than read here so the sentence under the title is
 * the real inventory at build time, not a number someone has to remember to update:
 * a landing page that overstates what is behind it is found out on the next click.
 */
export function HomeHero({ blocks, pieces, components }: HomeHeroProps) {
  const router = useRouter();
  const { session, refreshSession } = useAuth();
  const [loginOpen, setLoginOpen] = React.useState(false);

  /*
   * One label, two behaviours. The session is only known on the client, so a label
   * that depends on it starts wrong and corrects itself a moment later — the reader
   * sees "Join for free" turn into something else while they are reading it. A verb
   * that is true either way says the same thing on the first paint and on the second,
   * and the click does the deciding, by which time the answer has arrived.
   */
  const start = () => {
    if (session?.user) {
      router.push("/blocks");
      return;
    }
    setLoginOpen(true);
  };

  return (
    <header className="mb-20 flex flex-col items-center pt-16 pb-4 text-center md:mb-24 md:pt-24 md:pb-8">
      {/*
        Each part arrives a beat after the one above it. It is one gesture, not an
        animation: the page settles rather than performs, and `motion-reduce` turns
        the whole thing off for anyone who asked for that.

        An h2, not an h1: the block above this one on the page carries the title now,
        and two first-level headings would leave a reader skimming by heading unable
        to tell which one the page is actually about.
      */}
      <h2 className="animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-both max-w-3xl text-balance text-4xl font-semibold tracking-tight duration-700 md:text-6xl motion-reduce:animate-none">
        Your agent&rsquo;s favorite component library.
      </h2>

      {/*
        The sentence under it earns that claim rather than repeating it: the
        inventory first, because the number is the reason an agent finds anything
        here, then the two ways in. `/docs/mcp` is a real page, so the claim has
        somewhere to land for a reader who wants to check it.
      */}
      <p className="animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-both mt-5 max-w-xl text-balance text-lg text-muted-foreground delay-100 duration-700 md:text-xl motion-reduce:animate-none">
        <span className="font-medium text-foreground">{blocks}</span> blocks,{" "}
        <span className="font-medium text-foreground">{pieces}</span> pieces and{" "}
        <span className="font-medium text-foreground">{components}</span> components for
        shadcn/ui and Tailwind. Install one with a command, or let your editor pull it in{" "}
        <Link
          href={DOCS_MCP_HREF}
          {...hostedLinkProps}
          className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/70"
        >
          over MCP
        </Link>
        . Either way the code is yours.
      </p>

      <div className="animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-both mt-9 flex flex-wrap items-center justify-center gap-3 delay-200 duration-700 motion-reduce:animate-none">
        {/*
          The library's own seal button, and the same one the closing block on this
          page uses — the two ends of the page then agree about what a button is here.
          Signing up happens in a modal everywhere else on the site, so it does here.
        */}
        <Button12 label="Get started" onClick={start} />

        {/*
          The same button in its outline tone: a pair rather than a CTA with a
          smaller thing beside it, and the tone is what says which of the two the
          page would rather you press.
        */}
        <Button12 asChild label="See our plans" tone="outline">
          <Link href={PRICING_HREF} {...hostedLinkProps} />
        </Button12>
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onLoginSuccess={refreshSession} />
    </header>
  );
}
