"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LotStepper } from "@/components/marketplace/lot-stepper";
import { npr } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductActions({
  product,
  marketLabel,
}: {
  product: Product;
  marketLabel: string;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <LotStepper quantity={quantity} onQuantityChange={setQuantity} size="md" />
        <span className="text-xs font-medium text-slate-500">
          {quantity} × {product.moq} minimum lot
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          className="h-12 flex-1 rounded-xl text-sm font-bold shadow-md"
          onClick={() =>
            toast.success("Lot staged", {
              description: `${quantity} × ${product.title} added to the ${marketLabel} cart.`,
            })
          }
        >
          <ShoppingCart className="size-4" />
          Add Lot to {marketLabel} Cart
        </Button>
        <Button
          variant="outline"
          className="h-12 rounded-xl border-green-200 bg-green-50/60 px-6 text-sm font-bold text-green-800 hover:bg-green-100"
          render={<Link href="/cart" />}
        >
          View Cart
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs">
        <span className="text-slate-500">Lot value at current rate</span>
        <span className="font-mono text-sm font-extrabold text-green-800">
          {npr(product.price * quantity)}
        </span>
      </div>
    </div>
  );
}
