import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric26",
  title: "Isometric Search Lens",
  description:
    "A magnifying glass glides over a four by four grid of isometric blocks, and whichever block sits under the lens lifts and lights up in the accent color.",
  category: "Isometric",
  usage: `import { Isometric26 } from "@/components/beste/piece/isometric26";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric26 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Search 10,000 records in under 50 ms.
  </p>
</div>`,
};
