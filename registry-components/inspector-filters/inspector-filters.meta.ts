import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "inspector-filters",
  title: "Inspector Filters",
  description:
    "Settings row for a CSS filter stack, all ten functions of it: the row shows the whole stack applied to something, and opens an editor holding the nine numeric filters as rows of the family plus a drop shadow section, over a preview large enough to judge.",
  category: "Inspector",
  registryDependencies: ["popover"],
  registryComponents: ["inspector-slider", "inspector-color"],
  usage: `import { InspectorFilters } from "@/components/beste/component/inspector-filters";

// Uncontrolled. Each piece sits at its own no-op, so an untouched stack is "none".
<InspectorFilters label="Filters" defaultValue={{ contrast: 110, saturate: 120 }} />

// Controlled, with a separate commit for expensive work
<InspectorFilters
  label="Image filters"
  value={filters}
  onValueChange={setFilters}
  onValueCommit={(value) => save(value)}
/>

// Pass the picture this stack is actually applied to and the editor stops being a
// demonstration
<InspectorFilters label="Filters" preview={\`url(\${image})\`} value={filters} onValueChange={setFilters} />

<InspectorFilters
  label="Backdrop"
  icon={ApertureIcon}              // optional leading icon
  tone="outline"                   // "muted" (default) | "outline" | "ghost"
  size="sm"                        // "sm" | "default" | "lg"
  format="oklch"                   // notation the shadow's colour is written in
  pieces={["blur", "brightness"]}  // offer only these; the order stays CSS's own
  value={backdrop}
  onValueChange={setBackdrop}
/>

// The one filter that is not a number, and the reason it is a filter at all: it
// follows a PNG's transparency or an SVG's outline instead of the box. No spread and
// no inset, because \`drop-shadow()\` has neither.
<InspectorFilters
  label="Logo"
  pieces={["dropShadow"]}
  defaultValue={{ dropShadow: { x: 0, y: 8, blur: 16, color: "#0f172a55" } }}
/>

// What the value turns into. Pieces sitting at their no-op are left out, which is
// both shorter and easier to check than a stack of brightness(100%).
const filter = [
  filters.blur ? \`blur(\${filters.blur}px)\` : null,
  filters.brightness !== 100 ? \`brightness(\${filters.brightness}%)\` : null,
  filters.sepia ? \`sepia(\${filters.sepia}%)\` : null,
  filters.invert ? \`invert(\${filters.invert}%)\` : null,
  // The shadow goes last, so it falls from what the rest of the stack produced.
  filters.dropShadow?.blur
    ? \`drop-shadow(\${filters.dropShadow.x}px \${filters.dropShadow.y}px \${filters.dropShadow.blur}px \${filters.dropShadow.color})\`
    : null,
].filter(Boolean).join(" ") || "none";

<div style={{ filter }} />
<div style={{ backdropFilter: filter }} />`,
};
