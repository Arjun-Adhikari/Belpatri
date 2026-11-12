import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  MapPin,
  Store,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { CategoryPills } from "@/components/marketplace/category-pills";
import { MarketHero } from "@/components/marketplace/market-hero";
import { MarketTabs } from "@/components/marketplace/market-tabs";
import { ProductGrid } from "@/components/marketplace/product-grid";
import { SortSelect } from "@/components/marketplace/sort-select";
import { VendorCard } from "@/components/marketplace/vendor-card";
import { vendors, products } from "@/lib/data";
import type { MarketId } from "@/lib/types";

const validMarkets: MarketId[] = ["managed", "vendor", "farmer"];

export const instant = false;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const marketParam = typeof params.market === "string" ? params.market : "managed";
  const market: MarketId = validMarkets.includes(marketParam as MarketId)
    ? (marketParam as MarketId)
    : "managed";
  const category = typeof params.category === "string" ? params.category : "all";
  const query = typeof params.q === "string" ? params.q.trim() : "";

  const filtered = products.filter((product) => {
    if (product.market !== market) return false;
    if (category !== "all" && product.category !== category) return false;
    if (query) {
      const haystack = `${product.title} ${product.categoryName} ${product.origin} ${
        product.vendorName ?? ""
      } ${product.farmerName ?? ""}`.toLowerCase();
      if (!haystack.includes(query.toLowerCase())) return false;
    }
    return true;
  });

  const vendorList = vendors.filter((vendor) => {
    if (!query) return true;
    const haystack = `${vendor.name} ${vendor.location} ${vendor.specializations.join(
      " ",
    )}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const resetHref = `/?market=${market}`;

  return (
    <Container className="space-y-6 pb-12 pt-5">
      <MarketTabs active={market} q={query || undefined} category={category} />

      <MarketHero market={market} />

      {market === "vendor" ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2 px-0.5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {vendorList.length} verified vendor stores
              </h2>
              <p className="text-[13px] text-slate-500">
                Open a store to browse its categories and listed lots. Every
                vendor keeps its own isolated cart.
              </p>
            </div>
          </div>

          {vendorList.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-xs">
              <Store className="mx-auto mb-2 size-10 text-slate-300" />
              <h3 className="text-sm font-bold text-slate-700">
                No vendor stores match “{query}”
              </h3>
              <p className="mt-1 text-[13px] text-slate-400">
                Try another store name, city or specialisation.
              </p>
              <Link
                href="/?market=vendor"
                className="mt-4 inline-flex items-center gap-1 rounded-xl bg-green-700 px-4 py-2 text-[13px] font-bold text-white transition hover:bg-green-800"
              >
                Reset search
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {vendorList.map((vendor) => (
                <div key={vendor.id} className="min-w-0 space-y-2">
                  <VendorCard vendor={vendor} />
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/60 px-3 py-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock3 className="size-3.5 text-green-700" />
                      {vendor.leadTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-green-700" />
                      Min order {vendor.minOrder}
                    </span>
                    <Link
                      href={`/vendors/${vendor.slug}`}
                      className="font-bold text-green-700 transition hover:text-green-800"
                    >
                      View catalogue
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-950">
            <span className="flex items-center gap-2">
              <Store className="size-4 text-amber-700" />
              Products from different vendors are never mixed in one cart.
            </span>
            <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-900">
              Single-Vendor Rule
            </span>
          </div>
        </section>
      ) : (
        <>
          <CategoryPills market={market} active={category} q={query || undefined} />

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 px-0.5 text-[13px] font-medium text-slate-500">
              <span>
                Showing {filtered.length}{" "}
                {market === "farmer" ? "farm-gate lots" : "verified lots"}
                {query ? ` for “${query}”` : ""}
              </span>
              <SortSelect />
            </div>

            <ProductGrid items={filtered} resetHref={resetHref} denseOnMobile />
          </section>
        </>
      )}
    </Container>
  );
}
