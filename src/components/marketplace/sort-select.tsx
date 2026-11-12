"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SortSelect() {
  return (
    <Select defaultValue="fastest">
      <SelectTrigger
        size="sm"
        className="h-8 gap-1 border-none bg-transparent px-1 text-[13px] font-semibold text-slate-800 shadow-none hover:text-green-800 focus-visible:ring-0"
      >
        <span className="text-[13px] font-medium text-slate-500">Sort by:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="fastest">Fastest Dispatch</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="moq">Smallest MOQ</SelectItem>
        <SelectItem value="rating">Top Rated</SelectItem>
      </SelectContent>
    </Select>
  );
}
