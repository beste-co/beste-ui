import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric121",
  title: "Isometric Guitar Stand",
  description:
    "An acoustic guitar with a body in the accent color rests on a stand. Its strings shiver after a strum while soft rings spread from the sound hole.",
  category: "Isometric",
  usage: `import { Isometric121 } from "@/components/beste/piece/isometric121";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric121 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Learn your first 10 chords in 2 weeks.
  </p>
</div>`,
};
