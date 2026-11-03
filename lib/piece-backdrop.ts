const GRADIENTS = "https://oud.pics/b/gradients/gradient-";

/** Live backgrounds a piece can sit on, named in `backdrop` instead of an image URL. */
export const ANIMATED_BACKDROPS = ["mesh", "ink", "wave", "frosted", "fluid"] as const;
export type AnimatedBackdrop = (typeof ANIMATED_BACKDROPS)[number];

// Light and mid-tone images only, so a piece that draws text straight on the stage stays readable
const IMAGE_BACKDROPS = [
  "silk-champagne",
  "dunes-dawn",
  "silk-sage",
  "silk-slate",
  "silk-clay",
  "silk-orange",
].map((name) => `${GRADIENTS}${name}.webp`);

// Art that is the picture itself, or already fills its own card
const PLAIN_CATEGORIES = new Set(["Isometric", "Shapes", "Logo", "Mascot"]);

export function isAnimatedBackdrop(value: string): value is AnimatedBackdrop {
  return (ANIMATED_BACKDROPS as readonly string[]).includes(value);
}

/** What a piece is previewed on: its own `backdrop`, else a stable pick from the library; an image URL or a live background name. */
export function pieceBackdrop(piece: { name: string; category: string; backdrop?: string; fullBleed?: boolean }) {
  if (piece.backdrop === "none") return undefined;
  if (piece.backdrop) return piece.backdrop;
  if (piece.fullBleed || PLAIN_CATEGORIES.has(piece.category)) return undefined;
  let hash = 0;
  for (const char of piece.name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  hash = Math.abs(hash);
  // Three in four pieces get a live background; the rest keep a still gradient for variety
  if (hash % 4 !== 0) return ANIMATED_BACKDROPS[Math.floor(hash / 4) % ANIMATED_BACKDROPS.length];
  return IMAGE_BACKDROPS[Math.floor(hash / 4) % IMAGE_BACKDROPS.length];
}
