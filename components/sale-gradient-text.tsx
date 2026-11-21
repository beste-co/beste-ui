"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Warm to cool and back to the first stop, so the sweep loops without a seam.
// `--sale-l` sets the lightness, so a dark surface can ask for brighter stops.
const SALE_GRADIENT =
  "linear-gradient(90deg, oklch(var(--sale-l, 0.66) 0.2 35), oklch(var(--sale-l, 0.66) 0.21 350), oklch(var(--sale-l, 0.66) 0.21 295), oklch(var(--sale-l, 0.66) 0.16 240), oklch(var(--sale-l, 0.66) 0.2 35))";

/** Text filled with the sale rainbow, sweeping slowly unless motion is reduced. */
export function SaleGradientText({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.span
      className={cn("bg-clip-text text-transparent", className)}
      style={{ backgroundImage: SALE_GRADIENT, backgroundSize: "200% 100%" }}
      animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "200% 50%"] }}
      transition={{ duration: 6, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
    >
      {children}
    </motion.span>
  );
}
