import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric208",
  title: "Isometric Design Languages",
  description:
    "Three page boards stand one behind the other on a desk, each in its own design language: soft and rounded, sharp and editorial, and bold with a large block in the accent color. One after another they step out to the side on their plinths and step back.",
  category: "Isometric",
  usage: `import { Isometric208 } from "@/components/beste/piece/isometric208";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric208 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Pick a design language, the whole site follows.
  </p>
</div>`,
};
