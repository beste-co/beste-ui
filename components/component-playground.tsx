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
import { ThemedPreview } from "@/components/theme/themed-preview";
import type { PlaygroundConfig, PlaygroundControl } from "@/lib/playgrounds";
import { FRAME_PREVIEW_CATEGORIES } from "@/lib/registry-component-preview";
import { registryComponents } from "@/lib/registry-components";
import { cn } from "@/lib/utils";

interface ComponentPlaygroundProps {
  /** Registry name, e.g. `inspector-slider`. */
  name: string;
  config: PlaygroundConfig;
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
function signature(value: Record<string, unknown>): string {
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
  if (Array.isArray(value)) return `  ${key}={${JSON.stringify(value)}}`;
  return `  ${key}={${JSON.stringify(value)}}`;
}

/**
 * The snippet for the props as they stand.
 *
 * Props sitting on the component's own default are left out, which is the whole
 * reason the config carries those defaults: a reader copying this should get the
 * three lines they need, not a dump of every prop the component has.
 */
function snippetFor(name: string, props: Record<string, unknown>, config: PlaygroundConfig) {
  const comp = pascal(name);
  const defaults = new Map(
    config.controls.filter((c) => c.default !== undefined).map((c) => [c.prop, c.default]),
  );

  const lines: string[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === "function") continue;
    if (defaults.has(key) && defaults.get(key) === value) continue;
    if (value === "") continue;
    const printed = printProp(key, value);
    if (printed) lines.push(printed);
  }

  const body = lines.length > 0 ? `<${comp}\n${lines.join("\n")}\n/>` : `<${comp} />`;
  return `import { ${comp} } from "@/components/beste/component/${name}";\n\n${body}`;
}

/** A framed, themed stage. Every preview on the page sits on the same one. */
function Stage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg border", className)}>
      <ThemedPreview className="relative size-full">
        <div className="relative flex size-full items-center justify-center p-6">{children}</div>
      </ThemedPreview>
    </div>
  );
}

export function ComponentPlayground({ name, config, className }: ComponentPlaygroundProps) {
  const entry = registryComponents.find((component) => component.name === name);
  const initial = React.useMemo(
    () => ({ ...(config.props ?? entry?.demoProps ?? {}) }) as Record<string, unknown>,
    [config.props, entry?.demoProps],
  );

  const [props, setProps] = React.useState<Record<string, unknown>>(initial);
  const dirty = signature(props) !== signature(initial);

  const set = (prop: string, value: unknown) => {
    setProps((current) => ({ ...current, [prop]: value }));
  };

  /*
   * The preview is keyed by the props it was given, so a change to a structural one
   * lands: most of these rows are uncontrolled by design and hold their own value,
   * and raising `max` on a live slider would otherwise leave the handle where the
   * old range put it. Remounting is what makes the panel honest.
   */
  const previewKey = signature(props);

  /** Controls in the order they were declared, gathered under their groups. */
  const groups = React.useMemo(() => {
    const map = new Map<string, PlaygroundControl[]>();
    for (const control of config.controls) {
      const key = control.group ?? "Props";
      const list = map.get(key);
      if (list) list.push(control);
      else map.set(key, [control]);
    }
    return [...map.entries()];
  }, [config.controls]);

  if (!entry) return null;
  const Component = entry.component as React.ComponentType<Record<string, unknown>>;
  const largeSurface = FRAME_PREVIEW_CATEGORIES.has(entry.category);

  const renderControl = (control: PlaygroundControl) => {
    const value = props[control.prop];
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
            value={typeof value === "string" ? value : undefined}
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
  };

  return (
    <section id="playground" className={cn("flex scroll-mt-8 flex-col gap-4", className)}>
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold leading-tight tracking-tight">Playground</h2>
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
          <Stage className={largeSurface ? "h-[420px]" : "h-[220px]"}>
            {largeSurface ? (
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
        <aside className="flex min-w-0 flex-col gap-2">
          {groups.map(([group, controls]) => (
            <InspectorGroup key={group} label={group} tone="outline">
              {controls.map(renderControl)}
            </InspectorGroup>
          ))}
        </aside>
      </div>

      {config.keys?.length ? (
        <div id="keyboard" className="mt-4 flex scroll-mt-8 flex-col gap-3">
          <div>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight">
              Keyboard and gestures
            </h2>
            <p className="mt-2 max-w-2xl text-lg text-foreground/70">
              Every one of these is in the component already. They are listed because a props
              table cannot mention a gesture, so nothing else on this page can tell you they
              exist.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full border-collapse text-left text-base">
              <tbody>
                {config.keys.map((entry) => (
                  <tr key={entry.keys} className="border-b last:border-0 align-top">
                    <th
                      scope="row"
                      className="w-56 px-3 py-2.5 font-medium whitespace-nowrap text-foreground"
                    >
                      {entry.keys}
                    </th>
                    <td className="px-3 py-2.5 text-foreground/70">{entry.does}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

    </section>
  );
}
