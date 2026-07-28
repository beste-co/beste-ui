import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge13",
  title: "Marker Highlight Badge",
  description:
    "A marker highlight badge that draws a highlighter stroke behind key words in headlines.",
  category: "Badge",
  usage: `import { Badge13 } from "@/components/beste/component/badge13";

// Inline emphasis, drop it inside a headline:
<h2>
  Ship landing pages <Badge13 label="40% faster" /> with Beste UI
</h2>

<Badge13
  label="new"
  tone="pink"   // "amber" (default) | "emerald" | "pink" | "sky"
/>`,
};
