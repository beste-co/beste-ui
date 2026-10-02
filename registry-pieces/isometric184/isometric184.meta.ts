import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric184",
  title: "Isometric Video Call",
  description:
    "A phone on a desk stand shows a video call: a ring in the accent color pulses around the caller while a level meter moves, the microphone is muted and unmuted, and the small self view is dragged to the opposite corner. An earbud case sits beside the stand.",
  category: "Isometric",
  usage: `import { Isometric184 } from "@/components/beste/piece/isometric184";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric184 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Meet your customers face to face, anywhere.
  </p>
</div>`,
};
