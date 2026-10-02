import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric51",
  title: "Isometric Piggy Bank",
  description:
    "A coin in the accent color drops through the slot on the back of a rounded piggy bank, which gives a small hop once the coin is in.",
  category: "Isometric",
  usage: `import { Isometric51 } from "@/components/beste/piece/isometric51";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric51 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Round up every purchase and save 5% more.
  </p>
</div>`,
};
