import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card22",
  title: "Chat Card",
  description:
    "A chat conversation card with message bubbles and a typing indicator for testimonials and support sections.",
  category: "Card",
  usage: `import { Card22 } from "@/components/beste/component/card22";

<Card22
  name="Selin Aksoy"
  status="online"
  src="/avatars/selin.jpg"
  messages={[
    { from: "them", text: "The new landing page is live!" },
    { from: "me", text: "Already? That was two days at most" },
  ]}
  typing   // show the bouncing typing indicator
/>

<Card22
  messages={[
    { from: "them", text: "Can you send the invoice?" },
    { from: "me", text: "Done, check your inbox" },
  ]}
  tone="emerald"   // your bubbles: "primary" (default) | "emerald" | "dark"
/>`,
};
