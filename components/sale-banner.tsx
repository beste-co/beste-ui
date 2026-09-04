"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isSaleActive, salePercent } from "@/lib/pricing";
import { PRICING_HREF, hostedLinkProps } from "@/lib/site-links";

/**
 * A thin ink band above the header on the home page while a sale
 * runs. The whole band is the link. Decided after mount so the server, which
 * has no idea what the reader's clock says, never renders a band the client
 * then takes down.
 */
export function SaleBanner() {
  const pathname = usePathname();
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isSaleActive());
  }, []);

  if (pathname !== "/" || !active) return null;

  return (
    <Link
      href={PRICING_HREF}
      {...hostedLinkProps}
      className="block cursor-pointer bg-foreground text-background transition-colors duration-300 hover:bg-foreground/90"
    >
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 px-4 py-2.5 text-center text-sm md:px-6"
      >
        <span aria-hidden="true">🎉</span>
        <span>
          <span className="font-medium">Special pricing for September:</span> {salePercent("lifetime")}% off lifetime plans
        </span>
      </motion.p>
    </Link>
  );
}
