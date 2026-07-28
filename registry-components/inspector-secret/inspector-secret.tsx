"use client";

import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon, type LucideIcon } from "lucide-react";
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

/** How long the run of dots gets, however long the secret is. */
const MASK_LENGTH = 8;

/** How long the copied state is held before the row goes back to its glyph. */
const COPIED_MS = 2000;

interface InspectorSecretProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange` when `editable`. */
  value?: string;
  /** Initial value in uncontrolled mode. */
  defaultValue?: string;
  /** Fires on every keystroke, and only exists while `editable`. */
  onValueChange?: (value: string) => void;
  /** Fires once an edit is finished — the field left, or Enter pressed. */
  onValueCommit?: (value: string) => void;

  /**
   * Let the secret be typed. Off by default: most of these are issued elsewhere
   * and the row is there to show and copy one, not to invite an edit.
   */
  editable?: boolean;
  /**
   * Offer the reveal button.
   * @defaultValue true */
  revealable?: boolean;
  /**
   * Offer the copy button. It copies the real value whether or not it is revealed,
   * which is the point of having it.
   * @defaultValue true */
  copyable?: boolean;
  /**
   * How many characters stay legible at the end while it is hidden. A key is
   * recognised by its tail, and a row of dots that says nothing means opening the
   * dashboard to find out which key this is.
   * @defaultValue 4 */
  visibleSuffix?: number;
  /** Ghost text while there is no value. */
  placeholder?: string;

  /**
   * Fires when the secret is revealed. A panel that keeps a log of who looked at
   * what has to be told, and this is the only moment it happens.
   */
  onReveal?: () => void;
  /** Fires after a successful copy. */
  onCopy?: (value: string) => void;

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

  /** Name of the field, so an editable secret can take part in a form. */
  name?: string;
  /** Id of the field, for an external `<label htmlFor>`. */
  id?: string;
  className?: string;
  /** Accessible name. Falls back to `label`. */
  "aria-label"?: string;
}

export const inspectorSecretDemo: InspectorSecretProps = {
  label: "API key",
  className: "w-72",
  defaultValue: "sk_test_EXAMPLE_NOT_A_REAL_KEY",
};

/**
 * A value that has to be shown without being read over a shoulder: an API key, a
 * token, a webhook signing secret.
 *
 * Hidden, it keeps its last few characters legible, because that tail is how anyone
 * tells one key from another and a row of dots that says nothing sends the reader
 * to the dashboard to find out which key this is. Copy works either way — the point
 * of a secret in a panel is to be pasted somewhere, not to be looked at.
 */
export function InspectorSecret({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  editable = false,
  revealable = true,
  copyable = true,
  visibleSuffix = 4,
  placeholder = "",
  onReveal,
  onCopy,
  disabled = false,
  tone = "muted",
  size = "default",
  name,
  id,
  className,
  "aria-label": ariaLabel,
}: InspectorSecretProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = valueProp ?? internalValue;

  const [revealed, setRevealed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const generatedId = React.useId();
  const fieldId = id ?? generatedId;

  /** The commit baseline, so a blur with nothing typed is not an edit. */
  const committedRef = React.useRef(value);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), COPIED_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const masked = React.useMemo(() => {
    if (!value) return "";
    const keep = Math.max(0, Math.min(visibleSuffix, value.length));
    const tail = keep > 0 ? value.slice(-keep) : "";
    // A fixed run of dots, not one per character: the length of a secret is itself
    // something worth not printing, and a 200-character token would fill the row.
    return "•".repeat(MASK_LENGTH) + tail;
  }, [value, visibleSuffix]);

  const write = (next: string, complete: boolean) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    if (complete && next !== committedRef.current) {
      committedRef.current = next;
      onValueCommit?.(next);
    }
  };

  const toggleReveal = () => {
    const next = !revealed;
    setRevealed(next);
    if (next) onReveal?.();
  };

  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.(value);
    } catch {
      // Clipboard writes fail in an insecure context, and there is nothing useful
      // to say about it in a settings row.
    }
  };

  return (
    <div
      data-slot="inspector-secret"
      data-disabled={disabled}
      data-revealed={revealed || undefined}
      className={cn(
        "group/inspector-secret flex items-center gap-2",
        "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      {editable ? (
        <label
          htmlFor={fieldId}
          data-slot="inspector-secret-label"
          className="flex min-w-0 shrink-0 cursor-text items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
        >
          {Icon ? <Icon className="size-4 shrink-0" /> : null}
          <span className="truncate">{label}</span>
        </label>
      ) : (
        <span
          data-slot="inspector-secret-label"
          className="flex min-w-0 shrink-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
        >
          {Icon ? <Icon className="size-4 shrink-0" /> : null}
          <span className="truncate">{label}</span>
        </span>
      )}

      {editable ? (
        <input
          id={fieldId}
          name={name}
          // The platform's own password field while it is hidden, so a password
          // manager and the browser both know what this is.
          type={revealed ? "text" : "password"}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-label={ariaLabel ?? label}
          onChange={(event) => write(event.target.value, false)}
          onBlur={(event) => write(event.target.value, true)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            write(event.currentTarget.value, true);
          }}
          data-slot="inspector-secret-field"
          className={cn(
            "ml-auto min-w-0 flex-1 bg-transparent text-right font-mono text-sm font-medium",
            "text-foreground outline-none placeholder:text-muted-foreground",
          )}
        />
      ) : (
        <span
          data-slot="inspector-secret-value"
          className={cn(
            "ml-auto min-w-0 truncate font-mono text-sm font-medium select-none",
            value ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {value ? (revealed ? value : masked) : placeholder}
        </span>
      )}

      {/*
        The two buttons are one cluster, not two of the row's children: they act on
        the same value and belong together, so they sit a couple of pixels apart
        rather than at the row's own gap, which is the distance between the value and
        the controls that work it.
      */}
      <div
        data-slot="inspector-secret-actions"
        className="flex shrink-0 items-center gap-0.5"
      >
      {revealable ? (
        <button
          type="button"
          onClick={toggleReveal}
          disabled={disabled || !value}
          aria-pressed={revealed}
          aria-label={revealed ? `Hide ${label}` : `Reveal ${label}`}
          title={revealed ? "Hide" : "Reveal"}
          data-slot="inspector-secret-reveal"
          className={cn(
            "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md",
            "text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          {revealed ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
        </button>
      ) : null}

      {copyable ? (
        <button
          type="button"
          onClick={copy}
          disabled={disabled || !value}
          aria-label={copied ? `${label} copied` : `Copy ${label}`}
          title={copied ? "Copied" : "Copy"}
          data-slot="inspector-secret-copy"
          className={cn(
            "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md",
            "text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          {copied ? (
            <CheckIcon className="size-3.5 text-emerald-600" />
          ) : (
            <CopyIcon className="size-3.5" />
          )}
        </button>
      ) : null}
      </div>
    </div>
  );
}
