// The long-form category guides are hosted-site copy and describe Pro blocks; the public build renders none.
import type { CategoryGuide } from "./types";

export type { CategoryGuide, GuideBlock, RelatedCategory } from "./types";

export function getBlockCategoryGuide(_slug: string): CategoryGuide | undefined {
  return undefined;
}

export function getComponentCategoryGuide(_slug: string): CategoryGuide | undefined {
  return undefined;
}
