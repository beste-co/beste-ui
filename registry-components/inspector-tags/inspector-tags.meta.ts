import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-tags",
  title: "Inspector Tags",
  description:
    "Settings block for a list of short strings: tags are typed one after another and wrap under the label, a comma or a paste splits several at once, and Backspace on an empty field reaches back into the list. Collapsible, so a long list folds down to the height of a row with the count still on it.",
  category: "Inspector",
  usage: `import { InspectorTags } from "@/components/beste/component/inspector-tags";

// Uncontrolled
<InspectorTags label="Keywords" defaultValue={["saas", "pricing"]} placeholder="Add a keyword" />

// Controlled
<InspectorTags label="Keywords" value={keywords} onValueChange={setKeywords} />

// A ceiling, which also puts a count beside the label
<InspectorTags label="Tags" max={6} value={tags} onValueChange={setTags} />

<InspectorTags
  label="Utility classes"
  icon={BracesIcon}       // optional leading icon
  tone="outline"          // "muted" (default) | "outline" | "ghost"
  size="sm"               // "sm" | "default" | "lg"
  maxLength={24}          // longest a single tag may be
  caseSensitive           // "React" and "react" are then two tags
  allowDuplicates         // keep repeats
  value={classes}
  onValueChange={setClasses}
/>

// Each tag submits under the same name, so the list arrives as a list
<InspectorTags label="Keywords" name="keywords" defaultValue={["a", "b"]} />

// Pasting "one, two, three" adds three tags; typing a comma ends the one in progress
<InspectorTags label="Keywords" onValueChange={(value) => console.log(value)} />

// Folded away when it is not being written. Closed, the block measures exactly what
// a row of the family measures, and the header still counts what is in there.
<InspectorTags label="Keywords" collapsible defaultOpen={false} onOpenChange={(open) => console.log("open:", open)} />
`,
};
