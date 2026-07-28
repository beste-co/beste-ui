// Category display information
export interface CategoryInfo {
  title: string;
  fullTitle?: string; // Optional full title that overrides "{title} blocks for developers."
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: [string, string];
  icon?: string; // Lucide icon name
  isNew?: boolean; // Show "new" badge
}

// Default info for homepage/all blocks
const defaultInfo: CategoryInfo = {
  title: "shadcn",
  description:
    "Production-ready UI blocks for your next project. Install via shadcn CLI.",
  metaTitle: "Beste UI - Production-ready shadcn/tailwind blocks & components",
  metaDescription:
    "Beautiful, accessible shadcn/tailwind blocks for your next project. Install via shadcn cli.",
  keywords: ["ui", "components"],
};

// Category-specific info (slugs match blocks.ts category names converted to kebab-case)
export const categoryInfoMap: Record<string, CategoryInfo> = {
  all: {
    title: "All",
    fullTitle: "Production-Ready UI Blocks for React & Next.js",
    description:
      "Browse 1041+ production-ready React components. Copy, paste, and customize for your next project.",
    metaTitle: "All shadcn blocks - Beste UI",
    metaDescription:
      "Browse all production-ready shadcn/tailwind UI blocks. Hero sections, features, testimonials, and more.",
    keywords: ["ui", "components"],
    icon: "LayoutGrid",
  },
  dashboard: {
    title: "Dashboard",
    fullTitle: "Admin Dashboard UI Blocks for React & Next.js",
    description:
      "Application UI for admin panels: sidebars, topbars, KPI rows, data tables, charts, and activity feeds.",
    metaTitle: "Dashboard shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind admin dashboard blocks: collapsible sidebars, command palettes, KPI cards, and a client-side data-table engine with sort, search, and pagination.",
    keywords: ["admin", "dashboard"],
    icon: "LayoutDashboard",
    isNew: true,
  },
  onboarding: {
    title: "Onboarding",
    description: "Onboarding pages and flows.",
    metaTitle: "Onboarding shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind onboarding pages and flows with step indicators, progress bars and more.",
    keywords: ["wizard", "signup"],
    icon: "UserPlus",
  },
  auth: {
    title: "Auth",
    description:
      "Sign in, sign up, and verification screens for authentication flows.",
    metaTitle: "Auth shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind authentication blocks for sign in, sign up, password reset, and OTP verification screens.",
    keywords: ["login", "sign up"],
    icon: "KeyRound",
    isNew: true,
  },
  feature: {
    title: "Feature",
    description: "Highlight your product features with stunning layouts.",
    metaTitle: "Feature shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind feature section blocks with grids, timelines, bento layouts and more.",
    keywords: ["features", "marketing"],
    icon: "Sparkles",
  },
  testimonial: {
    title: "Testimonial",
    description: "Customer testimonials and social proof sections.",
    metaTitle: "Testimonial shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind testimonial blocks with carousels and quote layouts.",
    keywords: ["reviews", "social proof"],
    icon: "Quote",
  },
  health: {
    title: "Health",
    description: "Health and wellness focused UI components.",
    metaTitle: "Health shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind health and wellness blocks for medical apps and fitness platforms.",
    keywords: ["wellness", "medical"],
    icon: "HeartPulse",
  },
  hero: {
    title: "Hero",
    description:
      "Eye-catching hero sections to make a strong first impression.",
    metaTitle: "Hero shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind hero section blocks for landing pages. Carousels, split layouts, and more.",
    keywords: ["landing", "header"],
    icon: "Rocket",
  },
  reveal: {
    title: "Reveal",
    description: "Before/after comparisons and reveal animations.",
    metaTitle: "Reveal shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind before/after comparison sliders and reveal animation blocks.",
    keywords: ["comparison", "before after"],
    icon: "SplitSquareHorizontal",
  },
  "use-case": {
    title: "Use Case",
    description:
      "Showcase different use cases and applications of your product.",
    metaTitle: "Use Case shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind use case blocks with tabs, grids, timelines and accordions.",
    keywords: ["applications", "showcase"],
    icon: "Lightbulb",
  },
  showcase: {
    title: "Showcase",
    description:
      "Interactive product showcases with hotspots and detailed views.",
    metaTitle: "Showcase shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind product showcase blocks with hotspots and detailed views.",
    keywords: ["product", "hotspots"],
    icon: "Eye",
  },
  terminal: {
    title: "Terminal",
    description: "Terminal-style components with typewriter animations.",
    metaTitle: "Terminal shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind terminal and CLI-style blocks with typewriter animations.",
    keywords: ["cli", "code"],
    icon: "SquareTerminal",
  },
  "coming-soon": {
    title: "Coming Soon",
    description: "Launch countdown pages and pre-launch components.",
    metaTitle: "Coming Soon shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind coming soon and launch countdown page blocks.",
    keywords: ["launch", "countdown"],
    icon: "Clock",
  },
  ecommerce: {
    title: "E-commerce",
    description: "Shopping cart, product cards, and checkout components.",
    metaTitle: "E-commerce shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind e-commerce blocks for product cards, shopping carts, and checkout flows.",
    keywords: ["shop", "products"],
    icon: "ShoppingCart",
  },
  cta: {
    title: "CTA",
    description: "Conversion-focused call-to-action sections and banners.",
    metaTitle: "CTA shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind call-to-action blocks for conversion sections, banners, and action prompts.",
    keywords: ["call-to-action", "conversion"],
    icon: "MousePointerClick",
  },
  crypto: {
    title: "Crypto",
    description: "Cryptocurrency and Web3 focused UI components.",
    metaTitle: "Crypto shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind crypto and Web3 blocks for token pages, DAOs, and DeFi apps.",
    keywords: ["web3", "blockchain"],
    icon: "Bitcoin",
  },
  devtools: {
    title: "DevTools",
    description: "Developer tools and API response examples.",
    metaTitle: "DevTools shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind developer tools and API response examples with status codes, headers and JSON body display.",
    keywords: ["api", "response"],
    icon: "Code",
  },
  settings: {
    title: "Settings",
    description: "Account settings, billing, and preferences components.",
    metaTitle: "Settings shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind settings blocks for account pages, billing history, and user preferences.",
    keywords: ["billing", "history"],
    icon: "Settings",
  },
  fitness: {
    title: "Fitness",
    description: "Fitness and gym focused UI components.",
    metaTitle: "Fitness shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind fitness blocks for gym apps, workout trackers, and training programs.",
    keywords: ["gym", "workout"],
    icon: "Dumbbell",
  },
  education: {
    title: "Education",
    description: "Educational platforms and learning management components.",
    metaTitle: "Education shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind education blocks for e-learning platforms, course content, and educational apps.",
    keywords: ["course", "lesson"],
    icon: "GraduationCap",
  },
  navigation: {
    title: "Navbar",
    description: "Navbar components and menus.",
    metaTitle: "Navbar shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind navbar blocks for menus, breadcrumbs, and header components.",
    keywords: ["header", "navbar"],
    icon: "Menu",
  },
  footer: {
    title: "Footer",
    description: "Footer sections with navigation, social links, and CTAs.",
    metaTitle: "Footer shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind footer blocks with navigation columns, newsletter forms, and social links.",
    keywords: ["bottom", "links"],
    icon: "PanelBottom",
  },
  travel: {
    title: "Travel",
    description: "Travel and tourism focused UI components.",
    metaTitle: "Travel shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind travel blocks for destination showcases, booking flows, and itineraries.",
    keywords: ["tourism", "destinations"],
    icon: "Plane",
  },
  social: {
    title: "Social",
    description: "Social media and community UI components.",
    metaTitle: "Social shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind social blocks for posts, feeds, profiles, and community features.",
    keywords: ["community", "posts"],
    icon: "Users",
  },
  saas: {
    title: "SaaS",
    description: "SaaS dashboard and application UI components.",
    metaTitle: "SaaS shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind SaaS blocks for dashboards, analytics, settings, and app interfaces.",
    keywords: ["dashboard", "analytics"],
    icon: "BarChart3",
  },
  food: {
    title: "Food",
    description: "Restaurant and food service UI components.",
    metaTitle: "Food shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind food blocks for restaurant menus, chef profiles, events, and reservations.",
    keywords: ["restaurant", "menu"],
    icon: "UtensilsCrossed",
  },
  agency: {
    title: "Agency",
    description: "Agency and creative studio UI components.",
    metaTitle: "Agency shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind agency blocks for case studies, portfolios, and creative showcases.",
    keywords: ["case study", "creative"],
    icon: "Briefcase",
  },
  podcast: {
    title: "Podcast",
    description: "Podcast and audio content UI components.",
    metaTitle: "Podcast shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind podcast blocks for episode players, show pages, and audio platforms.",
    keywords: ["audio", "episodes"],
    icon: "Mic",
  },
  portfolio: {
    title: "Portfolio",
    description: "Personal portfolio and resume UI components.",
    metaTitle: "Portfolio shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind portfolio blocks for personal sites, resumes, and professional profiles.",
    keywords: ["resume", "personal"],
    icon: "FolderKanban",
  },
  "product-list": {
    title: "Product List",
    description:
      "Filterable, sortable, and paginated product listing sections with sidebar filters for shop category pages.",
    metaTitle: "Product List shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind product list blocks with sidebar filters, sorting, pagination, and client or server-driven data.",
    keywords: ["catalog", "filters"],
    icon: "ListFilter",
    isNew: true,
  },
  product: {
    title: "Product",
    description: "Product showcase and introduction sections that present features, details, and value — no cart or checkout.",
    metaTitle: "Product shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind product showcase blocks that introduce a product's features, specs, and story for landing pages.",
    keywords: ["product", "showcase"],
    icon: "Package",
  },
  post: {
    title: "Blog Post",
    description: "Blog post layouts and article components.",
    metaTitle: "Blog Post shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind blog post blocks for articles, tutorials, documentation, and more.",
    keywords: ["blog", "article"],
    icon: "FileText",
  },
  blog: {
    title: "Blog",
    description: "Blog list layouts and post grid components.",
    metaTitle: "Blog shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind blog list blocks for post grids, featured articles, and content feeds.",
    keywords: ["posts", "articles"],
    icon: "BookText",
  },
  legal: {
    title: "Legal",
    description: "Legal and compliance UI components.",
    metaTitle: "Legal shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind legal blocks for cookie consent, privacy policies, terms of service, and GDPR compliance.",
    keywords: ["privacy", "terms"],
    icon: "Scale",
  },
  event: {
    title: "Event",
    description: "Conference, workshop, and event landing page components.",
    metaTitle: "Event shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind event blocks for conferences, workshops, speakers, schedules, and ticket registration.",
    keywords: ["conference", "workshop"],
    icon: "CalendarDays",
  },
  pricing: {
    title: "Pricing",
    description:
      "Pricing tables, plan comparisons, and subscription components.",
    metaTitle: "Pricing shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind pricing blocks for subscription plans, feature comparisons, and billing pages.",
    keywords: ["plans", "subscription"],
    icon: "ShoppingCart",
  },
  faq: {
    title: "FAQ",
    description:
      "Interactive question-answer sections that expand on click. Perfect for support pages, knowledge bases, and product documentation.",
    metaTitle: "FAQ shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind FAQ blocks with expandable Q&A sections, tabbed layouts, card grids, and animated designs.",
    keywords: ["questions", "support"],
    icon: "HelpCircle",
  },
  news: {
    title: "News",
    description:
      "Breaking news tickers, headline grids, and live feed sections. Perfect for news sites, dashboards, and content platforms.",
    metaTitle: "News shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind news blocks with breaking tickers, featured grids, live feeds, and trending indicators.",
    keywords: ["headlines", "articles"],
    icon: "Newspaper",
  },
  stats: {
    title: "Stats",
    description:
      "Key metrics, counters, and achievement sections for social proof.",
    metaTitle: "Stats shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind stats blocks for key metrics, animated counters, and achievement sections.",
    keywords: ["metrics", "numbers"],
    icon: "TrendingUp",
  },
  chat: {
    title: "Chat",
    description:
      "AI chat interfaces, prompt playgrounds, and conversation UI components.",
    metaTitle: "Chat shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind chat blocks for AI interfaces, prompt inputs, conversation threads, and chatbot UIs.",
    keywords: ["ai", "prompt"],
    icon: "MessageSquare",
  },
  changelog: {
    title: "Changelog",
    description:
      "Release notes, version history, and product update sections.",
    metaTitle: "Changelog shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind changelog blocks for release notes, version history, and product update feeds.",
    keywords: ["release notes", "updates"],
    icon: "ScrollText",
  },
  careers: {
    title: "Careers",
    description:
      "Job listings, career pages, and open positions sections.",
    metaTitle: "Careers shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind careers blocks for job listings, open positions, and recruitment pages.",
    keywords: ["jobs", "hiring"],
    icon: "Briefcase",
  },
  booking: {
    title: "Booking",
    description:
      "Reservation flows, calendar pickers, time slot selectors, and booking confirmation components.",
    metaTitle: "Booking shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind booking blocks for calendar pickers, time slots, reservation summaries, and appointment scheduling.",
    keywords: ["reservation", "appointment"],
    icon: "CalendarCheck",
    isNew: true,
  },
  about: {
    title: "About",
    description:
      "Company identity, mission statements, team grids, and trust-building sections.",
    metaTitle: "About shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind about section blocks for team grids, mission statements, founder stories, and company stats.",
    keywords: ["team", "company"],
    icon: "Building2",
  },
  workflow: {
    title: "Workflow",
    description:
      "No-code automation and workflow builder UI components with live recipe assets.",
    metaTitle: "Workflow shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind workflow automation blocks for triggers, actions, recipes, and integration marketplaces.",
    keywords: ["automation", "workflow"],
    icon: "Workflow",
    isNew: true,
  },
  error: {
    title: "Error",
    fullTitle: "404 and Error Page UI Blocks for React & Next.js",
    description:
      "Error pages that give the visitor a way forward: 404, 500, 403, maintenance and expired-link screens with search, suggested destinations, and support links.",
    metaTitle: "404 and error page shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind error page blocks for 404, 500, 403, maintenance, and expired-link screens with site search, destination cards, and support links.",
    keywords: ["404", "not found"],
    icon: "SearchX",
    isNew: true,
  },
  bento: {
    title: "Bento",
    description:
      "Bento grid layouts that mix multiple visual assets into a unified showcase.",
    metaTitle: "Bento shadcn blocks - Beste UI",
    metaDescription:
      "Production-ready shadcn/tailwind bento grid blocks that showcase dashboards, charts, code editors, and more in one layout.",
    keywords: ["grid", "showcase"],
    icon: "LayoutGrid",
    isNew: true,
  },
};

// Convert category slug to key (handles both "use-cases" and "use cases")
function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/\s+/g, "-");
}

export function getCategoryInfo(categorySlug: string | null): CategoryInfo {
  if (!categorySlug) {
    return defaultInfo;
  }

  const normalized = normalizeSlug(categorySlug);
  return categoryInfoMap[normalized] || defaultInfo;
}

export function getCategoryInfoFromPathname(
  pathname: string
): CategoryInfo & { isCategory: boolean } {
  // Handle /blocks page (all blocks)
  if (pathname === "/blocks") {
    return { ...categoryInfoMap.all!, isCategory: true };
  }

  // Check if we're on a category page
  const match = pathname.match(/^\/blocks\/(.+)$/);

  if (match) {
    const slug = match[1];
    const info = getCategoryInfo(slug || "");
    // Check if we found a specific category or fell back to default
    const isKnownCategory = normalizeSlug(slug || "") in categoryInfoMap;
    return { ...info, isCategory: isKnownCategory };
  }

  return { ...defaultInfo, isCategory: false };
}
