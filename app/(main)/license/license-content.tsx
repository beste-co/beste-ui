"use client";

import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <header className="mb-10 md:mb-12">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">License</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          The Beste UI license lets you use these components freely in your own projects, with a
          few restrictions on passing them on.
        </p>
      </header>

      {/*
        Two panels on the page's own surface rather than a green box and a red
        one. The tint said "good news / bad news" before either heading was read,
        which is the wrong first impression for a licence: both lists are simply
        what the terms say. The tone survives in the icons, where it belongs.
      */}
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl bg-muted/60 p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <HugeiconsIcon icon={Tick02Icon} size={20} strokeWidth={2} className="text-teal-600 dark:text-teal-400" aria-hidden="true" />
            Permissions
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {permissions.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-base text-foreground/70">
                <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2} className="shrink-0 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl bg-muted/60 p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} className="text-destructive" aria-hidden="true" />
            Restrictions
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {restrictions.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-base text-foreground/70">
                <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} className="shrink-0 text-destructive" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-xl bg-muted/60 p-6">
        <h2 className="text-xl font-semibold tracking-tight">Full license</h2>
        {/* The terms as written, on a lighter surface: a legal text is quoted
            here, not laid out, so it keeps its own line breaks and its own
            monospace column. It scrolls sideways rather than widening the page. */}
        <div className="mt-5 overflow-x-auto rounded-lg bg-background p-5">
          <pre className="m-0 whitespace-pre-wrap bg-transparent p-0 font-mono text-sm leading-7 text-foreground/70">
            {LICENSE_TEXT}
          </pre>
        </div>
      </section>

      <footer className="mt-10 text-center">
        <p className="text-base text-foreground/70">
          Questions about the license? Reach out on{" "}
          <a
            href="https://x.com/withbeste"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/70"
          >
            X
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
