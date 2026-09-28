"use client";

import { ArrowReloadHorizontalIcon, Copy01Icon, SlidersHorizontalIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";

import { PlaygroundControls, snippetFor } from "@/components/component-playground";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { PlaygroundConfig } from "@/lib/playgrounds";
import { cn } from "@/lib/utils";

interface StageCustomizerProps {
  /** Registry name, for the copied snippet. */
  name: string;
  config: PlaygroundConfig;
  props: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  onReset: () => void;
  /** Whether anything was changed, which is when Reset is offered. */
  dirty: boolean;
}

const ghostButton =
  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2 text-sm text-foreground/70 transition-colors outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50";

/**
 * The stage's settings: the component's props as inspector rows in a popover,
 * turning the live preview behind it. Not modal, so the preview stays usable.
 */
export function StageCustomizer({ name, config, props, onChange, onReset, dirty }: StageCustomizerProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippetFor(name, props, config));
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Popover modal={false}>
      <PopoverTrigger
        aria-label="Customize"
        title="Customize"
        className={cn(
          "relative inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-muted text-foreground/70 transition-colors outline-none",
          "hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-[state=open]:text-foreground",
        )}
      >
        <HugeiconsIcon icon={SlidersHorizontalIcon} size={14} strokeWidth={2} aria-hidden="true" />
        {dirty && <span aria-hidden="true" className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        collisionPadding={16}
        // Keeps focus on the preview's trigger side instead of jumping into the first row
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="flex max-h-[min(72svh,44rem)] w-[22rem] flex-col gap-0 overflow-hidden rounded-2xl border-0 bg-muted p-0 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-1">
          <span className="text-base font-medium select-none">Customize</span>
          {dirty && (
            <button type="button" onClick={onReset} className={ghostButton}>
              <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={14} strokeWidth={2} aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 [scrollbar-width:thin]">
          <PlaygroundControls config={config} props={props} onChange={onChange} groupTone="ghost" groupClassName="bg-background" />
        </div>
        <div className="flex items-center justify-between gap-3 px-4 pt-1 pb-3">
          <span className="text-sm text-muted-foreground select-none">Your settings, as code</span>
          <button type="button" onClick={copy} className={ghostButton}>
            <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={14} strokeWidth={2} aria-hidden="true" />
            {copied ? "Copied" : "Copy code"}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? "Code copied" : ""}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
