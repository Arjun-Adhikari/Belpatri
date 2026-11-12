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
      <Container className="flex flex-col items-center justify-between gap-6 py-8 text-xs text-slate-500 md:flex-row">
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
