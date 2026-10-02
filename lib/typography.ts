/**
 * The site's type scale. Every page title, lead, section heading and card title
 * takes its classes from here; spacing, colour and layout stay on the element.
 * One weight across the site: font-medium. Tracking only on h1/h2, never in cards.
 *
 * Reading text (docs `Prose`, blog `Mdx`) follows the same steps: 16px body
 * over leading-7, `##` at h2, `###` at h3. README docs (`Mdx compact`) sit a step
 * smaller: 14px body over leading-6, `##` at h3, code at `text-sm/7`. The home hero
 * and closing CTA are the only display-size type and set their own.
 */
export const typography = {
  /** Page title. */
  h1: "text-2xl font-medium leading-tight tracking-tight md:text-3xl",
  /** The paragraph under a page title. */
  lead: "text-base text-muted-foreground md:text-lg",
  /** Section heading inside a page. */
  h2: "text-xl font-medium leading-tight tracking-tight md:text-2xl",
  /** Card, panel and sub-section title. */
  h3: "text-lg font-medium leading-snug",
  /** Title of a catalogue card: a block, piece, component or page in a grid. */
  cardTitle: "text-base font-medium leading-snug",
  /** The description under a catalogue card's title. */
  cardText: "text-sm text-muted-foreground",
  /** Running text. */
  body: "text-base",
  /** Card descriptions, counts, dates and other secondary copy. */
  meta: "text-sm text-muted-foreground",
} as const;
