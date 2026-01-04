"use client";

import { ArrowLeft, Check, Copy, ExternalLink } from "lucide-react";
import { BesteIcon, BesteLogo } from "@/components/svgs/beste-logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBlock } from "@/lib/blocks";
import { notFound } from "next/navigation";

interface Props {
  name: string;
}

export default function BlockPageClient({ name }: Props) {
  const block = getBlock(name);
  const [copied, setCopied] = useState(false);
  const [codeHtml, setCodeHtml] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("view");
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (activeTab === "code" && !fetchedRef.current) {
      fetchedRef.current = true;
      let cancelled = false;
      (async () => {
        try {
          const res = await fetch(`/api/code/${name}`);
          const data = await res.json();
          if (!cancelled) {
            setCodeHtml(data.html);
          }
        } catch {
          // ignore
        }
      })();
      return () => {
        cancelled = true;
      };
    }
  }, [activeTab, name]);

  if (!block) {
    notFound();
  }

  const Component = block.component;
  const npxCommand = `npx shadcn@latest add https://ui.beste.co/r/${name}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(npxCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full gap-0"
      >
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 h-14">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <BesteIcon />
                <BesteLogo />
              </Link>

              <div className="h-5 w-px bg-slate-200" />

              <span className="text-sm font-medium text-slate-900">{name}</span>

              <TabsList className="h-8 ml-2">
                <TabsTrigger value="view" className="text-xs px-3">
                  View
                </TabsTrigger>
                <TabsTrigger value="code" className="text-xs px-3">
                  Code
                </TabsTrigger>
              </TabsList>

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-mono px-4 py-2 rounded-md transition-colors cursor-pointer"
              >
                <span className="text-slate-400">$</span>
                {npxCommand}
                {copied ? (
                  <Check className="size-3.5 text-green-600" />
                ) : (
                  <Copy className="size-3.5 text-slate-400" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/" className="gap-1.5">
                  <ArrowLeft className="size-3.5" />
                  Back
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://ui.beste.co/block/${name}`}
                  target="_blank"
                  className="gap-1.5"
                >
                  <ExternalLink className="size-3.5" />
                  Open
                </a>
              </Button>
            </div>
          </div>
        </header>

        <TabsContent value="view" className="mt-0">
          <main className={block.fullscreen ? "" : "py-8"}>
            <Component {...block.demoProps} />
          </main>
        </TabsContent>

        <TabsContent value="code" className="mt-0">
          <div className="w-full mx-auto">
            {!codeHtml ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
              </div>
            ) : codeHtml ? (
              <div
                className="overflow-hidden text-sm [&_pre]:p-6 [&_pre]:overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: codeHtml }}
              />
            ) : (
              <div className="text-center py-20 text-slate-500">
                Failed to load code
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
