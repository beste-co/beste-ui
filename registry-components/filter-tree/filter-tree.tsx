"use client";

import { ChevronRight } from "lucide-react";
import { useId, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FilterTreeOption {
  label: string;
  value: string;
  /** Muted result count shown at the end of the row */
  count?: number;
  children?: FilterTreeOption[];
}

interface FilterTreeProps {
  /** Optional group heading rendered above the tree */
  label?: string;
  options?: FilterTreeOption[];
  /**
   * Controlled selection; omit to let the component manage its own state.
   * Checking a node checks its whole subtree, and a parent turns
   * indeterminate while only some of its descendants are selected. The
   * selection always contains every checked value, descendants included.
   */
  value?: string[];
  /** Initial selection when uncontrolled; parents expand to their subtree */
  defaultValue?: string[];
  /** Values whose children start expanded; ancestors of the initial selection expand automatically */
  defaultExpanded?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
}

/**
 * Expands selected values to include every descendant value, so consumers can
 * match "parent selected" against records tagged with leaf values.
 */
export function expandTreeSelection(
  options: FilterTreeOption[],
  selected: string[]
): string[] {
  const expanded = new Set<string>();
  const visit = (nodes: FilterTreeOption[], underSelected: boolean) => {
    for (const node of nodes) {
      const isSelected = underSelected || selected.includes(node.value);
      if (isSelected) expanded.add(node.value);
      visit(node.children ?? [], isSelected);
    }
  };
  visit(options, false);
  return Array.from(expanded);
}

/** Every value in the node's subtree, the node itself included. */
function subtreeValues(node: FilterTreeOption): string[] {
  return [
    node.value,
    ...(node.children ?? []).flatMap((child) => subtreeValues(child)),
  ];
}

/** Ancestor values of every target value. */
function findAncestors(
  nodes: FilterTreeOption[],
  targets: string[],
  trail: string[] = []
): string[] {
  const ancestors: string[] = [];
  for (const node of nodes) {
    if (targets.includes(node.value)) ancestors.push(...trail);
    ancestors.push(
      ...findAncestors(node.children ?? [], targets, [...trail, node.value])
    );
  }
  return ancestors;
}

/** Ancestor nodes of the target, outermost first, or null when absent. */
function pathTo(
  nodes: FilterTreeOption[],
  target: string,
  trail: FilterTreeOption[] = []
): FilterTreeOption[] | null {
  for (const node of nodes) {
    if (node.value === target) return trail;
    const found = pathTo(node.children ?? [], target, [...trail, node]);
    if (found) return found;
  }
  return null;
}

function hasSelectedDescendant(
  node: FilterTreeOption,
  selected: string[]
): boolean {
  return (node.children ?? []).some(
    (child) =>
      selected.includes(child.value) ||
      hasSelectedDescendant(child, selected)
  );
}

export const filterTreeDemo: FilterTreeProps = {
  label: "Category",
  defaultValue: ["sneakers"],
  className: "w-64",
  options: [
    {
      label: "Shoes",
      value: "shoes",
      count: 42,
      children: [
        { label: "Sneakers", value: "sneakers", count: 24 },
        { label: "Boots", value: "boots", count: 10 },
        { label: "Sandals", value: "sandals", count: 8 },
      ],
    },
    {
      label: "Apparel",
      value: "apparel",
      count: 38,
      children: [
        { label: "T-Shirts", value: "t-shirts", count: 18 },
        {
          label: "Outerwear",
          value: "outerwear",
          count: 20,
          children: [
            { label: "Hoodies", value: "hoodies", count: 9 },
            { label: "Jackets", value: "jackets", count: 11 },
          ],
        },
      ],
    },
    { label: "Accessories", value: "accessories", count: 12 },
  ],
};

export function FilterTree({
  label,
  options = [],
  value,
  defaultValue,
  defaultExpanded,
  onChange,
  className,
}: FilterTreeProps) {
  const uid = useId();
  // Normalize the initial selection so a lone parent covers its subtree.
  const [internal, setInternal] = useState<string[]>(() =>
    defaultValue ? expandTreeSelection(options, defaultValue) : []
  );
  const selected = value ?? internal;
  const [expanded, setExpanded] = useState<Set<string>>(
    () =>
      new Set([
        ...(defaultExpanded ?? []),
        ...findAncestors(options, defaultValue ?? []),
      ])
  );

  const toggleSelected = (node: FilterTreeOption) => {
    const values = subtreeValues(node);
    let next: string[];
    if (selected.includes(node.value)) {
      // Uncheck the subtree; ancestors are no longer fully selected either.
      const remove = new Set([
        ...values,
        ...findAncestors(options, [node.value]),
      ]);
      next = selected.filter((v) => !remove.has(v));
    } else {
      // Check the subtree, then check each ancestor whose children are now
      // all selected, walking bottom-up.
      const set = new Set([...selected, ...values]);
      const ancestors = pathTo(options, node.value) ?? [];
      for (let index = ancestors.length - 1; index >= 0; index--) {
        const ancestor = ancestors[index];
        if (!ancestor) break;
        const complete = (ancestor.children ?? []).every((child) =>
          set.has(child.value)
        );
        if (!complete) break;
        set.add(ancestor.value);
      }
      next = Array.from(set);
    }
    setInternal(next);
    onChange?.(next);
  };

  const toggleExpanded = (optionValue: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(optionValue)) {
        next.delete(optionValue);
      } else {
        next.add(optionValue);
      }
      return next;
    });
  };

  const renderNodes = (nodes: FilterTreeOption[], depth: number) =>
    nodes.map((node, index) => {
      const hasChildren = (node.children ?? []).length > 0;
      const isExpanded = expanded.has(node.value);
      const isSelected = selected.includes(node.value);
      const isIndeterminate =
        !isSelected && hasSelectedDescendant(node, selected);
      return (
        <div key={index}>
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: `${depth * 24}px` }}
          >
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleExpanded(node.value)}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${node.label}`}
                aria-expanded={isExpanded}
                className="flex size-5 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
              >
                <ChevronRight
                  className={cn(
                    "size-4 transition-transform",
                    isExpanded && "rotate-90"
                  )}
                />
              </button>
            ) : (
              <span className="size-5" />
            )}
            <Checkbox
              id={`${uid}-${node.value}`}
              checked={isIndeterminate ? "indeterminate" : isSelected}
              onCheckedChange={() => toggleSelected(node)}
              className="cursor-pointer"
            />
            <Label
              htmlFor={`${uid}-${node.value}`}
              className="flex-1 cursor-pointer font-normal"
            >
              {node.label}
            </Label>
            {typeof node.count === "number" && (
              <span className="text-sm text-muted-foreground">
                {node.count}
              </span>
            )}
          </div>
          {hasChildren && isExpanded && (
            <div className="mt-2 space-y-2">
              {renderNodes(node.children ?? [], depth + 1)}
            </div>
          )}
        </div>
      );
    });

  return (
    <div className={className}>
      {label && (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">
          {label}
        </h3>
      )}
      <div className="space-y-2">{renderNodes(options, 0)}</div>
    </div>
  );
}
