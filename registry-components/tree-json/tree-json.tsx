"use client";

import { Check, ChevronRight, Copy, Link2, Search, X } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Surface of the viewer. Mirrors the tree family. */
type Tone = "muted" | "outline" | "ghost";

/** Row size preset. Mirrors the tree family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

type Kind = "object" | "array" | "string" | "number" | "boolean" | "null";

export interface TreeJsonProps {
  /** Any JSON value: an object, an array or a single value. */
  data: unknown;
  /** Name of the root, and the start of every copied path. */
  rootName?: string;
  /** Levels open on first render; 1 opens only the root. */
  expandDepth?: number;
  /** Open paths, controlled. Paths look like `data.tours[2].city`. */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (paths: string[]) => void;
  /** A search field above the tree that highlights matches and opens their parents. */
  searchable?: boolean;
  /** The search text, controlled. */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** Array items shown at a time; the rest wait behind a "Show more" row. */
  chunkSize?: number;
  /** Copy value and copy path buttons on each row. */
  copyable?: boolean;
  onCopy?: (text: string, what: "value" | "path", path: string) => void;
  tone?: Tone;
  size?: Size;
  className?: string;
  "aria-label"?: string;
}

export const treeJsonDemo: TreeJsonProps = {
  "aria-label": "Tour data",
  rootName: "data",
  expandDepth: 2,
  chunkSize: 6,
  searchable: true,
  data: {
    artist: "Joni Mitchell",
    tour: "Blue, Revisited",
    year: 2026,
    onSale: true,
    support: null,
    manager: { name: "Elliot Roberts", email: "hello@beste.co", phone: "+1 310 555 0142" },
    dates: [
      { city: "Paris", venue: "La Cigale", date: "2026-10-02", capacity: 1389, soldOut: true },
      { city: "Lisbon", venue: "Coliseu dos Recreios", date: "2026-10-05", capacity: 4000, soldOut: false },
      { city: "Reykjavík", venue: "Harpa", date: "2026-10-09", capacity: 1800, soldOut: true },
      { city: "Berlin", venue: "Tempodrom", date: "2026-10-12", capacity: 3700, soldOut: false },
    ],
    setlist: [
      "All I Want",
      "My Old Man",
      "Little Green",
      "Carey",
      "Blue",
      "California",
      "This Flight Tonight",
      "River",
      "A Case of You",
      "The Last Time I Saw Richard",
      "Both Sides Now",
      "Big Yellow Taxi",
    ],
    band: [
      { name: "Brandi Carlile", role: "vocals, guitar" },
      { name: "Herbie Hancock", role: "piano" },
      { name: "Wayne Shorter", role: "saxophone" },
    ],
    rider: { "green room": { tea: "chamomile", flowers: false }, piano: "Steinway D" },
  },
  className: "w-full max-w-xl",
};

const toneStyles: Record<Tone, string> = {
  muted: "rounded-xl bg-muted p-1.5",
  outline: "rounded-xl border border-border p-1.5",
  ghost: "",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-sm [--tree-indent:--spacing(3.5)] [--tree-pad:--spacing(1.5)] [--tree-py:--spacing(1)]",
  default: "text-sm [--tree-indent:--spacing(4)] [--tree-pad:--spacing(2)] [--tree-py:--spacing(1.5)]",
  lg: "text-base [--tree-indent:--spacing(5)] [--tree-pad:--spacing(2.5)] [--tree-py:--spacing(2)]",
};

/** Value colors by type; each pair keeps its contrast on light and dark themes. */
const kindStyles: Record<Kind, string> = {
  string: "text-emerald-700 dark:text-emerald-400",
  number: "text-sky-700 dark:text-sky-400",
  boolean: "text-violet-700 dark:text-violet-400",
  null: "italic text-muted-foreground",
  object: "text-muted-foreground",
  array: "text-muted-foreground",
};

// Same spring as inspector-slider, for the chevron
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

const MORE = "\u0000more";

export function kindOf(value: unknown): Kind {
  if (value === null || value === undefined) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "object";
  if (typeof value === "string") return "string";
  if (typeof value === "number" || typeof value === "bigint") return "number";
  if (typeof value === "boolean") return "boolean";
  return "null";
}

const isContainer = (kind: Kind) => kind === "object" || kind === "array";

function entriesOf(value: unknown): [string | number, unknown][] {
  if (Array.isArray(value)) return value.map((item, index) => [index, item]);
  if (kindOf(value) === "object") return Object.entries(value as Record<string, unknown>);
  return [];
}

/** The path of a child, the way you would write it in code: `.key`, `["odd key"]` or `[2]`. */
export function jsonPath(parent: string, key: string | number) {
  if (typeof key === "number") return `${parent}[${key}]`;
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${parent}.${key}` : `${parent}[${JSON.stringify(key)}]`;
}

const writeValue = (value: unknown, kind: Kind) =>
  kind === "string" ? JSON.stringify(value) : kind === "null" ? "null" : String(value);

const copyText = (value: unknown, kind: Kind) =>
  kind === "string" ? String(value) : isContainer(kind) ? JSON.stringify(value, null, 2) : writeValue(value, kind);

const preview = (value: unknown, kind: Kind) => {
  const count = entriesOf(value).length;
  return kind === "array" ? `[${count} ${count === 1 ? "item" : "items"}]` : `{${count} ${count === 1 ? "key" : "keys"}}`;
};

/** Every container path open from the root down to `depth` levels. */
function pathsToDepth(data: unknown, root: string, depth: number) {
  const out: string[] = [];
  const walk = (value: unknown, path: string, level: number) => {
    if (level > depth || !isContainer(kindOf(value))) return;
    out.push(path);
    for (const [key, child] of entriesOf(value)) walk(child, jsonPath(path, key), level + 1);
  };
  walk(data, root, 1);
  return out;
}

function useControllable<T>(value: T | undefined, fallback: () => T, onChange?: (next: T) => void) {
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

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const lower = text.toLowerCase();
  const parts: React.ReactNode[] = [];
  let from = 0;
  let at = lower.indexOf(query);
  while (at !== -1) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(
      <mark key={at} className="rounded-[0.2em] bg-amber-400/30 py-[0.05em] text-inherit dark:bg-amber-300/25">
        {text.slice(at, at + query.length)}
      </mark>,
    );
    from = at + query.length;
    at = lower.indexOf(query, from);
  }
  if (from < text.length) parts.push(text.slice(from));
  return <>{parts}</>;
}

interface RowInfo {
  path: string;
  parent: string | null;
  kind: Kind;
  value: unknown;
}

/**
 * A JSON viewer on the tree family's pattern: objects and arrays open and close with a height
 * animation, values are colored by type, long arrays come in chunks, a search highlights matches
 * and opens their parents, and every row can copy its value or its path.
 */
export function TreeJson({
  data,
  rootName = "data",
  expandDepth = 1,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  searchable = false,
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  chunkSize = 100,
  copyable = true,
  onCopy,
  tone = "ghost",
  size = "default",
  className,
  "aria-label": ariaLabel = "JSON",
}: TreeJsonProps) {
  const [expanded, setExpanded] = useControllable(
    expandedProp,
    () => defaultExpanded ?? pathsToDepth(data, rootName, expandDepth),
    onExpandedChange,
  );
  const [search, setSearch] = useControllable(searchProp, () => defaultSearch, onSearchChange);
  const query = search.trim().toLowerCase();
  const chunk = Math.max(1, Math.round(chunkSize));
  const [limits, setLimits] = React.useState<Record<string, number>>({});

  // Matches, their parents to open and how far each array must show to reveal them
  const found = React.useMemo(() => {
    const matches = new Set<string>();
    const forced = new Set<string>();
    const reach: Record<string, number> = {};
    if (!query) return { matches, forced, reach };
    const walk = (value: unknown, path: string, key: string | number | null, ancestors: [string, number | null][]) => {
      const kind = kindOf(value);
      const keyHit = key !== null && typeof key === "string" && key.toLowerCase().includes(query);
      const valueHit = !isContainer(kind) && writeValue(value, kind).toLowerCase().includes(query);
      if (keyHit || valueHit) {
        matches.add(path);
        for (const [ancestor, index] of ancestors) {
          forced.add(ancestor);
          if (index !== null) reach[ancestor] = Math.max(reach[ancestor] ?? 0, index + 1);
        }
      }
      if (!isContainer(kind)) return;
      const array = kind === "array";
      // Each ancestor records the child the match lies under, so a chunked array can reach it
      for (const [childKey, child] of entriesOf(value)) {
        walk(child, jsonPath(path, childKey), childKey, [...ancestors, [path, array && typeof childKey === "number" ? childKey : null]]);
      }
    };
    walk(data, rootName, null, []);
    return { matches, forced, reach };
  }, [data, rootName, query]);

  const openSet = React.useMemo(() => {
    const set = new Set(expanded);
    for (const path of found.forced) set.add(path);
    return set;
  }, [expanded, found]);

  const limitFor = (path: string, total: number) => {
    const shown = limits[path] ?? chunk;
    const needed = found.reach[path] ?? 0;
    return Math.min(total, Math.max(shown, Math.ceil(needed / chunk) * chunk));
  };

  // Rows in reading order through open containers, for the keyboard; the "more" rows count too
  const { visible, info } = React.useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, RowInfo>();
    const walk = (value: unknown, path: string, parent: string | null) => {
      const kind = kindOf(value);
      order.push(path);
      map.set(path, { path, parent, kind, value });
      if (!isContainer(kind) || !openSet.has(path)) return;
      const entries = entriesOf(value);
      const count = kind === "array" ? limitFor(path, entries.length) : entries.length;
      for (const [key, child] of entries.slice(0, count)) walk(child, jsonPath(path, key), path);
      if (count < entries.length) {
        order.push(path + MORE);
        map.set(path + MORE, { path: path + MORE, parent: path, kind: "null", value: null });
      }
    };
    walk(data, rootName, null);
    return { visible: order, info: map };
    // limitFor reads `limits`, `found` and `chunk`
  }, [data, rootName, openSet, limits, found, chunk]);

  // Containers mount the first time they open and stay, so closing can animate
  const [mounted, setMounted] = React.useState<Set<string>>(() => new Set(openSet));
  React.useEffect(() => {
    setMounted((prev) => {
      const missing = [...openSet].filter((path) => !prev.has(path));
      if (missing.length === 0) return prev;
      const next = new Set(prev);
      for (const path of missing) next.add(path);
      return next;
    });
  }, [openSet]);

  const rowRefs = React.useRef(new Map<string, HTMLLIElement>());
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState<string | null>(null);
  const [focusVisible, setFocusVisible] = React.useState(false);
  const [copied, setCopied] = React.useState<{ path: string; what: "value" | "path" } | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const copyTimer = React.useRef(0);
  React.useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const tabStop = focused && visible.includes(focused) ? focused : ([...found.matches].find((path) => visible.includes(path)) ?? visible[0] ?? null);

  const focusRow = (path: string | null | undefined) => {
    if (!path) return;
    setFocused(path);
    rowRefs.current.get(path)?.focus();
  };

  const setOpen = (path: string, open: boolean) => {
    if (open ? openSet.has(path) : !expanded.includes(path)) return;
    setExpanded(open ? [...expanded, path] : expanded.filter((p) => p !== path));
  };

  const showMore = (path: string) => {
    const row = info.get(path);
    if (!row) return;
    const total = entriesOf(row.value).length;
    setLimits((prev) => ({ ...prev, [path]: Math.min(total, limitFor(path, total) + chunk) }));
  };

  const copy = async (path: string, what: "value" | "path") => {
    const row = info.get(path);
    if (!row) return;
    const text = what === "path" ? path : copyText(row.value, row.kind);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access can be refused; the callback still gets the text
    }
    onCopy?.(text, what, path);
    setCopied({ path, what });
    setAnnouncement(what === "path" ? `Copied path ${path}` : "Copied value");
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(null), 1400);
  };

  const onKeyDown = (event: React.KeyboardEvent, path: string) => {
    // Keys pressed on a row's own buttons stay theirs
    if (event.target !== event.currentTarget) return;
    const row = info.get(path);
    if (!row) return;
    const index = visible.indexOf(path);
    const more = path.endsWith(MORE);
    const container = !more && isContainer(row.kind);
    const open = openSet.has(path);
    let handled = true;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "c" && !more) {
      void copy(path, event.shiftKey ? "path" : "value");
    } else {
      switch (event.key) {
        case "ArrowDown":
          focusRow(visible[Math.min(visible.length - 1, index + 1)]);
          break;
        case "ArrowUp":
          if (index === 0 && searchable) searchRef.current?.focus();
          else focusRow(visible[Math.max(0, index - 1)]);
          break;
        case "ArrowRight":
          if (container && !open) setOpen(path, true);
          else if (container && open) focusRow(visible[index + 1]);
          break;
        case "ArrowLeft":
          if (container && open) setOpen(path, false);
          else focusRow(row.parent);
          break;
        case "Home":
          focusRow(visible[0]);
          break;
        case "End":
          focusRow(visible[visible.length - 1]);
          break;
        case "Enter":
        case " ":
          if (more && row.parent) showMore(row.parent);
          else if (container) setOpen(path, !open);
          break;
        case "*": {
          // Opens every sibling container at this level, as the tree pattern asks
          const parent = row.parent ? info.get(row.parent) : null;
          const siblings = parent ? entriesOf(parent.value).map(([key]) => jsonPath(parent.path, key)) : [path];
          const toOpen = siblings.filter((p) => isContainer(info.get(p)?.kind ?? "null") && !openSet.has(p));
          if (toOpen.length) setExpanded([...expanded, ...toOpen]);
          break;
        }
        default:
          handled = false;
      }
    }
    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const rowClass = (focusedRow: boolean) =>
    cn(
      "group/row relative flex cursor-pointer items-start gap-1.5 rounded-lg py-(--tree-py) pe-(--tree-pad)",
      "transition-colors duration-150 hover:bg-foreground/5",
      focusedRow && "ring-2 ring-ring/60 ring-inset",
    );

  const renderNode = (value: unknown, key: string | number | null, path: string, level: number, posinset: number, setsize: number): React.ReactNode => {
    const kind = kindOf(value);
    const container = isContainer(kind);
    const open = openSet.has(path);
    const entries = container ? entriesOf(value) : [];
    const count = kind === "array" ? limitFor(path, entries.length) : entries.length;
    const isMatch = found.matches.has(path);
    const focusedRow = focusVisible && focused === path;
    const keyText = key === null ? rootName : String(key);

    return (
      <li
        key={path}
        ref={(node) => {
          if (node) rowRefs.current.set(path, node);
          else rowRefs.current.delete(path);
        }}
        role="treeitem"
        aria-level={level}
        aria-posinset={posinset}
        aria-setsize={setsize}
        aria-expanded={container ? open : undefined}
        aria-label={`${keyText}: ${container ? preview(value, kind) : writeValue(value, kind)}`}
        tabIndex={tabStop === path ? 0 : -1}
        onKeyDown={(event) => onKeyDown(event, path)}
        onFocus={(event) => {
          if (event.target !== event.currentTarget) return;
          setFocused(path);
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
          data-slot="tree-json-row"
          data-match={isMatch || undefined}
          data-focused={focusedRow || undefined}
          onClick={() => {
            setFocused(path);
            setFocusVisible(false);
            if (container) setOpen(path, !open);
          }}
          style={{ paddingInlineStart: `calc(var(--tree-pad) + ${level - 1} * var(--tree-indent))` }}
          className={cn(rowClass(focusedRow), "data-[match]:bg-amber-400/[0.08]")}
        >
          <span aria-hidden="true" className="flex h-[1lh] w-4 shrink-0 items-center justify-center text-muted-foreground">
            {container && (
              <ChevronRight
                className={cn("size-3.5 transition-transform duration-300 motion-reduce:transition-none", open && "rotate-90")}
                style={{ transitionTimingFunction: SPRING_EASE }}
              />
            )}
          </span>
          <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
            <span className={cn("select-none", typeof key === "number" ? "text-muted-foreground tabular-nums" : "font-medium text-foreground/85")}>
              <Highlight text={keyText} query={typeof key === "number" ? "" : query} />
            </span>
            <span className="select-none text-muted-foreground">: </span>
            {container ? (
              <span className={cn("select-none tabular-nums transition-opacity duration-200", kindStyles[kind], open && "opacity-60")}>
                {preview(value, kind)}
              </span>
            ) : (
              <span className={cn("select-text tabular-nums", kindStyles[kind])}>
                <Highlight text={writeValue(value, kind)} query={query} />
              </span>
            )}
          </span>
          {copyable && (
            // biome-ignore lint/a11y/noStaticElementInteractions: stops the buttons' clicks from reaching the row
            // biome-ignore lint/a11y/useKeyWithClickEvents: only swallows the click
            <span
              onClick={(event) => event.stopPropagation()}
              className="flex h-[1lh] shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover/row:opacity-100 group-data-[focused]/row:opacity-100"
            >
              {(["value", "path"] as const).map((what) => {
                const done = copied?.path === path && copied.what === what;
                const Icon = done ? Check : what === "value" ? Copy : Link2;
                return (
                  <button
                    key={what}
                    type="button"
                    tabIndex={-1}
                    aria-label={what === "value" ? `Copy value of ${keyText}` : `Copy path ${path}`}
                    title={what === "value" ? "Copy value" : "Copy path"}
                    onClick={() => void copy(path, what)}
                    className="grid size-6 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                  >
                    <Icon className={cn("size-3.5", done && "text-emerald-600 dark:text-emerald-400")} />
                  </button>
                );
              })}
            </span>
          )}
        </div>
        {container && entries.length > 0 && (
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
          >
            <div className="min-h-0 overflow-hidden">
              {(mounted.has(path) || open) && (
                <ul
                  role="group"
                  inert={!open}
                  className="relative before:pointer-events-none before:absolute before:inset-y-0.5 before:start-(--json-guide) before:w-px before:bg-border"
                  style={{ "--json-guide": `calc(var(--tree-pad) + ${level - 1} * var(--tree-indent) + 0.5rem - 0.5px)` } as React.CSSProperties}
                >
                  {entries.slice(0, count).map(([childKey, child], index) =>
                    renderNode(child, childKey, jsonPath(path, childKey), level + 1, index + 1, entries.length),
                  )}
                  {count < entries.length && renderMore(path, level + 1, entries.length - count)}
                </ul>
              )}
            </div>
          </div>
        )}
      </li>
    );
  };

  const renderMore = (path: string, level: number, left: number) => {
    const id = path + MORE;
    const next = Math.min(chunk, left);
    return (
      <li
        key={id}
        ref={(node) => {
          if (node) rowRefs.current.set(id, node);
          else rowRefs.current.delete(id);
        }}
        role="treeitem"
        aria-level={level}
        aria-label={`Show ${next} more, ${left} left`}
        tabIndex={tabStop === id ? 0 : -1}
        onKeyDown={(event) => onKeyDown(event, id)}
        onFocus={(event) => {
          setFocused(id);
          setFocusVisible(event.currentTarget.matches(":focus-visible"));
        }}
        onBlur={() => setFocusVisible(false)}
        className="outline-none"
      >
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: the treeitem above owns the keyboard */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer surface for the treeitem */}
        <div
          onClick={() => showMore(path)}
          style={{ paddingInlineStart: `calc(var(--tree-pad) + ${level - 1} * var(--tree-indent) + 1.375rem)` }}
          className={cn(rowClass(focusVisible && focused === id), "select-none text-muted-foreground hover:text-foreground")}
        >
          Show {next} more <span className="tabular-nums">({left} left)</span>
        </div>
      </li>
    );
  };

  const matchCount = found.matches.size;

  return (
    <div data-slot="tree-json" className={cn("flex w-full flex-col gap-2", toneStyles[tone], sizeStyles[size], className)}>
      {searchable && (
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || (event.key === "Enter" && matchCount > 0)) {
                event.preventDefault();
                focusRow([...found.matches].find((path) => visible.includes(path)) ?? visible[0]);
              } else if (event.key === "Escape" && search) {
                event.preventDefault();
                setSearch("");
              }
            }}
            placeholder="Search keys and values"
            aria-label="Search keys and values"
            className="h-9 bg-background px-8 [&::-webkit-search-cancel-button]:hidden"
          />
          {search && (
            <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-1">
              <span aria-live="polite" className="select-none whitespace-nowrap text-sm text-muted-foreground tabular-nums">
                {matchCount === 0 ? "No matches" : `${matchCount} ${matchCount === 1 ? "match" : "matches"}`}
              </span>
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearch("");
                  searchRef.current?.focus();
                }}
                className="grid size-6 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
      <ul role="tree" aria-label={ariaLabel} className="flex flex-col font-mono">
        {renderNode(data, null, rootName, 1, 1, 1)}
      </ul>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
