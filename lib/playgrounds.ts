import { getComponent } from "@/lib/components";
import { getRegistryComponent } from "@/lib/registry-components";

export type {
  PlaygroundConfig,
  PlaygroundControl,
  PlaygroundControlKind,
  PlaygroundKey,
  PlaygroundStage,
} from "@/lib/playground-types";
export {
  PIECE_GLASS_STAGE,
  PIECE_SURFACE_CONTROLS,
  SURFACE_CONTROLS,
} from "@/lib/playground-types";

import type { PlaygroundConfig } from "@/lib/playground-types";

/**
 * The playground a component or a piece ships with, if it ships one.
 *
 * Read off the generated registries rather than a map kept here: the generator
 * already walks every folder in both, so a new `{name}.playground.ts` is picked
 * up the next time it runs and nothing central has to be edited.
 *
 * The two families keep separate name spaces and separate routes, so a lookup
 * that misses in one is asked of the other rather than being an error.
 */
export function getPlayground(name: string): PlaygroundConfig | undefined {
  return getRegistryComponent(name)?.playground ?? getComponent(name)?.playground;
}
