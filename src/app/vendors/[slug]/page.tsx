import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Star,
  Store,
  Truck,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { VendorCatalogue } from "@/components/marketplace/vendor-catalogue";
import { products, vendors, vendorById } from "@/lib/data";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return vendors.map((vendor) => ({ slug: vendor.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vendor = vendors.find((item) => item.slug === slug);
  if (!vendor) return { title: "Vendor not found — Belpatri" };
  return {
    title: `${vendor.name} — Verified Storefront | Belpatri`,
    description: vendor.description,
  };
}

export default async function VendorStorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vendor = vendors.find((item) => item.slug === slug);
  if (!vendor) notFound();

  const catalogue = products.filter((product) => product.vendorId === vendor.id);

  return (
    <Container className="space-y-6 pt-5 pb-12">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="transition hover:text-green-800">
          Marketplace
        </Link>
        <span aria-hidden>/</span>
        <Link
          href="/?market=vendor"
          className="transition hover:text-green-800"
        >
          Vendor Directory
        </Link>
        <span aria-hidden>/</span>
        <span className="font-semibold text-slate-800">{vendor.name}</span>
      </nav>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="relative bg-gradient-to-br from-emerald-800 via-green-900 to-teal-950 px-6 pt-7 pb-16 text-white sm:px-8">
          <div className="absolute -right-6 -bottom-14 opacity-10">
            <Store className="size-64" strokeWidth={1} />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase backdrop-blur-md">
            Licensed Storefront
          </span>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {vendor.name}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-green-100/80">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {vendor.location}
            </span>
            <span className="flex items-center gap-0.5 rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-bold">
              <Star className="size-3 fill-amber-300 text-amber-300" />
              {vendor.rating.toFixed(1)} ({vendor.reviews})
            </span>
            <span className="font-mono">{vendor.badge}</span>
          </p>
        </div>

        <div className="relative -mt-10 px-6 pb-6 sm:px-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl text-base font-bold text-white shadow-sm",
                  vendor.avatarBg,
                )}
              >
                {vendor.initials}
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                  {vendor.name}
                  <BadgeCheck className="size-4 text-green-700" />
                </p>
                <p className="text-[11px] text-slate-500">
                  {vendor.specializations.join(" · ")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <Clock3 className="mx-auto mb-0.5 size-3.5 text-green-700" />
                <span className="block font-bold text-slate-800">
                  {vendor.leadTime}
                </span>
                <span className="text-[10px] text-slate-400">Lead time</span>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <PackageCheck className="mx-auto mb-0.5 size-3.5 text-green-700" />
                <span className="block font-bold text-slate-800">
                  {vendor.minOrder}
                </span>
                <span className="text-[10px] text-slate-400">Min order</span>
              </div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">
                <Truck className="mx-auto mb-0.5 size-3.5 text-green-700" />
                <span className="block font-bold text-slate-800">
                  {catalogue.length}
                </span>
                <span className="text-[10px] text-slate-400">Live lots</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-950">
        <span className="flex items-center gap-2">
          <Store className="size-4 text-amber-700" />
          Vendor cart locked to <strong>{vendor.name}</strong>
        </span>
        <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">
          Single-Vendor Rule
        </span>
      </div>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Store catalogue</h2>
            <p className="text-xs text-slate-500">
              Every category listed by {vendor.name}, ready for a single-vendor
              cart.
            </p>
          </div>
          <Link
            href="/?market=vendor"
            className="inline-flex items-center gap-1 text-xs font-bold text-green-700 transition hover:text-green-800"
          >
            <ArrowLeft className="size-3.5" />
            All vendor stores
          </Link>
        </div>
        <VendorCatalogue products={catalogue} vendorSlug={vendor.slug} />
      </section>

      <section className="grid gap-3 rounded-2xl border border-green-200 bg-green-50/60 p-4 sm:grid-cols-3">
        {[
          {
            title: "Escrow Protected",
            description: "Funds release after unloading signoff.",
            icon: ShieldCheck,
          },
          {
            title: "Signed Gate Pass",
            description: "Weighbridge record per lot.",
            icon: BadgeCheck,
          },
          {
            title: "Cold Logistics",
            description: "Temperature-controlled dispatch.",
            icon: Truck,
          },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-xs">
              <item.icon className="size-[18px]" />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">{item.title}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </section>
    </Container>
  );
}
