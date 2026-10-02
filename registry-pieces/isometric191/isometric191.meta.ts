import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric191",
  title: "Isometric Fingerprint Unlock",
  description:
    "A phone leans against a block and shows its lock screen: the ridges of a fingerprint draw in from the core outward in the accent color, then the padlock gives way to a check.",
  category: "Isometric",
  usage: `import { Isometric191 } from "@/components/beste/piece/isometric191";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric191 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Unlock with a touch.
  </p>
</div>`,
};
