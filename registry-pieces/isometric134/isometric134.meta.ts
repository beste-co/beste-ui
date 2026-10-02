import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric134",
  title: "Isometric Hotel Bed",
  description:
    "A neatly made bed with two pillows and a blanket in the accent color. The top of the blanket folds back into a crisp turndown, holds, then smooths flat again.",
  category: "Isometric",
  usage: `import { Isometric134 } from "@/components/beste/piece/isometric134";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric134 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Late checkout until 2 pm on every stay.
  </p>
</div>`,
};
