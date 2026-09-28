import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "kbd-combo",
  title: "Kbd Combo",
  description:
    "A keyboard shortcut drawn as key caps: `mod` reads as Command on Apple platforms and Control elsewhere, modifiers and special keys get their symbols, and the whole shortcut is spelled out for screen readers. With `live` on, each cap presses down while the real key is held and the combo glows when it is complete; `onTrigger` turns the same caps into the listener for the shortcut. Combos and sequences (\"g then i\"), three tones and three sizes.",
  category: "Keyboard",
  usage: `import { KbdCombo } from "@/components/beste/component/kbd-combo";

// Static caps. \`mod\` is ⌘ on a Mac and Ctrl everywhere else
<KbdCombo keys="mod+k" />

// The caps press down as the reader holds the keys
<KbdCombo keys="mod+shift+p" live size="lg" />

// The same caps own the shortcut
<KbdCombo keys="mod+k" live onTrigger={() => console.log("Open the palette")} />

// A sequence, pressed one key after another
<KbdCombo keys="g then i" sequence live onTrigger={() => console.log("Go to inbox")} />

<KbdCombo
  keys={["alt", "up"]}
  separator="plus"   // "none" | "plus" | "then"
  tone="outline"     // "muted" (default) | "outline" | "ghost"
  size="sm"          // "sm" | "default" | "lg"
/>`,
};
