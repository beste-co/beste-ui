"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Eye,
  type LucideIcon,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type RowLike = { id: string | number };

export interface DataTableColumn<Row extends RowLike> {
  id: string;
  header: string;
  /** Custom cell renderer; falls back to the raw `value` */
  cell?: (row: Row) => ReactNode;
  /** Sortable/searchable scalar for this column */
  value?: (row: Row) => string | number;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  className?: string;
  headerClassName?: string;
}

export interface DataTableAction {
  id: string;
  label: string;
  icon?: LucideIcon;
  destructive?: boolean;
}

interface DataTableProps<Row extends RowLike> {
  columns: DataTableColumn<Row>[];
  data: Row[];
  searchable?: boolean;
  searchPlaceholder?: string;
  selectable?: boolean;
  rowActions?: DataTableAction[];
  onRowAction?: (actionId: string, row: Row) => void;
  onSelectionChange?: (ids: Array<string | number>) => void;
  pageSize?: number;
  /** Extra content rendered on the right of the toolbar (buttons, filters) */
  toolbar?: ReactNode;
  emptyMessage?: string;
  /** Wrap the table in a bordered card surface (default true) */
  bordered?: boolean;
  className?: string;
}

type SortState = { columnId: string; direction: "asc" | "desc" } | null;

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export function DataTable<Row extends RowLike>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = "Search...",
  selectable = false,
  rowActions,
  onRowAction,
  onSelectionChange,
  pageSize = 8,
  toolbar,
  emptyMessage = "No results found.",
  bordered = true,
  className,
}: DataTableProps<Row>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const columnById = useMemo(
    () => new Map(columns.map((column) => [column.id, column])),
    [columns]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const needle = query.trim().toLowerCase();
    return data.filter((row) =>
      columns.some((column) => {
        const raw = column.value?.(row);
        return raw != null && String(raw).toLowerCase().includes(needle);
      })
    );
  }, [data, columns, query]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const column = columnById.get(sort.columnId);
    const accessor = column?.value;
    if (!accessor) return filtered;
    const factor = sort.direction === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * factor;
      }
      return String(av).localeCompare(String(bv)) * factor;
    });
  }, [filtered, sort, columnById]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const pageIds = pageRows.map((row) => row.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  const emitSelection = (next: Set<string | number>) => {
    setSelected(next);
    onSelectionChange?.(Array.from(next));
  };

  const toggleRow = (id: string | number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    emitSelection(next);
  };

  const togglePage = () => {
    const next = new Set(selected);
    for (const id of pageIds) {
      if (allPageSelected) next.delete(id);
      else next.add(id);
    }
    emitSelection(next);
  };

  const handleSort = (columnId: string) => {
    setSort((prev) => {
      if (prev?.columnId !== columnId) return { columnId, direction: "asc" };
      if (prev.direction === "asc") return { columnId, direction: "desc" };
      return null;
    });
  };

  const columnCount =
    columns.length + (selectable ? 1 : 0) + (rowActions?.length ? 1 : 0);
  const hasToolbar = searchable || Boolean(toolbar);

  return (
    <div className={cn(bordered && "rounded-xl border bg-card", className)}>
      {hasToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          {searchable ? (
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            </div>
          ) : (
            <span />
          )}
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      <div className={cn("overflow-x-auto", hasToolbar && "border-t")}>
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={allPageSelected}
                    onCheckedChange={togglePage}
                    aria-label="Select all rows on this page"
                    className="cursor-pointer"
                  />
                </TableHead>
              )}
              {columns.map((column) => {
                const isSorted = sort?.columnId === column.id;
                return (
                  <TableHead
                    key={column.id}
                    className={cn(
                      alignClass[column.align ?? "left"],
                      column.headerClassName
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column.id)}
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors hover:text-foreground",
                          column.align === "right" && "flex-row-reverse",
                          isSorted ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {column.header}
                        {isSorted ? (
                          <ChevronUp
                            className={cn(
                              "size-3.5 transition-transform",
                              sort?.direction === "desc" && "rotate-180"
                            )}
                          />
                        ) : (
                          <ChevronsUpDown className="size-3.5 opacity-60" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
              {rowActions?.length ? (
                <TableHead className="w-10 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row) => {
                const isSelected = selected.has(row.id);
                return (
                  <TableRow key={row.id} data-state={isSelected ? "selected" : undefined}>
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleRow(row.id)}
                          aria-label="Select row"
                          className="cursor-pointer"
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn(
                          alignClass[column.align ?? "left"],
                          column.className
                        )}
                      >
                        {column.cell ? column.cell(row) : column.value?.(row)}
                      </TableCell>
                    ))}
                    {rowActions?.length ? (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 cursor-pointer text-muted-foreground"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">Open row actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            {rowActions.map((action, index) => {
                              const Icon = action.icon;
                              const prev = rowActions[index - 1];
                              const needsSeparator =
                                action.destructive && prev && !prev.destructive;
                              return (
                                <div key={action.id}>
                                  {needsSeparator && <DropdownMenuSeparator />}
                                  <DropdownMenuItem
                                    variant={
                                      action.destructive ? "destructive" : "default"
                                    }
                                    onSelect={() => onRowAction?.(action.id, row)}
                                    className="cursor-pointer"
                                  >
                                    {Icon && <Icon className="size-4" />}
                                    {action.label}
                                  </DropdownMenuItem>
                                </div>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    ) : null}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
        <p className="text-sm text-muted-foreground">
          {selectable && selected.size > 0
            ? `${selected.size} of ${sorted.length} row(s) selected`
            : `${sorted.length} row(s)`}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            disabled={currentPage <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------

interface DemoCustomer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "Active" | "Trial" | "Churned";
  plan: string;
  spend: number;
  joined: string;
}

const demoCustomers: DemoCustomer[] = [
  { id: "1", name: "Amara Okafor", email: "amara@northwind.io", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=96&auto=format&fit=crop", status: "Active", plan: "Scale", spend: 4820, joined: "Jan 4, 2026" },
  { id: "2", name: "Diego Santos", email: "diego@lumen.app", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=96&auto=format&fit=crop", status: "Trial", plan: "Starter", spend: 0, joined: "Feb 18, 2026" },
  { id: "3", name: "Priya Nair", email: "priya@vertex.co", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=96&auto=format&fit=crop", status: "Active", plan: "Growth", spend: 2140, joined: "Nov 22, 2025" },
  { id: "4", name: "Tom Fischer", email: "tom@basecamp.dev", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=96&auto=format&fit=crop", status: "Churned", plan: "Starter", spend: 380, joined: "Aug 9, 2025" },
  { id: "5", name: "Lena Björk", email: "lena@aurora.se", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=96&auto=format&fit=crop", status: "Active", plan: "Scale", spend: 6390, joined: "Mar 2, 2026" },
  { id: "6", name: "Marcus Reed", email: "marcus@hexa.io", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=96&auto=format&fit=crop", status: "Trial", plan: "Starter", spend: 0, joined: "Feb 27, 2026" },
  { id: "7", name: "Yuki Tanaka", email: "yuki@meshlab.jp", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=96&auto=format&fit=crop", status: "Active", plan: "Growth", spend: 3110, joined: "Dec 14, 2025" },
  { id: "8", name: "Sofia Rossi", email: "sofia@brightline.it", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=96&auto=format&fit=crop", status: "Active", plan: "Scale", spend: 5270, joined: "Jan 30, 2026" },
];

const statusTone: Record<DemoCustomer["status"], string> = {
  Active:
    "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  Trial:
    "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  Churned: "border-transparent bg-muted text-muted-foreground",
};

const demoColumns: DataTableColumn<DemoCustomer>[] = [
  {
    id: "name",
    header: "Customer",
    sortable: true,
    value: (row) => row.name,
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarImage src={row.avatar} alt={row.name} />
          <AvatarFallback>{row.name[0]}</AvatarFallback>
        </Avatar>
        <div className="grid leading-tight">
          <span className="font-medium text-foreground">{row.name}</span>
          <span className="text-sm text-muted-foreground">{row.email}</span>
        </div>
      </div>
    ),
  },
  { id: "plan", header: "Plan", sortable: true, value: (row) => row.plan },
  {
    id: "status",
    header: "Status",
    sortable: true,
    value: (row) => row.status,
    cell: (row) => (
      <Badge className={statusTone[row.status]}>{row.status}</Badge>
    ),
  },
  {
    id: "spend",
    header: "Spend",
    sortable: true,
    align: "right",
    value: (row) => row.spend,
    cell: (row) => (
      <span className="font-medium tabular-nums text-foreground">
        ${row.spend.toLocaleString("en-US")}
      </span>
    ),
  },
  {
    id: "joined",
    header: "Joined",
    sortable: true,
    value: (row) => row.joined,
    cell: (row) => (
      <span className="text-muted-foreground">{row.joined}</span>
    ),
  },
];

export const dataTableDemo: DataTableProps<DemoCustomer> = {
  columns: demoColumns,
  data: demoCustomers,
  searchable: true,
  searchPlaceholder: "Search customers...",
  selectable: true,
  pageSize: 6,
  rowActions: [
    { id: "view", label: "View", icon: Eye },
    { id: "edit", label: "Edit", icon: Pencil },
    { id: "delete", label: "Delete", icon: Trash2, destructive: true },
  ],
};
