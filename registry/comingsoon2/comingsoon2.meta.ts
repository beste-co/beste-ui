import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "comingsoon2",
  title: "Development Progress Milestones",
  description: "Coming soon section with a progress bar and milestone tracker showing development stages like Design, Backend, Frontend, and Testing. Perfect for keeping users informed about product development progress.",
  category: "Coming Soon",
  dependencies: ["clsx","tailwind-merge"],
  registryDependencies: ["badge","progress"],
};
