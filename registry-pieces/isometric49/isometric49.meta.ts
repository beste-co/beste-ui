import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric49",
  title: "Isometric Chalkboard",
  description:
    "A chalkboard stands on two feet with a tray of chalk and an eraser. A short sum appears on it one stroke at a time in the accent color, holds, then wipes away.",
  category: "Isometric",
  usage: `import { Isometric49 } from "@/components/beste/piece/isometric49";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric49 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Live lessons with 1 tutor for every 4 students.
  </p>
</div>`,
};
