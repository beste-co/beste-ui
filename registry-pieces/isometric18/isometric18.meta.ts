import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric18",
  title: "Isometric Chat Stack",
  description:
    "Rounded chat bubbles drop in one after another and stack into an isometric thread, alternating sides, with the newest one in the accent color.",
  category: "Isometric",
  usage: `import { Isometric18 } from "@/components/beste/piece/isometric18";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric18 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Replies from your team in under 5 minutes.
  </p>
</div>`,
};
