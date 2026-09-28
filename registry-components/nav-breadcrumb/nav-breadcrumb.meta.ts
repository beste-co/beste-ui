import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "nav-breadcrumb",
  title: "Nav Breadcrumb",
  description:
    "A breadcrumb trail that folds its middle into a menu when it runs out of room. The fold is decided from the real widths of every level, separator and the menu button, measured again whenever the container resizes, so the trail always fits on one line: the first level and the current page stay in view, the nearest parents stay beside them, and the levels in between collapse behind a small button that lists them in order. Long labels are cut with an ellipsis and keep their full text as a tooltip. Levels render as real links through your own router, or as buttons, with a chevron or slash separator and an optional home icon.",
  category: "Nav",
  registryDependencies: ["dropdown-menu"],
  usage: `import { NavBreadcrumb } from "@/components/beste/component/nav-breadcrumb";

// Links through your router, a house icon on the first level
<NavBreadcrumb
  homeIcon
  items={[
    { label: "Home", href: "/" },
    { label: "Artists", href: "/artists" },
    { label: "Robert Glasper", href: "/artists/glasper" },
    { label: "Black Radio III" },
  ]}
  renderLink={(props) => <Link {...props} />}
/>

// Buttons driven by your own state, slash separators, a filled trail
<NavBreadcrumb
  items={path}
  onNavigate={(item, index) => setPath(path.slice(0, index + 1))}
  separator="slash"
  tone="muted"
/>`,
};
