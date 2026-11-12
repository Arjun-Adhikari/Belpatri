"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileCheck2,
  MapPin,
  PackageSearch,
  ReceiptText,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { orders } from "@/lib/data";
import { npr } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "active" | "delivered" | "invoices";

const statusStyles: Record<
  OrderStatus,
  { className: string; dot: boolean; label: string; icon: typeof Truck }
> = {
  "In Transit": {
    className: "border-emerald-300 bg-emerald-100 text-emerald-800",
    dot: true,
    label: "In Transit / Dispatched",
    icon: Truck,
  },
  "Quality Check": {
    className: "border-blue-200 bg-blue-100 text-blue-800",
    dot: false,
    label: "Quality Inspection Clear",
    icon: PackageSearch,
  },
  Delivered: {
    className: "border-slate-300 bg-slate-100 text-slate-700",
    dot: false,
    label: "Delivered / Escrow Released",
    icon: CheckCircle2,
  },
};

function OrderCard({ order }: { order: Order }) {
  const status = statusStyles[order.status];
  const detailRows =
    order.market === "managed"
      ? [
          { label: "Vendor / Farmer Lot", value: order.partner },
          { label: "Gate Pass #", value: order.gatePass, mono: true },
          { label: "Moisture & Purity", value: order.quality, accent: true },
          { label: "Settlement Market", value: order.settlement },
        ]
      : order.market === "vendor"
        ? [
            { label: "Vendor / Spice Co.", value: order.partner },
            { label: "Lab Test Certificate", value: order.quality, accent: true },
            { label: "Dispatch Hub", value: order.settlement },
            { label: "Packaging", value: "Vacuum Food-Grade Jute" },
          ]
        : [
            { label: "Farmer", value: order.partner },
            { label: "Farm Gate Pass #", value: order.gatePass, mono: true },
            { label: "Organic Grade", value: order.quality, accent: true },
            { label: "Village Market", value: order.settlement },
          ];

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:border-green-300">
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5",
          order.status === "In Transit"
            ? "bg-gradient-to-r from-green-50/70 to-emerald-50/30"
            : "bg-slate-50/60",
        )}
      >
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[13px] font-bold text-slate-500">
              ORDER #{order.id}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold",
                status.className,
              )}
            >
              {status.dot ? (
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-600" />
              ) : (
                <status.icon className="size-3" />
              )}
              {status.label}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {order.title} — {order.quantity}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[13px] font-medium text-slate-500">
            {order.escrow > 0 ? "Escrow stage status" : "Settlement status"}
          </div>
          <div
            className={cn(
              "font-mono text-base font-extrabold",
              order.escrow > 0 ? "text-green-800" : "text-slate-600",
            )}
          >
            {order.escrow > 0
              ? `Escrow Held ${npr(order.escrow)}`
              : "Escrow Released"}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] font-semibold text-slate-600">
            <span className="flex items-center gap-1 text-green-800">
              <Truck className="size-4" />
              {order.status === "Delivered"
                ? `Delivered via ${order.vehicle}`
                : `Cold Logistics Truck ${order.vehicle}`}
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              {order.status === "Delivered"
                ? order.eta
                : `ETA: ${order.eta} (Kalimati Central Hub)`}
            </span>
          </div>

          <div
            className={cn(
              "grid gap-2 pt-1 text-center",
              order.timeline.length === 4 ? "grid-cols-4" : "grid-cols-5",
            )}
          >
            {order.timeline.map((step) => (
              <div key={step.label} className="space-y-1">
                <div
                  className={cn(
                    "h-2 rounded-full",
                    step.done
                      ? step.current && order.status !== "Delivered"
                        ? "animate-pulse bg-green-600"
                        : "bg-green-600"
                      : "bg-slate-200",
                  )}
                />
                <span
                  className={cn(
                    "block text-[11px]",
                    step.current && order.status !== "Delivered"
                      ? "font-bold text-green-900"
                      : step.done
                        ? "font-semibold text-green-800"
                        : "font-medium text-slate-400",
                  )}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-[13px] sm:grid-cols-4">
          {detailRows.map((row) => (
            <div key={row.label}>
              <span className="block text-[11px] text-slate-400">
                {row.label}
              </span>
              <span
                className={cn(
                  "font-bold",
                  row.accent ? "text-green-700" : "text-slate-800",
                  row.mono && "font-mono",
                )}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="h-9 rounded-xl border-green-200 bg-green-50 text-[13px] font-semibold text-green-800 hover:bg-green-100"
            >
              <FileCheck2 className="size-4" />
              View Gate Pass
            </Button>
            <Button
              variant="outline"
              className="h-9 rounded-xl border-slate-200 bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50"
              render={<Link href={`/orders/${order.id}`} />}
            >
              <MapPin className="size-4 text-green-700" />
              Track Dispatch Vehicle
            </Button>
            <Button
              variant="outline"
              className="hidden h-9 rounded-xl border-slate-200 bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex"
            >
              <Download className="size-4 text-slate-500" />
              Download Tax Invoice
            </Button>
          </div>
          <span className="text-[13px] text-slate-400">
            {order.escrow > 0
              ? "Escrow released within 4 hours of unloading signoff."
              : "Escrow released to the farmer after delivery."}
          </span>
        </div>
      </div>
    </article>
  );
}

export function OrdersClient() {
  const [filter, setFilter] = useState<Filter>("active");

  const activeOrders = orders.filter((order) => order.status !== "Delivered");
  const deliveredOrders = orders.filter((order) => order.status === "Delivered");

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "active", label: "Active Trades", count: activeOrders.length },
    {
      id: "delivered",
      label: "Delivered / Completed",
      count: deliveredOrders.length,
    },
    {
      id: "invoices",
      label: "Escrow Invoices & Fees",
      count: orders.length,
    },
  ];

  const visible =
    filter === "active"
      ? activeOrders
      : filter === "delivered"
        ? deliveredOrders
        : orders;

  return (
    <div className="space-y-4">
      <div className="scrollbar-none flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "shrink-0 rounded-xl px-4 py-2 text-[13px] transition-all active:scale-95",
              filter === item.id
                ? "bg-green-700 font-bold text-white shadow-xs"
                : "border border-slate-200 bg-white font-semibold text-slate-600 hover:text-green-800",
            )}
            aria-pressed={filter === item.id}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-xs">
          <ReceiptText className="mx-auto mb-2 size-10 text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">
            No trades in this view yet
          </h3>
          <p className="mt-1 text-[13px] text-slate-400">
            Completed and active trades will appear here with their gate
            passes.
          </p>
          <Button className="mt-4 rounded-xl" render={<Link href="/" />}>
            Trade More Commodities
            <ArrowRight className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-green-100 text-green-800">
            <ReceiptText className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Facilitation fee statements
            </p>
            <p className="text-[13px] text-slate-500">
              Every trade carries a 1.5% Belpatri facilitation fee line item in its invoice.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="h-9 rounded-xl border-slate-200 text-[13px] font-semibold"
        >
          Download statement
          <Download className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
