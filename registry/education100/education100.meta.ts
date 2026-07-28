import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "education100",
  title: "Institutional Quick Facts",
  description:
    "A quick facts grid displaying key institutional statistics with values, labels, and descriptions. Perfect for university at-a-glance pages and prospective student information.",
  category: "Education",
  dependencies: ["clsx", "tailwind-merge", "lucide-react"],
  registryDependencies: ["badge"],
  isPro: false,
};
