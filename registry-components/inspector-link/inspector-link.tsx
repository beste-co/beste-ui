"use client";

import { ArrowUpRightIcon, LinkIcon, type LucideIcon } from "lucide-react";
import * as React from "react";
import { InspectorInput } from "@/components/beste/component/inspector-input";
import { InspectorSelect } from "@/components/beste/component/inspector-select";
import { InspectorSwitch } from "@/components/beste/component/inspector-switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Surface treatment of the row. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Row height preset. Mirrors inspector-slider. */
type Size = "sm" | "default" | "lg";

/** The row itself presses, so it answers hover like any other trigger in the family. */
const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted hover:bg-muted-foreground/15",
  outline: "border border-border hover:bg-muted",
  ghost: "border border-transparent hover:border-border hover:bg-muted",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

/** A destination, in the pieces an anchor takes. */
interface LinkValue {
  /** Where it goes. A path, a full URL, a `mailto:`, an anchor. */
  href?: string;
  /** Open in a new tab, which is `target="_blank"`. */
  newTab?: boolean;
  /** Add `nofollow` to the anchor's `rel`. */
  nofollow?: boolean;
}

/** An internal destination offered instead of a typed URL. */
interface InspectorLinkPage {
  /** The href this page resolves to. */
  value: string;
  /** How it reads in the menu. Falls back to `value`. */
  label?: string;
}

const CUSTOM = "__custom__";

/**
 * How a destination reads on the row. A path stays as it is, since that is what
 * the reader typed; a full URL drops its scheme and any `www.`, which is noise in
 * a column this narrow.
 */
function summarize(href: string): string {
  const trimmed = href.trim();
  if (!/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");
}

interface InspectorLinkProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled value. Pair it with `onValueChange`. */
  value?: LinkValue;
  /** Initial value in uncontrolled mode. */
  defaultValue?: LinkValue;
  /** Fires on every keystroke in the URL field and on every toggle. */
  onValueChange?: (value: LinkValue) => void;
  /**
   * Fires once an edit is finished — the URL field left, a switch flipped, the
   * link removed. Use it for work too expensive to run per keystroke.
   */
  onValueCommit?: (value: LinkValue) => void;
  /** Fires when the editor opens or closes. */
  onOpenChange?: (open: boolean) => void;

  /**
   * Destinations inside the site. Passing them adds a menu above the URL field,
   * so the common case is a choice rather than a typed path.
   */
  pages?: (string | InspectorLinkPage)[];
  /** Offer the nofollow toggle. */
  allowNofollow?: boolean;
  /** Ghost text in the URL field. */
  placeholder?: string;
  /**
   * What the row reads while there is no destination.
   * @defaultValue "None" */
  emptyLabel?: string;

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

export const inspectorLinkDemo: InspectorLinkProps = {
  label: "Link",
  className: "w-72",
  defaultValue: { href: "https://beste.co/pricing", newTab: true },
  pages: [
    { value: "/", label: "Home" },
    { value: "/pricing", label: "Pricing" },
    { value: "/blog", label: "Blog" },
  ],
  allowNofollow: true,
};

export function InspectorLink({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  onOpenChange,
  pages,
  allowNofollow = false,
  placeholder = "https://",
  emptyLabel = "None",
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorLinkProps) {
  const [internalValue, setInternalValue] = React.useState<LinkValue>(defaultValue ?? {});
  const value = valueProp ?? internalValue;
  const href = value.href ?? "";

  const valueRef = React.useRef(value);
  valueRef.current = value;

  const write = (patch: Partial<LinkValue>, complete: boolean) => {
    const next = { ...valueRef.current, ...patch };
    valueRef.current = next;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
    if (complete) onValueCommit?.(next);
  };

  const pageOptions = React.useMemo(
    () =>
      (pages ?? []).map((entry) => (typeof entry === "string" ? { value: entry } : entry)),
    [pages],
  );

  /*
   * The menu holds the pages plus one entry for anything else. Sitting on
   * "Custom URL" whenever the href is not a page keeps the two controls telling
   * the same story: pick a page and the field fills in, type over it and the menu
   * falls back on its own.
   */
  const pageValue = pageOptions.some((page) => page.value === href) ? href : CUSTOM;

  return (
    <Popover onOpenChange={onOpenChange}>
      {/*
        The row is the trigger, so the editor can take the trigger width and open
        flush with it. What the row shows is the destination, which is the one
        thing worth reading without opening anything.
      */}
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-link"
          data-disabled={disabled}
          className={cn(
            "group/inspector-link flex w-full cursor-pointer items-center gap-2 text-left",
            "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
            "[--inspector-radius:var(--radius-xl)] transition-colors",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
            sizeStyles[size],
            toneStyles[tone],
            className,
          )}
        >
          <span
            data-slot="inspector-link-label"
            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
          >
            {Icon ? <Icon className="size-4 shrink-0" /> : null}
            <span className="truncate">{label}</span>
          </span>

          <span
            data-slot="inspector-link-value"
            className={cn(
              "ml-auto min-w-0 truncate text-sm font-medium select-none",
              href ? "text-foreground" : "text-foreground/70",
            )}
          >
            {href ? summarize(href) : emptyLabel}
          </span>

          {/*
            The mark is the destination's one property worth seeing from outside:
            a link that leaves the tab behaves differently, and finding that out
            by pressing it is the wrong time.
          */}
          {href ? (
            <span aria-hidden="true" className="shrink-0 text-foreground/70">
              {value.newTab ? (
                <ArrowUpRightIcon className="size-4" />
              ) : (
                <LinkIcon className="size-4" />
              )}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-2"
      >
        <div className="flex flex-col gap-1">
          {pageOptions.length > 0 ? (
            <InspectorSelect
              label="Page"
              size="sm"
              options={[
                { value: CUSTOM, label: "Custom URL" },
                ...pageOptions.map((page) => ({
                  value: page.value,
                  label: page.label ?? page.value,
                })),
              ]}
              value={pageValue}
              onValueChange={(next) => write({ href: next === CUSTOM ? "" : next }, true)}
            />
          ) : null}

          <InspectorInput
            label="URL"
            size="sm"
            type="url"
            placeholder={placeholder}
            value={href}
            onValueChange={(next) => write({ href: next }, false)}
            onValueCommit={(next) => write({ href: next }, true)}
          />

          <InspectorSwitch
            label="New tab"
            size="sm"
            checked={value.newTab ?? false}
            onCheckedChange={(next) => write({ newTab: next }, true)}
          />

          {allowNofollow ? (
            <InspectorSwitch
              label="Nofollow"
              size="sm"
              checked={value.nofollow ?? false}
              onCheckedChange={(next) => write({ nofollow: next }, true)}
            />
          ) : null}
        </div>

        {/*
          Clearing the destination is its own act, not an empty field: it drops the
          switches with it, so a removed link cannot leave a stray `target` behind.
        */}
        {href ? (
          <button
            type="button"
            onClick={() => write({ href: "", newTab: false, nofollow: false }, true)}
            data-slot="inspector-link-clear"
            className="mt-2 flex w-full cursor-pointer items-center justify-center border-t border-border pt-2 text-sm font-medium text-foreground/70 transition-colors outline-none select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Remove Link
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
