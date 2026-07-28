import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "health6",
  title: "Wellness Editorial Section",
  description: "Long-form content section with rich text, bullet point highlights, and call-to-action buttons. Perfect for wellness blogs, healing journey stories, and health philosophy pages.",
  category: "Health",
  dependencies: ["clsx","tailwind-merge","@tailwindcss/typography"],
  registryDependencies: ["button"],
};
