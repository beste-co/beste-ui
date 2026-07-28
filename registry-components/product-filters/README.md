# product-filters: Shared Filter Engine

The engine behind every `productlistN` block. It owns filter/sort/page state, query emission, cascading groups, and client-side matching, and renders any filter group through the individual `filter-*` registry-components. It is `hidden: true`: not listed on the components showcase, but installed automatically with any block that declares it.

## Architecture

Three layers, each installable through the shadcn CLI:

1. **Individual filter controls** (`registry-components/filter-*`): self-contained, controlled-or-uncontrolled UI components, each showcased on the components pages and installable on its own (`npx shadcn@latest add "https://ui.beste.co/component/r/filter-select.json"`).
2. **This engine** (`registry-components/product-filters`): state + orchestration + a config-driven field renderer. Declares all 14 controls in `registryComponents`, so installing the engine ships every control with it.
3. **Blocks** (`registry/productlist1`, `registry/productlist2`, ...): layout and product grids only. Each block declares `registryComponents: ["product-filters"]` in its meta; the generator packages the engine plus the full closure of controls into the block's registry item.

A block decides which filters it uses purely through its `filterGroups` config; the engine renders the right control per group `type`.

## Filter group types

| `type` | Control | Selection | Matches against |
| --- | --- | --- | --- |
| `checkbox` | filter-checkbox | multi | `attributes[id]` |
| `radio` | filter-radio | single, click again to clear | `attributes[id]` |
| `chips` | filter-chips | multi | `attributes[id]` |
| `segmented` | filter-segmented | single, click again to clear | `attributes[id]` |
| `swatch` | filter-swatch | multi | `attributes[id]` |
| `toggle` | filter-toggle | multi | `attributes[id]` |
| `price` | filter-checkbox | multi buckets | `price`, option values are `"min-max"` |
| `slider` | filter-slider | single range | `price`, needs `min`/`max`/`step` |
| `range` | filter-range | single range, open-ended | `price` |
| `rating` | filter-rating | single, click again to clear | `rating` |
| `search` | filter-search | text, 300ms debounce | `title` + `keywords`, every word must match |
| `select` | filter-select | single dropdown | `attributes[id]` |
| `multiselect` | filter-multiselect | multi dropdown | `attributes[id]` |
| `combobox` | filter-combobox | single or multi (`multiple`) | `attributes[id]` |
| `tree` | filter-tree | multi, parent covers subtree | `attributes[id]` |

## Cascading filters (`dependsOn`)

A group with `dependsOn: "<parentGroupId>"` stays disabled until the parent has a selection, and its own selection clears automatically whenever the parent changes (transitively through chains).

**Static cascade**: tag options with `parentValue`; the engine filters them by the parent selection.

```ts
{ id: "category", label: "Category", type: "select", options: [
  { label: "Shoes", value: "shoes" },
]},
{ id: "subcategory", label: "Subcategory", type: "select", dependsOn: "category", options: [
  { label: "Sneakers", value: "sneakers", parentValue: "shoes" },
]},
```

**Dynamic cascade**: leave `options` empty and pass `loadOptions` to the hook; it is called whenever the parent selection changes, results are cached per parent selection, and the control shows a loading state meanwhile.

```ts
const engine = useProductFilters({
  groups,
  loadOptions: async (groupId, filters) => {
    const res = await fetch(`/api/options/${groupId}?parent=${filters.category?.[0]}`);
    return res.json(); // ProductFilterOption[]
  },
});
```

## Engine API

```ts
const engine = useProductFilters({
  groups,            // ProductFilterGroup[]
  defaultSort,       // string, e.g. "featured"
  defaultFilters,    // Record<string, string[]>, e.g. from the URL
  pageSize,          // number, default 9
  onQueryChange,     // (query: ProductQuery) => void, typed inputs debounce 300ms
  loadOptions,       // dynamic cascade loader (optional)
});
```

Returns: `filters`, `sort`, `page`, `pageSize`, `activeFilters`, plus actions `setValues(groupId, string[])`, `selectValue(groupId, string|null)`, `setRawValue(groupId, string|null, {debounce, emit})`, `setSort`, `goToPage`, `clearAll`, `removeFilter(active)`, and helpers `optionsFor(group)`, `isGroupDisabled(group)`, `isGroupLoading(group)`.

Rendering pieces:

- `<ProductFilterField group={group} engine={engine} />`: renders the right control for a group, fully wired. Set `group.hideLabel` when the layout provides its own labels (toolbars).
- `<ProductFilterChips engine={engine} />`: removable chips for active selections plus a clear-all button; renders nothing while empty.
- `<ProductFilters groups={...} />`: convenience wrapper that stacks every group with chips on top (used by the demo; blocks use the hook + field directly).

Remote data companion:

- `useProductFetch({ url, initialProducts, initialTotalCount, initialQuery })`: owns `{ products, totalCount, isLoading }` for an endpoint receiving `?filters=<json>&sort=&page=&pageSize=` and returning `{ products, totalCount }`. Pass its `fetchQuery` into `useProductFilters`' `onQueryChange`. When `initialProducts` is provided (fetched in a server component), the initial client fetch is skipped, giving an SSR first page. Out-of-order responses are discarded.

Data helpers for client mode:

- `matchesProductFilters(product, groups, engine.filters)`: boolean matcher over `FilterableProduct` (`title`, `price?`, `rating?`, `keywords?`, `attributes?`).
- `sortProducts(products, engine.sort)`: understands `featured`, `price-asc`, `price-desc`, `rating`; anything else keeps input order (pass custom values through to your backend in server mode).
- `parseFilterRange("25-150" | "50-" | "-100")`: `[lower, upper]` with `Infinity` for open ends.

## Building a new productlistN block on the engine

```tsx
const engine = useProductFilters({ groups: filterGroups, pageSize, onQueryChange });

const visible = mode === "server"
  ? products // already filtered/sorted by your backend
  : sortProducts(
      products.filter((p) => matchesProductFilters(p, filterGroups, engine.filters)),
      engine.sort
    );

// lay out <ProductFilterField> per group (sidebar, toolbar, drawer...),
// <ProductFilterChips>, your grid over `visible`, and pagination via
// engine.page / engine.goToPage.
```

Declare in the block meta: `registryComponents: ["product-filters"]` plus only the shadcn deps the block itself imports directly (typically `["badge", "button", "select"]`).
