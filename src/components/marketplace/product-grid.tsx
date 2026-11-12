import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/marketplace/product-card";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGrid({
  items,
  resetHref = "/",
  denseOnMobile = false,
}: {
  items: Product[];
  resetHref?: string;
  /** Two-up cards on phones. Vendor storefronts keep full-width rows. */
  denseOnMobile?: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-xs">
        <SearchX className="mx-auto mb-2 size-10 text-slate-400" />
        <h4 className="font-bold text-slate-700">No matching commodities found</h4>
        <p className="mt-1 text-xs text-slate-400">
          Try resetting your search query or choosing another category.
        </p>
        <Button className="mt-4 rounded-xl" render={<Link href={resetHref} />}>
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid md:grid-cols-2 lg:grid-cols-3",
        denseOnMobile
          ? "grid-cols-2 gap-3 sm:gap-5"
          : "grid-cols-1 gap-5",
      )}
    >
      {items.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 2}
          dense={denseOnMobile}
        />
      ))}
    </div>
  );
}
