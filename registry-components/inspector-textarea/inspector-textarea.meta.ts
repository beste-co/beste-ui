import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-textarea",
  title: "Inspector Textarea",
  description:
    "The family's block row: the same surface and tones, but the label sits above a multi-line field whose height comes from the text, with a character count whenever there is a limit to see. Collapsible, so a paragraph written once can be folded down to the height of a row without leaving the form.",
  category: "Inspector",
  usage: `import { InspectorTextarea } from "@/components/beste/component/inspector-textarea";

// Uncontrolled. The whole block is a label, so a press anywhere puts the caret in.
<InspectorTextarea label="Description" defaultValue="A short line about the section." />

// Controlled, with a separate commit for expensive work
<InspectorTextarea
  label="Alt text"
  value={alt}
  onValueChange={setAlt}                                // every keystroke
  onValueCommit={(value) => console.log("persist", value)} // on blur, if it changed
  placeholder="Describe the image"
  rows={4}
/>

// A limit brings a count with it, since a limit nobody can see is a trap
<InspectorTextarea label="Summary" maxLength={160} value={summary} onValueChange={setSummary} />

<InspectorTextarea
  label="Custom CSS"
  icon={Code}            // optional leading icon
  rows={6}
  fixedHeight            // stay at \`rows\` and scroll, rather than growing
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // padding preset; the height comes from \`rows\`
  value={css}
  onValueChange={setCss}
/>

// Read-only, and taking part in a form
<InspectorTextarea label="Notes" name="notes" value={notes} onValueChange={setNotes} />
<InspectorTextarea label="Generated" value={output} readOnly />

// Folded away when it is not being written. Closed, the block measures exactly what
// a row of the family measures, and any character count stays in the header.
<InspectorTextarea label="Description" collapsible defaultOpen={false} onOpenChange={(open) => console.log("open:", open)} />
`,
};
