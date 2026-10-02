import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric245",
  title: "Isometric Team Seats",
  description:
    "A project stands on its desk stand with the team lined up in front of it: three members on their seats and one open seat with a dashed outline. A new member rises out of the open seat in the accent color, the seat ring and the role tag beside it take the accent, and their cursor appears on the page before they step down again.",
  category: "Isometric",
  usage: `import { Isometric245 } from "@/components/beste/piece/isometric245";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric245 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    One project, a seat for everyone.
  </p>
</div>`,
};
