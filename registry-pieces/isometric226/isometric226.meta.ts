import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric226",
  title: "Isometric Page Translation",
  description:
    "Two pages lie side by side, each with a language tab on its far edge. The rows of the first page light up in turn in the accent color, and the matching row on the second page changes to its translated line.",
  category: "Isometric",
  usage: `import { Isometric226 } from "@/components/beste/piece/isometric226";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric226 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    One page, every language.
  </p>
</div>`,
};
