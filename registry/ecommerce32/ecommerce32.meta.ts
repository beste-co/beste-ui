import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "ecommerce32",
  title: "Shop by Brand Grid",
  description: "Brand logo cards with product counts and hover effects linking to brand pages. Perfect for multi-brand stores and brand discovery.",
  category: "Ecommerce",
  dependencies: ["clsx", "tailwind-merge"],
  registryDependencies: ["badge"],
};
