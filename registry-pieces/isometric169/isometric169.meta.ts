import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric169",
  title: "Isometric Excavator",
  description:
    "A tracked excavator swings its boom and stick down to a pile of dirt, curls the bucket in the accent color to take a scoop and lifts it clear.",
  category: "Isometric",
  usage: `import { Isometric169 } from "@/components/beste/piece/isometric169";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric169 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Groundwork that stays on schedule.
  </p>
</div>`,
};
