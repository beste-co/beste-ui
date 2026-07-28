import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-attributes",
  title: "Inspector Attributes",
  description:
    "The pairs nobody could have put in the panel in advance: data-* hooks, an ARIA relationship, a custom property, an og: name. Two text fields per line and nothing else, with no reordering and no per-row editor. Duplicate names are marked rather than refused, since an edit passes through one on its way.",
  category: "Inspector",
  registryDependencies: ["popover"],
  usage: `import {
  InspectorAttributes,
  attributesToRecord,
} from "@/components/beste/component/inspector-attributes";

<InspectorAttributes
  label="Attributes"
  defaultValue={[{ key: "data-analytics-id", value: "hero-cta" }]}
  // Pressable chips under the pairs: one press adds the name with an empty value,
  // and a name already in the list drops out of the row
  suggestions={["data-testid", "data-analytics-id", "aria-describedby", "rel"]}
/>

<InspectorAttributes
  label="Meta tags"
  value={attributes}                 // [{ key, value }]
  onValueChange={setAttributes}
  onOpenChange={(open) => console.log("editor open:", open)}
  keyPlaceholder="property"
  valuePlaceholder="content"
  max={12}
  tone="outline"                     // "muted" (default) | "outline" | "ghost"
  size="sm"                          // "sm" | "default" | "lg"
/>

// The pairs as the object they are for. Empty names are dropped: a half-typed
// line is not an attribute yet.
<div {...attributesToRecord(attributes)} />`,
};
