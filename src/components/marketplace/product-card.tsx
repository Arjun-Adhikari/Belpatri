import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";

import { AddLotButton } from "@/components/marketplace/lot-stepper";
import { ProductImage } from "@/components/marketplace/product-image";
import { npr } from "@/lib/format";
import { marketIcons } from "@/lib/icons";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  priority = false,
  dense = false,
}: {
  product: Product;
  priority?: boolean;
  /** Tighter card used by the two-up mobile grid. Desktop is unchanged. */
  dense?: boolean;
}) {
  const MarketIcon = marketIcons[product.market];

  return (
    <article
      className={cn(
        "group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-200 hover:shadow-md",
        dense ? "p-3 sm:p-4" : "p-4",
      )}
    >
      <div className={dense ? "space-y-2 sm:space-y-3" : "space-y-3"}>
        <div className="relative">
          <ProductImage
            src={product.image}
            alt={product.imageAlt}
            category={product.category}
            priority={priority}
            className={cn(
              "w-full rounded-xl",
              dense ? "h-28 sm:h-48" : "h-44 sm:h-48",
            )}
          />
          <span
            className={cn(
              "absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50/95 px-2.5 py-1 text-[11px] font-semibold text-green-700 shadow-2xs backdrop-blur-xs",
              dense && "hidden sm:inline-flex",
            )}
          >
            <BadgeCheck className="size-3.5" />
            {product.badge}
          </span>
        </div>

        <div className={dense ? "space-y-0.5 sm:space-y-1" : "space-y-1"}>
          <span className="block text-[10.5px] font-semibold tracking-wider text-slate-400 uppercase">
            {product.categoryName}
          </span>
          <h3
            className={cn(
              "font-bold text-slate-900 transition-colors group-hover:text-green-800",
              dense
                ? "line-clamp-2 text-[13px] sm:line-clamp-1 sm:text-base"
                : "line-clamp-1 text-base",
            )}
          >
            <Link href={`/products/${product.slug}`}>{product.title}</Link>
          </h3>

          {product.market === "managed" ? (
            <div className="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-green-700">
              <BadgeCheck className="size-[15px]" />
              Belpatri Certified
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 text-xs">
              <span
                className={cn(
                  "flex items-center gap-1 font-medium text-slate-600",
                  dense && "min-w-0",
                )}
              >
                <MarketIcon className="size-[15px] shrink-0 text-green-700" />
                <span className="truncate">
                  {product.market === "vendor"
                    ? product.vendorName
                    : product.farmerName}
                </span>
              </span>
              {product.rating ? (
                <span
                  className={cn(
                    "flex items-center gap-0.5 rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700",
                    dense && "hidden sm:flex",
                  )}
                >
                  <Star className="size-3 fill-amber-500 text-amber-500" />
                  {product.rating.toFixed(1)}
                  <span className="font-medium text-amber-700/70">({product.reviews})</span>
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "mt-3 flex gap-3 border-t border-slate-100 pt-4",
          dense
            ? "flex-col items-stretch gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between"
            : "items-center justify-between",
        )}
      >
        <div>
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                "font-extrabold text-green-800 tabular-nums",
                dense ? "text-base sm:text-lg" : "text-lg",
              )}
            >
              {npr(product.price)}
            </span>
            <span className="text-xs text-slate-400">/{product.unit}</span>
          </div>
          <span className="inline-block text-[11px] font-medium text-slate-500">
            Min: {product.moq} {product.unit}
          </span>
        </div>

        <div className={dense ? "flex items-center sm:gap-2" : "flex items-center gap-2"}>
          <AddLotButton product={product} compact={dense} />
        </div>
      </div>
    </article>
  );
}
