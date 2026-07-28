"use client";

// Client resolver for related piece/component previews. The detail page (a
// server component) passes only NAMES; this looks up component + demoProps from
// the runtime arrays on the client, so live previews render without demoProps
// (which can contain functions) ever crossing the server/client boundary.
import { components } from "@/lib/components";
import { registryComponents } from "@/lib/registry-components";
import { RelatedPreviewGrid, type RelatedPreviewItem } from "@/components/related-preview-grid";

const pieceByName = new Map(components.map((c) => [c.name, c] as const));
const componentByName = new Map(registryComponents.map((c) => [c.name, c] as const));

export function RelatedPreviewByName({
  names,
  kind,
}: {
  names: string[];
  kind: "piece" | "component";
}) {
  const map = kind === "piece" ? pieceByName : componentByName;
  const items: RelatedPreviewItem[] = names
    .map((name): RelatedPreviewItem | null => {
      const meta = map.get(name);
      if (!meta) return null;
      return {
        name: meta.name,
        title: meta.title,
        description: meta.description,
        component: meta.component,
        demoProps: meta.demoProps,
        href: `/${kind}/${meta.name}`,
        category: "category" in meta ? meta.category : undefined,
      };
    })
    .filter((x): x is RelatedPreviewItem => Boolean(x));

  return <RelatedPreviewGrid items={items} />;
}
