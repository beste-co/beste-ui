"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AsciiRender, type AsciiRenderProps } from "@/components/beste/component/ascii-render";
import { useCountdown } from "@/components/sale-countdown";
import { SaleGradientText } from "@/components/sale-gradient-text";
import { useLicense } from "@/lib/license-context";
import { SALE_LABEL, isSaleActive, maxSalePercent } from "@/lib/pricing";
import { PRICING_HREF, hostedLinkProps } from "@/lib/site-links";

// The home hero's field at band scale: finer glyphs, a small lattice off to the right.
const FIELD: Omit<AsciiRenderProps, "className" | "children"> = {
  inkColor: "var(--background)",
  paperColor: "var(--foreground)",
  accentColor: "var(--background)",
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
 * An inverted sale band above the header on the home page while a sale runs, for
 * readers who have not bought yet. The whole band is the link.
 */
export function SaleBanner() {
  const pathname = usePathname();
  const { hasPro, ready } = useLicense();
  const countdown = useCountdown();

  // Rendered on the server so it is there from the first paint; only a confirmed Pro licence removes it.
  if (pathname !== "/" || !isSaleActive(countdown?.now) || (ready && hasPro)) return null;

  return (
    <Link
      href={PRICING_HREF}
      {...hostedLinkProps}
      aria-label={`${SALE_LABEL}: up to ${maxSalePercent()}% off every Pro plan. See pricing.`}
      className="relative isolate block cursor-pointer overflow-hidden bg-foreground text-background"
    >
      <AsciiRender {...FIELD} className="absolute inset-0 -z-20" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-foreground/60" />

      <div
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-3 text-sm md:px-6"
      >
        <span>
          <SaleGradientText className="font-semibold [--sale-l:0.84] dark:[--sale-l:0.58]">{SALE_LABEL}:</SaleGradientText>{" "}
          <span>up to {maxSalePercent()}% off every Pro plan</span>
        </span>
      </div>
    </Link>
  );
}
