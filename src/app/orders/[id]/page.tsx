import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Circle,
  Download,
  FileCheck2,
  MapPin,
  Navigation,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { orders } from "@/lib/data";
import { npr } from "@/lib/format";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return orders.map((order) => ({ id: order.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const order = orders.find((item) => item.id === id);
  if (!order) return { title: "Order not found — Belpatri" };
  return {
    title: `Order #${order.id} — Dispatch Tracking | Belpatri`,
    description: order.title,
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = orders.find((item) => item.id === id);
  if (!order) notFound();

  const delivered = order.status === "Delivered";

  const facts = [
    { label: "Vehicle", value: order.vehicle, icon: Truck },
    { label: "APMC gate pass", value: order.gatePass, icon: FileCheck2 },
    { label: "Quality check", value: order.quality, icon: BadgeCheck },
    { label: "Settlement market", value: order.settlement, icon: ReceiptText },
    { label: "Placed at", value: order.placedAt, icon: CalendarClock },
    {
      label: "Delivery ETA",
      value: order.eta,
      icon: Navigation,
    },
  ];

  return (
    <Container className="space-y-5 pt-5 pb-12">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link href="/orders" className="transition hover:text-green-800">
          Trade Orders
        </Link>
        <span aria-hidden>/</span>
        <span className="font-mono font-semibold text-slate-800">#{order.id}</span>
      </nav>

      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500">
              ORDER #{order.id}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold",
                delivered
                  ? "border-slate-300 bg-slate-100 text-slate-700"
                  : order.status === "In Transit"
                    ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                    : "border-blue-200 bg-blue-100 text-blue-800",
              )}
            >
              {delivered ? (
                <CheckCircle2 className="size-3" />
              ) : (
                <span className="size-1.5 animate-pulse rounded-full bg-current" />
              )}
              {order.status}
            </span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            {order.title}
          </h1>
          <p className="text-xs text-slate-500">{order.quantity}</p>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xs font-medium text-slate-500">
            {order.escrow > 0 ? "Escrow held" : "Escrow released"}
          </div>
          <div
            className={cn(
              "font-mono text-xl font-extrabold",
              order.escrow > 0 ? "text-green-800" : "text-slate-600",
            )}
          >
            {order.escrow > 0 ? npr(order.escrow) : "Settled to farmer"}
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-900 uppercase">
            <Truck className="size-4 text-green-700" />
            Dispatch timeline
          </h2>

          <ol className="mt-4 space-y-0">
            {order.timeline.map((step, index) => {
              const isLast = index === order.timeline.length - 1;
              return (
                <li key={step.label} className="relative flex gap-3 pb-5">
                  {!isLast && (
                    <span
                      className={cn(
                        "absolute top-6 bottom-0 left-[11px] w-0.5",
                        step.done ? "bg-green-600" : "bg-slate-200",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ring-4 ring-white",
                      step.done
                        ? "bg-green-600 text-white"
                        : "bg-slate-200 text-slate-400",
                    )}
                  >
                    {step.done ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <Circle className="size-3" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-xs font-bold",
                          step.current && !delivered
                            ? "text-green-900"
                            : step.done
                              ? "text-slate-800"
                              : "text-slate-400",
                        )}
                      >
                        {step.label}
                      </p>
                      {step.current && !delivered ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
                          Current stage
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {step.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="space-y-4">
          <section className="relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-green-900 uppercase">
                <Navigation className="size-4" />
                Live dispatch
              </h2>
              <span className="flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-green-800">
                <span className="size-1.5 animate-pulse rounded-full bg-green-600" />
                GPS live
              </span>
            </div>

            <div className="relative mt-6 mb-2 h-28">
              <div className="absolute inset-x-2 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/70" />
              <div className="absolute inset-x-2 top-1/2 h-1.5 w-2/3 -translate-y-1/2 rounded-full bg-green-600" />
              <span className="absolute top-1/2 left-1 size-4 -translate-y-1/2 rounded-full border-2 border-green-700 bg-white" />
              <span className="absolute top-1/2 left-[64%] flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-green-700 text-white shadow-md ring-4 ring-white">
                <Truck className="size-4" />
              </span>
              <span className="absolute top-1/2 right-1 size-4 -translate-y-1/2 rounded-full border-2 border-slate-300 bg-white" />
              <span className="absolute top-0 left-0 text-[10px] font-semibold text-green-900/70">
                {order.settlement.split(",")[0]}
              </span>
              <span className="absolute top-0 right-0 text-[10px] font-semibold text-slate-500">
                Nashik Hub
              </span>
            </div>

            <p className="text-[11px] leading-relaxed text-green-900/70">
              Vehicle <span className="font-mono font-bold">{order.vehicle}</span>{" "}
              · {order.eta}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-green-900/60">
              <MapPin className="size-3" />
              NH 48 corridor, 42 km from destination
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Dispatch facts
            </h2>
            <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-start gap-2">
                  <fact.icon className="mt-0.5 size-3.5 shrink-0 text-green-700" />
                  <div className="min-w-0">
                    <dt className="text-[10px] text-slate-400">{fact.label}</dt>
                    <dd className="truncate font-semibold text-slate-800">
                      {fact.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="h-10 flex-1 rounded-xl border-green-200 bg-green-50 text-xs font-semibold text-green-800 hover:bg-green-100"
            >
              <FileCheck2 className="size-4" />
              Gate pass
            </Button>
            <Button
              variant="outline"
              className="h-10 flex-1 rounded-xl border-slate-200 text-xs font-semibold"
            >
              <Download className="size-4 text-slate-500" />
              Tax invoice
            </Button>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-[11px] text-slate-500">
            <ShieldCheck className="size-4 shrink-0 text-green-700" />
            {order.escrow > 0
              ? "Escrow releases within 4 hours of unloading signoff."
              : "Escrow was released to the farmer after signed delivery."}
          </div>

          <Button
            variant="ghost"
            className="h-9 w-full rounded-xl text-xs font-semibold text-slate-500"
            render={<Link href="/orders" />}
          >
            <ArrowLeft className="size-3.5" />
            All trade orders
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-green-100 text-green-800">
            <PackageCheck className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Weighbridge &amp; quality record
            </p>
            <p className="text-[11px] text-slate-500">
              Partner {order.partner} · Gate pass {order.gatePass}
            </p>
          </div>
        </div>
        <Button
          className="h-9 rounded-xl text-xs font-bold"
          render={<Link href={`/?market=${order.market}`} />}
        >
          Trade More Commodities
        </Button>
      </div>
    </Container>
  );
}
