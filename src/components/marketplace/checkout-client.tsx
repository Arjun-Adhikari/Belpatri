"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/marketplace/checkout-form";
import { productById, useCartHydrated, useCartStore } from "@/lib/cart-store";
import { cartTotals } from "@/lib/format";
import type { MarketId } from "@/lib/types";

export function CheckoutClient({
  market,
  marketLabel,
}: {
  market: MarketId;
  marketLabel: string;
}) {
  const hydrated = useCartHydrated();
  const lines = useCartStore((state) => state.carts[market]);

  if (!hydrated) {
    return (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  const detailed = lines.flatMap((line) => {
    const product = productById[line.productId];
    if (!product) return [];
    return [
      {
        title: product.title,
        unit: product.unit,
        qty: line.qty,
        price: product.price,
      },
    ];
  });

  if (detailed.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-xs">
        <ShoppingCart className="mx-auto mb-2 size-10 text-slate-300" />
        <h2 className="text-sm font-bold text-slate-700">
          Nothing to check out in this cart
        </h2>
        <p className="mt-1 text-[13px] text-slate-400">
          Add a {marketLabel.toLowerCase()} lot before starting a dispatch.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Button className="rounded-xl" render={<Link href={`/?market=${market}`} />}>
            Browse lots
          </Button>
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 text-[13px] font-semibold"
            render={<Link href="/cart" />}
          >
            Back to carts
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = detailed.reduce(
    (total, line) => total + line.price * line.qty,
    0,
  );
  const totals = cartTotals(subtotal);

  return (
    <CheckoutForm
      market={market}
      marketLabel={marketLabel}
      lines={detailed}
      subtotal={totals.subtotal}
      cess={totals.cess}
    />
  );
}
