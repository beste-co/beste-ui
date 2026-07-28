"use client";

import { type LucideIcon, XIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent hover:border-border",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

/** Keys that only ever qualify another one. */
const MODIFIER_KEYS = new Set(["Control", "Meta", "Alt", "Shift"]);

/**
 * How each part is printed. The platform's own glyphs on a Mac, words elsewhere:
 * a shortcut is read off the keyboard in front of the reader, and `Cmd` on a
 * machine whose key says `⌘` is a small lie that costs a beat every time.
 */
const APPLE_GLYPHS: Record<string, string> = {
  Mod: "⌘",
  Control: "⌃",
  Alt: "⌥",
  Shift: "⇧",
  Enter: "↩",
  Backspace: "⌫",
  Delete: "⌦",
  Escape: "⎋",
  Tab: "⇥",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  " ": "Space",
};

const PLAIN_NAMES: Record<string, string> = {
  Mod: "Ctrl",
  Control: "Ctrl",
  Alt: "Alt",
  Shift: "Shift",
  Escape: "Esc",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  " ": "Space",
};

interface InspectorShortcutProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /**
   * Controlled value: the parts of the combination, in the order they are printed.
   * `Mod` is the platform's command key — Cmd on a Mac, Ctrl everywhere else — which
   * is what lets one stored shortcut be right on both.
   */
  value?: string[];
  /** Initial value in uncontrolled mode. */
  defaultValue?: string[];
  /** Fires once a combination is captured, and with an empty list when cleared. */
  onValueChange?: (value: string[]) => void;

  /**
   * Insist on at least one modifier, so a single letter cannot be bound to
   * something the reader will then trigger while typing.
   * @defaultValue true */
  requireModifier?: boolean;
  /** What the row reads while nothing is bound. */
  emptyLabel?: string;
  /** Print words rather than glyphs, whatever the platform. */
  forcePlainNames?: boolean;

  /** Block interaction and dim the row. */
  disabled?: boolean;
  /**
   * Surface treatment: filled (default), hairline outline, or bare until hover.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Row height preset.
   * @defaultValue "default" */
  size?: Size;

  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorShortcutDemo: InspectorShortcutProps = {
  label: "Command Palette",
  className: "w-72",
  defaultValue: ["Mod", "K"],
};

export function InspectorShortcut({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  requireModifier = true,
  emptyLabel = "Not set",
  forcePlainNames = false,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorShortcutProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue ?? []);
  const keys = valueProp ?? internalValue;

  /** Whether the next key press is being taken as the binding. */
  const [recording, setRecording] = React.useState(false);

  /*
   * The platform is read once, on the client. Reading it during render would make
   * the first paint disagree with the server's, and the glyphs would flip after
   * hydration.
   */
  const [apple, setApple] = React.useState(false);
  React.useEffect(() => {
    if (forcePlainNames || typeof navigator === "undefined") return;
    setApple(/mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent));
  }, [forcePlainNames]);

  const print = (part: string) =>
    (apple ? APPLE_GLYPHS[part] : PLAIN_NAMES[part]) ??
    PLAIN_NAMES[part] ??
    (part.length === 1 ? part.toUpperCase() : part);

  const setKeys = (next: string[]) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  /**
   * Every press is captured while recording, including the ones the browser would
   * otherwise act on: binding Mod+S is impossible if the page saves instead. Escape
   * is left alone as the way out, and Backspace clears, which are the two keys a
   * recorder has to give up to stay escapable.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!recording) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setRecording(true);
      }
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.key === "Escape") {
      setRecording(false);
      return;
    }
    if (event.key === "Backspace" || event.key === "Delete") {
      setKeys([]);
      setRecording(false);
      return;
    }
    // A modifier on its own is the reader still reaching for the second key.
    if (MODIFIER_KEYS.has(event.key)) return;

    const parts: string[] = [];
    // `Mod` folds Cmd and Ctrl into one part, so the same value reads right on
    // either platform. Both held at once is spelled out rather than collapsed.
    if (event.metaKey && event.ctrlKey) parts.push("Mod", "Control");
    else if (event.metaKey || event.ctrlKey) parts.push("Mod");
    if (event.altKey) parts.push("Alt");
    if (event.shiftKey) parts.push("Shift");

    if (requireModifier && parts.length === 0) return;

    parts.push(event.key.length === 1 ? event.key.toUpperCase() : event.key);
    setKeys(parts);
    setRecording(false);
  };

  return (
    <div
      data-slot="inspector-shortcut"
      data-disabled={disabled}
      className={cn(
        "group/inspector-shortcut flex items-center gap-2",
        "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      <span
        data-slot="inspector-shortcut-label"
        className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </span>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setRecording((was) => !was)}
        onKeyDown={handleKeyDown}
        // Recording that outlived the focus would swallow the reader's next
        // keystroke somewhere else entirely.
        onBlur={() => setRecording(false)}
        aria-label={ariaLabel ?? label}
        aria-keyshortcuts={keys.length > 0 ? keys.join("+") : undefined}
        data-slot="inspector-shortcut-capture"
        data-recording={recording || undefined}
        className={cn(
          "ml-auto flex min-w-0 cursor-pointer items-center gap-1 rounded-md px-1 py-0.5",
          "outline-none transition-colors",
          recording && "bg-foreground/10",
        )}
      >
        {recording ? (
          <span className="text-sm font-medium text-foreground/70 select-none">
            Press keys…
          </span>
        ) : keys.length > 0 ? (
          keys.map((part) => (
            // A real `kbd`, so a screen reader and a stylesheet both know what this
            // is without being told twice.
            <kbd
              key={part}
              data-slot="inspector-shortcut-key"
              className={cn(
                "flex h-5 min-w-5 items-center justify-center rounded-sm px-1",
                "bg-foreground/10 text-sm font-medium text-foreground select-none",
              )}
            >
              {print(part)}
            </kbd>
          ))
        ) : (
          <span className="text-sm font-medium text-foreground/70 select-none">
            {emptyLabel}
          </span>
        )}
      </button>

      {keys.length > 0 && !recording ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setKeys([])}
          aria-label={`Clear ${label}`}
          data-slot="inspector-shortcut-clear"
          className={cn(
            "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm",
            "text-foreground/70 transition-colors outline-none",
            "hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
          )}
        >
          <XIcon className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
