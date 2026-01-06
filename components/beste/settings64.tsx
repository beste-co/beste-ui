"use client";

import {
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  FileText,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  description: string;
  invoiceNumber: string;
  downloadUrl?: string;
}

interface Settings64Props {
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline";
  };
  heading?: string;
  description?: string;
  invoices?: Invoice[];
  labels?: {
    date?: string;
    description?: string;
    amount?: string;
    status?: string;
    paid?: string;
    pending?: string;
    failed?: string;
    download?: string;
    noInvoices?: string;
    viewAll?: string;
  };
  viewAllUrl?: string;
  className?: string;
}

export const settings64Demo: Settings64Props = {
  badge: { label: "Billing", variant: "secondary" },
  heading: "Billing History",
  description: "View and download your past invoices and payment history.",
  invoices: [
    {
      id: "1",
      date: "Jan 1, 2024",
      amount: "$29.00",
      status: "paid",
      description: "Pro Plan - Monthly",
      invoiceNumber: "INV-2024-001",
      downloadUrl: "https://beste.co",
    },
    {
      id: "2",
      date: "Dec 1, 2023",
      amount: "$29.00",
      status: "paid",
      description: "Pro Plan - Monthly",
      invoiceNumber: "INV-2023-012",
      downloadUrl: "https://beste.co",
    },
    {
      id: "3",
      date: "Nov 1, 2023",
      amount: "$29.00",
      status: "paid",
      description: "Pro Plan - Monthly",
      invoiceNumber: "INV-2023-011",
      downloadUrl: "https://beste.co",
    },
    {
      id: "4",
      date: "Oct 1, 2023",
      amount: "$29.00",
      status: "failed",
      description: "Pro Plan - Monthly",
      invoiceNumber: "INV-2023-010",
      downloadUrl: "https://beste.co",
    },
    {
      id: "5",
      date: "Sep 1, 2023",
      amount: "$29.00",
      status: "paid",
      description: "Pro Plan - Monthly",
      invoiceNumber: "INV-2023-009",
      downloadUrl: "https://beste.co",
    },
  ],
  labels: {
    date: "Date",
    description: "Description",
    amount: "Amount",
    status: "Status",
    paid: "Paid",
    pending: "Pending",
    failed: "Failed",
    download: "Download",
    noInvoices: "No invoices yet",
    viewAll: "View All Invoices",
  },
  viewAllUrl: "https://beste.co",
};

export function Settings64({
  badge,
  heading,
  description,
  invoices = [],
  labels = {},
  viewAllUrl,
  className,
}: Settings64Props) {
  const {
    date: dateLabel,
    description: descLabel,
    amount: amountLabel,
    status: statusLabel,
    paid: paidLabel,
    pending: pendingLabel,
    failed: failedLabel,
    download: downloadLabel,
    noInvoices: noInvoicesLabel,
    viewAll: viewAllLabel,
  } = labels;

  const getStatusBadge = (invoiceStatus: Invoice["status"]) => {
    switch (invoiceStatus) {
      case "paid":
        return (
          <Badge
            variant="outline"
            className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-normal"
          >
            <CheckCircle className="size-3" />
            {paidLabel}
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/20 bg-amber-500/10 text-amber-600 font-normal"
          >
            <Clock className="size-3" />
            {pendingLabel}
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="border-rose-500/20 bg-rose-500/10 text-rose-600 font-normal"
          >
            <XCircle className="size-3" />
            {failedLabel}
          </Badge>
        );
    }
  };

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {badge?.label && (
              <Badge variant={badge.variant} className="w-fit">
                <CreditCard className="mr-1 size-3" />
                {badge.label}
              </Badge>
            )}
            {heading && (
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>

          {invoices.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-8 text-center">
              <FileText className="size-12 text-muted-foreground" />
              <p className="text-muted-foreground">{noInvoicesLabel}</p>
            </div>
          ) : (
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="px-4">{dateLabel}</TableHead>
                    <TableHead className="px-4">{descLabel}</TableHead>
                    <TableHead className="px-4">{amountLabel}</TableHead>
                    <TableHead className="px-4 text-center">
                      {statusLabel}
                    </TableHead>
                    <TableHead className="px-4 w-12 text-right">
                      {downloadLabel}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="px-4">
                        <div className="font-medium">{invoice.date}</div>
                        <div className="text-xs text-muted-foreground">
                          {invoice.invoiceNumber}
                        </div>
                      </TableCell>
                      <TableCell className="px-4">
                        {invoice.description}
                      </TableCell>
                      <TableCell className="px-4 font-medium">
                        {invoice.amount}
                      </TableCell>
                      <TableCell className="px-4 text-center">
                        {getStatusBadge(invoice.status)}
                      </TableCell>
                      <TableCell className="px-4 text-right">
                        {invoice.downloadUrl ? (
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={invoice.downloadUrl}>
                              <Download className="size-4" />
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon" disabled>
                            <Download className="size-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {invoices.length > 0 && viewAllUrl && (
            <div className="flex justify-center">
              <Button variant="outline" asChild>
                <Link href={viewAllUrl}>{viewAllLabel}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
