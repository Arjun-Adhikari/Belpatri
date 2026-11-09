export type MarketId = "managed" | "vendor" | "farmer";

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface Market {
  id: MarketId;
  label: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  gradient: string;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  initials: string;
  badge: string;
  rating: number;
  reviews: number;
  specializations: string[];
  location: string;
  leadTime: string;
  minOrder: string;
  avatarBg: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  code: string;
  market: MarketId;
  category: string;
  categoryName: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  moq: string;
  badge: string;
  stock: boolean;
  image?: string;
  imageAlt: string;
  harvest: string;
  moisture: string;
  shelf: string;
  origin: string;
  rating?: number;
  reviews?: number;
  vendorId?: string;
  vendorName?: string;
  farmerName?: string;
  village?: string;
}

export interface CartLine {
  productId: string;
  qty: number;
}

export interface Cart {
  market: MarketId;
  lines: CartLine[];
}

export type OrderStatus = "In Transit" | "Quality Check" | "Delivered";

export interface OrderTimelineStep {
  label: string;
  detail: string;
  done: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  market: MarketId;
  title: string;
  quantity: string;
  status: OrderStatus;
  escrow: number;
  partner: string;
  gatePass: string;
  quality: string;
  settlement: string;
  eta: string;
  vehicle: string;
  placedAt: string;
  timeline: OrderTimelineStep[];
}

export interface Account {
  name: string;
  company: string;
  traderId: string;
  license: string;
  tier: string;
  avatar: string;
  stats: { label: string; value: string }[];
}
