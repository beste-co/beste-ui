"use client";

import { Search, X } from "lucide-react";
import * as React from "react";
import { KbdCombo, formatCombo } from "@/components/beste/component/kbd-combo";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Surface of the sheet and its caps. */
type Tone = "muted" | "outline" | "ghost";

/** Density preset. Mirrors the inspector family; `sm` still sets text-sm. */
type Size = "sm" | "default" | "lg";

export interface KbdShortcut {
  /** The shortcut as kbd-combo reads it: "mod+k", "shift+/", or "g i" with `sequence`. */
  keys: string | string[];
  /** What it does. */
  label: string;
  /** Pressed one after another instead of together. */
  sequence?: boolean;
}

export interface KbdShortcutGroup {
  title: string;
  shortcuts: KbdShortcut[];
}

export interface KbdSheetProps {
  groups: KbdShortcutGroup[];
  /** Heading of the sheet. */
  title?: string;
  /** A line under the heading. */
  description?: string;
  /** Render in place, for a docs page, instead of as a dialog. */
  inline?: boolean;
  /** Whether the dialog is open, controlled. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Key that opens and closes the dialog from anywhere, ignored while typing. `null` turns it off. @defaultValue "?" */
  trigger?: string | null;
  /** Show the search field. @defaultValue true */
  searchable?: boolean;
  placeholder?: string;
  /** Shown when the search matches nothing. */
  emptyMessage?: string;
  tone?: Tone;
  size?: Size;
  className?: string;
}

export const kbdSheetDemo: KbdSheetProps = {
  title: "Keyboard shortcuts",
  description: "Everything in the studio, without reaching for the mouse.",
  inline: true,
  groups: [
    {
      title: "Playback",
      shortcuts: [
        { keys: "space", label: "Play or pause" },
        { keys: "mod+right", label: "Next track" },
        { keys: "mod+left", label: "Previous track" },
        { keys: "shift+up", label: "Volume up" },
        { keys: "shift+down", label: "Volume down" },
        { keys: "m", label: "Mute" },
      ],
    },
    {
      title: "Navigation",
      shortcuts: [
        { keys: "mod+k", label: "Search the library" },
        { keys: ["g", "h"], label: "Go home", sequence: true },
        { keys: ["g", "l"], label: "Go to your library", sequence: true },
        { keys: ["g", "q"], label: "Go to the queue", sequence: true },
      ],
    },
    {
      title: "Library",
      shortcuts: [
        { keys: "mod+s", label: "Save to your library" },
        { keys: "mod+shift+n", label: "New playlist" },
        { keys: "l", label: "Like the current track" },
      ],
    },
    {
      title: "Studio",
      shortcuts: [
        { keys: "r", label: "Arm the selected track for recording" },
        { keys: "mod+z", label: "Undo" },
        { keys: "mod+shift+z", label: "Redo" },
        { keys: "shift+/", label: "Show these shortcuts" },
      ],
    },
  ],
  className: "w-full max-w-2xl",
};

const toneStyles: Record<Tone, string> = {
  muted: "bg-muted/60",
  outline: "border border-border bg-background",
  ghost: "",
};

const sizeStyles: Record<Size, { root: string; title: string; row: string; search: string }> = {
  sm: { root: "gap-4 p-4", title: "text-base", row: "min-h-9 text-sm", search: "h-9 text-sm" },
  default: { root: "gap-5 p-5", title: "text-lg", row: "min-h-10 text-sm", search: "h-10 text-sm" },
  lg: { root: "gap-6 p-6", title: "text-xl", row: "min-h-12 text-base", search: "h-11 text-base" },
};

const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Words a shortcut answers to: its label, the keys as written, and their names on either platform
function haystack(shortcut: KbdShortcut) {
  const raw = Array.isArray(shortcut.keys) ? shortcut.keys.join(" ") : shortcut.keys;
  const names = [true, false].map((apple) => {
    const formatted = formatCombo(shortcut.keys, { apple, sequence: shortcut.sequence });
    return `${formatted.label} ${formatted.text}`;
  });
  return normalize(`${shortcut.label} ${raw} ${names.join(" ")}`);
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const at = normalize(text).indexOf(query);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded-[0.2em] bg-primary/15 py-[0.08em] text-foreground">{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName);
}

/**
 * A keyboard shortcut sheet: groups of kbd-combo caps, a search that matches labels and keys
 * on either platform, in place on a docs page or as a dialog opened with "?".
 */
export function KbdSheet({
  groups,
  title = "Keyboard shortcuts",
  description,
  inline = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger = "?",
  searchable = true,
  placeholder = "Search shortcuts",
  emptyMessage = "No shortcuts match",
  tone = "muted",
  size = "default",
  className,
}: KbdSheetProps) {
  const [openInner, setOpenInner] = React.useState(defaultOpen);
  const open = openProp ?? openInner;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenInner(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );
  const [query, setQuery] = React.useState("");
  const q = normalize(query.trim());
  const searchId = React.useId();

  const indexed = React.useMemo(
    () => groups.map((group) => ({ ...group, shortcuts: group.shortcuts.map((shortcut) => ({ shortcut, words: "" })) })),
    [groups],
  );
  const visible = React.useMemo(() => {
    if (!q) return groups;
    return indexed
      .map((group) => ({
        title: group.title,
        shortcuts: group.shortcuts
          .map((entry) => {
            // Built lazily on the first search, on the client only
            entry.words ||= haystack(entry.shortcut);
            return entry;
          })
          .filter((entry) => entry.words.includes(q) || normalize(group.title).includes(q))
          .map((entry) => entry.shortcut),
      }))
      .filter((group) => group.shortcuts.length > 0);
  }, [q, groups, indexed]);
  const count = visible.reduce((sum, group) => sum + group.shortcuts.length, 0);

  // The trigger key toggles the dialog from anywhere, but never while the reader is typing
  const openRef = React.useRef(open);
  openRef.current = open;
  React.useEffect(() => {
    if (inline || !trigger) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== trigger || event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
      if (isTyping(event.target)) return;
      event.preventDefault();
      setOpen(!openRef.current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inline, trigger, setOpen]);

  // A closed dialog forgets its search
  React.useEffect(() => {
    if (!inline && !open) setQuery("");
  }, [inline, open]);

  const s = sizeStyles[size];
  const capSize = size === "lg" ? "default" : "sm";

  const heading = (
    <div className="flex flex-col gap-1">
      {inline ? (
        <h2 className={cn("select-none font-semibold tracking-tight", s.title)}>{title}</h2>
      ) : (
        <DialogTitle className={cn("select-none font-semibold tracking-tight", s.title)}>{title}</DialogTitle>
      )}
      {description &&
        (inline ? (
          <p className="select-none text-sm text-muted-foreground">{description}</p>
        ) : (
          <DialogDescription className="select-none text-sm text-muted-foreground">{description}</DialogDescription>
        ))}
    </div>
  );

  const body = (
    <>
      {heading}
      {searchable && (
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.stopPropagation();
                setQuery("");
              }
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            autoComplete="off"
            spellCheck={false}
            className={cn(
              "w-full rounded-lg border border-input bg-background pr-9 pl-9 text-foreground outline-none placeholder:text-muted-foreground",
              "focus-visible:ring-2 focus-visible:ring-ring/40 [&::-webkit-search-cancel-button]:hidden",
              s.search,
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear the search"
              className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      {count === 0 ? (
        <p className="select-none py-8 text-center text-sm text-muted-foreground">
          {emptyMessage} “{query.trim()}”
        </p>
      ) : (
        // Balanced columns keep groups of different lengths from leaving holes
        <div className="columns-1 gap-8 sm:columns-2">
          {visible.map((group) => (
            <section key={group.title} aria-label={group.title} className="mb-5 break-inside-avoid last:mb-0">
              <h3 className="mb-1 select-none text-sm font-medium text-muted-foreground">
                <Highlight text={group.title} query={q} />
              </h3>
              <ul className="flex flex-col">
                {group.shortcuts.map((shortcut) => (
                  <li
                    key={`${group.title}-${shortcut.label}`}
                    className={cn(
                      "flex items-center justify-between gap-4 border-b border-foreground/[0.06] py-1.5 last:border-b-0",
                      "motion-safe:transition-opacity motion-safe:duration-200 motion-safe:starting:opacity-0",
                      s.row,
                    )}
                  >
                    <span className="min-w-0 select-none text-foreground">
                      <Highlight text={shortcut.label} query={q} />
                    </span>
                    <KbdCombo keys={shortcut.keys} sequence={shortcut.sequence} tone={tone === "muted" ? "outline" : tone} size={capSize} className="shrink-0" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {q ? `${count} shortcut${count === 1 ? "" : "s"}` : ""}
      </p>
    </>
  );

  if (inline) {
    return (
      <section data-slot="kbd-sheet" aria-label={title} className={cn("flex flex-col rounded-2xl", toneStyles[tone], s.root, className)}>
        {body}
      </section>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        data-slot="kbd-sheet"
        // Radix hears Escape first, in the capture phase; with a search typed it clears the search instead
        onEscapeKeyDown={(event) => {
          if (query) {
            event.preventDefault();
            setQuery("");
          }
        }}
        className={cn("flex max-h-[85svh] flex-col overflow-y-auto sm:max-w-2xl", s.root, className)}
      >
        {body}
      </DialogContent>
    </Dialog>
  );
}
