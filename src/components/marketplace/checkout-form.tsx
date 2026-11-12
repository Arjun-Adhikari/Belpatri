"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  Link2,
  Lock,
  MapPin,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/cart-store";
import { npr } from "@/lib/format";
import type { MarketId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CheckoutForm({
  market,
  marketLabel,
  lines,
  subtotal,
  cess,
}: {
  market: MarketId;
  marketLabel: string;
  lines: { title: string; unit: string; qty: number; price: number }[];
  subtotal: number;
  cess: number;
}) {
  const [mode, setMode] = useState<"self" | "invite">("self");
  const total = subtotal + cess;
  const inviteLink = `https://belpatri.trade/pay/inv-${market}-88219x`;
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clear);

  const placeOrder = () => {
    clearCart(market);
    router.push(`/checkout/success?market=${market}&mode=${mode}&total=${total}`);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Payment link copied", {
        description: "Share it with your financier or business partner.",
      });
    } catch {
      toast.error("Could not copy the link", {
        description: "Select the link and copy it manually.",
      });
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-green-100 text-green-800">
                <MapPin className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  1. Delivery location
                </h2>
                <p className="text-[11px] text-slate-500">
                  Weighbridge and warehouse bay for this dispatch.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-800">
              {marketLabel} division
            </span>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="firm" className="text-[11px] text-slate-500">
                Commercial firm / trader name
              </Label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="firm"
                  defaultValue="Himalayan Commercial Trade Pvt Ltd"
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="destination" className="text-[11px] text-slate-500">
                Destination warehouse bay
              </Label>
              <Input
                id="destination"
                defaultValue="Silo Yard 4, Kalimati Trade Hub, Bagmati 44600"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[11px] text-slate-500">
                Contact phone (driver updates)
              </Label>
              <Input
                id="phone"
                defaultValue="+977 9841 234 567"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gst" className="text-[11px] text-slate-500">
                PAN / VAT for tax invoice
              </Label>
              <Input
                id="gst"
                defaultValue="601234567"
                className="h-11 rounded-xl font-mono text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-[11px] text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 size-3.5 rounded border-slate-300 text-green-700 focus:ring-green-600"
                />
                Send weighbridge and gate-pass alerts on SMS and WhatsApp.
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/60 px-5 py-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-green-100 text-green-800">
              <Wallet className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                2. Payment responsibility
              </h2>
              <p className="text-[11px] text-slate-500">
                Escrow is staged before the gate pass is authorised.
              </p>
            </div>
          </div>

          <div className="space-y-3 p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("self")}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  mode === "self"
                    ? "border-green-700 bg-green-50"
                    : "border-slate-200 bg-slate-50/40 hover:border-green-300",
                )}
                aria-pressed={mode === "self"}
              >
                <CreditCard
                  className={cn(
                    "mb-2 size-5",
                    mode === "self" ? "text-green-700" : "text-slate-500",
                  )}
                />
                <span className="block text-xs font-bold text-slate-900">
                  Pay myself
                </span>
                <span className="mt-0.5 block text-[10px] text-slate-500">
                  Escrow / eSewa / Khalti
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode("invite")}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  mode === "invite"
                    ? "border-green-700 bg-green-50"
                    : "border-slate-200 bg-slate-50/40 hover:border-green-300",
                )}
                aria-pressed={mode === "invite"}
              >
                <Share2
                  className={cn(
                    "mb-2 size-5",
                    mode === "invite" ? "text-green-700" : "text-slate-500",
                  )}
                />
                <span className="block text-xs font-bold text-slate-900">
                  Invite payer
                </span>
                <span className="mt-0.5 block text-[10px] text-slate-500">
                  Send link to financier / partner
                </span>
              </button>
            </div>

            {mode === "invite" ? (
              <div className="space-y-2.5 rounded-xl border border-green-200 bg-green-50/60 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-green-800">
                  <Link2 className="size-4" />
                  Shareable escrow payment link
                </div>
                <p className="text-[11px] leading-relaxed text-green-900/70">
                  The order reservation stays locked for 90 minutes.
                  Dispatch begins once the invoice is cleared.
                </p>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={inviteLink}
                    className="h-9 flex-1 rounded-lg border-green-200 bg-white font-mono text-[11px] text-slate-600"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 shrink-0 rounded-lg border-green-200 bg-white text-xs font-semibold text-green-800 hover:bg-green-100"
                    onClick={copyLink}
                  >
                    <Copy className="size-3.5" />
                    Copy
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-[11px] text-slate-600">
                <Lock className="size-4 shrink-0 text-green-700" />
                <span>
                  A payment mandate will be raised on your verified Nabil Bank escrow
                  account ending 8812.
                </span>
              </div>
            )}
          </div>
        </section>

        <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-[11px] text-slate-500 shadow-xs">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-green-700" />
          Belpatri holds 100% of the payable amount in escrow. Funds are only
          released after the destination weighbridge signs off unloading.
        </div>
      </div>

      <aside className="h-fit space-y-4 lg:sticky lg:top-24">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Order summary</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
              {lines.reduce((count, line) => count + line.qty, 0)} lots
            </span>
          </div>

          <ul className="mt-3 space-y-2.5 border-b border-slate-100 pb-3">
            {lines.map((line) => (
              <li
                key={line.title}
                className="flex items-start justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="line-clamp-1 font-semibold text-slate-800">
                    {line.title}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {line.qty} × {npr(line.price)}/{line.unit}
                  </p>
                </div>
                <span className="shrink-0 font-mono font-semibold text-slate-700">
                  {npr(line.price * line.qty)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <dt className="text-slate-500">Commodity subtotal</dt>
              <dd className="font-mono font-semibold text-slate-800">
                {npr(subtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Belpatri facilitation fee (1.5%)</dt>
              <dd className="font-mono font-semibold text-slate-800">
                {npr(cess)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Cold-chain logistics</dt>
              <dd className="font-semibold text-green-700">Free</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-bold text-slate-900">
              <dt>Final dispatch total</dt>
              <dd className="font-mono text-base font-extrabold text-green-800">
                {npr(total)}
              </dd>
            </div>
          </dl>

          <Button
            className="mt-4 h-12 w-full rounded-xl text-sm font-bold shadow-md"
            onClick={placeOrder}
          >
            <CheckCircle2 className="size-4" />
            Authorize &amp; Place Order
          </Button>

          <Button
            variant="ghost"
            className="mt-1.5 h-9 w-full rounded-xl text-xs font-semibold text-slate-500"
            render={<Link href="/cart" />}
          >
            <ArrowLeft className="size-3.5" />
            Back to carts
          </Button>
        </section>

        <section className="rounded-2xl border border-green-200 bg-green-50/60 p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold text-green-900">
            <ShoppingBag className="size-3.5" />
            Isolated checkout
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-green-900/70">
            This checkout only contains{" "}
            {marketLabel.toLowerCase()} lots. Adding another marketplace lot
            creates a separate order and gate pass.
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-green-900/70">Market division</span>
            <span className="font-bold text-green-900">{marketLabel}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-green-900/70">Dispatch mode</span>
            <span className="flex items-center gap-1 font-bold text-green-900">
              Escrow staged
              <ArrowRight className="size-3" />
            </span>
          </div>
        </section>
      </aside>
    </div>
  );
}
