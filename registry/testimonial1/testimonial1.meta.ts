import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "testimonial1",
  title: "Carousel Testimonials",
  description: "Full-width swipeable testimonial carousel with autoplay and dot navigation. Perfect for highlighting multiple customer quotes on landing pages.",
  category: "Testimonial",
  dependencies: ["clsx","tailwind-merge","embla-carousel-react","embla-carousel-autoplay"],
  registryDependencies: ["badge","button"],
};
