"use client";

import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { marketById } from "@/lib/data";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LotStepper({
  quantity,
  onQuantityChange,
  min = 1,
  size = "sm",
  tone = "outline",
}: {
  quantity: number;
  onQuantityChange: (next: number) => void;
  min?: number;
  size?: "sm" | "md";
  tone?: "outline" | "solid";
}) {
  const atMin = quantity <= min;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-xl border p-0.5",
        tone === "solid"
          ? "border-green-700 bg-green-700 text-white"
          : "border-green-600 bg-green-50/60 text-green-800",
      )}
    >
      <button
        type="button"
        onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
        disabled={atMin}
        className={cn(
          "flex items-center justify-center rounded-lg transition active:scale-95 disabled:opacity-40",
          size === "sm" ? "size-6" : "size-8",
          tone === "solid" ? "hover:bg-green-600" : "hover:bg-green-100",
        )}
        aria-label="Decrease lot quantity"
      >
        <Minus className={size === "sm" ? "size-3.5" : "size-4"} strokeWidth={2.6} />
      </button>
      <span
        className={cn(
          "text-center font-mono font-bold tabular-nums",
          size === "sm" ? "w-6 text-xs" : "w-8 text-sm",
        )}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onQuantityChange(quantity + 1)}
        className={cn(
          "flex items-center justify-center rounded-lg transition active:scale-95",
          size === "sm" ? "size-6" : "size-8",
          tone === "solid" ? "hover:bg-green-600" : "hover:bg-green-100",
        )}
        aria-label="Increase lot quantity"
      >
        <Plus className={size === "sm" ? "size-3.5" : "size-4"} strokeWidth={2.6} />
      </button>
    </div>
  );
}

/**
 * Adds a lot to its marketplace cart. Stock, MOQ and single-seller rules are
 * enforced inside the Zustand store, so every entry point behaves the same.
 */
export function AddLotButton({
  product,
  qty,
  compact = false,
  className,
}: {
  product: Product;
  qty?: number;
  compact?: boolean;
  className?: string;
}) {
  const add = useCartStore((state) => state.add);
  const replaceWith = useCartStore((state) => state.replaceWith);
  const router = useRouter();
  const marketLabel = marketById[product.market].label;

  if (!product.stock) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
        className={cn(
          "h-9 rounded-xl border-slate-200 px-3 text-xs font-semibold text-slate-400",
          className,
        )}
      >
        Out of Stock
      </Button>
    );
  }

  const handleAdd = () => {
    const result = add(product.id, qty);

    if (result.ok) {
      toast.success("Lot staged", {
        description: `${product.title} is now in your ${marketLabel} cart.`,
        action: { label: "View cart", onClick: () => router.push("/cart") },
      });
      return;
    }

    if (result.reason === "vendor-lock") {
      toast.error("Single-seller cart", {
        description: `Your ${marketLabel} cart already holds lots from another seller. Clear it to add ${result.seller}.`,
        action: {
          label: "Replace cart",
          onClick: () => {
            const replaced = replaceWith(product.id, qty);
            if (replaced.ok) router.push("/cart");
          },
        },
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
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-9 rounded-xl border-green-600 bg-green-50/60 px-3 text-xs font-semibold text-green-700 shadow-2xs hover:bg-green-700 hover:text-white",
        compact && "h-8 w-full px-2",
        className,
      )}
      onClick={handleAdd}
    >
      <Plus className="size-4" />
      Add Lot
    </Button>
  );
}
