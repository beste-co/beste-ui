import BlockPageClient from "./block-page-client";
import type { Metadata } from "next";
import { getBlock } from "@/lib/blocks";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;

  return {
    title: `Beste UI - ${name}`,
    description:
      "Beautiful, accessible shadcn/tailwind blocks for your next project. Install via shadcn cli.",
  };
}

export default async function BlockPage({ params }: Props) {
  const { name } = await params;
  const block = getBlock(name);

  if (!block) {
    notFound();
  }

  return <BlockPageClient name={name} />;
}
