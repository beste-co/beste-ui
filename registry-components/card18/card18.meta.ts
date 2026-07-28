import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card18",
  title: "Sticky Note Card",
  description:
    "A sticky note card with a folded corner and push pin for founder notes and playful reminders.",
  category: "Card",
  usage: `import { Card18 } from "@/components/beste/component/card18";

<Card18
  text="Ship the landing page first. Everything else can wait until Monday."
  from="PS: coffee is on me"
/>

<Card18
  text="Beta invites go out Friday."
  unpinned        // hide the push pin
  tone="mint"     // paper: "yellow" (default) | "pink" | "mint" | "sky"
/>`,
};
