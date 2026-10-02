import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric38",
  title: "Isometric Washing Machine",
  description:
    "A front loading washing machine on a low plinth. Behind the thick glass door the drum turns, lifting laundry in the accent color up its side and letting it tumble back down through the suds.",
  category: "Isometric",
  usage: `import { Isometric38 } from "@/components/beste/piece/isometric38";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric38 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Laundry picked up and back in 24 hours.
  </p>
</div>`,
};
