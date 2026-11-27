import type { Metadata } from "next";
import { LicenseContent } from "./license-content";

const title = "License";
const description =
  "The license and terms of use for Beste UI shadcn/ui blocks, components, pieces and page templates, free and Pro.";
const ogImage = `https://beste.dev/og?title=${encodeURIComponent(
  title
)}&description=${encodeURIComponent(description)}`;

export const metadata: Metadata = {
  title: "License: Using Beste UI Shadcn Blocks and Components - Beste UI",
  description,
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
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function LicensePage() {
  return <LicenseContent />;
}
