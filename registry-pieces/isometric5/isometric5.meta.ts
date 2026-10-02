import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric5",
  title: "Isometric App Grid",
  description:
    "A phone lies flat with a grid of raised app icons that drop onto its home screen in a wave. One icon in the accent color is pressed, lifts off the screen and gets a notification badge before settling back.",
  category: "Isometric",
  usage: `import { Isometric5 } from "@/components/beste/piece/isometric5";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric5 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Your app on the home screen in 2 weeks.
  </p>
</div>`,
};
