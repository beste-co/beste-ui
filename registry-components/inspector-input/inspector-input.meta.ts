import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-input",
  title: "Inspector Input",
  description:
    "Settings row with a label on the left and a plain text field on the right, sharing the family's pill: the whole row is the label, so pressing anywhere puts the caret in the field.",
  category: "Inspector",
  usage: `import { InspectorInput } from "@/components/beste/component/inspector-input";

// Uncontrolled
<InspectorInput label="Class name" defaultValue="hero-section" placeholder="Optional" />

// Controlled, with a separate commit for expensive work
<InspectorInput
  label="Alt text"
  value={alt}
  onValueChange={setAlt}                                // every keystroke
  onValueCommit={(value) => console.log("persist", value)} // Enter or blur, if it changed
/>

// A number with its unit; spinners are hidden and the value goes monospace
<InspectorInput label="Offset" type="number" suffix="px" defaultValue="24" />

<InspectorInput
  label="Link"
  type="url"
  align="start"          // "end" (default) tucks short values right; "start" suits long ones
  icon={Link2}           // optional leading icon
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
  placeholder="https://"
  value={href}
  onValueChange={setHref}
/>

// Read-only, and taking part in a form
<InspectorInput label="Slug" name="slug" value={slug} onValueChange={setSlug} />
<InspectorInput label="Id" value={block.id} readOnly />`,
};
