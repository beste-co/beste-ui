import { getRegistryComponent } from "@/lib/registry-components";

export type {
  PlaygroundConfig,
  PlaygroundControl,
  PlaygroundControlKind,
  PlaygroundKey,
} from "@/lib/playground-types";
export { SURFACE_CONTROLS } from "@/lib/playground-types";

import type { PlaygroundConfig } from "@/lib/playground-types";

/**
 * The playground a component ships with, if it ships one.
 *
 * Read off the generated registry rather than a map kept here: the generator
 * already walks every component folder, so a new `{name}.playground.ts` is
 * picked up the next time it runs and nothing central has to be edited.
 */
export function getPlayground(name: string): PlaygroundConfig | undefined {
  return getRegistryComponent(name)?.playground;
}
