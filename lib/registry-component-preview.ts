/**
 * Registry component categories that preview like blocks: real size inside an
 * iframe with View/Code tabs, instead of the inline piece-style showcase.
 * Shared by server pages and client showcases, so keep this module plain.
 */
export const FRAME_PREVIEW_CATEGORIES: ReadonlySet<string> = new Set([
  "Background",
  "Card",
  "Dashboard",
  "Questionnaire",
]);

/**
 * Categories whose components are surfaces meant to sit behind content. The
 * stage and the playground let them fill the whole preview instead of fitting
 * them into a card-sized box, and the stage can lay demo content over them.
 */
export const BACKGROUND_PREVIEW_CATEGORIES: ReadonlySet<string> = new Set(["Background"]);
