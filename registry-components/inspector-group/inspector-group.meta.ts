import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-group",
  title: "Inspector Group",
  description:
    "The container the rows go in: a named, collapsible section that says what it is currently set to while it is closed, with an optional reset in its header. A drawer of twenty settings becomes a drawer of five groups.",
  category: "Inspector",
  registryDependencies: ["tooltip"],
  usage: `import { InspectorGroup } from "@/components/beste/component/inspector-group";

// A section of rows
<InspectorGroup label="Layout">
  <InspectorSlider label="Gap" value={gap} onValueChange={setGap} />
  <InspectorSpacing label="Padding" value={padding} onValueChange={setPadding} />
</InspectorGroup>

// A closed group that says nothing about itself is a door with no sign on it
<InspectorGroup label="Padding" defaultOpen={false} summary={\`\${padding.top} \${padding.right} px\`}>
  <InspectorSpacing label="Padding" value={padding} onValueChange={setPadding} />
</InspectorGroup>

// Reset belongs to the group, not to whichever row happens to be last
<InspectorGroup
  label="Typography"
  onReset={() => setType(defaults)}
  resetDisabled={isDefault}
>
  <InspectorSelect label="Family" options={families} value={family} onValueChange={setFamily} />
  <InspectorStepper label="Size" suffix="px" value={fontSize} onValueChange={setFontSize} />
</InspectorGroup>

<InspectorGroup
  label="Advanced"
  icon={SettingsIcon}     // optional leading icon
  tone="outline"          // "muted" (default) | "outline" | "ghost"
  size="sm"               // "sm" | "default" | "lg"
  open={open}             // controlled; pair with onOpenChange
  onOpenChange={setOpen}
  alwaysShowSummary       // keep the summary visible while open too
  summary="3 changed"
>
  <InspectorCode label="Custom CSS" language="css" value={css} onValueChange={setCss} />
</InspectorGroup>

// A section that is always open: the header becomes a heading rather than offering
// a gesture it will not answer
<InspectorGroup label="Identity" collapsible={false}>
  <InspectorInput label="Name" value={name} onValueChange={setName} />
</InspectorGroup>

// Rows inside a closed group are unmounted, not hidden: each one owns state and
// effects, and a drawer of twenty closed groups would otherwise pay for all of them.`,
};
