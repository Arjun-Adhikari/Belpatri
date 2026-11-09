import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Building2,
  ChevronRight,
  Headset,
  Landmark,
  LogIn,
  Pencil,
  ScrollText,
  Store,
  TrendingUp,
  Warehouse,
  Wallet,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { LoginFlow } from "@/components/account/login-flow";
import { Button } from "@/components/ui/button";
import { account, orders } from "@/lib/data";
import { npr } from "@/lib/format";

export const metadata: Metadata = {
  title: "Trader Account — Belpatri",
  description:
    "KYB, APMC licence, escrow accounts, warehouses and dispatch alerts for your Belpatri trader profile.",
};

const profileTiles = [
  {
    title: "KYB & GST Verification",
    description: "GSTIN 27AABCK8912M1Z0 • Verified",
    icon: BadgeCheck,
  },
  {
    title: "Trade License & APMC Pass",
    description: "MP-BPL-2023-882 • Valid till 2026",
    icon: ScrollText,
  },
  {
    title: "Bank & Escrow Accounts",
    description: "ICICI Corporate Trade Settlement A/C",
    icon: Landmark,
  },
  {
    title: "Delivery Warehouses",
    description: "Nashik Hub Silo #4 (Primary)",
    icon: Warehouse,
  },
  {
    title: "Dispatch & Trade Alerts",
    description: "SMS, WhatsApp & in-app alerts enabled",
    icon: BellRing,
  },
  {
    title: "Support & Trade Arbitrator",
    description: "24/7 dedicated escrow officer",
    icon: Headset,
  },
];

export default function AccountPage() {
  const activeTrades = orders.filter((order) => order.status !== "Delivered");
  const escrowHeld = activeTrades.reduce((total, order) => total + order.escrow, 0);

  return (
    <Container className="space-y-4 pt-5 pb-12">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="transition hover:text-green-800">
          Marketplace
        </Link>
        <span aria-hidden>/</span>
        <span className="font-semibold text-slate-800">Trader Account</span>
      </nav>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col justify-between gap-6 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={account.avatar}
                alt="Trader profile"
                className="size-16 rounded-2xl border-2 border-green-600 object-cover shadow-sm sm:size-20"
              />
              <span className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-green-700 text-white shadow-xs ring-2 ring-white">
                <BadgeCheck className="size-3.5" />
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {account.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-[11px] font-bold text-green-800">
                  <BadgeCheck className="size-3" />
                  KYB Verified Trader
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">
                {account.company} • Regional Trader ID #{account.traderId}
              </p>
              <p className="text-xs text-slate-400">
                {account.license} • {account.tier}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
            <Button
              className="h-9 rounded-xl text-xs font-bold shadow-xs"
              render={<Link href="/" />}
            >
              <Store className="size-4" />
              Back to Marketplace
            </Button>
            <Button
              variant="outline"
              className="h-8 rounded-xl border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-green-800"
            >
              <Pencil className="size-3.5" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid gap-4 pt-6 md:grid-cols-3">
          <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
            <span className="block text-xs font-semibold text-green-900">
              Available Trade Credit
            </span>
            <div className="mt-1 font-mono text-2xl font-extrabold text-green-800">
              {npr(185400)}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-green-200/60 pt-2">
              <span className="text-[11px] text-green-700">
                ICICI Escrow Account
              </span>
              <button
                type="button"
                className="text-xs font-bold text-green-800 hover:underline"
              >
                + Add Funds
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <span className="block text-xs font-semibold text-slate-600">
              Active Escrow Holdings
            </span>
            <div className="mt-1 font-mono text-2xl font-extrabold text-slate-900">
              {npr(escrowHeld)}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-[11px] text-slate-500">
                {activeTrades.length} in-transit lots
              </span>
              <Link
                href="/orders"
                className="text-xs font-bold text-green-700 hover:underline"
              >
                View Trades
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <span className="block text-xs font-semibold text-slate-600">
              30-Day Trade Volume
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-mono text-2xl font-extrabold text-slate-900">
                142
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Quintals
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2">
              <span className="text-[11px] text-slate-500">0 disputes logged</span>
              <button
                type="button"
                className="text-xs font-bold text-green-700 hover:underline"
              >
                Statement
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {profileTiles.map((tile) => (
          <button
            key={tile.title}
            type="button"
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-green-300"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <tile.icon className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{tile.title}</h2>
                <p className="text-xs text-slate-400">{tile.description}</p>
              </div>
            </div>
            <ChevronRight className="size-[18px] text-slate-400" />
          </button>
        ))}
      </div>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 via-white to-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-green-700 text-white shadow-xs">
            <LogIn className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Login to your Belpatri account
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Continue with Google as a customer, or register as a vendor or
              farmer.
            </p>
          </div>
        </div>
        <LoginFlow />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <TrendingUp className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Grow your trade volume
            </p>
            <p className="text-[11px] text-slate-500">
              Invite a trader to Belpatri and earn trade credit on their first
              settled trade.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9 rounded-xl border-slate-200 text-xs font-semibold"
            render={<Link href="/?market=vendor" />}
          >
            <Building2 className="size-3.5" />
            Vendor Directory
          </Button>
          <Button
            className="h-9 rounded-xl text-xs font-bold"
            render={<Link href="/orders" />}
          >
            <Wallet className="size-3.5" />
            My Trades
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </Container>
  );
}
