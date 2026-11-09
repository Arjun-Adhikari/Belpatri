import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import type { Vendor } from "@/lib/types";
import { cn } from "@/lib/utils";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const varieties = products.filter((product) => product.vendorId === vendor.id).slice(0, 3);
  const extra = products.filter((product) => product.vendorId === vendor.id).length - varieties.length;

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-green-300 hover:shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm",
              vendor.avatarBg,
            )}
          >
            {vendor.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-bold text-slate-900">{vendor.name}</h3>
              <BadgeCheck className="size-3.5 shrink-0 text-green-700" />
            </div>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-500">
              <MapPin className="size-3 shrink-0" />
              {vendor.location}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-0.5 rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                <Star className="size-2.5 fill-amber-500 text-amber-500" />
                {vendor.rating.toFixed(1)} ({vendor.reviews})
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Min: {vendor.minOrder}
              </span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                {vendor.badge}
              </span>
            </div>
          </div>
        </div>

        <Button
          className="h-8 rounded-xl px-3 text-xs font-bold shadow-sm"
          render={<Link href={`/vendors/${vendor.slug}`} />}
        >
          Enter Store
          <ArrowRight className="size-3.5" />
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1 border-t border-slate-200/60 pt-2.5">
        {vendor.specializations.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-2.5 space-y-1.5 border-t border-slate-100 pt-2">
        <span className="block text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
          Store varieties
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {varieties.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="max-w-[46%] truncate rounded-lg bg-green-100/60 px-2 py-0.5 text-[10px] text-green-900 transition hover:bg-green-100 sm:max-w-none"
            >
              {product.title.split(" (")[0]}
            </Link>
          ))}
          {extra > 0 && (
            <Link
              href={`/vendors/${vendor.slug}`}
              className="text-[10px] font-bold text-green-700 hover:underline"
            >
              +{extra} more
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
