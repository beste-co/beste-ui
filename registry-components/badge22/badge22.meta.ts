import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge22",
  title: "Kbd Shortcut Badge",
  description:
    "A keyboard shortcut badge with real keycaps for command palettes and developer tools.",
  category: "Badge",
  usage: `import { Badge22 } from "@/components/beste/component/badge22";

<Badge22 keys={["⌘", "K"]} label="to search" />

<Badge22
  keys={["Ctrl", "Shift", "P"]}
  label="opens the palette"
  tone="outline"   // "muted" (default) | "outline"
/>`,
};
