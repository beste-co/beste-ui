import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "ecommerce6",
  title: "Product Reviews Section",
  description:
    "Customer reviews with star ratings, verified badges, helpful voting, and load more functionality. Displays average rating summary. Perfect for building trust and social proof on product pages.",
  category: "Ecommerce",
  registryDependencies: ["badge", "button"],
};
