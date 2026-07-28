"use client";

import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryFilterProps {
  label: string;
  param: string;
  categories: { name: string; count: number }[];
  value: string | null;
  totalCount: number;
  /** Path to navigate to (defaults to current route, e.g. "/") */
  basePath: string;
  /** Other query params to preserve when this filter changes */
  otherParams?: Record<string, string>;
}

export function CategoryFilter({
  label,
  param,
  categories,
  value,
  totalCount,
  basePath,
  otherParams = {},
}: CategoryFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setCategory = (next: string | null) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(otherParams)) {
      if (v) params.set(k, v);
    }
    if (next === null) {
      params.delete(param);
    } else {
      params.set(param, next);
    }
    const query = params.toString();
    const url = query ? `${basePath}?${query}` : basePath;
    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isPending}
          className="cursor-pointer justify-between gap-2 min-w-[180px] border-neutral-300 dark:border-neutral-700"
        >
          <span className="flex items-center gap-2">
            <span className="truncate">{value ?? label}</span>
            {value && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {categories.find((c) => c.name === value)?.count ?? ""}
              </span>
            )}
          </span>
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={2} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[360px] w-[220px] overflow-y-auto">
        <DropdownMenuItem
          onSelect={() => setCategory(null)}
          className="flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            {!value && <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} />}
            <span className={!value ? "" : "ml-[22px]"}>{label}</span>
          </span>
          <span className="text-xs text-muted-foreground">{totalCount}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {categories.map((c) => {
          const active = value === c.name;
          return (
            <DropdownMenuItem
              key={c.name}
              onSelect={() => setCategory(c.name)}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                {active && <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} />}
                <span className={active ? "" : "ml-[22px]"}>{c.name}</span>
              </span>
              <span className="text-xs text-muted-foreground">{c.count}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
