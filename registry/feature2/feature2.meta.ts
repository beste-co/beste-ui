import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "feature2",
  title: "Alternating Rows With Mixed Media",
  description:
    "Hero header with a CTA, then alternating image-left / image-right rows. Each row's media slot accepts an image, video, or live registry-component asset.",
  category: "Feature",
  registryDependencies: ["badge", "button"],
  componentDependencies: ["browser27", "browser28", "calendar19"],
  isPro: false,
};
