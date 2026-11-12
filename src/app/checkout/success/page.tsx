import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCheck,
  Download,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { markets } from "@/lib/data";
import { npr } from "@/lib/format";
import type { MarketId } from "@/lib/types";

export const metadata: Metadata = {
  title: "Order Verified — Belpatri",
  description: "Your trade pass has been generated and dispatched to the weighing yard.",
};

const validMarkets: MarketId[] = ["managed", "vendor", "farmer"];

export const instant = false;

export default async function CheckoutSuccessPage({
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
  const mode = params.mode === "invite" ? "invite" : "self";
  const total = Number(params.total) || 0;

  return (
    <Container className="flex justify-center py-10 pb-16">
      <div className="w-full max-w-xl space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-100 text-green-700 ring-8 ring-green-50">
            <CheckCheck className="size-10" strokeWidth={2.4} />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Order Verified!
          </h1>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">
            Your trade pass <span className="font-mono font-bold">#BPT-9044</span>{" "}
            has been generated and dispatched to the weighing yard.
          </p>

          <div className="mt-5 space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-left text-[13px]">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="size-3.5 text-green-700" />
                Delivery gate
              </span>
              <span className="text-right font-semibold text-slate-800">
                Kalimati Trade Hub, Bay 2
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-500">
                <ShieldCheck className="size-3.5 text-green-700" />
                Escrow state
              </span>
              <span className="font-semibold text-green-700">
                {mode === "invite" ? "Awaiting payer approval" : "Verified & held"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-500">
                <PackageCheck className="size-3.5 text-green-700" />
                Market division
              </span>
              <span className="font-semibold text-slate-800">{marketData.label}</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-2">
              <span className="text-slate-500">Dispatch total</span>
              <span className="font-mono text-sm font-extrabold text-green-800">
                {npr(total)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Button
              className="h-11 w-full rounded-xl text-sm font-bold shadow-md"
              render={<Link href="/orders/BPT-88219" />}
            >
              <Truck className="size-4" />
              Track Live Dispatch
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full rounded-xl text-[13px] font-semibold"
              render={<Link href="/" />}
            >
              Back to Marketplace
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="ghost"
              className="h-9 w-full rounded-xl text-[13px] font-semibold text-slate-500"
            >
              <Download className="size-3.5" />
              Download provisional invoice
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Weighbridge assigned",
              description: "Belpatri yard slot confirmed.",
              icon: PackageCheck,
            },
            {
              title: "Cold truck allocated",
              description: "GPS tracking becomes live at dispatch.",
              icon: Truck,
            },
            {
              title: "Escrow protected",
              description: "Released only after unloading signoff.",
              icon: BadgeCheck,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
            >
              <item.icon className="size-4 text-green-700" />
              <p className="mt-2 text-[13px] font-bold text-slate-900">{item.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
