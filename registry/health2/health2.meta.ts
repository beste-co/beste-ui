import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "health2",
  title: "Wellness Goals Tracker",
  description: "Daily wellness goals tracker with progress bars showing current vs target for water intake, steps, mindfulness, and meals. Perfect for habit tracking and fitness apps.",
  category: "Health",
  registryDependencies: ["badge", "button"],
};
