import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric158",
  title: "Isometric Telescope",
  description:
    "A telescope on a tripod points up into the night. Above it a star in the accent color twinkles, with a few faint ones blinking around it.",
  category: "Isometric",
  usage: `import { Isometric158 } from "@/components/beste/piece/isometric158";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric158 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Lessons for 30 classrooms, one night sky.
  </p>
</div>`,
};
