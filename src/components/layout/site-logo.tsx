import Link from "next/link";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteLogo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-3", className)}
      aria-label="Belpatri home"
    >
      <span className="flex size-10 items-center justify-center rounded-2xl bg-green-700 text-white shadow-sm transition-colors group-hover:bg-green-800">
        <Leaf className="size-6" strokeWidth={2.2} />
      </span>
      <span className="flex flex-col">
        <span className="text-xl leading-none font-bold tracking-tight text-green-800">
          Belpatri
        </span>
        {!compact && (
          <span className="mt-1 hidden text-[11px] font-semibold tracking-[0.14em] text-slate-400 uppercase sm:block">
            Shopping, made simple.
          </span>
        )}
      </span>
    </Link>
  );
}
