import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Droplets,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Star,
  Store,
  Tractor,
  Truck,
  Warehouse,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { ProductActions } from "@/components/marketplace/product-actions";
import { ProductGrid } from "@/components/marketplace/product-grid";
import { ProductImage } from "@/components/marketplace/product-image";
import {
  marketById,
  productBySlug,
  products,
  vendorById,
} from "@/lib/data";
import { npr } from "@/lib/format";
import { marketIcons } from "@/lib/icons";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return { title: "Lot not found — Belpatri" };
  return {
    title: `${product.title} — Belpatri`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();

  const market = marketById[product.market];
  const MarketIcon = marketIcons[product.market];
  const vendor = product.vendorId ? vendorById[product.vendorId] : undefined;
  const related = products
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.market === product.market || item.category === product.category),
    )
    .slice(0, 3);

  const supplierName =
    product.market === "managed"
      ? "Belpatri Managed Sourcing Desk"
      : product.market === "vendor"
        ? (product.vendorName ?? "Verified Vendor Store")
        : (product.farmerName ?? "Verified Farmer");
  const supplierLocation =
    product.market === "farmer"
      ? (product.village ?? product.origin)
      : product.market === "vendor"
        ? (vendor?.location ?? product.origin)
        : product.origin;

  const specs = [
    { label: "Harvest Batch", value: product.harvest, icon: CalendarDays },
    { label: "Moisture Content", value: product.moisture, icon: Droplets },
    { label: "Shelf Life", value: product.shelf, icon: PackageCheck },
    { label: "Origin Yard", value: product.origin, icon: Warehouse },
  ];

  return (
    <Container className="space-y-8 pt-5 pb-12">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="transition hover:text-green-800">
          Marketplace
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/?market=${product.market}`}
          className="transition hover:text-green-800"
        >
          {market.label}
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/?market=${product.market}&category=${product.category}`}
          className="transition hover:text-green-800"
        >
          {product.categoryName}
        </Link>
        <span aria-hidden>/</span>
        <span className="font-semibold text-slate-800">{product.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-3">
          <div className="group relative">
            <ProductImage
              src={product.image}
              alt={product.imageAlt}
              category={product.category}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="aspect-[4/3] w-full rounded-3xl border border-slate-200"
            />
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-white/95 px-3 py-1.5 text-[11px] font-bold text-green-800 shadow-sm backdrop-blur-xs">
              <BadgeCheck className="size-4" />
              {product.badge}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: product.stock ? "In Stock" : "Out of Stock", icon: ShieldCheck },
              { label: "Cold Dispatch", icon: Truck },
              { label: "Gate Pass Signed", icon: MapPin },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[11px] font-semibold text-slate-600 shadow-2xs"
              >
                <item.icon className="size-4 shrink-0 text-green-700" />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10.5px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                {product.categoryName}
              </span>
              <span
                className={
                  product.stock
                    ? "inline-flex items-center gap-1.5 text-xs font-semibold text-green-700"
                    : "inline-flex items-center gap-1.5 text-xs font-semibold text-red-600"
                }
              >
                <span
                  className={
                    product.stock
                      ? "size-2 rounded-full bg-green-600"
                      : "size-2 rounded-full bg-red-500"
                  }
                />
                {product.stock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {product.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {product.rating ? (
                <span className="flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  {product.rating.toFixed(1)}
                  <span className="font-medium text-amber-700/70">
                    ({product.reviews} reviews)
                  </span>
                </span>
              ) : null}
              {product.market === "managed" ? null : (
                <Link
                  href={`/?market=${product.market}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-800"
                >
                  <MarketIcon className="size-3.5" />
                  {market.label} Marketplace
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50/60 p-5">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <span className="block text-[11px] font-semibold tracking-wide text-green-900/70 uppercase">
                  Market rate
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold tracking-tight text-green-800 tabular-nums">
                    {npr(product.price)}
                  </span>
                  <span className="text-sm font-medium text-green-900/60">
                    /{product.unit}
                  </span>
                </div>
              </div>
              <span className="rounded-full border border-green-300 bg-white/70 px-3 py-1 text-[11px] font-bold text-green-800">
                MOQ: {product.moq}
              </span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-green-900/60">
              Rate excludes 1.5% APMC market cess. Cold logistics and escrow
              guarantee included at checkout.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-700 text-sm font-bold text-white">
              {product.market === "farmer"
                ? (product.farmerName ?? "FD")
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                : product.market === "vendor"
                  ? (vendor?.initials ?? "VS")
                  : "BP"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-sm font-bold text-slate-900">
                {product.market === "vendor" && vendor ? (
                  <Link
                    href={`/vendors/${vendor.slug}`}
                    className="truncate transition hover:text-green-800"
                  >
                    {supplierName}
                  </Link>
                ) : (
                  <span className="truncate">{supplierName}</span>
                )}
                <BadgeCheck className="size-4 shrink-0 text-green-700" />
              </p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-500">
                <MapPin className="size-3 shrink-0" />
                {supplierLocation}
              </p>
            </div>
            <span className="hidden shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-800 sm:flex">
              {product.market === "farmer" ? (
                <Tractor className="size-3.5" />
              ) : (
                <Store className="size-3.5" />
              )}
              Verified
            </span>
          </div>

          <ProductActions product={product} marketLabel={market.label} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
            Commodity Notes
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {product.description}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="rounded-xl bg-slate-50 p-3 text-center"
              >
                <spec.icon className="mx-auto mb-1 size-4 text-green-700" />
                <span className="block text-[10px] font-medium text-slate-400">
                  {spec.label}
                </span>
                <span className="mt-0.5 block text-xs font-bold text-slate-800">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
            Escrow &amp; Dispatch Terms
          </h2>
          <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
            {[
              "Payment held in Belpatri Escrow until unloading signoff.",
              "APMC weighbridge slip and gate pass issued for every lot.",
              "Moisture and purity retested at the destination hub.",
              "Cold-chain logistics included for all verified lots.",
            ].map((term) => (
              <li key={term} className="flex items-start gap-2">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-green-700" />
                {term}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Related lots
          </h2>
          <Link
            href={`/?market=${product.market}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-green-700 transition hover:text-green-800"
          >
            <ArrowLeft className="size-3.5" />
            Back to {market.label}
          </Link>
        </div>
        <ProductGrid items={related} resetHref={`/?market=${product.market}`} />
      </section>
    </Container>
  );
}
