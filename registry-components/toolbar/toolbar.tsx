"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Frame,
  Hand,
  type LucideIcon,
  MousePointer2,
  PenTool,
  Type,
  ZoomIn,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface treatment of the bar. Mirrors the inspector family. */
type Tone = "muted" | "outline" | "ghost";

/** Item height preset. Mirrors the inspector family. */
type Size = "sm" | "default" | "lg";

type Orientation = "horizontal" | "vertical";

/** Where the shared tooltip opens, relative to the bar. */
type Side = "top" | "bottom" | "left" | "right";

const toneStyles: Record<Tone, string> = {
  muted: "border border-transparent bg-muted",
  outline: "border border-border bg-background",
  ghost: "border border-transparent hover:border-border",
};

const sizeStyles: Record<Size, string> = {
  sm: "[--toolbar-item:--spacing(7)] [--toolbar-icon:--spacing(4)]",
  default: "[--toolbar-item:--spacing(8)] [--toolbar-icon:--spacing(4)]",
  lg: "[--toolbar-item:--spacing(10)] [--toolbar-icon:--spacing(5)]",
};

/**
 * Spring-shaped easing sampled from a lightly under-damped spring, the curve the
 * inspector family uses, so the highlight and tooltip slide without an animation library.
 */
const SPRING_EASE =
  "linear(0, 0.014, 0.056 3.4%, 0.216 7.2%, 0.472 11.6%, 0.72 16%, 0.895 20%, 0.986 23.6%, 1.036 27.8%, 1.045 32.4%, 1.026 39.4%, 0.998 46.6%, 0.992 52.4%, 1.001 66.4%, 1)";

/** How long a pointer rests on the bar before the first tooltip shows. Later ones follow at once. */
const TOOLTIP_DELAY = 500;
/** How long the bar stays warm after the pointer leaves, so coming straight back skips the delay. */
const TOOLTIP_COOLDOWN = 300;

const ITEM_SELECTOR = "[data-toolbar-item]";

/** Marks the bar's single tab stop; a native button starts at tabIndex 0, so the index alone cannot say which. */
function rove(item: HTMLElement, current: boolean) {
  item.tabIndex = current ? 0 : -1;
  item.dataset.roving = current ? "on" : "off";
}

/* -------------------------------------------------------------------------- */
/* Shortcuts                                                                  */
/* -------------------------------------------------------------------------- */

const MAC_KEYS: Record<string, string> = { mod: "⌘", meta: "⌘", cmd: "⌘", ctrl: "⌃", control: "⌃", alt: "⌥", option: "⌥", shift: "⇧" };
const PC_KEYS: Record<string, string> = { mod: "Ctrl", meta: "Win", cmd: "Ctrl", ctrl: "Ctrl", control: "Ctrl", alt: "Alt", option: "Alt", shift: "Shift" };
const ARIA_KEYS: Record<string, [string, string]> = {
  mod: ["Meta", "Control"],
  meta: ["Meta", "Meta"],
  cmd: ["Meta", "Control"],
  ctrl: ["Control", "Control"],
  control: ["Control", "Control"],
  alt: ["Alt", "Alt"],
  option: ["Alt", "Alt"],
  shift: ["Shift", "Shift"],
};

/** "Mod+Shift+Z" becomes the caps for this platform: ⌘ ⇧ Z on a Mac, Ctrl Shift Z elsewhere. */
function shortcutKeys(shortcut: string, mac: boolean) {
  return shortcut
    .split("+")
    .map((key) => key.trim())
    .filter(Boolean)
    .map((key) => (mac ? MAC_KEYS : PC_KEYS)[key.toLowerCase()] ?? (key.length === 1 ? key.toUpperCase() : key));
}

function ariaShortcut(shortcut: string, mac: boolean) {
  return shortcut
    .split("+")
    .map((key) => key.trim())
    .filter(Boolean)
    .map((key) => ARIA_KEYS[key.toLowerCase()]?.[mac ? 0 : 1] ?? (key.length === 1 ? key.toUpperCase() : key))
    .join("+");
}

/** A tiny key cap. The `kbd-*` family will replace this once `kbd-combo` exists. */
function KeyCaps({ keys }: { keys: string[] }) {
  return (
    <span className="flex items-center gap-0.5">
      {keys.map((key, index) => (
        <kbd
          key={`${key}-${index}`}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-background/15 px-1 font-sans text-sm leading-none"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface ToolbarContextValue {
  mac: boolean;
  orientation: Orientation;
}

const ToolbarContext = React.createContext<ToolbarContextValue>({ mac: false, orientation: "horizontal" });

interface ToggleGroupContextValue {
  isPressed: (value: string) => boolean;
  toggle: (value: string) => void;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* Toolbar                                                                    */
/* -------------------------------------------------------------------------- */

interface ToolbarProps {
  /** Buttons, toggles, groups and separators. */
  children?: React.ReactNode;
  /**
   * Row or column. Arrow keys follow it: left and right for a row, up and down for a column.
   * @defaultValue "horizontal" */
  orientation?: Orientation;
  /**
   * Where the tooltip opens. Defaults to above a row and to the right of a column.
   */
  side?: Side;
  /**
   * Surface treatment: filled (default), hairline outline, or bare until hover.
   * @defaultValue "muted" */
  tone?: Tone;
  /**
   * Item size preset.
   * @defaultValue "default" */
  size?: Size;
  /** Lift the bar off the page with a soft shadow, for a toolbar that floats over a canvas. */
  floating?: boolean;
  /** Accessible name for the toolbar. */
  "aria-label"?: string;
  className?: string;
}

function DemoTools() {
  return (
    <>
      <ToolbarToggleGroup type="single" defaultValue="select" aria-label="Tool">
        <ToolbarToggle value="select" icon={MousePointer2} label="Move" shortcut="V" />
        <ToolbarToggle value="hand" icon={Hand} label="Hand" shortcut="H" />
        <ToolbarToggle value="frame" icon={Frame} label="Frame" shortcut="F" />
        <ToolbarToggle value="pen" icon={PenTool} label="Pen" shortcut="P" />
        <ToolbarToggle value="text" icon={Type} label="Text" shortcut="T" />
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarToggleGroup type="single" defaultValue="left" aria-label="Text align">
        <ToolbarToggle value="left" icon={AlignLeft} label="Align left" shortcut="Alt+A" />
        <ToolbarToggle value="center" icon={AlignCenter} label="Align center" shortcut="Alt+H" />
        <ToolbarToggle value="right" icon={AlignRight} label="Align right" shortcut="Alt+D" />
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton icon={ZoomIn} label="Zoom in" shortcut="Mod+=" />
    </>
  );
}

export const toolbarDemo: ToolbarProps = {
  "aria-label": "Canvas tools",
  floating: true,
  children: <DemoTools />,
};

/**
 * A floating bar of tools. One highlight slides under whichever item the pointer or
 * keyboard is on, and one tooltip rides above it, so moving along the bar reads as a
 * single object travelling rather than a row of separate hovers.
 */
export function Toolbar({
  children,
  orientation = "horizontal",
  side,
  tone = "muted",
  size = "default",
  floating = false,
  "aria-label": ariaLabel,
  className,
}: ToolbarProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [mac, setMac] = React.useState(false);
  const [tip, setTip] = React.useState<{ label: string; keys: string[] } | null>(null);
  const [tipOpen, setTipOpen] = React.useState(false);
  const warmRef = React.useRef(false);
  const openTimer = React.useRef(0);
  const coolTimer = React.useRef(0);
  const tipSide = side ?? (orientation === "vertical" ? "right" : "top");

  React.useEffect(() => {
    setMac(/Mac|iPhone|iPad|iPod/.test(navigator.userAgent));
  }, []);

  React.useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(coolTimer.current);
    },
    [],
  );

  const items = React.useCallback(
    () =>
      Array.from(rootRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []).filter(
        (item) => !item.hasAttribute("disabled"),
      ),
    [],
  );

  // Roving tabindex: one stop for the whole bar, on the item that last had focus
  React.useEffect(() => {
    const list = items();
    const current = list.find((item) => item.dataset.roving === "on") ?? list.find((item) => item.dataset.state === "on") ?? list[0];
    for (const item of list) rove(item, item === current);
  });

  // Position is written straight to CSS variables, so sliding costs no React render
  const place = (item: HTMLElement) => {
    const root = rootRef.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    const hidden = root.dataset.highlight !== "on";
    if (hidden) root.dataset.instant = "true";
    root.style.setProperty("--toolbar-x", `${rect.left - box.left - root.clientLeft}px`);
    root.style.setProperty("--toolbar-y", `${rect.top - box.top - root.clientTop}px`);
    root.style.setProperty("--toolbar-w", `${rect.width}px`);
    root.style.setProperty("--toolbar-h", `${rect.height}px`);
    root.dataset.highlight = "on";
    // Appearing from nothing lands in place; only moves between items slide
    if (hidden) {
      void root.offsetWidth;
      delete root.dataset.instant;
    }
  };

  const showTip = (item: HTMLElement) => {
    const label = item.dataset.tipLabel ?? "";
    const shortcut = item.dataset.shortcut ?? "";
    window.clearTimeout(coolTimer.current);
    window.clearTimeout(openTimer.current);
    if (!label && !shortcut) {
      setTipOpen(false);
      return;
    }
    setTip({ label, keys: shortcut ? shortcutKeys(shortcut, mac) : [] });
    if (warmRef.current) {
      setTipOpen(true);
      return;
    }
    openTimer.current = window.setTimeout(() => {
      warmRef.current = true;
      setTipOpen(true);
    }, TOOLTIP_DELAY);
  };

  const hide = () => {
    const root = rootRef.current;
    if (root) root.dataset.highlight = "off";
    window.clearTimeout(openTimer.current);
    setTipOpen(false);
    coolTimer.current = window.setTimeout(() => {
      warmRef.current = false;
    }, TOOLTIP_COOLDOWN);
  };

  const onPointerOver = (event: React.PointerEvent) => {
    if (event.pointerType === "touch") return;
    const item = (event.target as HTMLElement).closest<HTMLElement>(ITEM_SELECTOR);
    if (!item || item.hasAttribute("disabled") || !rootRef.current?.contains(item)) return;
    place(item);
    showTip(item);
  };

  const onPointerLeave = () => {
    const focused = rootRef.current?.querySelector<HTMLElement>(`${ITEM_SELECTOR}:focus-visible`);
    if (focused) {
      place(focused);
      setTipOpen(false);
      return;
    }
    hide();
  };

  const onFocus = (event: React.FocusEvent) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>(ITEM_SELECTOR);
    if (!item) return;
    for (const other of items()) rove(other, other === item);
    if (!item.matches(":focus-visible")) return;
    place(item);
    showTip(item);
  };

  const onBlur = (event: React.FocusEvent) => {
    if (rootRef.current?.contains(event.relatedTarget as Node | null)) return;
    if (!rootRef.current?.matches(":hover")) hide();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    const back = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
    const forward = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    let next = -1;
    if (event.key === forward) next = (index + 1) % list.length;
    else if (event.key === back) next = (index - 1 + list.length) % list.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = list.length - 1;
    else if (event.key === "Escape") {
      setTipOpen(false);
      return;
    }
    if (next < 0) return;
    event.preventDefault();
    list[next]?.focus();
  };

  const vertical = orientation === "vertical";

  return (
    <ToolbarContext.Provider value={{ mac, orientation }}>
      {/* biome-ignore lint/a11y/useSemanticElements: a toolbar has no native element */}
      <div
        ref={rootRef}
        role="toolbar"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        data-slot="toolbar"
        data-orientation={orientation}
        data-highlight="off"
        onPointerOver={onPointerOver}
        onPointerLeave={onPointerLeave}
        onPointerDown={() => setTipOpen(false)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={cn(
          "group/toolbar relative isolate inline-flex w-fit items-center gap-0.5 rounded-full p-1",
          vertical && "flex-col",
          sizeStyles[size],
          toneStyles[tone],
          floating && "shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25),0_2px_6px_-2px_rgb(0_0_0/0.08)]",
          className,
        )}
      >
        <span
          aria-hidden="true"
          data-slot="toolbar-highlight"
          className={cn(
            "pointer-events-none absolute top-0 left-0 -z-10 rounded-full bg-foreground/8 opacity-0",
            "h-(--toolbar-h) w-(--toolbar-w) translate-x-(--toolbar-x) translate-y-(--toolbar-y)",
            "group-data-[highlight=on]/toolbar:opacity-100",
            "motion-safe:transition-[translate,width,height,opacity] motion-safe:duration-[420ms]",
            "group-data-[instant=true]/toolbar:transition-none",
          )}
          style={{ transitionTimingFunction: SPRING_EASE }}
        />

        {children}

        {/* One tooltip for the whole bar; it rides along with the highlight */}
        <span
          aria-hidden="true"
          data-slot="toolbar-tooltip"
          data-open={tipOpen && tip ? "true" : "false"}
          data-side={tipSide}
          className={cn(
            "pointer-events-none absolute z-20 flex w-max items-center gap-2 rounded-lg bg-foreground px-2.5 py-1.5",
            "text-sm font-medium whitespace-nowrap text-background select-none",
            "opacity-0 data-[open=true]:opacity-100",
            "motion-safe:transition-[left,top,opacity] motion-safe:duration-[420ms]",
            "group-data-[instant=true]/toolbar:transition-none",
            tipSide === "top" && "bottom-[calc(100%_+_0.5rem)] left-[calc(var(--toolbar-x)_+_var(--toolbar-w)_/_2)] -translate-x-1/2",
            tipSide === "bottom" && "top-[calc(100%_+_0.5rem)] left-[calc(var(--toolbar-x)_+_var(--toolbar-w)_/_2)] -translate-x-1/2",
            tipSide === "right" && "top-[calc(var(--toolbar-y)_+_var(--toolbar-h)_/_2)] left-[calc(100%_+_0.5rem)] -translate-y-1/2",
            tipSide === "left" && "top-[calc(var(--toolbar-y)_+_var(--toolbar-h)_/_2)] right-[calc(100%_+_0.5rem)] -translate-y-1/2",
          )}
          style={{ transitionTimingFunction: SPRING_EASE }}
        >
          {tip?.label ? <span>{tip.label}</span> : null}
          {tip && tip.keys.length > 0 ? <KeyCaps keys={tip.keys} /> : null}
        </span>
      </div>
    </ToolbarContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Items                                                                      */
/* -------------------------------------------------------------------------- */

const itemBase = cn(
  "relative inline-flex h-(--toolbar-item) min-w-(--toolbar-item) shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full",
  "text-sm font-medium text-foreground/70 outline-none select-none transition-colors",
  "hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:opacity-40",
  "[&_svg]:size-(--toolbar-icon) [&_svg]:shrink-0",
);

interface ItemContentProps {
  icon?: LucideIcon;
  label: string;
  showLabel?: boolean;
}

function ItemContent({ icon: Icon, label, showLabel }: ItemContentProps) {
  return (
    <>
      {Icon ? <Icon aria-hidden="true" /> : null}
      {showLabel || !Icon ? <span className="px-1">{label}</span> : null}
    </>
  );
}

interface ToolbarButtonProps {
  /** Icon on the button. Without one the label is shown as text. */
  icon?: LucideIcon;
  /** What the button does. The accessible name, and the tooltip when only the icon shows. */
  label: string;
  /** Show the label beside the icon. The tooltip then only carries the shortcut. */
  showLabel?: boolean;
  /** Keyboard shortcut shown in the tooltip, e.g. "Mod+Shift+Z". `Mod` is ⌘ on a Mac and Ctrl elsewhere. */
  shortcut?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

/** A plain action. For something that stays on, use `ToolbarToggle`. */
export function ToolbarButton({ icon, label, showLabel = false, shortcut, onClick, disabled, className }: ToolbarButtonProps) {
  const { mac } = React.useContext(ToolbarContext);
  const visibleLabel = showLabel || !icon;
  return (
    <button
      type="button"
      data-toolbar-item=""
      data-slot="toolbar-button"
      data-tip-label={visibleLabel ? "" : label}
      data-shortcut={shortcut ?? ""}
      aria-label={visibleLabel ? undefined : label}
      aria-keyshortcuts={shortcut ? ariaShortcut(shortcut, mac) : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(itemBase, visibleLabel && "px-2.5", className)}
    >
      <ItemContent icon={icon} label={label} showLabel={showLabel} />
    </button>
  );
}

interface ToolbarToggleProps extends Omit<ToolbarButtonProps, "onClick"> {
  /** Identifies the toggle inside a `ToolbarToggleGroup`. */
  value?: string;
  /** Controlled state. Ignored inside a group, which owns it. */
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

/** A button that stays on. Inside a `ToolbarToggleGroup` the group decides which are on. */
export function ToolbarToggle({
  value,
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  icon,
  label,
  showLabel = false,
  shortcut,
  disabled,
  className,
}: ToolbarToggleProps) {
  const { mac } = React.useContext(ToolbarContext);
  const group = React.useContext(ToggleGroupContext);
  const [internal, setInternal] = React.useState(defaultPressed);
  const pressed = group && value !== undefined ? group.isPressed(value) : (pressedProp ?? internal);
  const visibleLabel = showLabel || !icon;

  const onClick = () => {
    if (group && value !== undefined) {
      group.toggle(value);
      return;
    }
    if (pressedProp === undefined) setInternal(!pressed);
    onPressedChange?.(!pressed);
  };

  return (
    <button
      type="button"
      data-toolbar-item=""
      data-slot="toolbar-toggle"
      data-state={pressed ? "on" : "off"}
      data-tip-label={visibleLabel ? "" : label}
      data-shortcut={shortcut ?? ""}
      aria-pressed={pressed}
      aria-label={visibleLabel ? undefined : label}
      aria-keyshortcuts={shortcut ? ariaShortcut(shortcut, mac) : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        itemBase,
        visibleLabel && "px-2.5",
        "data-[state=on]:bg-foreground data-[state=on]:text-background data-[state=on]:hover:text-background",
        className,
      )}
    >
      <ItemContent icon={icon} label={label} showLabel={showLabel} />
    </button>
  );
}

type ToolbarToggleGroupProps = {
  /** `ToolbarToggle`s, each with a `value`. */
  children?: React.ReactNode;
  /** Accessible name for the set. */
  "aria-label"?: string;
  className?: string;
} & (
  | {
      /** One on at a time, like a tool picker. Pressing the one that is on keeps it on. */
      type: "single";
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string) => void;
    }
  | {
      /** Any number on, like bold, italic and underline. */
      type: "multiple";
      value?: string[];
      defaultValue?: string[];
      onValueChange?: (value: string[]) => void;
    }
);

/** A set of toggles that share one state: one-of-many or any-of-many. */
export function ToolbarToggleGroup(props: ToolbarToggleGroupProps) {
  const { children, className, "aria-label": ariaLabel } = props;
  const [single, setSingle] = React.useState(props.type === "single" ? (props.defaultValue ?? "") : "");
  const [multiple, setMultiple] = React.useState<string[]>(props.type === "multiple" ? (props.defaultValue ?? []) : []);

  const context = React.useMemo<ToggleGroupContextValue>(() => {
    if (props.type === "single") {
      const current = props.value ?? single;
      return {
        isPressed: (value) => value === current,
        toggle: (value) => {
          if (value === current) return;
          if (props.value === undefined) setSingle(value);
          props.onValueChange?.(value);
        },
      };
    }
    const current = props.value ?? multiple;
    return {
      isPressed: (value) => current.includes(value),
      toggle: (value) => {
        const next = current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value];
        if (props.value === undefined) setMultiple(next);
        props.onValueChange?.(next);
      },
    };
  }, [props, single, multiple]);

  return (
    <ToggleGroupContext.Provider value={context}>
      {/* A group, not a radiogroup: every toggle stays a stop on the bar's roving focus */}
      <div role="group" aria-label={ariaLabel} data-slot="toolbar-toggle-group" className={cn("contents", className)}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

/** A hairline between groups of items. Runs across the bar's direction. */
export function ToolbarSeparator({ className }: { className?: string }) {
  const { orientation } = React.useContext(ToolbarContext);
  return (
    <div
      role="separator"
      aria-orientation={orientation === "vertical" ? "horizontal" : "vertical"}
      data-slot="toolbar-separator"
      className={cn(
        "mx-1 h-5 w-px shrink-0 bg-border",
        "group-data-[orientation=vertical]/toolbar:mx-0 group-data-[orientation=vertical]/toolbar:my-1 group-data-[orientation=vertical]/toolbar:h-px group-data-[orientation=vertical]/toolbar:w-5",
        className,
      )}
    />
  );
}
