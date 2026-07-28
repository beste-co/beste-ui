/**
 * Public-build embeddings: the type, and nothing else.
 *
 * The private module loads transformers.js and a local bge model to embed
 * queries at request time. Neither is published, but `AssetType` is imported
 * from here by callers that never touch the model, so the name survives and
 * the model does not.
 */

export type { AssetType } from "@/lib/search-index";
