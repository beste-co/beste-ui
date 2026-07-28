import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "product-filters",
  title: "Product Filters Engine",
  description:
    "Shared engine behind the productlist blocks: filter/sort/page state, query emission with debounce, cascading groups, client-side matching, and a config-driven field renderer over the individual filter components.",
  category: "Filter",
  componentName: "ProductFilters",
  hidden: true,
  registryDependencies: ["badge", "button"],
  registryComponents: [
    "filter-checkbox",
    "filter-chips",
    "filter-combobox",
    "filter-multiselect",
    "filter-radio",
    "filter-range",
    "filter-rating",
    "filter-search",
    "filter-segmented",
    "filter-select",
    "filter-slider",
    "filter-swatch",
    "filter-toggle",
    "filter-tree",
  ],
  usage: `import {
  ProductFilterChips,
  ProductFilterField,
  useProductFilters,
  type ProductFilterGroup,
} from "@/components/beste/component/product-filters";

const groups: ProductFilterGroup[] = [
  { id: "q", label: "Search", type: "search", placeholder: "Search products" },
  {
    id: "category",
    label: "Category",
    type: "select",
    clearLabel: "All categories",
    options: [{ label: "Sneakers", value: "sneakers" }],
  },
  {
    id: "subcategory",
    label: "Subcategory",
    type: "select",
    dependsOn: "category", // stays disabled until a category is picked
    options: [{ label: "Running", value: "running", parentValue: "sneakers" }],
  },
];

function Toolbar() {
  const engine = useProductFilters({
    groups,
    pageSize: 12,
    onQueryChange: (query) => console.log("fetch with:", query),
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {groups.map((group, index) => (
          <ProductFilterField key={index} group={group} engine={engine} />
        ))}
      </div>
      <ProductFilterChips engine={engine} />
    </div>
  );
}`,
};
