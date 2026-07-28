import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "health3",
  title: "Medical Specialists Directory",
  description: "Doctor cards grid showing specialists with ratings, availability status, and next appointment slots. Perfect for healthcare platforms and telemedicine booking systems.",
  category: "Health",
  registryDependencies: ["badge", "button"],
};
