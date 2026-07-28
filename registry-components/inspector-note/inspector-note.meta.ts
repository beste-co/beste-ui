import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-note",
  title: "Inspector Note",
  description:
    "The line of prose that belongs between rows: what a setting is for, why one is switched off, what a value will cost. Four tones, each with its own mark, and the same text size as the rows around it.",
  category: "Inspector",
  usage: `import { InspectorNote } from "@/components/beste/component/inspector-note";

// Quiet by default
<InspectorNote>Applies to every page in this project.</InspectorNote>

// Louder, when the reader is about to be surprised
<InspectorNote tone="warning">This overrides the theme value.</InspectorNote>
<InspectorNote tone="info">Only used when the section has no background of its own.</InspectorNote>
<InspectorNote tone="danger">Removing this cannot be undone.</InspectorNote>

<InspectorNote
  tone="info"
  size="sm"          // "sm" | "default" | "lg"
  icon={SparklesIcon} // replaces the mark the tone brings
>
  Generated once and then cached.
</InspectorNote>

// Or with no mark at all
<InspectorNote hideIcon>Values are in pixels.</InspectorNote>

// The warning and danger tones are announced when they appear, since a warning that
// turns up beside a control the reader is already using has to reach them.`,
};
