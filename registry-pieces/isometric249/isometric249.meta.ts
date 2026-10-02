import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric249",
  title: "Isometric Draft Preview",
  description:
    "A draft page with dashed placeholders and the live page stand side by side with a publish button on the desk in front. A change appears on the draft, the button sinks into its well, and the live page fades to match.",
  category: "Isometric",
  usage: `import { Isometric249 } from "@/components/beste/piece/isometric249";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric249 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Look before it goes live.
  </p>
</div>`,
};
