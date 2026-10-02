import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric236",
  title: "Isometric Page Speed",
  description:
    "A thick gauge stands on a desk. Its needle turns about a raised hub from the slow end to the fast end while the reached part of the track fills in the accent color, the score sits under the hub and three metric bars fill one after another before everything winds back and rests.",
  category: "Isometric",
  usage: `import { Isometric236 } from "@/components/beste/piece/isometric236";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric236 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Fast on every page.
  </p>
</div>`,
};
