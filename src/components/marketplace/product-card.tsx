import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";

import { AddLotButton } from "@/components/marketplace/lot-stepper";
import { ProductImage } from "@/components/marketplace/product-image";
import { marketById } from "@/lib/data";
import { npr } from "@/lib/format";
import { marketIcons } from "@/lib/icons";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const MarketIcon = marketIcons[product.market];

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all duration-200 hover:shadow-md">
      <div className="space-y-3">
        <div className="relative">
          <ProductImage
            src={product.image}
            alt={product.imageAlt}
            category={product.category}
            priority={priority}
            className="h-44 w-full rounded-xl sm:h-48"
          />
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50/95 px-2.5 py-1 text-[11px] font-semibold text-green-700 shadow-2xs backdrop-blur-xs">
            <BadgeCheck className="size-3.5" />
            {product.badge}
          </span>
        </div>

        <div className="space-y-1">
          <span className="block text-[10.5px] font-semibold tracking-wider text-slate-400 uppercase">
            {product.categoryName}
          </span>
          <h3 className="line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-green-800">
            <Link href={`/products/${product.slug}`}>{product.title}</Link>
          </h3>

          {product.market === "managed" ? (
            <div className="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-green-700">
              <BadgeCheck className="size-[15px]" />
              Belpatri Certified
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-600">
                <MarketIcon className="size-[15px] text-green-700" />
                {product.market === "vendor" ? product.vendorName : product.farmerName}
              </span>
              {product.rating ? (
                <span className="flex items-center gap-0.5 rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                  <Star className="size-3 fill-amber-500 text-amber-500" />
                  {product.rating.toFixed(1)}
                  <span className="font-medium text-amber-700/70">({product.reviews})</span>
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-green-800 tabular-nums">
              {npr(product.price)}
            </span>
            <span className="text-xs text-slate-400">/{product.unit}</span>
          </div>
          <span className="inline-block text-[11px] font-medium text-slate-500">
            Min: {product.moq}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AddLotButton
            productName={product.title}
            marketLabel={marketById[product.market].label}
          />
        </div>
      </div>
    </article>
  );
}
