import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "education86",
  title: "Social Media Links Grid",
  description:
    "A social media connection section with platform cards showing handles and follower counts. Perfect for university marketing and student community building.",
  category: "Education",
  dependencies: ["clsx", "tailwind-merge", "lucide-react"],
  registryDependencies: ["badge", "button"],
  isPro: false,
};
