import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-row",
  title: "Inspector Row",
  description:
    "The family's escape hatch: label on the left, whatever you hand it on the right, and the same surface, metrics and focus ring as every other row, so a control the family does not have yet still looks like it belongs.",
  category: "Inspector",
  usage: `import { InspectorRow } from "@/components/beste/component/inspector-row";

// A bespoke control that still sits in the drawer like the real rows
<InspectorRow label="Preset">
  <MyPresetPicker className="ml-auto" />
</InspectorRow>

// Naming the control inside makes a press on the label reach it, the way it does
// everywhere else in the family
<InspectorRow label="Slug" htmlFor="slug">
  <input id="slug" className="ml-auto bg-transparent text-right text-sm outline-none" />
</InspectorRow>

// A control that cannot be one line tall
<InspectorRow label="Schedule" multiline>
  <MyCalendar />
</InspectorRow>

<InspectorRow
  label="Anything"
  icon={SlidersHorizontalIcon}  // optional leading icon
  tone="outline"                // "muted" (default) | "outline" | "ghost"
  size="sm"                     // "sm" | "default" | "lg"
  disabled
>
  <span className="ml-auto text-sm">Read only</span>
</InspectorRow>

// Reach for it to place a one-off control, not to build the next row type: a row
// that owns its value can do things a wrapper cannot, starting with knowing what a
// press on its label should mean.`,
};
