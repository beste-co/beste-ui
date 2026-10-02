import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric62",
  title: "Isometric Rolling Suitcase",
  description:
    "A ribbed isometric suitcase on four spinner wheels pulls its handle up to full height, and the luggage tag in the accent color swings on its strap before the handle slides back down.",
  category: "Isometric",
  usage: `import { Isometric62 } from "@/components/beste/piece/isometric62";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric62 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Trips planned for 4 travelers in one place.
  </p>
</div>`,
};
