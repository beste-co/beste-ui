import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "terminal1",
  title: "CLI Installation Typewriter",
  description:
    "Animated terminal that types commands character-by-character with output responses. Perfect for showcasing CLI installation steps or quick-start guides.",
  category: "Terminal",
  registryDependencies: ["badge", "button"],
};
