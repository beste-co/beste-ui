import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric32",
  title: "Isometric Shopping Bag",
  description:
    "A product box in the accent color drops into a packed paper shopping bag and lands on the carton inside, beside a bottle and a baguette, and the bag gives a small settle as it lands.",
  category: "Isometric",
  usage: `import { Isometric32 } from "@/components/beste/piece/isometric32";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric32 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Checkout in 2 taps, free returns for 30 days.
  </p>
</div>`,
};
