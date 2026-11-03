import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "monitoring25",
  title: "First Reply Queue",
  description:
    "Three waiting tickets count their time to first response. The oldest is picked up by an agent and leaves, the others slide up, and a new one arrives at the bottom.",
  category: "Monitoring",
  isAnimated: true,
  backdrop: "https://oud.pics/b/gradients/gradient-silk-blue-yellow.webp",
};
