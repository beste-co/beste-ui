import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric145",
  title: "Isometric Bus Stop",
  description:
    "A city bus waits at a stop with a glass shelter while its double door slides open and shut. The timetable board on the shelter is in the accent color, and its top line blinks.",
  category: "Isometric",
  usage: `import { Isometric145 } from "@/components/beste/piece/isometric145";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric145 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Live arrivals for 340 bus lines.
  </p>
</div>`,
};
