"use client";

import { useEffect } from "react";

import { useCartStore } from "@/lib/cart-store";

/**
 * Rehydrates the persisted cart after mount. Keeping hydration off the first
 * render means server HTML and client HTML agree on an empty cart.
 */
export function CartHydrator() {
  useEffect(() => {
    const markHydrated = () => useCartStore.getState().setHydrated();
    void Promise.resolve(useCartStore.persist.rehydrate()).then(
      markHydrated,
      markHydrated,
    );
  }, []);

  return null;
}
