/** Shared pieces of listing titles and descriptions, so the numbers follow the catalog. */

export const formatCount = (count: number) => count.toLocaleString("en-US");

/** "A, B and C" from the first 3 names. */
export function namesList(names: readonly string[]): string {
  const picked = names.slice(0, 3);
  if (picked.length <= 1) return picked.join("");
  return `${picked.slice(0, -1).join(", ")} and ${picked.at(-1)}`;
}

/** A category name inside a sentence: "Real Estate" reads "real estate", "CTA" and "SaaS" keep their capitals. */
export function inSentence(label: string): string {
  return label
    .split(" ")
    .map((word) => (/[A-Z].*[A-Z]/.test(word) ? word : word.toLowerCase()))
    .join(" ");
}
