import { notFound } from "next/navigation";
import { getRegistryComponent } from "@/lib/registry-components";
import { EmbedClient } from "../../[slug]/embed-client";
import { RegistryComponentEmbedPreview } from "./component-embed-preview";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tone?: string }>;
}

// Iframe-only previews: keep them out of the index so they never compete
// with the real /component/* pages as thin duplicate content.
export const metadata = {
  robots: { index: false, follow: false },
};

export default async function ComponentEmbedPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { tone } = await searchParams;

  const component = getRegistryComponent(slug);
  if (!component) {
    notFound();
  }

  return (
    <EmbedClient>
      <RegistryComponentEmbedPreview slug={slug} tone={tone} />
    </EmbedClient>
  );
}
