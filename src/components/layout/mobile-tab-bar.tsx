"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ReceiptText,
  ShoppingCart,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const tabs: { href: string; label: string; icon: LucideIcon; match: string[] }[] = [
  { href: "/", label: "Home", icon: Home, match: ["/"] },
  { href: "/cart", label: "Cart", icon: ShoppingCart, match: ["/cart", "/checkout"] },
  { href: "/orders", label: "Orders", icon: ReceiptText, match: ["/orders"] },
  { href: "/account", label: "Account", icon: UserRound, match: ["/account"] },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : tab.match.some((m) => pathname.startsWith(m));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium transition active:scale-95",
                active ? "text-green-800" : "text-slate-500 hover:text-green-800",
              )}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border border-transparent transition",
                  active && "border-green-200 bg-green-50/80",
                )}
              >
                <tab.icon className={cn("size-[22px]", active && "text-green-700")} />
              </span>
              <span className={cn(active && "font-bold")}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
