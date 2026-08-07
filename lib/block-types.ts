/**
 * Block metadata types for auto-generation system.
 *
 * Each component has a .meta.ts file that exports metadata.
 * The generation script uses this to create:
 * - lib/blocks.ts (runtime metadata with component references)
 * - registry.json (shadcn registry format for CLI)
 */

/**
 * Metadata defined in each component's .meta.ts file.
 * This is the single source of truth for all block information.
 */
export interface BlockMeta {
  /** Unique identifier, matches directory name (e.g., "ecommerce14") */
  name: string;

  /** Export name of the component function (e.g., "ComingSoon1", "Feature22") */
  componentName?: string;

  /** Display title (e.g., "Ecommerce 14") */
  title: string;

  /** Short description of the component */
  description: string;

  /** Category for grouping (e.g., "Ecommerce", "Hero", "Feature") */
  category: string;

  /** NPM dependencies required by the component */
  dependencies?: string[];

  /** shadcn/ui component dependencies (e.g., ["button", "badge"]) */
  registryDependencies?: string[];

  /**
   * Names of registry-pieces embedded as media inside this block.
   * Each entry must match a directory in `registry-pieces/`. The generator
   * pulls those source files into the block's registry item so a single
   * `shadcn add` ships the block plus every asset it consumes.
   */
  componentDependencies?: string[];

  /**
   * Names of registry-components (reusable design-system primitives such as
   * buttons/badges/inputs) used by this block. Each entry must match a
   * directory in `registry-components/`. The generator ships those source
   * files in the block's registry item with the install target
   * `components/beste/component/{name}.tsx`, so a single `shadcn add` pulls
   * the block plus every primitive it imports.
   */
  registryComponents?: string[];

  /** If true, the block will be rendered in an iframe for proper fullscreen display */
  fullscreen?: boolean;

  /** Preview alignment for mobile cards: 'top' (default) or 'bottom' */
  previewAlign?: "top" | "bottom";

  /** If true, the block is a Pro block with obfuscated source code */
  isPro?: boolean;

  /**
   * Cross-category hub labels this block belongs to, e.g. ["questionnaire"].
   * Category keywords already generate tag archives on their own; this is for
   * a set of blocks that share a mechanic rather than a category, which no
   * keyword could gather. Each one gets a page at /blocks/tag/{slug}.
   */
  tags?: string[];
}

/**
 * Default dependencies that all blocks share.
 * These are automatically included in registry.json if not overridden.
 */
export const DEFAULT_DEPENDENCIES = [
  "clsx",
  "tailwind-merge",
  "lucide-react",
] as const;

/**
 * Configuration for a single variant option
 */
export interface VariantOption {
  value: string;
  label: string;
}

/**
 * Configuration for a single variant field
 */
export interface VariantField {
  label: string;
  type: "select";
  options: VariantOption[];
  default: string;
}

/**
 * Configuration for block variants
 */
export type VariantConfig = Record<string, VariantField>;
