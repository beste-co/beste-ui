import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-tabs",
  title: "Inspector Tabs",
  description:
    "The strip that splits a settings panel into two or three questions instead of one long scroll. It is the strip and nothing else: what the tabs switch between stays in the panel's own markup, beside the state that decides it. The pill slides between equal columns, arrow keys both move and select, and a tab can carry a count of what has changed under it.",
  category: "Inspector",
  usage: `import { InspectorTabs } from "@/components/beste/component/inspector-tabs";

// The panel owns its body, so the strip only has to say which one is showing
const [tab, setTab] = React.useState("design");

<InspectorTabs
  value={tab}
  onValueChange={setTab}
  aria-label="Section settings"
  tabs={[
    { value: "design", label: "Design" },
    { value: "content", label: "Content", badge: 2 },   // a count of what has changed
    { value: "seo", label: "SEO", disabled: !hasSeo },
  ]}
/>
{tab === "design" ? <DesignRows /> : null}
{tab === "content" ? <ContentRows /> : null}

// With a body of your own, point each tab at it so the two are tied together for
// anyone not looking at the screen
<InspectorTabs
  value={tab}
  onValueChange={setTab}
  tabs={[
    { value: "design", label: "Design", controls: "design-rows" },
    { value: "content", label: "Content", controls: "content-rows" },
  ]}
/>
<div id="design-rows" role="tabpanel" hidden={tab !== "design"}>
  <DesignRows />
</div>

// A switcher and nothing else, which panels want just as often. Give it an
// aria-label, since there is no visible text naming the set.
<InspectorTabs
  aria-label="Direction"
  size="sm"                 // "sm" | "default" | "lg"
  tone="outline"            // "muted" (default) | "outline" | "ghost"
  value={direction}
  onValueChange={setDirection}
  tabs={[
    { value: "row", label: "Row", icon: MoveHorizontalIcon },
    { value: "column", label: "Column", icon: MoveVerticalIcon },
  ]}
/>`,
};
