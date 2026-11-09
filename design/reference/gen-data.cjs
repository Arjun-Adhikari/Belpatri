const fs = require("fs");
const products = require("./commodities.json");
const vendors = require("./vendorsDirectory.json");

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const codes = {
  "m-1": "MP-9821",
  "m-2": "AP-3104",
  "m-3": "TN-4412",
  "m-4": "MH-7751",
  "v-m-3": "MP-5593",
  "f-1": "RJ-1298",
};

const imageFor = (p) => {
  const id = p.id;
  if (id === "m-1" || id === "v-m-3") return "/images/wheat.jpg";
  if (id === "m-2" || id === "v-m-1" || id === "v-d-2") return "/images/rice.jpg";
  if (id === "m-3" || id === "v-s-1" || id === "v-s-2" || id === "v-s-3") return "/images/turmeric.jpg";
  if (id === "m-4" || id === "v-s-4" || id === "f-2") return "/images/grapes.jpg";
  if (id === "v-m-2" || id === "v-k-1" || id === "v-k-2") return "/images/chickpeas.jpg";
  return undefined;
};

const vendorByPrefix = {
  "v-s": "v-sahyadri",
  "v-m": "v-mahaagri",
  "v-d": "v-deccan",
  "v-k": "v-konkan",
};

const vendorNames = {
  "v-sahyadri": "Sahyadri Spices & Dry Fruits Hub",
  "v-mahaagri": "Maha-Agri Grain Traders",
  "v-deccan": "Deccan Organic Cold Storage",
  "v-konkan": "Konkan Agro Produce Co-op",
};

const vendorRatings = {
  "v-sahyadri": [4.8, 142],
  "v-mahaagri": [4.9, 280],
  "v-deccan": [4.7, 95],
  "v-konkan": [4.9, 164],
};

const farmerRatings = {
  "f-1": [4.7, 38],
  "f-2": [4.8, 51],
  "f-3": [4.9, 27],
  "f-4": [4.8, 44],
};

const out = products.map((p, i) => {
  const vId = vendorByPrefix[p.id.slice(0, 3)];
  const rating = vId ? vendorRatings[vId] : farmerRatings[p.id];
  return {
    id: p.id,
    slug: slugify(p.title),
    code: codes[p.id] || `BPT-${2000 + i * 37}`,
    market: p.market,
    category: p.category,
    categoryName: p.categoryName,
    title: p.title,
    description: p.description,
    price: p.price,
    unit: p.unit,
    moq: p.moq,
    badge: p.badge,
    stock: p.stock,
    image: imageFor(p),
    imageAlt: p.imgAlt,
    harvest: p.harvest,
    moisture: p.moisture,
    shelf: p.shelf,
    origin: p.origin,
    rating: rating?.[0],
    reviews: rating?.[1],
    vendorId: vId,
    vendorName: vId ? vendorNames[vId] : undefined,
    farmerName: p.farmerName,
    village: p.village,
  };
});

const vendorOut = vendors.map((v) => ({
  id: v.id,
  slug: slugify(v.name),
  name: v.name,
  initials: v.avatar,
  badge: v.badge,
  rating: Number(v.rating),
  reviews: v.reviewsCount,
  specializations: v.specializations,
  location: v.location,
  leadTime: v.leadTime,
  minOrder: v.minOrder,
  avatarBg: v.avatarBg,
  description: `${v.name} is an APMC-registered merchant network specialising in ${v.specializations
    .join(", ")
    .toLowerCase()}. Lots are quality-checked, escrow protected and dispatched with a signed gate pass.`,
}));

const file = `import type { Account, Category, Market, Order, Product, Vendor } from "./types";

export const categories: Category[] = [
  { id: "all", label: "All Commodities", icon: "grid" },
  { id: "grains", label: "Grains & Pulses", icon: "wheat" },
  { id: "fruits", label: "Fresh Fruits", icon: "apple" },
  { id: "spices", label: "Spices & Herbs", icon: "flower" },
  { id: "greens", label: "Organic Greens", icon: "leaf" },
  { id: "dairy", label: "Dairy & Oils", icon: "milk" },
  { id: "oilseeds", label: "Oilseeds", icon: "sprout" },
];

export const markets: Market[] = [
  {
    id: "managed",
    label: "Managed",
    eyebrow: "Wholesale Mandi Hub",
    title: "Managed Direct Supply",
    subtitle:
      "Aggregated lots with verified quality certificate and zero individual middleman disputes.",
    description:
      "Belpatri aggregates certified lots from multiple APMC yards, runs moisture and purity checks, and holds every payment in escrow until unloading is signed off.",
    features: ["Escrow Protected", "24h Cold Dispatch"],
    gradient: "from-green-800 via-emerald-900 to-stone-900",
  },
  {
    id: "vendor",
    label: "Vendor Store",
    eyebrow: "Verified Vendor Stores",
    title: "Vendor Store Network",
    subtitle:
      "Shop directly from APMC-registered merchants and co-operatives with transparent storefronts.",
    description:
      "Each vendor store carries its own catalogue, minimum order value and dispatch lead time. Products from different vendors are never mixed in one cart.",
    features: ["APMC Registered", "Direct Storefronts"],
    gradient: "from-emerald-800 via-green-900 to-teal-950",
  },
  {
    id: "farmer",
    label: "Farmer Direct",
    eyebrow: "Farm-gate Trade",
    title: "Farmer Direct Exchange",
    subtitle:
      "Harvest lots directly negotiated at farm-gate with on-field moisture check and Belpatri weighbridge.",
    description:
      "Trade straight with verified growers. Every lot is weighed at the Belpatri weighbridge, graded on site, and paid out without brokerage.",
    features: ["Zero Brokerage", "Direct Farm-gate Pickup"],
    gradient: "from-green-800 via-emerald-900 to-stone-900",
  },
];

export const marketById = Object.fromEntries(markets.map((m) => [m.id, m])) as Record<
  Market["id"],
  Market
>;

export const vendors: Vendor[] = ${JSON.stringify(vendorOut, null, 2)};

export const products: Product[] = ${JSON.stringify(out, null, 2)};

export const productsByMarket = (market: string) =>
  products.filter((p) => p.market === market);

export const vendorById = Object.fromEntries(vendors.map((v) => [v.id, v])) as Record<
  string,
  Vendor
>;

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const orders: Order[] = [
  {
    id: "BPT-88219",
    market: "managed",
    title: "Standard Sharbati Wheat",
    quantity: "20 Quintals (Sehore Farm-Gate)",
    status: "In Transit",
    escrow: 64000,
    partner: "Ramesh Patel (FPO #419)",
    gatePass: "GP-SEH-90124",
    quality: "11.8% / Grade A+",
    settlement: "Sehore Krishi Upaj Mandi",
    eta: "Today, 6:30 PM",
    vehicle: "MH-15-DC-9210",
    placedAt: "Today, 09:15 AM",
    timeline: [
      { label: "Order Placed", detail: "Escrow secured", done: true },
      { label: "Weighbridge", detail: "Lot weighed and signed", done: true },
      { label: "Quality Check", detail: "Moisture 11.8%, Grade A+", done: true },
      { label: "In Transit", detail: "NH 48 · 42 km to hub", done: true, current: true },
      { label: "Warehouse Inward", detail: "Awaiting unloading signoff", done: false },
    ],
  },
  {
    id: "BPT-87902",
    market: "vendor",
    title: "Salem Curcumin Turmeric Fingers",
    quantity: "100 kg (Tamil Nadu Hub)",
    status: "Quality Check",
    escrow: 18000,
    partner: "Erode Spices Consortium",
    gatePass: "GP-ERD-44112",
    quality: "Curcumin 3.92% (Clear)",
    settlement: "Salem APMC Spice Yard",
    eta: "Tomorrow, 11:00 AM",
    vehicle: "TN-33-AC-4471",
    placedAt: "Yesterday, 4:40 PM",
    timeline: [
      { label: "Order Placed", detail: "Escrow secured", done: true },
      { label: "Vendor Packing", detail: "Vacuum food-grade jute", done: true },
      { label: "Quality Check", detail: "Lab certificate issued", done: true, current: true },
      { label: "In Transit", detail: "Awaiting dispatch", done: false },
      { label: "Delivered", detail: "Hub unloading", done: false },
    ],
  },
  {
    id: "BPT-86411",
    market: "farmer",
    title: "Organic Nashik Red Onions",
    quantity: "100 kg (Dindori Farm-Gate)",
    status: "Delivered",
    escrow: 0,
    partner: "Rameshwar Khot",
    gatePass: "GP-DIN-11890",
    quality: "Dry / NPOP Organic",
    settlement: "Dindori Gram Panchayat Mandi",
    eta: "Delivered 2 days ago",
    vehicle: "MH-15-BQ-2210",
    placedAt: "12 Nov, 08:20 AM",
    timeline: [
      { label: "Order Placed", detail: "Escrow secured", done: true },
      { label: "Farm Weighing", detail: "Belpatri weighbridge", done: true },
      { label: "In Transit", detail: "Delivered to Nashik hub", done: true },
      { label: "Delivered", detail: "Escrow released to farmer", done: true, current: true },
    ],
  },
];

export const account: Account = {
  name: "Rahul Verma",
  company: "Kisan Commercial Trade Pvt Ltd",
  traderId: "BPT-8821",
  license: "APMC Registered License",
  tier: "Tier 1 High-Volume Escrow",
  avatar: "/images/farmer.jpg",
  stats: [
    { label: "Active Trades", value: "2" },
    { label: "Completed", value: "14" },
    { label: "Escrow Held", value: "₹82,000" },
    { label: "Repeat Vendors", value: "6" },
  ],
};
`;

fs.writeFileSync("src/lib/data.ts", file);
console.log("wrote src/lib/data.ts", file.length, "bytes,", out.length, "products,", vendorOut.length, "vendors");
