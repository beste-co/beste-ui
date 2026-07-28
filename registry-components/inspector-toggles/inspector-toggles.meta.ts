import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-toggles",
  title: "Inspector Toggles",
  description:
    "Settings row holding a set of pills that are each on or off, so any number of them can be on at once: what inspector-segmented is for one choice out of several, this is for several choices at once, and what inspector-switch is for a single flag, this is for a handful that belong together.",
  category: "Inspector",
  usage: `import { InspectorToggles } from "@/components/beste/component/inspector-toggles";

// Which sides get a border. Four pills only fit as icons.
<InspectorToggles
  label="Borders"
  options={[
    { value: "left", icon: PanelLeftIcon },
    { value: "right", icon: PanelRightIcon },
    { value: "top", icon: PanelTopIcon },
    { value: "bottom", icon: PanelBottomIcon },
  ]}
  value={sides}
  onValueChange={setSides}
/>

// Plain strings when the value is the text
<InspectorToggles label="Weekend" options={["Sat", "Sun"]} defaultValue={["Sat"]} />

// A floor and a ceiling on how many may be on
<InspectorToggles
  label="Corners"
  min={1}                 // the last one on stops answering instead of vanishing
  max={2}                 // the ones still off dim once the ceiling is reached
  options={["TL", "TR", "BR", "BL"]}
  value={corners}
  onValueChange={setCorners}
/>

<InspectorToggles
  label="Effects"
  icon={SparklesIcon}     // optional leading icon
  tone="outline"          // "muted" (default) | "outline" | "ghost"
  size="sm"               // "sm" | "default" | "lg"
  options={[
    { value: "blur", label: "Blur" },
    { value: "grain", label: "Grain" },
    { value: "glow", label: "Glow", disabled: true },
  ]}
  value={effects}
  onValueChange={setEffects}
/>

// The pills are checkboxes sharing one name, so the row submits with a form
<InspectorToggles label="Days" name="days" options={["Mon", "Tue", "Wed"]} />

// Values come back in the order the options declare them, not the order pressed
<InspectorToggles
  label="Sides"
  options={["left", "right", "top", "bottom"]}
  onValueChange={(value) => console.log(value)}  // ["left", "top"], never ["top", "left"]
/>`,
};
