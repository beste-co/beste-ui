import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "hero20",
  title: "Split Carousel with Thumbnails",
  description: "Two-column carousel with animated content transitions, thumbnail strip navigation, and vertical progress indicator. Perfect for product showcases and feature highlights.",
  category: "Hero",
  dependencies: ["clsx", "tailwind-merge", "lucide-react", "framer-motion"],
  registryDependencies: ["badge", "button"],
  fullscreen: true,
};
