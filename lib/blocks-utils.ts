import { blocks } from "./blocks";

export interface AdjacentBlocks {
  prev: { name: string; category: string } | null;
  next: { name: string; category: string } | null;
}

export function getAdjacentBlocks(name: string): AdjacentBlocks {
  const currentIndex = blocks.findIndex((block) => block.name === name);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prevBlock = currentIndex > 0 ? blocks[currentIndex - 1] : null;
  const nextBlock = currentIndex < blocks.length - 1 ? blocks[currentIndex + 1] : null;

  return {
    prev: prevBlock ? { name: prevBlock.name, category: prevBlock.category } : null,
    next: nextBlock ? { name: nextBlock.name, category: nextBlock.category } : null,
  };
}
