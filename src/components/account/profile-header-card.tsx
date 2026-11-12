"use client";

import {
  BadgeCheck,
  Check,
  ChevronRight,
  Plus,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";

export function ProfileHeaderCard({
  name,
  company,
  phone,
  traderId,
  licence,
  avatar,
  verified,
  onUpdateKyc,
  onLinkBusiness,
}: {
  name: string;
  company: string;
  phone: string;
  traderId: string;
  licence: string;
  avatar: string;
  verified: boolean;
  onUpdateKyc: () => void;
  onLinkBusiness: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="flex items-start gap-2.5 p-4">
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar}
            alt={name}
            className="size-12 rounded-[10px] border border-slate-200 object-cover"
          />
          {verified ? (
            <span className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-green-700 text-white ring-2 ring-white">
              <Check className="size-3" strokeWidth={3} />
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[17px] leading-tight font-bold text-slate-900">
            {name}
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">{phone}</p>
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-xs font-medium whitespace-nowrap",
              verified ? "text-green-700" : "text-amber-700",
            )}
          >
            <ShieldCheck className="size-3.5" />
            {verified ? "Active · KYB Verified" : "Verification pending"}
          </p>
          <p className="mt-1 text-xs leading-snug text-slate-400">
            {company} · #{traderId} · {licence}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold",
              verified
                ? "bg-green-700 text-white"
                : "bg-amber-100 text-amber-800",
            )}
          >
            {verified ? (
              <Check className="size-3" strokeWidth={3} />
            ) : (
              <BadgeCheck className="size-3" />
            )}
            {verified ? "Verified" : "Pending"}
          </span>
          <button
            type="button"
            onClick={onUpdateKyc}
            className="flex items-center gap-1 rounded-lg text-[11px] font-medium text-slate-500 transition hover:text-green-800"
          >
            {verified ? "Update KYC" : "Complete KYC"}
            <span className="flex size-[22px] items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <ChevronRight className="size-3.5" strokeWidth={2.4} />
            </span>
          </button>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <button
          type="button"
          onClick={onLinkBusiness}
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
        >
          <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-800 ring-1 ring-slate-200">
            <Plus className="size-4" strokeWidth={2.4} />
          </span>
          <span className="text-[13px] font-semibold tracking-[1px] text-slate-700 uppercase">
            Link business account
          </span>
          <ChevronRight
            className="ml-auto size-4 text-slate-400"
            strokeWidth={2}
          />
        </button>
      </div>
    </section>
  );
}
