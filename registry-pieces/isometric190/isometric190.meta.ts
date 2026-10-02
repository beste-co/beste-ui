import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric190",
  title: "Isometric Voice Message",
  description:
    "A phone lies face up on a desk: the recorder shows a live waveform while the mic button pulses, then the voice message slides up into the chat in the accent color.",
  category: "Isometric",
  usage: `import { Isometric190 } from "@/components/beste/piece/isometric190";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric190 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Say it instead of typing it.
  </p>
</div>`,
};
