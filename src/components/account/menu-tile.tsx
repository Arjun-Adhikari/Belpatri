"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import type { MenuItem } from "@/components/account/menu-items";
import { cn } from "@/lib/utils";

function MenuIcon({
  icon: Icon,
  accent: Accent,
}: {
  icon: LucideIcon;
  accent?: LucideIcon;
}) {
  return (
    <span className="relative flex size-8 shrink-0 items-center justify-center text-slate-500">
      <Icon className="size-8" strokeWidth={1.5} />
      {Accent ? (
        <span className="absolute -right-1.5 -bottom-1.5 flex size-4 items-center justify-center rounded-full bg-white text-green-700 ring-1 ring-slate-200">
          <Accent className="size-3" strokeWidth={2.2} />
        </span>
      ) : null}
    </span>
  );
}

const rowClasses =
  "flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-2xs transition-colors";

export function MenuTile({
  item,
  onTap,
  toggle,
  trailing,
}: {
  item: MenuItem;
  onTap?: () => void;
  toggle?: { checked: boolean; onChange: (next: boolean) => void };
  trailing?: React.ReactNode;
}) {
  const body = (
    <>
      <MenuIcon icon={item.icon} accent={item.accent} />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] leading-tight font-medium text-slate-900">
          {item.title}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-slate-500">
          {item.subtitle}
        </span>
      </span>
    </>
  );

  if (toggle) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={toggle.checked}
        aria-label={item.title}
        onClick={() => toggle.onChange(!toggle.checked)}
        className={cn(rowClasses, "hover:border-green-300")}
      >
        {body}
        <span
          aria-hidden
          className={cn(
            "relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
            toggle.checked ? "bg-green-700" : "bg-slate-300",
          )}
        >
          <span
            className={cn(
              "absolute size-5 rounded-full bg-white shadow-sm transition-transform",
              toggle.checked ? "translate-x-5" : "translate-x-0.5",
            )}
          />
        </span>
      </button>
    );
  }

  if (trailing) {
    return (
      <div className={cn(rowClasses, "items-center")}>
        {body}
        <div className="shrink-0">{trailing}</div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onTap}
      className={cn(rowClasses, "hover:border-green-300")}
    >
      {body}
      <ChevronRight className="size-5 shrink-0 text-slate-400" strokeWidth={1.8} />
    </button>
  );
}

export function LogoutTile({ onTap }: { onTap?: () => void }) {
  return (
    <button
      type="button"
      onClick={onTap}
      className={cn(rowClasses, "hover:border-red-200")}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] leading-tight font-medium text-slate-900">
          Logout
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-slate-500">
          Log out from Belpatri account
        </span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-slate-400" strokeWidth={1.8} />
    </button>
  );
}
