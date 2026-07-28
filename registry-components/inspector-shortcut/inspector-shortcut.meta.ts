import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-shortcut",
  title: "Inspector Shortcut",
  description:
    "Settings row that records a key combination: press it, press the keys, and the row keeps them as kbd chips printed in the platform's own glyphs. Mod stands for Cmd on a Mac and Ctrl everywhere else, so one stored value is right on both.",
  category: "Inspector",
  usage: `import { InspectorShortcut } from "@/components/beste/component/inspector-shortcut";

// Uncontrolled. Mod is the platform's command key.
<InspectorShortcut label="Command Palette" defaultValue={["Mod", "K"]} />

// Controlled
<InspectorShortcut label="Save" value={keys} onValueChange={setKeys} />

<InspectorShortcut
  label="Quick add"
  icon={KeyboardIcon}      // optional leading icon
  tone="outline"           // "muted" (default) | "outline" | "ghost"
  size="sm"                // "sm" | "default" | "lg"
  requireModifier={false}  // allow a bare key, at the reader's peril
  emptyLabel="Unassigned"
  forcePlainNames          // print words rather than glyphs, whatever the platform
  value={keys}
  onValueChange={setKeys}
/>

// Matching the value against an event
const matches = (event, keys) =>
  keys.every((part) =>
    part === "Mod" ? event.metaKey || event.ctrlKey :
    part === "Alt" ? event.altKey :
    part === "Shift" ? event.shiftKey :
    event.key.toUpperCase() === part.toUpperCase());

// While recording, every press is captured, including the ones the browser would
// otherwise act on, since binding Mod+S is impossible if the page saves instead.
// Escape leaves recording and Backspace clears, which are the two keys a recorder
// has to give up to stay escapable.`,
};
