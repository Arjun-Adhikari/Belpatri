"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LotStepper } from "@/components/marketplace/lot-stepper";
import { useCartStore } from "@/lib/cart-store";
import { npr } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductActions({
  product,
  marketLabel,
}: {
  product: Product;
  marketLabel: string;
}) {
  const [quantity, setQuantity] = useState(product.moq);
  const add = useCartStore((state) => state.add);
  const router = useRouter();

  const handleAdd = () => {
    const result = add(product.id, quantity);

    if (result.ok) {
      toast.success("Lot staged", {
        description: `${quantity} ${product.unit} of ${product.title} added to the ${marketLabel} cart.`,
        action: { label: "View cart", onClick: () => router.push("/cart") },
      });
      return;
    }

    if (result.reason === "vendor-lock") {
      toast.error("Single-seller cart", {
        description: `Your ${marketLabel} cart is locked to another seller. Clear it from the cart page first.`,
      });
      return;
    }

    if (result.reason === "moq") {
      toast.error("Below minimum order", {
        description: `${product.title} starts at ${result.min} ${product.unit}.`,
      });
      return;
    }

    toast.error("Out of stock", {
      description: `${product.title} is not available right now.`,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <LotStepper
          quantity={quantity}
          onQuantityChange={setQuantity}
          min={product.moq}
          size="md"
          tone={product.stock ? "outline" : "solid"}
        />
        <span className="text-xs font-medium text-slate-500">
          {quantity} {product.unit} selected · MOQ {product.moq} {product.unit}
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          className="h-12 flex-1 rounded-xl text-sm font-bold shadow-md"
          onClick={handleAdd}
          disabled={!product.stock}
        >
          <ShoppingCart className="size-4" />
          {product.stock
            ? `Add Lot to ${marketLabel} Cart`
            : "Out of Stock"}
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
