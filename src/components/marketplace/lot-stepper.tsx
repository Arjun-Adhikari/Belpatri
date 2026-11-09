"use client";

import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LotStepper({
  quantity,
  onQuantityChange,
  size = "sm",
  tone = "outline",
}: {
  quantity: number;
  onQuantityChange: (next: number) => void;
  size?: "sm" | "md";
  tone?: "outline" | "solid";
}) {
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
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
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

export function AddLotButton({
  productName,
  marketLabel,
  className,
}: {
  productName: string;
  marketLabel: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-9 rounded-xl border-green-600 bg-green-50/60 px-3 text-xs font-semibold text-green-700 shadow-2xs hover:bg-green-700 hover:text-white",
        className,
      )}
      onClick={() =>
        toast.success("Lot staged", {
          description: `${productName} added to the ${marketLabel} cart.`,
        })
      }
    >
      <Plus className="size-4" />
      Add Lot
    </Button>
  );
}
