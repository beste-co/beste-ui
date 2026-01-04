"use client";

import { Check, Code, Copy, ExternalLink, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Contract {
  id: string;
  name: string;
  address: string;
  chain: string;
  verified: boolean;
  explorerUrl: string;
}

interface Crypto35Props {
  badge?: string;
  heading?: string;
  description?: string;
  contracts?: Contract[];
  labels?: {
    verified?: string;
    warning?: string;
  };
  className?: string;
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="icon" onClick={handleCopy}>
      {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
    </Button>
  );
}

export const crypto35Demo: Crypto35Props = {
  badge: "Contracts",
  heading: "Smart Contract Addresses",
  description: "All verified contract addresses for our protocol deployments.",
  contracts: [
    {
      id: "1",
      name: "Token Contract",
      address: "0x1234567890abcdef1234567890abcdef12345678",
      chain: "Ethereum",
      verified: true,
      explorerUrl: "https://beste.co",
    },
    {
      id: "2",
      name: "Staking Contract",
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      chain: "Ethereum",
      verified: true,
      explorerUrl: "https://beste.co",
    },
    {
      id: "3",
      name: "Governance Contract",
      address: "0x567890abcdef1234567890abcdef123456789012",
      chain: "Ethereum",
      verified: true,
      explorerUrl: "https://beste.co",
    },
    {
      id: "4",
      name: "Treasury Contract",
      address: "0x890abcdef1234567890abcdef12345678901234",
      chain: "Ethereum",
      verified: false,
      explorerUrl: "https://beste.co",
    },
    {
      id: "5",
      name: "Bridge Contract",
      address: "0xcdef1234567890abcdef1234567890abcdef1234",
      chain: "Arbitrum",
      verified: true,
      explorerUrl: "https://beste.co",
    },
  ],
  labels: {
    verified: "Verified",
    warning: "Always verify contract addresses before interacting. Only use official sources.",
  },
};

export function Crypto35({
  badge,
  heading,
  description,
  contracts = [],
  labels = {},
  className,
}: Crypto35Props) {
  const { verified: verifiedLabel, warning: warningLabel } = labels;

  if (contracts.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground">
            <Code className="size-4" />
            {badge}
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {heading}
          </h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Contracts List */}
        <div className="space-y-3">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Code className="size-5 text-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{contract.name}</h3>
                      {contract.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                          <Shield className="size-3" />
                          {verifiedLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{contract.chain}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded-lg bg-muted px-3 py-2 font-mono text-sm text-foreground sm:flex-none">
                    {shortenAddress(contract.address)}
                  </code>
                  <CopyButton text={contract.address} />
                  <Button variant="outline" size="icon" asChild>
                    <Link href={contract.explorerUrl}>
                      <ExternalLink className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="mt-6 rounded-xl border border-foreground/10 bg-muted/50 p-4">
          <p className="text-center text-sm text-muted-foreground">{warningLabel}</p>
        </div>
      </div>
    </section>
  );
}
