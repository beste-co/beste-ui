import type { BlockMeta } from "@/lib/block-types";

export const meta: BlockMeta = {
  name: "feature23",
  title: "Quality Scorecard Grid",
  description:
    "Six-card grid displaying quality metrics with icons, progress bars, and numeric scores for performance, security, and reliability. Perfect for system health dashboards or compliance overviews.",
  category: "Feature",
  registryDependencies: ["badge","button","progress"],
};
