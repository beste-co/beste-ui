import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "feature9",
  title: "Three-Step How-To",
  description:
    "Three side-by-side step cards with a media surface anchored to the bottom of each card. Each slot accepts an image, video, or live registry-component asset.",
  category: "Feature",
  registryDependencies: ["badge"],
  componentDependencies: ["calendar1", "terminal2", "upload1"],
  isPro: false,
};
