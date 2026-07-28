import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-segmented",
  title: "Inspector Segmented",
  description:
    "Settings row whose choices sit side by side on the right, with a marker that slides between them: the readable alternative to a switch when the two states deserve names, and the compact one to a select at three or four options.",
  category: "Inspector",
  usage: `import { InspectorSegmented } from "@/components/beste/component/inspector-segmented";

// A boolean that reads better named than toggled
<InspectorSegmented
  label="Dark Mode"
  options={[{ value: "off", label: "Off" }, { value: "on", label: "On" }]}
  value={darkMode ? "on" : "off"}
  onValueChange={(value) => setDarkMode(value === "on")}
/>

// Plain strings when the value is the text
<InspectorSegmented label="Fit" options={["Cover", "Contain"]} defaultValue="Cover" />

// Icons alone, for choices a word would only slow down
<InspectorSegmented
  label="Align"
  options={[
    { value: "left", icon: AlignLeft },
    { value: "center", icon: AlignCenter },
    { value: "right", icon: AlignRight },
  ]}
  value={align}
  onValueChange={setAlign}
/>

<InspectorSegmented
  label="Direction"
  icon={MoveHorizontal}   // optional leading icon
  tone="outline"          // "muted" (default) | "outline" | "ghost"
  size="sm"               // "sm" | "default" | "lg"
  options={[
    { value: "row", label: "Row" },
    { value: "column", label: "Column" },
    { value: "grid", label: "Grid", disabled: true },
  ]}
  value={direction}
  onValueChange={setDirection}
/>

// The segments are radios, so arrow keys move the selection and \`name\` submits
<InspectorSegmented label="Theme" name="theme" options={["System", "Light", "Dark"]} />`,
};
