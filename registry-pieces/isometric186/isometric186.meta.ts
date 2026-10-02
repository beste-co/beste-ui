import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric186",
  title: "Isometric Phone Alarm",
  description:
    "A phone leans on a stack of books with the morning alarm going off: the bell swings while sound waves pulse beside it, the second hand ticks round the clock face once a second and the snooze button in the accent color is tapped before the alarm rests.",
  category: "Isometric",
  usage: `import { Isometric186 } from "@/components/beste/piece/isometric186";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric186 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Wake up to a calmer morning.
  </p>
</div>`,
};
