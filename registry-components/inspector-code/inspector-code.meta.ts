import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-code",
  title: "Inspector Code",
  description:
    "Settings block for a snippet: a monospaced field with a language chip and a line count, Tab indenting instead of leaving, and a fixed height so a pasted stylesheet cannot push the rest of the drawer out of reach. Collapsible, since a snippet is the tallest thing in a drawer and the least often touched; folded, it measures exactly what a row measures and still reports its line count.",
  category: "Inspector",
  usage: `import { InspectorCode } from "@/components/beste/component/inspector-code";

// Uncontrolled
<InspectorCode label="Custom CSS" language="css" defaultValue=".hero { letter-spacing: -0.02em; }" />

// Folded away when it is not being edited. Closed, the block measures exactly what a
// row of the family measures, and its header still says how many lines are in there.
<InspectorCode
  label="Custom CSS"
  language="css"
  collapsible
  defaultOpen={false}
  onOpenChange={(open) => console.log("open:", open)}
/>

// Controlled, with a separate commit for expensive work
<InspectorCode
  label="Custom CSS"
  language="css"
  value={css}
  onValueChange={setCss}
  onValueCommit={(value) => compile(value)}
/>

<InspectorCode
  label="Transition SVG"
  icon={CodeIcon}     // optional leading icon
  tone="outline"      // "muted" (default) | "outline" | "ghost"
  size="sm"           // "sm" | "default" | "lg"
  language="svg"
  rows={10}           // lines it opens at; it scrolls past this rather than growing
  wrap                // let long lines wrap instead of scrolling sideways
  maxLength={4000}
  placeholder="<svg viewBox=..."
  value={svg}
  onValueChange={setSvg}
/>

// Read but not edit
<InspectorCode label="Generated" language="json" value={JSON.stringify(config, null, 2)} readOnly />

// The language chip is a sign, not a parser: nothing here validates against it.
// Tab indents by two spaces and Escape leaves the field, so the keyboard is never
// actually trapped.`,
};
