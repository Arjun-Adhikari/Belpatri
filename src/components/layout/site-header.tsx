"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Menu,
  ReceiptText,
  Search,
  ShoppingCart,
  Store,
  Tractor,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/layout/site-logo";
import { useCartCount, useCartHydrated } from "@/lib/cart-store";
import { account, orders } from "@/lib/data";

const mobileLinks = [
  { href: "/?market=managed", label: "Managed Market", icon: ShieldCheck },
  { href: "/?market=vendor", label: "Vendor Stores", icon: Store },
  { href: "/?market=farmer", label: "Farmer Direct", icon: Tractor },
  { href: "/orders", label: "Trade Orders", icon: ReceiptText },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const cartCount = useCartCount();
  const hydrated = useCartHydrated();
  const activeOrders = orders.filter((order) => order.status !== "Delivered").length;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-xs backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center gap-3 sm:h-20 sm:gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>

          <SiteLogo className="shrink-0" />

          <form
            action="/"
            className="relative hidden flex-1 items-center md:flex md:max-w-xl"
          >
            <Search className="pointer-events-none absolute left-4 size-4 text-slate-400" />
            <input
              type="search"
              name="q"
              placeholder="Search items (wheat, chilli) or verified vendor store"
              className="h-10 w-full rounded-full border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-600/10 focus:outline-none"
              aria-label="Search commodities or vendors"
            />
          </form>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
            <Button
              variant="outline"
              className="hidden h-10 rounded-full border-slate-200 bg-slate-50/60 text-xs font-semibold text-slate-700 hover:border-green-300 hover:bg-green-50 hover:text-green-800 md:inline-flex"
              render={<Link href="/orders" />}
            >
              <ReceiptText className="size-4 text-green-700" />
              Orders
              <span className="ml-0.5 flex size-5 items-center justify-center rounded-full bg-green-100 text-[10px] font-bold text-green-800">
                {activeOrders}
              </span>
            </Button>

            <Button
              variant="outline"
              className="hidden h-10 rounded-full border-green-200 bg-green-50/50 text-xs font-semibold text-green-800 hover:bg-green-100 md:inline-flex"
              render={<Link href="/cart" />}
            >
              <ShoppingCart className="size-4 text-green-700" />
              <span className="hidden sm:inline">Cart</span>
              {hydrated ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-green-700 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative hidden text-slate-600 sm:inline-flex"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-green-600 ring-2 ring-white" />
            </Button>

            <Link
              href="/account"
              className="flex size-10 items-center justify-center overflow-hidden rounded-full ring-1 ring-slate-200 transition hover:ring-2 hover:ring-green-600"
              aria-label="Account"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/farmer.jpg"
                alt={account.name}
                className="size-full object-cover"
              />
            </Link>
          </div>
        </div>

        <form action="/" className="relative flex items-center pb-3 md:hidden">
          <Search className="pointer-events-none absolute left-3.5 size-4 text-slate-400" />
          <input
            type="search"
            name="q"
            placeholder="Search commodities or vendors"
            className="h-10 w-full rounded-full border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-green-600 focus:bg-white focus:outline-none"
            aria-label="Search commodities or vendors"
          />
        </form>
      </Container>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[86%] max-w-sm p-0">
          <SheetHeader className="border-b border-slate-100 p-5">
            <SheetTitle className="flex items-center gap-2 text-green-800">
              <SiteLogo compact />
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Agri-commercial marketplace
            </SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-3">
            {mobileLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-green-50 hover:text-green-800"
              >
                <item.icon className="size-5 text-green-700" />
                {item.label}
                <ChevronRight className="ml-auto size-4 text-slate-400" />
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-slate-100 p-4">
            <Button className="w-full rounded-xl" render={<Link href="/account" />}>
              View trader account
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
