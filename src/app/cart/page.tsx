"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Info,
  ShoppingCart,
  Store,
  Trash2,
  Truck,
  Wallet,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LotStepper } from "@/components/marketplace/lot-stepper";
import { ProductImage } from "@/components/marketplace/product-image";
import { markets, products } from "@/lib/data";
import { npr } from "@/lib/format";
import type { CartLine, MarketId } from "@/lib/types";
import { cn } from "@/lib/utils";

const initialCarts: Record<MarketId, CartLine[]> = {
  managed: [{ productId: "m-1", qty: 2 }],
  vendor: [{ productId: "v-s-1", qty: 1 }],
  farmer: [{ productId: "f-1", qty: 1 }],
};

const productIndex = Object.fromEntries(products.map((product) => [product.id, product]));

const marketMeta = {
  managed: {
    title: "Managed Market Cart",
    description: "Aggregated Belpatri lots with escrow protection.",
    accent: "bg-green-700",
    icon: BadgeCheck,
  },
  vendor: {
    title: "Vendor Store Cart",
    description: "Locked to a single verified APMC vendor store.",
    accent: "bg-emerald-800",
    icon: Store,
  },
  farmer: {
    title: "Farmer Direct Cart",
    description: "Farm-gate lots settled without brokerage.",
    accent: "bg-teal-800",
    icon: Truck,
  },
} as const;

const order = markets.map((market) => market.id);

export default function CartPage() {
  const [carts, setCarts] = useState<Record<MarketId, CartLine[]>>(initialCarts);
  const [active, setActive] = useState<MarketId>("managed");

  const counts = useMemo(
    () => ({
      managed: carts.managed.length,
      vendor: carts.vendor.length,
      farmer: carts.farmer.length,
    }),
    [carts],
  );

  const updateQty = (market: MarketId, productId: string, next: number) => {
    setCarts((prev) => ({
      ...prev,
      [market]: prev[market].map((line) =>
        line.productId === productId ? { ...line, qty: Math.max(1, next) } : line,
      ),
    }));
  };

  const removeLine = (market: MarketId, productId: string) => {
    setCarts((prev) => ({
      ...prev,
      [market]: prev[market].filter((line) => line.productId !== productId),
    }));
  };

  return (
    <Container className="space-y-6 pt-5 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-green-100 text-green-800">
              <ShoppingCart className="size-5" />
            </span>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Your Carts
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Three isolated sourcing channels. Lots are never mixed across
            marketplaces or sellers.
          </p>
        </div>
        <Button
          variant="outline"
          className="h-10 rounded-xl border-slate-200 bg-white text-xs font-semibold"
          render={<Link href="/" />}
        >
          Continue sourcing
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <Tabs
        value={active}
        onValueChange={(value) => setActive(value as MarketId)}
        className="gap-4"
      >
        <TabsList className="grid h-auto! w-full grid-cols-3 items-stretch gap-1 rounded-2xl border border-slate-200 bg-slate-100/80 p-1.5 text-slate-500 shadow-2xs">
          {order.map((market) => {
            const meta = marketMeta[market];
            const label = markets.find((item) => item.id === market)!.label;
            const shortLabel =
              market === "vendor"
                ? "Vendor"
                : market === "farmer"
                  ? "Farmer"
                  : "Managed";
            return (
              <TabsTrigger
                key={market}
                value={market}
                className="h-auto min-w-0 gap-1 rounded-xl px-1.5 py-2.5 text-xs font-semibold data-active:bg-white data-active:text-green-800 data-active:shadow-xs sm:gap-1.5 sm:px-2"
              >
                <meta.icon className="size-4 shrink-0" />
                <span className="hidden truncate sm:inline">{label}</span>
                <span className="truncate sm:hidden">{shortLabel}</span>
                <span
                  className={cn(
                    "ml-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold sm:size-5 sm:text-[10px]",
                    active === market
                      ? "bg-green-700 text-white"
                      : "bg-slate-200 text-slate-600",
                  )}
                >
                  {counts[market]}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {order.map((market) => {
          const lines = carts[market];
          const meta = marketMeta[market];
          const subtotal = lines.reduce((total, line) => {
            const product = productIndex[line.productId];
            return total + (product ? product.price * line.qty : 0);
          }, 0);
          const cess = Math.round(subtotal * 0.015);

          return (
            <TabsContent key={market} value={market} className="space-y-4">
              {market === "vendor" && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-950">
                  <span className="flex items-center gap-2">
                    <Store className="size-4 text-amber-700" />
                    Vendor Cart locked to{" "}
                    <strong>Sahyadri Spices &amp; Dry Fruits Hub</strong>
                  </span>
                  <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                    Single-Vendor Rule
                  </span>
                </div>
              )}

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
                <section className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-xl text-white",
                          meta.accent,
                        )}
                      >
                        <meta.icon className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {meta.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {meta.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {lines.length} lot{lines.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {lines.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-xs">
                      <ShoppingCart className="mx-auto mb-2 size-10 text-slate-300" />
                      <h3 className="text-sm font-bold text-slate-700">
                        No lots staged in this cart
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Browse {markets.find((item) => item.id === market)!.label}{" "}
                        and add a verified lot to begin.
                      </p>
                      <Button
                        className="mt-4 rounded-xl"
                        render={<Link href={`/?market=${market}`} />}
                      >
                        Browse lots
                      </Button>
                    </div>
                  ) : (
                    lines.map((line) => {
                      const product = productIndex[line.productId];
                      if (!product) return null;
                      return (
                        <article
                          key={line.productId}
                          className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs transition hover:border-green-300"
                        >
                          <div className="flex items-start gap-3">
                            <ProductImage
                              src={product.image}
                              alt={product.imageAlt}
                              category={product.category}
                              className="size-16 shrink-0 rounded-xl sm:size-20"
                              sizes="80px"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                    {product.categoryName}
                                  </span>
                                  <h3 className="line-clamp-1 text-sm font-bold text-slate-900">
                                    <Link
                                      href={`/products/${product.slug}`}
                                      className="transition hover:text-green-800"
                                    >
                                      {product.title}
                                    </Link>
                                  </h3>
                                  <p className="mt-0.5 text-[11px] text-slate-500">
                                    {npr(product.price)} / {product.unit} · MOQ{" "}
                                    {product.moq}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeLine(market, line.productId)}
                                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                  aria-label={`Remove ${product.title}`}
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>

                              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                                <span className="rounded-lg bg-green-50 px-2 py-1 font-mono text-[11px] font-bold text-green-800">
                                  Sub: {npr(product.price * line.qty)}
                                </span>
                                <LotStepper
                                  quantity={line.qty}
                                  onQuantityChange={(next) =>
                                    updateQty(market, line.productId, next)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })
                  )}

                  <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <BadgeCheck className="size-3.5 text-green-700" />
                      Escrow held until unloading
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Truck className="size-3.5 text-green-700" />
                      Cold logistics included
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="size-3.5 text-green-700" />
                      Dispatch within 24h
                    </span>
                  </div>
                </section>

                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:sticky lg:top-24">
                  <h2 className="text-sm font-bold text-slate-900">
                    Dispatch summary
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {markets.find((item) => item.id === market)!.label} division
                  </p>

                  <dl className="mt-4 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Commodity subtotal</dt>
                      <dd className="font-mono font-semibold text-slate-800">
                        {npr(subtotal)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">
                        Market cess &amp; APMC fee (1.5%)
                      </dt>
                      <dd className="font-mono font-semibold text-slate-800">
                        {npr(cess)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">
                        Cold-chain logistics
                      </dt>
                      <dd className="font-semibold text-green-700">Free</dd>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-bold text-slate-900">
                      <dt>Total payable</dt>
                      <dd className="font-mono text-base font-extrabold text-green-800">
                        {npr(subtotal + cess)}
                      </dd>
                    </div>
                  </dl>

                  <Button
                    className="mt-4 h-12 w-full rounded-xl text-sm font-bold shadow-md"
                    disabled={lines.length === 0}
                    render={
                      lines.length === 0 ? undefined : (
                        <Link href={`/checkout?market=${market}`} />
                      )
                    }
                  >
                    Proceed to Dispatch
                    <ArrowRight className="size-4" />
                  </Button>

                  <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-slate-400">
                    <Info className="size-3" />
                    Funds remain in escrow until quality signoff.
                  </p>

                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500">
                    <Wallet className="size-4 shrink-0 text-green-700" />
                    Payable by escrow, UPI, net-banking or by inviting a
                    financier.
                  </div>
                </aside>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </Container>
  );
}
