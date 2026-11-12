import { BadgeCheck, Clock3, Tractor } from "lucide-react";

import { marketById } from "@/lib/data";
import { marketIcons } from "@/lib/icons";
import type { MarketId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MarketHero({ market }: { market: MarketId }) {
  const data = marketById[market];
  const Icon = marketIcons[market] ?? Tractor;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br p-7 text-white shadow-md transition-all duration-300 sm:p-9",
        data.gradient,
      )}
    >
      <div className="absolute -right-6 -bottom-8 text-white opacity-15 select-none">
        <Icon className="size-56 sm:size-72" strokeWidth={1.2} />
      </div>

      <div className="relative z-10 max-w-2xl space-y-3.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-bold tracking-[0.14em] uppercase backdrop-blur-md">
          {data.eyebrow}
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {data.title}
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-green-100/90 sm:text-base">
          {data.subtitle}
        </p>
        <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
          {data.features.map((feature, index) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold text-white backdrop-blur-md"
            >
              {index === 0 ? (
                <BadgeCheck className="size-4 text-green-200" />
              ) : (
                <Clock3 className="size-4 text-green-200" />
              )}
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
