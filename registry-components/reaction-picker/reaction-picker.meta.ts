import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "reaction-picker",
  title: "Reaction Picker",
  description:
    "An emoji picker panel for reactions, comments and messages, built to sit inline or inside a popover. A search field filters a built-in set of about 380 common emoji by name and keywords; category tabs with icons scroll the grid and follow along as it scrolls, with a marker that slides between them. A Recently used row is remembered in localStorage, a skin tone row applies one of the five modifiers to every emoji that takes it, and a preview bar names the hovered or focused emoji. The grid is fully keyboard driven, with arrows moving by row across sections, and each cell has a fixed size so the panel is exactly as wide as its columns.",
  category: "Reaction",
  usage: `import { ReactionPicker } from "@/components/beste/component/reaction-picker";

<ReactionPicker onSelect={(emoji) => console.log("Picked", emoji)} />

// Inside a popover, focused on open, with a controlled skin tone
<ReactionPicker
  autoFocus
  skinTone={tone}
  onSkinToneChange={(next) => console.log("Tone", next)}
  onSelect={(emoji, entry) => console.log(emoji, entry.name)}
  columns={9}            // emoji per row
  recent={false}         // hide the Recently used row
  tone="outline"         // "muted" | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
/>`,
};
