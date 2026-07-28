import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "onboarding1",
  title: "Welcome Hero with Step Indicator",
  description: "Centered welcome screen featuring a hero image, step counter, and dual CTAs. Perfect for app onboarding flows that guide users through a multi-step setup process.",
  category: "Onboarding",
  registryDependencies: ["badge","button"],
};
