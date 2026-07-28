import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge19",
  title: "Tag Group Badge",
  description:
    "A tag group badge that renders wrapping chips for services, skills, and topics.",
  category: "Badge",
  usage: `import { Badge19 } from "@/components/beste/component/badge19";

<Badge19 tags={["Branding", "Web design", "Motion", "3D"]} />

<Badge19
  tags={["Next.js", "Tailwind", "shadcn/ui"]}
  tone="outline"   // "muted" (default) | "outline"
/>`,
};
