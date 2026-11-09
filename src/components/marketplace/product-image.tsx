import Image from "next/image";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { categoryIcons } from "@/lib/icons";

export function ProductImage({
  src,
  alt,
  category,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px",
  priority = false,
}: {
  src?: string;
  alt: string;
  category: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const Fallback = categoryIcons[category] ?? ImageOff;

  return (
    <div className={cn("relative overflow-hidden bg-slate-100", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
          <Fallback className="size-10 text-green-700/40" strokeWidth={1.5} />
          <span className="sr-only">{alt}</span>
        </div>
      )}
    </div>
  );
}
