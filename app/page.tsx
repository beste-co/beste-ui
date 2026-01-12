import { BesteIcon, BesteLogo } from "@/components/svgs/beste-logo";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";
import { XLogo } from "@/components/svgs/x-logo";
import { blocks } from "@/lib/blocks";

export default function Home() {
  const categories = [...new Set(blocks.map((b) => b.category))];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <BesteIcon />
            <BesteLogo />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/beste-co/beste-ui"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4" />
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://x.com/withbeste"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-1.5"
              >
                <XLogo width={14} height={14} />
                Follow on X
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {categories.map((category) => {
          const categoryBlocks = blocks.filter((b) => b.category === category);
          return (
            <section key={category} className="mb-16">
              <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-slate-300" />
                {category}
                <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {categoryBlocks.length}
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryBlocks.map((block) => (
                  <Link
                    key={block.name}
                    href={`/blocks/${block.name}`}
                    className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 
                               hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50
                               transition-all duration-300 ease-out"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-800 group-hover:text-slate-900">
                          {block.title}
                        </h3>
                        {block.fullscreen && (
                          <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                            Fullscreen
                          </span>
                        )}
                      </div>
                      <span className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all">
                        →
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {block.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
