import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric55",
  title: "Isometric Briefcase",
  description:
    "A flat briefcase clicks its latches and swings its lid back on the hinge, showing a sheet of notes resting on a folder in the accent color, then closes again.",
  category: "Isometric",
  usage: `import { Isometric55 } from "@/components/beste/piece/isometric55";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric55 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every client file in 1 shared workspace.
  </p>
</div>`,
};
