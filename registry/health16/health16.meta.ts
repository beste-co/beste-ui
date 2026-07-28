import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "health16",
  title: "Health Statistics Display",
  description: "Large-format statistics grid showcasing key metrics like member counts, satisfaction rates, and years of service. Perfect for healthcare organizations and wellness brands.",
  category: "Health",
  dependencies: ["clsx","tailwind-merge"],
};
