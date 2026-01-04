"use client";

import { ArrowUpRight, Clock, Vote } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: "active" | "passed" | "rejected" | "pending";
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  endTime: string;
  proposer: string;
  url: string;
}

interface Crypto24Props {
  badge?: string;
  heading?: string;
  description?: string;
  proposals?: Proposal[];
  labels?: {
    active?: string;
    passed?: string;
    rejected?: string;
    pending?: string;
    for?: string;
    against?: string;
    quorum?: string;
    left?: string;
    proposedBy?: string;
    votes?: string;
  };
  className?: string;
}

function StatusBadge({
  status,
  labels,
}: {
  status: Proposal["status"];
  labels: Crypto24Props["labels"];
}) {
  const styles = {
    active: "bg-foreground/10 text-foreground",
    passed: "bg-emerald-500/10 text-emerald-500",
    rejected: "bg-rose-500/10 text-rose-500",
    pending: "bg-muted text-muted-foreground",
  };

  const statusLabels = {
    active: labels?.active ?? "Active",
    passed: labels?.passed ?? "Passed",
    rejected: labels?.rejected ?? "Rejected",
    pending: labels?.pending ?? "Pending",
  };

  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium",
        styles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

function VoteBar({
  votesFor,
  votesAgainst,
  quorum,
  totalVotes,
  labels,
}: {
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  totalVotes: number;
  labels: Crypto24Props["labels"];
}) {
  const total = votesFor + votesAgainst;
  const forPercent = total > 0 ? (votesFor / total) * 100 : 50;
  const quorumPercent = (totalVotes / quorum) * 100;

  const forLabel = labels?.for ?? "For";
  const againstLabel = labels?.against ?? "Against";
  const quorumLabel = labels?.quorum ?? "Quorum";

  return (
    <div className="space-y-2">
      {/* Vote distribution */}
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="bg-emerald-400/60 transition-all"
          style={{ width: `${forPercent}%` }}
        />
        <div
          className="bg-rose-400/60 transition-all"
          style={{ width: `${100 - forPercent}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs">
        <span className="text-emerald-600 dark:text-emerald-400">
          {forLabel}: {forPercent.toFixed(1)}%
        </span>
        <span className="text-muted-foreground">
          {quorumLabel}: {quorumPercent.toFixed(0)}%
        </span>
        <span className="text-rose-600 dark:text-rose-400">
          {againstLabel}: {(100 - forPercent).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const crypto24Demo: Crypto24Props = {
  badge: "Governance",
  heading: "Active Proposals",
  description:
    "Participate in protocol governance by voting on community proposals.",
  proposals: [
    {
      id: "1",
      title: "Increase staking rewards by 2%",
      description:
        "Proposal to increase the base staking APY from 8% to 10% to attract more long-term stakers.",
      status: "active",
      votesFor: 2450000,
      votesAgainst: 890000,
      totalVotes: 3340000,
      quorum: 4000000,
      endTime: "2 days",
      proposer: "0x1234567890abcdef1234567890abcdef12345678",
      url: "https://beste.co",
    },
    {
      id: "2",
      title: "Add new liquidity pool for ETH/USDC",
      description:
        "Create a new concentrated liquidity pool to improve trading efficiency.",
      status: "active",
      votesFor: 1890000,
      votesAgainst: 1650000,
      totalVotes: 3540000,
      quorum: 4000000,
      endTime: "5 days",
      proposer: "0xabcdef1234567890abcdef1234567890abcdef12",
      url: "https://beste.co",
    },
    {
      id: "3",
      title: "Treasury diversification strategy",
      description:
        "Allocate 20% of treasury to blue-chip DeFi protocols for yield.",
      status: "passed",
      votesFor: 5200000,
      votesAgainst: 1100000,
      totalVotes: 6300000,
      quorum: 4000000,
      endTime: "Ended",
      proposer: "0x567890abcdef1234567890abcdef123456789012",
      url: "https://beste.co",
    },
    {
      id: "4",
      title: "Reduce governance token inflation",
      description: "Decrease annual token emission rate from 5% to 3%.",
      status: "rejected",
      votesFor: 1200000,
      votesAgainst: 3800000,
      totalVotes: 5000000,
      quorum: 4000000,
      endTime: "Ended",
      proposer: "0x890abcdef1234567890abcdef12345678901234",
      url: "https://beste.co",
    },
  ],
  labels: {
    active: "Active",
    passed: "Passed",
    rejected: "Rejected",
    pending: "Pending",
    for: "For",
    against: "Against",
    quorum: "Quorum",
    left: "left",
    proposedBy: "Proposed by",
    votes: "votes",
  },
};

export function Crypto24({
  badge,
  heading,
  description,
  proposals = [],
  labels = {},
  className,
}: Crypto24Props) {
  const { left: leftLabel, proposedBy: proposedByLabel, votes: votesLabel } = labels;

  if (proposals.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground">
            <Vote className="size-4" />
            {badge}
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Link
              key={proposal.id}
              href={proposal.url}
              className="group block rounded-xl border bg-card p-5 transition-all hover:border-foreground/20 hover:bg-muted/30"
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <StatusBadge status={proposal.status} labels={labels} />
                    {proposal.status === "active" && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {proposal.endTime} {leftLabel}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:underline">
                    {proposal.title}
                  </h3>
                </div>
                <ArrowUpRight className="size-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              {/* Description */}
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {proposal.description}
              </p>

              {/* Vote Bar */}
              <VoteBar
                votesFor={proposal.votesFor}
                votesAgainst={proposal.votesAgainst}
                quorum={proposal.quorum}
                totalVotes={proposal.totalVotes}
                labels={labels}
              />

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                <span>
                  {proposedByLabel} {shortenAddress(proposal.proposer)}
                </span>
                <span>
                  {(proposal.totalVotes / 1000000).toFixed(1)}M {votesLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
