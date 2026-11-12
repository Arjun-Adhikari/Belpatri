"use client";

import { useMemo, useState } from "react";

import { ProductGrid } from "@/components/marketplace/product-grid";
import { categories } from "@/lib/data";
import { categoryIcons } from "@/lib/icons";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type Group = {
  id: string;
  label: string;
  icon: string;
  count: number;
};

export function VendorCatalogue({
  products,
  vendorSlug,
}: {
  products: Product[];
  vendorSlug: string;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, Group>();
    for (const product of products) {
      const existing = map.get(product.category);
      if (existing) {
        existing.count += 1;
        continue;
      }
      const meta = categories.find((item) => item.id === product.category);
      map.set(product.category, {
        id: product.category,
        label: product.categoryName,
        icon: meta?.icon ?? "grid",
        count: 1,
      });
    }
    return [...map.values()];
  }, [products]);

  const [active, setActive] = useState("all");
  const visible =
    active === "all"
      ? products
      : products.filter((product) => product.category === active);

  const activeLabel =
    active === "all"
      ? "All categories"
      : (groups.find((group) => group.id === active)?.label ?? "Category");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-semibold tracking-wider text-slate-400 uppercase">
          Shop by category
        </span>
        <span className="text-xs font-medium text-slate-500">
          {visible.length} {visible.length === 1 ? "item" : "items"} in{" "}
          {activeLabel.toLowerCase()}
        </span>
      </div>

      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
        <CategoryButton
          active={active === "all"}
          onClick={() => setActive("all")}
          label="All categories"
          count={products.length}
          icon={categoryIcons.all}
        />
        {groups.map((group) => (
          <CategoryButton
            key={group.id}
            active={active === group.id}
            onClick={() => setActive(group.id)}
            label={group.label}
            count={group.count}
            icon={categoryIcons[group.icon] ?? categoryIcons.grid}
          />
        ))}
      </div>

      <ProductGrid
        items={visible}
        resetHref={`/vendors/${vendorSlug}`}
        denseOnMobile
      />
    </div>
  );
}

function CategoryButton({
  active,
  onClick,
  label,
  count,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon: (typeof categoryIcons)[string];
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium shadow-2xs transition-all active:scale-95 sm:text-sm",
        active
          ? "bg-green-700 font-semibold text-white shadow-xs"
          : "border border-slate-200 bg-white text-slate-700 hover:border-green-600 hover:text-green-800",
      )}
    >
      <Icon className="size-4" />
      {label}
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full text-[11px] font-bold",
          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500",
        )}
      >
        {count}
      </span>
    </button>
  );
}
