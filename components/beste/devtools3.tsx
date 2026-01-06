"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeTab {
  language: string;
  label: string;
  code: string;
}

interface Devtools3Props {
  heading?: string;
  description?: string;
  tabs?: CodeTab[];
  labels?: {
    copy?: string;
    copied?: string;
  };
  className?: string;
}

export const devtools3Demo: Devtools3Props = {
  heading: "Quick Start",
  description: "Make your first API request using your preferred language.",
  tabs: [
    {
      language: "javascript",
      label: "JavaScript",
      code: `import Acme from '@acme/sdk';

const client = new Acme({
  apiKey: process.env.ACME_API_KEY,
});

const user = await client.users.create({
  email: 'user@example.com',
  name: 'John Doe',
});

console.log(user.id);`,
    },
    {
      language: "python",
      label: "Python",
      code: `from acme import Acme

client = Acme(
    api_key=os.environ["ACME_API_KEY"]
)

user = client.users.create(
    email="user@example.com",
    name="John Doe"
)

print(user.id)`,
    },
    {
      language: "bash",
      label: "cURL",
      code: `curl -X POST https://api.acme.com/v1/users \\
  -H "Authorization: Bearer $ACME_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "name": "John Doe"
  }'`,
    },
    {
      language: "go",
      label: "Go",
      code: `package main

import (
    "fmt"
    "github.com/acme/acme-go"
)

func main() {
    client := acme.NewClient(os.Getenv("ACME_API_KEY"))

    user, err := client.Users.Create(&acme.UserParams{
        Email: "user@example.com",
        Name:  "John Doe",
    })

    if err != nil {
        log.Fatal(err)
    }

    fmt.Println(user.ID)
}`,
    },
  ],
  labels: {
    copy: "Copy",
    copied: "Copied!",
  },
};

export function Devtools3({
  heading,
  description,
  tabs = [],
  labels = {},
  className,
}: Devtools3Props) {
  const { copy = "Copy", copied = "Copied!" } = labels;

  const [activeTab, setActiveTab] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  const handleCopy = () => {
    if (tabs[activeTab]) {
      navigator.clipboard.writeText(tabs[activeTab].code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  useEffect(() => {
    const currentTab = tabs[activeTab];
    if (!currentTab) return;

    codeToHtml(currentTab.code, {
      lang: currentTab.language,
      theme: "github-dark", // themes on https://shiki.style/themes
    }).then((html) => {
      setHighlightedCode(html);
    });
  }, [activeTab, tabs]);

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        {/* Header */}
        {(heading || description) && (
          <div className="mb-6">
            {heading && (
              <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
            )}
            {description && (
              <p className="mt-2 text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        {/* Code Block with Tabs */}
        <div className="overflow-hidden rounded-lg border bg-zinc-950">
          {/* Tab Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800">
            <div className="flex">
              {tabs.map((tab, index) => (
                <button
                  key={tab.language}
                  onClick={() => {
                    setActiveTab(index);
                    setIsCopied(false);
                  }}
                  className={cn(
                    "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                    activeTab === index
                      ? "border-primary text-zinc-100"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Copy Button */}
            <div className="pr-2">
              <Button
                variant="link"
                size="sm"
                onClick={handleCopy}
                className="h-7 gap-2 text-xs text-zinc-400 hover:text-zinc-100"
              >
                {isCopied ? (
                  <>
                    <Check className="size-3.5 text-green-500" />
                    {copied}
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    {copy}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Code Content */}
          <div className="overflow-x-auto">
            <div
              className={cn(
                "p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:block"
              )}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
