import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "feature112",
  title: "Tabbed Feature Cards",
  description:
    "Tab-based interface showing 3 cards per tab, with button toggles at top. Excellent for segmented features by department, plan, or use case.",
  category: "Feature",
  registryDependencies: ["badge", "button"],
  isPro: false,
};
