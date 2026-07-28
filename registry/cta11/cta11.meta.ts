import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "cta11",
  title: "Banner CTA",
  description:
    "Horizontal banner call-to-action with heading and action buttons side by side. Perfect for inline conversion sections between content blocks.",
  category: "CTA",
  registryDependencies: ["badge", "button"],
  isPro: false,
};
