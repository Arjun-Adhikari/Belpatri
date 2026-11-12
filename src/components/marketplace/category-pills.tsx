import Link from "next/link";

import { categoryIcons } from "@/lib/icons";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";

export function CategoryPills({
  market,
  active,
  q,
}: {
  market: string;
  active: string;
  q?: string;
}) {
  return (
    <div className="space-y-2.5 pt-1">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold tracking-wider text-slate-400 uppercase">
          Categories
        </span>
        <Link
          href={`/?market=${market}`}
          className="text-[13px] font-semibold text-green-700 transition-colors hover:text-green-800 active:scale-95"
        >
          View All
        </Link>
      </div>

      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((category) => {
          const Icon = categoryIcons[category.icon];
          const isActive = category.id === active;
          const params = new URLSearchParams({ market });
          if (category.id !== "all") params.set("category", category.id);
          if (q) params.set("q", q);

          return (
            <Link
              key={category.id}
              href={`/?${params.toString()}`}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium shadow-2xs transition-all active:scale-95 sm:text-sm",
                isActive
                  ? "bg-green-700 font-semibold text-white shadow-xs"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-green-600 hover:text-green-800",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-4" />
              {category.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
