import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "hero24",
  title: "Wellness Hero with Stats Cards",
  description: "Split-layout hero with avatar stack social proof, floating heart rate card, and progress indicator overlay on image. Perfect for health, fitness, and wellness apps.",
  category: "Hero",
  dependencies: ["clsx", "tailwind-merge", "lucide-react", "framer-motion"],
  registryDependencies: ["badge", "button"],
};
