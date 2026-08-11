"use client";

import { ChevronDownIcon, InfoIcon, type LucideIcon, RotateCcwIcon } from "lucide-react";
import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Surface treatment of the group. Mirrors inspector-slider. */
type Tone = "muted" | "outline" | "ghost";

/** Padding and header metrics. Mirrors inspector-slider's heights. */
type Size = "sm" | "default" | "lg";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border",
  ghost: "border border-transparent",
};

/*
 * The same numbers every other row in the family carries. They were a step tighter
 * here, which showed as soon as a closed group sat next to a row: the two are the
 * same height by design, so their labels started two pixels apart on what the eye
 * reads as one edge.
 */
/** The look of the info mark, shared by its two spellings below. */
const INFO_MARK =
  "shrink-0 cursor-help text-foreground/40 transition-colors hover:text-foreground/70";

const sizeStyles: Record<Size, string> = {
  sm: "[--inspector-height:--spacing(8)] [--inspector-pad:--spacing(2.5)]",
  default: "[--inspector-height:--spacing(9)] [--inspector-pad:--spacing(3)]",
  lg: "[--inspector-height:--spacing(11)] [--inspector-pad:--spacing(4)]",
};

interface InspectorGroupProps {
  /** Name of the group, in its header. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;
  /**
   * A note the header does not have room for, behind a mark next to the label.
   *
   * For what the group is *for*, or what turning something in it on will cost —
   * the kind of thing worth having but not worth a line of prose above every
   * group. Anything a reader needs before they can answer a row belongs in that
   * row's label instead.
   */
  info?: string;

  /** The rows. */
  children?: React.ReactNode;

  /**
   * What the group is currently set to, shown in the header while it is closed.
   * A closed group that says nothing about itself is a door with no sign on it.
   */
  summary?: React.ReactNode;
  /** Keep the summary visible while the group is open too. */
  alwaysShowSummary?: boolean;

  /** Controlled open state. Pair it with `onOpenChange`. */
  open?: boolean;
  /**
   * Whether it starts open in uncontrolled mode.
   * @defaultValue true */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Take away the disclosure: the header becomes a heading and the rows stay out. */
  collapsible?: boolean;

  /**
   * Called by the reset button, which only appears when this is given. It sits in
   * the header rather than under the rows, since it belongs to the group and not
   * to whichever row happens to be last.
   */
  onReset?: () => void;
  /** Grey out the reset button, for a group already at its defaults. */
  resetDisabled?: boolean;

  /** Dim the whole group. What is inside stays the caller's business. */
  disabled?: boolean;
  /**
   * Surface treatment: filled (default), hairline outline, or bare.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Padding and header height preset.
   * @defaultValue "default" */
  size?: Size;

  className?: string;
}

export const inspectorGroupDemo: InspectorGroupProps = {
  label: "Layout",
  className: "w-72",
  summary: "16 24 px",
  children: (
    <>
      <div className="flex h-9 items-center rounded-xl bg-background px-3 text-sm font-medium text-foreground/70 select-none">
        Rows of the family go here
      </div>
      <div className="flex h-9 items-center rounded-xl bg-background px-3 text-sm font-medium text-foreground/70 select-none">
        One under another
      </div>
    </>
  ),
};

/**
 * The container the family was missing. Twenty-five kinds of row and nothing to put
 * them in meant every drawer built its own panel, so the rows looked like a set and
 * the sections around them did not.
 *
 * It is a disclosure, not a card: the reason to group settings is to be able to put
 * most of them away, and the reason to name the group is so they can be found again
 * without opening it. Hence the summary in the header.
 */
export function InspectorGroup({
  label,
  icon: Icon,
  info,
  children,
  summary,
  alwaysShowSummary = false,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  collapsible = true,
  onReset,
  resetDisabled = false,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
}: InspectorGroupProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = collapsible ? (openProp ?? internalOpen) : true;
  const bodyId = React.useId();

  const toggle = () => {
    if (!collapsible) return;
    const next = !open;
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const showSummary = summary !== undefined && summary !== null && (!open || alwaysShowSummary);

  const header = (
    <>
      <span
        data-slot="inspector-group-label"
        className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </span>

      {/*
        Right beside the name it belongs to, which means inside the header — and
        the header is a button when the group folds, so the mark can only be a
        button when it is not. Pressing it then folds the group, which is what
        pressing anywhere in that header does; hovering still reads the note.

        Two whole tooltips rather than one with the element chosen inside it: a
        trigger that borrows its child has to be handed a single element written
        out, not an expression that resolves to one.
      */}
      {info && collapsible ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              title={info}
              data-slot="inspector-group-info"
              className={INFO_MARK}
            >
              <InfoIcon className="size-3.5" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-64">{info}</TooltipContent>
        </Tooltip>
      ) : null}

      {info && !collapsible ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`About ${label}`}
              data-slot="inspector-group-info"
              className={cn(INFO_MARK, "focus-visible:text-foreground/70 focus-visible:outline-none")}
            >
              <InfoIcon className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-64">{info}</TooltipContent>
        </Tooltip>
      ) : null}

      {showSummary ? (
        <span
          data-slot="inspector-group-summary"
          className="ml-auto min-w-0 truncate text-sm text-foreground/70 select-none"
        >
          {summary}
        </span>
      ) : null}

      {collapsible ? (
        <ChevronDownIcon
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-foreground/70 motion-safe:transition-transform",
            showSummary ? "" : "ml-auto",
            open && "rotate-180",
          )}
        />
      ) : null}
    </>
  );

  return (
    <div
      data-slot="inspector-group"
      data-open={open || undefined}
      data-disabled={disabled}
      className={cn(
        "group/inspector-group flex flex-col",
        // Horizontal padding only, and while closed the height is the row height
        // itself: a group sits in a stack of rows and has to measure the same as one.
        // Carrying it here rather than on the header is what makes that exact — the
        // border is inside a border-box height, so a 36px header in a bordered box is
        // a 38px group. The vertical space belongs to the body, which is the part
        // that is sometimes there.
        "rounded-(--inspector-radius) px-(--inspector-pad)",
        "[--inspector-radius:var(--radius-xl)]",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      {/*
        The header is one press target with the reset button laid beside it rather
        than inside it, since a button inside a button is neither legal nor
        clickable. A group that cannot collapse gets a plain heading instead, so
        nothing offers a gesture it will not answer.

        The header carries the height, in both states and to the pixel, because
        anything else moves the title when the group opens. The root used to be
        pinned to the row height while closed and left to its contents once open,
        and those two are not the same number: the pin is a border box, so the
        strip inside it was two pixels shorter than the row it became on opening.

        Hence the `-2px`: the group's tone always draws a 1px border, so a header
        of `height - 2` inside it is a closed group that measures exactly what a
        row measures, and a title that does not move.
      */}
      <div className="flex h-[calc(var(--inspector-height)-2px)] items-center gap-2">
        {collapsible ? (
          <button
            type="button"
            onClick={toggle}
            disabled={disabled}
            aria-expanded={open}
            aria-controls={bodyId}
            data-slot="inspector-group-trigger"
            className={cn(
              "flex h-full min-w-0 flex-1 cursor-pointer items-center gap-2",
              "rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            {header}
          </button>
        ) : (
          <div
            data-slot="inspector-group-heading"
            className="flex h-(--inspector-height) min-w-0 flex-1 items-center gap-2"
          >
            {header}
          </div>
        )}

        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            disabled={disabled || resetDisabled}
            aria-label={`Reset ${label}`}
            title={`Reset ${label}`}
            data-slot="inspector-group-reset"
            className={cn(
              "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md",
              "text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              "disabled:pointer-events-none disabled:opacity-40",
            )}
          >
            <RotateCcwIcon className="size-3.5" />
          </button>
        ) : null}
      </div>

      {/*
        Unmounted while closed, not hidden: a group holds rows that each own state
        and effects, and a drawer of twenty closed groups would otherwise be paying
        for all of them.
      */}
      {open ? (
        <div
          id={bodyId}
          data-slot="inspector-group-body"
          className="flex flex-col gap-1 pb-(--inspector-pad)"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
