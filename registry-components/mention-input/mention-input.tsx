"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface of the field. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Text and padding preset. */
type Size = "sm" | "default" | "lg";

export interface MentionItem {
  id: string;
  label: string;
  /** A second line in the list, e.g. a role or handle. */
  description?: string;
  /** An image shown in the list. Initials are used without one. */
  avatar?: string;
}

export interface MentionTrigger {
  /** The character that opens the list, e.g. "@" or "#". */
  char: string;
  /** What can be picked: a list, or a function returning one (sync or async) for a query. */
  items: MentionItem[] | ((query: string) => MentionItem[] | Promise<MentionItem[]>);
  /** Classes for this trigger's chips. */
  chipClassName?: string;
}

export interface MentionRange {
  start: number;
  end: number;
  id: string;
  label: string;
  trigger: string;
}

export interface MentionChange {
  /** The text as the reader sees it. */
  text: string;
  mentions: MentionRange[];
}

export interface MentionInputProps {
  /** Controlled value, as markup: `@[Name](id)`. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, detail: MentionChange) => void;
  /** Triggers and what they offer. @defaultValue one "@" trigger with no items */
  triggers?: MentionTrigger[];
  placeholder?: string;
  /** Lines the field opens at. @defaultValue 2 */
  rows?: number;
  /** Lines it grows to before scrolling. @defaultValue 8 */
  maxRows?: number;
  /** Called with the markup on Enter or Mod+Enter, as `submitKey` says. */
  onSubmit?: (value: string) => void;
  /** @defaultValue "mod+enter" */
  submitKey?: "enter" | "mod+enter";
  /** Most suggestions shown at once. @defaultValue 6 */
  limit?: number;
  disabled?: boolean;
  /** Submits the markup with a form. */
  name?: string;
  /** @defaultValue "muted" */
  tone?: Tone;
  /** @defaultValue "default" */
  size?: Size;
  className?: string;
  "aria-label"?: string;
}

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border bg-background",
  ghost: "border border-transparent has-[textarea:focus-visible]:border-border",
};

const sizeStyles: Record<Size, string> = {
  sm: "rounded-lg px-2.5 py-1.5 text-sm leading-6",
  default: "rounded-xl px-3 py-2 text-sm leading-6",
  lg: "rounded-xl px-4 py-3 text-base leading-7",
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escapeLabel = (s: string) => s.replace(/[\\\]]/g, "\\$&");
const escapeId = (s: string) => s.replace(/[\\)]/g, "\\$&");
const unescape = (s: string) => s.replace(/\\(.)/g, "$1");

/** Reads markup into the visible text and the ranges of its mentions. */
export function parseMentions(markup: string, triggerChars: string[] = ["@"]): MentionChange {
  const chars = triggerChars.map(escapeRe).join("|") || "@";
  const re = new RegExp(`(${chars})\\[((?:\\\\.|[^\\]\\\\])*)\\]\\(((?:\\\\.|[^)\\\\])*)\\)`, "g");
  let text = "";
  const mentions: MentionRange[] = [];
  let last = 0;
  for (const match of markup.matchAll(re)) {
    const index = match.index ?? 0;
    text += markup.slice(last, index);
    const trigger = match[1] ?? "@";
    const label = unescape(match[2] ?? "");
    const start = text.length;
    text += trigger + label;
    mentions.push({ start, end: text.length, id: unescape(match[3] ?? ""), label, trigger });
    last = index + match[0].length;
  }
  text += markup.slice(last);
  return { text, mentions };
}

/** Writes visible text and mention ranges back to markup. */
export function serialize(text: string, mentions: MentionRange[]) {
  let out = "";
  let last = 0;
  for (const m of [...mentions].sort((a, b) => a.start - b.start)) {
    out += text.slice(last, m.start) + `${m.trigger}[${escapeLabel(m.label)}](${escapeId(m.id)})`;
    last = m.end;
  }
  return out + text.slice(last);
}

const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

// Label starts rank first, then word starts, then a match anywhere
function rank(item: MentionItem, query: string): number | null {
  if (!query) return 0;
  const label = fold(item.label);
  const q = fold(query);
  if (!label.includes(q)) return null;
  if (label.startsWith(q)) return 0;
  return label.split(/\s+/).some((word) => word.startsWith(q)) ? 1 : 2;
}

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const MIRRORED = [
  "boxSizing", "width", "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
  "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "fontFamily", "fontSize", "fontWeight",
  "fontStyle", "letterSpacing", "lineHeight", "textTransform", "wordSpacing", "tabSize", "textIndent",
] as const;

// Where the caret sits inside the textarea, measured with a hidden copy of its text
function caretPoint(textarea: HTMLTextAreaElement, index: number) {
  const mirror = document.createElement("div");
  const style = getComputedStyle(textarea);
  for (const key of MIRRORED) mirror.style[key] = style[key];
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.overflowWrap = "break-word";
  mirror.style.top = "0";
  mirror.style.left = "-9999px";
  mirror.textContent = textarea.value.slice(0, index);
  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  mirror.appendChild(marker);
  document.body.appendChild(mirror);
  const point = {
    top: marker.offsetTop - textarea.scrollTop,
    left: marker.offsetLeft - textarea.scrollLeft,
    height: Number.parseFloat(style.lineHeight) || marker.offsetHeight,
  };
  mirror.remove();
  return point;
}

interface Query {
  trigger: MentionTrigger;
  /** Index of the trigger character. */
  start: number;
  /** Caret index. */
  end: number;
  text: string;
}

export const mentionInputDemo: MentionInputProps = {
  placeholder: "Leave a note, @ to mention someone",
  defaultValue: "Mix notes for @[Nina Simone](nina): the piano sits a touch loud in the bridge. ",
  rows: 3,
  triggers: [
    {
      char: "@",
      items: [
        { id: "nina", label: "Nina Simone", description: "Piano and vocals" },
        { id: "miles", label: "Miles Davis", description: "Trumpet" },
        { id: "joni", label: "Joni Mitchell", description: "Guitar and vocals" },
        { id: "fela", label: "Fela Kuti", description: "Saxophone" },
        { id: "bjork", label: "Björk", description: "Vocals and production" },
        { id: "herbie", label: "Herbie Hancock", description: "Keys" },
        { id: "alice", label: "Alice Coltrane", description: "Harp" },
      ],
    },
    {
      char: "#",
      items: [
        { id: "bridge", label: "bridge" },
        { id: "chorus", label: "chorus" },
        { id: "outro", label: "outro" },
        { id: "vocals", label: "vocals" },
      ],
      chipClassName: "bg-muted-foreground/15 text-foreground",
    },
  ],
  className: "w-full max-w-md",
};

export function MentionInput({
  value,
  defaultValue = "",
  onValueChange,
  triggers = [{ char: "@", items: [] }],
  placeholder,
  rows = 2,
  maxRows = 8,
  onSubmit,
  submitKey = "mod+enter",
  limit = 6,
  disabled = false,
  name,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: MentionInputProps) {
  const chars = React.useMemo(() => triggers.map((t) => t.char), [triggers]);
  const [doc, setDoc] = React.useState<MentionChange>(() => parseMentions(value ?? defaultValue, chars));
  const lastEmitted = React.useRef<string>(value ?? defaultValue);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const composing = React.useRef(false);
  const pending = React.useRef<MentionRange | null>(null);
  const suppress = React.useRef(false);
  const dismissed = React.useRef<number | null>(null);
  const [query, setQuery] = React.useState<Query | null>(null);
  const [results, setResults] = React.useState<{ items: MentionItem[]; loading: boolean }>({ items: [], loading: false });
  const [highlight, setHighlight] = React.useState(0);
  const [anchor, setAnchor] = React.useState<{ top: number; left: number; above: boolean } | null>(null);
  const listId = React.useId();

  // A controlled value that is not our own echo replaces the document
  React.useEffect(() => {
    if (value === undefined || value === lastEmitted.current) return;
    lastEmitted.current = value;
    setDoc(parseMentions(value, chars));
  }, [value, chars]);

  const commit = React.useCallback(
    (next: MentionChange) => {
      setDoc(next);
      const markup = serialize(next.text, next.mentions);
      lastEmitted.current = markup;
      onValueChange?.(markup, next);
    },
    [onValueChange],
  );

  // Grow with the text up to maxRows, then scroll
  const grow = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const style = getComputedStyle(el);
    const line = Number.parseFloat(style.lineHeight) || 24;
    const chrome = Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom);
    el.style.height = "auto";
    const next = Math.min(Math.max(el.scrollHeight, line * rows + chrome), line * maxRows + chrome);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > next + 1 ? "auto" : "hidden";
  }, [rows, maxRows]);

  useIsoLayoutEffect(() => {
    grow();
  }, [doc.text, grow]);

  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(grow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [grow]);

  // Find a trigger behind the caret and decide whether the list should be open
  const detect = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el || composing.current || suppress.current || el.selectionStart !== el.selectionEnd) return setQuery(null);
    const caret = el.selectionStart;
    const text = el.value;
    if (doc.mentions.some((m) => caret > m.start && caret <= m.end)) return setQuery(null);
    for (let i = caret - 1; i >= 0 && caret - i <= 40; i--) {
      const ch = text[i] ?? "";
      if (ch === "\n" || doc.mentions.some((m) => i >= m.start && i < m.end)) break;
      const trigger = triggers.find((t) => t.char === ch);
      if (trigger) {
        const before = text[i - 1];
        const q = text.slice(i + 1, caret);
        const boundary = i === 0 || before === undefined || /[\s([{"'“‘]/.test(before);
        if (!boundary || q.includes("  ") || /^\s/.test(q)) break;
        if (dismissed.current === i) return setQuery(null);
        return setQuery((prev) =>
          prev && prev.trigger === trigger && prev.start === i && prev.end === caret && prev.text === q ? prev : { trigger, start: i, end: caret, text: q },
        );
      }
    }
    dismissed.current = null;
    setQuery(null);
  }, [doc.mentions, triggers]);

  // Resolve suggestions for the query, dropping answers that arrive out of order
  const request = React.useRef(0);
  React.useEffect(() => {
    if (!query) return;
    const id = ++request.current;
    const pick = (items: MentionItem[]) =>
      items
        .map((item) => ({ item, r: rank(item, query.text) }))
        .filter((x): x is { item: MentionItem; r: number } => x.r !== null)
        .sort((a, b) => a.r - b.r || a.item.label.localeCompare(b.item.label))
        .slice(0, limit)
        .map((x) => x.item);
    const source = query.trigger.items;
    if (Array.isArray(source)) {
      setResults({ items: pick(source), loading: false });
      return;
    }
    const answer = source(query.text);
    if (Array.isArray(answer)) {
      setResults({ items: pick(answer), loading: false });
      return;
    }
    setResults((prev) => ({ ...prev, loading: true }));
    answer
      .then((items) => {
        if (id === request.current) setResults({ items: items.slice(0, limit), loading: false });
      })
      .catch(() => {
        if (id === request.current) setResults({ items: [], loading: false });
      });
  }, [query, limit]);

  React.useEffect(() => setHighlight(0), [query?.start, query?.text]);

  // Close when a spaced query stops matching anything
  const open = Boolean(query) && !(query?.text.includes(" ") && !results.loading && results.items.length === 0);

  // Anchor the list under the trigger, or above it when there is no room below
  useIsoLayoutEffect(() => {
    const el = textareaRef.current;
    const wrapper = wrapperRef.current;
    if (!open || !query || !el || !wrapper) return setAnchor(null);
    const point = caretPoint(el, query.start);
    const wrapRect = wrapper.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const top = elRect.top - wrapRect.top + point.top;
    const left = Math.min(elRect.left - wrapRect.left + point.left, Math.max(0, wrapRect.width - 256));
    const spaceBelow = window.innerHeight - (elRect.top + point.top + point.height);
    setAnchor({ top: spaceBelow < 260 && elRect.top + point.top > 260 ? top : top + point.height, left, above: spaceBelow < 260 && elRect.top + point.top > 260 });
  }, [open, query]);

  const insert = React.useCallback(
    (item: MentionItem) => {
      const el = textareaRef.current;
      if (!el || !query) return;
      const replacement = `${query.trigger.char}${item.label} `;
      const start = query.start;
      pending.current = { start, end: start + replacement.length - 1, id: item.id, label: item.label, trigger: query.trigger.char };
      el.focus();
      suppress.current = true;
      requestAnimationFrame(() => {
        suppress.current = false;
      });
      el.setSelectionRange(start, query.end);
      // insertText keeps the browser's undo history; the fallback edits the value directly
      const done = typeof document.execCommand === "function" && document.execCommand("insertText", false, replacement);
      if (!done) {
        const text = el.value.slice(0, start) + replacement + el.value.slice(query.end);
        const shift = replacement.length - (query.end - start);
        const mentions = doc.mentions
          .filter((m) => m.end <= start || m.start >= query.end)
          .map((m) => (m.start >= query.end ? { ...m, start: m.start + shift, end: m.end + shift } : m));
        const range = pending.current;
        pending.current = null;
        commit({ text, mentions: range ? [...mentions, range] : mentions });
        requestAnimationFrame(() => el.setSelectionRange(start + replacement.length, start + replacement.length));
      }
      setQuery(null);
    },
    [query, doc.mentions, commit],
  );

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = event.target;
    const next = el.value;
    const old = doc.text;
    const delta = next.length - old.length;
    const caret = el.selectionEnd;

    // The edit ends where the caret is; its old end is the caret less the change in length
    let b = caret - delta;
    let prefix = 0;
    const limitPrefix = Math.min(old.length, next.length);
    while (prefix < limitPrefix && old[prefix] === next[prefix]) prefix++;
    let a = Math.min(prefix, caret, b);
    if (b < a || b > old.length || next.slice(caret) !== old.slice(b) || next.slice(0, a) !== old.slice(0, a)) {
      // Fall back to a plain diff when the caret does not explain the edit
      let suffix = 0;
      while (suffix < limitPrefix - prefix && old[old.length - 1 - suffix] === next[next.length - 1 - suffix]) suffix++;
      a = prefix;
      b = old.length - suffix;
    }
    const mentions = doc.mentions
      .filter((m) => m.end <= a || m.start >= b)
      .map((m) => (m.start >= b ? { ...m, start: m.start + delta, end: m.end + delta } : m));
    const range = pending.current;
    pending.current = null;
    if (range && next.slice(range.start, range.end) === range.trigger + range.label) mentions.push(range);
    commit({ text: next, mentions });
  };

  // Keep the caret out of the middle of a mention
  const snap = () => {
    const el = textareaRef.current;
    if (!el || el.selectionStart !== el.selectionEnd) return;
    const c = el.selectionStart;
    const hit = doc.mentions.find((m) => c > m.start && c < m.end);
    if (hit) {
      const to = c - hit.start < hit.end - c ? hit.start : hit.end;
      el.setSelectionRange(to, to);
    }
  };

  const removeRange = (from: number, to: number) => {
    const el = textareaRef.current;
    if (!el) return;
    el.setSelectionRange(from, to);
    const done = typeof document.execCommand === "function" && document.execCommand("delete");
    if (!done) {
      const text = el.value.slice(0, from) + el.value.slice(to);
      const shift = from - to;
      commit({
        text,
        mentions: doc.mentions.filter((m) => m.end <= from || m.start >= to).map((m) => (m.start >= to ? { ...m, start: m.start + shift, end: m.end + shift } : m)),
      });
      requestAnimationFrame(() => el.setSelectionRange(from, from));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing || composing.current) return;
    const el = event.currentTarget;
    const count = results.items.length;

    if (open && count > 0) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setHighlight((h) => (h + (event.key === "ArrowDown" ? 1 : -1) + count) % count);
        return;
      }
      if ((event.key === "Enter" && !event.shiftKey) || event.key === "Tab") {
        const item = results.items[highlight];
        if (item) {
          event.preventDefault();
          insert(item);
          return;
        }
      }
    }
    if (open && event.key === "Escape") {
      event.preventDefault();
      dismissed.current = query?.start ?? null;
      setQuery(null);
      return;
    }

    const s = el.selectionStart;
    const e = el.selectionEnd;
    // Backspace and Delete take a whole mention, never half of one
    if (event.key === "Backspace" || event.key === "Delete") {
      const touched = doc.mentions.filter((m) =>
        s === e ? (event.key === "Backspace" ? s > m.start && s <= m.end : s >= m.start && s < m.end) : m.start < e && m.end > s,
      );
      if (touched.length > 0) {
        event.preventDefault();
        const from = Math.min(s, ...touched.map((m) => m.start));
        const to = Math.max(e, ...touched.map((m) => m.end));
        removeRange(from, to);
        return;
      }
    }
    // Arrows step over a mention in one press
    if ((event.key === "ArrowLeft" || event.key === "ArrowRight") && s === e && !event.shiftKey && !event.altKey && !event.metaKey) {
      const hit = doc.mentions.find((m) => (event.key === "ArrowLeft" ? s === m.end : s === m.start));
      if (hit) {
        event.preventDefault();
        const to = event.key === "ArrowLeft" ? hit.start : hit.end;
        el.setSelectionRange(to, to);
        return;
      }
    }

    if (event.key === "Enter" && onSubmit) {
      const mod = event.metaKey || event.ctrlKey;
      if ((submitKey === "enter" && !event.shiftKey && !mod) || (submitKey === "mod+enter" && mod)) {
        event.preventDefault();
        onSubmit(serialize(doc.text, doc.mentions));
      }
    }
  };

  const syncScroll = () => {
    if (overlayRef.current && textareaRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // The visible text, drawn behind a transparent textarea so mentions can be tinted
  const pieces: React.ReactNode[] = [];
  let cursor = 0;
  for (const m of [...doc.mentions].sort((x, y) => x.start - y.start)) {
    if (m.start > cursor) pieces.push(doc.text.slice(cursor, m.start));
    const trigger = triggers.find((t) => t.char === m.trigger);
    pieces.push(
      <mark
        key={`${m.start}-${m.id}`}
        data-mention={m.trigger}
        className={cn(
          // Vertical padding only: it never moves a letter and leaves the full space between two chips
          "rounded-[0.25em] bg-primary/12 py-[0.12em] text-primary [box-decoration-break:clone]",
          trigger?.chipClassName,
        )}
      >
        {doc.text.slice(m.start, m.end)}
      </mark>,
    );
    cursor = m.end;
  }
  pieces.push(`${doc.text.slice(cursor)}\u200b`);

  const activeId = open && results.items[highlight] ? `${listId}-${highlight}` : undefined;
  const hl = query?.text ?? "";

  return (
    <div
      ref={wrapperRef}
      data-slot="mention-input"
      data-disabled={disabled || undefined}
      className={cn("relative w-full data-[disabled=true]:opacity-50", className)}
    >
      <div
        className={cn(
          "relative transition-colors focus-within:border-ring/60 has-[textarea:focus-visible]:ring-2 has-[textarea:focus-visible]:ring-ring/30",
          toneStyles[tone],
          sizeStyles[size].split(" ").filter((c) => c.startsWith("rounded")).join(" "),
        )}
      >
        <div
          ref={overlayRef}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words border border-transparent text-foreground [scrollbar-gutter:stable]",
            sizeStyles[size],
          )}
        >
          {doc.text ? pieces : <span className="text-muted-foreground">{placeholder}</span>}
        </div>
        <textarea
          ref={textareaRef}
          value={doc.text}
          rows={rows}
          disabled={disabled}
          aria-label={ariaLabel ?? placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={activeId}
          spellCheck
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={detect}
          onSelect={() => {
            snap();
            detect();
          }}
          onClick={detect}
          onScroll={syncScroll}
          onBlur={() => setQuery(null)}
          onCompositionStart={() => {
            composing.current = true;
          }}
          onCompositionEnd={() => {
            composing.current = false;
            detect();
          }}
          className={cn(
            "relative block w-full resize-none overflow-hidden border border-transparent bg-transparent text-transparent caret-foreground outline-none [scrollbar-gutter:stable] selection:bg-primary/25 selection:text-transparent disabled:cursor-not-allowed",
            sizeStyles[size],
          )}
        />
      </div>

      {name && <input type="hidden" name={name} value={serialize(doc.text, doc.mentions)} />}

      <div aria-live="polite" className="sr-only">
        {open ? (results.loading ? "Searching" : `${results.items.length} suggestion${results.items.length === 1 ? "" : "s"}`) : ""}
      </div>

      {open && anchor && (
        <div
          id={listId}
          role="listbox"
          aria-label="Suggestions"
          data-side={anchor.above ? "top" : "bottom"}
          className={cn(
            // Concentric corners: the option's 8px plus the 4px padding plus the 1px border
            "absolute z-50 w-64 max-w-[calc(100%-0.5rem)] overflow-hidden rounded-[13px] border border-border bg-popover p-1 text-popover-foreground shadow-lg",
            anchor.above ? "-translate-y-full -mt-1" : "mt-1",
          )}
          style={{ top: anchor.top, left: anchor.left }}
          onMouseDown={(event) => event.preventDefault()}
        >
          {results.loading && results.items.length === 0 ? (
            <p className="select-none px-2.5 py-2 text-sm text-muted-foreground">Searching…</p>
          ) : results.items.length === 0 ? (
            <p className="select-none px-2.5 py-2 text-sm text-muted-foreground">No matches</p>
          ) : (
            results.items.map((item, index) => {
              const folded = fold(item.label);
              const at = hl ? folded.indexOf(fold(hl)) : -1;
              return (
                <div
                  key={item.id}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === highlight}
                  data-highlighted={index === highlight || undefined}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => insert(item)}
                  className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-foreground"
                >
                  {query?.trigger.char === "#" && !item.avatar ? (
                    <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-md bg-muted text-sm text-muted-foreground">
                      #
                    </span>
                  ) : item.avatar ? (
                    // biome-ignore lint/performance/noImgElement: registry components ship plain img
                    <img src={item.avatar} alt="" className="size-7 shrink-0 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/12 text-sm font-medium text-foreground">
                      {initials(item.label)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-foreground">
                      {at >= 0 ? (
                        <>
                          {item.label.slice(0, at)}
                          <span className="font-semibold">{item.label.slice(at, at + hl.length)}</span>
                          {item.label.slice(at + hl.length)}
                        </>
                      ) : (
                        item.label
                      )}
                    </span>
                    {item.description && <span className="block truncate text-sm text-muted-foreground">{item.description}</span>}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
