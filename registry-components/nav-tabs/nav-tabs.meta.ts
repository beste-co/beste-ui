import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "nav-tabs",
  title: "Nav Tabs",
  description:
    "Tabs with one indicator that slides and resizes between them on a spring: a line under the current tab, a filled pill, or a raised segment on a strip. When the tabs outgrow their space the strip scrolls sideways behind soft fades, arrows appear only while there is more to see, and the current tab always scrolls clear of the edges. Tabs take icons and count badges, follow the WAI-ARIA tabs pattern with automatic or manual activation, and either show panels or render as real links through your own router.",
  category: "Nav",
  usage: `import { NavTabs } from "@/components/beste/component/nav-tabs";

// Tabs with panels, controlled
<NavTabs
  value={tab}
  onValueChange={setTab}
  tabs={[
    { value: "overview", label: "Overview", content: <Overview /> },
    { value: "releases", label: "Releases", count: 24, content: <Releases /> },
    { value: "tour", label: "Tour dates", count: 12, content: <Tour /> },
  ]}
/>

// A segmented strip that selects only on Enter or Space
<NavTabs variant="segment" activation="manual" tabs={tabs} />

// Real links through your router; the strip becomes a labelled nav
<NavTabs
  variant="pill"
  value={section}
  tabs={sections}
  getHref={(value) => \`/artists/glasper/\${value}\`}
  renderLink={(props) => <Link {...props} />}
  aria-label="Artist sections"
/>`,
};
