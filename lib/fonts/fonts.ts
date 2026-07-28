import type { FontDefinition, FontName, FontSet } from "./types";

export const fontDefinitions: Record<FontName, FontDefinition> = {
  // Sans-serif fonts (29)

  fraunces: {
    name: "fraunces",
    displayName: "Fraunces",
    category: "serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Fraunces",
    fallback: "ui-serif, Georgia, serif",
    description: "Expressive display serif with soft contrast and warmth",
  },

  "playwrite-de-grund": {
    name: "playwrite-de-grund",
    displayName: "Playwrite DE Grund",
    category: "serif",
    weights: [100, 200, 300, 400],
    googleFontName: "Playwrite DE Grund",
    fallback: "ui-serif, Georgia, serif",
    description: "German primary-school handwriting style, soft and personal",
  },

  "playwrite-ar": {
    name: "playwrite-ar",
    displayName: "Playwrite AR",
    category: "serif",
    weights: [100, 200, 300, 400],
    googleFontName: "Playwrite AR",
    fallback: "ui-serif, Georgia, serif",
    description: "Argentinian primary-school handwriting style, casual and warm",
  },

  haskoy: {
    name: "haskoy",
    displayName: "Haskoy",
    category: "sans-serif",
    weights: [100, 200, 400, 500, 600, 700, 800, 900],
    isCustomFont: true,
    customFontPath: "/fonts/haskoy",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Modern geometric sans serif with Turkish design heritage",
  },

  geist: {
    name: "geist",
    displayName: "Geist",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Geist",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Modern sans serif font by Vercel, clean and readable",
  },

  inter: {
    name: "inter",
    displayName: "Inter",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Inter",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Modern, clean, and highly readable",
  },

  roboto: {
    name: "roboto",
    displayName: "Roboto",
    category: "sans-serif",
    weights: [400, 500, 700],
    italicWeights: [400, 500, 700],
    googleFontName: "Roboto",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Google's signature font, friendly and approachable",
  },

  "open-sans": {
    name: "open-sans",
    displayName: "Open Sans",
    category: "sans-serif",
    weights: [400, 600, 700],
    italicWeights: [400, 600, 700],
    googleFontName: "Open Sans",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Humanist sans serif, optimized for legibility",
  },

  poppins: {
    name: "poppins",
    displayName: "Poppins",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Poppins",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Geometric sans serif, perfect for modern designs",
  },

  "source-sans-pro": {
    name: "source-sans-pro",
    displayName: "Source Sans Pro",
    category: "sans-serif",
    weights: [400, 600, 700],
    googleFontName: "Source Sans Pro",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Adobe's first open source font family",
  },

  lato: {
    name: "lato",
    displayName: "Lato",
    category: "sans-serif",
    weights: [400, 700],
    italicWeights: [400, 700],
    googleFontName: "Lato",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Semi-rounded details, serious but friendly",
  },

  montserrat: {
    name: "montserrat",
    displayName: "Montserrat",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Montserrat",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Urban typography inspired by Buenos Aires",
  },

  nunito: {
    name: "nunito",
    displayName: "Nunito",
    category: "sans-serif",
    weights: [400, 600, 700],
    italicWeights: [400, 600, 700],
    googleFontName: "Nunito",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Rounded sans serif, well balanced and versatile",
  },

  raleway: {
    name: "raleway",
    displayName: "Raleway",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Raleway",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Elegant sans serif with thin weight",
  },

  ubuntu: {
    name: "ubuntu",
    displayName: "Ubuntu",
    category: "sans-serif",
    weights: [400, 500, 700],
    italicWeights: [400, 500, 700],
    googleFontName: "Ubuntu",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Humanist characteristics, warm and modern",
  },

  "work-sans": {
    name: "work-sans",
    displayName: "Work Sans",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Work Sans",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Optimized for on-screen text, highly legible",
  },

  "dm-sans": {
    name: "dm-sans",
    displayName: "DM Sans",
    category: "sans-serif",
    weights: [400, 500, 700],
    italicWeights: [400, 500, 700],
    googleFontName: "DM Sans",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Low-contrast, geometric sans serif",
  },

  "plus-jakarta-sans": {
    name: "plus-jakarta-sans",
    displayName: "Plus Jakarta Sans",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Plus Jakarta Sans",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Modern, versatile sans serif with Indonesian roots",
  },

  manrope: {
    name: "manrope",
    displayName: "Manrope",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    googleFontName: "Manrope",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Modern geometric sans serif, perfect for UI",
  },

  outfit: {
    name: "outfit",
    displayName: "Outfit",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    googleFontName: "Outfit",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Contemporary sans serif with rounded edges",
  },

  karla: {
    name: "karla",
    displayName: "Karla",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Karla",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Grotesque sans serif, clean and versatile",
  },

  rubik: {
    name: "rubik",
    displayName: "Rubik",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Rubik",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Slightly rounded corners, modern feel",
  },

  // Pixel/Display fonts (6)

  vt323: {
    name: "vt323",
    displayName: "VT323",
    category: "sans-serif",
    weights: [400],
    googleFontName: "VT323",
    fallback: "'Courier New', ui-monospace, monospace",
    description: "Retro pixel font inspired by classic terminal displays",
  },

  "geist-pixel-triangle": {
    name: "geist-pixel-triangle",
    displayName: "Geist Pixel Triangle",
    category: "sans-serif",
    weights: [400],
    isCustomFont: true,
    customFontPath: "/fonts/geist-pixel",
    fontFileExtension: "woff2",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Pixel font with triangle-shaped pixels by Vercel",
  },

  "geist-pixel-square": {
    name: "geist-pixel-square",
    displayName: "Geist Pixel Square",
    category: "sans-serif",
    weights: [400],
    isCustomFont: true,
    customFontPath: "/fonts/geist-pixel",
    fontFileExtension: "woff2",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Pixel font with square-shaped pixels by Vercel",
  },

  "geist-pixel-grid": {
    name: "geist-pixel-grid",
    displayName: "Geist Pixel Grid",
    category: "sans-serif",
    weights: [400],
    isCustomFont: true,
    customFontPath: "/fonts/geist-pixel",
    fontFileExtension: "woff2",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Pixel font with grid pattern pixels by Vercel",
  },

  "geist-pixel-line": {
    name: "geist-pixel-line",
    displayName: "Geist Pixel Line",
    category: "sans-serif",
    weights: [400],
    isCustomFont: true,
    customFontPath: "/fonts/geist-pixel",
    fontFileExtension: "woff2",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Pixel font with line-shaped pixels by Vercel",
  },

  "geist-pixel-circle": {
    name: "geist-pixel-circle",
    displayName: "Geist Pixel Circle",
    category: "sans-serif",
    weights: [400],
    isCustomFont: true,
    customFontPath: "/fonts/geist-pixel",
    fontFileExtension: "woff2",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Pixel font with circle-shaped pixels by Vercel",
  },

  newsreader: {
    name: "newsreader",
    displayName: "Newsreader",
    category: "serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Newsreader",
    fallback: "ui-serif, Georgia, serif",
    description: "Variable serif optimized for long-form reading",
  },

  macondo: {
    name: "macondo",
    displayName: "Macondo",
    category: "serif",
    weights: [400, 700],
    googleFontName: "Macondo",
    fallback: "ui-serif, Georgia, serif",
    description: "Decorative serif inspired by magical realism",
  },

  barriecito: {
    name: "barriecito",
    displayName: "Barriecito",
    category: "serif",
    weights: [400, 700],
    googleFontName: "Barriecito",
    fallback: "ui-serif, Georgia, serif",
    description: "Fun decorative display font with playful character",
  },

  "public-sans": {
    name: "public-sans",
    displayName: "Public Sans",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Public Sans",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Strong, neutral typeface for government use",
  },

  "red-hat-display": {
    name: "red-hat-display",
    displayName: "Red Hat Display",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Red Hat Display",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Friendly, readable display font",
  },

  "ibm-plex-sans": {
    name: "ibm-plex-sans",
    displayName: "IBM Plex Sans",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "IBM Plex Sans",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "IBM's corporate typeface, neutral and friendly",
  },

  oxygen: {
    name: "oxygen",
    displayName: "Oxygen",
    category: "sans-serif",
    weights: [400, 700],
    googleFontName: "Oxygen",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Desktop publishing quality, clear and sharp",
  },

  quicksand: {
    name: "quicksand",
    displayName: "Quicksand",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    googleFontName: "Quicksand",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Quicksand is a modern sans serif font with a rounded design",
  },

  "bebas-neue": {
    name: "bebas-neue",
    displayName: "Bebas Neue",
    category: "serif",
    weights: [400, 500, 700],
    googleFontName: "Bebas Neue",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Bebas Neue is a modern serif font with uppercase letters",
  },

  caveat: {
    name: "caveat",
    displayName: "Caveat",
    category: "serif",
    weights: [400, 500, 700],
    googleFontName: "Caveat",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description:
      "Caveat is a modern serif font with a playful and casual style",
  },

  "space-grotesk": {
    name: "space-grotesk",
    displayName: "Space Grotesk",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    googleFontName: "Space Grotesk",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Modified version of Space Mono, proportional spacing",
  },

  "lexend-deca": {
    name: "lexend-deca",
    displayName: "Lexend Deca",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    googleFontName: "Lexend Deca",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Designed to improve reading proficiency",
  },

  "be-vietnam-pro": {
    name: "be-vietnam-pro",
    displayName: "Be Vietnam Pro",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Be Vietnam Pro",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Harmonious, readable Vietnamese typography",
  },

  urbanist: {
    name: "urbanist",
    displayName: "Urbanist",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Urbanist",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Low-contrast geometric sans serif with open forms",
  },

  "google-sans": {
    name: "google-sans",
    displayName: "Google Sans",
    category: "sans-serif",
    weights: [400, 500, 700],
    italicWeights: [400, 500, 700],
    googleFontName: "Google Sans",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Google's modern geometric sans serif typeface",
  },

  tomorrow: {
    name: "tomorrow",
    displayName: "Tomorrow",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Tomorrow",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Geometric sans serif with a futuristic, technical feel",
  },

  antic: {
    name: "antic",
    displayName: "Antic",
    category: "sans-serif",
    weights: [400],
    googleFontName: "Antic",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Low contrast sans serif with a warm, organic character",
  },

  "architects-daughter": {
    name: "architects-daughter",
    displayName: "Architects Daughter",
    category: "sans-serif",
    weights: [400],
    googleFontName: "Architects Daughter",
    fallback: "cursive, ui-sans-serif, system-ui, sans-serif",
    description: "Handwritten font inspired by the writing of an architect",
  },

  electrolize: {
    name: "electrolize",
    displayName: "Electrolize",
    category: "sans-serif",
    weights: [400],
    googleFontName: "Electrolize",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Square, techno sans serif with a digital, sci-fi character",
  },

  "chakra-petch": {
    name: "chakra-petch",
    displayName: "Chakra Petch",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Chakra Petch",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Squared techno sans serif with a futuristic Thai-Latin design",
  },

  sora: {
    name: "sora",
    displayName: "Sora",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    googleFontName: "Sora",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Geometric sans serif designed for technology brands",
  },

  lexend: {
    name: "lexend",
    displayName: "Lexend",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    googleFontName: "Lexend",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Variable sans serif tuned to reduce reading fatigue",
  },

  alata: {
    name: "alata",
    displayName: "Alata",
    category: "sans-serif",
    weights: [400],
    googleFontName: "Alata",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Warm geometric sans serif with subtle calligraphic details",
  },

  commissioner: {
    name: "commissioner",
    displayName: "Commissioner",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    googleFontName: "Commissioner",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Low-contrast grotesque with a friendly, neutral voice",
  },

  "ysabeau-infant": {
    name: "ysabeau-infant",
    displayName: "Ysabeau Infant",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Ysabeau Infant",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Humanist sans serif with single-storey infant letterforms",
  },

  comfortaa: {
    name: "comfortaa",
    displayName: "Comfortaa",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    googleFontName: "Comfortaa",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Rounded geometric sans serif with a soft, playful tone",
  },

  museomoderno: {
    name: "museomoderno",
    displayName: "MuseoModerno",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    googleFontName: "MuseoModerno",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Expressive display sans serif with rounded, quirky forms",
  },

  "afacad-flux": {
    name: "afacad-flux",
    displayName: "Afacad Flux",
    category: "sans-serif",
    weights: [400, 500, 600, 700],
    googleFontName: "Afacad Flux",
    fallback: "ui-sans-serif, system-ui, sans-serif",
    description: "Condensed contemporary sans serif with an editorial feel",
  },

  // Serif fonts (15)
  "playfair-display": {
    name: "playfair-display",
    displayName: "Playfair Display",
    category: "serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Playfair Display",
    fallback: "ui-serif, Georgia, serif",
    description: "Transitional design with high contrast",
  },

  merriweather: {
    name: "merriweather",
    displayName: "Merriweather",
    category: "serif",
    weights: [400, 700],
    italicWeights: [400, 700],
    googleFontName: "Merriweather",
    fallback: "ui-serif, Georgia, serif",
    description: "Designed for optimal readability on screens",
  },

  "crimson-text": {
    name: "crimson-text",
    displayName: "Crimson Text",
    category: "serif",
    weights: [400, 600, 700],
    italicWeights: [400, 600, 700],
    googleFontName: "Crimson Text",
    fallback: "ui-serif, Georgia, serif",
    description: "Inspired by old-style serif fonts",
  },

  "libre-baskerville": {
    name: "libre-baskerville",
    displayName: "Libre Baskerville",
    category: "serif",
    weights: [400, 700],
    italicWeights: [400, 700],
    googleFontName: "Libre Baskerville",
    fallback: "ui-serif, Georgia, serif",
    description: "Based on the American Type Founder's Baskerville",
  },

  lora: {
    name: "lora",
    displayName: "Lora",
    category: "serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Lora",
    fallback: "ui-serif, Georgia, serif",
    description: "Well-balanced contemporary serif",
  },

  "cormorant-garamond": {
    name: "cormorant-garamond",
    displayName: "Cormorant Garamond",
    category: "serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Cormorant Garamond",
    fallback: "ui-serif, Georgia, serif",
    description: "Display serif with classical proportions",
  },

  "eb-garamond": {
    name: "eb-garamond",
    displayName: "EB Garamond",
    category: "serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "EB Garamond",
    fallback: "ui-serif, Georgia, serif",
    description: "Revival of Claude Garamont's humanist typeface",
  },

  "old-standard-tt": {
    name: "old-standard-tt",
    displayName: "Old Standard TT",
    category: "serif",
    weights: [400, 700],
    italicWeights: [400],
    googleFontName: "Old Standard TT",
    fallback: "ui-serif, Georgia, serif",
    description: "Academic serif with traditional character",
  },

  vollkorn: {
    name: "vollkorn",
    displayName: "Vollkorn",
    category: "serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Vollkorn",
    fallback: "ui-serif, Georgia, serif",
    description: "Quiet, modest serif for continuous text",
  },

  spectral: {
    name: "spectral",
    displayName: "Spectral",
    category: "serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Spectral",
    fallback: "ui-serif, Georgia, serif",
    description: "Designed specifically for digital reading",
  },

  bitter: {
    name: "bitter",
    displayName: "Bitter",
    category: "serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Bitter",
    fallback: "ui-serif, Georgia, serif",
    description: "Contemporary slab serif for text and display",
  },

  alegreya: {
    name: "alegreya",
    displayName: "Alegreya",
    category: "serif",
    weights: [400, 500, 700],
    italicWeights: [400, 500, 700],
    googleFontName: "Alegreya",
    fallback: "ui-serif, Georgia, serif",
    description: "Calligraphic serif with dynamic rhythm",
  },

  neuton: {
    name: "neuton",
    displayName: "Neuton",
    category: "serif",
    weights: [400, 700],
    italicWeights: [400],
    googleFontName: "Neuton",
    fallback: "ui-serif, Georgia, serif",
    description: "Dark, semi-condensed serif for text",
  },

  cardo: {
    name: "cardo",
    displayName: "Cardo",
    category: "serif",
    weights: [400, 700],
    italicWeights: [400],
    googleFontName: "Cardo",
    fallback: "ui-serif, Georgia, serif",
    description: "Large Unicode serif for classical texts",
  },

  "frank-ruhl-libre": {
    name: "frank-ruhl-libre",
    displayName: "Frank Ruhl Libre",
    category: "serif",
    weights: [400, 500, 700],
    googleFontName: "Frank Ruhl Libre",
    fallback: "ui-serif, Georgia, serif",
    description: "Hebrew-Latin serif with distinctive character",
  },

  georgia: {
    name: "georgia",
    displayName: "Georgia",
    category: "serif",
    weights: [400, 700],
    googleFontName: "Georgia",
    fallback: "ui-serif, Georgia, serif",
    description: "Screen-optimized serif, excellent readability",
  },

  "times-new-roman": {
    name: "times-new-roman",
    displayName: "Times New Roman",
    category: "serif",
    weights: [400, 700],
    googleFontName: "Times",
    fallback: "ui-serif, Georgia, serif",
    description: "Classic newspaper serif, formal and traditional",
  },

  "bree-serif": {
    name: "bree-serif",
    displayName: "Bree Serif",
    category: "serif",
    weights: [400],
    googleFontName: "Bree Serif",
    fallback: "ui-serif, Georgia, serif",
    description: "Playful serif with personality",
  },

  rokkitt: {
    name: "rokkitt",
    displayName: "Rokkitt",
    category: "serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Rokkitt",
    fallback: "ui-serif, Georgia, serif",
    description: "Contemporary slab serif with strong character",
  },

  "pt-serif": {
    name: "pt-serif",
    displayName: "PT Serif",
    category: "serif",
    weights: [400, 700],
    italicWeights: [400, 700],
    googleFontName: "PT Serif",
    fallback: "ui-serif, Georgia, serif",
    description: "Universal type family for diverse applications",
  },

  "abril-fatface": {
    name: "abril-fatface",
    displayName: "Abril Fatface",
    category: "serif",
    weights: [400],
    googleFontName: "Abril Fatface",
    fallback: "ui-serif, Georgia, serif",
    description: "Heavy display serif for headlines",
  },

  cinzel: {
    name: "cinzel",
    displayName: "Cinzel",
    category: "serif",
    weights: [400, 500, 600],
    googleFontName: "Cinzel",
    fallback: "ui-serif, Georgia, serif",
    description: "Inspired by first century Roman inscriptions",
  },

  domine: {
    name: "domine",
    displayName: "Domine",
    category: "serif",
    weights: [400, 500, 600, 700],
    googleFontName: "Domine",
    fallback: "ui-serif, Georgia, serif",
    description: "Optimized for body text on screen",
  },

  arvo: {
    name: "arvo",
    displayName: "Arvo",
    category: "serif",
    weights: [400, 700],
    italicWeights: [400, 700],
    googleFontName: "Arvo",
    fallback: "ui-serif, Georgia, serif",
    description: "Geometric slab serif with Nordic roots",
  },

  "ibm-plex-serif": {
    name: "ibm-plex-serif",
    displayName: "IBM Plex Serif",
    category: "serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "IBM Plex Serif",
    fallback: "ui-serif, Georgia, serif",
    description: "IBM's corporate serif typeface, neutral and friendly",
  },

  "josefin-slab": {
    name: "josefin-slab",
    displayName: "Josefin Slab",
    category: "serif",
    weights: [400, 600, 700],
    italicWeights: [400, 600, 700],
    googleFontName: "Josefin Slab",
    fallback: "ui-serif, Georgia, serif",
    description: "Geometric slab serif with vintage feel",
  },

  "instrument-serif": {
    name: "instrument-serif",
    displayName: "Instrument Serif",
    category: "serif",
    weights: [400],
    italicWeights: [400],
    googleFontName: "Instrument Serif",
    fallback: "ui-serif, Georgia, serif",
    description: "High-contrast serif with modern elegance",
  },

  biorhyme: {
    name: "biorhyme",
    displayName: "BioRhyme",
    category: "serif",
    weights: [400, 700],
    googleFontName: "BioRhyme",
    fallback: "ui-serif, Georgia, serif",
    description: "Slab serif with a strong, contemporary presence",
  },

  "noto-serif-georgian": {
    name: "noto-serif-georgian",
    displayName: "Noto Serif Georgian",
    category: "serif",
    weights: [400, 500, 600, 700],
    googleFontName: "Noto Serif Georgian",
    fallback: "ui-serif, Georgia, serif",
    description: "Elegant serif supporting Georgian and Latin scripts",
  },

  "source-serif-4": {
    name: "source-serif-4",
    displayName: "Source Serif 4",
    category: "serif",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Source Serif 4",
    fallback: "ui-serif, Georgia, serif",
    description: "Adobe's open-source transitional serif, excellent for body text",
  },

  // Monospace fonts (3)
  "jetbrains-mono": {
    name: "jetbrains-mono",
    displayName: "JetBrains Mono",
    category: "monospace",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "JetBrains Mono",
    fallback:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    description: "Designed for developers, excellent readability",
  },

  "fira-code": {
    name: "fira-code",
    displayName: "Fira Code",
    category: "monospace",
    weights: [400, 500, 600, 700],
    googleFontName: "Fira Code",
    fallback:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    description: "Programming ligatures, clean and modern",
  },

  "source-code-pro": {
    name: "source-code-pro",
    displayName: "Source Code Pro",
    category: "monospace",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Source Code Pro",
    fallback:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    description: "Adobe's monospace font, highly legible",
  },

  "geist-mono": {
    name: "geist-mono",
    displayName: "Geist Mono",
    category: "monospace",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Geist Mono",
    fallback:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    description: "Modern monospace font by Vercel, clean and readable",
  },

  "roboto-mono": {
    name: "roboto-mono",
    displayName: "Roboto Mono",
    category: "monospace",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "Roboto Mono",
    fallback:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    description: "Google's monospace version of Roboto",
  },

  inconsolata: {
    name: "inconsolata",
    displayName: "Inconsolata",
    category: "monospace",
    weights: [400, 500, 700],
    googleFontName: "Inconsolata",
    fallback:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    description: "Humanist monospace for code and terminal",
  },

  "space-mono": {
    name: "space-mono",
    displayName: "Space Mono",
    category: "monospace",
    weights: [400, 700],
    italicWeights: [400, 700],
    googleFontName: "Space Mono",
    fallback:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    description: "Original fixed-width type family",
  },

  "courier-prime": {
    name: "courier-prime",
    displayName: "Courier Prime",
    category: "monospace",
    weights: [400, 700],
    italicWeights: [400, 700],
    googleFontName: "Courier Prime",
    fallback:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    description: "Designed for screenplays, clean typewriter style",
  },

  "ibm-plex-mono": {
    name: "ibm-plex-mono",
    displayName: "IBM Plex Mono",
    category: "monospace",
    weights: [400, 500, 600, 700],
    italicWeights: [400, 500, 600, 700],
    googleFontName: "IBM Plex Mono",
    fallback:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    description: "IBM's corporate monospace typeface, neutral and friendly",
  },

  "anonymous-pro": {
    name: "anonymous-pro",
    displayName: "Anonymous Pro",
    category: "monospace",
    weights: [400, 700],
    italicWeights: [400, 700],
    googleFontName: "Anonymous Pro",
    fallback:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    description: "Fixed-width font designed for coders",
  },
};

// Default font set
export const defaultFontSet: FontSet = {
  sans: fontDefinitions.geist,
  serif: fontDefinitions.lora,
  mono: fontDefinitions["geist-mono"],
};

// Font utility functions
export const getSansSerifFonts = (): FontDefinition[] => {
  return Object.values(fontDefinitions).filter(
    (font) => font.category === "sans-serif"
  );
};

export const getSerifFonts = (): FontDefinition[] => {
  return Object.values(fontDefinitions).filter(
    (font) => font.category === "serif"
  );
};

export const getMonospaceFonts = (): FontDefinition[] => {
  return Object.values(fontDefinitions).filter(
    (font) => font.category === "monospace"
  );
};

export const getAllFonts = (): FontDefinition[] => {
  return Object.values(fontDefinitions);
};

export const getFontByName = (name: FontName): FontDefinition => {
  const font = fontDefinitions[name];
  if (!font) {
    console.warn(`Font not found: ${name}, falling back to default`);
    return fontDefinitions.inter; // Fallback to default sans font
  }
  return font;
};

// Google Fonts URL generator
export const generateGoogleFontsURL = (fontSet: FontSet): string => {
  const fonts = [fontSet.sans, fontSet.serif, fontSet.mono];
  const fontParams = fonts
    .filter(
      (font) => font?.weights && font.googleFontName && !font.isCustomFont
    ) // Exclude custom fonts
    .map((font) => {
      const family = font.googleFontName?.replace(/\s+/g, "+");

      // Fonts with a true italic face request the `ital` axis so that
      // applying italic resolves to the designed italic, not a synthetic
      // oblique. css2 requires axis tuples sorted: ital asc, then wght asc.
      if (font.italicWeights && font.italicWeights.length > 0) {
        const italicSet = new Set(font.italicWeights);
        const allWeights = Array.from(
          new Set([...font.weights, ...font.italicWeights])
        ).sort((a, b) => a - b);

        const tuples: string[] = [];
        for (const weight of allWeights) {
          tuples.push(`0,${weight}`); // upright
        }
        for (const weight of allWeights) {
          if (italicSet.has(weight)) {
            tuples.push(`1,${weight}`); // italic
          }
        }
        return `${family}:ital,wght@${tuples.join(";")}`;
      }

      const weights = font.weights.join(";");
      return `${family}:wght@${weights}`;
    })
    .join("&family=");

  // Return empty string if no Google Fonts are needed
  if (!fontParams) return "";

  return `https://fonts.googleapis.com/css2?family=${fontParams}&display=swap`;
};

// Generate @font-face rules for a single custom font
const generateFontFaceRules = (font: FontDefinition): string => {
  if (!font?.customFontPath) return "";

  const ext = font.fontFileExtension || "ttf";
  const format = ext === "woff2" ? "woff2" : "truetype";
  const fontBaseName = font.displayName.replace(/\s+/g, "");

  // Generate @font-face rules for different weights
  const fontFaceRules = font.weights
    .map((weight) => {
      const weightName = getWeightName(weight);
      return `
            @font-face {
              font-family: "${font.displayName}";
              src: url("${font.customFontPath}/${fontBaseName}-${weightName}.${ext}") format("${format}");
              font-weight: ${weight};
              font-style: normal;
              font-display: swap;
            }`;
    })
    .join("\n");

  // Add variable font support only for ttf fonts
  if (ext === "ttf") {
    const variableFontRule = `
        @font-face {
          font-family: "${font.displayName}";
          src: url("${font.customFontPath}/${fontBaseName}-Variable.ttf") format("truetype-variations");
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }`;
    return fontFaceRules + variableFontRule;
  }

  return fontFaceRules;
};

// Generate @font-face rules for custom fonts
export const generateCustomFontCSS = (fontSet: FontSet): string => {
  const customFonts = [fontSet.sans, fontSet.serif, fontSet.mono].filter(
    (font) => font?.isCustomFont
  );

  if (customFonts.length === 0) return "";

  return customFonts
    .map((font) => generateFontFaceRules(font))
    .join("\n");
};

// Generate @font-face rules for ALL custom fonts (not just selected ones)
export const generateAllCustomFontsCSS = (): string => {
  const allCustomFonts = Object.values(fontDefinitions).filter(
    (font) => font.isCustomFont
  );

  if (allCustomFonts.length === 0) return "";

  return allCustomFonts
    .map((font) => generateFontFaceRules(font))
    .join("\n");
};

// Helper function to map weights to font file names
const getWeightName = (weight: number): string => {
  const weightMap: Record<number, string> = {
    100: "Thin",
    200: "ExtraLight",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "SemiBold",
    700: "Bold",
    800: "ExtraBold",
    900: "ExtraBold", // Using ExtraBold for 900 as that's what's available
  };
  return weightMap[weight] || "Regular";
};

// CSS generator
export const generateFontCSS = (fontSet: FontSet): string => {
  // Ensure fonts exist before generating CSS
  const sans = fontSet.sans || defaultFontSet.sans;
  const serif = fontSet.serif || defaultFontSet.serif;
  const mono = fontSet.mono || defaultFontSet.mono;

  // Get font family names (use displayName for custom fonts, googleFontName for Google fonts)
  const getFontName = (font: FontDefinition) =>
    font.isCustomFont ? font.displayName : font.googleFontName;

  const customFontCSS = generateCustomFontCSS(fontSet);

  return `
    ${customFontCSS}
    
    .themed-content {
      --font-sans: "${getFontName(sans)}", ${sans.fallback};
      --font-serif: "${getFontName(serif)}", ${serif.fallback};
      --font-mono: "${getFontName(mono)}", ${mono.fallback};
      
      font-family: var(--font-sans);
    }
    
    .themed-content footer::after {
      content: "";
      display: block;
      padding-bottom: 42px;
    }
    
    .themed-content h1, 
    .themed-content h2, 
    .themed-content h3, 
    .themed-content h4, 
    .themed-content h5, 
    .themed-content h6 {
      font-family: var(--font-serif);
    }

    .themed-content .font-sans {
      font-family: var(--font-sans);
    }

    .themed-content .font-serif {
      font-family: var(--font-serif);
    }

    .themed-content .font-mono {
      font-family: var(--font-mono);
    }
    
    .themed-content code, 
    .themed-content pre, 
    .themed-content .font-mono {
      font-family: var(--font-mono);
    }
  `;
};
