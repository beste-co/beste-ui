import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric21",
  title: "Isometric Terminal Block",
  description:
    "A terminal panel stands on an isometric base as a command types in, three lines of output appear below it and a fresh prompt blinks in the accent color.",
  category: "Isometric",
  usage: `import { Isometric21 } from "@/components/beste/piece/isometric21";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric21 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    One command sets up your project in 10 seconds.
  </p>
</div>`,
};
