import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric39",
  title: "Isometric Potted Plant",
  description:
    "A snake plant in a round pot on a saucer, its banded blades fanning out all around and swaying a little, while a new blade in the accent color grows up from the soil among them.",
  category: "Isometric",
  usage: `import { Isometric39 } from "@/components/beste/piece/isometric39";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric39 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Watering reminders for 120 plant types.
  </p>
</div>`,
};
