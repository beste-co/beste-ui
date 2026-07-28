import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-combobox",
  title: "Inspector Combobox",
  description:
    "Settings row for a list too long to read: pressing it opens a width-matched list with a search field, the keyboard walking the results while focus stays in the field. Options carry groups, descriptions, swatches and search keywords, and `multiple` turns the row into a counted multi-select.",
  category: "Inspector",
  registryDependencies: ["popover"],
  usage: `import { InspectorCombobox } from "@/components/beste/component/inspector-combobox";

const pages = [
  { value: "home", label: "Home", group: "Pages" },
  { value: "pricing", label: "Pricing", group: "Pages" },
  { value: "docs", label: "Documentation", group: "Pages", keywords: ["help", "guide"] },
  { value: "cart", label: "Cart", group: "Shop" },
];

<InspectorCombobox label="Link to" options={pages} defaultValue="pricing" />

// Controlled. The argument is a string here and an array under \`multiple\`, so
// narrow it at the call site, which is what knows which it asked for.
<InspectorCombobox
  label="Link to"
  options={pages}
  value={page}
  onValueChange={(next) => setPage(next as string)}
  onOpenChange={(open) => console.log("list open:", open)}
  searchable                       // on by default past eight options
  searchPlaceholder="Find a page"
  placeholder="Choose a page"      // shown while nothing is selected
  emptyMessage="No page matches"
  clearable                        // adds a "Clear Link to" button at the foot
  tone="outline"                   // "muted" (default) | "outline" | "ghost"
  size="sm"                        // "sm" | "default" | "lg"
/>

// Several at once: the row counts them, and the list stays open between presses
<InspectorCombobox
  label="Categories"
  multiple
  max={3}
  options={["Editorial", "Commerce", "Marketing", "Docs"]}
  value={categories}
  onValueChange={(next) => setCategories(next as string[])}
/>

// Options can carry a mark and a second line
<InspectorCombobox
  label="Theme"
  options={[
    { value: "sand", label: "Sand", swatch: "#d6cbb8", description: "Warm neutral" },
    { value: "slate", label: "Slate", swatch: "#64748b", description: "Cool neutral" },
  ]}
/>`,
};
