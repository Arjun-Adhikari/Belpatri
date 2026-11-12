"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { products } from "@/lib/data";
import type { CartLine, MarketId, Product } from "@/lib/types";

export const MARKET_IDS: MarketId[] = ["managed", "vendor", "farmer"];

export const emptyCarts = (): Record<MarketId, CartLine[]> => ({
  managed: [],
  vendor: [],
  farmer: [],
});

export const productById: Record<string, Product> = Object.fromEntries(
  products.map((product) => [product.id, product]),
);

/** Every cart may only hold lots from one seller. Managed lots share one desk. */
export const sellerKeyOf = (product: Product) =>
  product.vendorId ?? product.farmerId ?? "belpatri-managed";

export const sellerLabelOf = (product: Product) =>
  product.vendorName ?? product.farmerName ?? "Belpatri Managed Sourcing Desk";

export type CartFailure =
  | "missing"
  | "stock"
  | "moq"
  | "vendor-lock";

export type CartResult =
  | { ok: true; qty: number }
  | { ok: false; reason: CartFailure; min?: number; seller?: string };

interface CartStore {
  carts: Record<MarketId, CartLine[]>;
  hydrated: boolean;
  add: (productId: string, qty?: number) => CartResult;
  setQty: (market: MarketId, productId: string, qty: number) => CartResult;
  remove: (market: MarketId, productId: string) => void;
  clear: (market: MarketId) => void;
  replaceWith: (productId: string, qty?: number) => CartResult;
  setHydrated: () => void;
}

const normaliseQty = (qty: number, min: number) =>
  Math.max(min, Math.round(Number.isFinite(qty) ? qty : min));

const setLines = (
  carts: Record<MarketId, CartLine[]>,
  market: MarketId,
  lines: CartLine[],
): Record<MarketId, CartLine[]> => ({ ...carts, [market]: lines });

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      carts: emptyCarts(),
      hydrated: false,

      add: (productId, qty) => {
        const product = productById[productId];
        if (!product) return { ok: false, reason: "missing" };
        if (!product.stock) return { ok: false, reason: "stock" };

        const market = product.market;
        const lines = get().carts[market];
        const seller = sellerKeyOf(product);
        const incoming = normaliseQty(qty ?? product.moq, product.moq);

        const conflict = lines.find(
          (line) =>
            line.productId !== productId &&
            productById[line.productId] &&
            sellerKeyOf(productById[line.productId]) !== seller,
        );
        if (conflict) {
          return { ok: false, reason: "vendor-lock", seller: sellerLabelOf(product) };
        }

        const existing = lines.find((line) => line.productId === productId);
        const nextQty = existing ? existing.qty + incoming : incoming;
        const nextLines = existing
          ? lines.map((line) =>
              line.productId === productId ? { ...line, qty: nextQty } : line,
            )
          : [...lines, { productId, qty: nextQty }];

        set({ carts: setLines(get().carts, market, nextLines) });
        return { ok: true, qty: nextQty };
      },

      setQty: (market, productId, qty) => {
        const product = productById[productId];
        if (!product) return { ok: false, reason: "missing" };
        if (!product.stock) return { ok: false, reason: "stock" };
        if (qty < product.moq) return { ok: false, reason: "moq", min: product.moq };

        const nextQty = Math.round(qty);
        const lines = get().carts[market].map((line) =>
          line.productId === productId ? { ...line, qty: nextQty } : line,
        );
        set({ carts: setLines(get().carts, market, lines) });
        return { ok: true, qty: nextQty };
      },

      remove: (market, productId) => {
        const lines = get().carts[market].filter(
          (line) => line.productId !== productId,
        );
        set({ carts: setLines(get().carts, market, lines) });
      },

      clear: (market) => {
        set({ carts: setLines(get().carts, market, []) });
      },

      replaceWith: (productId, qty) => {
        const product = productById[productId];
        if (!product) return { ok: false, reason: "missing" };
        set({ carts: setLines(get().carts, product.market, []) });
        return get().add(productId, qty);
      },

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "belpatri-cart-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ carts: state.carts }),
      // The header renders on the server too. Hydrate manually after mount so
      // server HTML and the first client render agree.
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);

export const useCartLines = (market: MarketId) =>
  useCartStore((state) => state.carts[market]);

export const useCartHydrated = () => useCartStore((state) => state.hydrated);

export const useCartCount = (market?: MarketId) =>
  useCartStore((state) =>
    market
      ? state.carts[market].length
      : MARKET_IDS.reduce((total, id) => total + state.carts[id].length, 0),
  );
