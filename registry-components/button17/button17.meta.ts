import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "button17",
  title: "Copy to Clipboard Button",
  description:
    "A click to copy button for install commands, API keys, and coupon codes with copied feedback.",
  category: "Button",
  usage: `import { Button17 } from "@/components/beste/component/button17";

// Copies \`value\` on click; icon flips to a check while copied.
<Button17 value="npx shadcn@latest init" prefix="$" />

<Button17
  value="SAVE20"
  label="Use code SAVE20"   // display text (defaults to value)
  tone="dark"               // "neutral" (default) | "dark"
  resetDelay={3000}         // ms the copied state is shown
  onCopy={() => console.log("coupon copied")}
/>`,
};
