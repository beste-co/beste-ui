import { getBlock } from "@/lib/blocks";

/**
 * Public-build block lookup.
 *
 * The private build renders previews from a class-obfuscated copy of each
 * block, so a non-subscriber can't lift the Tailwind classes straight out of
 * the DOM. Nothing here is paid, so there is nothing to obfuscate: the
 * protected lookup and the real one are the same lookup.
 */
export const getBlockObfuscated = getBlock;
