"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FilterCheckbox } from "@/components/beste/component/filter-checkbox";
import { FilterChips } from "@/components/beste/component/filter-chips";
import { FilterCombobox } from "@/components/beste/component/filter-combobox";
import { FilterMultiselect } from "@/components/beste/component/filter-multiselect";
import { FilterRadio } from "@/components/beste/component/filter-radio";
import { FilterRange } from "@/components/beste/component/filter-range";
import { FilterRating } from "@/components/beste/component/filter-rating";
import { FilterSearch } from "@/components/beste/component/filter-search";
import { FilterSegmented } from "@/components/beste/component/filter-segmented";
import { FilterSelect } from "@/components/beste/component/filter-select";
import { FilterSlider } from "@/components/beste/component/filter-slider";
import { FilterSwatch } from "@/components/beste/component/filter-swatch";
import { FilterToggle } from "@/components/beste/component/filter-toggle";
import {
  expandTreeSelection,
  FilterTree,
} from "@/components/beste/component/filter-tree";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * product-filters: the shared engine behind the productlist blocks.
 *
 * It owns filter/sort/page state, query emission (with debounce for typed
 * inputs), cascading groups, client-side matching, and renders any filter
 * group through the individual filter-* components. Blocks stay thin: they
 * define groups as data, call useProductFilters, and lay out
 * <ProductFilterField> / <ProductFilterChips> however their design needs.
 */

export type ProductFilterType =
  /** Multi-select checkbox list matching product.attributes[id] */
  | "checkbox"
  /** Single-select radio list matching product.attributes[id] */
  | "radio"
  /** Multi-select button chips matching product.attributes[id] */
  | "chips"
  /** Single-select segmented control matching product.attributes[id] */
  | "segmented"
  /** Multi-select color circles matching product.attributes[id] */
  | "swatch"
  /** Switch rows matching product.attributes[id] */
  | "toggle"
  /** Checkbox list of "min-max" buckets matched against product.price */
  | "price"
  /** Range slider matched against product.price; needs min/max/step */
  | "slider"
  /** Min/max number inputs matched against product.price; open-ended */
  | "range"
  /** Single-select "n & up" list matched against product.rating */
  | "rating"
  /** Text input matched against product.title and product.keywords */
  | "search"
  /** Single-select dropdown matching product.attributes[id] */
  | "select"
  /** Multi-select dropdown matching product.attributes[id] */
  | "multiselect"
  /** Searchable dropdown matching product.attributes[id] */
  | "combobox"
  /** Hierarchical checkboxes; a selected parent covers its whole subtree */
  | "tree";

export interface ProductFilterOption {
  label: string;
  value: string;
  /** Muted result count shown next to the option */
  count?: number;
  /** CSS color for "swatch" groups */
  swatch?: string;
  /** For cascading groups: only shown while this parent value is selected */
  parentValue?: string;
  /** Nested options for "tree" groups */
  children?: ProductFilterOption[];
}

export interface ProductFilterGroup {
  id: string;
  label: string;
  type?: ProductFilterType;
  /** Options for option-based types; slider/range/search need none */
  options?: ProductFilterOption[];
  /** Slider/range bounds and step */
  min?: number;
  max?: number;
  step?: number;
  /** Prefix shown before numeric values, e.g. "$" */
  unit?: string;
  /** Placeholder for search inputs and dropdown triggers */
  placeholder?: string;
  /** Placeholder of the search input inside a combobox */
  searchPlaceholder?: string;
  /** Select only: first item that clears the selection, e.g. "All brands" */
  clearLabel?: string;
  /** Combobox only: allow multiple selections */
  multiple?: boolean;
  /**
   * Cascading filters: id of the parent group. The group stays disabled until
   * the parent has a selection, its selection clears whenever the parent
   * changes, and its options come from `parentValue`-tagged static options or
   * from the loadOptions callback.
   */
  dependsOn?: string;
  /** Skip the built-in heading when the layout renders its own labels */
  hideLabel?: boolean;
}

export interface ProductSortOption {
  label: string;
  /** Client-side sorting understands: "featured" | "price-asc" | "price-desc" | "rating" */
  value: string;
}

export interface ProductQuery {
  /**
   * Selected values per group id. Ranges arrive as ["min-max"] where either
   * side may be empty for open-ended ranges (e.g. "50-" means 50 and up),
   * search as ["text"], everything else as option value arrays.
   */
  filters: Record<string, string[]>;
  sort: string;
  page: number;
  pageSize: number;
}

/** The product fields the client-side matcher reads. */
export interface FilterableProduct {
  title: string;
  price?: number;
  rating?: number;
  /** Extra search terms matched by "search" groups alongside the title */
  keywords?: string[];
  /** Filterable values keyed by filter group id */
  attributes?: Record<string, string[]>;
}

export function parseFilterRange(
  value?: string
): [number, number] | null {
  if (!value) return null;
  const [min, max] = value.split("-").map(Number);
  const lower = Number.isFinite(min) ? (min as number) : 0;
  const upper = Number.isFinite(max)
    ? (max as number)
    : Number.POSITIVE_INFINITY;
  if (!Number.isFinite(min) && !Number.isFinite(max)) return null;
  return [lower, upper];
}

/** True when the product passes every group's current selection. */
export function matchesProductFilters(
  product: FilterableProduct,
  groups: ProductFilterGroup[],
  filters: Record<string, string[]>
): boolean {
  return groups.every((group) => {
    const selected = filters[group.id];
    if (!selected || selected.length === 0) return true;
    if (group.type === "search") {
      const haystack = [product.title, ...(product.keywords ?? [])]
        .join(" ")
        .toLowerCase();
      const words = (selected[0] ?? "").toLowerCase().split(/\s+/);
      return words.every((word) => haystack.includes(word));
    }
    if (
      group.type === "price" ||
      group.type === "slider" ||
      group.type === "range"
    ) {
      return selected.some((value) => {
        const range = parseFilterRange(value);
        if (!range) return true;
        const price = product.price ?? 0;
        return price >= range[0] && price <= range[1];
      });
    }
    if (group.type === "rating") {
      return (product.rating ?? 0) >= Number(selected[0]);
    }
    const values = product.attributes?.[group.id] ?? [];
    const effective =
      group.type === "tree"
        ? expandTreeSelection(group.options ?? [], selected)
        : selected;
    return effective.some((value) => values.includes(value));
  });
}

/** Client-side sorting for the built-in sort values; unknown values keep input order. */
export function sortProducts<T extends FilterableProduct>(
  products: T[],
  sort: string
): T[] {
  const next = [...products];
  if (sort === "price-asc")
    next.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  if (sort === "price-desc")
    next.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  if (sort === "rating")
    next.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return next;
}

export interface ActiveProductFilter {
  group: ProductFilterGroup;
  value: string;
  label: string;
}

interface SetRawValueOptions {
  debounce?: boolean;
  emit?: boolean;
}

export interface UseProductFiltersOptions {
  groups?: ProductFilterGroup[];
  defaultSort?: string;
  /** Initial selections keyed by group id, e.g. restored from the URL */
  defaultFilters?: Record<string, string[]>;
  pageSize?: number;
  /** Called on every filter, sort, and page action (typed inputs debounce 300ms) */
  onQueryChange?: (query: ProductQuery) => void;
  /**
   * Dynamic cascades: loads options for a dependsOn group whenever its parent
   * selection changes. Results are cached per parent selection.
   */
  loadOptions?: (
    groupId: string,
    filters: Record<string, string[]>
  ) => Promise<ProductFilterOption[]>;
}

export interface ProductFiltersEngine {
  filters: Record<string, string[]>;
  sort: string;
  page: number;
  pageSize: number;
  activeFilters: ActiveProductFilter[];
  /** Replace a multi-select group's values ([] clears the group) */
  setValues: (groupId: string, values: string[]) => void;
  /** Set a single-select group's value (null clears the group) */
  selectValue: (groupId: string, value: string | null) => void;
  /** Set a raw value group (slider/range/search); null clears the group */
  setRawValue: (
    groupId: string,
    value: string | null,
    options?: SetRawValueOptions
  ) => void;
  setSort: (value: string) => void;
  goToPage: (page: number) => void;
  clearAll: () => void;
  removeFilter: (active: ActiveProductFilter) => void;
  /** Resolved options for a group (static, cascade-filtered, or async-loaded) */
  optionsFor: (group: ProductFilterGroup) => ProductFilterOption[];
  /** True while a dependsOn group waits for its parent to be selected */
  isGroupDisabled: (group: ProductFilterGroup) => boolean;
  /** True while a dynamic cascade group's options are loading */
  isGroupLoading: (group: ProductFilterGroup) => boolean;
}

/**
 * Tree selections include every checked descendant; for chips we only keep
 * the top-most selected nodes so "Shoes" does not also list every child.
 */
function topLevelTreeSelection(
  options: ProductFilterOption[],
  selected: string[]
): string[] {
  const roots: string[] = [];
  const visit = (nodes: ProductFilterOption[], underSelected: boolean) => {
    for (const node of nodes) {
      const isSelected = selected.includes(node.value);
      if (isSelected && !underSelected) roots.push(node.value);
      visit(node.children ?? [], underSelected || isSelected);
    }
  };
  visit(options, false);
  return roots;
}

function findOptionLabel(
  options: ProductFilterOption[],
  value: string
): string | undefined {
  for (const option of options) {
    if (option.value === value) return option.label;
    const nested = findOptionLabel(option.children ?? [], value);
    if (nested) return nested;
  }
  return undefined;
}

/** Group ids that (transitively) depend on the given group. */
function dependentGroupIds(
  groups: ProductFilterGroup[],
  groupId: string
): string[] {
  const direct = groups.filter((g) => g.dependsOn === groupId);
  return direct.flatMap((g) => [g.id, ...dependentGroupIds(groups, g.id)]);
}

export function useProductFilters({
  groups = [],
  defaultSort,
  defaultFilters,
  pageSize,
  onQueryChange,
  loadOptions,
}: UseProductFiltersOptions): ProductFiltersEngine {
  const size = pageSize && pageSize > 0 ? pageSize : 9;

  const [filters, setFilters] = useState<Record<string, string[]>>(
    defaultFilters ?? {}
  );
  const [sort, setSortState] = useState(defaultSort ?? "featured");
  const [page, setPage] = useState(1);

  const [asyncOptions, setAsyncOptions] = useState<
    Record<string, ProductFilterOption[]>
  >({});
  const [loadingGroups, setLoadingGroups] = useState<Record<string, boolean>>(
    {}
  );
  const loadCache = useRef(new Map<string, ProductFilterOption[]>());
  const pendingLoads = useRef(new Set<string>());

  const emitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (emitTimer.current) clearTimeout(emitTimer.current);
    };
  }, []);

  const emit = (
    nextFilters: Record<string, string[]>,
    nextSort: string,
    nextPage: number,
    debounce = false
  ) => {
    if (emitTimer.current) clearTimeout(emitTimer.current);
    const fire = () =>
      onQueryChange?.({
        filters: nextFilters,
        sort: nextSort,
        page: nextPage,
        pageSize: size,
      });
    if (debounce) {
      emitTimer.current = setTimeout(fire, 300);
    } else {
      fire();
    }
  };

  /** Clears every group that (transitively) depends on the changed group. */
  const withDependentsCleared = (
    next: Record<string, string[]>,
    groupId: string
  ) => {
    for (const dependentId of dependentGroupIds(groups, groupId)) {
      delete next[dependentId];
    }
    return next;
  };

  const applyFilterChange = (
    groupId: string,
    values: string[] | null,
    options?: SetRawValueOptions
  ) => {
    const next = { ...filters };
    if (!values || values.length === 0) {
      delete next[groupId];
    } else {
      next[groupId] = values;
    }
    withDependentsCleared(next, groupId);
    setFilters(next);
    setPage(1);
    if (options?.emit === false) return;
    emit(next, sort, 1, options?.debounce);
  };

  const setValues = (groupId: string, values: string[]) =>
    applyFilterChange(groupId, values);

  const selectValue = (groupId: string, value: string | null) =>
    applyFilterChange(groupId, value === null ? null : [value]);

  const setRawValue = (
    groupId: string,
    value: string | null,
    options?: SetRawValueOptions
  ) =>
    applyFilterChange(
      groupId,
      value === null || value === "" ? null : [value],
      options
    );

  const setSort = (value: string) => {
    setSortState(value);
    setPage(1);
    emit(filters, value, 1);
  };

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
    emit(filters, sort, nextPage);
  };

  const clearAll = () => {
    setFilters({});
    setPage(1);
    emit({}, sort, 1);
  };

  const isGroupDisabled = (group: ProductFilterGroup) =>
    Boolean(group.dependsOn) &&
    (filters[group.dependsOn ?? ""] ?? []).length === 0;

  const optionsFor = (group: ProductFilterGroup): ProductFilterOption[] => {
    if (group.dependsOn) {
      const parentSelection = filters[group.dependsOn] ?? [];
      if (group.options && group.options.length > 0) {
        return group.options.filter(
          (option) =>
            !option.parentValue ||
            parentSelection.includes(option.parentValue)
        );
      }
      return asyncOptions[group.id] ?? [];
    }
    return group.options ?? [];
  };

  const isGroupLoading = (group: ProductFilterGroup) =>
    Boolean(loadingGroups[group.id]);

  // Dynamic cascades: fetch options whenever a parent selection changes.
  useEffect(() => {
    if (!loadOptions) return;
    for (const group of groups) {
      if (!group.dependsOn) continue;
      if (group.options && group.options.length > 0) continue;
      const parentSelection = filters[group.dependsOn] ?? [];
      if (parentSelection.length === 0) continue;
      const cacheKey = `${group.id}:${parentSelection.join(",")}`;
      const cached = loadCache.current.get(cacheKey);
      if (cached) {
        setAsyncOptions((prev) =>
          prev[group.id] === cached ? prev : { ...prev, [group.id]: cached }
        );
        continue;
      }
      if (pendingLoads.current.has(cacheKey)) continue;
      pendingLoads.current.add(cacheKey);
      setLoadingGroups((prev) => ({ ...prev, [group.id]: true }));
      loadOptions(group.id, filters)
        .then((options) => {
          loadCache.current.set(cacheKey, options);
          setAsyncOptions((prev) => ({ ...prev, [group.id]: options }));
        })
        .catch(() => {
          loadCache.current.set(cacheKey, []);
          setAsyncOptions((prev) => ({ ...prev, [group.id]: [] }));
        })
        .finally(() => {
          pendingLoads.current.delete(cacheKey);
          setLoadingGroups((prev) => ({ ...prev, [group.id]: false }));
        });
    }
  }, [filters, groups, loadOptions]);

  const activeFilters = useMemo<ActiveProductFilter[]>(() => {
    return groups.flatMap((group) => {
      const selected = filters[group.id] ?? [];
      if (selected.length === 0) return [];
      if (group.type === "search") {
        return [
          { group, value: selected[0] ?? "", label: `"${selected[0]}"` },
        ];
      }
      if (group.type === "slider" || group.type === "range") {
        const range = parseFilterRange(selected[0]);
        if (!range) return [];
        const unit = group.unit ?? "";
        const label = Number.isFinite(range[1])
          ? `${unit}${range[0]} to ${unit}${range[1]}`
          : `${unit}${range[0]} and up`;
        return [{ group, value: selected[0] ?? "", label }];
      }
      const source =
        group.options && group.options.length > 0
          ? group.options
          : (asyncOptions[group.id] ?? []);
      const chipValues =
        group.type === "tree"
          ? topLevelTreeSelection(source, selected)
          : selected;
      return chipValues.map((value) => ({
        group,
        value,
        label: findOptionLabel(source, value) ?? value,
      }));
    });
  }, [filters, groups, asyncOptions]);

  const removeFilter = (active: ActiveProductFilter) => {
    const { group, value } = active;
    if (
      group.type === "search" ||
      group.type === "slider" ||
      group.type === "range"
    ) {
      setRawValue(group.id, null);
      return;
    }
    if (
      group.type === "radio" ||
      group.type === "segmented" ||
      group.type === "rating" ||
      group.type === "select" ||
      (group.type === "combobox" && !group.multiple)
    ) {
      selectValue(group.id, null);
      return;
    }
    const current = filters[group.id] ?? [];
    if (group.type === "tree") {
      // A tree chip stands for a subtree; removing it clears the descendants too.
      const subtree = new Set(
        expandTreeSelection(group.options ?? [], [value])
      );
      setValues(
        group.id,
        current.filter((v) => !subtree.has(v))
      );
      return;
    }
    setValues(
      group.id,
      current.filter((v) => v !== value)
    );
  };

  return {
    filters,
    sort,
    page,
    pageSize: size,
    activeFilters,
    setValues,
    selectValue,
    setRawValue,
    setSort,
    goToPage,
    clearAll,
    removeFilter,
    optionsFor,
    isGroupDisabled,
    isGroupLoading,
  };
}

export interface UseProductFetchOptions<T> {
  /**
   * Endpoint returning `{ products, totalCount }` for a ProductQuery sent as
   * `?filters=<json>&sort=&page=&pageSize=`. Omit to disable fetching.
   */
  url?: string;
  /**
   * First page fetched on the server (SSR). When provided, the initial
   * client fetch is skipped and this data paints immediately.
   */
  initialProducts?: T[];
  initialTotalCount?: number;
  /** Query used for the initial client load when no initialProducts exist */
  initialQuery: ProductQuery;
  /**
   * "Load more" mode: append results from pages beyond the first instead of
   * replacing them. Page-1 fetches (any filter/sort change resets to page 1)
   * still replace, so the list resets when filters change.
   */
  append?: boolean;
}

export interface ProductFetchState<T> {
  products: T[];
  totalCount: number;
  isLoading: boolean;
  /** Pass to useProductFilters' onQueryChange to refetch on every action */
  fetchQuery: (query: ProductQuery) => void;
  /** True when a url was given and the hook owns the data */
  enabled: boolean;
}

/**
 * Remote data companion to useProductFilters: fetches the current page from
 * `url` on every emitted query, ignores out-of-order responses, and supports
 * an SSR-fetched first page via initialProducts.
 */
export function useProductFetch<T>({
  url,
  initialProducts,
  initialTotalCount,
  initialQuery,
  append = false,
}: UseProductFetchOptions<T>): ProductFetchState<T> {
  const [products, setProducts] = useState<T[]>(initialProducts ?? []);
  const [totalCount, setTotalCount] = useState(
    initialTotalCount ?? initialProducts?.length ?? 0
  );
  const [isLoading, setIsLoading] = useState(
    Boolean(url) && !initialProducts
  );
  const sequence = useRef(0);

  const fetchQuery = useCallback(
    (query: ProductQuery) => {
      if (!url) return;
      const requestId = ++sequence.current;
      setIsLoading(true);
      const params = new URLSearchParams({
        filters: JSON.stringify(query.filters),
        sort: query.sort,
        page: String(query.page),
        pageSize: String(query.pageSize),
      });
      fetch(`${url}?${params.toString()}`)
        .then((response) => response.json())
        .then((data: { products?: T[]; totalCount?: number }) => {
          if (requestId !== sequence.current) return;
          const incoming = data.products ?? [];
          setProducts((prev) =>
            append && query.page > 1 ? [...prev, ...incoming] : incoming
          );
          setTotalCount(data.totalCount ?? 0);
          setIsLoading(false);
        })
        .catch(() => {
          if (requestId !== sequence.current) return;
          setProducts([]);
          setTotalCount(0);
          setIsLoading(false);
        });
    },
    [url, append]
  );

  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    if (url && !initialProducts) fetchQuery(initialQuery);
  }, [url, initialProducts, fetchQuery, initialQuery]);

  return {
    products,
    totalCount,
    isLoading,
    fetchQuery,
    enabled: Boolean(url),
  };
}

interface ProductFilterFieldProps {
  group: ProductFilterGroup;
  engine: ProductFiltersEngine;
  className?: string;
}

/** Renders the right filter control for a group, wired to the engine. */
export function ProductFilterField({
  group,
  engine,
  className,
}: ProductFilterFieldProps) {
  const selected = engine.filters[group.id] ?? [];
  const options = engine.optionsFor(group);
  const label = group.hideLabel ? undefined : group.label;
  const disabled = engine.isGroupDisabled(group);
  const loading = engine.isGroupLoading(group);
  const type = group.type ?? "checkbox";

  if (type === "search") {
    return (
      <FilterSearch
        label={label}
        placeholder={group.placeholder}
        value={selected[0] ?? ""}
        onChange={(value) =>
          engine.setRawValue(group.id, value, { debounce: true })
        }
        className={className}
      />
    );
  }

  if (type === "slider") {
    const min = group.min ?? 0;
    const max = group.max ?? 100;
    const range = parseFilterRange(selected[0]) ?? [min, max];
    return (
      <FilterSlider
        label={label}
        min={min}
        max={max}
        step={group.step}
        unit={group.unit}
        value={[range[0], Math.min(range[1], max)]}
        onChange={(value) =>
          engine.setRawValue(group.id, `${value[0]}-${value[1]}`, {
            emit: false,
          })
        }
        onCommit={(value) =>
          engine.setRawValue(group.id, `${value[0]}-${value[1]}`)
        }
        className={className}
      />
    );
  }

  if (type === "range") {
    const [rawMin = "", rawMax = ""] = (selected[0] ?? "").split("-");
    return (
      <FilterRange
        label={label}
        min={group.min}
        max={group.max}
        value={[rawMin, rawMax]}
        onChange={([nextMin, nextMax]) =>
          engine.setRawValue(
            group.id,
            nextMin === "" && nextMax === "" ? null : `${nextMin}-${nextMax}`,
            { debounce: true }
          )
        }
        className={className}
      />
    );
  }

  if (type === "radio") {
    return (
      <FilterRadio
        label={label}
        options={options}
        value={selected[0] ?? null}
        onChange={(value) => engine.selectValue(group.id, value)}
        className={className}
      />
    );
  }

  if (type === "segmented") {
    return (
      <FilterSegmented
        label={label}
        options={options}
        value={selected[0] ?? null}
        onChange={(value) => engine.selectValue(group.id, value)}
        className={className}
      />
    );
  }

  if (type === "rating") {
    return (
      <FilterRating
        label={label}
        options={options}
        value={selected[0] ?? null}
        onChange={(value) => engine.selectValue(group.id, value)}
        className={className}
      />
    );
  }

  if (type === "chips") {
    return (
      <FilterChips
        label={label}
        options={options}
        value={selected}
        onChange={(value) => engine.setValues(group.id, value)}
        className={className}
      />
    );
  }

  if (type === "swatch") {
    return (
      <FilterSwatch
        label={label}
        options={options.map((option) => ({
          ...option,
          swatch: option.swatch ?? "#e5e5e5",
        }))}
        value={selected}
        onChange={(value) => engine.setValues(group.id, value)}
        className={className}
      />
    );
  }

  if (type === "toggle") {
    return (
      <FilterToggle
        label={label}
        options={options}
        value={selected}
        onChange={(value) => engine.setValues(group.id, value)}
        className={className}
      />
    );
  }

  if (type === "select") {
    return (
      <FilterSelect
        label={label}
        options={options}
        value={selected[0] ?? null}
        placeholder={
          loading ? "Loading..." : (group.placeholder ?? group.label)
        }
        clearLabel={group.clearLabel}
        disabled={disabled || loading}
        onChange={(value) => engine.selectValue(group.id, value)}
        className={className}
      />
    );
  }

  if (type === "multiselect") {
    return (
      <FilterMultiselect
        label={label}
        options={options}
        value={selected}
        placeholder={
          loading ? "Loading..." : (group.placeholder ?? group.label)
        }
        disabled={disabled || loading}
        onChange={(value) => engine.setValues(group.id, value)}
        className={className}
      />
    );
  }

  if (type === "combobox") {
    return (
      <FilterCombobox
        label={label}
        options={options}
        value={selected}
        multiple={group.multiple}
        placeholder={
          loading ? "Loading..." : (group.placeholder ?? group.label)
        }
        searchPlaceholder={group.searchPlaceholder}
        disabled={disabled || loading}
        onChange={(value) => engine.setValues(group.id, value)}
        className={className}
      />
    );
  }

  if (type === "tree") {
    return (
      <FilterTree
        label={label}
        options={options}
        value={selected}
        onChange={(value) => engine.setValues(group.id, value)}
        className={className}
      />
    );
  }

  // "checkbox" and "price" buckets share the same UI
  return (
    <FilterCheckbox
      label={label}
      options={options}
      value={selected}
      onChange={(value) => engine.setValues(group.id, value)}
      className={className}
    />
  );
}

interface ProductFilterChipsProps {
  engine: ProductFiltersEngine;
  /** Label of the trailing reset button (default "Clear all") */
  clearLabel?: string;
  className?: string;
}

/** Removable chips for every active selection, plus a clear-all action. */
export function ProductFilterChips({
  engine,
  clearLabel,
  className,
}: ProductFilterChipsProps) {
  if (engine.activeFilters.length === 0) return null;
  return (
    <div className={className ?? "flex flex-wrap items-center gap-2"}>
      {engine.activeFilters.map((active, index) => (
        <Badge key={index} variant="secondary" className="gap-1 pr-1">
          {active.label}
          <button
            type="button"
            onClick={() => engine.removeFilter(active)}
            className="cursor-pointer rounded-full p-0.5 hover:bg-muted-foreground/20"
            aria-label={`Remove ${active.label} filter`}
          >
            <X className="size-3.5" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={engine.clearAll}
        className="cursor-pointer text-muted-foreground"
      >
        {clearLabel ?? "Clear all"}
      </Button>
    </div>
  );
}

interface ProductFiltersProps {
  groups?: ProductFilterGroup[];
  defaultFilters?: Record<string, string[]>;
  onQueryChange?: (query: ProductQuery) => void;
  className?: string;
}

export const productFiltersDemo: ProductFiltersProps = {
  groups: [
    { id: "q", label: "Search", type: "search", placeholder: "Search products" },
    {
      id: "category",
      label: "Category",
      type: "checkbox",
      options: [
        { label: "Sneakers", value: "sneakers", count: 24 },
        { label: "T-Shirts", value: "t-shirts", count: 18 },
      ],
    },
    { id: "price", label: "Price", type: "slider", min: 0, max: 300, step: 5, unit: "$" },
  ],
};

/**
 * Convenience wrapper that renders every group stacked with active chips on
 * top. Blocks with custom layouts use useProductFilters + ProductFilterField
 * directly instead.
 */
export function ProductFilters({
  groups = [],
  defaultFilters,
  onQueryChange,
  className,
}: ProductFiltersProps) {
  const engine = useProductFilters({ groups, defaultFilters, onQueryChange });
  return (
    <div className={className ?? "space-y-8"}>
      <ProductFilterChips engine={engine} />
      {groups.map((group, index) => (
        <ProductFilterField key={index} group={group} engine={engine} />
      ))}
    </div>
  );
}
