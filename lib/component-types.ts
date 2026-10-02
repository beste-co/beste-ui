/**
 * Component metadata types for the small, reusable "asset" components that
 * live alongside blocks. Unlike blocks (which are full page sections), these
 * are small composable widgets designed to be dropped into media slots inside
 * blocks — URL pills, status indicators, mini cards, etc.
 *
 * Each component has a .meta.ts file. The generation script scans
 * registry-pieces/ and produces lib/components.ts.
 */

export interface ComponentMeta {
  /** Unique identifier, matches directory name in kebab-case (e.g., "browser-url") */
  name: string;

  /** Export name of the component function (e.g., "BrowserUrl") */
  componentName?: string;

  /** Display title (e.g., "Browser URL") */
  title: string;

  /** Short description */
  description: string;

  /** Category for grouping (e.g., "Browser", "Badge", "Indicator", "Card") */
  category: string;

  /** NPM dependencies required by the component */
  dependencies?: string[];

  /** shadcn/ui component dependencies (e.g., ["badge"]) */
  registryDependencies?: string[];

  /**
   * Names of other registry-components this component composes. Each entry
   * must match a directory in `registry-components/`. The generators ship
   * those files alongside this component (block bundles and the standalone
   * `/component/r/{name}.json` route), so a single `shadcn add` installs the
   * component together with everything it imports.
   */
  registryComponents?: string[];

  /**
   * If true, the component is excluded from showcase listings (components
   * pages, search, favorites, related previews) but stays installable and
   * bundleable. Use for infrastructure components that only exist to be
   * composed by blocks or other components.
   */
  hidden?: boolean;

  /**
   * Hand-written "Import & use" snippet shown in the showcase. Should document
   * the real props API (callbacks, hrefs, tones) with short inline comments.
   * Falls back to an auto-generated snippet from the demo props when omitted.
   * This is the RADIX-flavor snippet (asChild composition where relevant).
   */
  usage?: string;

  /**
   * Base UI-flavor "Import & use" snippet (render-prop composition). Shown
   * when the Base UI toggle is active; falls back to `usage` when omitted.
   */
  usageBase?: string;

  /** If true, the component is Pro with obfuscated source code */
  isPro?: boolean;

  /**
   * If true, the component plays a one-shot animation on mount. Showcase
   * surfaces then offer a replay control that remounts the demo, so a reader
   * can watch it again without reloading the page.
   */
  isAnimated?: boolean;

  /**
   * How the stage's demo content reads on a Background component: "light" (white
   * text, the default, for dark surfaces) or "theme" (foreground text on a patch
   * of paper, for surfaces drawn on a light page) or "plain" (foreground text with
   * nothing behind it).
   */
  demoContentTone?: "light" | "theme" | "soft" | "plain";

  /**
   * Fill the whole component stage like a Background, without demo content on top.
   * For full-frame pieces (a scene, a painting) that read best at viewport size.
   */
  fullBleed?: boolean;

  /**
   * Background stage only: start with the demo content switched off. The Content
   * switch still turns it on; for surfaces that read best on their own first.
   */
  demoContentOff?: boolean;

  /**
   * Size of the demo inside its listing card, 0.2 to 2. The card lays the demo out
   * on a canvas of the card's size divided by this and scales it back, so 0.5 shows
   * the demo at half size and 1.5 zooms in. Leave it out and the card fits the demo
   * itself: natural size when it fits, shrunk when it does not.
   */
  cardScale?: number;
}

/**
 * Default dependencies that all components share.
 */
export const DEFAULT_COMPONENT_DEPENDENCIES = ["clsx", "tailwind-merge", "lucide-react"] as const;
