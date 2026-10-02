import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric221",
  title: "Isometric Form Inbox",
  description:
    "A form block on a desk prints each submission out of a slot in its side: three cards slide down a chute into an inbox tray and stack up, each marked with a dot in the accent color, while the counter on the tray's back plate lights one more dot per card. The tray then clears and the loop rests.",
  category: "Isometric",
  usage: `import { Isometric221 } from "@/components/beste/piece/isometric221";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric221 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every submission lands in one inbox.
  </p>
</div>`,
};
