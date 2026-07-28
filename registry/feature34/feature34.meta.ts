import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "feature34",
  title: "Numbered Reasons List",
  description:
    "Two-column grid of numbered items (01, 02, etc.) with circular badges, titles, and descriptions. Perfect for why-choose-us sections, benefits lists, or key differentiators.",
  category: "Feature",
  dependencies: ["clsx","tailwind-merge"],
  registryDependencies: ["badge","button"],
};
