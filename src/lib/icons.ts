import {
  Apple,
  BadgeCheck,
  Building2,
  CreditCard,
  FileText,
  Flower2,
  Grid2x2,
  Headphones,
  Leaf,
  LifeBuoy,
  MapPin,
  Milk,
  Package,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingBasket,
  Sprout,
  Store,
  Tractor,
  Truck,
  User,
  Wheat,
  type LucideIcon,
} from "lucide-react";

export const categoryIcons: Record<string, LucideIcon> = {
  all: Grid2x2,
  grid: Grid2x2,
  grains: Wheat,
  wheat: Wheat,
  fruits: Apple,
  apple: Apple,
  spices: Flower2,
  flower: Flower2,
  greens: Leaf,
  leaf: Leaf,
  dairy: Milk,
  milk: Milk,
  oilseeds: Sprout,
  sprout: Sprout,
};

export const marketIcons: Record<string, LucideIcon> = {
  managed: ShieldCheck,
  vendor: Store,
  farmer: Tractor,
};

export const accountTiles: { label: string; description: string; icon: LucideIcon }[] = [
  { label: "Saved Addresses", description: "Delivery yards and hub pickups", icon: MapPin },
  { label: "Payment & Escrow", description: "Bank accounts, eSewa, Khalti and mandates", icon: CreditCard },
  { label: "Business Documents", description: "PAN, VAT and KYB", icon: FileText },
  { label: "Invite & Earn", description: "Bring a trader, earn trade credit", icon: User },
  { label: "Support Desk", description: "Talk to a trade desk executive", icon: Headphones },
  { label: "Settings", description: "Notifications, units and language", icon: Settings },
];

export const trustItems: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Escrow Protected",
    description: "Funds release only after unloading signoff.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Lots",
    description: "Moisture, purity and grade checked at source.",
    icon: BadgeCheck,
  },
  {
    title: "Cold Logistics",
    description: "Temperature-controlled dispatch across hubs.",
    icon: Truck,
  },
  {
    title: "Signed Gate Pass",
    description: "Every lot carries a Belpatri weighbridge record.",
    icon: Receipt,
  },
];

export const accountShortcuts = [
  { label: "Trade Orders", href: "/orders", icon: Package },
  { label: "Marketplace", href: "/", icon: ShoppingBasket },
  { label: "Vendor Stores", href: "/?market=vendor", icon: Building2 },
  { label: "Help & Support", href: "/account", icon: LifeBuoy },
];
