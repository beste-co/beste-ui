export type FontName =
  // Sans-serif fonts (29)
  | "haskoy"
  | "geist"
  | "inter"
  | "roboto"
  | "open-sans"
  | "poppins"
  | "source-sans-pro"
  | "lato"
  | "montserrat"
  | "nunito"
  | "raleway"
  | "ubuntu"
  | "work-sans"
  | "dm-sans"
  | "plus-jakarta-sans"
  | "manrope"
  | "outfit"
  | "karla"
  | "rubik"
  | "public-sans"
  | "red-hat-display"
  | "ibm-plex-sans"
  | "oxygen"
  | "quicksand"
  | "space-grotesk"
  | "lexend-deca"
  | "be-vietnam-pro"
  | "urbanist"
  | "google-sans"
  | "tomorrow"
  | "antic"
  | "architects-daughter"
  | "electrolize"
  | "chakra-petch"
  | "sora"
  | "lexend"
  | "alata"
  | "commissioner"
  | "ysabeau-infant"
  | "comfortaa"
  | "museomoderno"
  | "afacad-flux"

  // Serif fonts (25)
  | "fraunces"
  | "playwrite-de-grund"
  | "playwrite-ar"
  | "newsreader"
  | "macondo"
  | "barriecito"
  | "playfair-display"
  | "merriweather"
  | "crimson-text"
  | "libre-baskerville"
  | "lora"
  | "cormorant-garamond"
  | "eb-garamond"
  | "old-standard-tt"
  | "vollkorn"
  | "spectral"
  | "bitter"
  | "alegreya"
  | "neuton"
  | "cardo"
  | "frank-ruhl-libre"
  | "georgia"
  | "times-new-roman"
  | "bree-serif"
  | "caveat"
  | "bebas-neue"
  | "rokkitt"
  | "pt-serif"
  | "abril-fatface"
  | "cinzel"
  | "domine"
  | "arvo"
  | "ibm-plex-serif"
  | "josefin-slab"
  | "instrument-serif"
  | "biorhyme"
  | "noto-serif-georgian"
  | "source-serif-4"

  // Pixel/Display fonts (6)
  | "vt323"
  | "geist-pixel-triangle"
  | "geist-pixel-square"
  | "geist-pixel-grid"
  | "geist-pixel-line"
  | "geist-pixel-circle"

  // Mono fonts (9)
  | "jetbrains-mono"
  | "fira-code"
  | "source-code-pro"
  | "geist-mono"
  | "roboto-mono"
  | "inconsolata"
  | "space-mono"
  | "courier-prime"
  | "ibm-plex-mono"
  | "anonymous-pro";

export interface FontDefinition {
  name: FontName;
  displayName: string;
  category: "sans-serif" | "serif" | "monospace";
  weights: number[];
  /**
   * Weights that ship a real italic face (same family, font-style: italic).
   * When set, the Google Fonts URL requests the `ital` axis so applying
   * italic uses the true designed italic instead of a synthetic oblique.
   */
  italicWeights?: number[];
  googleFontName?: string; // Optional for custom fonts
  customFontPath?: string; // Path to custom font files
  isCustomFont?: boolean; // Flag to identify custom fonts
  fontFileExtension?: "ttf" | "woff2"; // Font file extension (default: "ttf")
  fallback: string;
  description: string;
}

export interface FontSet {
  sans: FontDefinition;
  serif: FontDefinition;
  mono: FontDefinition;
}

export interface FontContextType {
  currentFontSet: FontSet;
  setFontSet: (fontSet: Partial<FontSet>) => void;
  availableFonts: FontDefinition[];
  getFontCSS: () => string;
}
