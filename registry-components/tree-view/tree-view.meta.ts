import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "tree-view",
  title: "Tree View",
  description:
    "A file explorer tree built on the full WAI-ARIA tree pattern: folders open and close with a height animation and a spring on the chevron, indent guides run under every open folder and the branch holding the focus lights up, and each file gets an icon from its extension. Arrow keys walk the tree, Right and Left open, close and climb, Home and End jump, `*` opens every sibling folder and typing a name jumps to it. Single or multiple selection with Shift ranges and Cmd or Ctrl toggles, controlled or uncontrolled expansion and selection, and optional actions at the end of each row.",
  category: "Tree",
  usage: `import { TreeView } from "@/components/beste/component/tree-view";

<TreeView
  aria-label="Project files"
  items={[
    { id: "app", name: "app", children: [{ id: "app/page.tsx", name: "page.tsx" }] },
    { id: "package.json", name: "package.json" },
  ]}
  defaultExpanded={["app"]}
/>

// Multiple selection, controlled, with an action on Enter or double click
<TreeView
  items={items}
  selectionMode="multiple"      // "single" (default) | "multiple" | "none"
  selected={selected}
  onSelectedChange={setSelected}
  onAction={(item) => console.log("Open", item.name)}
  renderActions={(item) => <button type="button" onClick={() => console.log("Rename", item.name)}>Rename</button>}
  tone="outline"                 // "ghost" (default) | "muted" | "outline"
  size="sm"                      // "sm" | "default" | "lg"
/>`,
};
