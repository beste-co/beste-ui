import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric205",
  title: "Isometric Site Publish",
  description:
    "A browser on a desk stand shows a draft page of dashed placeholders. The publish button in front of it sinks into its well, the page fades into its finished look, the address bar gains a secure mark in the accent color and a small beacon beside the stand sends rings over the desk before everything returns to draft.",
  category: "Isometric",
  usage: `import { Isometric205 } from "@/components/beste/piece/isometric205";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric205 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Draft until you say go.
  </p>
</div>`,
};
