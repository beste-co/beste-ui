import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "testimonial6",
  title: "Centered Quote",
  description: "Minimalist single testimonial with centered quote and author details. Perfect for hero sections or standalone social proof elements.",
  category: "Testimonial",
  dependencies: ["clsx","tailwind-merge"],
  registryDependencies: ["badge"],
};
