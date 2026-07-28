import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "crypto1",
  title: "Token Price Hero",
  description:
    "Hero section with token price card showing live market stats. Price change indicator, market cap, volume, and circulating supply grid. Trending up/down icons.",
  category: "Crypto",
  registryDependencies: ["badge", "button"],
};
