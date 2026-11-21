"use client";

import { Cancel01Icon, Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { StageBackdrop } from "@/components/beste/component/stage-panel";
import { typography } from "@/lib/typography";

const permissions = [
  "Use in personal projects",
  "Use in commercial projects",
  "Modify the source code",
  "Create derivative works",
];

const restrictions = [
  "Sell as a standalone product",
  "Redistribute on marketplaces",
  "Rebrand and distribute",
];

const LICENSE_TEXT = `Beste UI License

Copyright (c) 2026 Beste UI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to use,
copy, modify, and merge the Software in personal and commercial projects,
subject to the following restrictions:

1. NO RESALE
   You may not sell the components, templates, or any derivative works as a
   standalone product or as part of a UI kit, template library, or similar
   offering.

2. NO REDISTRIBUTION
   You may not redistribute the source code on other marketplaces, UI
   libraries, component stores, or any platform that distributes code to
   third parties.

3. NO REBRANDING
   You may not distribute this software under a different name or brand.
   Attribution to Beste UI must be maintained.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export function LicenseContent() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = () => {
    // Clipboard can be blocked (iframes, permissions); the label still confirms the click.
    navigator.clipboard?.writeText(LICENSE_TEXT).catch(() => {});
    setCopied(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      {/* The sky is light in every theme, so the ink on it is fixed dark */}
      <header className="relative isolate overflow-hidden rounded-4xl bg-white px-7 py-12 text-neutral-950 md:px-12 md:py-16">
        <StageBackdrop src="sage" className="-z-10" />
        <p className="text-base font-medium text-neutral-950/70">License</p>
        <h1 className="mt-3 max-w-2xl text-balance text-4xl leading-none font-medium tracking-tighter md:text-6xl">Build anything with it. Just do not resell it.</h1>
        <p className="mt-5 max-w-xl text-base text-neutral-950/70 md:text-lg">
          The Beste UI license lets you use these components freely in your own projects, with a few restrictions on
          passing them on.
        </p>
      </header>

      {/* Both lists are simply what the terms say, so neither is tinted; the mark in front says which is which */}
      <div className="mt-2.5 grid gap-2.5 md:grid-cols-2">
        <section className="rounded-4xl bg-muted p-7 md:p-10">
          <h2 className="text-2xl font-medium tracking-tight md:text-3xl">You can</h2>
          <ul className="mt-8 flex flex-col gap-4">
            {permissions.map((item) => (
              <li key={item} className="flex items-center gap-3.5 text-lg">
                <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-4xl bg-muted p-7 md:p-10">
          <h2 className="text-2xl font-medium tracking-tight md:text-3xl">You cannot</h2>
          <ul className="mt-8 flex flex-col gap-4">
            {restrictions.map((item) => (
              <li key={item} className="flex items-center gap-3.5 text-lg">
                <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background text-foreground">
                  <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-16 md:mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className={typography.h2}>The full license</h2>
          <button
            type="button"
            onClick={copy}
            aria-live="polite"
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-muted px-4 text-sm font-medium transition-colors hover:bg-foreground/10"
          >
            <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={14} strokeWidth={2} aria-hidden="true" />
            {copied ? "Copied" : "Copy text"}
          </button>
        </div>
        {/* The terms as written: a legal text is quoted here, not laid out, so it keeps its own line breaks */}
        <div className="mt-6 rounded-4xl bg-muted p-2.5">
          <pre className="m-0 overflow-x-auto rounded-3xl bg-background p-6 font-sans text-base leading-7 whitespace-pre-wrap text-foreground/80 md:p-10">{LICENSE_TEXT}</pre>
        </div>
      </section>

      <p className="mt-10 text-center text-base text-muted-foreground">
        Questions about the license? Reach out on{" "}
        <a
          href="https://x.com/withbeste"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          X
        </a>
        .
      </p>
    </div>
  );
}
