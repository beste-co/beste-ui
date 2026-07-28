import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "cta8",
  title: "Centered Newsletter CTA",
  description:
    "Minimal centered call-to-action with heading, description, and action buttons. Perfect for newsletter signups and conversion sections.",
  category: "CTA",
  registryDependencies: ["badge", "button"],
  isPro: false
};
