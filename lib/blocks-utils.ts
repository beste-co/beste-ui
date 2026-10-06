import { blocks } from "./blocks";
import { STUDIO_SET_BLOCKS } from "./block-sets";

export interface AdjacentBlocks {
  prev: { name: string; category: string } | null;
  next: { name: string; category: string } | null;
}

/**
 * The blocks either side of this one, skipping any that belong to no collection:
 * those are the older generation, still reachable from listings and search, but
 * not what the arrows should walk into. From an older block the arrows lead to
 * the nearest collection block in each direction.
 */
export function getAdjacentBlocks(name: string): AdjacentBlocks {
  const currentIndex = blocks.findIndex((block) => block.name === name);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  // A catalogue with no collections at all (the open-source export) walks every block
  const inWalk = (blockName: string) => STUDIO_SET_BLOCKS.size === 0 || STUDIO_SET_BLOCKS.has(blockName);

  let prevBlock = null;
  for (let index = currentIndex - 1; index >= 0 && !prevBlock; index--) {
    const block = blocks[index];
    if (block && inWalk(block.name)) prevBlock = block;
  }

  let nextBlock = null;
  for (let index = currentIndex + 1; index < blocks.length && !nextBlock; index++) {
    const block = blocks[index];
    if (block && inWalk(block.name)) nextBlock = block;
  }

  return {
    prev: prevBlock ? { name: prevBlock.name, category: prevBlock.category } : null,
    next: nextBlock ? { name: nextBlock.name, category: nextBlock.category } : null,
  };
}
