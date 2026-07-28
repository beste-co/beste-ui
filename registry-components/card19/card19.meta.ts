import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card19",
  title: "Book Cover Card",
  description:
    "A 3D book cover card that swings open on hover to reveal page edges for ebooks, guides, and lead magnets.",
  category: "Card",
  usage: `import { Card19 } from "@/components/beste/component/card19";

// The cover swings open on hover; the whole book links when href is set.
<Card19
  title="The Component Handbook"
  author="Beste Studio"
  note="Second edition"
  href="/handbook"
/>

<Card19
  title="Design Tokens Field Guide"
  author="Selin Aksoy"
  src="/covers/tokens.jpg"   // optional cover art
  tone="paper"               // cover: "ink" (default) | "primary" | "paper"
/>`,
};
