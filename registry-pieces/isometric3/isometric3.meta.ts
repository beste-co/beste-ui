import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric3",
  title: "Isometric Keycaps",
  description:
    "Three keycaps on an isometric plate press down one after another and light up in the accent color, like a shortcut being typed.",
  category: "Isometric",
  usage: `import { Isometric3 } from "@/components/beste/piece/isometric3";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric3 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Press ⌘K to find anything.
  </p>
</div>`,
};
