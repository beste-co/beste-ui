import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "hero7",
  title: "Centered Hero with Media",
  description: "Centered hero with optional badge, heading, description, dual action buttons, and a featured image below. Perfect for product launches and landing pages.",
  category: "Hero",
  dependencies: ["clsx","tailwind-merge","class-variance-authority","@radix-ui/react-slot"],
  registryDependencies: ["button","badge"],
};
