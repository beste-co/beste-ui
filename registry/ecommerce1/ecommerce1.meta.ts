import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "ecommerce1",
  title: "Product Card Grid",
  description: "Responsive product grid with ratings, sale badges, and add to cart buttons. Perfect for shop pages and product catalogs.",
  category: "Ecommerce",
  registryDependencies: ["badge","button"],
};
