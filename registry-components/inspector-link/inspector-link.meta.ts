import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-link",
  title: "Inspector Link",
  description:
    "Settings row for a destination: the row reads the URL with its scheme stripped and marks whether it leaves the tab, and opens an editor holding an optional page menu, the URL field and the target and nofollow switches.",
  category: "Inspector",
  registryDependencies: ["popover"],
  registryComponents: ["inspector-input", "inspector-switch", "inspector-select"],
  usage: `import { InspectorLink } from "@/components/beste/component/inspector-link";

// Uncontrolled
<InspectorLink label="Link" defaultValue={{ href: "https://beste.co", newTab: true }} />

// Controlled. The value is the pieces an anchor takes.
<InspectorLink
  label="Button link"
  value={link}
  onValueChange={setLink}
  onValueCommit={(value) => save(value)}
/>

// Destinations inside the site become a menu above the URL field
<InspectorLink
  label="Link"
  pages={[{ value: "/", label: "Home" }, { value: "/pricing", label: "Pricing" }]}
  value={link}
  onValueChange={setLink}
/>

<InspectorLink
  label="Source"
  icon={LinkIcon}          // optional leading icon
  tone="outline"           // "muted" (default) | "outline" | "ghost"
  size="sm"                // "sm" | "default" | "lg"
  allowNofollow            // offer the nofollow toggle
  placeholder="https://"
  emptyLabel="Not linked"  // what the row reads with no destination
  value={link}
  onValueChange={setLink}
/>

// What the value turns into
<a
  href={link.href}
  target={link.newTab ? "_blank" : undefined}
  rel={[link.newTab && "noreferrer", link.nofollow && "nofollow"].filter(Boolean).join(" ") || undefined}
>
  Read more
</a>`,
};
