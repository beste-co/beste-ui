"use client";

import { FileCode, Layers, Paintbrush, Terminal } from "lucide-react";
import { Feature235 } from "@/registry/feature235/feature235";

/**
 * The "why it works" section, in its own client module for one reason: its four cards
 * are described with icons, and an icon is a React component rather than data.
 * A server component cannot hand one across the boundary to a client component — React
 * refuses it, since there is no way to serialise a function.
 *
 * Naming the icons here, on the client side of the line, is the whole fix. The page
 * renders `<HomeWhy />` and passes nothing.
 *
 * The quote below is a placeholder and says so in as many words. That is deliberate:
 * a made-up testimonial attributed to a plausible-sounding person is published the
 * moment it renders, and nobody reviewing the page later can tell it from a real one.
 * This one cannot be mistaken for an endorsement even if it ships by accident.
 *
 * Replace `quote` and `author` with the real words, name, role and photograph.
 *
 * The icons here are lucide's, and stay lucide: `feature235` is a catalogue block
 * that ships with lucide and types its `icon` as a lucide component. The site
 * moved to hugeicons everywhere it draws its own chrome; a registry block is not
 * that, and rewriting it to suit this page would change what a customer installs.
 */
export function HomeWhy() {
  return (
    <Feature235
      className="py-0 pb-12 lg:pb-16 [&>div]:px-0"
      badge={{ label: "Why it works" }}
      heading="Built to be <strong>taken and changed.</strong>"
      description="Everything here is written to leave: one command puts the source in your project, and from that moment it is a file you own like any other."
      button={{ label: "Browse the library", href: "/blocks" }}
      quote="Placeholder: one or two sentences from someone who actually shipped with these blocks, in their own words. Keep it specific about what changed for them."
      author={{
        name: "Replace with a real name",
        role: "Role, Company",
        image: {
          src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
          alt: "",
        },
      }}
      items={[
        {
          icon: Terminal,
          title: "One command",
          description:
            "The shadcn CLI writes the files, registers the primitives they need, and installs their packages.",
        },
        {
          icon: FileCode,
          title: "Source, not a package",
          description:
            "No runtime dependency on us and no upgrade to fight: edit the file, rename it, throw half of it away.",
        },
        {
          icon: Layers,
          title: "Radix or Base UI",
          description:
            "Every block ships in both flavours, generated from one source, so it matches whichever your project already uses.",
        },
        {
          icon: Paintbrush,
          title: "Themed by tokens",
          description:
            "Tailwind v4 and shadcn tokens throughout, so a block takes your colours, radius and dark mode without edits.",
        },
      ]}
    />
  );
}
