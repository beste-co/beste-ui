import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric152",
  title: "Isometric Passport Stamp",
  description:
    "An open passport lies flat with its photo page on the left. A round rubber stamp presses down on the right page and lifts away, leaving an entry stamp with a small plane in the accent color.",
  category: "Isometric",
  usage: `import { Isometric152 } from "@/components/beste/piece/isometric152";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric152 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Visa checks in 190 countries, done in 3 minutes.
  </p>
</div>`,
};
