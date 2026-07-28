import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "health1",
  title: "Vitals Dashboard",
  description: "Health metrics dashboard displaying vital signs like heart rate, blood oxygen, activity, and sleep with trend indicators. Perfect for wellness apps and health tracking platforms.",
  category: "Health",
  registryDependencies: ["badge","button"],
};
