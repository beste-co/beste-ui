"use client";

import type { ComponentType } from "react";

import { ComponentPlayground } from "@/components/component-playground";
import { components } from "@/lib/components";
import type { PlaygroundConfig } from "@/lib/playground-types";

/**
 * A playground for a piece.
 *
 * The lookup lives here rather than in `ComponentPlayground` so that file stays
 * clear of the piece registry: it is a client component shared with the
 * registry-components pages, and importing a thousand pieces into it would put
 * all of them in a bundle that has no use for any.
 *
 * `PieceStageView` already resolves the same way on this page, so the piece
 * registry is not a new cost here.
 */
export function PiecePlayground({
  name,
  config,
  className,
}: {
  name: string;
  config: PlaygroundConfig;
  className?: string;
}) {
  const entry = components.find((item) => item.name === name);
  if (!entry) return null;

  return (
    <ComponentPlayground
      name={name}
      config={config}
      component={entry.component as ComponentType<Record<string, unknown>>}
      demoProps={entry.demoProps}
      fill
      className={className}
    />
  );
}
