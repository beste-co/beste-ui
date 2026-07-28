import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-action",
  title: "Inspector Action",
  description:
    "The row that does something instead of holding something: open a sub-panel, replace an asset, regenerate a key, delete the section. It carries a description, a hint, a busy spinner and a destructive treatment, and renders as a plain anchor when given an href.",
  category: "Inspector",
  usage: `import { InspectorAction } from "@/components/beste/component/inspector-action";

// Opens something: an imperative verb, and the chevron that comes by default
<InspectorAction label="Open asset library" onClick={() => console.log("open the library")} />

// The description is a second line for a consequence the verb cannot carry, and it
// makes the row two lines tall, which is worth it for that and not for restating the label
<InspectorAction
  label="Replace image"
  description="The current one is used in three other places"
  onClick={() => console.log("replace")}
/>

// Acts in place: no chevron, and a spinner while it runs
<InspectorAction
  label="Regenerate key"
  icon={RefreshCwIcon}
  trailingIcon={null}
  busy={regenerating}
  hint="Last rotated in March"
  onClick={() => console.log("rotate")}
/>

<InspectorAction
  label="Delete section"
  description="This cannot be undone"
  destructive
  trailingIcon={Trash2Icon}
  onClick={() => console.log("delete")}
  tone="ghost"          // "muted" (default) | "outline" | "ghost"
  size="sm"             // "sm" | "default" | "lg"
/>

// A link. A plain anchor, since a registry component takes no view on the router.
<InspectorAction label="Open docs" href="https://ui.beste.co/docs" newTab />`,
};
