import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CheckoutClient } from "@/components/marketplace/checkout-client";
import { markets } from "@/lib/data";
import type { MarketId } from "@/lib/types";

export const metadata: Metadata = {
  title: "Logistics Checkout — Belpatri",
  description:
    "Confirm delivery location, payment responsibility and escrow staging before dispatch.",
};

const validMarkets: MarketId[] = ["managed", "vendor", "farmer"];

export const instant = false;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requested = typeof params.market === "string" ? params.market : "managed";
  const market: MarketId = validMarkets.includes(requested as MarketId)
    ? (requested as MarketId)
    : "managed";
  const marketData = markets.find((item) => item.id === market)!;

  return (
    <Container className="space-y-5 pt-5 pb-12">
      <nav className="flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
        <Link href="/cart" className="transition hover:text-green-800">
          Carts
        </Link>
        <span aria-hidden>/</span>
        <span className="font-semibold text-slate-800">Checkout</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-green-100 text-green-800">
              <ShieldCheck className="size-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Logistics Checkout
            </h1>
          </div>
          <p className="mt-1 text-[13px] text-slate-500">
            Verified escrow &amp; gate-pass clearance
            {market === "managed" ? null : ` · ${marketData.label} marketplace`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold text-green-800">
            Step 2 of 2
          </span>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-slate-500 transition hover:text-green-800"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </Link>
        </div>
      </div>

      <CheckoutClient market={market} marketLabel={marketData.label} />
    </Container>
  );
}
