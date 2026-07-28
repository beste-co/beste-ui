import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "education99",
  title: "Global Partnerships Grid",
  description:
    "A global partnerships section showcasing partner institutions with location details and exchange statistics. Perfect for universities highlighting international collaborations.",
  category: "Education",
  dependencies: ["clsx", "tailwind-merge", "lucide-react"],
  registryDependencies: ["badge"],
  isPro: false,
};
