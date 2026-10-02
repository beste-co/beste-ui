import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric173",
  title: "Isometric Typewriter",
  description:
    "Keys on a typewriter press down one after another. With each strike the carriage steps along its rail and a letter in the accent color joins the line on the sheet, then the carriage returns.",
  category: "Isometric",
  usage: `import { Isometric173 } from "@/components/beste/piece/isometric173";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric173 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Write the first draft today.
  </p>
</div>`,
};
