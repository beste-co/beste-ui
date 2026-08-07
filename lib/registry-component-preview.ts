/**
 * Registry component categories that preview like blocks: real size inside an
 * iframe with View/Code tabs, instead of the inline piece-style showcase.
 * Shared by server pages and client showcases, so keep this module plain.
 */
export const FRAME_PREVIEW_CATEGORIES: ReadonlySet<string> = new Set([
  "Card",
  "Dashboard",
  "Questionnaire",
]);
