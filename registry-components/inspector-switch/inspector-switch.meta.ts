import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-switch",
  title: "Inspector Switch",
  description:
    "Settings row with a label on the left and a switch on the right, sharing the family's pill: the label takes the row's spare width, so a press almost anywhere toggles it.",
  category: "Inspector",
  registryDependencies: ["switch"],
  usage: `import { InspectorSwitch } from "@/components/beste/component/inspector-switch";

// Uncontrolled
<InspectorSwitch label="Parallax" defaultChecked />

// Controlled. The props are named after the switch, not the family's \`value\`,
// because that is what every other switch already speaks.
<InspectorSwitch
  label="Show captions"
  checked={captions}
  onCheckedChange={setCaptions}
/>

<InspectorSwitch
  label="Reduce motion"
  icon={Accessibility}   // optional leading icon
  tone="outline"         // "muted" (default) | "outline" | "ghost"
  size="sm"              // "sm" | "default" | "lg"
  checked={reduced}
  onCheckedChange={setReduced}
/>

// Disabled, and taking part in a form
<InspectorSwitch label="Autoplay" checked={autoplay} onCheckedChange={setAutoplay} disabled={isLocked} />
<InspectorSwitch label="Marketing emails" name="marketing" defaultChecked={false} />`,
};
