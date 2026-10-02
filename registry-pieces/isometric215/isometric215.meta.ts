import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric215",
  title: "Isometric Chat Editing",
  description:
    "A chat panel and a page lie side by side on a desk. A message in the accent color slides up from the input into the thread, the hero section of the page fades into a new version right after, and a short reply with a check confirms the change. Both hold, then the page returns to how it was.",
  category: "Isometric",
  usage: `import { Isometric215 } from "@/components/beste/piece/isometric215";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric215 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Say what to change. Watch it change.
  </p>
</div>`,
};
