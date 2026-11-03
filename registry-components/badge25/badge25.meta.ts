import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge25",
  title: "Asterisk Eyebrow",
  description:
    "A quiet sentence-case eyebrow led by a small asterisk in the primary color. Sits above a section heading; swap the icon or render it as a span.",
  category: "Badge",
  usage: `import { Badge25 } from "@/components/beste/component/badge25";
import { Sparkle } from "lucide-react";

<Badge25 text="AI inbox for small teams" />

<Badge25
  text="Early access"
  icon={Sparkle}               // leading icon (default: Asterisk)
  as="span"                    // "p" (default) | "span" | "div"
  className="mb-5 justify-center"
/>`,
};
