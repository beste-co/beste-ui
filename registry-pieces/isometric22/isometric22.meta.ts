import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric22",
  title: "Isometric Folder Files",
  description:
    "Four folders stand upright on an isometric tray with two files tucked between them, and the one in the accent color lifts a little out of its slot and settles back.",
  category: "Isometric",
  usage: `import { Isometric22 } from "@/components/beste/piece/isometric22";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric22 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every upload filed in under 2 seconds.
  </p>
</div>`,
};
