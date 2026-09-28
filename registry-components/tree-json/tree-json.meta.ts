import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "tree-json",
  title: "Tree JSON",
  description:
    "A JSON viewer on the tree family's pattern: objects and arrays open and close with a height animation and a spring on the chevron, closed ones show a preview like {3 keys} or [12 items], and values are colored by type with strings, numbers, booleans and null each told apart in light and dark themes. Long arrays arrive in chunks behind a Show more row, a search field highlights matching keys and values, opens their parents and reaches into chunked arrays, and every row copies its value or its path, written the way you would in code (data.dates[2].city). Values stay selectable. The whole viewer is a WAI-ARIA tree: arrow keys walk it, Right and Left open, close and climb, `*` opens every sibling, and Cmd or Ctrl + C copies the focused value (with Shift, its path).",
  category: "Tree",
  registryDependencies: ["input"],
  usage: `import { TreeJson } from "@/components/beste/component/tree-json";

<TreeJson data={response} rootName="response" expandDepth={2} searchable />

// Controlled search and expansion, copy callback
<TreeJson
  data={config}
  rootName="config"
  expanded={open}
  onExpandedChange={setOpen}
  search={query}
  onSearchChange={setQuery}
  chunkSize={50}                 // array items shown at a time
  onCopy={(text, what, path) => console.log("Copied", what, path)}
  tone="outline"                 // "ghost" (default) | "muted" | "outline"
  size="sm"                      // "sm" | "default" | "lg"
/>`,
};
