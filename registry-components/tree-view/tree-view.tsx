"use client";

import {
  ChevronRight,
  File,
  FileArchive,
  FileBraces,
  FileCode,
  FileImage,
  FileKey,
  FileLock,
  FileMusic,
  FileSpreadsheet,
  FileTerminal,
  FileText,
  FileVideoCamera,
  Folder,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of the tree. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Row size preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export interface TreeViewItem {
  /** Unique across the whole tree. */
  id: string;
  name: string;
  /** Overrides the icon picked from the name. A component or any node. */
  icon?: LucideIcon | React.ReactNode;
  /** Present (even empty) makes the item a folder. */
  children?: TreeViewItem[];
  disabled?: boolean;
}

export interface TreeViewProps {
  items: TreeViewItem[];
  /** "single" (default), "multiple" (Shift for ranges, Cmd or Ctrl to toggle) or "none". */
  selectionMode?: "single" | "multiple" | "none";
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Enter or a double click on an item. */
  onAction?: (item: TreeViewItem) => void;
  /** Controls at the end of a row, shown on hover, focus and selection. */
  renderActions?: (item: TreeViewItem) => React.ReactNode;
  /** Clicking a folder row also opens or closes it. */
  expandOnClick?: boolean;
  /** Vertical guides under each open folder; the branch holding the focus lights up. */
  guides?: boolean;
  /** File and folder icons. */
  icons?: boolean;
  tone?: Tone;
  size?: Size;
  className?: string;
  "aria-label"?: string;
}

export const treeViewDemo: TreeViewProps = {
  "aria-label": "Project files",
  items: [
    {
      id: "app",
      name: "app",
      children: [
        { id: "app/layout.tsx", name: "layout.tsx" },
        { id: "app/page.tsx", name: "page.tsx" },
        {
          id: "app/tour",
          name: "tour",
          children: [
            { id: "app/tour/page.tsx", name: "page.tsx" },
            { id: "app/tour/dates.json", name: "dates.json" },
          ],
        },
      ],
    },
    {
      id: "components",
      name: "components",
      children: [
        { id: "components/setlist.tsx", name: "setlist.tsx" },
        { id: "components/ticket-card.tsx", name: "ticket-card.tsx" },
      ],
    },
    {
      id: "public",
      name: "public",
      children: [
        { id: "public/cover.jpg", name: "cover.jpg" },
        { id: "public/intro.mp3", name: "intro.mp3" },
        { id: "public/teaser.mp4", name: "teaser.mp4" },
      ],
    },
    { id: ".env", name: ".env" },
    { id: "package.json", name: "package.json" },
    { id: "README.md", name: "README.md" },
  ],
  defaultExpanded: ["app", "app/tour"],
  defaultSelected: ["app/tour/page.tsx"],
  className: "w-full max-w-xs",
};

// Concentric corners: the row's 8px plus the 6px padding (plus the 1px border on outline)
const toneStyles: Record<Tone, string> = {
  muted: "rounded-[14px] bg-muted p-1.5",
  outline: "rounded-[15px] border border-border p-1.5",
  ghost: "",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-sm [--tree-row:--spacing(7)] [--tree-indent:--spacing(3.5)] [--tree-pad:--spacing(1.5)] [--tree-icon:--spacing(4)]",
  default: "text-sm [--tree-row:--spacing(8)] [--tree-indent:--spacing(4)] [--tree-pad:--spacing(2)] [--tree-icon:--spacing(4)]",
  lg: "text-base [--tree-row:--spacing(10)] [--tree-indent:--spacing(5)] [--tree-pad:--spacing(2.5)] [--tree-icon:--spacing(5)]",
};

// Same spring as inspector-slider: overshoots a hair, then settles
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const EXTENSION_ICONS: Record<string, LucideIcon> = {
  ts: FileCode,
  tsx: FileCode,
  js: FileCode,
  jsx: FileCode,
  mjs: FileCode,
  cjs: FileCode,
  css: FileCode,
  html: FileCode,
  vue: FileCode,
  svelte: FileCode,
  py: FileCode,
  go: FileCode,
  rs: FileCode,
  json: FileBraces,
  yaml: FileBraces,
  yml: FileBraces,
  toml: FileBraces,
  md: FileText,
  mdx: FileText,
  txt: FileText,
  pdf: FileText,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  gif: FileImage,
  webp: FileImage,
  avif: FileImage,
  svg: FileImage,
  ico: FileImage,
  mp3: FileMusic,
  wav: FileMusic,
  flac: FileMusic,
  ogg: FileMusic,
  mp4: FileVideoCamera,
  mov: FileVideoCamera,
  webm: FileVideoCamera,
  zip: FileArchive,
  tar: FileArchive,
  gz: FileArchive,
  csv: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  sh: FileTerminal,
  zsh: FileTerminal,
  lock: FileLock,
  pem: FileKey,
  key: FileKey,
};

/** The icon a file name gets: `.env` files read as keys, lockfiles as locks, the rest by extension. */
export function iconForName(name: string): LucideIcon {
  const lower = name.toLowerCase();
  if (lower === ".env" || lower.startsWith(".env.")) return FileKey;
  if (lower.endsWith("-lock.json") || lower.endsWith(".lockb")) return FileLock;
  const dot = lower.lastIndexOf(".");
  if (dot <= 0) return File;
  return EXTENSION_ICONS[lower.slice(dot + 1)] ?? File;
}

// A lucide icon is a component (a forwardRef object); anything else is rendered as given
function renderIcon(icon: LucideIcon | React.ReactNode) {
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in icon)) {
    return React.createElement(icon as LucideIcon);
  }
  return icon as React.ReactNode;
}

interface NodeInfo {
  item: TreeViewItem;
  parentId: string | null;
  level: number;
  posinset: number;
  setsize: number;
}

function indexTree(items: TreeViewItem[]) {
  const map = new Map<string, NodeInfo>();
  const walk = (list: TreeViewItem[], parentId: string | null, level: number) => {
    list.forEach((item, index) => {
      map.set(item.id, { item, parentId, level, posinset: index + 1, setsize: list.length });
      if (item.children) walk(item.children, item.id, level + 1);
    });
  };
  walk(items, null, 1);
  return map;
}

function visibleIds(items: TreeViewItem[], open: Set<string>) {
  const out: string[] = [];
  const walk = (list: TreeViewItem[]) => {
    for (const item of list) {
      out.push(item.id);
      if (item.children && open.has(item.id)) walk(item.children);
    }
  };
  walk(items);
  return out;
}

function useControllable<T>(value: T | undefined, fallback: T, onChange?: (next: T) => void) {
  const [inner, setInner] = React.useState(fallback);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set] as const;
}

const EMPTY: string[] = [];

export function TreeView({
  items,
  selectionMode = "single",
  selected: selectedProp,
  defaultSelected = EMPTY,
  onSelectedChange,
  expanded: expandedProp,
  defaultExpanded = EMPTY,
  onExpandedChange,
  onAction,
  renderActions,
  expandOnClick = true,
  guides = true,
  icons = true,
  tone = "ghost",
  size = "default",
  className,
  "aria-label": ariaLabel = "Files",
}: TreeViewProps) {
  const [selected, setSelected] = useControllable(selectedProp, defaultSelected, onSelectedChange);
  const [expanded, setExpanded] = useControllable(expandedProp, defaultExpanded, onExpandedChange);

  const nodes = React.useMemo(() => indexTree(items), [items]);
  const openSet = React.useMemo(() => new Set(expanded), [expanded]);
  const selectedSet = React.useMemo(() => new Set(selected), [selected]);
  const visible = React.useMemo(() => visibleIds(items, openSet), [items, openSet]);

  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const [focusVisible, setFocusVisible] = React.useState(false);
  // Folders are mounted the first time they open and kept, so closing can animate
  const [mounted, setMounted] = React.useState<Set<string>>(() => new Set(defaultExpanded.concat(expandedProp ?? [])));
  const rowRefs = React.useRef(new Map<string, HTMLLIElement>());
  const anchor = React.useRef<string | null>(null);
  const typeahead = React.useRef({ text: "", at: 0 });

  // The tab stop: the focused item if it is still visible, else the first selected one, else the first item
  const tabStop =
    focusedId && visible.includes(focusedId)
      ? focusedId
      : (visible.find((id) => selectedSet.has(id)) ?? visible[0] ?? null);

  React.useEffect(() => {
    setMounted((prev) => {
      const missing = expanded.filter((id) => !prev.has(id));
      if (missing.length === 0) return prev;
      const next = new Set(prev);
      for (const id of missing) next.add(id);
      return next;
    });
  }, [expanded]);

  // The branch holding the focus (or the selection) lights up its guides
  const activePath = React.useMemo(() => {
    const path = new Set<string>();
    let id: string | null = focusedId ?? selected[selected.length - 1] ?? null;
    while (id) {
      const info = nodes.get(id);
      if (!info) break;
      if (info.parentId) path.add(info.parentId);
      id = info.parentId;
    }
    return path;
  }, [focusedId, selected, nodes]);

  const focusItem = (id: string | null | undefined) => {
    if (!id) return;
    setFocusedId(id);
    rowRefs.current.get(id)?.focus();
  };

  const setOpen = (id: string, open: boolean) => {
    if (openSet.has(id) === open) return;
    setExpanded(open ? [...expanded, id] : expanded.filter((x) => x !== id));
    // Closing a folder around the focus hands the focus to the folder, so it never lands in a hidden row
    if (!open && focusedId && focusedId !== id) {
      let up = nodes.get(focusedId)?.parentId ?? null;
      while (up && up !== id) up = nodes.get(up)?.parentId ?? null;
      if (up === id) focusItem(id);
    }
  };

  const isFolder = (id: string) => Boolean(nodes.get(id)?.item.children);
  const isDisabled = (id: string) => Boolean(nodes.get(id)?.item.disabled);

  // Selection comes back in tree order, never press order, so it can be stored and compared
  const inTreeOrder = (ids: Iterable<string>) => {
    const wanted = new Set(ids);
    const order: string[] = [];
    for (const id of nodes.keys()) if (wanted.has(id)) order.push(id);
    return order;
  };

  const select = (id: string, mode: "replace" | "toggle" | "range") => {
    if (selectionMode === "none" || isDisabled(id)) return;
    if (selectionMode === "single" || mode === "replace") {
      anchor.current = id;
      setSelected([id]);
      return;
    }
    if (mode === "toggle") {
      anchor.current = id;
      const next = new Set(selectedSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelected(inTreeOrder(next));
      return;
    }
    const from = visible.indexOf(anchor.current ?? id);
    const to = visible.indexOf(id);
    if (from < 0 || to < 0) return select(id, "replace");
    const [a, b] = from < to ? [from, to] : [to, from];
    setSelected(inTreeOrder(visible.slice(a, b + 1).filter((x) => !isDisabled(x))));
  };

  const onKeyDown = (event: React.KeyboardEvent, id: string) => {
    // Keys pressed inside a row's own actions stay theirs
    if (event.target !== event.currentTarget) return;
    const info = nodes.get(id);
    if (!info) return;
    const index = visible.indexOf(id);
    const folder = isFolder(id);
    const open = openSet.has(id);
    const multi = selectionMode === "multiple";
    let handled = true;

    switch (event.key) {
      case "ArrowDown": {
        const next = visible[Math.min(visible.length - 1, index + 1)];
        focusItem(next);
        if (event.shiftKey && multi && next) select(next, "range");
        break;
      }
      case "ArrowUp": {
        const prev = visible[Math.max(0, index - 1)];
        focusItem(prev);
        if (event.shiftKey && multi && prev) select(prev, "range");
        break;
      }
      case "ArrowRight":
        if (folder && !open) setOpen(id, true);
        else if (folder && open) focusItem(info.item.children?.[0]?.id);
        break;
      case "ArrowLeft":
        if (folder && open) setOpen(id, false);
        else focusItem(info.parentId);
        break;
      case "Home":
        focusItem(visible[0]);
        if (event.shiftKey && multi && visible[0]) select(visible[0], "range");
        break;
      case "End": {
        const last = visible[visible.length - 1];
        focusItem(last);
        if (event.shiftKey && multi && last) select(last, "range");
        break;
      }
      case "Enter":
        if (event.shiftKey || event.metaKey || event.ctrlKey) {
          handled = false;
          break;
        }
        select(id, "replace");
        if (folder && !onAction) setOpen(id, !open);
        onAction?.(info.item);
        break;
      case " ":
        if (!multi) select(id, "replace");
        else select(id, event.shiftKey ? "range" : "toggle");
        break;
      case "*": {
        // Opens every sibling folder at this level, as the tree pattern asks
        const siblings = info.parentId ? (nodes.get(info.parentId)?.item.children ?? []) : items;
        const toOpen = siblings.filter((s) => s.children && !openSet.has(s.id)).map((s) => s.id);
        if (toOpen.length) setExpanded([...expanded, ...toOpen]);
        break;
      }
      default:
        if ((event.key === "a" || event.key === "A") && (event.metaKey || event.ctrlKey) && multi) {
          setSelected(inTreeOrder(visible.filter((x) => !isDisabled(x))));
          break;
        }
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          // Typeahead: letters typed in quick succession build a prefix; the search starts after the focus
          const now = performance.now();
          const t = typeahead.current;
          t.text = now - t.at > 600 ? event.key.toLowerCase() : t.text + event.key.toLowerCase();
          t.at = now;
          const ordered = [...visible.slice(index + (t.text.length === 1 ? 1 : 0)), ...visible.slice(0, index + 1)];
          const match = ordered.find((x) => nodes.get(x)?.item.name.toLowerCase().startsWith(t.text));
          if (match) focusItem(match);
          break;
        }
        handled = false;
    }
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const onRowClick = (event: React.MouseEvent, id: string) => {
    setFocusedId(id);
    setFocusVisible(false);
    if (isDisabled(id)) return;
    const multi = selectionMode === "multiple";
    if (multi && event.shiftKey) select(id, "range");
    else if (multi && (event.metaKey || event.ctrlKey)) select(id, "toggle");
    else {
      select(id, "replace");
      if (expandOnClick && isFolder(id)) setOpen(id, !openSet.has(id));
    }
  };

  const renderList = (list: TreeViewItem[], level: number): React.ReactNode =>
    list.map((item) => {
      const info = nodes.get(item.id);
      const folder = Boolean(item.children);
      const open = openSet.has(item.id);
      const isSelected = selectedSet.has(item.id);
      const focused = focusVisible && focusedId === item.id;
      const Icon = folder ? (open ? FolderOpen : Folder) : iconForName(item.name);
      const custom = item.icon;
      const actions = renderActions?.(item);

      return (
        <li
          key={item.id}
          ref={(node) => {
            if (node) rowRefs.current.set(item.id, node);
            else rowRefs.current.delete(item.id);
          }}
          role="treeitem"
          aria-level={level}
          aria-posinset={info?.posinset}
          aria-setsize={info?.setsize}
          aria-expanded={folder ? open : undefined}
          aria-selected={selectionMode === "none" ? undefined : isSelected}
          aria-disabled={item.disabled || undefined}
          tabIndex={tabStop === item.id ? 0 : -1}
          onKeyDown={(event) => onKeyDown(event, item.id)}
          onFocus={(event) => {
            if (event.target !== event.currentTarget) return;
            setFocusedId(item.id);
            setFocusVisible(event.currentTarget.matches(":focus-visible"));
          }}
          onBlur={(event) => {
            if (event.target === event.currentTarget) setFocusVisible(false);
          }}
          className="outline-none"
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: the treeitem above owns the keyboard */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer surface for the treeitem */}
          <div
            data-slot="tree-view-row"
            data-selected={isSelected}
            data-focused={focused}
            data-disabled={item.disabled || undefined}
            onClick={(event) => onRowClick(event, item.id)}
            onDoubleClick={() => !item.disabled && onAction?.(item)}
            style={{ paddingInlineStart: `calc(var(--tree-pad) + ${level - 1} * var(--tree-indent))` }}
            className={cn(
              "group/row relative flex h-(--tree-row) cursor-pointer items-center gap-1.5 rounded-lg pe-(--tree-pad) select-none",
              "text-muted-foreground transition-colors duration-150 hover:bg-foreground/5 hover:text-foreground",
              "data-[selected=true]:bg-foreground/[0.08] data-[selected=true]:text-foreground",
              "data-[focused=true]:ring-2 data-[focused=true]:ring-ring/60 data-[focused=true]:ring-inset",
              "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:bg-transparent",
            )}
          >
            <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center">
              {folder && (
                <ChevronRight
                  className={cn("size-3.5 transition-transform duration-300 motion-reduce:transition-none", open && "rotate-90")}
                  style={{ transitionTimingFunction: SPRING_EASE }}
                />
              )}
            </span>
            {icons && (
              <span aria-hidden="true" className="flex size-(--tree-icon) shrink-0 items-center justify-center [&>svg]:size-full">
                {custom === undefined || custom === null ? <Icon className={cn(folder && "text-foreground/70")} /> : renderIcon(custom)}
              </span>
            )}
            <span className="min-w-0 flex-1 truncate">{item.name}</span>
            {actions && (
              // biome-ignore lint/a11y/noStaticElementInteractions: stops row clicks from reaching the tree
              // biome-ignore lint/a11y/useKeyWithClickEvents: only swallows the click
              <span
                onClick={(event) => event.stopPropagation()}
                onDoubleClick={(event) => event.stopPropagation()}
                className="ms-auto flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/row:opacity-100 group-data-[focused=true]/row:opacity-100 group-data-[selected=true]/row:opacity-100 focus-within:opacity-100"
              >
                {actions}
              </span>
            )}
          </div>
          {folder && (
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="min-h-0 overflow-hidden">
                {mounted.has(item.id) && (item.children?.length ?? 0) > 0 && (
                  <ul
                    role="group"
                    inert={!open}
                    data-active={activePath.has(item.id)}
                    className={cn(
                      "relative",
                      guides &&
                        "before:pointer-events-none before:absolute before:inset-y-0.5 before:start-(--tree-guide) before:w-px before:bg-border before:transition-colors data-[active=true]:before:bg-foreground/35",
                    )}
                    style={
                      guides
                        ? ({
                            "--tree-guide": `calc(var(--tree-pad) + ${level - 1} * var(--tree-indent) + 0.5rem - 0.5px)`,
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    {renderList(item.children ?? [], level + 1)}
                  </ul>
                )}
              </div>
            </div>
          )}
        </li>
      );
    });

  return (
    <ul
      role="tree"
      aria-label={ariaLabel}
      aria-multiselectable={selectionMode === "multiple" || undefined}
      data-slot="tree-view"
      className={cn(
        "flex w-full flex-col",
        toneStyles[tone],
        sizeStyles[size],
        className,
      )}
    >
      {renderList(items, 1)}
    </ul>
  );
}
