import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "navbar30",
  title: "Centered Logo Split Nav",
  description:
    "Symmetrical navbar with centered logo flanked by navigation links on both sides and dropdown menus. Perfect for fashion brands and lifestyle sites wanting balanced visual hierarchy.",
  category: "Navigation",
  dependencies: ["clsx", "tailwind-merge", "lucide-react"],
  registryDependencies: ["button"],
};
