import { blocks, getBlock } from "@/lib/blocks";

/**
 * Public-build block registry.
 *
 * The private build renders previews from a class-obfuscated copy of each
 * block, so a non-subscriber can't lift the Tailwind classes straight out of
 * the DOM. Nothing here is paid, so there is nothing to obfuscate: the
 * protected registry and the real one are the same registry. Both of the private
 * module's exports are mirrored, since the browse surfaces import this one.
 */
export const getBlockObfuscated = getBlock;
export const blocksObfuscated = blocks;
