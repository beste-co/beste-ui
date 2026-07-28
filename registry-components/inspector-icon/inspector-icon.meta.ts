import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-icon",
  title: "Inspector Icon",
  description:
    "Settings row that names the chosen icon and shows it on the right; pressing the row opens a searchable palette below it, width-matched to the row, with clearing offered at the foot of it. The icon set is passed in, so the row never bundles an icon library of its own.",
  category: "Inspector",
  registryDependencies: ["popover"],
  usage: `import { InspectorIcon } from "@/components/beste/component/inspector-icon";
import { HeartIcon, SparklesIcon, StarIcon } from "lucide-react";

const icons = [
  { name: "sparkles", icon: SparklesIcon },
  { name: "star", icon: StarIcon },
  { name: "heart", icon: HeartIcon, label: "Favourite" }, // label is what search and the tooltip use
];

<InspectorIcon label="Icon" icons={icons} defaultValue="star" />

<InspectorIcon
  label="Badge icon"
  icons={icons}
  value={iconName}
  onValueChange={setIconName}
  onOpenChange={(open) => console.log("palette open:", open)}
  clearable                 // adds a "Remove Icon" button at the foot of the palette
  columns={6}               // icons per row in the palette, 8 by default
  searchable                // on by default past sixteen icons
  emptyMessage="Nothing matches"
  tone="outline"            // "muted" (default) | "outline" | "ghost"
  size="sm"                 // "sm" | "default" | "lg"
/>`,
};
