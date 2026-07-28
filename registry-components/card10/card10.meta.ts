import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card10",
  title: "Terminal Card",
  description:
    "A terminal window card that types its command lines with a blinking caret for developer landings.",
  category: "Card",
  usage: `import { Card10 } from "@/components/beste/component/card10";

// Commands type in character by character; outputs print at once.
<Card10
  title="beste ~ zsh"
  lines={[
    { kind: "command", text: "npx shadcn@latest init" },
    { kind: "output", text: "Project configured in 0.8s" },
    { kind: "command", text: "npx shadcn add hero-section" },
    { kind: "success", text: "Done. Ship it." },
  ]}
/>

<Card10
  lines={[{ kind: "command", text: "bun dev" }]}
  tone="midnight"   // "dark" (default) | "midnight"
/>`,
};
