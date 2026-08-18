import "./globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { type ReactNode, Suspense } from "react";
import { Analytics } from "@/components/analytics";
import { AuthProvider } from "@/lib/auth-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import { LicenseProvider } from "@/lib/license-context";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Beste UI";
const description =
  "Beautiful, accessible shadcn/tailwind blocks for your next project. Install via shadcn cli.";
const ogImage = `https://ui.beste.co/og?title=${encodeURIComponent(
  title
)}&description=${encodeURIComponent(description)}`;

const isStaging = process.env.NEXT_PUBLIC_ENVIRONMENT === "staging";

export const metadata: Metadata = {
  metadataBase: new URL("https://ui.beste.co"),
  title: "Beste UI - Production-ready shadcn/tailwind blocks & components",
  description,
  // Keep staging deployments out of the index entirely (duplicate content).
  ...(isStaging ? { robots: { index: false, follow: false } } : {}),
  openGraph: {
    title,
    description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 628,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT !== "staging";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

// Site-wide entity graph: every page's BreadcrumbList / BlogPosting / Blog
// nodes reference this Organization by @id.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://ui.beste.co/#organization",
  name: "Beste UI",
  url: "https://ui.beste.co",
  logo: {
    "@type": "ImageObject",
    url: "https://ui.beste.co/apple-icon",
    width: 180,
    height: 180,
  },
  description:
    "A library of production-ready blocks, pieces and components for shadcn/ui and Tailwind CSS, built for React and Next.js and installed with the shadcn CLI.",
  foundingDate: "2025",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hello@beste.co",
    availableLanguage: ["English"],
  },
  sameAs: [
    "https://x.com/withbeste",
    "https://linkedin.com/company/bestestudio",
    "https://github.com/beste-co/beste-ui",
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://ui.beste.co/#website",
  name: "Beste UI",
  url: "https://ui.beste.co",
  inLanguage: "en",
  publisher: { "@id": "https://ui.beste.co/#organization" },
  // Declares the catalogue as queryable rather than only readable: a search
  // engine can offer the box, and an agent can see there is a live endpoint
  // behind the site instead of only a set of documents.
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://ui.beste.co/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{isProduction && gaId && <GoogleAnalytics gaId={gaId} />}</head>
      <body className={`${plusJakartaSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static structured data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static structured data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        {isProduction && (
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          themes={["light", "dark", "paper"]}
          disableTransitionOnChange
        >
          <AuthProvider>
            <LicenseProvider>
              <FavoritesProvider>{children}</FavoritesProvider>
            </LicenseProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
