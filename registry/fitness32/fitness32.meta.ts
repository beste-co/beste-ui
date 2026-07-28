import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "fitness32",
  title: "Gym Location Finder",
  description: "Location section with map preview, address, hours, parking, and public transit info. Perfect for gym contact pages and multi-location fitness centers.",
  category: "Fitness",
  dependencies: ["clsx", "tailwind-merge", "lucide-react"],
  registryDependencies: ["badge", "button"],
};
