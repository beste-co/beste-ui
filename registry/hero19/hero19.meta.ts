import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "hero19",
  title: "Cinematic Fullscreen Carousel",
  description: "Full-screen animated carousel with multiple transition effects, next slide preview, and progress bar. Perfect for immersive storytelling and portfolio showcases.",
  category: "Hero",
  dependencies: ["clsx", "tailwind-merge", "lucide-react", "framer-motion"],
  registryDependencies: ["badge", "button"],
  fullscreen: true,
  previewAlign: "bottom",
};
