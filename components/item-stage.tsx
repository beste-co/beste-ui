"use client";

import { type ComponentType, useEffect, useState } from "react";

import { FitScale } from "@/components/fit-scale";
import { ReplayButton } from "@/components/replay-button";
import { ThemedPreview } from "@/components/theme/themed-preview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toneSwatch } from "@/lib/usage-snippet";

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
}: ItemStageProps) {
  const [toneOverride, setToneOverride] = useState<string | undefined>(undefined);
  // Remounts the live demo so a one-shot entrance plays again
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    setToneOverride(undefined);
  }, [name]);

  const activeTone = toneOverride ?? (demoProps?.tone as string | undefined) ?? defaultTone;
  const props: Record<string, unknown> = tones ? { ...demoProps, tone: activeTone } : (demoProps ?? {});

  return (
    <ThemedPreview className="relative flex min-h-svh items-center justify-center px-4 py-24 md:px-6">
      {fitToStage ? (
        <div className="h-[70svh] w-full max-w-6xl">
          <FitScale key={replay} className="size-full" padding={0}>
            <Component {...props} />
          </FitScale>
        </div>
      ) : (
        <Component key={replay} {...props} />
      )}

      {(isAnimated || (tones && tones.length > 0)) && (
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2 md:right-6 md:top-6">
          {tones && tones.length > 0 && (
            <Select value={activeTone} onValueChange={(v) => setToneOverride(v)}>
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
                      <span className="capitalize">{t}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {isAnimated && (
            <ReplayButton label="Reanimate" onClick={() => setReplay((value) => value + 1)} />
          )}
        </div>
      )}
    </ThemedPreview>
  );
}
