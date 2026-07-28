import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "testimonial8",
  title: "Quote Cards Grid",
  description: "Grid of testimonial cards with decorative quote marks and HTML-supported text highlighting. Perfect for showcasing multiple customer reviews with emphasis on key phrases.",
  category: "Testimonial",
  dependencies: ["clsx","tailwind-merge"],
  registryDependencies: ["badge","button"],
};
