"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf } from "lucide-react";

import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const footerLinks = [
  { href: "/", label: "Quality Standards" },
  { href: "/", label: "Escrow Assurance" },
  { href: "/", label: "Terms of Trade" },
  { href: "/", label: "Privacy Policy" },
];

export function SiteFooter() {
  const pathname = usePathname();

  return (
    <footer
      className={cn(
        "mt-12 border-t border-slate-200 bg-white pb-24 md:pb-8",
        pathname === "/account" && "hidden md:block",
      )}
    >
      <div className="md:hidden">
        <Container className="pt-7">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-green-700 text-white shadow-xs">
              <Leaf className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-base leading-tight font-bold text-slate-900">
                Belpatri
              </p>
              <p className="mt-0.5 text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
                Shopping, made simple
              </p>
            </div>
          </div>

          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-slate-500">
            Verified lots, escrow-protected payments and cold-chain dispatch
            across Nepal.
          </p>

          <nav
            aria-label="Footer"
            className="mt-5 grid grid-cols-2 gap-x-4 border-t border-slate-100 pt-2"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex min-h-10 items-center gap-2 py-2 text-[13px] font-medium text-slate-600 transition-colors active:text-green-700"
              >
                <span className="size-1 shrink-0 rounded-full bg-green-600" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 border-t border-slate-100 pt-4 pb-1">
            <p className="text-xs leading-relaxed text-slate-400">
              © 2026 Belpatri Agri-Commercial Technologies Inc.
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Kathmandu, Nepal · All rights reserved
            </p>
          </div>
        </Container>
      </div>

      <Container className="hidden md:flex flex-row items-center justify-between gap-6 py-8 text-[13px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-xl bg-green-700 text-white">
            <Leaf className="size-[18px]" />
          </span>
          <span className="text-sm font-bold text-slate-800">Belpatri</span>
          <span>• © 2026 Belpatri Agri-Commercial Technologies Inc.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-green-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
