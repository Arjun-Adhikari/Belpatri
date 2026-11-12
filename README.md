# Belpatri

A pixel-faithful, **UI-first** recreation of the Belpatri agri-commercial marketplace. Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and shadcn/ui on Base UI.

> **Status: frontend prototype.** All content is mock data in `src/lib/data.ts`. There is no backend, database, authentication or payment integration yet — behaviour is intentionally limited to what you can see and click.

---

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Requirements: **Node.js 20.9+**, **pnpm 10** (`packageManager` is pinned in `package.json`).

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the dev server on port 3000 |
| `pnpm build` | Production build (38 routes) |
| `pnpm start` | Serve the production build |
| `pnpm exec tsc --noEmit` | Type-check the whole project |

There is no lint or test script configured yet; Biome is installed as a dev dependency for future formatting/linting.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.4.5 — App Router, Turbopack, Cache Components |
| UI runtime | React 19.3 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 via `@tailwindcss/turbopack`, CSS variables in `src/app/globals.css` |
| Components | shadcn/ui primitives built on Base UI (`@base-ui/react`) |
| Icons | Lucide (`lucide-react`) |
| Fonts | Inter + Noto Sans Devanagari fallback (for the `रू` glyph) |
| Extras | `sonner` (toasts), `zustand` (persisted cart store), `zod` (available, unused so far) |

---

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Marketplace home. `?market=managed \| vendor \| farmer`, plus `?category=` and `?q=` |
| `/products/[slug]` | Product detail — gallery, lot specs, escrow, related lots |
| `/vendors/[slug]` | Single vendor storefront with category-filtered catalogue |
| `/cart` | Three isolated carts (Managed / Vendor / Farmer) in tabs |
| `/checkout` | Two-step dispatch checkout with order summary |
| `/checkout/success` | Order confirmation pass |
| `/orders` | Trade orders, dispatches and market cess statements |
| `/orders/[id]` | Order timeline, live dispatch and gate pass |
| `/account` | Trader profile, escrow stats, profile tiles and login flow |
| `/vendors` | **Removed** — permanently redirects to `/?market=vendor` |

### Marketplace modes

- **Managed** — aggregated lots sold by Belpatri.
- **Vendor Store** — `/?market=vendor` lists **only vendors**. Clicking a store opens `/vendors/[slug]`, where that vendor's own categories and lots are shown. Vendor carts are locked to a single vendor.
- **Farmer Direct** — farm-gate lots sold by individual farmers.

Carts are never mixed across marketplaces or sellers.

---

## What's implemented

**Marketplace**
- Category pills, search, sorting, responsive product grid.
- Mobile layout: the market tabs stay in one horizontal row, and the Managed and Farmer Direct listings render two cards per row; Vendor Store rows stay full-width.
- 19 commodity lots across grains, fruits, spices, greens, dairy and oilseeds.
- 4 vendor storefronts with lead time, minimum order and licence details.
- Product pages with escrow callouts, "In Stock" / "Out of Stock" status and related lots.
- Vendor store category filtering is client-side (`VendorCatalogue`) and derives categories from the vendor's own lots.

**Cart, checkout and orders**
- Three isolated carts per marketplace, backed by a persisted Zustand store (`belpatri-cart-v1`) — quantities survive reloads.
- Server-safe hydration (`CartHydrator`): server HTML renders an empty cart, then localStorage is applied after mount.
- **Enforced in the store, not the UI:**
  - **Stock** — out-of-stock lots cannot be added; buy buttons render disabled.
  - **MOQ** — every lot has a numeric minimum (`moq` in its own `unit`); steppers clamp to it.
  - **Single seller** — vendor and farmer carts reject lots from a second seller, with a "Replace cart" toast action.
- Live cart badges in the desktop header and the mobile tab bar.
- Belpatri facilitation fee (1.5 %) and cold-logistics handling, `cartTotals()` helper.
- Checkout with delivery details, payment responsibility and shareable escrow link; placing an order clears that marketplace's cart.
- Order list with filters, dispatch progress and order detail timeline.

**Account**
- Trader profile, trade credit, escrow holdings, 30-day volume.
- Profile tiles for KYB, licence, bank, warehouses, alerts and arbitration.
- **Login flow (UI only):** Login → Customer or Business → *(Business)* Vendor / Farmer / both → mock Google verification → details form → success.

**Navigation & layout**
- Sticky desktop header with search, orders, cart and account.
- Mobile top bar (menu sheet, logo, avatar) with a fixed 4-tab bottom bar: Home, Cart, Orders, Account.
- Full-width container layout, consistent card and radius language across pages.

---

## Not implemented (by design)

- Real authentication — the Google step is a simulated 700 ms delay, and the form does not submit anywhere.
- Server-side persistence — carts live in `localStorage`; login state and contact details reset on reload.
- Search backend, filtering by price/sort beyond the UI control, product reviews.
- Payments, escrow, invoices, notifications.
- Order badge counts are derived from mock orders, not a live API.

---

## Project structure

```
src/
  app/                     # App Router routes
    page.tsx               # marketplace home (reads searchParams)
    products/[slug]/
    vendors/[slug]/
    cart/
    checkout/{page.tsx,success/}
    orders/{page.tsx,[id]/}
    account/
    layout.tsx             # fonts, header, footer, mobile tab bar
    globals.css            # theme tokens
  components/
    account/               # login flow dialog
    layout/                # header, mobile tab bar, footer, container, logo
    marketplace/           # hero, tabs, cards, grids, filters, checkout, orders
    ui/                    # shadcn/ui primitives (Base UI)
  lib/
    cart-store.ts          # Zustand + localStorage carts, stock/MOQ/seller guards
    data.ts                # mock products, vendors, markets, orders, account
    format.ts              # NPR currency + cart totals
    icons.ts               # Lucide icon maps
    types.ts               # domain types
    utils.ts               # cn()
public/images/             # lot photography
design/reference/          # original Stitch HTML exports + QA scripts (not shipped)
```

---

## Conventions

**Currency.** Everything is in Nepali Rupees, rendered as `रू 3,200` via `npr()` / `nprPrecise()` in `src/lib/format.ts`. Digit grouping uses `en-IN` so values read `1,85,400`; the amounts themselves were not converted from another currency.

**Market.** The catalogue is Nepal-based: PAN/VAT instead of GSTIN, trade licences instead of APMC, `+977` numbers, Bagmati/Koshi/Gandaki locations, and eSewa/Khalti alongside bank transfer. The 1.5 % line item is labelled *Belpatri facilitation fee*.

**Stock labels.** Always `In Stock` / `Out of Stock` — no yard or committee names inside stock wording.

**Breakpoints.** Mobile-first below `md`; the desktop header and bottom tab bar switch at `md` (768 px).

**Cache Components.** Pages that read `searchParams` (`/`, `/checkout`, `/checkout/success`) must export `export const instant = false`.

**Base UI notes.**
- `cn` is imported from `"cn"` inside `src/components/ui/*`.
- `Button` needs `nativeButton={false}` when rendered as a link via `render`.
- `TabsList` ships a horizontal `h-8`; use `h-auto!` to override it (see the cart page).

---

## Design reference & QA helpers

`design/reference/` contains the original Stitch desktop/mobile HTML exports used as the visual source of truth, plus small CDP scripts for reviewing the running app:

| Script | Use |
| --- | --- |
| `shot.cjs <url> <out> <width> <height> [full]` | Screenshot any route at an exact viewport (including true 390 px mobile) |
| `flow-shot.cjs <url> <outDir> <width> <height> [customer\|business]` | Drives the account login flow and captures each step |
| `overflow-audit.cjs` | Checks routes at 390/768/1024/1440 for horizontal overflow |

These scripts require Chrome running with `--remote-debugging-port=9222`. The folder is for development only and is not imported by the app.

---

## Next steps

1. Wire the login flow and profile to a real auth provider.
2. Move cart and order state to API routes and a database (carts are client-side only today).
3. Connect the marketplace to a product/vendor API instead of `src/lib/data.ts`.
4. Replace mock orders and notifications with live data.
