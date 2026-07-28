import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "onboarding4",
  title: "Video Introduction Screen",
  description: "Welcome screen featuring a video thumbnail with play overlay and duration badge. Perfect for product tours that use video content to demonstrate features.",
  category: "Onboarding",
  registryDependencies: ["badge","button"],
};
