import Link from "next/link";
import { ShieldCheck, Store, Tractor } from "lucide-react";

import { markets } from "@/lib/data";
import type { MarketId } from "@/lib/types";
import { cn } from "@/lib/utils";

const icons = {
  managed: ShieldCheck,
  vendor: Store,
  farmer: Tractor,
} as const;

export function MarketTabs({
  active,
  q,
  category,
}: {
  active: MarketId;
  q?: string;
  category?: string;
}) {
  return (
    <div className="flex justify-center sm:justify-start">
      <div className="scrollbar-none -mx-4 flex w-[calc(100%+2rem)] gap-1 overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-100/90 p-1 shadow-2xs sm:mx-0 sm:inline-flex sm:w-auto sm:flex-wrap sm:overflow-visible">
        {markets.map((market) => {
          const Icon = icons[market.id];
          const isActive = market.id === active;
          const params = new URLSearchParams({ market: market.id });
          if (q) params.set("q", q);
          if (category && category !== "all") params.set("category", category);

          return (
            <Link
              key={market.id}
              href={`/?${params.toString()}`}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-2.5 text-[13px] font-medium transition-all active:scale-95 sm:gap-2 sm:px-6 sm:text-sm",
                isActive
                  ? "bg-white font-bold text-green-800 shadow-xs"
                  : "text-slate-600 hover:text-green-800",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "size-4 sm:size-[18px]",
                  isActive ? "text-green-700" : "text-slate-500",
                )}
              />
              {market.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
