"use client";

import { ItemStage } from "@/components/item-stage";
import { UsageSection } from "@/components/usage-section";
import { FRAME_PREVIEW_CATEGORIES } from "@/lib/registry-component-preview";
import { registryComponents } from "@/lib/registry-components";
import { usageSnippet } from "@/lib/usage-snippet";

function NotFound({ name }: { name: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-12 text-base text-muted-foreground">
      Component &quot;{name}&quot; not found.
    </div>
  );
}

/** The component on the stage, resolved on the client: its demo props can carry components. */
export function RegistryComponentStageView({ name }: { name: string }) {
  const entry = registryComponents.find((c) => c.name === name);
  if (!entry) return <NotFound name={name} />;
  const tones = entry.variants?.tone;
  return (
    <ItemStage
      name={name}
      component={entry.component}
      demoProps={entry.demoProps}
      tones={tones}
      // Components default to the first tone in their union.
      defaultTone={tones?.[0]}
      isAnimated={entry.isAnimated}
      // Cards and dashboard panels are drawn at a size a settings row never is.
      fitToStage={FRAME_PREVIEW_CATEGORIES.has(entry.category)}
    />
  );
}

export function RegistryComponentUsage({ name, className }: { name: string; className?: string }) {
  const entry = registryComponents.find((c) => c.name === name);
  if (!entry) return null;
  return (
    <UsageSection
      usage={entry.usage}
      usageBase={entry.usageBase}
      fallback={usageSnippet("component", name, entry.demoProps ?? {})}
      className={className}
    />
  );
}
