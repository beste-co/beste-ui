import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "hero21",
  title: "Fullscreen Vertical Carousel",
  description: "Full-screen carousel with vertical slide transitions, decorative grid lines, and customizable accent colors. Perfect for creative agencies and modern brand showcases.",
  category: "Hero",
  dependencies: ["clsx", "tailwind-merge", "lucide-react", "framer-motion"],
  registryDependencies: ["badge", "button"],
  fullscreen: true,
};
