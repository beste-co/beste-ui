"use client";

import { ItemStage } from "@/components/item-stage";
import { UsageSection } from "@/components/usage-section";
import { components } from "@/lib/components";
import { usageSnippet } from "@/lib/usage-snippet";

function NotFound({ name }: { name: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-12 text-base text-muted-foreground">
      Piece &quot;{name}&quot; not found.
    </div>
  );
}

/** The piece on the stage, resolved on the client: its demo props can carry components. */
export function PieceStageView({ name }: { name: string }) {
  const entry = components.find((c) => c.name === name);
  if (!entry) return <NotFound name={name} />;
  return (
    <ItemStage
      name={name}
      component={entry.component}
      demoProps={entry.demoProps}
      tones={entry.variants?.tone}
      isAnimated={entry.isAnimated}
    />
  );
}

export function PieceUsage({ name, className }: { name: string; className?: string }) {
  const entry = components.find((c) => c.name === name);
  if (!entry) return null;
  return (
    <UsageSection
      usage={entry.usage}
      usageBase={entry.usageBase}
      fallback={usageSnippet("piece", name, entry.demoProps ?? {})}
      className={className}
    />
  );
}
