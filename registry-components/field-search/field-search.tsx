"use client";

import { Clock, LoaderCircle, Search, X } from "lucide-react";
import * as React from "react";
import { KbdCombo } from "@/components/beste/component/kbd-combo";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Field surface. */
type Tone = "muted" | "outline" | "ghost";

/** Field height and type size. `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export interface FieldSearchProps {
  /** The query, controlled. */
  value?: string;
  /** @defaultValue "" */
  defaultValue?: string;
  /** Every keystroke. */
  onValueChange?: (value: string) => void;
  /** The query once typing pauses for `debounce` ms, and at once on Enter or a picked recent search. */
  onSearch?: (query: string) => void;
  /** Milliseconds of quiet before `onSearch`. @defaultValue 250 */
  debounce?: number;
  /** Shows a spinner in place of the search icon. */
  loading?: boolean;
  /** Focuses the field from anywhere on the page; `false` turns it off. @defaultValue "mod+k" */
  shortcut?: string | false;
  /** Remembers searches under this localStorage key and offers them while the field is empty. */
  storageKey?: string;
  /** Recent searches used until the reader has any of their own. */
  defaultRecent?: string[];
  /** @defaultValue 5 */
  maxRecent?: number;
  /** @defaultValue "Search" */
  placeholder?: string;
  /** @defaultValue "Search" */
  "aria-label"?: string;
  /** Words used by the component, for translation. */
  labels?: Partial<typeof DEFAULT_LABELS>;
  name?: string;
  disabled?: boolean;
  /** @defaultValue "outline" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  className?: string;
}

const DEFAULT_LABELS = {
  recent: "Recent searches",
  clearAll: "Clear all",
  clear: "Clear search",
  remove: "Remove",
};

export const fieldSearchDemo: FieldSearchProps = {
  placeholder: "Search songs and venues",
  storageKey: "beste-field-search-demo",
  defaultRecent: ["Nils Frahm", "Royal Albert Hall", "Says"],
  onSearch: (query) => console.log("Search", query),
  className: "w-full max-w-md",
};

const toneStyles: Record<Tone, string> = {
  muted: "border-transparent bg-muted shadow-none dark:bg-muted",
  outline: "border-input bg-background",
  ghost: "border-transparent bg-transparent shadow-none hover:bg-muted/60 dark:bg-transparent",
};

const sizeStyles: Record<Size, { field: string; text: string; icon: string; pad: string }> = {
  sm: { field: "h-8 rounded-md", text: "text-sm", icon: "size-4", pad: "px-2.5" },
  default: { field: "h-10 rounded-lg", text: "text-sm", icon: "size-4", pad: "px-3" },
  // shadcn's Input drops to text-sm from md up, so the large size restates its own size there
  lg: { field: "h-12 rounded-xl", text: "text-base md:text-base", icon: "size-5", pad: "px-3.5" },
};

function readRecent(key: string): string[] | null {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : null;
  } catch {
    return null;
  }
}

function writeRecent(key: string, items: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Private mode or a full quota: recent searches just last for this visit
  }
}

/**
 * A search field: debounced search, a shortcut that focuses it from anywhere, a clear button,
 * a spinner while results load and a list of recent searches while it is empty.
 */
export function FieldSearch({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSearch,
  debounce = 250,
  loading = false,
  shortcut = "mod+k",
  storageKey,
  defaultRecent = [],
  maxRecent = 5,
  placeholder = "Search",
  "aria-label": ariaLabel = "Search",
  labels: labelsProp,
  name,
  disabled = false,
  tone = "outline",
  size = "default",
  className,
}: FieldSearchProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const [focused, setFocused] = React.useState(false);
  const [recent, setRecent] = React.useState<string[]>(defaultRecent);
  const [listOpen, setListOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const timer = React.useRef(0);
  const lastSearched = React.useRef(value);
  const searchRef = React.useRef(onSearch);
  searchRef.current = onSearch;
  const listId = React.useId();

  // Stored searches are read after mount, so the server and the first paint agree
  React.useEffect(() => {
    if (!storageKey) return;
    const stored = readRecent(storageKey);
    if (stored) setRecent(stored.slice(0, maxRecent));
  }, [storageKey, maxRecent]);

  const setValue = (next: string) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };

  const run = React.useCallback((query: string) => {
    window.clearTimeout(timer.current);
    if (query === lastSearched.current) return;
    lastSearched.current = query;
    searchRef.current?.(query);
  }, []);

  // Debounced search; the value on mount counts as already searched
  React.useEffect(() => {
    if (value === lastSearched.current) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => run(value), Math.max(0, debounce));
    return () => window.clearTimeout(timer.current);
  }, [value, debounce, run]);

  const remember = (query: string) => {
    const trimmed = query.trim();
    if (!storageKey || !trimmed) return;
    setRecent((items) => {
      const next = [trimmed, ...items.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, maxRecent);
      writeRecent(storageKey, next);
      return next;
    });
  };

  const removeRecent = (item: string) => {
    setRecent((items) => {
      const next = items.filter((entry) => entry !== item);
      if (storageKey) writeRecent(storageKey, next);
      return next;
    });
    setActive(-1);
    inputRef.current?.focus();
  };

  const clearRecent = () => {
    setRecent([]);
    if (storageKey) writeRecent(storageKey, []);
    setActive(-1);
    inputRef.current?.focus();
  };

  const pick = (item: string) => {
    setValue(item);
    run(item);
    remember(item);
    setListOpen(false);
    setActive(-1);
    inputRef.current?.focus();
  };

  const showList = Boolean(storageKey) && listOpen && focused && value === "" && recent.length > 0 && !disabled;

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && showList) {
      event.preventDefault();
      setActive((index) => (index + 1) % recent.length);
    } else if (event.key === "ArrowUp" && showList) {
      event.preventDefault();
      setActive((index) => (index <= 0 ? recent.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      const chosen = showList && active >= 0 ? recent[active] : undefined;
      if (chosen !== undefined) {
        event.preventDefault();
        pick(chosen);
      } else if (value.trim()) {
        run(value);
        remember(value);
      }
    } else if (event.key === "Delete" && showList && active >= 0) {
      const item = recent[active];
      if (item !== undefined) {
        event.preventDefault();
        removeRecent(item);
      }
    } else if (event.key === "Escape") {
      // Closes the list, then clears the query, then lets go of the field
      event.preventDefault();
      if (showList) setListOpen(false);
      else if (value) setValue("");
      else inputRef.current?.blur();
    }
  };

  const s = sizeStyles[size];
  const activeId = showList && active >= 0 ? `${listId}-option-${active}` : undefined;

  return (
    <div data-slot="field-search" data-loading={loading || undefined} className={cn("relative", className)}>
      <div className="relative">
        <span aria-hidden="true" className={cn("pointer-events-none absolute inset-y-0 left-0 grid place-items-center text-muted-foreground", s.pad)}>
          {loading ? <LoaderCircle className={cn(s.icon, "motion-safe:animate-spin")} /> : <Search className={s.icon} />}
        </span>
        <Input
          ref={inputRef}
          type="search"
          name={name}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          role={storageKey ? "combobox" : undefined}
          aria-label={ariaLabel}
          aria-busy={loading || undefined}
          aria-expanded={storageKey ? showList : undefined}
          aria-controls={storageKey ? listId : undefined}
          aria-autocomplete={storageKey ? "list" : undefined}
          aria-activedescendant={activeId}
          onChange={(event) => {
            setValue(event.target.value);
            setListOpen(true);
            setActive(-1);
          }}
          onFocus={() => {
            setFocused(true);
            setListOpen(true);
          }}
          onBlur={() => {
            setFocused(false);
            setListOpen(false);
            setActive(-1);
          }}
          onKeyDown={onKeyDown}
          className={cn(
            "w-full pr-24 [&::-webkit-search-cancel-button]:appearance-none",
            "pl-[calc(var(--field-search-icon)+--spacing(5))]",
            toneStyles[tone],
            s.field,
            s.text,
          )}
          style={{ "--field-search-icon": size === "lg" ? "1.25rem" : "1rem" } as React.CSSProperties}
        />
        {/* The hint and the clear button share one slot, so the field keeps its padding whichever shows */}
        <span className={cn("absolute inset-y-0 right-0 inline-grid place-items-center", s.pad)}>
          {shortcut && (
            <KbdCombo
              keys={shortcut}
              size="sm"
              tone="outline"
              enabled={!disabled}
              onTrigger={() => inputRef.current?.focus()}
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-200",
                focused || value ? "pointer-events-none opacity-0" : "opacity-100",
              )}
            />
          )}
          {value && !disabled && (
            <button
              type="button"
              aria-label={labels.clear}
              // Keeps focus in the field so clearing does not close the list
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setValue("");
                inputRef.current?.focus();
              }}
              className="col-start-1 row-start-1 grid size-7 cursor-pointer place-items-center justify-self-end rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </span>
      </div>

      {storageKey && (
        <div
          className={cn(
            // Concentric corners: the row's 8px plus the 6px padding plus the 1px border
            "absolute inset-x-0 top-full z-20 mt-1.5 origin-top rounded-[15px] border border-border bg-popover p-1.5 text-popover-foreground shadow-lg",
            "transition-[opacity,scale] duration-200",
            showList ? "scale-100 opacity-100" : "pointer-events-none scale-[0.98] opacity-0",
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
          // Presses inside the list must not blur the field before they land
          onMouseDown={(event) => event.preventDefault()}
        >
          <div className="flex items-center justify-between px-2 pt-0.5 pb-1">
            <span className="select-none text-sm text-muted-foreground">{labels.recent}</span>
            <button
              type="button"
              tabIndex={-1}
              onClick={clearRecent}
              className="cursor-pointer select-none rounded-md px-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {labels.clearAll}
            </button>
          </div>
          <ul id={listId} role="listbox" aria-label={labels.recent}>
            {recent.map((item, index) => (
              <li
                key={item}
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={index === active}
                data-active={index === active || undefined}
                onClick={() => pick(item)}
                onPointerMove={() => setActive(index)}
                className="group/recent flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm data-[active=true]:bg-muted"
              >
                <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate" title={item}>
                  {item}
                </span>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={`${labels.remove} ${item}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeRecent(item);
                  }}
                  className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover/recent:opacity-100 group-data-[active=true]/recent:opacity-100"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
