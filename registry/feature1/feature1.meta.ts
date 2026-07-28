import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "feature1",
  title: "Accordion With Live Media",
  description:
    "Accordion on the left, swappable media surface on the right. Each row picks its own media kind: image, video, or live registry-component asset.",
  category: "Feature",
  registryDependencies: ["accordion", "badge"],
  componentDependencies: [
    "ai43",
    "automation1",
    "automation10",
    "automation2",
    "automation8",
  ],
  isPro: false,
};
