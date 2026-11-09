import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ReceiptText } from "lucide-react";

import { Container } from "@/components/layout/container";
import { OrdersClient } from "@/components/marketplace/orders-client";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Trade Orders & Dispatches — Belpatri",
  description:
    "Track APMC weighbridge records, cold logistics GPS and Belpatri escrow settlements.",
};

export default function OrdersPage() {
  return (
    <Container className="space-y-5 pt-5 pb-12">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="transition hover:text-green-800">
          Marketplace
        </Link>
        <span aria-hidden>/</span>
        <span className="font-semibold text-slate-800">Trade Orders</span>
      </nav>

      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-green-100 text-green-800">
              <ReceiptText className="size-5" />
            </span>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Trade Orders &amp; Dispatches
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time APMC weighbridge records, cold logistics GPS tracking and
            Belpatri Escrow settlements.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:border-green-600 hover:bg-green-50 hover:text-green-800"
          render={<Link href="/" />}
        >
          <ArrowLeft className="size-4" />
          Back to Marketplace
        </Button>
      </div>

      <OrdersClient />
    </Container>
  );
}
