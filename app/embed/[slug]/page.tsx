import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getBlock } from "@/lib/blocks";

// Mirror of THEME_NAME_COOKIE in lib/preview-theme-store.ts (kept as a literal
// here so this server component doesn't import the "use client" store module).
const THEME_NAME_COOKIE = "blocks-preview-theme-name";
import { BlockPreview } from "./block-preview";
import { EmbedClient } from "./embed-client";
import { getViewer } from "@/lib/entitlements";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ pro?: string }>;
}

// Iframe-only previews: keep them out of the index so they never compete
// with the real /block/* pages as thin duplicate content.
export const metadata = {
  robots: { index: false, follow: false },
};

export default async function EmbedPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { pro } = await searchParams;

  const block = getBlock(slug);

  if (!block) {
    notFound();
  }

  // Verify Pro status server-side if claimed via URL parameter
  const hasPro = pro === "1" ? (await getViewer()).isPro : false;

  const cookieStore = await cookies();
  const initialThemeName = cookieStore.get(THEME_NAME_COOKIE)?.value;

  return (
    <EmbedClient initialThemeName={initialThemeName}>
      <BlockPreview slug={slug} hasPro={hasPro} />
    </EmbedClient>
  );
}
