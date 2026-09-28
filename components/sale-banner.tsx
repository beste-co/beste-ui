"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AsciiRender, type AsciiRenderProps } from "@/components/beste/component/ascii-render";
import { CountdownDigits, useCountdown } from "@/components/sale-countdown";
import { useLicense } from "@/lib/license-context";
import { SALE_LABEL, isSaleActive } from "@/lib/pricing";
import { PRICING_HREF, hostedLinkProps } from "@/lib/site-links";

// The home hero's field at band scale: finer glyphs, a small lattice off to the right.
const FIELD: Omit<AsciiRenderProps, "className" | "children"> = {
  inkColor: "var(--foreground)",
  paperColor: "var(--background)",
  accentColor: "var(--foreground)",
  cellSize: 10,
  scene: "lattice",
  align: "right",
  size: 0.3,
  spin: 0.8,
  drift: 0.5,
  scanLine: true,
  contrast: 0.45,
  interactive: true,
  glow: 0.4,
  glowSize: 0.3,
};

/**
 * A countdown band above the header on the home page while a sale runs, for
 * readers who have not bought yet. The whole band is the link. Client-only, and
 * on the same ticker as the pricing page's countdown.
 */
export function SaleBanner() {
  const pathname = usePathname();
  const { hasPro, ready } = useLicense();
  const reduce = useReducedMotion() ?? false;
  const countdown = useCountdown();

  // Nothing until the licence answer is final: a Pro reader must never see
  // the band appear and then go away.
  if (pathname !== "/" || !countdown || !isSaleActive(countdown.now) || !ready || hasPro) return null;

  return (
    <Link
      href={PRICING_HREF}
      {...hostedLinkProps}
      aria-label={`${SALE_LABEL}. See pricing.`}
      className="group relative isolate block cursor-pointer overflow-hidden border-b bg-background text-foreground"
    >
      <AsciiRender {...FIELD} className="absolute inset-0 -z-20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background/60" />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-3 text-sm md:px-6"
      >
        <span className="flex items-center gap-2">
          <span className="font-medium">{SALE_LABEL} ends in</span>
          <CountdownDigits parts={countdown.parts} />
        </span>

        <span className="flex items-center gap-1.5 font-medium">
          See pricing
          <ArrowRight
            className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </motion.div>
    </Link>
  );
}
