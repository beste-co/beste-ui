"use client";

import { FilmIcon, ImageIcon, type LucideIcon, XIcon } from "lucide-react";
import * as React from "react";
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

interface InspectorMediaProps {
  /** Label rendered on the left, inside the row. */
  label: string;
  /** Optional leading icon shown before the label. */
  icon?: LucideIcon;

  /** Controlled source. Pair it with `onValueChange`. */
  value?: string;
  /** Initial source in uncontrolled mode. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  /**
   * Hand the choosing over to your own media library: when this is set the row
   * calls it instead of opening the built-in editor, which is what an app with an
   * asset manager wants.
   */
  onPick?: () => void;

  /**
   * What the thumbnail falls back to when there is nothing to show, and which
   * placeholder the URL field suggests.
   * @defaultValue "image" */
  kind?: "image" | "video";
  /**
   * Offer a "Remove {label}" button at the foot of the built-in editor once
   * something is set. It has no effect alongside `onPick`, where there is no
   * editor to host it and the asset library owns removal.
   */
  clearable?: boolean;
  /** Placeholder for the built-in URL field. */
  placeholder?: string;

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

export const inspectorMediaDemo: InspectorMediaProps = {
  label: "Background",
  className: "w-72",
  defaultValue:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&q=60&auto=format&fit=crop",
  clearable: true,
};

export function InspectorMedia({
  label,
  icon: Icon,
  value: valueProp,
  defaultValue,
  onValueChange,
  onPick,
  kind = "image",
  clearable = false,
  placeholder,
  disabled = false,
  tone = "muted",
  size = "default",
  className,
  "aria-label": ariaLabel,
}: InspectorMediaProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const value = valueProp ?? internalValue;

  const [open, setOpen] = React.useState(false);
  /** Non-null only while the URL field is being typed into. */
  const [draft, setDraft] = React.useState<string | null>(null);
  /** Set when the source fails to load, so a broken URL reads as broken. */
  const [broken, setBroken] = React.useState(false);

  const write = (next: string) => {
    setBroken(false);
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const commitDraft = () => {
    const raw = draft;
    setDraft(null);
    if (raw !== null) write(raw.trim());
  };

  const FallbackIcon = kind === "video" ? FilmIcon : ImageIcon;
  const showPreview = Boolean(value) && !broken;

  // A plain img or video, never a framework media component: the registry has to
  // stay framework-agnostic, and a 24px thumbnail leaves an optimiser nothing to
  // do. A video shows its own first frame rather than a film icon — the icon
  // says "a video", the frame says which one.
  const thumbnail = !showPreview ? (
    <FallbackIcon
      className={cn("size-4", broken ? "text-destructive" : "text-muted-foreground/60")}
    />
  ) : kind === "video" ? (
    <video
      src={value}
      muted
      playsInline
      preload="metadata"
      onError={() => setBroken(true)}
      className="size-full rounded-[5px] object-cover"
    >
      <track kind="captions" />
    </video>
  ) : (
    <img
      src={value}
      alt=""
      loading="lazy"
      onError={() => setBroken(true)}
      className="size-full rounded-[5px] object-cover"
    />
  );

  const rowClasses = cn(
    "group/inspector-media flex w-full cursor-pointer items-center gap-2 text-left",
    "h-(--inspector-height) rounded-(--inspector-radius) px-(--inspector-pad)",
    "[--inspector-radius:var(--radius-xl)] transition-colors",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
    sizeStyles[size],
    toneStyles[tone],
    className,
  );

  /*
   * The row is the whole control: the label and the thumbnail, nothing else. It
   * presses as one thing, which is what lets the editor below take the trigger
   * width and line up with the row edge for edge.
   */
  const rowInner = (
    <>
      <span
        data-slot="inspector-media-label"
        className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground/70 select-none"
      >
        {Icon ? <Icon className="size-4 shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </span>

      <span
        aria-hidden="true"
        data-slot="inspector-media-thumbnail"
        className={cn(
          "ml-auto flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md",
          // A picture wants an edge to sit in. A placeholder glyph does not — it
          // reads as part of the row, the way the icon row's glyph does.
          showPreview && "border border-border bg-background",
        )}
      >
        {thumbnail}
      </span>
    </>
  );

  // Handing the choosing to an asset manager means there is no editor to open,
  // so the row simply calls it. Clearing then belongs to that library too, which
  // is why `clearable` asks for the built-in editor.
  if (onPick) {
    return (
      <button
        type="button"
        onClick={onPick}
        disabled={disabled}
        aria-label={ariaLabel}
        data-slot="inspector-media"
        data-disabled={disabled}
        className={rowClasses}
      >
        {rowInner}
      </button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          data-slot="inspector-media"
          data-disabled={disabled}
          className={rowClasses}
        >
          {rowInner}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-2"
      >
        <input
          type="url"
          value={draft ?? value}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitDraft}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitDraft();
              setOpen(false);
            } else if (event.key === "Escape") {
              event.preventDefault();
              setDraft(null);
            }
          }}
          placeholder={
            placeholder ?? `https://example.com/${kind === "video" ? "clip.mp4" : "photo.jpg"}`
          }
          aria-label={`${ariaLabel ?? label} URL`}
          autoComplete="off"
          spellCheck={false}
          className={cn(
            "h-8 w-full rounded-md border border-border bg-transparent px-2",
            "text-sm outline-none placeholder:text-muted-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring/50",
          )}
        />

        {showPreview ? (
          <img
            src={value}
            alt=""
            className="mt-2 aspect-video w-full rounded-md border border-border object-cover"
          />
        ) : null}

        {/*
          Clearing sits with the choosing, not beside the value: it is the same
          decision, and a word says it in a way a small glyph in the row cannot.
        */}
        {clearable && value ? (
          <button
            type="button"
            onClick={() => {
              write("");
              setOpen(false);
            }}
            data-slot="inspector-media-clear"
            className={cn(
              "mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5",
              "border-t border-border pt-2 text-sm font-medium text-foreground/70 select-none",
              "transition-colors hover:text-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            <XIcon className="size-3.5" />
            Remove {label}
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
