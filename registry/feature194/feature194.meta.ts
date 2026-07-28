import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "feature194",
  title: "Three Cards With Asset Media",
  description:
    "Three feature cards that swap an icon for a real micro-asset: a bar chart, a before/after stat, and a terminal prompt. Demonstrates how registry-pieces drop into block media slots.",
  category: "Feature",
  registryDependencies: ["badge", "button"],
  componentDependencies: ["chart1", "stats5", "terminal1"],
  isPro: false,
};
