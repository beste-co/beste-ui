import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric106",
  title: "Isometric Smartwatch",
  description:
    "A smartwatch lies flat with its strap open while three activity rings in the accent color sweep around the screen. Each ring stops at its own goal, holds, then resets.",
  category: "Isometric",
  usage: `import { Isometric106 } from "@/components/beste/piece/isometric106";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric106 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Track 10,000 steps a day without a phone.
  </p>
</div>`,
};
