import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge14",
  title: "Testimonial Badge",
  description:
    "A testimonial badge with an avatar stack, star rating, and social proof text for hero sections.",
  category: "Badge",
  usage: `import { Badge14 } from "@/components/beste/component/badge14";

<Badge14
  avatars={[
    "/avatars/mia.jpg",
    "/avatars/deniz.jpg",
    "/avatars/omar.jpg",
  ]}
  text="Loved by 2,400+ founders"
  rating={5}        // stars, 0–5 (default 5)
  tone="amber"      // "amber" (default) | "primary" | "foreground"
/>`,
};
