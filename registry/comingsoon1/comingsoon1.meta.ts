import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "comingsoon1",
  title: "Countdown Timer Launch",
  description: "Coming soon section with a live countdown timer showing days, hours, minutes, and seconds until launch. Perfect for product launches, event announcements, or building anticipation for new features.",
  category: "Coming Soon",
  dependencies: ["clsx","tailwind-merge"],
  registryDependencies: ["badge"],
};
