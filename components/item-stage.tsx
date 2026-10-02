"use client";

import { type ComponentType, useEffect, useState } from "react";

import { BackgroundDemoContent, type DemoContentTone } from "@/components/background-demo-content";
import { signature } from "@/components/component-playground";
import { DemoContentSwitch } from "@/components/demo-content-switch";
import { FitScale } from "@/components/fit-scale";
import { ReplayButton } from "@/components/replay-button";
import { StageCustomizer } from "@/components/stage-customizer";
import { ThemedPreview } from "@/components/theme/themed-preview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PlaygroundConfig } from "@/lib/playgrounds";
import { toneSwatch } from "@/lib/usage-snippet";
import { cn } from "@/lib/utils";

interface ItemStageProps {
  name: string;
  component: ComponentType<any>;
  demoProps?: Record<string, unknown>;
  /** The tones the item can be previewed in, when it has any. */
  tones?: string[];
  /** The tone shown when the demo props set none. */
  defaultTone?: string;
  /** One-shot entrances get a button that plays them again. */
  isAnimated?: boolean;
  /** Large surfaces are scaled to fit the stage rather than clipped. */
  fitToStage?: boolean;
  /** Background surfaces fill the whole stage and can carry demo content on top. */
  background?: boolean;
  /** How the demo content sits on a background surface */
  demoContentTone?: DemoContentTone;
  /** Full-frame pieces fill the whole stage like a background, without demo content. */
  fullBleed?: boolean;
  /** Background surfaces that read best on their own start with the demo content off. */
  demoContentOff?: boolean;
  /** Settings for the Customize popover; the preview itself is what they turn. */
  playground?: PlaygroundConfig;
  /** Card art fills its box, so it is shown inside a card the size it will be used at. */
  cardFrame?: boolean;
}

/**
 * A piece or component on the stage: centred in a viewport-tall surface in the
 * preview theme, with the tone picker and the replay button in the corner,
 * since both are ways of looking at the thing rather than facts about it.
 */
export function ItemStage({
  name,
  component: Component,
  demoProps,
  tones,
  defaultTone,
  isAnimated = false,
  fitToStage = false,
  background = false,
  demoContentTone,
  fullBleed = false,
  demoContentOff = false,
  playground,
  cardFrame = false,
}: ItemStageProps) {
  const [showContent, setShowContent] = useState(!demoContentOff);
  const [toneOverride, setToneOverride] = useState<string | undefined>(undefined);
  // Remounts the live demo so a one-shot entrance plays again
  const [replay, setReplay] = useState(0);
  // Props set from the Customize popover; null means the demo as shipped
  const [custom, setCustom] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    setToneOverride(undefined);
    setShowContent(!demoContentOff);
    setCustom(null);
  }, [name, demoContentOff]);

  const base = demoProps ?? {};
  const activeTone = toneOverride ?? ((custom ?? base).tone as string | undefined) ?? defaultTone;
  const merged = custom ?? base;
  const props: Record<string, unknown> = tones ? { ...merged, tone: activeTone } : merged;
  const dirty = custom !== null && signature(custom) !== signature(base);

  // The tone picker and a tone row in the popover stay one setting
  const changeCustom = (next: Record<string, unknown>) => {
    if (tones && typeof next.tone === "string" && next.tone !== activeTone) setToneOverride(next.tone);
    setCustom(next);
  };
  const resetCustom = () => {
    setCustom(null);
    setToneOverride(undefined);
  };

  // A customized preview is keyed by its props, so structural changes land; backgrounds read props live instead
  const previewKey = `${replay}-${custom ? signature(custom) : ""}`;

  const controls = isAnimated || background || (tones && tones.length > 0) || Boolean(playground);

  // The tone picker is folded into Customize; a playground without a tone row gets one here
  const customizer =
    playground && tones && tones.length > 0 && !playground.controls.some((control) => control.prop === "tone")
      ? {
          ...playground,
          controls: [
            { prop: "tone", label: "Tone", kind: tones.length <= 3 ? ("segmented" as const) : ("select" as const), options: tones.map((t) => (t === "none" ? { value: t, label: "No tone" } : t)), default: defaultTone, group: "Surface" },
            ...playground.controls,
          ],
        }
      : playground;

  return (
    <ThemedPreview className="relative flex min-h-[calc(100svh_-_78px)] items-center justify-center px-4 py-24 md:px-6">
      {background || fullBleed ? (
        <>
          <Component
            key={replay}
            {...props}
            className={cn(typeof props.className === "string" ? props.className : undefined, "absolute inset-0 h-full min-h-0")}
          />
          {background && showContent && <BackgroundDemoContent tone={demoContentTone} />}
        </>
      ) : fitToStage ? (
        <div className="h-[70svh] w-full max-w-6xl">
          <FitScale key={previewKey} className="size-full" padding={0}>
            <Component {...props} />
          </FitScale>
        </div>
      ) : cardFrame ? (
        <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-3xl bg-muted">
          <Component key={previewKey} {...props} />
        </div>
      ) : (
        <Component key={previewKey} {...props} />
      )}

      {controls && (
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2 md:right-6 md:top-6">
          {tones && tones.length > 0 && !playground && (
            <Select
              value={activeTone}
              onValueChange={(v) => {
                setToneOverride(v);
                if (custom) setCustom({ ...custom, tone: v });
              }}
            >
              {/* Both the trigger and the rows: the primitive ships
                  `cursor-default`, which on a menu reads as "not clickable". */}
              <SelectTrigger className="h-11 w-36 cursor-pointer rounded-full border-0 bg-muted/60 text-base shadow-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50">
                <SelectValue placeholder="Tone" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl">
                {tones.map((t) => (
                  <SelectItem key={t} value={t} className="cursor-pointer text-base">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 shrink-0 rounded-full border border-border"
                        style={{ background: toneSwatch(t) }}
                        aria-hidden="true"
                      />
                      <span className="capitalize">{t === "none" ? "No tone" : t}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {background && <DemoContentSwitch checked={showContent} onCheckedChange={setShowContent} />}
          {isAnimated && !background && (
            <ReplayButton
              onClick={() => setReplay((value) => value + 1)}
              className="rounded-full border-0 bg-muted text-foreground/70 hover:bg-muted hover:text-foreground"
            />
          )}
          {playground && (
            <StageCustomizer name={name} config={customizer ?? playground} props={props} onChange={changeCustom} onReset={resetCustom} dirty={dirty} />
          )}
        </div>
      )}
    </ThemedPreview>
  );
}
