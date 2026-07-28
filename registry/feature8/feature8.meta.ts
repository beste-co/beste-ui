import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "feature8",
  title: "Capability Carousel",
  description:
    "Looping carousel of capability cards with a centered media slot per card. Each slot accepts an image, video, or live registry-component asset.",
  category: "Feature",
  registryDependencies: ["badge", "button", "carousel"],
  componentDependencies: [
    "ai8",
    "ai22",
    "code1",
    "keyboard1",
    "search1",
    "weather2",
  ],
  isPro: false,
};
