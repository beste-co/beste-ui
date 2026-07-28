import type { Metadata } from "next";
import { LicenseContent } from "./license-content";

const title = "License";
const description = "License and terms of use for Beste UI components";
const ogImage = `https://ui.beste.co/og?title=${encodeURIComponent(
  title
)}&description=${encodeURIComponent(description)}`;

export const metadata: Metadata = {
  title: "License - Beste UI",
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
