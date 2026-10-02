import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric138",
  title: "Isometric Phone Stand",
  description:
    "A phone leans back on a small desk stand while a chat plays out on its screen: typing dots bounce, messages pop in one after another with the sent ones in the accent color, and a check lands on the last one.",
  category: "Isometric",
  usage: `import { Isometric138 } from "@/components/beste/piece/isometric138";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric138 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Answer every customer in under 2 minutes.
  </p>
</div>`,
};
