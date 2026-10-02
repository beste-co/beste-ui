import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric89",
  title: "Isometric Clothing Rack",
  description:
    "Shirts, dresses and a coat hang from a rail, and the hangers slide apart along it so the coat in the accent color lifts into view.",
  category: "Isometric",
  usage: `import { Isometric89 } from "@/components/beste/piece/isometric89";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric89 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Put 120 new pieces online every season.
  </p>
</div>`,
};
