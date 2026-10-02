import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric220",
  title: "Isometric Dynamic Forms",
  description:
    "A form lies on a desk with three labeled fields, a checkbox and a round submit button. The fields fill in one after another, the checkbox ticks itself in the accent color, and the button presses down into its well before the form clears.",
  category: "Isometric",
  usage: `import { Isometric220 } from "@/components/beste/piece/isometric220";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric220 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Forms that collect exactly what you ask for.
  </p>
</div>`,
};
