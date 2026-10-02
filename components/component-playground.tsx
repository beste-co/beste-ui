"use client";

import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { InspectorColor } from "@/components/beste/component/inspector-color";
import { InspectorGroup } from "@/components/beste/component/inspector-group";
import { InspectorInput } from "@/components/beste/component/inspector-input";
import { InspectorSegmented } from "@/components/beste/component/inspector-segmented";
import { InspectorSelect } from "@/components/beste/component/inspector-select";
import { InspectorSlider } from "@/components/beste/component/inspector-slider";
import { InspectorStepper } from "@/components/beste/component/inspector-stepper";
import { InspectorSwitch } from "@/components/beste/component/inspector-switch";
import { InspectorToggles } from "@/components/beste/component/inspector-toggles";
import { CodeBlock } from "@/components/code-block";
import { FitScale } from "@/components/fit-scale";
import { StageMesh } from "@/components/stage-mesh";
import { ThemedPreview } from "@/components/theme/themed-preview";
import type { PlaygroundConfig, PlaygroundControl, PlaygroundStage } from "@/lib/playgrounds";
import { BACKGROUND_PREVIEW_CATEGORIES, FRAME_PREVIEW_CATEGORIES } from "@/lib/registry-component-preview";
import { registryComponents } from "@/lib/registry-components";
import { cn } from "@/lib/utils";
import { typography } from "@/lib/typography";

interface ComponentPlaygroundProps {
  /** Registry name, e.g. `inspector-slider`. */
  name: string;
  config: PlaygroundConfig;
  /**
   * Passed by callers whose entry is not in the registry-components family, so
   * this file never imports the piece registry: it is a client component, and
   * every page that renders a playground would carry all of it.
   */
  component?: React.ComponentType<Record<string, unknown>>;
  demoProps?: Record<string, unknown>;
  /**
   * Fill the stage rather than being scaled into it. A piece is built to fill a
   * media slot, so the stage is the slot.
   */
  fill?: boolean;
  className?: string;
}

function pascal(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/** The options a choice control was given, in one shape. */
function optionList(control: PlaygroundControl) {
  return (control.options ?? []).map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
}

/*
 * What a control reads before anyone touches it.
 *
 * A prop the demo does not set arrives here as `undefined`, and the numeric controls
 * used to fall back to `min` — so `columns`, documented as three, opened the panel at
 * one, and the playground contradicted the prop table beside it while the component
 * quietly used three. The control's `default` *is* the component's own default, so it
 * is what an untouched control should show. (`segmented` already did this; these two
 * are catching up with it.)
 *
 * Note this only changes what is displayed: the prop stays absent from `props` until
 * it is turned, so the snippet still leaves defaults out.
 */
function numberFor(control: PlaygroundControl, value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof control.default === "number") return control.default;
  return control.min ?? 0;
}

function stringFor(control: PlaygroundControl, value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof control.default === "string") return control.default;
  return "";
}

/**
 * A comparable string for a set of props.
 *
 * Plain `JSON.stringify` was doing this, and it crashed the page for any component
 * whose demo hands a prop a piece of rendered markup: a React element carries an
 * owner chain that is circular in development, so serialising one throws. That is a
 * real shape — a tab's content, a row's children — and the panel has no business
 * caring what is inside it, so elements and functions are reduced to a token here
 * and cycles are cut. The result is only ever compared with another of itself.
 */
export function signature(value: Record<string, unknown>): string {
  const seen = new WeakSet<object>();
  try {
    return JSON.stringify(value, (_key, item) => {
      if (typeof item === "function") return "[function]";
      if (item && typeof item === "object") {
        if ("$$typeof" in item) return "[node]";
        if (seen.has(item)) return "[circular]";
        seen.add(item);
      }
      return item;
    });
  } catch {
    /*
     * Nothing left here is worth a broken page. A constant stands in: the reset
     * button stops being offered and the preview stops being re-keyed, which are
     * both things a reader can live without.
     */
    return "[unserializable]";
  }
}

/** One prop, printed the way it would be written in JSX. */
function printProp(key: string, value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === "boolean") return value ? `  ${key}` : null;
  if (typeof value === "number") return `  ${key}={${value}}`;
  if (typeof value === "string") return `  ${key}="${value}"`;
  // Elements and components have no JSON form, and a dev element's owner chain is circular
  if (typeof value === "object" && ("$$typeof" in value || "render" in value)) {
    const named = value as { displayName?: string; name?: string };
    return `  ${key}={${named.displayName ?? named.name ?? "..."}}`;
  }
  try {
    return `  ${key}={${JSON.stringify(value)}}`;
  } catch {
    return `  ${key}={...}`;
  }
}

/**
 * The snippet for the props as they stand.
 *
 * Props sitting on the component's own default are left out, which is the whole
 * reason the config carries those defaults: a reader copying this should get the
 * three lines they need, not a dump of every prop the component has.
 */
export function snippetFor(name: string, props: Record<string, unknown>, config: PlaygroundConfig) {
  const comp = pascal(name);
  const defaults = new Map(
    config.controls.filter((c) => c.default !== undefined).map((c) => [c.prop, c.default]),
  );

  // A prop whose control is switched off by another prop has no effect, so it is not printed
  const idle = new Set(
    config.controls.filter((c) => c.when && props[c.when.prop] !== c.when.equals).map((c) => c.prop),
  );

  const lines: string[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === "function") continue;
    if (idle.has(key)) continue;
    if (defaults.has(key) && defaults.get(key) === value) continue;
    if (value === "") continue;
    const printed = printProp(key, value);
    if (printed) lines.push(printed);
  }

  const body = lines.length > 0 ? `<${comp}\n${lines.join("\n")}\n/>` : `<${comp} />`;
  return `import { ${comp} } from "@/components/beste/component/${name}";\n\n${body}`;
}

/** A control's prop may point into an array, e.g. `colors.2` for the third color. */
function readProp(props: Record<string, unknown>, path: string) {
  const [key = path, index] = path.split(".");
  const value = props[key];
  return index !== undefined && Array.isArray(value) ? value[Number(index)] : value;
}

export function writeProp(props: Record<string, unknown>, path: string, next: unknown) {
  const [key = path, index] = path.split(".");
  if (index === undefined) return { ...props, [key]: next };
  const list = Array.isArray(props[key]) ? [...(props[key] as unknown[])] : [];
  list[Number(index)] = next;
  return { ...props, [key]: list };
}

/** A control with a `when` only applies while the prop it names has that value. */
function shown(control: PlaygroundControl, props: Record<string, unknown>) {
  return !control.when || readProp(props, control.when.prop) === control.when.equals;
}

function renderControl(control: PlaygroundControl, props: Record<string, unknown>, set: (prop: string, value: unknown) => void) {
  const value = readProp(props, control.prop);
  const common = { label: control.label, size: "sm" as const };

  switch (control.kind) {
    case "slider":
      return (
        <InspectorSlider
          key={control.prop}
          {...common}
          min={control.min ?? 0}
          max={control.max ?? 100}
          step={control.step ?? 1}
          unit={control.unit}
          ticks={false}
          value={numberFor(control, value)}
          onValueChange={(next) => set(control.prop, next)}
        />
      );
    case "stepper":
      return (
        <InspectorStepper
          key={control.prop}
          {...common}
          min={control.min}
          max={control.max}
          step={control.step ?? 1}
          suffix={control.unit}
          value={numberFor(control, value)}
          onValueChange={(next) => set(control.prop, next)}
        />
      );
    case "switch":
      return (
        <InspectorSwitch
          key={control.prop}
          {...common}
          checked={Boolean(value)}
          onCheckedChange={(next) => set(control.prop, next)}
        />
      );
    case "select":
      return (
        <InspectorSelect
          key={control.prop}
          {...common}
          options={optionList(control)}
          value={stringFor(control, value)}
          onValueChange={(next) => set(control.prop, next)}
        />
      );
    case "segmented":
      return (
        <InspectorSegmented
          key={control.prop}
          {...common}
          options={optionList(control)}
          value={stringFor(control, value)}
          onValueChange={(next) => set(control.prop, next)}
        />
      );
    case "toggles":
      return (
        <InspectorToggles
          key={control.prop}
          {...common}
          options={optionList(control)}
          value={Array.isArray(value) ? (value as string[]) : []}
          onValueChange={(next) => set(control.prop, next)}
        />
      );
    case "color":
      return (
        <InspectorColor
          key={control.prop}
          {...common}
          swatches={control.swatches}
          value={typeof value === "string" ? value : control.placeholder}
          onValueChange={(next) => set(control.prop, next)}
        />
      );
    default:
      return (
        <InspectorInput
          key={control.prop}
          {...common}
          placeholder={control.placeholder}
          value={stringFor(control, value)}
          onValueChange={(next) => set(control.prop, next)}
        />
      );
  }
}

/** Controls in the order they were declared, gathered under their groups. */
function groupControls(controls: PlaygroundControl[]) {
  const map = new Map<string, PlaygroundControl[]>();
  for (const control of controls) {
    const key = control.group ?? "Props";
    const list = map.get(key);
    if (list) list.push(control);
    else map.set(key, [control]);
  }
  return [...map.entries()];
}

/**
 * The settings for a playground, as groups of inspector rows. Used by the stage's
 * Customize popover and by the piece playground, so both turn the same props the same way.
 */
export function PlaygroundControls({
  config,
  props,
  onChange,
  groupTone = "outline",
  groupClassName,
  className,
}: {
  config: PlaygroundConfig;
  props: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  /** Surface of each group; the stage popover draws them as plain cards on a muted panel. */
  groupTone?: "muted" | "outline" | "ghost";
  groupClassName?: string;
  className?: string;
}) {
  const groups = React.useMemo(() => groupControls(config.controls), [config.controls]);
  const set = (prop: string, value: unknown) => onChange(writeProp(props, prop, value));
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      {groups.map(([group, controls]) => (
        <InspectorGroup key={group} label={group} tone={groupTone} className={groupClassName}>
          {controls.filter((control) => shown(control, props)).map((control) => renderControl(control, props, set))}
        </InspectorGroup>
      ))}
    </div>
  );
}

/** The keyboard and gesture table: documentation a props table cannot carry. */
export function PlaygroundKeys({ keys, className }: { keys: PlaygroundConfig["keys"]; className?: string }) {
  if (!keys?.length) return null;
  return (
    <div id="keyboard" className={cn("flex scroll-mt-8 flex-col gap-3", className)}>
      <div>
        <h2 className={typography.h2}>Keyboard and gestures</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Every one of these is in the component already. They are listed because a props table
          cannot mention a gesture, so nothing else on this page can tell you they exist.
        </p>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full border-collapse text-left text-sm">
          <tbody>
            {keys.map((entry) => (
              <tr key={entry.keys} className="border-b align-top last:border-0">
                <th scope="row" className="w-56 px-3 py-2.5 font-medium whitespace-nowrap text-foreground">
                  {entry.keys}
                </th>
                <td className="px-3 py-2.5 text-foreground/70">{entry.does}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** The config's backdrop, while the props it waits for hold. */
export function activeStage(config: PlaygroundConfig | undefined, props: Record<string, unknown>): PlaygroundStage | undefined {
  const stage = config?.stage;
  return stage && Object.entries(stage.when ?? {}).every(([prop, value]) => props[prop] === value) ? stage : undefined;
}

/** A framed, themed stage. Every preview on the page sits on the same one. */
function Stage({
  children,
  backdrop,
  className,
}: {
  children: React.ReactNode;
  /** Preview-only picture behind the component. Never reaches its props. */
  backdrop?: PlaygroundStage;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg border", className)}>
      <ThemedPreview className="relative size-full">
        {backdrop?.effect === "mesh-gradient" ? (
          <StageMesh />
        ) : backdrop?.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={backdrop.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}
        <div className="relative flex size-full items-center justify-center p-6">{children}</div>
      </ThemedPreview>
    </div>
  );
}

export function ComponentPlayground({
  name,
  config,
  component,
  demoProps,
  fill = false,
  className,
}: ComponentPlaygroundProps) {
  const entry = registryComponents.find((item) => item.name === name);
  const Given = component ?? (entry?.component as typeof component);
  const fallbackProps = demoProps ?? entry?.demoProps;
  const initial = React.useMemo(
    () => ({ ...(config.props ?? fallbackProps ?? {}) }) as Record<string, unknown>,
    [config.props, fallbackProps],
  );

  const [props, setProps] = React.useState<Record<string, unknown>>(initial);
  const dirty = signature(props) !== signature(initial);

  /*
   * The preview is keyed by the props it was given, so a change to a structural one
   * lands: most of these rows are uncontrolled by design and hold their own value,
   * and raising `max` on a live slider would otherwise leave the handle where the
   * old range put it. Remounting is what makes the panel honest.
   */
  const previewKey = signature(props);

  if (!Given) return null;
  const Component = Given as React.ComponentType<Record<string, unknown>>;
  // Full-frame pieces fill the stage the same way backgrounds do
  const background = !fill && (BACKGROUND_PREVIEW_CATEGORIES.has(entry?.category ?? "") || Boolean(entry?.fullBleed));
  const largeSurface = !fill && !background && FRAME_PREVIEW_CATEGORIES.has(entry?.category ?? "");

  /*
   * The backdrop answers to the props the reader has set, so switching the
   * surface to glass puts something behind the panel to actually be frosted.
   */
  const backdrop = activeStage(config, props);


  return (
    <section id="playground" className={cn("flex scroll-mt-8 flex-col gap-4", className)}>
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className={typography.h2}>Playground</h2>
          <p className="mt-2 max-w-2xl text-lg text-foreground/70">
            Turn the props on the right; the snippet under them is what you would write to get
            what you see.
          </p>
        </div>
        {dirty ? (
          <button
            type="button"
            onClick={() => setProps(initial)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-base",
              "text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={14} strokeWidth={2} aria-hidden="true" />
            Reset
          </button>
        ) : null}
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="flex min-w-0 flex-col gap-4">
          {/*
            A settings row is narrow and short, so the stage is: `max-w-sm` keeps
            it from stretching across the panel, which is how one of these is used
            anyway. A card or a dashboard panel is neither, and in that box it was
            squeezed into a fifth of its natural size — so those get a taller
            stage, the full width, and a scale that fits them into it.
          */}
          <Stage
            backdrop={backdrop}
            className={fill || largeSurface || background ? "h-[420px]" : "h-[220px]"}
          >
            {background ? (
              // Backgrounds read their props live, so the running surface is kept instead of remounted
              <Component
                {...props}
                className={cn(typeof props.className === "string" ? props.className : undefined, "absolute inset-0 h-full min-h-0")}
              />
            ) : fill ? (
              <div key={previewKey} className="size-full">
                <Component {...props} />
              </div>
            ) : largeSurface ? (
              <FitScale key={previewKey} className="size-full" padding={0}>
                <Component {...props} />
              </FitScale>
            ) : (
              <div key={previewKey} className="w-full max-w-sm">
                <Component {...props} />
              </div>
            )}
          </Stage>

          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-base font-medium text-foreground/70">Usage</span>
            </div>
            <div className="overflow-hidden rounded-lg">
              <CodeBlock code={snippetFor(name, props, config)} language="tsx" fit />
            </div>
          </div>
        </div>

        {/*
          The panel is built from the family it documents: every control here is one
          of the rows on the stage beside it, which is both the cheapest way to build
          this and the most honest test of the set.
        */}
        <aside className="min-w-0">
          <PlaygroundControls config={config} props={props} onChange={setProps} />
        </aside>
      </div>

      <PlaygroundKeys keys={config.keys} className="mt-4" />

    </section>
  );
}
