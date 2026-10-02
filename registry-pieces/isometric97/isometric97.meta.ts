import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric97",
  title: "Isometric Vending Machine",
  description:
    "A vending machine with rows of cans on shelves behind its glass. The can picked in the accent color is pushed off its shelf, drops down behind the glass and lands in the tray at the bottom as the flap swings.",
  category: "Isometric",
  usage: `import { Isometric97 } from "@/components/beste/piece/isometric97";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric97 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Tap to pay at 3,000 machines nationwide.
  </p>
</div>`,
};
