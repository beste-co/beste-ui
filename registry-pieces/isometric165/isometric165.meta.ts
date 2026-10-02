import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric165",
  title: "Isometric Filing Cabinet",
  description:
    "The top drawer of a filing cabinet slides out on its rails, a folder in the accent color lifts up from the row and drops back, and the drawer closes.",
  category: "Isometric",
  usage: `import { Isometric165 } from "@/components/beste/piece/isometric165";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric165 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every document, filed for you.
  </p>
</div>`,
};
